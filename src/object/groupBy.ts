import type { KeySelector, MapKeySelector } from '../types.js';

/**
 * Group array items by a key selector function.
 * Returns a Map by default (better for non-string keys).
 *
 * @param arr - Input array
 * @param keySelector - Function that returns a key for each item
 * @returns Map of key to array of items
 */
export function groupByFast<T, K>(arr: readonly T[], keySelector: MapKeySelector<T, K>): Map<K, T[]>;

/**
 * Group array items by a key selector function.
 * Returns a plain object when asObject is true.
 *
 * @param arr - Input array
 * @param keySelector - Function that returns a key for each item
 * @param asObject - When true, returns a plain object instead of Map
 * @returns Object of key to array of items
 */
export function groupByFast<T, K extends PropertyKey>(
  arr: readonly T[],
  keySelector: KeySelector<T, K>,
  asObject: true,
): Record<K, T[]>;

export function groupByFast<T, K>(
  arr: readonly T[],
  keySelector: MapKeySelector<T, K>,
  asObject?: boolean,
): Map<K, T[]> | Record<PropertyKey, T[]> {
  if (asObject) {
    const result = {} as Record<PropertyKey, T[]>;
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]!;
      const key = keySelector(item, i) as PropertyKey;
      (result[key] ??= []).push(item);
    }
    return result;
  }

  const result = new Map<K, T[]>();
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]!;
    const key = keySelector(item, i);
    const group = result.get(key);
    if (group) {
      group.push(item);
    } else {
      result.set(key, [item]);
    }
  }
  return result;
}
