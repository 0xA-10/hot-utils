import { describe, expect, it } from 'vitest';
import { uniqueByKeyHot } from '../../src/array/uniqueByKey.js';

describe('uniqueByKeyHot', () => {
  it('removes duplicates based on key', () => {
    const items = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 1, name: 'c' },
    ];
    expect(uniqueByKeyHot(items, item => item.id)).toEqual([
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ]);
  });

  it('handles empty arrays', () => {
    expect(uniqueByKeyHot([], () => '')).toEqual([]);
  });

  it('provides index to key selector', () => {
    const indices: number[] = [];
    uniqueByKeyHot([1, 2, 3], (_, i) => {
      indices.push(i);
      return i;
    });
    expect(indices).toEqual([0, 1, 2]);
  });

  it('handles numeric keys', () => {
    const items = [{ group: 1 }, { group: 2 }, { group: 1 }];
    expect(uniqueByKeyHot(items, item => item.group)).toHaveLength(2);
  });

  it('handles prototype property names as keys', () => {
    // Ensure Object.create(null) prevents prototype pollution
    const items = [
      { name: 'toString', val: 1 },
      { name: 'constructor', val: 2 },
      { name: 'toString', val: 3 },
    ];
    const result = uniqueByKeyHot(items, item => item.name);
    expect(result).toEqual([
      { name: 'toString', val: 1 },
      { name: 'constructor', val: 2 },
    ]);
  });
});
