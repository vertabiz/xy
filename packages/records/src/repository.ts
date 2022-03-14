import cloneDeep from 'lodash.clonedeep'

export type FinderPredicate<T> =
  (record: Partial<T>) => boolean

export class RecordRepository<T> {
  records = [] as Partial<T>[]

  get length() {
    return this.records.length
  }

  add(record: Partial<T>) {
    this.records.push(record)
  }

  findWith(predicate: FinderPredicate<T>): Partial<T>[] {
    return this.records.filter(predicate)
      .map(cloneDeep)
  }
}