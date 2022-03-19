import * as cell from '@vertabiz/cell-data'

export type GridRow = (cell.CellData | undefined)[]

export function rowFrom(values: unknown[]): GridRow {
  return values.map(cell.from)
}
