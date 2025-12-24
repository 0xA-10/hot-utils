import type { ArrayPredicate } from '../types.js';

/**
 * Split an array into two arrays based on a predicate.
 * First array contains items that pass the predicate, second contains items that fail.
 *
 * @param arr - Input array
 * @param predicate - Function that returns true/false for each item
 * @returns Tuple of [passing, failing] arrays
 */
export function partitionHot<T>(arr: readonly T[], predicate: ArrayPredicate<T>): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]!;
    if (predicate(item, i, arr as T[])) {
      pass.push(item);
    } else {
      fail.push(item);
    }
  }
  return [pass, fail];
}
