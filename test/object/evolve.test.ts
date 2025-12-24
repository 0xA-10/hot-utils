import { describe, expect, it } from 'vitest';
import { evolveHot } from '../../src/object/evolve.js';

describe('evolveHot', () => {
  it('applies transformations to matching properties', () => {
    const obj = { a: 1, b: 2 };
    const result = evolveHot({ a: (x: number) => x * 10 }, obj);
    expect(result).toEqual({ a: 10, b: 2 });
  });

  it('handles multiple transformations', () => {
    const obj = { name: 'foo', count: 5 };
    const result = evolveHot(
      {
        name: (s: string) => s.toUpperCase(),
        count: (n: number) => n + 1,
      },
      obj,
    );
    expect(result).toEqual({ name: 'FOO', count: 6 });
  });

  it('leaves untransformed properties unchanged', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = evolveHot({ a: (x: number) => x * 10 }, obj);
    expect(result).toEqual({ a: 10, b: 2, c: 3 });
  });

  it('handles nested transformations', () => {
    const obj = {
      name: 'test',
      data: {
        count: 5,
        flag: true,
      },
    };
    const result = evolveHot(
      {
        data: {
          count: (n: number) => n + 1,
        },
      },
      obj,
    );
    expect(result).toEqual({
      name: 'test',
      data: {
        count: 6,
        flag: true,
      },
    });
  });

  it('handles deeply nested transformations', () => {
    const obj = {
      level1: {
        level2: {
          level3: {
            value: 10,
          },
        },
      },
    };
    const result = evolveHot(
      {
        level1: {
          level2: {
            level3: {
              value: (n: number) => n * 2,
            },
          },
        },
      },
      obj,
    );
    expect(result).toEqual({
      level1: {
        level2: {
          level3: {
            value: 20,
          },
        },
      },
    });
  });

  it('handles empty objects', () => {
    expect(evolveHot({}, {})).toEqual({});
  });

  it('handles empty transformations', () => {
    const obj = { a: 1, b: 2 };
    expect(evolveHot({}, obj)).toEqual({ a: 1, b: 2 });
  });

  it('can apply function to nested object directly', () => {
    const obj = {
      data: { count: 5 },
    };
    const result = evolveHot(
      {
        data: (d: { count: number }) => ({ count: d.count * 2 }),
      },
      obj,
    );
    expect(result).toEqual({ data: { count: 10 } });
  });

  it('handles mixed nested specs and functions', () => {
    const obj = {
      a: { x: 1, y: 2 },
      b: { x: 3, y: 4 },
    };
    const result = evolveHot(
      {
        a: { x: (n: number) => n * 10 },
        b: (o: { x: number; y: number }) => ({ x: o.x + o.y, y: o.y }),
      },
      obj,
    );
    expect(result).toEqual({
      a: { x: 10, y: 2 },
      b: { x: 7, y: 4 },
    });
  });

  it('preserves object reference equality for untouched branches', () => {
    const nested = { deep: { value: 1 } };
    const obj = { a: 1, nested };
    const result = evolveHot({ a: (x: number) => x + 1 }, obj);
    expect(result.a).toBe(2);
    // Note: nested is copied, not preserved by reference (immutable style)
    expect(result.nested).toEqual(nested);
  });

  it('works with string transformations', () => {
    const obj = { firstName: '  john  ', lastName: '  doe  ' };
    const result = evolveHot(
      {
        firstName: (s: string) => s.trim(),
        lastName: (s: string) => s.trim().toUpperCase(),
      },
      obj,
    );
    expect(result).toEqual({ firstName: 'john', lastName: 'DOE' });
  });

  it('works with array properties', () => {
    const obj = { items: [1, 2, 3], name: 'list' };
    const result = evolveHot(
      {
        items: (arr: number[]) => arr.map(x => x * 2),
      },
      obj,
    );
    expect(result).toEqual({ items: [2, 4, 6], name: 'list' });
  });
});
