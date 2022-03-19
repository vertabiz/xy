export * from './grid'
export * from './region'
export * from './rows'

import * as cell from '@vertabiz/cell-data'

export type GridRecord = Record<string, cell.CellData>

