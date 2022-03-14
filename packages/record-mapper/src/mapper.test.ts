import test from 'ava'
import { pick } from './utils'
import { buildSymmetricMappings, fromRow, RecordMapper, toRow } from './mapper'
import * as cell from '@vertabiz/cell-data'
import * as rec from '@vertabiz/records'

type TestPersonRecord = {
  id: string
  name: {
    first: string
    last: string
  }
  code: string
}

const symmetricMapper: RecordMapper<TestPersonRecord> = {
  fieldMaps: [
    ...buildSymmetricMappings<TestPersonRecord>({
      field: 'id',
      column: 'person id',
    }),
    ...buildSymmetricMappings<TestPersonRecord>({
      field: 'code',
      column: 'person type',
    }),
  ]
}

const ROW = {
  'person id': cell.from('05789f61-b745-4a63-a6be-424425fef626'),
  'person type': cell.from('contact'),
  'notes': cell.from('this is a favorite contact'),
}

test('round trip with symmetricMapper', t => {
  const record = fromRow(
    symmetricMapper,
    ROW,
  )

  console.log(`Record >> `, record)

  t.deepEqual(record, {
    id: rec.toFieldData(ROW['person id']),
    code: rec.toFieldData(ROW['person type']),
  })

  const newRow = toRow(symmetricMapper, record)

  t.deepEqual(newRow, pick(ROW, ['person id', 'person type']))
})

test('fieldNameFromRow', t => {
  const record = fromRow(
    symmetricMapper,
    ROW,
  )

  t.deepEqual(record, {
    id: rec.toFieldData(ROW['person id']),
    code: rec.toFieldData(ROW['person type']),
  })

  const newRow = toRow(symmetricMapper, record)

  t.deepEqual(newRow, pick(ROW, ['person id', 'person type']))
})