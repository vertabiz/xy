import * as cm from '@vertabiz/cell-map'
import { CellMap } from '@vertabiz/cell-map'
import * as ref from '@vertabiz/range-ref'
import { CellRef, Range, RangeRef } from '@vertabiz/range-ref'
import * as xy from '@vertabiz/xy'
import { Point } from '@vertabiz/xy'
import { CellRow } from './CellRow'

export type GridRegion = {
  range: ref.RangeRef
  rows: CellRow[]
}

export class Region {
  private _range: Range
  private _map: CellMap

  constructor({ range, map }: {
    range: Range
    map?: CellMap
  }) {
    this._range = range

    this._map = new Map(map?.entries() ?? [])
  }

  get range() {
    return this._range.copy()
  }

  cells(): IterableIterator<[string, cm.cell.CellData | undefined]> {
    return this._map.entries()
  }

  getCellData(addr: string): cm.cell.CellData | undefined {
    return this._map.get(addr) ?? undefined
  }

  asCellMap(): cm.CellMap {
    return new Map(this._map.entries())
  }

  toRows(): CellRow[] {
    const colNames = this._range.colNames()
    return this._range.rowNames().map(rowName =>
      colNames.map(colName => {
        const addr = `${colName}${rowName}`
        return this.getCellData(addr)
      })
    )
  }

  static fromRows(rows: CellRow[], range?: Range): Region {
    const rowCount = rows.length
    const columnCount = Math.max(...rows.map(_ => _.length))

    const values: CellMap = new Map()

    const rowRange = range ?? Range.fromAddress('A1').expandBy({ rows: rowCount - 1, cols: columnCount - 1 })

    const originPt = rowRange.origin

    rows.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        values.set(
          Range.fromXY(xy.shiftPoint(originPt, { by: xy.newPoint(colIdx, rowIdx) })).asAddress(),
          cell,
        )
      })
    })

    return new Region({
      range: rowRange,
      map: values,
    })
  }
}

export default Region

