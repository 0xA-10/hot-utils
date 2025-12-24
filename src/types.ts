/**
 * Predicate type matching Array.prototype.find signature.
 * Uses built-in TypeScript types for maximum compatibility.
 */
export type ArrayPredicate<T> = Parameters<Array<T>['find']>[0];

/**
 * Key selector function type for grouping/indexing operations (PropertyKey keys).
 */
export type KeySelector<T, K extends PropertyKey = string> = (item: T, index: number) => K;

/**
 * Key selector function type for Map-based operations (any key type).
 */
export type MapKeySelector<T, K> = (item: T, index: number) => K;

/**
 * Value mapper function type for transformation operations.
 */
export type ValueMapper<T, R> = (item: T, index: number) => R;

/**
 * Object entry mapper for object transformation operations.
 */
export type ObjectMapper<K extends PropertyKey, V, R> = (value: V, key: K) => R;

/**
 * Equality predicate for comparing two items.
 */
export type EqualityPredicate<T> = (a: T, b: T) => boolean;
