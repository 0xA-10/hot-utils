import { describe, expect, it } from 'vitest';
import { filterFast } from '../../src/array/filter.js';

describe('filterFast', () => {
  it('filters array by predicate', () => {
    expect(filterFast([1, 2, 3, 4, 5], n => n > 2)).toEqual([3, 4, 5]);
  });

  it('handles empty arrays', () => {
    expect(filterFast([], () => true)).toEqual([]);
  });

  it('returns empty when nothing passes', () => {
    expect(filterFast([1, 2, 3], () => false)).toEqual([]);
  });

  it('returns all when everything passes', () => {
    expect(filterFast([1, 2, 3], () => true)).toEqual([1, 2, 3]);
  });

  it('provides index to predicate', () => {
    expect(filterFast(['a', 'b', 'c'], (_, i) => i > 0)).toEqual(['b', 'c']);
  });

  it('supports type guards', () => {
    const items: (string | number)[] = [1, 'a', 2, 'b'];
    const strings = filterFast(items, (x): x is string => typeof x === 'string');
    expect(strings).toEqual(['a', 'b']);
    // Type should be narrowed to string[]
    const _check: string[] = strings;
    expect(_check).toBeDefined();
  });
});
