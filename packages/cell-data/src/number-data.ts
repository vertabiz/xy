export type NumberCellData = {
  value: number
  type: 'NUMBER'
}

export function from(val: number): NumberCellData {
  return {
    type: 'NUMBER',
    value: val,
  }
}