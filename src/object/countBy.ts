import { toIteratee, type Iteratee } from '../internal/iteratee.js';

/**
 * Count occurrences of items by a key selector.
 *
 * @param arr - Input array
 * @param iteratee - Function or property path string that returns a key for each item
 * @returns Object mapping key to count
 *
 * @example
 * countByHot(users, 'role')
 * countByHot(users, user => user.department)
 */
export function countByHot<T, K extends PropertyKey>(arr: readonly T[], iteratee: Iteratee<T, K>): Record<K, number> {
  const keySelector = toIteratee(iteratee);
  // Use Object.create(null) to avoid prototype pollution (e.g., key === 'toString')
  const result = Object.create(null) as Record<K, number>;
  for (let i = 0; i < arr.length; i++) {
    const key = keySelector(arr[i]!, i);
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
}
