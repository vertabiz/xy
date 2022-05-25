import test from 'ava'
import Point from './Point'
import Rect from './Rect'
import Size from './Size'

test('newRect', t => {
  const rect = new Rect( new Point(1, 5), new Size(50, 20) )

  t.deepEqual(rect.origin.x, 1)
  t.deepEqual(rect.origin.y, 5)
  t.deepEqual(rect.size.w, 50)
  t.deepEqual(rect.size.h, 20)
})

test('newRect -> normalizes Rects with negative sizes', t => {
  const rect = new Rect( new Point(106, 146), new Size(-100, -100) )

  t.deepEqual(rect.origin.x, 6)
  t.deepEqual(rect.origin.y, 46)
  t.deepEqual(rect.size.w, 100)
  t.deepEqual(rect.size.h, 100)
})

test('rectForPoints(points) -> returns rect that includes all points', t => {
  const rect = Rect.fromPoints([
    new Point(3, 4),
    new Point(10, 7),
    new Point(4, 9),
  ])

  t.deepEqual(
    rect,
    new Rect( new Point(3, 4), new Size(8, 6) ),
  )
})

test('expandTo(rect, point) -> creates new Rect to include new point (if needed)', t => {
  let rect = new Rect(
    new Point(10, 20),
    new Size(50, 90),
  )

  rect = rect.expandTo(new Point(100, 45))

  t.deepEqual(
    rect,
    new Rect( new Point(10, 20), new Size(91, 90) ),
  )
})

test('intersection -> with intersecting rects (basic)', t => {
  const rectOne = new Rect( new Point(10, 20), new Size(50, 90) )
  const rectTwo = new Rect( new Point(5, 45), new Size(100, 100) )

  const expectedRect = new Rect(
    new Point(10, 45),
    new Size(50, 65),
  )

  const resultRect = rectOne.intersection(rectTwo)

  t.deepEqual( resultRect, expectedRect )
})

test('#farPoint -> returns opposite INCLUSIVE point of a Rect', t => {
  const oneByTwo = new Rect( new Point(10, 20), new Size(1, 2) )

  t.deepEqual( oneByTwo.farPoint, new Point(10, 21) )
})

test('#splitRectAfterY() -> returns a split rect', t => {
  const rect = new Rect( new Point(5, 5), new Size(10, 10) ) // 5x5 to 14x14

  const [ resultOne, resultTwo ] = rect.splitRectAfterY(8)

  t.deepEqual( resultOne, new Rect(new Point(5, 5), new Size(10, 4)) )
  t.deepEqual( resultTwo, new Rect(new Point(5, 9), new Size(10, 6)) )
})

test('#shift({ by })', t => {
  const rect = new Rect(
    new Point(10, 40),
    new Size(10, 10),
  )

  const shifted = rect.shiftRect({ by: new Point(5, 0) })

  t.deepEqual(shifted, new Rect( new Point(15, 40), new Size(10, 10) ))
})

test('iteratePoints(rect, fn)', t => {
  const rect = new Rect( new Point(1, 5), new Size(5, 2) )

  const results = [] as Point[]
  rect.iteratePoints((point) => results.push(point))

  t.deepEqual(
    results,
    [ [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6] ].map(([x, y]) => new Point(x, y))
  )
})
