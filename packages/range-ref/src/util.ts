// export type Brand<K, T> = K & { __brand: T }

export function must<T>(obj: T | null | undefined, msg?: string): T {
  if (obj == null || obj == undefined) throw new Error(msg ?? `must failed`)

  return obj
}