import test from 'ava'
import { RecordRepository } from './repository'

type TestRecord = {
  id: string
  name: string
  resultCode: number
}

test('Creating new Repository and adding some records', t => {
  const repo = new RecordRepository<TestRecord>()

  t.deepEqual(repo.length, 0)

  repo.add({ id: 'record-1', name: 'Record One', resultCode: 5 })
  repo.add({ id: 'record-2', name: 'Record Two', resultCode: 10 })

  t.deepEqual(repo.length, 2)

  const [recordTwo] = repo.findWith(record => record.id == 'record-2')
  t.deepEqual(recordTwo, { id: 'record-2', name: 'Record Two', resultCode: 10 })
})