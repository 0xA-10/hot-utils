import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Import benchmark suites directly
import { suite as arraySuite } from './array.bench.js';
import { suite as objectSuite } from './object.bench.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASELINE_PATH = join(__dirname, 'baseline.json');
const REGRESSION_THRESHOLD = 0.15; // 15% slower = regression

// Comparison mode imports (lazy loaded)
async function loadComparisonSuites() {
  const { arraySuite, objectSuite } = await import('./comparison.bench.js');
  return { arraySuite, objectSuite };
}

interface BenchResult {
  name: string;
  opsPerSec: number;
  margin: number;
}

async function runBenchmarks(): Promise<BenchResult[]> {
  const suites = [
    { name: 'Array', suite: arraySuite },
    { name: 'Object', suite: objectSuite },
  ];
  const results: BenchResult[] = [];

  for (const { name, suite } of suites) {
    console.log(`Running ${name} benchmarks...`);
    await suite.run();

    for (const task of suite.tasks) {
      if (task.result) {
        results.push({
          name: task.name,
          opsPerSec: task.result.throughput.mean,
          margin: task.result.latency.rme,
        });
      }
    }
  }
  return results;
}

interface CompareResult {
  operation: string;
  library: string;
  opsPerSec: number;
  margin: number;
}

async function runComparisonBenchmarks(): Promise<void> {
  const { arraySuite, objectSuite } = await loadComparisonSuites();

  const suites = [
    { name: 'Array Operations', suite: arraySuite },
    { name: 'Object Operations', suite: objectSuite },
  ];

  const results: CompareResult[] = [];

  for (const { name, suite } of suites) {
    console.log(`\nRunning ${name} comparison benchmarks...`);
    await suite.run();

    for (const task of suite.tasks) {
      if (task.result) {
        // Parse "operation: library" format
        const [operation, library] = task.name.split(': ');
        results.push({
          operation: operation ?? task.name,
          library: library ?? 'unknown',
          opsPerSec: task.result.throughput.mean,
          margin: task.result.latency.rme,
        });
      }
    }
  }

  // Group by operation and print comparison table
  const grouped = new Map<string, CompareResult[]>();
  for (const r of results) {
    const existing = grouped.get(r.operation) ?? [];
    existing.push(r);
    grouped.set(r.operation, existing);
  }

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(' COMPARISON RESULTS: hot-fns vs lodash vs radash vs ramda');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  for (const [operation, libs] of grouped) {
    // Sort by ops/sec descending
    libs.sort((a, b) => b.opsPerSec - a.opsPerSec);
    const fastest = libs[0]!;

    console.log(`┌─ ${operation} ─────────────────────────────────────────`);
    for (const lib of libs) {
      const speedup =
        lib === fastest ? '👑 FASTEST' : `${((fastest.opsPerSec / lib.opsPerSec - 1) * 100).toFixed(1)}% slower`;
      const bar = '█'.repeat(Math.round((lib.opsPerSec / fastest.opsPerSec) * 20));
      console.log(
        `│  ${lib.library.padEnd(10)} ${lib.opsPerSec.toLocaleString().padStart(12)} ops/sec  ${bar.padEnd(20)}  ${speedup}`,
      );
    }
    console.log('└──────────────────────────────────────────────────────────────────\n');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const saveBaseline = args.includes('--save-baseline');
  const ciMode = args.includes('--ci');
  const compareMode = args.includes('--compare');

  if (compareMode) {
    await runComparisonBenchmarks();
    return;
  }

  const results = await runBenchmarks();

  // Print results
  console.log('\n Benchmark Results\n');
  for (const r of results) {
    console.log(`  ${r.name}: ${r.opsPerSec.toLocaleString()} ops/sec (+/-${r.margin.toFixed(2)}%)`);
  }

  if (saveBaseline) {
    writeFileSync(BASELINE_PATH, JSON.stringify(results, null, 2));
    console.log(`\nBaseline saved to ${BASELINE_PATH}`);
    return;
  }

  if (ciMode) {
    if (!existsSync(BASELINE_PATH)) {
      console.log('\nNo baseline found, skipping regression check');
      return;
    }

    const baseline: BenchResult[] = JSON.parse(readFileSync(BASELINE_PATH, 'utf-8'));
    let hasRegression = false;

    console.log('\nRegression Check\n');
    for (const current of results) {
      const base = baseline.find(b => b.name === current.name);
      if (!base) {
        console.log(`  [NEW] ${current.name}`);
        continue;
      }

      const change = (current.opsPerSec - base.opsPerSec) / base.opsPerSec;
      let status: string;
      if (change >= 0) {
        status = `[OK] +${(change * 100).toFixed(1)}%`;
      } else if (change > -REGRESSION_THRESHOLD) {
        status = `[WARN] ${(change * 100).toFixed(1)}%`;
      } else {
        status = `[FAIL] ${(change * 100).toFixed(1)}%`;
        hasRegression = true;
      }
      console.log(`  ${status} ${current.name}`);
    }

    if (hasRegression) {
      console.log(`\nPerformance regression detected (>${REGRESSION_THRESHOLD * 100}% slower)`);
      process.exit(1);
    }
    console.log('\nNo significant regressions detected');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
