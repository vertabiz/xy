import { Point, isPointEqual, newPoint, isPoint, shiftPoint } from './point'
import { Size, isSizeEqual, newSize, isSize } from './size'
import { isObjectWithKey } from './util'

export type Rect = {
  origin: Point
  size: Size
}

export function isRect(value: unknown): value is Rect {
  return isObjectWithKey(value, 'origin')
    && isObjectWithKey(value, 'size')
    && isPoint(value.origin)
    && isSize(value.size)
}

export function expandTo(rect: Rect, point: Point): void {
  const farPoint = farPointOf(rect)

  const newOriginX  = Math.min(rect.origin.x, point.x)
  const newOriginY  = Math.min(rect.origin.y, point.y)
  const newWidth    = Math.max(farPoint.x, point.x) - newOriginX + 1
  const newHeight   = Math.max(farPoint.y, point.y) - newOriginY + 1

  rect.origin.x = newOriginX
  rect.origin.y = newOriginY
  rect.size.w = newWidth
  rect.size.h = newHeight
}

/**
 * Returns a point representing the "opposite corner" of a Rect
 */
export function farPointOf(rect: Rect): Point
export function farPointOf(rect: null): null
export function farPointOf(rect: Rect | null): Point | null {
  if (rect == null)
    return null

  return newPoint(
    // -1 to give last inclusive point
    rect.origin.x + rect.size.w - 1,
    rect.origin.y + rect.size.h - 1,
  )
}

export function rectForPoints(points: Point[]): Rect | null {
  if (points.length < 1)
    return null

  const rect = newRect(points[0], newSize(1,1))

  for (const point of points) {
    expandTo(rect, point)
  }

  return rect
}

/**
 * Returns a Rect representing the intersection of the
 * two provided Rects, or null
 *
 *    ┌─────────┐
 *    │         │
 *    │    ╔════╬──┐
 *    │    ║    ║  │
 *    └────╬════╝  │
 *         │       │
 *         └───────┘
 *
 */
export function intersection(rect: Rect | null, other: Rect | null): Rect | null {
  if (rect == null || other == null)
    return null

  const top    = Math.max(rect.origin.y, other.origin.y)
  const bottom = Math.min(farPointOf(rect).y, farPointOf(other).y)
  const left   = Math.max(rect.origin.x, other.origin.x)
  const right  = Math.min(farPointOf(rect).x, farPointOf(other).x)

  if (bottom < top || right < left)
    return null

  return rectForPoints([
    newPoint(left, top),
    newPoint(right, bottom),
  ])
}

export function isRectEqual(rect: Rect | null, other: Rect | null): boolean {
  if (rect == null || other == null)
    return rect == null && other == null

  return isPointEqual(rect.origin, other.origin)
      && isSizeEqual(rect.size, other.size)
}

export function newRect(origin: Point, size: Size): Rect {
  const width  = Math.abs(size.w)
  const height = Math.abs(size.h)

  const wasNegativeWidth   = size.w < 0
  const wasNegativeHeight  = size.h < 0

  const originX = wasNegativeWidth
    ? origin.x - width
    : origin.x
  const originY = wasNegativeHeight
    ? origin.y - height
    : origin.y

  return {
    origin: {
      x: originX,
      y: originY,
    },
    size: {
      w: width,
      h: height,
    },
  }
}

export function shiftRect(rect: Rect, { by }: { by: Point }): Rect {
  return newRect(
    shiftPoint(rect.origin, { by }),
    { ...rect.size },
  )
}

export function splitRectAfterY(rect: Rect | null, y: number): [ Rect | null, Rect | null ] {
  if (rect == null)
    return [ null, null ]

  if (y < rect.origin.y) {
    return [ null, rect ]
  } else if (y >= farPointOf(rect).y) {
    return [ rect, null ]
  } else {
    return [
      newRect(
        rect.origin,
        newSize(rect.size.w, y - rect.origin.y + 1),
      ),
      newRect(
        newPoint(rect.origin.x, y + 1),
        newSize(rect.size.w, farPointOf(rect).y - y)
      ),
    ]
  }
}