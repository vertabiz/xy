import type { Rect } from '@vertabiz/xy'
import * as xy from '@vertabiz/xy'
import * as refs from '@vertabiz/range-ref'
import { isNotNil } from './util'
import { CellData } from '@vertabiz/cell-data'

export type CellMap = Map<string, CellData | undefined>

export function newCellMap(values: Record<string, CellData | undefined> = {}): CellMap {
  const map = new Map<string, CellData | undefined>()

  Object.entries(values)
    .forEach(([k, v]) => {
      map.set(k, v)
    })

  return map
}

export function insertCells(map: CellMap, other: CellMap): void {
  for (const [key, value] of other.entries()) {
    map.set(key, value)
  }
}

export function rectFor<T>(map: CellMap): Rect | null {
  const cellKeys = Array.from(map.keys())

  if (cellKeys.length < 1) return null

  return xy.rectForPoints( cellKeys.map(refs.originOf).filter(isNotNil) )
}

export function asObject(map: CellMap): Record<string, CellData | undefined> {
  return Object.fromEntries(map.entries())
}