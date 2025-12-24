import { describe, expect, it } from 'vitest';
import { mapObjectHot } from '../../src/object/mapObject.js';

describe('mapObjectHot', () => {
  it('transforms object values', () => {
    const obj = { a: 1, b: 2 };
    expect(mapObjectHot(obj, val => val * 2)).toEqual({ a: 2, b: 4 });
  });

  it('handles empty objects', () => {
    expect(mapObjectHot({}, val => val)).toEqual({});
  });

  it('provides key to mapper', () => {
    const obj = { a: 1, b: 2 };
    expect(mapObjectHot(obj, (val, key) => `${key}:${val}`)).toEqual({ a: 'a:1', b: 'b:2' });
  });

  it('preserves keys', () => {
    const obj = { foo: 1, bar: 2 };
    const result = mapObjectHot(obj, val => val + 10);
    expect(Object.keys(result)).toEqual(['foo', 'bar']);
  });
});
