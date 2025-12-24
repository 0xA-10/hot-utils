import { toIteratee, type Iteratee } from '../internal/iteratee.js';

/**
 * Remove duplicates from an array based on a key selector.
 * Keeps the first occurrence of each unique key.
 *
 * @param arr - Input array
 * @param iteratee - Function or property path string that returns a key for each item
 * @returns New array with duplicates removed
 *
 * @example
 * // Using function
 * uniqueByKeyHot(users, user => user.id)
 *
 * @example
 * // Using property shorthand
 * uniqueByKeyHot(users, 'id')
 *
 * @example
 * // Using deep path
 * uniqueByKeyHot(users, 'profile.email')
 */
export function uniqueByKeyHot<T, K extends PropertyKey>(arr: readonly T[], iteratee: Iteratee<T, K>): T[] {
  const keySelector = toIteratee(iteratee);
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
