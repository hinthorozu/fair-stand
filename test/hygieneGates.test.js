import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const install = readFileSync(new URL('../scripts/install-server.sh', import.meta.url), 'utf8');
const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('install-server.sh Version2 ucunu çeker; commit SHA pinlemez', () => {
  assert.match(install, /git fetch origin Version2/);
  assert.match(install, /git checkout Version2/);
  assert.match(install, /git pull --ff-only origin Version2/);
  assert.doesNotMatch(install, /PINNED_COMMIT/);
  assert.doesNotMatch(install, /git checkout --detach/);
});

test('CI npm audit ve src sözdizimi kapısını çalıştırır', () => {
  assert.equal(pkg.scripts['audit:deps'], 'npm audit --audit-level=high');
  assert.equal(pkg.scripts['syntax:check'], 'node scripts/check-src-syntax.mjs');
  assert.match(workflow, /npm run audit:deps/);
  assert.match(workflow, /npm run syntax:check/);
});
