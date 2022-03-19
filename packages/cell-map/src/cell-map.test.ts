import * as xy from '@vertabiz/xy'
import test from 'ava'
import * as cm from './cell-map'
import * as cell from '@vertabiz/cell-data'

test('newCellMap(values) -> returns a Map with provided key-values mapped', t => {
  const map = cm.newCellMap({
    'E5':  cell.from('Cell E5'),
    'D5':  cell.from('Cell D5'),
    'Q15': cell.from('Cell Q15'),
  })

  t.deepEqual('Cell D5', String(map.get('D5')))
  t.deepEqual('Cell E5', String(map.get('E5')))
  t.deepEqual('Cell Q15', String(map.get('Q15')))
  t.true(map.get('A1') == undefined)
})

test('rectFor(cellMap) -> returns the smallest Rect required to capture all data in map', t => {
  const map = cm.newCellMap({
    'E5':  cell.from('Cell E5'),
    'D5':  cell.from('Cell D5'),
    'Q15': cell.from('Cell Q15'),
  })

  const mapRect = cm.rectFor(map)

  t.deepEqual(mapRect, xy.newRect( xy.newPoint(3, 4), xy.newSize(14, 11)))
})

test('insertCells(cellMap) -> adds provided cell/values to cellMap (overwriting existing values if needed)', t => {
  const map = cm.newCellMap({
    'E5':  cell.from('Cell E5'),
    'D5':  cell.from('Cell D5'),
    'Q15': cell.from('Cell Q15'),
  })

  cm.insertCells(map, cm.newCellMap({
    'E5':  cell.from('New Cell E5'),
    'F10': cell.from('New Cell F10'),
  }))

  t.deepEqual('Cell D5', String(map.get('D5')))
  t.deepEqual('New Cell E5', String(map.get('E5')))
  t.deepEqual('Cell Q15', String(map.get('Q15')))
  t.deepEqual('New Cell F10', String(map.get('F10')))
  t.true(map.get('A1') == undefined)
})