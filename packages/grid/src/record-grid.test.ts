import test from 'ava'
import * as cell from '@vertabiz/cell-data'
import { from as cv } from '@vertabiz/cell-data'
import { newCellMap } from '@vertabiz/cell-map'
import { Grid } from './grid'
import { RecordGrid } from './record-grid'
import { regionFrom } from './region'
import { rowFrom } from './rows'

const VALUES = [
  [ 'ID',   'Key',                'Value'           ],
  [    1,   'someSetting',        'someValue'       ],
  [    2,   'someOtherSetting',   'someOtherValue'  ],
]


function buildSubjectRecordGrid() {
  return new RecordGrid({
    headerRef: 'A1:C1',
    regions: [
      regionFrom(VALUES.map(rowFrom))
    ],
  })
}

test('new recordgrid -> with data', t => {
  const grid = buildSubjectRecordGrid()

  const headers = grid.getHeaders()
  t.deepEqual(headers, [
    [ cv('ID'), cv('Key'), cv('Value') ],
  ])

  const records = grid.getRecords()
  t.deepEqual(records.length, 2)
  t.deepEqual(records, [
    { id: cv(1), key: cv('someSetting'), value: cv('someValue') },
    { id: cv(2), key: cv('someOtherSetting'), value: cv('someOtherValue') },
  ])
})
