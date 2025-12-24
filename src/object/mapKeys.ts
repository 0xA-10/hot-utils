/**
 * Transform object keys using a mapper function.
 *
 * @param obj - Input object
 * @param mapper - Function that takes (key, value) and returns new key
 * @returns New object with transformed keys
 */
export function mapKeysHot<K extends PropertyKey, V, NK extends PropertyKey>(
  obj: Record<K, V>,
  mapper: (key: K, value: V) => NK,
): Record<NK, V> {
  const result = {} as Record<NK, V>;
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const newKey = mapper(key as K, obj[key]);
      result[newKey] = obj[key];
    }
  }
  return result;
}
