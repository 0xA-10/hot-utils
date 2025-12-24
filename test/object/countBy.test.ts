import { describe, expect, it } from 'vitest';
import { countByHot } from '../../src/object/countBy.js';

describe('countByHot', () => {
  it('counts items by key', () => {
    const items = ['a', 'b', 'a', 'c', 'b', 'a'];
    expect(countByHot(items, x => x)).toEqual({ a: 3, b: 2, c: 1 });
  });

  it('handles empty arrays', () => {
    expect(countByHot([], () => 'key')).toEqual({});
  });

  it('handles objects', () => {
    const items = [{ type: 'a' }, { type: 'b' }, { type: 'a' }];
    expect(countByHot(items, item => item.type)).toEqual({ a: 2, b: 1 });
  });

  it('provides index to key selector', () => {
    const indices: number[] = [];
    countByHot([1, 2, 3], (_, i) => {
      indices.push(i);
      return 'key';
    });
    expect(indices).toEqual([0, 1, 2]);
  });
});
