import type { ArrayPredicate } from '../types.js';

/**
 * Find all indices where predicate returns true.
 *
 * @param arr - Input array
 * @param predicate - Function that returns true/false for each item
 * @returns Array of indices where predicate returned true
 */
export function findIndicesFast<T>(arr: readonly T[], predicate: ArrayPredicate<T>): number[] {
  const indices: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i]!, i, arr as T[])) {
      indices.push(i);
    }
  }
  return indices;
}
