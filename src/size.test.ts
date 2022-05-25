import test from 'ava'
import { Size } from './Size'

test('newSize', t => {
  const size = new Size(100, 200)

  t.deepEqual(size.w, 100)
  t.deepEqual(size.h, 200)
})

test('isSizeEqual(size, other) -> is true if size and other have the same dimensions', t => {
  const size = new Size(100, 200)
  const other = new Size(100, 200)

  t.true( size.isEqual(other) )
})