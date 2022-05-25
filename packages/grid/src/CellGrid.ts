import { CellData } from '@vertabiz/cell-data'
import { CellMap } from '@vertabiz/cell-map'
import { Range } from '@vertabiz/range-ref'
import * as xy from '@vertabiz/xy'
import { Point } from '@vertabiz/xy'
import { CellRow } from './CellRow'
import { Region } from './Region'

/**
 * Stores cell addresses and values.
 *
 * Not entirely sure how this differs from CellMaps.
 */
export class CellGrid {
  currentCells = new CellMap()

  constructor({ regions }: {
    regions?: Region[]
  } = {}) {
    for (const region of (regions ?? [])) {
      this.currentCells.insert(region.asCellMap())
    }
  }

  knownRange(): Range | null {
    if (this.currentCells.size < 1)
      return null       // we can't know anything.

    const cellRect = this.currentCells.rect()
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
    const shiftBy = new Point(rect.origin.x * -1, rect.origin.y * -1) // new function (!)

    rect.iteratePoints(point => {
      const cellIdx = point.shiftPoint({ by: shiftBy })

      cells[cellIdx.y][cellIdx.x] = this.currentCells.get(Range.fromXY(point).asAddress())
    })

    return cells
  }

  updateRegion(region: Region): void {
    const rect = region.range.asRect()
    if (rect == null)
      throw new Error('Invalid range')

    for (const [addr, val] of region.cells()) {
      if (val !== undefined)
        this.currentCells.set(addr, val)
    }
  }
}

export default CellGrid