
export function isNil<T>(val: T | null | undefined): val is null | undefined {
  return val == null || val == undefined
}

export function isNotNil<T>(val: T | null | undefined): val is T {
  return !isNil(val)
}

export function must<T>(obj: T | null | undefined): T {
  if (obj == null || obj == undefined) throw new Error(`must failed`)

  return obj
}