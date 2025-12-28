/**
 * Transform object keys using a mapper function.
 * Memory-optimized: uses O(1) iteration memory.
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
      const value = obj[key as K];
      result[mapper(key as K, value)] = value;
    }
  }
  return result;
}

/**
 * Transform object keys using a mapper function.
 * Speed-optimized: ~15% faster but allocates O(n) intermediate keys array.
 *
 * @param obj - Input object
 * @param mapper - Function that takes (key, value) and returns new key
 * @returns New object with transformed keys
 */
export function mapKeysHotFast<K extends PropertyKey, V, NK extends PropertyKey>(
  obj: Record<K, V>,
  mapper: (key: K, value: V) => NK,
): Record<NK, V> {
  const keys = Object.keys(obj) as K[];
  const result = {} as Record<NK, V>;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!;
    result[mapper(key, obj[key])] = obj[key];
  }
  return result;
}
