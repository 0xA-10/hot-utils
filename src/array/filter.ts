import type { ArrayPredicate } from '../types.js';

/**
 * Filter an array using a for-loop for maximum performance.
 * Supports type guards for type narrowing.
 *
 * @param arr - Input array
 * @param predicate - Function that returns true/false for each item
 * @returns New filtered array
 */
export function filterFast<T, S extends T>(
  arr: readonly T[],
  predicate: (item: T, index: number, array: readonly T[]) => item is S,
): S[];
export function filterFast<T>(arr: readonly T[], predicate: ArrayPredicate<T>): T[];
export function filterFast<T>(arr: readonly T[], predicate: ArrayPredicate<T>): T[] {
  const result: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]!;
    if (predicate(item, i, arr as T[])) {
      result.push(item);
    }
  }
  return result;
}
