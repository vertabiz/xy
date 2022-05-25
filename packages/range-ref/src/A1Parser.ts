import * as xy from '@vertabiz/xy'
import { Point, Rect, Size } from '@vertabiz/xy'

export function isRect(range: string): boolean {
  return range.includes(':')
}

/**
 * Used from https://www.labnol.org/convert-column-a1-notation-210601
 *
 * `bounds` provides values for partial range resolutions. For example,
 * `parseA1('1:2')` doesn't mean much, but `parseA1('1:1', { bounds: 'A1:Z100' })`
 * can be resolved to the `Rect` equivalent of `A1:Z1`.
 */
export function parseA1(range: string, opts?: { bounds?: string }): xy.Rect | null {
  const [ startCell, endCell ] = range.split(':')

  const bounds = opts?.bounds ?? null
  const [ startBound, endBound ] = bounds ? bounds.split(':') : [null, null]

  const origin = parseA1Cell(startCell, { anchor: startBound ?? undefined })
  if (origin == null)
    return null

  if (endCell == undefined)
    return new Rect(origin, new Size(1, 1))

  const farPoint = parseA1Cell(endCell, { anchor: endBound ?? startCell })
  if (farPoint == null)
    return new Rect(origin, new Size(1, 1))

  return new Rect(origin, new Size(farPoint.x - origin.x + 1, farPoint.y - origin.y + 1))
}

const TOTAL_ALPHABETS = 'Z'.charCodeAt(0) - 'A'.charCodeAt(0) + 1
export function toA1Column(colNumber: number): string {
  const a1Notation = [] as string[]
  let block = colNumber
  while (block >= 0) {
    a1Notation.unshift(String.fromCharCode((block % TOTAL_ALPHABETS) + 'A'.charCodeAt(0)))
    block = Math.floor(block / TOTAL_ALPHABETS) - 1
  }
  return a1Notation.join('')
}

export function toA1(point: xy.Point): string {
  return [ toA1Column(point.x), `${point.y + 1}` ].join('')
}

/**
 *
 * @param {string} cell -  The cell address in A1 notation
 * @returns {object} The row number and column number of the cell (0-based)
 *
 * @example
 *
 *   fromA1Notation("A2") returns {row: 1, column: 3}
 *
 */
export function parseA1Cell(cell: string, opts?: { anchor?: string }): xy.Point | null {
  const firstMatch = cell.toUpperCase().match(/([A-Z]*)([0-9]*)/)
  if (firstMatch == null) return null

  const anchorPoint = opts?.anchor ? parseA1Cell(opts?.anchor) : null

  let columnName: string | null = firstMatch[1] ?? null
  let row: string | null = firstMatch[2] ?? null

  const characters = 'Z'.charCodeAt(0) - 'A'.charCodeAt(0) + 1


  let columnNum = 0
  if (columnName) {
    columnName.split('').forEach((char) => {
      columnNum *= characters
      columnNum += char.charCodeAt(0) - 'A'.charCodeAt(0) + 1
    })
  } else if (anchorPoint) {
    columnNum = anchorPoint.x + 1
  }

  let rowNum = row
    ? Number(row)
    : (anchorPoint?.y ?? -1) + 1

  return new Point(columnNum - 1, rowNum - 1)
}