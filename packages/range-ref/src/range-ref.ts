import A1 from '@flighter/a1-notation'
import * as xy from '@vertabiz/xy'
import { Point } from '@vertabiz/xy'

// The distinction here is entirely for documentation purposes, as it
// serves no type-checking function.
//
export type CellRef  = string   // eg. 'A1'
export type RangeRef = string   // eg. 'A1:B2'

/**
 * NOTE: This will need to take into account refs with Targets that might
 * include ":" characters at some point.
 */
function isRectRange(rangeRef: RangeRef): boolean {
  return rangeRef.includes(':')
}

/**
 * NOTE: This will need to take into account refs with Targets that might
 * include ":" characters at some point.
 */
function isPointRange(rangeRef: RangeRef): boolean {
  return !isRectRange(rangeRef)
}

/**
 * Justification:
 * I know this seems excessive, like coding just for coding's sake. But
 * I will quickly get lost in the reasons for "+ 1"'s and "- 1"'s later in
 * the code, so this is mostly to document the REASON for these otherwise
 * simple code stanzas.
 */
 function toOneBased(index: number): number {
  return index + 1
}

export function asRect(ref: RangeRef | null): xy.Rect | null {
  const parsed = parse(ref)

  if (parsed == null) return null

  if (xy.isRect(parsed)) {
    return parsed
  } else {
    return xy.newRect( parsed, xy.newSize(1, 1) )
  }
}

export function originOf(ref: RangeRef | null): xy.Point | null {
  const parsed = parse(ref)

  if (parsed == null) return null

  if (xy.isPoint(parsed)) {
    return parsed
  } else {
    return parsed.origin
  }
}

/**
 * Returns an A1-notation string from a Point or Rect.
 *
 * ```ts
 * from(newPoint(4, 3))   // => 'E4'
 * ```
 */
export function from(point: xy.Point): CellRef
export function from(rect: xy.Rect): RangeRef
export function from(value: xy.Point | xy.Rect | null): CellRef | RangeRef | null {
  if (value == null) return null

  if (xy.isPoint(value)) {
    return new A1(
      toOneBased(value.x),
      toOneBased(value.y),
    ).toString()
  } else {
    return new A1(
      toOneBased(value.origin.x),
      toOneBased(value.origin.y),
      // Yes, the AXIS arguments are reversed in the constructor.
      value.size.h,
      value.size.w,
    ).toString()
  }
}

export function shift(ref: RangeRef, { by }: { by: Point }): RangeRef {
  const origin = originOf(ref)
  const rect   = asRect(ref)

  if (origin == null)
    throw new Error(`Unexpected null origin in shift: ${ref}`)
  if (rect == null)
    throw new Error(`Unexpected null rect in shift: ${ref}`)

  if (isPointRange(ref)) {
    return from( xy.shiftPoint(origin, { by }) )
  } else {
    return from( xy.shiftRect(rect, { by }) )
  }
}

export function splitRows(rangeRef: RangeRef | null, rowIndex: number): [ RangeRef | null, RangeRef | null ] {
  const rect = asRect(rangeRef)
  if (rect == null)
    return [null, null]

  const [rectOne, rectTwo] = xy.splitRectAfterY(rect, rect.origin.y + rowIndex - 1)

  return [
    rectOne ? from(rectOne) : null,
    rectTwo ? from(rectTwo) : null,
  ]
}

/**
 * Returns a Point or Rect based on an A1-notation string.
 *
 * ```ts
 * parse('A1')      // => newPoint(0, 0)
 * parse('A1:A1')   // => newRect( newPoint(0, 0), newSize(1, 1) )
 * ```
 */
export function parse(rangeRef: RangeRef | null): xy.Point | xy.Rect | null {
  if (rangeRef == null) return null

  const a1 = new A1(rangeRef)
  const origin = xy.newPoint(a1.getCol() - 1, a1.getRow() - 1)
  const size   = xy.newSize(a1.getWidth(), a1.getHeight())

  return isRectRange(rangeRef)
    ? xy.newRect(origin, size)
    : origin
}
