import { Point, isEqual as isPointEqual, newPoint } from './point'
import { Size, isEqual as isSizeEqual, newSize } from './size'

export type Rect = {
  origin: Point
  size: Size
}

export function expandTo(rect: Rect, point: Point): Rect {
  const farPoint = farPointOf(rect)

  const newOrigin = newPoint(
    Math.min(rect.origin.x, point.x),
    Math.min(rect.origin.y, point.y),
  )

  return newRect(
    newOrigin,
    newSize(
      Math.max(farPoint.x, point.x) - newOrigin.x + 1,
      Math.max(farPoint.y, point.y) - newOrigin.y + 1,
    ),
  )
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

  return expandTo(
    newRect( newPoint(left, top), newSize(1, 1) ),
    newPoint( right, bottom ),
  )
}

export function isEqual(rect: Rect | null, other: Rect | null): boolean {
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