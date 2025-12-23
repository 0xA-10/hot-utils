import type { EqualityPredicate } from '../types.js';

/**
 * Remove duplicates from an array based on an equality predicate.
 * Keeps the first occurrence of each unique item.
 * O(n^2) complexity - use uniqueByKeyFast when possible.
 *
 * @param arr - Input array
 * @param predicate - Function that returns true if two items are equal
 * @returns New array with duplicates removed
 */
export function uniqueByPredicateFast<T>(arr: readonly T[], predicate: EqualityPredicate<T>): T[] {
  const result: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]!;
    let isDuplicate = false;
    for (let j = 0; j < result.length; j++) {
      if (predicate(item, result[j]!)) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      result.push(item);
    }
  }
  return result;
}
