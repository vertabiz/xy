import type { Rect } from '@vertabiz/xy'
import * as xy from '@vertabiz/xy'
import * as refs from '@vertabiz/range-ref'
import { isNotNil } from './util'

export type CellMap<T = string> = Map<string, T>

export function newCellMap<T>(values: Record<string, T> = {}): CellMap<T> {
  const map = new Map<string, T>()

  Object.entries(values)
    .forEach(([k, v]) => {
      map.set(k, v)
    })

  return map
}

export function rectFor(map: CellMap): Rect | null {
  const cellKeys = Array.from(map.keys())

  if (cellKeys.length < 1) return null

  return xy.rectForPoints( cellKeys.map(refs.originOf).filter(isNotNil) )
}