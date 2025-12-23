import type { KeySelector } from '../types.js';

/**
 * Count occurrences of items by a key selector function.
 *
 * @param arr - Input array
 * @param keySelector - Function that returns a key for each item
 * @returns Object mapping key to count
 */
export function countByFast<T, K extends PropertyKey>(
  arr: readonly T[],
  keySelector: KeySelector<T, K>,
): Record<K, number> {
  const result = {} as Record<K, number>;
  for (let i = 0; i < arr.length; i++) {
    const key = keySelector(arr[i]!, i);
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
}
