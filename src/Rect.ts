import Point from './Point'
import Size from './Size'
import { isObjectWithKey } from './util'

// export type Rect = {
//   origin: Point
//   size: Size
// }

export class Rect {
  public origin: Point
  public size: Size

  constructor(origin: Point, size: Size) {
    // For negative sizes, we're going to shift the origin to the top-left
    // position and set size to positive.
    //
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

    this.origin = new Point(originX, originY)
    this.size = new Size(width, height)
  }

  static is(value: unknown): value is Rect {
    return isObjectWithKey(value, 'origin')
      && isObjectWithKey(value, 'size')
      && Point.is(value.origin)
      && Size.is(value.size)
  }

  copy(): Rect {
    return new Rect(
      this.origin.copy(),
      this.size.copy(),
    )
  }

  /**
   * Returns a point representing the "opposite corner" of a Rect
   */
  get farPoint(): Point {
    return new Point(
      // -1 to give last inclusive point
      this.origin.x + this.size.w - 1,
      this.origin.y + this.size.h - 1,
    )
  }

  expandTo(point: Point): Rect {
    const farPoint = this.farPoint

    const newOriginX  = Math.min(this.origin.x, point.x)
    const newOriginY  = Math.min(this.origin.y, point.y)
    const newWidth    = Math.max(farPoint.x, point.x) - newOriginX + 1
    const newHeight   = Math.max(farPoint.y, point.y) - newOriginY + 1

    return new Rect(
      new Point(newOriginX, newOriginY),
      new Size(newWidth, newHeight),
    )
  }

  static fromPoints(points: Point[]): Rect | null {
    if (points.length < 1)
      return null

    let rect = new Rect(points[0], new Size(1,1))

    for (const point of points) {
      rect = rect.expandTo(point)
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
  intersection(other: Rect | null): Rect | null {
    if (other == null) return null

    const top    = Math.max(this.origin.y, other.origin.y)
    const bottom = Math.min(this.farPoint.y, other.farPoint.y)
    const left   = Math.max(this.origin.x, other.origin.x)
    const right  = Math.min(this.farPoint.x, other.farPoint.x)

    if (bottom < top || right < left)
      return null

    return Rect.fromPoints([
      new Point(left, top),
      new Point(right, bottom),
    ])
  }

  isEqual(other: Rect | null): boolean {
    if (other == null) return false

    return this.origin.isEqual(other.origin)
        && this.size.isEqual(other.size)
  }

  iteratePoints(fn: (point: Point) => void): void {
    for (let y = this.origin.y; y < this.origin.y + this.size.h; y++) {
      for (let x = this.origin.x; x < this.origin.x + this.size.w; x++) {
        fn(new Point(x, y))
      }
    }
  }

  shiftRect({ by }: { by: Point }): Rect {
    return new Rect(
      this.origin.shiftPoint({ by }),
      this.size.copy(),
    )
  }

  splitRectAfterY(y: number): [ Rect | null, Rect | null ] {
    if (y < this.origin.y) {
      return [ null, this.copy() ]
    } else if (y >= this.farPoint.y) {
      return [ this.copy(), null ]
    } else {
      return [
        new Rect(
          this.origin.copy(),
          new Size(this.size.w, y - this.origin.y + 1),
        ),
        new Rect(
          new Point(this.origin.x, y + 1),
          new Size(this.size.w, this.farPoint.y - y)
        ),
      ]
    }
  }
}

export default Rect

