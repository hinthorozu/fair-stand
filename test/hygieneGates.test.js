import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const install = readFileSync(new URL('../scripts/install-server.sh', import.meta.url), 'utf8');
const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('install-server.sh Version2 commit SHA pinler, git pull kullanmaz', () => {
  assert.match(install, /PINNED_COMMIT="\$\{FAIR_STAND_COMMIT:-ed828c30254fed37890c444dea6a857e10a24fc4\}"/);
  assert.match(install, /git checkout --detach/);
  assert.doesNotMatch(install, /git pull --ff-only/);
});

test('CI npm audit ve src sözdizimi kapısını çalıştırır', () => {
  assert.equal(pkg.scripts['audit:deps'], 'npm audit --audit-level=high');
  assert.equal(pkg.scripts['syntax:check'], 'node scripts/check-src-syntax.mjs');
  assert.match(workflow, /npm run audit:deps/);
  assert.match(workflow, /npm run syntax:check/);
});
