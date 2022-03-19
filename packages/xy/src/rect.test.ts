import test from 'ava'
import { newPoint, Point } from './point'
import { intersection, newRect, farPointOf, expandTo, rectForPoints, splitRectAfterY, shiftRect, iteratePoints } from './rect'
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

test('rectForPoints(points) -> returns rect that includes all points', t => {
  const rect = rectForPoints([
    newPoint(3, 4),
    newPoint(10, 7),
    newPoint(4, 9),
  ])

  t.deepEqual(
    rect,
    newRect( newPoint(3, 4), newSize(8, 6) ),
  )
})

test('expandTo(rect, point) -> mutates Rect to include new point (if needed)', t => {
  const rect = newRect(
    newPoint(10, 20),
    newSize(50, 90),
  )

  expandTo(rect, newPoint(100, 45))

  t.deepEqual(
    rect,
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

test('splitRectAfterY -> returns a split rect', t => {
  const rect = newRect( newPoint(5, 5), newSize(10, 10) ) // 5x5 to 14x14

  const [ resultOne, resultTwo ] = splitRectAfterY(rect, 8)

  t.deepEqual( resultOne, newRect({ x: 5, y: 5 }, { w: 10, h: 4 }) )
  t.deepEqual( resultTwo, newRect({ x: 5, y: 9 }, { w: 10, h: 6 }) )
})

test('shift(rect, { by })', t => {
  const rect = newRect(
    newPoint(10, 40),
    newSize(10, 10),
  )

  const shifted = shiftRect(rect, { by: newPoint(5, 0) })

  t.deepEqual(shifted, newRect( newPoint(15, 40), newSize(10, 10) ))
})

test('iteratePoints(rect, fn)', t => {
  const rect = newRect( newPoint(1, 5), newSize(5, 2) )

  const results = [] as Point[]
  iteratePoints(rect, (point) => results.push(point))

  t.deepEqual(
    results,
    [ [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6] ].map(([x, y]) => newPoint(x, y))
  )
})
