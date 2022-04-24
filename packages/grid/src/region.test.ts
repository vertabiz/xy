import test from 'ava'
import * as cm from '@vertabiz/cell-map'
import Region from './Region'
import { Range } from '@vertabiz/range-ref'

test('cellMapFromRegion(region)', t => {
  const region = Region.fromRows(
    [
      [ cm.cell.from('B2 Value'), cm.cell.from('C2 Value'), cm.cell.from('D2 Value') ],
      [ cm.cell.from('B3 Value'), cm.cell.from('C3 Value'), cm.cell.from('D3 Value') ],
    ],
    Range.fromAddress('B2:D3'),
  )

  t.deepEqual(
    cm.asObject(region.asCellMap()),
    {
      B2: cm.cell.from('B2 Value'),
      C2: cm.cell.from('C2 Value'),
      D2: cm.cell.from('D2 Value'),
      B3: cm.cell.from('B3 Value'),
      C3: cm.cell.from('C3 Value'),
      D3: cm.cell.from('D3 Value'),
    }
  )
})

test('#toRows()', t => {
  const region = Region.fromRows(
    [
      [ cm.cell.from('B2 Value'), cm.cell.from('C2 Value'), cm.cell.from('D2 Value') ],
      [ cm.cell.from('B3 Value'), cm.cell.from('C3 Value'), cm.cell.from('D3 Value') ],
    ],
    Range.fromAddress('B2:D3'),
  )

  const rows = region.toRows()

  t.deepEqual(
    rows,
    [
      [ cm.cell.from('B2 Value'), cm.cell.from('C2 Value'), cm.cell.from('D2 Value') ],
      [ cm.cell.from('B3 Value'), cm.cell.from('C3 Value'), cm.cell.from('D3 Value') ],
    ],
  )
})