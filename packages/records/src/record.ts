import * as cell from '@vertabiz/cell-data'

export type FieldData = string | number | null

export function toFieldData(cellData: cell.CellData | undefined): FieldData | undefined {
  if (cellData === undefined) return undefined
  switch (cellData.type) {
    case 'NIL': return null
    case 'NUMBER': return Number(cellData.value)
    case 'TEXT': return String(cellData.value)
  }
}