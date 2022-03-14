
export type TextCellData = {
  value: string
  type: 'TEXT'
}

export function from(val: string): TextCellData {
  return {
    type: 'TEXT',
    value: val,
  }
}