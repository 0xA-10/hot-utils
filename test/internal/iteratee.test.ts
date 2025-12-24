import { describe, expect, it } from 'vitest';
import { toIteratee, getPath, setPath } from '../../src/internal/iteratee.js';

describe('toIteratee', () => {
  it('passes through functions', () => {
    const fn = (x: { id: number }) => x.id;
    const iteratee = toIteratee(fn);
    expect(iteratee({ id: 42 }, 0)).toBe(42);
  });

  it('converts simple string to property accessor', () => {
    const iteratee = toIteratee<{ name: string }, string>('name');
    expect(iteratee({ name: 'alice' }, 0)).toBe('alice');
  });

  it('converts dot-notation string to deep accessor', () => {
    const iteratee = toIteratee<{ user: { profile: { email: string } } }, string>('user.profile.email');
    expect(iteratee({ user: { profile: { email: 'a@b.com' } } }, 0)).toBe('a@b.com');
  });

  it('handles undefined in deep path', () => {
    const iteratee = toIteratee<{ user?: { name?: string } }, string | undefined>('user.name');
    expect(iteratee({ user: undefined }, 0)).toBeUndefined();
    expect(iteratee({}, 0)).toBeUndefined();
  });

  it('handles null in deep path', () => {
    const iteratee = toIteratee<{ user: null }, unknown>('user.name');
    expect(iteratee({ user: null }, 0)).toBeUndefined();
  });
});

describe('getPath', () => {
  it('gets simple property', () => {
    expect(getPath({ a: 1 }, 'a')).toBe(1);
  });

  it('gets nested property with string path', () => {
    expect(getPath({ a: { b: { c: 3 } } }, 'a.b.c')).toBe(3);
  });

  it('gets nested property with array path', () => {
    expect(getPath({ a: { b: { c: 3 } } }, ['a', 'b', 'c'])).toBe(3);
  });

  it('returns default for missing path', () => {
    expect(getPath({ a: 1 }, 'b', 'default')).toBe('default');
  });

  it('returns default for undefined in path', () => {
    expect(getPath({ a: undefined }, 'a.b', 'default')).toBe('default');
  });

  it('returns default for null in path', () => {
    expect(getPath({ a: null }, 'a.b', 'default')).toBe('default');
  });

  it('returns undefined without default', () => {
    expect(getPath({ a: 1 }, 'b')).toBeUndefined();
  });

  it('handles array index access', () => {
    expect(getPath({ items: ['a', 'b', 'c'] }, ['items', 1])).toBe('b');
  });
});

describe('setPath', () => {
  it('sets simple property immutably', () => {
    const obj = { a: 1 };
    const result = setPath(obj, 'a', 2);
    expect(result).toEqual({ a: 2 });
    expect(obj).toEqual({ a: 1 }); // original unchanged
  });

  it('sets nested property with string path', () => {
    const obj = { a: { b: 1 } };
    const result = setPath(obj, 'a.b', 2);
    expect(result).toEqual({ a: { b: 2 } });
  });

  it('sets nested property with array path', () => {
    const obj = { a: { b: 1 } };
    const result = setPath(obj, ['a', 'b'], 2);
    expect(result).toEqual({ a: { b: 2 } });
  });

  it('creates intermediate objects', () => {
    const obj = { a: 1 };
    const result = setPath(obj, 'b.c.d', 42);
    expect(result).toEqual({ a: 1, b: { c: { d: 42 } } });
  });

  it('handles empty path', () => {
    const obj = { a: 1 };
    expect(setPath(obj, [], 2)).toEqual({ a: 1 });
  });

  it('preserves sibling properties', () => {
    const obj = { a: { b: 1, c: 2 } };
    const result = setPath(obj, 'a.b', 10);
    expect(result).toEqual({ a: { b: 10, c: 2 } });
  });
});
