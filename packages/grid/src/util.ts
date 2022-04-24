
export function isNil<T>(val: T | null | undefined): val is null | undefined {
  return val == null || val == undefined
}

export function isNotNil<T>(val: T | null | undefined): val is T {
  return !isNil(val)
}

export function must<T>(obj: T | null | undefined, msg?: string): T {
  if (obj == null || obj == undefined) throw new Error(`must failed: ${msg ?? 'obj required but was not present'}`)

  return obj
}

export function is<T>(fn: () => T): T {
  return fn()
}