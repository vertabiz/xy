import * as cell from '@vertabiz/cell-data'
import * as xy from '@vertabiz/xy'

export type CellRow = (cell.CellData | undefined)[]

export function sizeOf(rows: CellRow[]): xy.Size {
  return xy.newSize(
    Math.max(...rows.map(_ => _.length)),
    rows.length,
  )
}

export function cellRowFrom(values: unknown[]): CellRow {
  return values.map(_ => _ === undefined ? undefined : cell.from(_))
}
