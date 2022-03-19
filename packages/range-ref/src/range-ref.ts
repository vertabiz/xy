import * as xy from '@vertabiz/xy'
import { Point } from '@vertabiz/xy'
import * as a1 from './a1'

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
  return a1.isRect(rangeRef)
}

/**
 * NOTE: This will need to take into account refs with Targets that might
 * include ":" characters at some point.
 */
function isPointRange(rangeRef: RangeRef): boolean {
  return !isRectRange(rangeRef)
}

/**
 * I'm intentionally making it a bit more difficult to work with pure numbers
 * in this module because it's a different numbering system (one-based) for most
 * operations and it's easy to start messing things up.
 */
export class SeqNumber {
  value: number
  system: 'ONE-BASED' | 'ZERO-BASED'

  constructor(value: number, system: 'ONE-BASED' | 'ZERO-BASED' = 'ONE-BASED') {
    this.value = value
    this.system = system
  }

  get oneBasedValue(): number {
    return this.system === 'ONE-BASED'
      ? this.value
      : this.value + 1
  }

  get zeroBasedValue(): number {
    return this.system === 'ZERO-BASED'
      ? this.value
      : this.value - 1
  }

  static fromZeroBased(value: number): SeqNumber {
    return new SeqNumber(value + 1, 'ONE-BASED')
  }

  static fromOneBased(value: number): SeqNumber {
    return new SeqNumber(value, 'ONE-BASED')
  }

  static from(value: number): SeqNumber {
    return SeqNumber.fromZeroBased(value)
  }
}

export function asRect(ref: RangeRef): xy.Rect {
  const parsed = parse(ref)

  if (parsed == null) throw new Error(`Invalid ref: ${ref}`)

  if (xy.isRect(parsed)) {
    return parsed
  } else {
    return xy.newRect( parsed, xy.newSize(1, 1) )
  }
}

export function bottomRow(ref: RangeRef): SeqNumber {
  return SeqNumber.from( xy.farPointOf(asRect(ref)).y )
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
    return a1.toA1(value)
  } else {
    const firstCell = a1.toA1(value.origin)
    const lastCell = a1.toA1(xy.farPointOf(value))

    return [ firstCell, lastCell ].join(':')
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

export function splitRows(rangeRef: RangeRef, { after }: { after: SeqNumber }): [ RangeRef | null, RangeRef | null ] {
  const rect = asRect(rangeRef)
  if (rect == null)
    return [null, null]

  const [rectOne, rectTwo] = xy.splitRectAfterY(rect, after.zeroBasedValue)

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

  if (isRectRange(rangeRef)) {
    return a1.parseA1(rangeRef)
  } else {
    return a1.parseA1Cell(rangeRef)
  }
}

export function iterateCells(rangeRef: RangeRef, fn: (cellRef: CellRef) => void) {
  const rect = asRect(rangeRef)
  if (rect == null) return

  xy.iteratePoints(rect, (point) => {
    fn(from(point))
  })
}