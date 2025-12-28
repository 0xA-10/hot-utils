# hot-fns

Lightweight, zero-dependency utility functions optimized for hot paths.

```bash
npm install hot-fns
```

## Philosophy

This library contains **only** utilities that are genuinely faster and more memory efficient than lodash:

- **No intermediate arrays** - Uses `for...in` instead of `Object.keys()` for object iteration
- **Indexed for loops** - Direct `arr[i]` access instead of iterator abstractions
- **Thin abstractions** - Single iteratee helper vs lodash's layered internal wrappers

If a utility isn't measurably faster or more memory efficient, it's not here. Use lodash for everything else.

## Requirements

- Node.js >= 20
- ESM or CommonJS

## Quick Start

```typescript
import { groupByHot, partitionHot, mapValuesHot, evolveHot } from 'hot-fns';

// Single-pass grouping (returns Map by default)
const byStatus = groupByHot(orders, 'status');

// Or get a plain object instead
const byStatusObj = groupByHot(orders, 'status', true);

// Single-pass partition (2x faster than dual filter)
const [active, inactive] = partitionHot(users, u => u.isActive);

// Transform values without intermediate Object.keys() array
const doubled = mapValuesHot(prices, v => v * 2);

// Ramda-style evolve for nested transformations
const updated = evolveHot(
  { name: s => s.toUpperCase(), data: { count: n => n + 1 } },
  { name: 'foo', data: { count: 5 }, other: true },
);
// => { name: 'FOO', data: { count: 6 }, other: true }
```

## Imports

```typescript
// Main entry - all utilities
import { groupByHot, partitionHot } from 'hot-fns';

// Subpath imports - array utilities only
import { partitionHot, intersectionHot } from 'hot-fns/array';

// Subpath imports - object utilities only
import { groupByHot, mapKeysHot } from 'hot-fns/object';
```

## API

### Array

| Function                                  | Description                                         |
| ----------------------------------------- | --------------------------------------------------- |
| `intersectionHot(...arrays)`              | Common elements (smallest-array-first optimization) |
| `intersectionByHot(arr1, arr2, iteratee)` | Intersection with custom key                        |
| `partitionHot(arr, predicate)`            | Split by predicate (single-pass)                    |
| `uniqueByKeyHot(arr, iteratee)`           | Dedupe by key (Map-based O(n))                      |

### Object

| Function                            | Description                                |
| ----------------------------------- | ------------------------------------------ |
| `countByHot(arr, iteratee)`         | Count occurrences by key                   |
| `evolveHot(spec, obj)`              | Ramda-style recursive transforms (O(1) iteration) |
| `evolveHotFast(spec, obj)`          | Recursive transforms (~15% faster, O(n) memory)   |
| `groupByHot(arr, iteratee, asObj)`  | Group by key (Map default, Object if true) |
| `indexByHot(arr, iteratee)`         | Create lookup table                        |
| `mapKeysHot(obj, mapper)`           | Transform object keys (O(1) iteration)     |
| `mapKeysHotFast(obj, mapper)`       | Transform keys (~15% faster, O(n) memory)  |
| `mapObjectHot(obj, keyFn, valueFn)` | Transform both keys and values             |
| `mapObjectHotFast(obj, keyFn, valueFn)` | Transform both (~15% faster, O(n) memory) |
| `mapValuesHot(obj, mapper)`         | Transform object values (O(1) iteration)   |
| `mapValuesHotFast(obj, mapper)`     | Transform values (~15% faster, O(n) memory)|
| `omitHot(obj, keys)`                | Exclude keys (spread + delete)             |
| `omitByHot(obj, predicate)`         | Exclude by predicate (O(1) iteration)      |
| `omitByHotFast(obj, predicate)`     | Exclude by predicate (~15% faster, O(n))   |
| `pickHot(obj, keys)`                | Select keys                                |
| `pickByHot(obj, predicate)`         | Select by predicate (O(1) iteration)       |
| `pickByHotFast(obj, predicate)`     | Select by predicate (~15% faster, O(n))    |

## Speed vs Memory: HotFast Variants

For object iteration functions (`mapKeys`, `mapValues`, `mapObject`, `pickBy`, `omitBy`, `evolve`), we provide two implementations with different tradeoffs:

### The Tradeoff

| Approach | Iteration | Memory | Speed |
|----------|-----------|--------|-------|
| `for...in` + `hasOwn` | O(1) memory | No intermediate allocation | Baseline |
| `Object.keys()` + indexed loop | O(n) memory | Allocates keys array | ~15% faster |

### Benchmark Results (100-key object)

**Memory Usage:**
| Function | Memory | vs Competitors |
|----------|--------|----------------|
| `mapKeysHot` | 20.30 KB | LOWEST |
| `mapKeysHotFast` | 21.13 KB | +0.83 KB |
| lodash `mapKeys` | 21.30 KB | +1.00 KB |

**Speed:**
| Function | Ops/sec | vs Competitors |
|----------|---------|----------------|
| `mapKeysHotFast` | ~105,000 | FASTEST |
| lodash `mapKeys` | ~91,000 | 15% slower |
| `mapKeysHot` | ~88,000 | 19% slower |

**mapValues (100-key object):**
| Function | Memory | Speed |
|----------|--------|-------|
| `mapValuesHot` | 13.23 KB (LOWEST) | 236k ops/sec |
| `mapValuesHotFast` | 14.06 KB (+0.83 KB) | 280k ops/sec (FASTEST) |

### When to Use Which

```typescript
import {
  mapValuesHot,      // Memory-optimized (default)
  mapValuesHotFast,  // Speed-optimized
} from 'hot-fns';

// Use *Hot when:
// - Processing very large objects where 0.8KB per call adds up
// - Memory pressure is a concern (e.g., serverless, edge functions)
// - Called in tight loops with many iterations
const result = mapValuesHot(largeConfig, transform);

// Use *HotFast when:
// - Speed is critical and memory is plentiful
// - Processing smaller objects where 0.8KB is negligible
// - Optimizing a specific hot path for latency
const result = mapValuesHotFast(smallConfig, transform);
```

### Why Both Exist

The ~0.83 KB difference comes from `Object.keys()` allocating an intermediate array:

```typescript
// mapValuesHot - O(1) iteration memory
for (const key in obj) {
  if (Object.hasOwn(obj, key)) { /* ... */ }
}

// mapValuesHotFast - O(n) keys array allocation
const keys = Object.keys(obj);  // ← allocates array of n keys
for (let i = 0; i < keys.length; i++) { /* ... */ }
```

The indexed loop is faster because V8 optimizes it better than `for...in`, but the keys array adds memory overhead proportional to the object size.

## Iteratee Shorthand

Most functions accept an iteratee that can be:

- A function: `x => x.user.id`
- A property path: `'user.id'`

```typescript
groupByHot(users, 'role'); // string shorthand
groupByHot(users, u => u.role); // function
uniqueByKeyHot(items, 'nested.id'); // deep path
```

## Publishing

```bash
pnpm version patch|minor|major
pnpm build
npm publish
```

## License

MIT
