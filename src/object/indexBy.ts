import { toIteratee, type Iteratee } from '../internal/iteratee.js';

/**
 * Index array items by a key selector.
 * Later items overwrite earlier items with the same key.
 *
 * @param arr - Input array
 * @param iteratee - Function or property path string that returns a key for each item
 * @returns Object mapping key to item
 *
 * @example
 * indexByHot(users, 'id')
 * indexByHot(users, user => user.email)
 */
export function indexByHot<T, K extends PropertyKey>(arr: readonly T[], iteratee: Iteratee<T, K>): Record<K, T> {
  const keySelector = toIteratee(iteratee);
  const result = {} as Record<K, T>;
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]!;
    result[keySelector(item, i)] = item;
  }
  return result;
}
