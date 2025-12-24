// Array utilities
export { intersectionByHot, intersectionHot, partitionHot, uniqueByKeyHot } from './array/index.js';

// Object utilities
export {
  countByHot,
  evolveHot,
  type Evolver,
  groupByHot,
  indexByHot,
  mapKeysHot,
  mapObjectHot,
  mapValuesHot,
  omitByHot,
  omitHot,
  pickByHot,
  pickHot,
} from './object/index.js';

// Types
export type {
  ArrayPredicate,
  EqualityPredicate,
  KeySelector,
  MapKeySelector,
  ObjectMapper,
  ValueMapper,
} from './types.js';

// Internal utilities (exposed for advanced use)
export { type Iteratee } from './internal/iteratee.js';
