import { CellData } from '@vertabiz/cell-data'
import { Range } from '@vertabiz/range-ref'
import { Rect } from '@vertabiz/xy'

// export type CellMap = Map<string, CellData | undefined>

type DataStruct = Map<string, CellData | undefined>

export class CellMap {
  private map: DataStruct = new Map()

  constructor(map?: DataStruct) {
    if (map) {
      map.forEach((v, k) => {
        this.map.set(k, v)
      })
    }
  }

  get(key: string): CellData | undefined {
    return this.map.get(key)
  }

  set(key: string, value: CellData): this {
    this.map.set(key, value)

    return this
  }

  entries(): IterableIterator<[string, CellData | undefined]> {
    return this.map.entries()
  }

  insert(other: CellMap): void {
    for (const [key, value] of other.entries()) {
      this.map.set(key, value)
    }
  }

  rect(): Rect | null {
    if (this.map.size < 1) return null

    return Rect.fromPoints(
      Array.from(this.map.keys())
        .map(Range.fromAddress)
        .map(_ => _.origin)
    )
  }

  get size(): number {
    return this.map.size
  }

  copy(): CellMap {
    return CellMap.fromObject(this.asObject())
  }

  asObject(): Record<string, CellData | undefined> {
    return Object.fromEntries(this.map.entries())
  }


  static fromObject(values: Record<string, CellData | undefined> = {}): CellMap {
    const map = new Map<string, CellData | undefined>()

    Object.entries(values)
      .forEach(([k, v]) => {
        map.set(k, v)
      })

    return new CellMap(map)
  }
}

export default CellMap
