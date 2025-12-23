import { describe, expect, it } from 'vitest';
import { uniqueByKeyFast } from '../../src/array/uniqueByKey.js';

describe('uniqueByKeyFast', () => {
  it('removes duplicates based on key', () => {
    const items = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 1, name: 'c' },
    ];
    expect(uniqueByKeyFast(items, item => item.id)).toEqual([
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ]);
  });

  it('handles empty arrays', () => {
    expect(uniqueByKeyFast([], () => '')).toEqual([]);
  });

  it('provides index to key selector', () => {
    const indices: number[] = [];
    uniqueByKeyFast([1, 2, 3], (_, i) => {
      indices.push(i);
      return i;
    });
    expect(indices).toEqual([0, 1, 2]);
  });

  it('handles numeric keys', () => {
    const items = [{ group: 1 }, { group: 2 }, { group: 1 }];
    expect(uniqueByKeyFast(items, item => item.group)).toHaveLength(2);
  });
});
