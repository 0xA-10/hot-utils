/**
 * Transform object values using a mapper function (mapValues equivalent).
 *
 * @param obj - Input object
 * @param mapper - Function that takes (value, key) and returns new value
 * @returns New object with transformed values
 */
export function mapObjectHot<K extends PropertyKey, V, R>(
  obj: Record<K, V>,
  mapper: (value: V, key: K) => R,
): Record<K, R> {
  const result = {} as Record<K, R>;
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      result[key] = mapper(obj[key], key as K);
    }
  }
  return result;
}
