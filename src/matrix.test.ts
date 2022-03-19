import test from 'ava'
import { newMatrix } from './matrix'
import { isPointEqual, newPoint, shiftPoint } from './point'
import { newSize } from './size'

test('newMatrix -> builds new matrix with default values', t => {
  const matrix = newMatrix(newSize(5, 3), 'test')

  t.deepEqual(matrix, [
    [ 'test', 'test', 'test', 'test', 'test' ],
    [ 'test', 'test', 'test', 'test', 'test' ],
    [ 'test', 'test', 'test', 'test', 'test' ],
  ])
})

