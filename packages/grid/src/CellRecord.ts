import * as cell from '@vertabiz/cell-data'

/**
 * `CellRecord` is a data structure that roughly corresponds to a row in a
 * Grid. The key difference being that record values are keyed on header
 * names instead of cell addresses.
 */
export class CellRecord {

  private _values = new Map<string, cell.CellData>()

  constructor(values: Record<string, cell.CellData> = {}) {
    for (const [key, val] of Object.entries(values)) {
      this._values.set(key, val)
    }
  }

  /**
   * Sets an attribute of a DataRow to a value.
   *
   * If value already exists, throws exception.
   */
  set(
    headerName: string,
    value: cell.CellData | undefined,
  ): void {
    if (this._values.has(headerName))
      throw new Error(`Field already exists: ${headerName}`)

    if (value == undefined) {
      this._values.delete(headerName)
    } else {
      this._values.set(headerName, value)
    }
  }

  /**
   * Returns a field's value from a CellRecord
   */
  get(
    headerName: string,
  ): cell.CellData | undefined {
    return this._values.get(headerName)
  }

  getValue(
    headerName: string,
  ): cell.CellPrimitive | undefined {
    return cell.value(this.get(headerName))
  }

  asObject(): Record<string, cell.CellData | undefined> {
    return Object.fromEntries(this._values.entries())
  }
}

export default CellRecord