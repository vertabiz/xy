import Size from './Size'

export function newMatrix<T>(size: Size, defaultValue: T): T[][] {
  return Array.from(new Array(size.h)).map(
    y => Array.from(new Array(size.w)).map(x => defaultValue)
  )
}