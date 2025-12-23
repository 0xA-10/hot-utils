import { describe, expect, it } from 'vitest';
import { dedupeFast, uniqueFast } from '../../src/array/dedupe.js';

describe('dedupeFast', () => {
  it('removes duplicate primitives', () => {
    expect(dedupeFast([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  it('preserves order of first occurrence', () => {
    expect(dedupeFast([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
  });

  it('handles empty arrays', () => {
    expect(dedupeFast([])).toEqual([]);
  });

  it('returns new array (immutable)', () => {
    const input = [1, 2, 3];
    expect(dedupeFast(input)).not.toBe(input);
  });

  it('handles strings', () => {
    expect(dedupeFast(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('uses reference equality for objects', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 1 };
    expect(dedupeFast([obj1, obj2, obj1])).toEqual([obj1, obj2]);
  });
});

describe('uniqueFast', () => {
  it('is an alias for dedupeFast', () => {
    expect(uniqueFast).toBe(dedupeFast);
  });
});
