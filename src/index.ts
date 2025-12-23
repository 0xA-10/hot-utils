// Array utilities
export {
  dedupeFast,
  filterFast,
  findIndicesFast,
  partitionFast,
  uniqueByKeyFast,
  uniqueByPredicateFast,
  uniqueFast,
} from './array/index.js';

// Object utilities
export { countByFast, groupByFast, indexByFast, mapKeysFast, mapObjectFast } from './object/index.js';

// Promise utilities
export {
  pFilterFast,
  pMapFast,
  pRetryFast,
  pSettleFast,
  type PMapOptions,
  type RetryOptions,
  type SettledResult,
} from './promise/index.js';

// Stream utilities
export {
  createFilterStreamFast,
  createMapStreamFast,
  createTransformFast,
  pipelineFast,
  type TransformFn,
} from './stream/index.js';

// Types
export type {
  ArrayPredicate,
  AsyncMapper,
  AsyncPredicate,
  EqualityPredicate,
  KeySelector,
  MapKeySelector,
  ObjectMapper,
  ValueMapper,
} from './types.js';
