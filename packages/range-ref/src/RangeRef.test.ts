import { Point, Rect, Size } from '@vertabiz/xy'
import test from 'ava'
import Range, { parse, SeqNumber } from './RangeRef'

test('parse(A1) -> returns a Point', t => {
  const point = parse('A1')

  t.deepEqual(point, new Point(0, 0))
})

test('parse("B2:D5") -> returns a Rect', t => {
  const rect = parse('B2:D5')

  t.deepEqual(rect, new Rect( new Point(1, 1), new Size(3, 4) ))
})

test('#origin -> returns a Point of the refs origin', t => {
  const originOfRangeRef = Range.fromAddress(`B2:D5`).origin
  t.deepEqual(originOfRangeRef, new Point(1, 1))

  const originOfCellRef = Range.fromAddress('B2').origin
  t.deepEqual(originOfCellRef, new Point(1, 1))
})

test('fromXY() -> returns a Point representing the origin of a rangeref', t => {
  const ref = Range.fromXY( new Rect( new Point(5, 3), new Size(5, 2) ) ).asAddress()

  t.deepEqual(ref, 'F4:J5')
})

test('shift(range, { by })', t => {
  const address = `F6`

  const shifted = Range.fromAddress(address).shift({ by: new Point(5, 1) })

  t.deepEqual(shifted.asAddress(), `K7`)
})

test('fromXY(point) -> returns a Range for a cell', t => {
  const ref = Range.fromXY( new Point(5, 3) )

  t.deepEqual(ref.asAddress(), 'F4')
})

test('fromXY(rect) -> returns a RangeRef', t => {
  const ref = Range.fromXY( new Rect( new Point(5, 3), new Size(5, 2) ) )

  t.deepEqual(ref.asAddress(), 'F4:J5')
})

test('fromXY(rect, { ns }) -> returns a Range with namespace', t => {
  const ref = Range.fromXY(
    new Rect(new Point(5, 3), new Size(5, 2)),
    { ns: 'TestSheet' },
  )

  t.deepEqual(ref.asAddress(), 'TestSheet!F4:J5')
})


test('iterateCells(range) -> iterates through CellRefs', t => {
  const result = [] as string[]

  Range.fromAddress('F4:J5').iterateCells(cell => result.push(cell))

  t.deepEqual(result, [ 'F4', 'G4', 'H4', 'I4', 'J4', 'F5', 'G5', 'H5', 'I5', 'J5' ])
})


test('asRect() -> returns a Rect of the ref even if the ref is a single cell', t => {
  const rectFromRangeRef = Range.fromAddress('B2:D5').asRect()
  const rectFromCellRef  = Range.fromAddress('B2').asRect()

  t.deepEqual(rectFromRangeRef, new Rect( new Point(1, 1), new Size(3, 4) ))
  t.deepEqual(rectFromCellRef, new Rect( new Point(1, 1), new Size(1, 1) ))
})

test('asRect() -> `B2:3` without context == asRect(`B2:B3`)', t => {
  const rect = Range.fromAddress('B2:3').asRect()

  t.deepEqual(rect, Range.fromAddress('B2:B3').asRect())
})

test('asRect() -> `B2:3` with context `A1:Z10` == asRect(`B2:Z3`)', t => {
  const rect = Range.fromAddress('B2:3')
    .withBounds(`A1:Z10`)
    .asRect()

  t.deepEqual(rect, Range.fromAddress('B2:Z3').asRect())
})

test('#expandBy({ rows, cols }) -> increased range size', t => {
  const range = Range.fromAddress('B5')

  t.deepEqual(range.expandBy({ rows: 2, cols: 3 }).asAddress(), `B5:D8`)
})

test('#rowNames() `B2:H5` -> 2,3,4,5', t => {
  const range = Range.fromAddress('B2:H5')

  t.deepEqual(range.rowNames(), ['2', '3', '4', '5'])
})

test('#colNames() `B2:H5` -> B,C,D,E,F,G,H', t => {
  const range = Range.fromAddress('B2:H5')

  t.deepEqual(range.colNames(), ['B', 'C', 'D', 'E', 'F', 'G', 'H'])
})

test('#splitByRow()', t => {
  const range = Range.fromAddress('B2:H15')

  const [ top, bottom ] = range.splitByRow({ after: SeqNumber.fromOneBased(5) })

  t.deepEqual(top?.asAddress(), 'B2:H5')
  t.deepEqual(bottom?.asAddress(), 'B6:H15')
})

test('#splitByRow() -> with namespace', t => {
  const range = Range.fromAddress('TestSheet!B2:H15')

  const [ top, bottom ] = range.splitByRow({ after: SeqNumber.fromOneBased(5) })

  t.deepEqual(top?.asAddress(), 'TestSheet!B2:H5')
  t.deepEqual(bottom?.asAddress(), 'TestSheet!B6:H15')
})
