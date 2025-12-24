# hot-utils

Lightweight, zero-dependency utility functions optimized for hot paths.

```bash
npm install hot-utils
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
import { groupByHot, partitionHot, mapValuesHot, evolveHot } from 'hot-utils';

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
  { name: 'foo', data: { count: 5 }, other: true }
);
// => { name: 'FOO', data: { count: 6 }, other: true }
```

## Imports

```typescript
// Main entry - all utilities
import { groupByHot, partitionHot } from 'hot-utils';

// Subpath imports - array utilities only
import { partitionHot, intersectionHot } from 'hot-utils/array';

// Subpath imports - object utilities only
import { groupByHot, mapKeysHot } from 'hot-utils/object';
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

| Function                              | Description                                |
| ------------------------------------- | ------------------------------------------ |
| `countByHot(arr, iteratee)`           | Count occurrences by key                   |
| `evolveHot(spec, obj)`                | Ramda-style recursive transformations      |
| `groupByHot(arr, iteratee, asObj)`    | Group by key (Map default, Object if true) |
| `indexByHot(arr, iteratee)`           | Create lookup table                        |
| `mapKeysHot(obj, mapper)`             | Transform object keys (no Object.keys())   |
| `mapObjectHot(obj, keyFn, valueFn)`   | Transform both keys and values             |
| `mapValuesHot(obj, mapper)`           | Transform object values (no Object.keys()) |
| `omitHot(obj, keys)`                  | Exclude keys (Set-based O(1) lookup)       |
| `omitByHot(obj, predicate)`           | Exclude by predicate                       |
| `pickHot(obj, keys)`                  | Select keys                                |
| `pickByHot(obj, predicate)`           | Select by predicate                        |

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

GPLv3
