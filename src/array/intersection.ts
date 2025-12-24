import { toIteratee, type Iteratee } from '../internal/iteratee.js';

/**
 * Create an array of values that are included in all given arrays.
 * Uses SameValueZero equality (like Set).
 *
 * @param arrays - Arrays to inspect
 * @returns New array of intersecting values
 *
 * @example
 * intersectionHot([1, 2, 3], [2, 3, 4], [3, 4, 5]) // [3]
 */
export function intersectionHot<T>(...arrays: readonly T[][]): T[] {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return [...arrays[0]!];

  // Start with smallest array for efficiency
  let smallestIdx = 0;
  for (let i = 1; i < arrays.length; i++) {
    if (arrays[i]!.length < arrays[smallestIdx]!.length) {
      smallestIdx = i;
    }
  }

  const otherSets = arrays.filter((_, i) => i !== smallestIdx).map(arr => new Set(arr));

  const result: T[] = [];
  const seen = new Set<T>();
  const smallest = arrays[smallestIdx]!;

  for (let i = 0; i < smallest.length; i++) {
    const item = smallest[i]!;
    if (seen.has(item)) continue;
    seen.add(item);

    let inAll = true;
    for (const otherSet of otherSets) {
      if (!otherSet.has(item)) {
        inAll = false;
        break;
      }
    }

    if (inAll) {
      result.push(item);
    }
  }

  return result;
}

/**
 * Like intersectionHot, but accepts an iteratee to determine comparison key.
 *
 * @param arr1 - First array
 * @param arr2 - Second array
 * @param iteratee - Function or property path to derive comparison key
 * @returns New array of intersecting values (from first array)
 *
 * @example
 * intersectionByHot([{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 3 }], 'id')
 * // [{ id: 2 }]
 */
export function intersectionByHot<T>(arr1: readonly T[], arr2: readonly T[], iteratee: Iteratee<T, unknown>): T[] {
  const selector = toIteratee(iteratee);
  const otherKeys = new Set<unknown>();

  for (let i = 0; i < arr2.length; i++) {
    otherKeys.add(selector(arr2[i]!, i));
  }

  const result: T[] = [];
  const seenKeys = new Set<unknown>();

  for (let i = 0; i < arr1.length; i++) {
    const item = arr1[i]!;
    const key = selector(item, i);

    if (seenKeys.has(key)) continue;
    seenKeys.add(key);

    if (otherKeys.has(key)) {
      result.push(item);
    }
  }

  return result;
}
