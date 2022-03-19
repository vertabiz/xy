import * as cell from '@vertabiz/cell-data'
import { from as cv } from '@vertabiz/cell-data'
import { newCellMap } from '@vertabiz/cell-map'
import test from 'ava'
import { Grid } from './grid'
import { regionFrom } from './region'
import { rowFrom } from './rows'

const VALUES = [
  [ 'ID', 'Key', 'Value' ],
  [ 1, 'someSetting', 'someValue' ],
]

function buildSubjectGrid() {
  return new Grid({
    regions: [ regionFrom( VALUES.map(rowFrom) ) ]
  })
}

test('new grid -> empty set', t => {
  const grid = new Grid()

  t.deepEqual(grid.knownRange(), null)
})

test('new grid -> with data', t => {
  const grid = buildSubjectGrid()

  t.deepEqual(grid.knownRange(), 'A1:C2')

  const header = grid.getCellsByRange('A1:C1')
  t.deepEqual(header, [ rowFrom(VALUES[0]) ])
})
