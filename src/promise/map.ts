import type { AsyncMapper } from '../types.js';

export interface PMapOptions {
  /**
   * Number of concurrent promises. Defaults to Infinity (all at once).
   */
  concurrency?: number;
}

/**
 * Map over an array with async function, with optional concurrency limit.
 * Results are returned in the same order as input.
 *
 * @param items - Input array
 * @param mapper - Async function to apply to each item
 * @param options - Options including concurrency limit
 * @returns Promise resolving to mapped array
 */
export async function pMapFast<T, R>(
  items: readonly T[],
  mapper: AsyncMapper<T, R>,
  options: PMapOptions = {},
): Promise<R[]> {
  const { concurrency = Infinity } = options;
  const results: R[] = new Array(items.length);

  if (concurrency === Infinity || concurrency >= items.length) {
    const promises = items.map((item, i) =>
      Promise.resolve(mapper(item, i)).then(r => {
        results[i] = r;
      }),
    );
    await Promise.all(promises);
    return results;
  }

  let index = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const i = index++;
      results[i] = await mapper(items[i]!, i);
    }
  });

  await Promise.all(workers);
  return results;
}
