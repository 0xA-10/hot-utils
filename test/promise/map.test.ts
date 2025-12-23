import { describe, expect, it } from 'vitest';
import { pMapFast } from '../../src/promise/map.js';

describe('pMapFast', () => {
  it('maps array with async function', async () => {
    const result = await pMapFast([1, 2, 3], async x => x * 2);
    expect(result).toEqual([2, 4, 6]);
  });

  it('preserves order', async () => {
    const result = await pMapFast([3, 1, 2], async x => {
      await new Promise(r => setTimeout(r, x * 10));
      return x;
    });
    expect(result).toEqual([3, 1, 2]);
  });

  it('handles empty arrays', async () => {
    const result = await pMapFast([], async x => x);
    expect(result).toEqual([]);
  });

  it('respects concurrency limit', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;

    await pMapFast(
      [1, 2, 3, 4, 5],
      async () => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        await new Promise(r => setTimeout(r, 10));
        concurrent--;
      },
      { concurrency: 2 },
    );

    expect(maxConcurrent).toBe(2);
  });

  it('provides index to mapper', async () => {
    const indices: number[] = [];
    await pMapFast([10, 20, 30], async (_, i) => {
      indices.push(i);
    });
    expect(indices).toEqual([0, 1, 2]);
  });
});
