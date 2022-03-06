import { isObjectWithKey } from './util'

export type Size = {
  w: number
  h: number
}

export function isSize(value: unknown): value is Size {
  return isObjectWithKey(value, 'w')
    && isObjectWithKey(value, 'h')
    && typeof value.w == 'number'
    && typeof value.h == 'number'
}


export function isSizeEqual( size: Size, other: Size ): boolean {
  return size.h == other.h
      && size.w == other.w
}

/**
 * Returns a Size-shaped object.
 */
export function newSize(w: number, h: number): Size {
  return { w, h }
}

