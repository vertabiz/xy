import { newCellMap } from '@vertabiz/cell-map'
import test from 'ava'
import { Grid } from './grid'

function buildSubjectGrid() {
  return new Grid({
    cells: newCellMap({
      'A1': 'ID',
      'B1': 'Key',
      'C1': 'Value',
      'A2': '1',
      'B2': 'someSetting',
      'C2': 'someValue',
    })
  })
}

test('new grid -> empty set', t => {
  const grid = new Grid()

  t.deepEqual(grid.knownRange(), null)
})

test('new grid -> with data', t => {
  const grid = new Grid({
    cells: newCellMap({
      'A1': 'ID',
      'B1': 'Key',
      'C1': 'Value',
      'A2': '1',
      'B2': 'someSetting',
      'C2': 'someValue',
    })
  })

  t.deepEqual(grid.knownRange(), 'A1:C2')
})

// test('getRows()', t => {
//   t.deepEqual(grid.knownRange(), 'A1:C2')
// })