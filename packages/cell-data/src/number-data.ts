export type NumberCellData = {
  value: string
  type: 'NUMBER'
}

export function from(val: number): NumberCellData {
  return {
    type: 'NUMBER',
    value: String(val),
  }
}