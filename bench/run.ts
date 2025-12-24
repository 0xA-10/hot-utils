import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Import benchmark suites directly
import { suite as arraySuite } from './array.bench.js';
import { suite as objectSuite } from './object.bench.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASELINE_PATH = join(__dirname, 'baseline.json');
const REGRESSION_THRESHOLD = 0.15; // 15% slower = regression

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

async function main() {
  const args = process.argv.slice(2);
  const saveBaseline = args.includes('--save-baseline');
  const ciMode = args.includes('--ci');

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
