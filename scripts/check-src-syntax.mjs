import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const srcDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const files = readdirSync(srcDir)
  .filter((name) => name.endsWith('.js'))
  .map((name) => join(srcDir, name))
  .sort();

let failed = false;
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    failed = true;
    process.stderr.write(result.stderr || result.stdout || `${file} sözdizimi geçersiz.\n`);
  }
}

if (failed) process.exit(1);
