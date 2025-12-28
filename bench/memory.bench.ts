/**
 * Deterministic Memory Benchmarks: hot-fns vs lodash vs radash vs ramda
 *
 * Methodology:
 * - Single operation measurement (no GC interference)
 * - Force GC before each measurement
 * - Multiple runs with median for statistical robustness
 *
 * Run with: pnpm bench:memory
 * Requires: --expose-gc flag (handled by npm script)
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  partitionHot,
  intersectionHot,
  groupByHot,
  countByHot,
  indexByHot,
  omitHot,
  pickHot,
  mapKeysHot,
  mapValuesHot,
  uniqueByKeyHot,
} from '../src/index.js';

import _ from 'lodash';
import * as radash from 'radash';
import * as R from 'ramda';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASELINE_PATH = join(__dirname, 'memory-baseline.json');
const REGRESSION_THRESHOLD = 0.2; // 20% more memory = regression

// ============================================================================
// Test Data
// ============================================================================

const largeObjectArray = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  group: String(i % 10),
  value: i * 2,
}));

const primitiveArray1 = Array.from({ length: 10000 }, (_, i) => i);
const primitiveArray2 = Array.from({ length: 10000 }, (_, i) => i + 5000);

const simpleObject = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`key${i}`, i]));

const keysToOmit = ['key1', 'key2', 'key3', 'key4', 'key5'];
const keysToPick = ['key1', 'key2', 'key3', 'key4', 'key5'];

// ============================================================================
// Deterministic Memory Measurement
// ============================================================================

interface MemoryResult {
  library: string;
  bytes: number;
}

/**
 * Measure memory allocation for a single operation.
 *
 * Key principles:
 * 1. Single operation - no GC can trigger mid-measurement
 * 2. Force GC before - clean baseline each run
 * 3. Multiple runs + median - statistical robustness
 */
function measureAllocation(fn: () => unknown, runs: number = 15): number {
  if (!global.gc) {
    console.error('ERROR: global.gc not available. Run with --expose-gc flag.');
    process.exit(1);
  }

  const measurements: number[] = [];

  for (let run = 0; run < runs; run++) {
    // Force full GC to get clean baseline
    global.gc();
    global.gc();

    const before = process.memoryUsage().heapUsed;

    // Single operation - GC cannot interfere
    const result = fn();

    const after = process.memoryUsage().heapUsed;
    measurements.push(after - before);

    // Prevent result from being optimized away
    if (result === undefined) process.stdout.write('');
  }

  // Return median for robustness
  measurements.sort((a, b) => a - b);
  return measurements[Math.floor(measurements.length / 2)]!;
}

function formatBytes(bytes: number): string {
  if (Math.abs(bytes) < 1024) {
    return `${bytes.toFixed(0)} B`;
  }
  return `${(bytes / 1024).toFixed(2)} KB`;
}

interface TestCase {
  name: string;
  fn: () => unknown;
}

interface ComparisonResult {
  operation: string;
  results: Array<{ library: string; bytes: number; pctMore: number }>;
  winner: string;
}

function runComparison(operation: string, tests: TestCase[]): ComparisonResult {
  const results: MemoryResult[] = tests.map(t => ({
    library: t.name,
    bytes: measureAllocation(t.fn),
  }));

  // Sort by bytes (ascending = less memory is better)
  results.sort((a, b) => a.bytes - b.bytes);
  const best = results[0]!;

  const enrichedResults = results.map(r => ({
    library: r.library,
    bytes: r.bytes,
    pctMore: best.bytes > 0 ? (r.bytes / best.bytes - 1) * 100 : 0,
  }));

  return {
    operation,
    results: enrichedResults,
    winner: best.library,
  };
}

function printComparison(result: ComparisonResult): void {
  console.log(`┌─ ${result.operation} ─────────────────────────────────────────`);

  for (const r of result.results) {
    const status =
      r.pctMore === 0
        ? '🏆 LOWEST'
        : r.pctMore < 10
          ? `~${r.pctMore.toFixed(0)}% (within noise)`
          : `+${r.pctMore.toFixed(0)}%`;

    console.log(`│  ${r.library.padEnd(10)} ${formatBytes(r.bytes).padStart(12)}  ${status}`);
  }

  console.log('└──────────────────────────────────────────────────────────────────\n');
}

// ============================================================================
// Main
// ============================================================================

interface BenchmarkSummary {
  comparisons: ComparisonResult[];
  hotFnsWins: number;
  hotFnsTies: number;
  hotFnsLosses: number;
}

async function main(): Promise<BenchmarkSummary> {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(' MEMORY COMPARISON: Deterministic single-op measurement (15 runs)');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const comparisons: ComparisonResult[] = [];

  // Partition
  comparisons.push(
    runComparison('partition (10k items)', [
      {
        name: 'hot-fns',
        fn: () => partitionHot(largeObjectArray, x => x.id > 5000),
      },
      {
        name: 'lodash',
        fn: () => _.partition(largeObjectArray, x => x.id > 5000),
      },
      {
        name: 'ramda',
        fn: () => R.partition(x => x.id > 5000, largeObjectArray),
      },
    ]),
  );

  // Intersection
  comparisons.push(
    runComparison('intersection (2x 10k primitives)', [
      {
        name: 'hot-fns',
        fn: () => intersectionHot(primitiveArray1, primitiveArray2),
      },
      { name: 'lodash', fn: () => _.intersection(primitiveArray1, primitiveArray2) },
      { name: 'ramda', fn: () => R.intersection(primitiveArray1, primitiveArray2) },
    ]),
  );

  // UniqueBy
  comparisons.push(
    runComparison('uniqueBy (10k items)', [
      {
        name: 'hot-fns',
        fn: () => uniqueByKeyHot(largeObjectArray, x => x.group),
      },
      { name: 'lodash', fn: () => _.uniqBy(largeObjectArray, x => x.group) },
      {
        name: 'radash',
        fn: () => radash.unique(largeObjectArray, x => x.group),
      },
      { name: 'ramda', fn: () => R.uniqBy(x => x.group, largeObjectArray) },
    ]),
  );

  // GroupBy
  comparisons.push(
    runComparison('groupBy (10k items)', [
      {
        name: 'hot-fns',
        fn: () => groupByHot(largeObjectArray, x => x.group, true),
      },
      { name: 'lodash', fn: () => _.groupBy(largeObjectArray, x => x.group) },
      { name: 'radash', fn: () => radash.group(largeObjectArray, x => x.group) },
      { name: 'ramda', fn: () => R.groupBy(x => x.group, largeObjectArray) },
    ]),
  );

  // CountBy
  comparisons.push(
    runComparison('countBy (10k items)', [
      {
        name: 'hot-fns',
        fn: () => countByHot(largeObjectArray, x => x.group),
      },
      { name: 'lodash', fn: () => _.countBy(largeObjectArray, x => x.group) },
      { name: 'ramda', fn: () => R.countBy(x => x.group, largeObjectArray) },
    ]),
  );

  // IndexBy
  comparisons.push(
    runComparison('indexBy (10k items)', [
      { name: 'hot-fns', fn: () => indexByHot(largeObjectArray, x => x.id) },
      { name: 'lodash', fn: () => _.keyBy(largeObjectArray, x => x.id) },
      { name: 'ramda', fn: () => R.indexBy(x => x.id, largeObjectArray) },
    ]),
  );

  // MapKeys
  comparisons.push(
    runComparison('mapKeys (100 keys)', [
      { name: 'hot-fns', fn: () => mapKeysHot(simpleObject, k => k.toUpperCase()) },
      {
        name: 'lodash',
        fn: () => _.mapKeys(simpleObject, (_v, k) => k.toUpperCase()),
      },
      {
        name: 'radash',
        fn: () => radash.mapKeys(simpleObject, k => k.toUpperCase()),
      },
    ]),
  );

  // MapValues
  comparisons.push(
    runComparison('mapValues (100 keys)', [
      { name: 'hot-fns', fn: () => mapValuesHot(simpleObject, v => v * 2) },
      { name: 'lodash', fn: () => _.mapValues(simpleObject, v => v * 2) },
      { name: 'radash', fn: () => radash.mapValues(simpleObject, v => v * 2) },
      { name: 'ramda', fn: () => R.map(v => v * 2, simpleObject) },
    ]),
  );

  // Omit
  comparisons.push(
    runComparison('omit (100 keys, omit 5)', [
      { name: 'hot-fns', fn: () => omitHot(simpleObject, keysToOmit) },
      { name: 'lodash', fn: () => _.omit(simpleObject, keysToOmit) },
      { name: 'radash', fn: () => radash.omit(simpleObject, keysToOmit) },
      { name: 'ramda', fn: () => R.omit(keysToOmit, simpleObject) },
    ]),
  );

  // Pick
  comparisons.push(
    runComparison('pick (100 keys, pick 5)', [
      { name: 'hot-fns', fn: () => pickHot(simpleObject, keysToPick) },
      { name: 'lodash', fn: () => _.pick(simpleObject, keysToPick) },
      { name: 'radash', fn: () => radash.pick(simpleObject, keysToPick) },
      { name: 'ramda', fn: () => R.pick(keysToPick, simpleObject) },
    ]),
  );

  // Print all results
  for (const comparison of comparisons) {
    printComparison(comparison);
  }

  // Summary
  let hotFnsWins = 0;
  let hotFnsTies = 0;
  let hotFnsLosses = 0;

  for (const c of comparisons) {
    const hotFnsResult = c.results.find(r => r.library === 'hot-fns');
    if (!hotFnsResult) continue;

    if (hotFnsResult.pctMore === 0) {
      hotFnsWins++;
    } else if (hotFnsResult.pctMore < 10) {
      hotFnsTies++;
    } else {
      hotFnsLosses++;
    }
  }

  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(` SUMMARY: hot-fns wins=${hotFnsWins} ties=${hotFnsTies} losses=${hotFnsLosses}`);
  console.log('═══════════════════════════════════════════════════════════════════');

  return { comparisons, hotFnsWins, hotFnsTies, hotFnsLosses };
}

// ============================================================================
// CLI & Baseline Handling
// ============================================================================

interface BaselineEntry {
  operation: string;
  bytes: number;
}

function saveBaseline(comparisons: ComparisonResult[]): void {
  const baseline: BaselineEntry[] = comparisons.map(c => {
    const hotFns = c.results.find(r => r.library === 'hot-fns');
    return {
      operation: c.operation,
      bytes: hotFns?.bytes ?? 0,
    };
  });
  writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2));
  console.log(`\nBaseline saved to ${BASELINE_PATH}`);
}

function checkBaseline(comparisons: ComparisonResult[]): boolean {
  if (!existsSync(BASELINE_PATH)) {
    console.log('\nNo baseline found, skipping regression check');
    return true;
  }

  const baseline: BaselineEntry[] = JSON.parse(readFileSync(BASELINE_PATH, 'utf-8'));
  let hasRegression = false;

  console.log('\n─── Memory Regression Check ───────────────────────────────────────\n');

  for (const c of comparisons) {
    const hotFns = c.results.find(r => r.library === 'hot-fns');
    if (!hotFns) continue;

    const base = baseline.find(b => b.operation === c.operation);
    if (!base) {
      console.log(`  [NEW] ${c.operation}`);
      continue;
    }

    const change = (hotFns.bytes - base.bytes) / base.bytes;
    let status: string;

    if (change <= 0) {
      status = `[OK] ${(change * 100).toFixed(1)}%`;
    } else if (change < REGRESSION_THRESHOLD) {
      status = `[WARN] +${(change * 100).toFixed(1)}%`;
    } else {
      status = `[FAIL] +${(change * 100).toFixed(1)}%`;
      hasRegression = true;
    }

    console.log(`  ${status.padEnd(18)} ${c.operation}`);
  }

  if (hasRegression) {
    console.log(`\n❌ Memory regression detected (>${REGRESSION_THRESHOLD * 100}% increase)`);
    return false;
  }

  console.log('\n✅ No significant memory regressions detected');
  return true;
}

// Run
const args = process.argv.slice(2);
const saveBaselineMode = args.includes('--save-baseline');
const ciMode = args.includes('--ci');

main()
  .then(summary => {
    if (saveBaselineMode) {
      saveBaseline(summary.comparisons);
      return;
    }

    if (ciMode) {
      const passed = checkBaseline(summary.comparisons);
      if (!passed) {
        process.exit(1);
      }
    }
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
