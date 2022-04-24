import { CellData } from '@vertabiz/cell-data'
import * as cm from '@vertabiz/cell-map'
import { newCellMap } from '@vertabiz/cell-map'
import { Range } from '@vertabiz/range-ref'
import * as xy from '@vertabiz/xy'
import { Region } from './Region'
import { CellRow } from './CellRow'

/**
 * Stores cell addresses and values.
 *
 * Not entirely sure how this differs from CellMaps.
 */
export class CellGrid {
  currentCells = newCellMap()

  constructor({ regions }: {
    regions?: Region[]
  } = {}) {
    for (const region of (regions ?? [])) {
      cm.insertCells(this.currentCells, region.asCellMap())
    }
  }

  knownRange(): Range | null {
    if (this.currentCells.size < 1)
      return null       // we can't know anything.

    const cellRect = cm.rectFor(this.currentCells)
    if (cellRect === null)
      return null       // we probably SHOULD know something, but don't seem to.

    return Range.fromXY(cellRect)
  }

  getCellsByRange(range: Range): CellRow[] {
    const knownRange = this.knownRange()
    if (knownRange === null) throw new Error(`unknown grid range`)

    const rect = range.withBounds(knownRange.asAddress()).asRect()
    if (rect == null)
      throw new Error('Invalid range')

    const cells = xy.newMatrix<CellData | undefined>(rect.size, undefined)
    const shiftBy = xy.newPoint(rect.origin.x * -1, rect.origin.y * -1) // new function (!)

    xy.iteratePoints(rect, point => {
      const cellIdx = xy.shiftPoint(point, { by: shiftBy })

      cells[cellIdx.y][cellIdx.x] = this.currentCells.get(Range.fromXY(point).asAddress())
    })

    return cells
  }

  updateRegion(region: Region): void {
    const rect = region.range.asRect()
    if (rect == null)
      throw new Error('Invalid range')

    const shiftBy = xy.newPoint(rect.origin.x * -1, rect.origin.y * -1) // new function (!)

    for (const [addr, val] of region.cells()) {
      this.currentCells.set(addr, val)
    }
  }
}

export default CellGrid