import { describe, expect, it } from 'vitest';
import { uniqueByPredicateFast } from '../../src/array/uniqueByPredicate.js';

describe('uniqueByPredicateFast', () => {
  it('removes duplicates based on predicate', () => {
    const items = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 1, name: 'c' },
    ];
    expect(uniqueByPredicateFast(items, (a, b) => a.id === b.id)).toEqual([
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ]);
  });

  it('handles empty arrays', () => {
    expect(uniqueByPredicateFast([], () => true)).toEqual([]);
  });

  it('keeps all items when predicate always returns false', () => {
    const items = [1, 2, 3];
    expect(uniqueByPredicateFast(items, () => false)).toEqual([1, 2, 3]);
  });

  it('keeps first item when predicate always returns true', () => {
    const items = [1, 2, 3];
    expect(uniqueByPredicateFast(items, () => true)).toEqual([1]);
  });
});
