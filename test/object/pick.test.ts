import { describe, expect, it } from 'vitest';
import { pickHot, pickByHot } from '../../src/object/pick.js';

describe('pickHot', () => {
  it('picks specified keys', () => {
    expect(pickHot({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('picks single key', () => {
    expect(pickHot({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ b: 2 });
  });

  it('handles non-existent keys', () => {
    expect(pickHot({ a: 1, b: 2 }, ['a', 'c' as keyof { a: number; b: number }])).toEqual({ a: 1 });
  });

  it('handles empty keys array', () => {
    expect(pickHot({ a: 1, b: 2 }, [])).toEqual({});
  });

  it('handles empty object', () => {
    expect(pickHot({}, [])).toEqual({});
  });
});

describe('pickByHot', () => {
  it('picks by predicate', () => {
    expect(pickByHot({ a: 1, b: null, c: 3 }, v => v != null)).toEqual({ a: 1, c: 3 });
  });

  it('picks values matching condition', () => {
    expect(pickByHot({ a: 1, b: 2, c: 3 }, v => (v as number) > 1)).toEqual({ b: 2, c: 3 });
  });

  it('provides key to predicate', () => {
    expect(pickByHot({ a: 1, b: 2 }, (_, k) => k === 'a')).toEqual({ a: 1 });
  });

  it('handles all picked', () => {
    expect(pickByHot({ a: 1, b: 2 }, () => true)).toEqual({ a: 1, b: 2 });
  });

  it('handles none picked', () => {
    expect(pickByHot({ a: 1, b: 2 }, () => false)).toEqual({});
  });
});
