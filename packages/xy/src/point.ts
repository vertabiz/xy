import { isObjectWithKey } from './util'

export type Point = {
  x: number
  y: number
}

export function isPoint(value: unknown): value is Point {
  return isObjectWithKey(value, 'x')
    && isObjectWithKey(value, 'y')
    && typeof value.x == 'number'
    && typeof value.y == 'number'
}

export function shiftPoint(point: Point, { by }: { by: Point }): Point {
  return {
    x: point.x + by.x,
    y: point.y + by.y,
  }
}

/**
 * Returns true if one Point is equal (value-wise) to another.
 *
 * ```ts
 *    isEqual({x: 5, y: 10}, {x: 5, y: 10})   # => true
 * ```
 */
export function isPointEqual(point: Point, other: Point): boolean {
  return point.x == other.x
      && point.y == other.y
}

export function newPoint(x: number, y: number): Point {
  return { x, y }
}

