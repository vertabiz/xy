
// export type Point = {
//   x: number
//   y: number
// }

export class Point {
  public readonly x: number
  public readonly y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  copy(): Point {
    return new Point(this.x, this.y)
  }

  shiftPoint({ by }: { by: Point }): Point {
    return new Point(
      this.x + by.x,
      this.y + by.y,
    )
  }

  subtractPoint(subtrahend: Point): Point {
    return new Point(
      this.x - subtrahend.x,
      this.y - subtrahend.y,
    )
  }

  /**
   * Returns true if one Point is equal (value-wise) to another.
   *
   * ```ts
   *    isEqual({x: 5, y: 10}, {x: 5, y: 10})   # => true
   * ```
   */
  isEqual(other: Point): boolean {
    return this.x == other.x
        && this.y == other.y
  }

  static is(value: unknown): value is Point {
    return value instanceof Point
  }
}

export default Point