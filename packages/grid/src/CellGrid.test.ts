import { Range } from '@vertabiz/range-ref'
import test from 'ava'
import CellGrid from './CellGrid'
import { cellRowFrom } from './CellRow'
import Region from './Region'

const VALUES = [
  [ 'ID', 'Key', 'Value' ],
  [ 1, 'someSetting', 'someValue' ],
  [ 2, 'settingTwo', 'value two'  ],
]

function buildSubjectGrid() {
  return new CellGrid({
    regions: [ Region.fromRows( VALUES.map(cellRowFrom) ) ]
  })
}

test('new grid -> empty set', t => {
  const grid = new CellGrid()

  t.deepEqual(grid.knownRange(), null)
})

test('new grid -> with data', t => {
  const grid = buildSubjectGrid()

  t.deepEqual(grid.knownRange()?.asAddress(), 'A1:C3')

  const header = grid.getCellsByRange(Range.fromAddress('A1:C1'))
  t.deepEqual(header, [ cellRowFrom(VALUES[0]) ])
})


test('updateRegion() - overwriting existing fields', t => {
  const grid = buildSubjectGrid()

  grid.updateRegion(
    Region.fromRows(
      [
        [ 'field.one' ],
        [ 'field.two' ],
      ].map(cellRowFrom),
      Range.fromAddress('B2:B3'),
    )
  )

  const bodyCells = grid.getCellsByRange(Range.fromAddress('A2:C3'))
  t.deepEqual(bodyCells, [
    [ 1, 'field.one', 'someValue'   ],
    [ 2, 'field.two', 'value two'   ],
  ].map(cellRowFrom))
})

test('updateRegion() - appending to new cells', t => {
  const grid = buildSubjectGrid()

  grid.updateRegion(
    Region.fromRows(
      [
        [ 3, 'field.three', 'value three' ],
        [ 4, 'field.four',  'value four'  ],
      ].map(cellRowFrom),
      Range.fromAddress('A5:C6'),
    )
  )

  const bodyCells = grid.getCellsByRange(Range.fromAddress('A2:C6'))

  t.deepEqual(bodyCells, [
    [ 1, 'someSetting', 'someValue' ],
    [ 2, 'settingTwo', 'value two'  ],
    [ undefined, undefined, undefined ],
    [ 3, 'field.three', 'value three'   ],
    [ 4, 'field.four', 'value four'   ],
  ].map(cellRowFrom))
})
