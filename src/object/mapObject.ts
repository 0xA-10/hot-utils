/**
 * Transform object values using a mapper function.
 *
 * @param obj - Input object
 * @param mapper - Function that takes (value, key) and returns new value
 * @returns New object with transformed values
 */
export function mapValuesHot<K extends PropertyKey, V, R>(
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

/**
 * Transform object keys and values using mapper functions.
 *
 * @param obj - Input object
 * @param keyMapper - Function that takes (key, value) and returns new key
 * @param valueMapper - Function that takes (value, key) and returns new value
 * @returns New object with transformed keys and values
 */
export function mapObjectHot<K extends PropertyKey, V, NK extends PropertyKey, NV>(
  obj: Record<K, V>,
  keyMapper: (key: K, value: V) => NK,
  valueMapper: (value: V, key: K) => NV,
): Record<NK, NV> {
  const result = {} as Record<NK, NV>;
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const newKey = keyMapper(key as K, obj[key]);
      result[newKey] = valueMapper(obj[key], key as K);
    }
  }
  return result;
}
