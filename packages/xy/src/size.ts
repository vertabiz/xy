
export type Size = {
  w: number
  h: number
}

export function isEqual( size: Size, other: Size ): boolean {
  return size.h == other.h
      && size.w == other.w
}

/**
 * Returns a Size-shaped object.
 */
export function newSize(w: number, h: number): Size {
  return { w, h }
}

