import { describe, expect, it } from 'vitest';
import { mapKeysFast } from '../../src/object/mapKeys.js';

describe('mapKeysFast', () => {
  it('transforms object keys', () => {
    const obj = { a: 1, b: 2 };
    expect(mapKeysFast(obj, key => key.toUpperCase())).toEqual({ A: 1, B: 2 });
  });

  it('handles empty objects', () => {
    expect(mapKeysFast({}, key => key)).toEqual({});
  });

  it('provides value to mapper', () => {
    const obj = { a: 1, b: 2 };
    expect(mapKeysFast(obj, (key, val) => `${key}_${val}`)).toEqual({ a_1: 1, b_2: 2 });
  });

  it('handles numeric keys', () => {
    const obj = { 1: 'a', 2: 'b' };
    expect(mapKeysFast(obj, key => `key_${key}`)).toEqual({ key_1: 'a', key_2: 'b' });
  });
});
