import { cell } from '@vertabiz/cell-map'
import { Range } from '@vertabiz/range-ref'
import { Point, Rect, Size } from '@vertabiz/xy'
import CellGrid from './CellGrid'
import CellRecord from './CellRecord'
import { CellRow } from './CellRow'
import Region from './Region'
import { is, must } from './util'

/**
 * Given
 */
export function mapToCellRow(
  record: CellRecord,
  { headers }: {
    headers: CellRow[],
  },
): CellRow {
  return headers.at(-1)?.map(header => {
    const headerValue = cell.value(header)

    return typeof headerValue == 'string'
      ? record.get(headerValue.toLowerCase())
      : undefined
  }) ?? []
}

export class DataGrid {

  headerRange: Range
  cellGrid: CellGrid

  constructor({ headerRange, regions }: {
    headerRange: Range
    regions: Region[]
  }) {
    this.headerRange = headerRange
    this.cellGrid = new CellGrid({ regions })
  }

  appendRecords(records: CellRecord[]): void {
    const cellRows = records.map(_ => mapToCellRow(_, { headers: this.getHeaders() }))

    // HACKHACKHACK: this is going to be updated soon with an event
    // log that gets replaced against a grid when needed. But for now ...
    //

    const regionRef = must(is(() => {
      const knownRange = this.cellGrid.knownRange()
      if (knownRange == null) return null
      const rect = knownRange.asRect()
      if (!(rect instanceof Rect)) return null

      const nextRect = new Rect(
        new Point(rect.origin.x, rect.farPoint.y + 1),
        new Size(rect.size.w, cellRows.length),
      )

      return Range.fromXY(nextRect)
    }))

    this.cellGrid.updateRegion(
      Region.fromRows(cellRows, regionRef)
    )
  }

  getHeaders(): CellRow[] {
    return this.cellGrid.getCellsByRange(this.headerRange)
  }

  getRecordCount(): number {
    // TODO: optimize
    return this.getRecords().length
  }

  /**
   * NOTE: This will return undefined results if headerRange is skewed in
   * relation to knownRange
   */
  getRecords(): CellRecord[] {
    const headerBottomRow = this.headerRange.bottomRow()
    const knownRange = this.cellGrid.knownRange()
    if (knownRange == null) return []

    const [ , bodyRangeRef] = knownRange.splitByRow({ after: headerBottomRow })
    if (bodyRangeRef == null) return []

    const headerVals = this.getHeaders()
    const bodyMatrix = this.cellGrid.getCellsByRange(bodyRangeRef)

    const headerRow = must(headerVals.at(-1), `header row does not exist`)

    return bodyMatrix.map((cellRow) => {
      return cellRow.reduce((dataRow, cell, cellIdx) => {
        const headerCell = must(headerRow.at(cellIdx), `cell data does not exist`)
        if (headerCell.type === 'TEXT') {
          const headerName = headerCell.value.toLowerCase()

          if (cell)
            dataRow.set(headerName, cell)
        }

        return dataRow
      }, new CellRecord())
    })
  }
}

export default DataGrid