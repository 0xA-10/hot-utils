// Array utilities
export { intersectionByHot, intersectionHot, partitionHot, uniqueByKeyHot } from './array/index.js';

// Object utilities
export {
  countByHot,
  evolveHot,
  evolveHotFast,
  type Evolver,
  groupByHot,
  indexByHot,
  mapKeysHot,
  mapKeysHotFast,
  mapObjectHot,
  mapObjectHotFast,
  mapValuesHot,
  mapValuesHotFast,
  omitByHot,
  omitByHotFast,
  omitHot,
  pickByHot,
  pickByHotFast,
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
