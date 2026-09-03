import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const ciWorkflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');

test('package exposes the universal change contract verifier', () => {
  assert.equal(packageJson.scripts['contract:verify'], 'node scripts/verify-change-contract.mjs');
});

test('canonical CI enforces the change contract before tests and build', () => {
  const gateIndex = ciWorkflow.indexOf('npm run contract:verify');
  const testIndex = ciWorkflow.indexOf('npm test');
  const buildIndex = ciWorkflow.indexOf('npm run build');

  assert.ok(ciWorkflow.includes('fetch-depth: 0'));
  assert.ok(gateIndex >= 0, 'CI must run the change contract gate');
  assert.ok(testIndex > gateIndex, 'tests must run after the change contract gate');
  assert.ok(buildIndex > testIndex, 'build must run after tests');
});
