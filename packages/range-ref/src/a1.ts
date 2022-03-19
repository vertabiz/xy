import * as xy from '@vertabiz/xy'

export function isRect(range: string): boolean {
  return range.includes(':')
}

/**
 * Used from https://www.labnol.org/convert-column-a1-notation-210601
 */
export function parseA1(range: string): xy.Rect | null {
  const [ startCell, endCell ] = range.split(':')

  const origin = parseA1Cell(startCell)
  if (origin == null)
    return null

  if (endCell == undefined)
    return xy.newRect(origin, xy.newSize(1, 1))

  const farPoint = parseA1Cell(endCell)
  if (farPoint == null)
    return xy.newRect(origin, xy.newSize(1, 1))

  return xy.newRect(origin, xy.newSize(farPoint.x - origin.x + 1, farPoint.y - origin.y + 1))
}

export function toA1(point: xy.Point): string {
  const a1Notation = [`${point.y + 1}`]
  const totalAlphabets = 'Z'.charCodeAt(0) - 'A'.charCodeAt(0) + 1
  let block = point.x
  while (block >= 0) {
    a1Notation.unshift(String.fromCharCode((block % totalAlphabets) + 'A'.charCodeAt(0)))
    block = Math.floor(block / totalAlphabets) - 1
  }
  return a1Notation.join('')
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
export function parseA1Cell(cell: string): xy.Point | null {
  const firstMatch = cell.toUpperCase().match(/([A-Z]+)([0-9]+)/)
  if (firstMatch == null) return null

  const [ _, columnName, row ] = firstMatch
  const characters = 'Z'.charCodeAt(0) - 'A'.charCodeAt(0) + 1

  let column = 0
  columnName.split('').forEach((char) => {
    column *= characters
    column += char.charCodeAt(0) - 'A'.charCodeAt(0) + 1
  })

  return xy.newPoint(column - 1, Number(row) - 1)
}