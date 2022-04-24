import test from 'ava'
import * as xy from '@vertabiz/xy'
import { parseA1, parseA1Cell } from './A1'

test('parseA1Cell(`AA83`) -> returns a Point', t => {
  const point = parseA1Cell('AA83')

  t.deepEqual(point, xy.newPoint(26, 82))
})

test('parseA1Cell() with defaults -> returns a Point', t => {
  {
    const point = parseA1Cell('B2', { anchor: `C10` })

    t.deepEqual(point, xy.newPoint(1, 1))
  }

  {
    // without column
    const point = parseA1Cell('2', { anchor: `C10` })

    t.deepEqual(point, xy.newPoint(2, 1))
  }

  {
    // without row
    const point = parseA1Cell('B', { anchor: `C10` })

    t.deepEqual(point, xy.newPoint(1, 9))
  }
})

test('parseA1(`AA83:AC90`) -> returns a Rect', t => {
  const point = parseA1('AA83:AC90')

  t.deepEqual(point, xy.newRect(xy.newPoint(26, 82), xy.newSize(3, 8)))
})

test('parseA1(`B2:3`) -> returns (1,1x1,2) rect', t => {
  const rect = parseA1('B2:3')

  t.deepEqual(rect, xy.newRect(xy.newPoint(1, 1), xy.newSize(1, 2)))
})

test('parseA1(`B2:3`, { bounds: `B2:Z10` }) -> returns (1,1)x(25,2) rect', t => {
  const rect = parseA1('B2:3', { bounds: `B2:Z10` })

  t.deepEqual(rect, xy.newRect(xy.newPoint(1, 1), xy.newSize(25, 2)))
})