import { describe, expect, it } from 'vitest';
import { mapObjectFast } from '../../src/object/mapObject.js';

describe('mapObjectFast', () => {
  it('transforms object values', () => {
    const obj = { a: 1, b: 2 };
    expect(mapObjectFast(obj, val => val * 2)).toEqual({ a: 2, b: 4 });
  });

  it('handles empty objects', () => {
    expect(mapObjectFast({}, val => val)).toEqual({});
  });

  it('provides key to mapper', () => {
    const obj = { a: 1, b: 2 };
    expect(mapObjectFast(obj, (val, key) => `${key}:${val}`)).toEqual({ a: 'a:1', b: 'b:2' });
  });

  it('preserves keys', () => {
    const obj = { foo: 1, bar: 2 };
    const result = mapObjectFast(obj, val => val + 10);
    expect(Object.keys(result)).toEqual(['foo', 'bar']);
  });
});
