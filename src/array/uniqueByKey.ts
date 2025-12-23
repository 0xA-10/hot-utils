import type { KeySelector } from '../types.js';

/**
 * Remove duplicates from an array based on a key selector function.
 * Keeps the first occurrence of each unique key.
 *
 * @param arr - Input array
 * @param keySelector - Function that returns a key for each item
 * @returns New array with duplicates removed
 */
export function uniqueByKeyFast<T, K extends PropertyKey>(arr: readonly T[], keySelector: KeySelector<T, K>): T[] {
  const seen = new Map<K, T>();
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]!;
    const key = keySelector(item, i);
    if (!seen.has(key)) {
      seen.set(key, item);
    }
  }
  return [...seen.values()];
}
