import type { Rect } from '@vertabiz/xy'
import * as xy from '@vertabiz/xy'
import * as refs from '@vertabiz/range-ref'
import { isNotNil } from './util'
import { CellData } from '@vertabiz/cell-data'

export type CellMap<T = string> = Map<string, T>

export function newCellMap<T>(values: Record<string, T> = {}): CellMap<T> {
  const map = new Map<string, T>()

  Object.entries(values)
    .forEach(([k, v]) => {
      map.set(k, v)
    })

  return map
}

export function insertCells<T>(map: CellMap<T>, other: CellMap<T>): void {
  for (const [key, value] of other.entries()) {
    map.set(key, value)
  }
}

export function rectFor<T>(map: CellMap<T>): Rect | null {
  const cellKeys = Array.from(map.keys())

  if (cellKeys.length < 1) return null

  return xy.rectForPoints( cellKeys.map(refs.originOf).filter(isNotNil) )
}

export function asObject<T>(map: CellMap<T>): Record<string, T> {
  return Object.fromEntries(map.entries())
}