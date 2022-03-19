import * as ref from '@vertabiz/range-ref'
import * as cm from '@vertabiz/cell-map'
import { GridRow } from './rows'
import { newPoint, newRect, newSize } from '@vertabiz/xy'
import { CellRef, RangeRef } from '@vertabiz/range-ref'
import { CellData } from '@vertabiz/cell-data'

export type GridRegion = {
  range: ref.RangeRef
  rows: GridRow[]
}

export function regionFrom(rows: GridRow[], originRef: CellRef = 'A1'): GridRegion {
  const rowCount = rows.length
  const columnCount = Math.max(...rows.map(_ => _.length))
  const originPoint = ref.originOf(originRef)
  if (originPoint == null)
    throw new Error(`Could not parse 'originRef'`)

  return {
    range: ref.from(newRect( originPoint, newSize(columnCount, rowCount) )),
    rows,
  }
}

export function cellMapFromRegion(region: GridRegion): cm.CellMap {
  const map = cm.newCellMap()

  const originPoint = ref.originOf(region.range)
  if (originPoint == null) return map

  const origin = ref.from(originPoint)

  const regionValues: Record<RangeRef, cm.cell.CellData> = {}

  for (let rowIdx = 0; rowIdx < region.rows.length; rowIdx++) {
    const row = region.rows[rowIdx]
    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const cell = row[colIdx]

      if (cell !== undefined)
        regionValues[ref.shift(origin, { by: newPoint(colIdx, rowIdx) })] = cell
    }
  }

  cm.insertCells(map, cm.newCellMap(regionValues))

  return map
}