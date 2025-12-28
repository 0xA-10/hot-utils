import { describe, expect, it } from 'vitest';
import { intersectionHot, intersectionByHot } from '../../src/array/intersection.js';

describe('intersectionHot', () => {
  it('finds common elements across arrays', () => {
    expect(intersectionHot([1, 2, 3], [2, 3, 4], [3, 4, 5])).toEqual([3]);
  });

  it('handles two arrays', () => {
    expect(intersectionHot([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
  });

  it('handles empty result', () => {
    expect(intersectionHot([1, 2], [3, 4])).toEqual([]);
  });

  it('handles empty arrays', () => {
    expect(intersectionHot([], [1, 2])).toEqual([]);
    expect(intersectionHot([1, 2], [])).toEqual([]);
    expect(intersectionHot()).toEqual([]);
  });

  it('handles single array', () => {
    expect(intersectionHot([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('removes duplicates from result', () => {
    expect(intersectionHot([1, 1, 2, 2], [1, 2, 3])).toEqual([1, 2]);
  });
});

describe('intersectionByHot', () => {
  it('finds intersection by iteratee function', () => {
    const arr1 = [{ id: 1 }, { id: 2 }];
    const arr2 = [{ id: 2 }, { id: 3 }];
    expect(intersectionByHot(arr1, arr2, x => x.id)).toEqual([{ id: 2 }]);
  });

  it('finds intersection by string path', () => {
    const arr1 = [{ id: 1 }, { id: 2 }];
    const arr2 = [{ id: 2 }, { id: 3 }];
    expect(intersectionByHot(arr1, arr2, 'id')).toEqual([{ id: 2 }]);
  });

  it('handles empty result', () => {
    const arr1 = [{ id: 1 }];
    const arr2 = [{ id: 2 }];
    expect(intersectionByHot(arr1, arr2, 'id')).toEqual([]);
  });

  it('removes duplicates by key', () => {
    const arr1 = [{ id: 1 }, { id: 1 }, { id: 2 }];
    const arr2 = [{ id: 1 }, { id: 2 }];
    expect(intersectionByHot(arr1, arr2, 'id')).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('supports variadic arrays (3 arrays)', () => {
    const arr1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const arr2 = [{ id: 2 }, { id: 3 }, { id: 4 }];
    const arr3 = [{ id: 3 }, { id: 4 }, { id: 5 }];
    expect(intersectionByHot(arr1, arr2, arr3, 'id')).toEqual([{ id: 3 }]);
  });

  it('supports variadic arrays (4 arrays)', () => {
    const arr1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const arr2 = [{ id: 2 }, { id: 3 }];
    const arr3 = [{ id: 2 }, { id: 3 }, { id: 4 }];
    const arr4 = [{ id: 2 }, { id: 5 }];
    expect(intersectionByHot(arr1, arr2, arr3, arr4, 'id')).toEqual([{ id: 2 }]);
  });

  it('handles multi-array with empty result', () => {
    const arr1 = [{ id: 1 }];
    const arr2 = [{ id: 2 }];
    const arr3 = [{ id: 3 }];
    expect(intersectionByHot(arr1, arr2, arr3, 'id')).toEqual([]);
  });
});
