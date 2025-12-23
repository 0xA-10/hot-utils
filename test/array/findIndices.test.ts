import { describe, expect, it } from 'vitest';
import { findIndicesFast } from '../../src/array/findIndices.js';

describe('findIndicesFast', () => {
  it('finds all matching indices', () => {
    expect(findIndicesFast([1, 2, 3, 2, 1], n => n === 2)).toEqual([1, 3]);
  });

  it('handles empty arrays', () => {
    expect(findIndicesFast([], () => true)).toEqual([]);
  });

  it('returns empty when nothing matches', () => {
    expect(findIndicesFast([1, 2, 3], () => false)).toEqual([]);
  });

  it('returns all indices when everything matches', () => {
    expect(findIndicesFast([1, 2, 3], () => true)).toEqual([0, 1, 2]);
  });

  it('provides index to predicate', () => {
    expect(findIndicesFast(['a', 'b', 'c', 'd'], (_, i) => i % 2 === 0)).toEqual([0, 2]);
  });
});
