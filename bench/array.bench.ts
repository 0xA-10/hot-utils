import { Bench } from 'tinybench';
import { intersectionHot, partitionHot, uniqueByKeyHot } from '../src/index.js';

export const suite = new Bench({ time: 1000 });

// Test data
const largeArray = Array.from({ length: 10000 }, (_, i) => i % 100);
const largeArray2 = Array.from({ length: 10000 }, (_, i) => (i + 50) % 100);
const objectArray = Array.from({ length: 10000 }, (_, i) => ({ id: i, group: String(i % 10) }));

suite
  .add('partitionHot (10k items)', () => {
    partitionHot(largeArray, x => x > 50);
  })
  .add('uniqueByKeyHot (10k objects)', () => {
    uniqueByKeyHot(objectArray, x => x.group);
  })
  .add('uniqueByKeyHot string path (10k objects)', () => {
    uniqueByKeyHot(objectArray, 'group');
  })
  .add('intersectionHot (2 arrays, 10k each)', () => {
    intersectionHot(largeArray, largeArray2);
  });
