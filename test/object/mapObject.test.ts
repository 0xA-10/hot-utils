import { describe, expect, it } from 'vitest';
import { mapObjectHot, mapValuesHot } from '../../src/object/mapObject.js';

describe('mapValuesHot', () => {
  it('transforms object values', () => {
    const obj = { a: 1, b: 2 };
    expect(mapValuesHot(obj, val => val * 2)).toEqual({ a: 2, b: 4 });
  });

  it('handles empty objects', () => {
    expect(mapValuesHot({}, val => val)).toEqual({});
  });

  it('provides key to mapper', () => {
    const obj = { a: 1, b: 2 };
    expect(mapValuesHot(obj, (val, key) => `${key}:${val}`)).toEqual({ a: 'a:1', b: 'b:2' });
  });

  it('preserves keys', () => {
    const obj = { foo: 1, bar: 2 };
    const result = mapValuesHot(obj, val => val + 10);
    expect(Object.keys(result)).toEqual(['foo', 'bar']);
  });
});

describe('mapObjectHot', () => {
  it('transforms both keys and values', () => {
    const obj = { a: 1, b: 2 };
    expect(
      mapObjectHot(
        obj,
        key => key.toUpperCase(),
        val => val * 2,
      ),
    ).toEqual({ A: 2, B: 4 });
  });

  it('handles empty objects', () => {
    expect(
      mapObjectHot(
        {},
        key => key,
        val => val,
      ),
    ).toEqual({});
  });

  it('provides value to key mapper and key to value mapper', () => {
    const obj = { a: 1, b: 2 };
    expect(
      mapObjectHot(
        obj,
        (key, val) => `${key}_${val}`,
        (val, key) => `${key}:${val}`,
      ),
    ).toEqual({ a_1: 'a:1', b_2: 'b:2' });
  });

  it('can transform keys only', () => {
    const obj = { foo: 1, bar: 2 };
    const result = mapObjectHot(
      obj,
      key => key.toUpperCase(),
      val => val,
    );
    expect(result).toEqual({ FOO: 1, BAR: 2 });
  });

  it('can transform values only', () => {
    const obj = { foo: 1, bar: 2 };
    const result = mapObjectHot(
      obj,
      key => key,
      val => val * 10,
    );
    expect(result).toEqual({ foo: 10, bar: 20 });
  });
});
