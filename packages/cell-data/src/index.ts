import * as txt from './text-data'
import * as num from './number-data'


export type NilCellData = {
  type: 'NIL'
}

export type CellData      = txt.TextCellData | num.NumberCellData | NilCellData
export type CellPrimitive = string | number | null

export function from(val: unknown): CellData {
  if (typeof val === 'string') {
    return txt.from(val)
  } else if (typeof val === 'number') {
    return num.from(val)
  } else if (val == null) {
    return {
      type: 'NIL',
    }
  }

  throw new Error(`Unrecognized primative type: ${val}`)
}

export function value(cv: CellData | undefined): CellPrimitive | undefined {
  if (cv === undefined) return undefined

  switch (cv.type) {
    case 'NIL':
      return null
    case 'NUMBER':
      return Number(cv.value)
    case 'TEXT':
      return cv.value
  }
}