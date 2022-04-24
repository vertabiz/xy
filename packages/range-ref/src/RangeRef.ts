import * as xy from '@vertabiz/xy'
import { farPointOf, newPoint, Point } from '@vertabiz/xy'
import * as a1 from './A1'
import { must } from './util'

export type CellRef = string
export type RangeRef = string

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

export class Range {
  private ns: string | null = null
  private address: string

  constructor({ value }: {
    value: string
  }) {
    const parts = value.split('!')

    this.address = must(parts.pop())
    this.ns = parts.pop() ?? null
  }

  hasNamespace(): boolean {
    return this.ns !== null
  }

  getNamespace(): string | null {
    return this.ns
  }

  private parsedValue(opts?: { bounds?: string }): xy.Rect | xy.Point | null {
    return parse(this.address, { bounds: opts?.bounds ?? undefined })
  }

  copy(): Range {
    return new Range({ value: this.asAddress() })
  }

  expandBy({ rows, cols }: { rows: number; cols: number }): Range {
    const rect = this.asRect()
    const farPoint = xy.farPointOf(rect)

    return Range.fromXY(
      must(xy.rectForPoints([
        rect.origin,
        newPoint(farPoint.x + (rows ?? 0), farPoint.y + (cols ?? 0)),
      ])),
      { ns: this.ns },
    )
  }

  rowNames(): string[] {
    const rowNames = [] as string[]
    const rect = this.asRect()

    for (let i = rect.origin.y; i <= xy.farPointOf(rect).y; i++) {
      rowNames.push(String(i + 1))
    }

    return rowNames
  }

  colNames(): string[] {
    const colNames = [] as string[]
    const rect = this.asRect()

    for (let i = rect.origin.x; i <= xy.farPointOf(rect).x; i++) {
      colNames.push(a1.toA1Column(i))
    }

    return colNames
  }

  withBounds(bounds: string): Range {
    const parsed = parse(this.address, { bounds })
    if (parsed === null) throw new Error(`Invalid bounds`)

    return Range.fromXY(parsed, { ns: this.ns })
  }

  asRect(opts?: { bounds?: string }): xy.Rect {
    const parsed = this.parsedValue({ bounds: opts?.bounds })
    if (parsed == null)
      throw new Error(`Invalid ref: ${this.toString()}`)

    if (xy.isRect(parsed)) {
      return parsed
    } else {
      return xy.newRect( parsed, xy.newSize(1, 1) )
    }
  }

  asAddress(): string {
    const result = [this.address]

    if (this.ns !== null)
      result.unshift(this.ns)

    return result.join('!')
  }

  bottomRow(): SeqNumber {
    return SeqNumber.from( xy.farPointOf(this.asRect()).y )
  }

  get origin(): xy.Point {
    const parsed = this.parsedValue()
    if (parsed == null)
      throw new Error(`Invalid origin point`)

    if (xy.isPoint(parsed)) {
      return parsed
    } else {
      return parsed.origin
    }
  }

  // shiftTo(to: CellRef): Range {
  //   const origin    = must(originOf(ref))
  //   const destPoint = must(originOf(to))
  //   const moveBy    = xy.subtractPoint(destPoint, origin)

  //   if(isPointRange(ref)) {
  //     return from(xy.shiftPoint( origin, { by: moveBy }))
  //   } else {
  //     return from(xy.shiftRect( must(asRect(ref)), { by: moveBy } ))
  //   }
  // }

  shift({ by }: { by: Point }): Range {
    const rect   = this.asRect()

    if (this.origin == null)
      throw new Error(`Unexpected null origin in shift: ${this.toString()}`)
    if (rect == null)
      throw new Error(`Unexpected null rect in shift: ${this.toString()}`)

    if (isPointRange(this.address)) {
      return Range.fromXY( xy.shiftPoint(this.origin, { by }), { ns: this.ns } )
    } else {
      return Range.fromXY( xy.shiftRect(rect, { by }), { ns: this.ns } )
    }
  }

  splitByRow({ after }: { after: SeqNumber }): [ Range | null, Range | null ] {
    const rect = this.asRect()
    if (rect == null)
      return [null, null]

    const [rectOne, rectTwo] = xy.splitRectAfterY(rect, after.zeroBasedValue)

    return [
      rectOne ? Range.fromXY(rectOne, { ns: this.ns }) : null,
      rectTwo ? Range.fromXY(rectTwo, { ns: this.ns }) : null,
    ]
  }

  /// Iterators ///

  iterateCells(fn: (cellRef: CellRef) => void) {
    const rect = this.asRect()
    if (rect == null) return

    xy.iteratePoints(rect, (point) => {
      fn(a1.toA1(point))
    })
  }

  /**
   * Returns an A1-notation string from a Point or Rect.
   *
   * ```ts
   * from(newPoint(4, 3))   // => 'E4'
   * ```
   */
  static fromXY(value: xy.Point | xy.Rect, opts?: { ns?: string | null }): Range {
    if (xy.isPoint(value)) {
      return new Range({ value: buildAddress(opts?.ns ?? null, a1.toA1(value), null) })
    } else {
      const firstCell = a1.toA1(value.origin)
      const lastCell = a1.toA1(xy.farPointOf(value))

      return new Range({ value: buildAddress(opts?.ns ?? null, firstCell, lastCell) })
    }
  }

  static fromAddress(ref: RangeRef): Range {
    return new Range({ value: ref })
  }

}

export default Range

export function buildAddress(
  ns: string | null,
  origin: string,
  farPoint: string | null,
): string {
  const result = [origin]

  if (ns) {
    result.unshift('!')
    result.unshift(ns)
  }

  if (farPoint) {
    result.push(':')
    result.push(farPoint)
  }

  return result.join('')
}

/**
 * Returns a Point or Rect based on an A1-notation string.
 *
 * ```ts
 * parse('A1')      // => newPoint(0, 0)
 * parse('A1:A1')   // => newRect( newPoint(0, 0), newSize(1, 1) )
 * ```
 */
export function parse(rangeRef: RangeRef | null, opts?: { bounds?: RangeRef }): xy.Point | xy.Rect | null {
  if (rangeRef == null) return null

  if (isRectRange(rangeRef)) {
    return a1.parseA1(rangeRef, opts)
  } else {
    return a1.parseA1Cell(rangeRef)
  }
}