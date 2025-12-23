import { describe, expect, it } from 'vitest';
import { Readable, Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createTransformFast, createFilterStreamFast, createMapStreamFast } from '../../src/stream/transform.js';

describe('createTransformFast', () => {
  it('transforms chunks', async () => {
    const results: number[] = [];
    const transform = createTransformFast<number, number>(chunk => chunk * 2);

    await pipeline(
      Readable.from([1, 2, 3]),
      transform,
      new Writable({
        objectMode: true,
        write(chunk, _, callback) {
          results.push(chunk);
          callback();
        },
      }),
    );

    expect(results).toEqual([2, 4, 6]);
  });

  it('handles async transform', async () => {
    const results: number[] = [];
    const transform = createTransformFast<number, number>(async chunk => {
      await new Promise(r => setTimeout(r, 10));
      return chunk * 2;
    });

    await pipeline(
      Readable.from([1, 2, 3]),
      transform,
      new Writable({
        objectMode: true,
        write(chunk, _, callback) {
          results.push(chunk);
          callback();
        },
      }),
    );

    expect(results).toEqual([2, 4, 6]);
  });
});

describe('createFilterStreamFast', () => {
  it('filters chunks', async () => {
    const results: number[] = [];
    const filter = createFilterStreamFast<number>(chunk => chunk > 2);

    await pipeline(
      Readable.from([1, 2, 3, 4, 5]),
      filter,
      new Writable({
        objectMode: true,
        write(chunk, _, callback) {
          results.push(chunk);
          callback();
        },
      }),
    );

    expect(results).toEqual([3, 4, 5]);
  });
});

describe('createMapStreamFast', () => {
  it('maps chunks', async () => {
    const results: string[] = [];
    const map = createMapStreamFast<number, string>(chunk => `num:${chunk}`);

    await pipeline(
      Readable.from([1, 2, 3]),
      map,
      new Writable({
        objectMode: true,
        write(chunk, _, callback) {
          results.push(chunk);
          callback();
        },
      }),
    );

    expect(results).toEqual(['num:1', 'num:2', 'num:3']);
  });
});
