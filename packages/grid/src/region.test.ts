import test from 'ava'
import { cellMapFromRegion } from './region'
import * as cm from '@vertabiz/cell-map'

test('cellMapFromRegion(region)', t => {
  const map = cellMapFromRegion({
    range: 'B2:D3',
    rows: [
      [ cm.cell.from('B2 Value'), cm.cell.from('C2 Value'), cm.cell.from('D2 Value') ],
      [ cm.cell.from('B3 Value'), cm.cell.from('C3 Value'), cm.cell.from('D3 Value') ],
    ],
  })

  t.deepEqual(
    cm.asObject(map),
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