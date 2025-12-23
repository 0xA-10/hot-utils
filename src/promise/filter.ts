import type { AsyncPredicate } from '../types.js';
import { pMapFast, type PMapOptions } from './map.js';

/**
 * Filter an array with async predicate, with optional concurrency limit.
 *
 * @param items - Input array
 * @param predicate - Async function that returns boolean for each item
 * @param options - Options including concurrency limit
 * @returns Promise resolving to filtered array
 */
export async function pFilterFast<T>(
  items: readonly T[],
  predicate: AsyncPredicate<T>,
  options: PMapOptions = {},
): Promise<T[]> {
  const results = await pMapFast(items, async (item, i) => ({ item, keep: await predicate(item, i) }), options);
  return results.filter(r => r.keep).map(r => r.item);
}
