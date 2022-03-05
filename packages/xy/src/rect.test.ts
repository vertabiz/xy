import test from 'ava'
import { newPoint, isEqual as isPointEqual } from './point'
import { intersection, isEqual, newRect, farPointOf, expandTo } from './rect'
import { newSize } from './size'

test('newRect', t => {
  const rect = newRect( newPoint(1, 5), newSize(50, 20) )

  t.deepEqual(rect, {
    origin: { x: 1, y: 5 },
    size: { w: 50, h: 20 },
  })
})

test('newRect -> normalizes Rects with negative sizes', t => {
  const rect = newRect( newPoint(106, 146), newSize(-100, -100) )

  t.deepEqual(rect, {
    origin: { x: 6, y: 46 },
    size: { w: 100, h: 100 },
  })
})

test('expandTo(rect, point) -> returns new Rect which has been expanded to include new point (if needed)', t => {
  const startingRect = newRect(
    newPoint(10, 20),
    newSize(50, 90),
  )

  const largerRect = expandTo(startingRect, newPoint(100, 45))

  t.deepEqual(
    largerRect,
    newRect( newPoint(10, 20), newSize(91, 90) ),
  )
})


test('intersection -> with intersecting rects (basic)', t => {
  const rectOne = newRect( newPoint(10, 20), newSize(50, 90) )
  const rectTwo = newRect( newPoint(5, 45), newSize(100, 100) )

  const expectedRect = newRect(
    newPoint(10, 45),
    newSize(50, 65),
  )

  const resultRect = intersection(rectOne, rectTwo)

  t.deepEqual( resultRect, expectedRect )
})

test('farPointOf -> returns opposite INCLUSIVE point of a Rect', t => {
  const oneByTwo = newRect( newPoint(10, 20), newSize(1, 2) )

  t.deepEqual( farPointOf(oneByTwo), newPoint(10, 21) )
})