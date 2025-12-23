import type { KeySelector } from '../types.js';

/**
 * Index array items by a key selector function.
 * Later items overwrite earlier items with the same key.
 *
 * @param arr - Input array
 * @param keySelector - Function that returns a key for each item
 * @returns Object mapping key to item
 */
export function indexByFast<T, K extends PropertyKey>(arr: readonly T[], keySelector: KeySelector<T, K>): Record<K, T> {
  const result = {} as Record<K, T>;
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]!;
    result[keySelector(item, i)] = item;
  }
  return result;
}
