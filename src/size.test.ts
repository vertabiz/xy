import test from 'ava'
import { isSizeEqual, newSize } from './size'

test('newSize', t => {
  const size = newSize(100, 200)

  t.deepEqual(size, { w: 100, h: 200 })
})

test('isSizeEqual(size, other) -> is true if size and other have the same dimensions', t => {
  const size = newSize(100, 200)
  const other = newSize(100, 200)

  t.true( isSizeEqual(size, other) )
})