/**
 * Internal helper to convert iteratee shorthand to functions.
 * Supports:
 * - Function: passed through as-is
 * - String: property access (including dot-notation for deep paths)
 */

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

  // Deep path access
  const keys = path.split('.');
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
  const keys = typeof path === 'string' ? path.split('.') : path;
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) return defaultValue as D;
    current = (current as Record<string | number, unknown>)[key];
  }

  return current === undefined ? defaultValue : current;
}

/**
 * Deep property setter.
 * Used by setHot utility.
 */
export function setPath<T extends object>(obj: T, path: string | readonly (string | number)[], value: unknown): T {
  const keys = typeof path === 'string' ? path.split('.') : path;
  if (keys.length === 0) return obj;

  const result = { ...obj } as Record<string, unknown>;
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = String(keys[i]);
    const next = current[key];
    current[key] = next !== null && next !== undefined && typeof next === 'object' ? { ...next } : {};
    current = current[key] as Record<string, unknown>;
  }

  current[String(keys[keys.length - 1])] = value;
  return result as T;
}
