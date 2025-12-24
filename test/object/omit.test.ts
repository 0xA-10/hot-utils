import { describe, expect, it } from 'vitest';
import { omitHot, omitByHot } from '../../src/object/omit.js';

describe('omitHot', () => {
  it('omits specified keys', () => {
    expect(omitHot({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 });
  });

  it('omits multiple keys', () => {
    expect(omitHot({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ b: 2 });
  });

  it('handles non-existent keys', () => {
    expect(omitHot({ a: 1, b: 2 }, ['c' as keyof { a: number; b: number }])).toEqual({ a: 1, b: 2 });
  });

  it('handles empty keys array', () => {
    expect(omitHot({ a: 1, b: 2 }, [])).toEqual({ a: 1, b: 2 });
  });

  it('handles empty object', () => {
    expect(omitHot({}, [])).toEqual({});
  });
});

describe('omitByHot', () => {
  it('omits by predicate', () => {
    expect(omitByHot({ a: 1, b: null, c: 3 }, v => v == null)).toEqual({ a: 1, c: 3 });
  });

  it('omits values matching condition', () => {
    expect(omitByHot({ a: 1, b: 2, c: 3 }, v => (v as number) > 1)).toEqual({ a: 1 });
  });

  it('provides key to predicate', () => {
    expect(omitByHot({ a: 1, b: 2 }, (_, k) => k === 'a')).toEqual({ b: 2 });
  });

  it('handles all omitted', () => {
    expect(omitByHot({ a: 1, b: 2 }, () => true)).toEqual({});
  });

  it('handles none omitted', () => {
    expect(omitByHot({ a: 1, b: 2 }, () => false)).toEqual({ a: 1, b: 2 });
  });
});
