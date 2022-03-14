import * as ref from '@vertabiz/range-ref'
import * as cm from '@vertabiz/cell-map'
import { Row } from '.'
import { newPoint } from '../../cell-map/node_modules/@vertabiz/xy/build'
import { RangeRef } from '@vertabiz/range-ref'

export type Region = {
  range: ref.RangeRef
  rows: Row[]
}

export function cellMapFromRegion(region: Region): cm.CellMap<cm.cell.CellData> {
  const map = cm.newCellMap<cm.cell.CellData>()

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