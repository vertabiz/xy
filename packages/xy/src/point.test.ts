import test from 'ava'
import { isEqual, newPoint } from './point'

test('newPoint', t => {
  const point = newPoint(10, 20)

  t.deepEqual(point, { x: 10, y: 20 })
})

test('isEqual(point, other) -> returns true when points are the same', t => {
  const point = newPoint(10, 40)
  const other = newPoint(10, 40)

  t.true( isEqual(point, other) )
})