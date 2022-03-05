
export type Point = {
  x: number
  y: number
}

/**
 * Returns true if one Point is equal (value-wise) to another.
 *
 * ```ts
 *    isEqual({x: 5, y: 10}, {x: 5, y: 10})   # => true
 * ```
 */
export function isEqual(point: Point, other: Point): boolean {
  return point.x == other.x
      && point.y == other.y
}

export function newPoint(x: number, y: number): Point {
  return { x, y }
}

