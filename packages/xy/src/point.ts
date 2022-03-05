
export type Point = {
  x: number
  y: number
}

export function isEqual(point: Point, other: Point): boolean {
  return point.x == other.x
      && point.y == other.y
}

export function newPoint(x: number, y: number): Point {
  return { x, y }
}

