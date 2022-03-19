import test from 'ava'
import * as xy from '@vertabiz/xy'
import { parseA1, parseA1Cell } from './a1'

test('parseA1Cell(`AA83`) -> returns a Point', t => {
  const point = parseA1Cell('AA83')

  t.deepEqual(point, xy.newPoint(26, 82))
})

test('parseA1(`AA83:AC90`) -> returns a Rect', t => {
  const point = parseA1('AA83:AC90')

  t.deepEqual(point, xy.newRect(xy.newPoint(26, 82), xy.newSize(3, 8)))
})