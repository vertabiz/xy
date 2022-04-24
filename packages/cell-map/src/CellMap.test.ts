import { from as cv } from '@vertabiz/cell-data'
import * as xy from '@vertabiz/xy'
import test from 'ava'
import * as cm from './CellMap'

test('newCellMap(values) -> returns a Map with provided key-values mapped', t => {
  const map = cm.newCellMap({
    'E5':  cv('Cell E5'),
    'D5':  cv('Cell D5'),
    'Q15': cv('Cell Q15'),
  })

  t.deepEqual(cv('Cell D5'), map.get('D5'))
  t.deepEqual(cv('Cell E5'), map.get('E5'))
  t.deepEqual(cv('Cell Q15'), map.get('Q15'))
  t.true(map.get('A1') == undefined)
})

test('rectFor(cellMap) -> returns the smallest Rect required to capture all data in map', t => {
  const map = cm.newCellMap({
    'E5':  cv('Cell E5'),
    'D5':  cv('Cell D5'),
    'Q15': cv('Cell Q15'),
  })

  const mapRect = cm.rectFor(map)

  t.deepEqual(mapRect, xy.newRect( xy.newPoint(3, 4), xy.newSize(14, 11)))
})

test('insertCells(cellMap) -> adds provided cell/values to cellMap (overwriting existing values if needed)', t => {
  const map = cm.newCellMap({
    'E5':  cv('Cell E5'),
    'D5':  cv('Cell D5'),
    'Q15': cv('Cell Q15'),
  })

  cm.insertCells(map, cm.newCellMap({
    'E5':  cv('New Cell E5'),
    'F10': cv('New Cell F10'),
  }))

  t.deepEqual(cv('Cell D5'), map.get('D5'))
  t.deepEqual(cv('New Cell E5'), map.get('E5'))
  t.deepEqual(cv('Cell Q15'), map.get('Q15'))
  t.deepEqual(cv('New Cell F10'), map.get('F10'))
  t.true(map.get('A1') == undefined)
})