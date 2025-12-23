import { readdir, rename } from 'node:fs/promises';
import { join } from 'node:path';

async function renameFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await renameFiles(fullPath);
    } else if (entry.name.endsWith('.js')) {
      await rename(fullPath, fullPath.replace(/\.js$/, '.cjs'));
    } else if (entry.name.endsWith('.d.ts')) {
      await rename(fullPath, fullPath.replace(/\.d\.ts$/, '.d.cts'));
    }
  }
}

await renameFiles('./dist/cjs');
console.log('CJS files renamed successfully');
