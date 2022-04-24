import { from as cv } from '@vertabiz/cell-data'
import { Range } from '@vertabiz/range-ref'
import test from 'ava'
import CellRecord from './CellRecord'
import { cellRowFrom } from './CellRow'
import DataGrid, { mapToCellRow } from './DataGrid'
import { Region } from './Region'

const VALUES = [
  [ 'ID',   'Key',                'Value'           ],
  [    1,   'someSetting',        'someValue'       ],
  [    2,   'someOtherSetting',   'someOtherValue'  ],
]

function buildSubjectRecordGrid() {
  return new DataGrid({
    headerRange: Range.fromAddress('A1:C1'),
    regions: [
      Region.fromRows(VALUES.map(cellRowFrom))
    ],
  })
}

test('datagrid -> with data', t => {
  const grid = buildSubjectRecordGrid()

  const headers = grid.getHeaders()
  t.deepEqual(headers, [
    [ cv('ID'), cv('Key'), cv('Value') ],
  ])

  const records = grid.getRecords()
  t.deepEqual(records.length, 2)
  t.deepEqual(records.map(_ => _.asObject()), [
    { id: cv(1), key: cv('someSetting'), value: cv('someValue') },
    { id: cv(2), key: cv('someOtherSetting'), value: cv('someOtherValue') },
  ])
})


test('appendRecords()', t => {
  const grid = buildSubjectRecordGrid()

  grid.appendRecords([
    new CellRecord({
      id: cv(4),
      key: cv('appendedKey'),
      value: cv('appendedValue'),
    })
  ])

  const records = grid.getRecords()
  t.deepEqual(records.length, 3)
  t.deepEqual(records.map(_ => _.asObject()), [
    { id: cv(1), key: cv('someSetting'),      value: cv('someValue')      },
    { id: cv(2), key: cv('someOtherSetting'), value: cv('someOtherValue') },
    { id: cv(4), key: cv('appendedKey'),      value: cv('appendedValue')  },
  ])
})


test('getRecordCount()', t => {
  const grid = buildSubjectRecordGrid()

  t.deepEqual(grid.getRecordCount(), 2)
})


test('mapToCellRow()', t => {
  const record = new CellRecord({
    id: cv(4),
    key: cv('appendedKey'),
    value: cv('appendedValue'),
  })

  const cellRow = mapToCellRow(
    record,
    { headers: [[ 'ID', 'Key', 'Value' ]].map(cellRowFrom) }
  )

  t.deepEqual(cellRow, [ cv(4), cv('appendedKey'), cv('appendedValue') ])
})
