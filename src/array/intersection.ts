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

  const arr1 = arrays[0]!;

  // Optimized path for 2 arrays (most common case)
  if (arrays.length === 2) {
    const set2 = new Set(arrays[1]!);
    const result: T[] = [];

    // Delete from set2 after match to handle duplicates in arr1
    // This avoids needing a separate "seen" Set
    for (let i = 0; i < arr1.length; i++) {
      const item = arr1[i]!;
      if (set2.delete(item)) {
        result.push(item);
      }
    }
    return result;
  }

  // Multi-array path: build Sets without intermediate arrays
  const otherSets: Set<T>[] = [];
  let smallestIdx = 0;
  let smallestLen = arr1.length;

  for (let i = 1; i < arrays.length; i++) {
    const arr = arrays[i]!;
    otherSets.push(new Set(arr));
    if (arr.length < smallestLen) {
      smallestLen = arr.length;
      smallestIdx = i;
    }
  }

  // If first array isn't smallest, add it to sets and use smallest for iteration
  let iterateArr: readonly T[];
  if (smallestIdx === 0) {
    iterateArr = arr1;
  } else {
    otherSets[smallestIdx - 1] = new Set(arr1);
    iterateArr = arrays[smallestIdx]!;
  }

  const result: T[] = [];
  const seen = new Set<T>();

  for (let i = 0; i < iterateArr.length; i++) {
    const item = iterateArr[i]!;
    if (seen.has(item)) continue;
    seen.add(item);

    let inAll = true;
    for (let j = 0; j < otherSets.length; j++) {
      if (!otherSets[j]!.has(item)) {
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
 * Supports variadic arrays like intersectionHot.
 *
 * @param arrays - Arrays to inspect (2 or more)
 * @param iteratee - Function or property path to derive comparison key
 * @returns New array of intersecting values (from first array)
 *
 * @example
 * intersectionByHot([{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 3 }], 'id')
 * // [{ id: 2 }]
 *
 * @example
 * intersectionByHot([{ id: 1 }, { id: 2 }], [{ id: 2 }], [{ id: 2 }, { id: 3 }], 'id')
 * // [{ id: 2 }]
 */
export function intersectionByHot<T>(arr1: readonly T[], arr2: readonly T[], iteratee: Iteratee<T, unknown>): T[];
export function intersectionByHot<T>(
  arr1: readonly T[],
  arr2: readonly T[],
  arr3: readonly T[],
  iteratee: Iteratee<T, unknown>,
): T[];
export function intersectionByHot<T>(
  arr1: readonly T[],
  arr2: readonly T[],
  arr3: readonly T[],
  arr4: readonly T[],
  iteratee: Iteratee<T, unknown>,
): T[];
export function intersectionByHot<T>(...args: (readonly T[] | Iteratee<T, unknown>)[]): T[] {
  if (args.length < 2) return [];

  const iteratee = args[args.length - 1] as Iteratee<T, unknown>;
  const arrays = args.slice(0, -1) as unknown as readonly T[][];

  if (arrays.length === 0) return [];
  if (arrays.length === 1) return [...arrays[0]!];

  const selector = toIteratee(iteratee);
  const arr1 = arrays[0]!;

  // Optimized path for 2 arrays (most common case)
  if (arrays.length === 2) {
    const otherKeys = new Set<unknown>();
    const arr2 = arrays[1]!;

    for (let i = 0; i < arr2.length; i++) {
      otherKeys.add(selector(arr2[i]!, i));
    }

    const result: T[] = [];

    // Delete from otherKeys after match to handle duplicates in arr1
    for (let i = 0; i < arr1.length; i++) {
      const item = arr1[i]!;
      const key = selector(item, i);

      if (otherKeys.delete(key)) {
        result.push(item);
      }
    }

    return result;
  }

  // Multi-array path: build key Sets for all other arrays
  const otherKeySets: Set<unknown>[] = [];

  for (let i = 1; i < arrays.length; i++) {
    const arr = arrays[i]!;
    const keySet = new Set<unknown>();
    for (let j = 0; j < arr.length; j++) {
      keySet.add(selector(arr[j]!, j));
    }
    otherKeySets.push(keySet);
  }

  const result: T[] = [];
  const seenKeys = new Set<unknown>();

  for (let i = 0; i < arr1.length; i++) {
    const item = arr1[i]!;
    const key = selector(item, i);

    if (seenKeys.has(key)) continue;
    seenKeys.add(key);

    let inAll = true;
    for (let j = 0; j < otherKeySets.length; j++) {
      if (!otherKeySets[j]!.has(key)) {
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
