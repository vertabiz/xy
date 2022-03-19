import test from 'ava'
import { isPointEqual, newPoint, shiftPoint } from './point'

test('newPoint', t => {
  const point = newPoint(10, 20)

  t.deepEqual(point, { x: 10, y: 20 })
})

test('isPointEqual(point, other) -> returns true when points are the same', t => {
  const point = newPoint(10, 40)
  const other = newPoint(10, 40)

  t.true( isPointEqual(point, other) )
})

test('shiftPoint(point, { by })', t => {
  const point = newPoint(10, 40)

  const shiftedPoint = shiftPoint(point, { by: newPoint(5, 0) })

  t.deepEqual(shiftedPoint, newPoint(15, 40))
})
