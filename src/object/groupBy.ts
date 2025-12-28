import { toIteratee, type Iteratee } from '../internal/iteratee.js';
import type { MapKeySelector } from '../types.js';

/**
 * Group array items by a key selector.
 * Returns a Map by default (better for non-string keys).
 *
 * @param arr - Input array
 * @param iteratee - Function or property path string that returns a key for each item
 * @returns Map of key to array of items
 *
 * @example
 * groupByHot(users, 'department')
 * groupByHot(users, user => user.role)
 */
export function groupByHot<T, K>(arr: readonly T[], iteratee: Iteratee<T, K> | MapKeySelector<T, K>): Map<K, T[]>;

/**
 * Group array items by a key selector.
 * Returns a plain object when asObject is true.
 *
 * @param arr - Input array
 * @param iteratee - Function or property path string that returns a key for each item
 * @param asObject - When true, returns a plain object instead of Map
 * @returns Object of key to array of items
 *
 * @example
 * groupByHot(users, 'department', true)
 */
export function groupByHot<T, K extends PropertyKey>(
  arr: readonly T[],
  iteratee: Iteratee<T, K>,
  asObject: true,
): Record<K, T[]>;

export function groupByHot<T, K>(
  arr: readonly T[],
  iteratee: Iteratee<T, K> | MapKeySelector<T, K>,
  asObject?: boolean,
): Map<K, T[]> | Record<PropertyKey, T[]> {
  const keySelector = toIteratee(iteratee as Iteratee<T, K>);

  if (asObject) {
    // Use Object.create(null) to avoid prototype pollution (e.g., key === 'toString')
    const result = Object.create(null) as Record<PropertyKey, T[]>;
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]!;
      const key = keySelector(item, i) as PropertyKey;
      (result[key] ??= []).push(item);
    }
    return result;
  }

  const result = new Map<K, T[]>();
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]!;
    const key = keySelector(item, i);
    const group = result.get(key);
    if (group) {
      group.push(item);
    } else {
      result.set(key, [item]);
    }
  }
  return result;
}
