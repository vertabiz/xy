import * as xy from '@vertabiz/xy'
import test from 'ava'
import { newCellMap, rectFor } from './cell-map'

test('newCellMap(values) -> returns a Map with provided key-values mapped', t => {
  const map = newCellMap({
    'E5': 'Cell E5',
    'D5': 'Cell D5',
    'Q15': 'Cell Q15',
  })

  t.deepEqual('Cell D5', String(map.get('D5')))
  t.deepEqual('Cell E5', String(map.get('E5')))
  t.deepEqual('Cell Q15', String(map.get('Q15')))
  t.true(map.get('A1') == undefined)
})

test('rectFor(cellMap) -> returns the smallest Rect required to capture all data in map', t => {
  const map = newCellMap({
    'E5': 'Cell E5',
    'D5': 'Cell D5',
    'Q15': 'Cell Q15',
  })

  const mapRect = rectFor(map)

  t.deepEqual(mapRect, xy.newRect( xy.newPoint(3, 4), xy.newSize(14, 11)))
})