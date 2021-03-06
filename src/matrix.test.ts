import test from 'ava'
import { newMatrix } from './matrix'
import Size from './Size'

test('newMatrix -> builds new matrix with default values', t => {
  const matrix = newMatrix(new Size(5, 3), 'test')

  t.deepEqual(matrix, [
    [ 'test', 'test', 'test', 'test', 'test' ],
    [ 'test', 'test', 'test', 'test', 'test' ],
    [ 'test', 'test', 'test', 'test', 'test' ],
  ])
})

