import test from 'ava'
import Point from './Point'

test('newPoint', t => {
  const point = new Point(10, 20)

  t.deepEqual(point.x, 10)
  t.deepEqual(point.y, 20)
})

test('isPointEqual(point, other) -> returns true when points are the same', t => {
  const point = new Point(10, 40)
  const other = new Point(10, 40)

  t.true( point.isEqual(other) )
})

test('shiftPoint(point, { by })', t => {
  const point = new Point(10, 40)

  const shiftedPoint = point.shiftPoint({ by: new Point(5, 0) })

  t.deepEqual(shiftedPoint, new Point(15, 40))
})
