import { describe, expect, it } from 'vitest';
import { pSettleFast } from '../../src/promise/settle.js';

describe('pSettleFast', () => {
  it('settles all promises', async () => {
    const results = await pSettleFast([Promise.resolve(1), Promise.reject(new Error('fail')), Promise.resolve(3)]);

    expect(results).toHaveLength(3);
    expect(results[0]).toEqual({ status: 'fulfilled', value: 1 });
    expect(results[1]).toEqual({ status: 'rejected', reason: expect.any(Error) });
    expect(results[2]).toEqual({ status: 'fulfilled', value: 3 });
  });

  it('handles empty array', async () => {
    const results = await pSettleFast([]);
    expect(results).toEqual([]);
  });

  it('handles all fulfilled', async () => {
    const results = await pSettleFast([Promise.resolve(1), Promise.resolve(2)]);
    expect(results.every(r => r.status === 'fulfilled')).toBe(true);
  });

  it('handles all rejected', async () => {
    const results = await pSettleFast([Promise.reject('a'), Promise.reject('b')]);
    expect(results.every(r => r.status === 'rejected')).toBe(true);
  });

  it('preserves order', async () => {
    const results = await pSettleFast([
      new Promise(r => setTimeout(() => r(3), 30)),
      new Promise(r => setTimeout(() => r(1), 10)),
      new Promise(r => setTimeout(() => r(2), 20)),
    ]);

    expect(results.map(r => (r.status === 'fulfilled' ? r.value : null))).toEqual([3, 1, 2]);
  });
});
