import * as ref from '@vertabiz/range-ref'
import * as cm from '@vertabiz/cell-map'
import { newCellMap } from '@vertabiz/cell-map'

export class Grid {

  headerRange: ref.RangeRef | null = null
  currentCells = newCellMap()

  constructor({ headerRange, cells }: {
    headerRange?: ref.RangeRef
    cells?: cm.CellMap
  } = {}) {
    this.headerRange = headerRange ?? null

    if (cells)
      cm.insertCells(this.currentCells, cells)
  }

  knownRange(): ref.RangeRef | null {
    if (this.currentCells.size < 1)
      return null       // we can't know anything.

    const cellRect = cm.rectFor(this.currentCells)
    if (cellRect === null)
      return null       // we probably SHOULD know something, but don't seem to.

    return ref.from(cellRect)
  }

}