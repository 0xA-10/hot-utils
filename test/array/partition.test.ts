import { describe, expect, it } from 'vitest';
import { partitionHot } from '../../src/array/partition.js';

describe('partitionHot', () => {
  it('partitions array by predicate', () => {
    const [evens, odds] = partitionHot([1, 2, 3, 4, 5], n => n % 2 === 0);
    expect(evens).toEqual([2, 4]);
    expect(odds).toEqual([1, 3, 5]);
  });

  it('handles empty arrays', () => {
    const [pass, fail] = partitionHot([], () => true);
    expect(pass).toEqual([]);
    expect(fail).toEqual([]);
  });

  it('handles all passing', () => {
    const [pass, fail] = partitionHot([1, 2, 3], () => true);
    expect(pass).toEqual([1, 2, 3]);
    expect(fail).toEqual([]);
  });

  it('handles all failing', () => {
    const [pass, fail] = partitionHot([1, 2, 3], () => false);
    expect(pass).toEqual([]);
    expect(fail).toEqual([1, 2, 3]);
  });

  it('provides index to predicate', () => {
    const [evens] = partitionHot(['a', 'b', 'c', 'd'], (_, i) => i % 2 === 0);
    expect(evens).toEqual(['a', 'c']);
  });

  it('handles sparse arrays (treats holes as undefined)', () => {
    // eslint-disable-next-line no-sparse-arrays
    const sparse = [1, , 3] as number[];
    const [defined, undef] = partitionHot(sparse, x => x !== undefined);
    expect(defined).toEqual([1, 3]);
    expect(undef).toEqual([undefined]);
  });
});
