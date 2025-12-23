import { describe, expect, it } from 'vitest';
import { indexByFast } from '../../src/object/indexBy.js';

describe('indexByFast', () => {
  it('indexes items by key', () => {
    const items = [
      { id: 'a', val: 1 },
      { id: 'b', val: 2 },
    ];
    expect(indexByFast(items, item => item.id)).toEqual({
      a: { id: 'a', val: 1 },
      b: { id: 'b', val: 2 },
    });
  });

  it('later items overwrite earlier with same key', () => {
    const items = [
      { id: 'a', val: 1 },
      { id: 'a', val: 2 },
    ];
    expect(indexByFast(items, item => item.id)).toEqual({
      a: { id: 'a', val: 2 },
    });
  });

  it('handles empty arrays', () => {
    expect(indexByFast([], () => 'key')).toEqual({});
  });

  it('provides index to key selector', () => {
    const indices: number[] = [];
    indexByFast([1, 2, 3], (_, i) => {
      indices.push(i);
      return String(i);
    });
    expect(indices).toEqual([0, 1, 2]);
  });
});
