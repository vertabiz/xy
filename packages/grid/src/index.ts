export * from './grid'
export * from './region'

import * as cell from '@vertabiz/cell-data'

export type Row = (cell.CellData | undefined)[]
