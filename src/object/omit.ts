/**
 * Create an object with specified properties omitted.
 *
 * Uses spread + delete which is faster than iteration for most cases.
 *
 * @param obj - Source object
 * @param keys - Property keys to omit
 * @returns New object without the specified keys
 *
 * @example
 * omitHot({ a: 1, b: 2, c: 3 }, ['b']) // { a: 1, c: 3 }
 */
export function omitHot<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
  const result = { ...obj } as Record<PropertyKey, unknown>;
  for (let i = 0; i < keys.length; i++) {
    delete result[keys[i] as PropertyKey];
  }
  return result as Omit<T, K>;
}

/**
 * Create an object with properties that don't satisfy the predicate.
 * Memory-optimized: uses O(1) iteration memory.
 *
 * @param obj - Source object
 * @param predicate - Function to test each property
 * @returns New object with properties that fail the test
 *
 * @example
 * omitByHot({ a: 1, b: null, c: 3 }, v => v == null)
 * // { a: 1, c: 3 }
 */
export function omitByHot<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> {
  const result = {} as Partial<T>;
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const value = obj[key];
      if (!predicate(value as T[keyof T], key as keyof T)) {
        result[key as keyof T] = value;
      }
    }
  }
  return result;
}

/**
 * Create an object with properties that don't satisfy the predicate.
 * Speed-optimized: ~15% faster but allocates O(n) intermediate keys array.
 *
 * @param obj - Source object
 * @param predicate - Function to test each property
 * @returns New object with properties that fail the test
 *
 * @example
 * omitByHotFast({ a: 1, b: null, c: 3 }, v => v == null)
 * // { a: 1, c: 3 }
 */
export function omitByHotFast<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> {
  const keys = Object.keys(obj) as (keyof T)[];
  const result = {} as Partial<T>;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!;
    const value = obj[key];
    if (!predicate(value as T[keyof T], key)) {
      result[key] = value;
    }
  }
  return result;
}
