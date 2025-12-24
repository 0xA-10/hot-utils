/**
 * Create an object with specified properties omitted.
 *
 * @param obj - Source object
 * @param keys - Property keys to omit
 * @returns New object without the specified keys
 *
 * @example
 * omitHot({ a: 1, b: 2, c: 3 }, ['b']) // { a: 1, c: 3 }
 */
export function omitHot<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
  const keysToOmit = new Set<PropertyKey>(keys);
  const result = {} as Omit<T, K>;

  for (const key in obj) {
    if (Object.hasOwn(obj, key) && !keysToOmit.has(key)) {
      (result as Record<string, unknown>)[key] = obj[key];
    }
  }

  return result;
}

/**
 * Create an object with properties that don't satisfy the predicate.
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
