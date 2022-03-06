import { newPoint, newRect, newSize } from '@vertabiz/xy'
import test from 'ava'
import { asRect, from, parse, originOf } from './range-ref'

test('parse(A1) -> returns a Point', t => {
  const point = parse('A1')

  t.deepEqual(point, newPoint(0, 0))
})

test('parse("B2:D5") -> returns a Rect', t => {
  const rect = parse('B2:D5')

  t.deepEqual(rect, newRect( newPoint(1, 1), newSize(3, 4) ))
})

test('asRect(ref) -> returns a Rect of the ref even if the ref is a single cell', t => {
  const rectFromRangeRef = asRect('B2:D5')
  const rectFromCellRef  = asRect('B2')

  t.deepEqual(rectFromRangeRef, newRect( newPoint(1, 1), newSize(3, 4) ))
  t.deepEqual(rectFromCellRef, newRect( newPoint(1, 1), newSize(1, 1) ))
})

test('originOf(ref) -> returns a Point of the refs origin', t => {
  const originOfRangeRef = originOf('B2:D5')
  t.deepEqual(originOfRangeRef, newPoint(1, 1))

  const originOfCellRef  = originOf('B2')
  t.deepEqual(originOfCellRef, newPoint(1, 1))
})

test('toRect(rect) -> returns a Point representing the origin of a rangeref', t => {
  const ref = from( newRect( newPoint(5, 3), newSize(5, 2) ) )

  t.deepEqual(ref, 'F4:J5')
})

test('from(point) -> returns a CellRef', t => {
  const ref = from( newPoint(5, 3) )

  t.deepEqual(ref, 'F4')
})

test('from(rect) -> returns a RangeRef', t => {
  const ref = from( newRect( newPoint(5, 3), newSize(5, 2) ) )

  t.deepEqual(ref, 'F4:J5')
})

