import { CellData } from '@vertabiz/cell-data'
import { Range } from '@vertabiz/range-ref'
import type { Rect } from '@vertabiz/xy'
import * as xy from '@vertabiz/xy'

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
  if (map.size < 1) return null

  return xy.rectForPoints(
    Array.from(map.keys())
      .map(Range.fromAddress)
      .map(_ => _.origin)
  )
}

export function asObject(map: CellMap): Record<string, CellData | undefined> {
  return Object.fromEntries(map.entries())
}