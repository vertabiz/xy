import * as cell from '@vertabiz/cell-data'
import * as grid from '@vertabiz/grid'
import * as rec from '@vertabiz/records'

export type ToFieldMapping<TRecord> = {
  action: 'TO_FIELD'
  fieldName: keyof TRecord
  ex: (row: grid.GridRow) => rec.FieldData | undefined
}
export type ToColumnMapping<TRecord> = {
  action: 'TO_COLUMN'
  columnName: string
  ex: (record: Partial<TRecord>) => cell.CellData | undefined
}

export type FieldMap<TRecord> =
  ToFieldMapping<TRecord>
  | ToColumnMapping<TRecord>

export type RecordMapper<TRecord> = {
  fieldMaps: FieldMap<TRecord>[]
  // transformers: FieldTransformer[]
}

export function buildSymmetricMappings<TRecord>(
  { field, column }: {
    field: keyof TRecord
    column: string
  }
): [ToFieldMapping<TRecord>, ToColumnMapping<TRecord>] {
  return [
    {
      action: 'TO_FIELD',
      fieldName: field,
      ex: (row) => {
        // return rec.toFieldData(row[column])
        return null
      }
    },
    {
      action: 'TO_COLUMN',
      columnName: column,
      ex: (record) => {
        const fieldValue = record[field]
        if (fieldValue === undefined) return undefined

        // return cell.from(fieldValue)
        return undefined
      }
    }
  ]
}

export function fromRow<TRecord>(mapper: RecordMapper<TRecord>, row: Record<string, cell.CellData | undefined>): Partial<TRecord> {
  let record: Partial<TRecord> = {}

  for (const mapping of mapper.fieldMaps) {
    if (mapping.action === 'TO_FIELD') {
      record = {
        ...record,
        // [mapping.fieldName]: mapping.ex(row),
      }
    }
  }

  return record
}

export function toRow<TRecord>(mapper: RecordMapper<TRecord>, record: Partial<TRecord>): Record<string, cell.CellData | undefined> {
  let row: Record<string, cell.CellData | undefined> = {}

  for (const mapping of mapper.fieldMaps) {
    if (mapping.action === 'TO_COLUMN') {
      row = {
        ...row,
        [mapping.columnName]: mapping.ex(record),
      }
    }
  }

  return row
}