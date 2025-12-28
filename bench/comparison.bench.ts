/**
 * Comparative benchmarks: hot-fns vs lodash vs radash vs ramda
 *
 * Run with: pnpm bench:compare
 */
import { Bench } from 'tinybench';

// hot-fns
import {
  partitionHot,
  intersectionHot,
  uniqueByKeyHot,
  groupByHot,
  countByHot,
  indexByHot,
  mapKeysHot,
  mapValuesHot,
  omitHot,
  pickHot,
  evolveHot,
} from '../src/index.js';

// lodash
import _ from 'lodash';

// radash
import * as radash from 'radash';

// ramda
import * as R from 'ramda';

// ============================================================================
// Test Data
// ============================================================================

const largeArray = Array.from({ length: 10000 }, (_, i) => i % 100);
const largeArray2 = Array.from({ length: 10000 }, (_, i) => (i + 50) % 100);

const objectArray = Array.from({ length: 10000 }, (_, i) => ({
  id: String(i),
  group: String(i % 10),
  value: i,
}));

const simpleObject = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`key${i}`, i]));

const keysToOmit = ['key1', 'key2', 'key3', 'key4', 'key5'];
const keysToPick = ['key1', 'key2', 'key3', 'key4', 'key5'];

const evolveObject = { a: 1, b: 2, c: { d: 3, e: 4 }, f: 'hello' };
const evolveSpec = {
  a: (x: number) => x * 2,
  c: { d: (x: number) => x + 10 },
  f: (s: string) => s.toUpperCase(),
};
const ramdaEvolveSpec = {
  a: (x: number) => x * 2,
  c: { d: (x: number) => x + 10 },
  f: (s: string) => s.toUpperCase(),
};

// ============================================================================
// Benchmark Suites
// ============================================================================

export const arraySuite = new Bench({ time: 1000 });
export const objectSuite = new Bench({ time: 1000 });

// ----------------------------------------------------------------------------
// Array Benchmarks
// ----------------------------------------------------------------------------

arraySuite
  // partition (note: radash.fork is their equivalent but is very slow)
  .add('partition: hot-fns', () => {
    partitionHot(largeArray, x => x > 50);
  })
  .add('partition: lodash', () => {
    _.partition(largeArray, x => x > 50);
  })
  .add('partition: ramda', () => {
    R.partition(x => x > 50, largeArray);
  })

  // intersection
  .add('intersection: hot-fns', () => {
    intersectionHot(largeArray, largeArray2);
  })
  .add('intersection: lodash', () => {
    _.intersection(largeArray, largeArray2);
  })
  .add('intersection: ramda', () => {
    R.intersection(largeArray, largeArray2);
  })

  // uniqueBy
  .add('uniqueBy: hot-fns', () => {
    uniqueByKeyHot(objectArray, x => x.group);
  })
  .add('uniqueBy: lodash', () => {
    _.uniqBy(objectArray, x => x.group);
  })
  .add('uniqueBy: radash', () => {
    radash.unique(objectArray, x => x.group);
  })
  .add('uniqueBy: ramda', () => {
    R.uniqBy(x => x.group, objectArray);
  });

// ----------------------------------------------------------------------------
// Object Benchmarks
// ----------------------------------------------------------------------------

objectSuite
  // groupBy
  .add('groupBy: hot-fns (Object)', () => {
    groupByHot(objectArray, x => x.group, true);
  })
  .add('groupBy: lodash', () => {
    _.groupBy(objectArray, x => x.group);
  })
  .add('groupBy: radash', () => {
    radash.group(objectArray, x => x.group);
  })
  .add('groupBy: ramda', () => {
    R.groupBy(x => x.group, objectArray);
  })

  // countBy
  .add('countBy: hot-fns', () => {
    countByHot(objectArray, x => x.group);
  })
  .add('countBy: lodash', () => {
    _.countBy(objectArray, x => x.group);
  })
  .add('countBy: ramda', () => {
    R.countBy(x => x.group, objectArray);
  })

  // indexBy / keyBy (same operation, different names)
  .add('indexBy/keyBy: hot-fns', () => {
    indexByHot(objectArray, x => x.id);
  })
  .add('indexBy/keyBy: lodash', () => {
    _.keyBy(objectArray, x => x.id);
  })
  .add('indexBy/keyBy: ramda', () => {
    R.indexBy(x => x.id, objectArray);
  })

  // mapKeys
  .add('mapKeys: hot-fns', () => {
    mapKeysHot(simpleObject, k => k.toUpperCase());
  })
  .add('mapKeys: lodash', () => {
    _.mapKeys(simpleObject, (_v, k) => k.toUpperCase());
  })
  .add('mapKeys: radash', () => {
    radash.mapKeys(simpleObject, k => k.toUpperCase());
  })

  // mapValues
  .add('mapValues: hot-fns', () => {
    mapValuesHot(simpleObject, v => v * 2);
  })
  .add('mapValues: lodash', () => {
    _.mapValues(simpleObject, v => v * 2);
  })
  .add('mapValues: radash', () => {
    radash.mapValues(simpleObject, v => v * 2);
  })
  .add('mapValues: ramda', () => {
    R.map(v => v * 2, simpleObject);
  })

  // omit
  .add('omit: hot-fns', () => {
    omitHot(simpleObject, keysToOmit);
  })
  .add('omit: lodash', () => {
    _.omit(simpleObject, keysToOmit);
  })
  .add('omit: radash', () => {
    radash.omit(simpleObject, keysToOmit);
  })
  .add('omit: ramda', () => {
    R.omit(keysToOmit, simpleObject);
  })

  // pick
  .add('pick: hot-fns', () => {
    pickHot(simpleObject, keysToPick);
  })
  .add('pick: lodash', () => {
    _.pick(simpleObject, keysToPick);
  })
  .add('pick: radash', () => {
    radash.pick(simpleObject, keysToPick);
  })
  .add('pick: ramda', () => {
    R.pick(keysToPick, simpleObject);
  })

  // evolve (hot-fns vs ramda only)
  .add('evolve: hot-fns', () => {
    evolveHot(evolveSpec, evolveObject);
  })
  .add('evolve: ramda', () => {
    R.evolve(ramdaEvolveSpec, evolveObject);
  });
