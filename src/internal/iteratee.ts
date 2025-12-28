/**
 * Internal helper to convert iteratee shorthand to functions.
 * Supports:
 * - Function: passed through as-is
 * - String: property access (including dot-notation for deep paths)
 */

/**
 * Cache for parsed path strings to avoid repeated split() allocations.
 * Limited size to prevent memory issues in long-running processes.
 */
const PATH_CACHE_LIMIT = 1000;
const pathCache = new Map<string, string[]>();

function parsePath(path: string): string[] {
  let cached = pathCache.get(path);
  if (cached) return cached;

  cached = path.split('.');

  // Evict oldest entries if cache is full
  if (pathCache.size >= PATH_CACHE_LIMIT) {
    const firstKey = pathCache.keys().next().value as string;
    pathCache.delete(firstKey);
  }
  pathCache.set(path, cached);
  return cached;
}

/**
 * Iteratee type that accepts function or property path string.
 */
export type Iteratee<T, R> = ((item: T, index: number) => R) | keyof T | (string & {});

/**
 * Convert an iteratee (function or string) to a function.
 * String iteratees support dot-notation for deep property access.
 *
 * @param iteratee - Function or property path string
 * @returns Function that extracts the value
 */
export function toIteratee<T, R>(iteratee: Iteratee<T, R>): (item: T, index: number) => R {
  if (typeof iteratee === 'function') {
    return iteratee;
  }

  // String path - could be simple 'id' or deep 'user.profile.id'
  const path = String(iteratee);
  if (!path.includes('.')) {
    // Simple property access - fast path
    return (item: T) => (item as Record<string, unknown>)[path] as R;
  }

  // Deep path access (cached to avoid repeated allocations)
  const keys = parsePath(path);
  return (item: T) => {
    let current: unknown = item;
    for (const key of keys) {
      if (current === null || current === undefined) return undefined as R;
      current = (current as Record<string, unknown>)[key];
    }
    return current as R;
  };
}

/**
 * Deep property getter with default value support.
 * Used by getHot utility.
 */
export function getPath<T, D = undefined>(
  obj: T,
  path: string | readonly (string | number)[],
  defaultValue?: D,
): unknown | D {
  const keys = typeof path === 'string' ? parsePath(path) : path;
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) return defaultValue as D;
    current = (current as Record<string | number, unknown>)[key];
  }

  return current === undefined ? defaultValue : current;
}

/**
 * Check if a key represents an array index (non-negative integer).
 */
function isArrayIndex(key: string | number): boolean {
  if (typeof key === 'number') return Number.isInteger(key) && key >= 0;
  const num = Number(key);
  return Number.isInteger(num) && num >= 0 && String(num) === key;
}

/**
 * Deep property setter.
 * Used by setHot utility.
 * Creates arrays for numeric keys, objects for string keys.
 */
export function setPath<T extends object>(obj: T, path: string | readonly (string | number)[], value: unknown): T {
  const keys = typeof path === 'string' ? parsePath(path) : path;
  if (keys.length === 0) return obj;

  const rootIsArray = Array.isArray(obj);
  const result = rootIsArray ? [...obj] : { ...obj };
  let current: Record<string | number, unknown> = result as Record<string | number, unknown>;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!;
    const nextKey = keys[i + 1]!;
    const next = current[key];

    if (next !== null && next !== undefined && typeof next === 'object') {
      // Clone existing object/array
      current[key] = Array.isArray(next) ? [...next] : { ...next };
    } else {
      // Create new object or array based on next key
      current[key] = isArrayIndex(nextKey) ? [] : {};
    }
    current = current[key] as Record<string | number, unknown>;
  }

  current[keys[keys.length - 1]!] = value;
  return result as T;
}
