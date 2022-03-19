
/**
 * @see https://stackoverflow.com/a/70029241
 */
export function isObjectWithKey<T, K extends string>(
  o: T, k: K
): o is T & object & Record<K, unknown> {
  return typeof o === "object" && o !== null && k in o;
}