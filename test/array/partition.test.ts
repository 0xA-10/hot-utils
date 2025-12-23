import { describe, expect, it } from 'vitest';
import { partitionFast } from '../../src/array/partition.js';

describe('partitionFast', () => {
  it('partitions array by predicate', () => {
    const [evens, odds] = partitionFast([1, 2, 3, 4, 5], n => n % 2 === 0);
    expect(evens).toEqual([2, 4]);
    expect(odds).toEqual([1, 3, 5]);
  });

  it('handles empty arrays', () => {
    const [pass, fail] = partitionFast([], () => true);
    expect(pass).toEqual([]);
    expect(fail).toEqual([]);
  });

  it('handles all passing', () => {
    const [pass, fail] = partitionFast([1, 2, 3], () => true);
    expect(pass).toEqual([1, 2, 3]);
    expect(fail).toEqual([]);
  });

  it('handles all failing', () => {
    const [pass, fail] = partitionFast([1, 2, 3], () => false);
    expect(pass).toEqual([]);
    expect(fail).toEqual([1, 2, 3]);
  });

  it('provides index to predicate', () => {
    const [evens] = partitionFast(['a', 'b', 'c', 'd'], (_, i) => i % 2 === 0);
    expect(evens).toEqual(['a', 'c']);
  });
});
