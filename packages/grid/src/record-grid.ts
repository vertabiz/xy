import * as ref from '@vertabiz/range-ref'
import { SeqNumber } from '@vertabiz/range-ref'
import * as xy from '@vertabiz/xy'
import { GridRecord } from '.'
import { Grid } from './grid'
import { GridRegion } from './region'
import { GridRow } from './rows'
import { must } from './util'

export class RecordGrid {

  headerRef: string
  grid: Grid

  constructor({ headerRef, regions }: {
    headerRef: ref.RangeRef
    regions: GridRegion[]
  }) {
    this.headerRef = headerRef
    this.grid = new Grid({ regions })
  }

  getHeaders(): GridRow[] {
    return this.grid.getCellsByRange(this.headerRef)
  }

  /**
   * NOTE: This will return undefined results if headerRange is skewed in
   * relation to knownRange
   */
  getRecords(): GridRecord[] {
    const headerBottomRow = ref.bottomRow(this.headerRef)
    const knownRange = this.grid.knownRange()
    if (knownRange == null) return []

    const [ , bodyRangeRef] = ref.splitRows(knownRange, { after: headerBottomRow })
    if (bodyRangeRef == null) return []

    const headerVals = this.getHeaders()
    const bodyMatrix = this.grid.getCellsByRange(bodyRangeRef)

    const headerRow = must(headerVals.at(-1))

    return bodyMatrix.map((row) => {
      return row.reduce((record, cell, cellIdx) => {
        const headerCell = must(headerRow.at(cellIdx))
        if (headerCell.type === 'TEXT') {
          const headerName = headerCell.value.toLowerCase()

          if (cell)
            record[headerName] = cell
        }

        return record
      }, {} as GridRecord)
    })
  }
}