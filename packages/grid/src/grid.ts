import * as ref from '@vertabiz/range-ref'
import * as cm from '@vertabiz/cell-map'
import * as xy from '@vertabiz/xy'
import { newCellMap } from '@vertabiz/cell-map'
import { cellMapFromRegion, GridRegion } from './region'
import { GridRecord } from '.'
import { GridRow } from './rows'
import { RangeRef } from '@vertabiz/range-ref'
import { CellData } from '@vertabiz/cell-data'

export class Grid {
  currentCells = newCellMap()

  constructor({ regions }: {
    regions?: GridRegion[]
  } = {}) {
    for (const region of (regions ?? [])) {
      cm.insertCells(this.currentCells, cellMapFromRegion(region))
    }
  }

  knownRange(): ref.RangeRef | null {
    if (this.currentCells.size < 1)
      return null       // we can't know anything.

    const cellRect = cm.rectFor(this.currentCells)
    if (cellRect === null)
      return null       // we probably SHOULD know something, but don't seem to.

    return ref.from(cellRect)
  }

  getCellsByRange(rangeRef: RangeRef): GridRow[] {
    const rect = ref.asRect(rangeRef)
    if (rect == null)
      throw new Error('Invalid range')

    const cells = xy.newMatrix<CellData | undefined>(rect.size, undefined)
    const shiftBy = xy.newPoint(rect.origin.x * -1, rect.origin.y * -1) // new function (!)

    xy.iteratePoints(rect, point => {
      const cellIdx = xy.shiftPoint(point, { by: shiftBy })

      cells[cellIdx.y][cellIdx.x] = this.currentCells.get(ref.from(point))
    })

    return cells
  }
}