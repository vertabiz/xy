
export function isNil<T>(val: T | null | undefined): val is null | undefined {
  return val == null || val == undefined
}

export function isNotNil<T>(val: T | null | undefined): val is T {
  return !isNil(val)
}