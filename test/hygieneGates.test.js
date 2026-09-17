import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const install = readFileSync(new URL('../scripts/install-server.sh', import.meta.url), 'utf8');
const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('install-server.sh origin default dal ucunu çeker; commit SHA pinlemez', () => {
  assert.match(install, /git remote set-head origin --auto/);
  assert.match(install, /git fetch origin "\$\{default_branch\}"/);
  assert.match(install, /git checkout "\$\{default_branch\}"/);
  assert.match(install, /git pull --ff-only origin "\$\{default_branch\}"/);
  assert.doesNotMatch(install, /git fetch origin Version2/);
  assert.doesNotMatch(install, /PINNED_COMMIT/);
  assert.doesNotMatch(install, /git checkout --detach/);
});

test('CI npm audit ve src sözdizimi kapısını çalıştırır', () => {
  assert.equal(pkg.scripts['audit:deps'], 'npm audit --audit-level=high');
  assert.equal(pkg.scripts['syntax:check'], 'node scripts/check-src-syntax.mjs');
  assert.match(workflow, /npm run audit:deps/);
  assert.match(workflow, /npm run syntax:check/);
});
