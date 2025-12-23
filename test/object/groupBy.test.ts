import { describe, expect, it } from 'vitest';
import { groupByFast } from '../../src/object/groupBy.js';

describe('groupByFast', () => {
  it('groups items by key (Map)', () => {
    const items = [
      { type: 'a', val: 1 },
      { type: 'b', val: 2 },
      { type: 'a', val: 3 },
    ];
    const result = groupByFast(items, item => item.type);
    expect(result).toBeInstanceOf(Map);
    expect(result.get('a')).toEqual([
      { type: 'a', val: 1 },
      { type: 'a', val: 3 },
    ]);
    expect(result.get('b')).toEqual([{ type: 'b', val: 2 }]);
  });

  it('groups items by key (Object)', () => {
    const items = [
      { type: 'a', val: 1 },
      { type: 'b', val: 2 },
      { type: 'a', val: 3 },
    ];
    const result = groupByFast(items, item => item.type, true);
    expect(result).not.toBeInstanceOf(Map);
    expect(result.a).toEqual([
      { type: 'a', val: 1 },
      { type: 'a', val: 3 },
    ]);
    expect(result.b).toEqual([{ type: 'b', val: 2 }]);
  });

  it('handles empty arrays (Map)', () => {
    const result = groupByFast([], () => 'key');
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(0);
  });

  it('handles empty arrays (Object)', () => {
    const result = groupByFast([], () => 'key', true);
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('provides index to key selector', () => {
    const indices: number[] = [];
    groupByFast([1, 2, 3], (_, i) => {
      indices.push(i);
      return i % 2;
    });
    expect(indices).toEqual([0, 1, 2]);
  });
});
