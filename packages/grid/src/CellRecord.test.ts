import test from 'ava'
import CellRecord from './CellRecord'
import { from as cv } from '@vertabiz/cell-data'

test('set() -> with new value', t => {
  const record = new CellRecord()

  record.set('name', cv('Xavier Self'))

  t.deepEqual(record.get('name'), cv('Xavier Self'))
})
