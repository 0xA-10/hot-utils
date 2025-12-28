/**
 * Create an object composed of picked properties.
 *
 * @param obj - Source object
 * @param keys - Property keys to pick
 * @returns New object with only the specified keys
 *
 * @example
 * pickHot({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { a: 1, c: 3 }
 */
export function pickHot<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!;
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Create an object composed of properties that satisfy the predicate.
 * Memory-optimized: uses O(1) iteration memory.
 *
 * @param obj - Source object
 * @param predicate - Function to test each property
 * @returns New object with properties that pass the test
 *
 * @example
 * pickByHot({ a: 1, b: null, c: 3 }, v => v != null)
 * // { a: 1, c: 3 }
 */
export function pickByHot<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> {
  const result = {} as Partial<T>;
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const value = obj[key];
      if (predicate(value as T[keyof T], key as keyof T)) {
        result[key as keyof T] = value;
      }
    }
  }
  return result;
}

/**
 * Create an object composed of properties that satisfy the predicate.
 * Speed-optimized: ~15% faster but allocates O(n) intermediate keys array.
 *
 * @param obj - Source object
 * @param predicate - Function to test each property
 * @returns New object with properties that pass the test
 *
 * @example
 * pickByHotFast({ a: 1, b: null, c: 3 }, v => v != null)
 * // { a: 1, c: 3 }
 */
export function pickByHotFast<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> {
  const keys = Object.keys(obj) as (keyof T)[];
  const result = {} as Partial<T>;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!;
    const value = obj[key];
    if (predicate(value as T[keyof T], key)) {
      result[key] = value;
    }
  }
  return result;
}
