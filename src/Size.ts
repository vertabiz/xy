
// export type Size = {
//   w: number
//   h: number
// }

export class Size {
  w: number
  h: number

  constructor(
    w: number,
    h: number,
  ) {
    this.w = w
    this.h = h
  }

  isEqual(other: Size): boolean {
    return this.h == other.h
        && this.w == other.w
  }

  copy(): Size {
    return new Size(this.w, this.h)
  }

  static is(obj: unknown) {
    return obj instanceof Size
  }
}

export default Size

// export function isSize(value: unknown): value is Size {
//   return isObjectWithKey(value, 'w')
//     && isObjectWithKey(value, 'h')
//     && typeof value.w == 'number'
//     && typeof value.h == 'number'
// }


