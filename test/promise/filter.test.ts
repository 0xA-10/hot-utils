import { describe, expect, it } from 'vitest';
import { pFilterFast } from '../../src/promise/filter.js';

describe('pFilterFast', () => {
  it('filters array with async predicate', async () => {
    const result = await pFilterFast([1, 2, 3, 4, 5], async x => x > 2);
    expect(result).toEqual([3, 4, 5]);
  });

  it('handles empty arrays', async () => {
    const result = await pFilterFast([], async () => true);
    expect(result).toEqual([]);
  });

  it('returns empty when nothing passes', async () => {
    const result = await pFilterFast([1, 2, 3], async () => false);
    expect(result).toEqual([]);
  });

  it('preserves original order', async () => {
    const result = await pFilterFast([5, 4, 3, 2, 1], async x => x <= 3);
    expect(result).toEqual([3, 2, 1]);
  });

  it('respects concurrency limit', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;

    await pFilterFast(
      [1, 2, 3, 4, 5],
      async () => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        await new Promise(r => setTimeout(r, 10));
        concurrent--;
        return true;
      },
      { concurrency: 2 },
    );

    expect(maxConcurrent).toBe(2);
  });
});
