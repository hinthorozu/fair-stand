import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  SYSTEM_IMPACT_DOMAINS,
  isGuardedChangeFile,
  requiredDomainsForFile,
  validateSystemChangeContract,
} from '../src/systemChangeContract.js';

const currentContract = JSON.parse(readFileSync(new URL('../.github/change-contract.json', import.meta.url), 'utf8'));

function validContract(overrides = {}) {
  return {
    schemaVersion: 1,
    id: 'example-change',
    kind: 'bugfix',
    summary: 'Example guarded change.',
    owners: ['src/example.js'],
    sourceOfTruth: ['PROJECT_RULES.md'],
    impact: Object.fromEntries(SYSTEM_IMPACT_DOMAINS.map((domain) => [domain, domain === 'tests' ? 'affected' : 'not-applicable'])),
    tests: {
      targeted: ['test/example.test.js'],
      fullSuite: true,
      build: true,
    },
    risk: {
      level: 'low',
      notes: 'Example risk declaration.',
    },
    migration: {
      required: false,
      notes: 'No migration.',
    },
    rollback: 'Revert the change.',
    ...overrides,
  };
}

test('current repository change declaration satisfies the universal schema', () => {
  assert.deepEqual(validateSystemChangeContract(currentContract), []);
});

test('every impact domain requires an explicit decision', () => {
  const contract = validContract();
  delete contract.impact.security;

  const errors = validateSystemChangeContract(contract);
  assert.ok(errors.some((error) => error.includes('Missing impact decisions: security')));
});

test('UI controls cannot declare UI as not applicable', () => {
  const contract = validContract({
    kind: 'ui-control',
    impact: {
      ...validContract().impact,
      tests: 'affected',
      ui: 'not-applicable',
    },
  });

  const errors = validateSystemChangeContract(contract);
  assert.ok(errors.some((error) => error.includes('ui-control changes must mark ui as affected')));
});

test('architecture changes must declare architecture impact', () => {
  const contract = validContract({
    kind: 'architecture',
    impact: {
      ...validContract().impact,
      tests: 'affected',
      architecture: 'not-applicable',
    },
  });

  const errors = validateSystemChangeContract(contract);
  assert.ok(errors.some((error) => error.includes('architecture changes must mark architecture as affected')));
});

test('guarded paths cover runtime, UI, assets and delivery infrastructure', () => {
  assert.equal(isGuardedChangeFile('src/main.js'), true);
  assert.equal(isGuardedChangeFile('index.html'), true);
  assert.equal(isGuardedChangeFile('public/models/example.glb'), true);
  assert.equal(isGuardedChangeFile('scripts/install-server.sh'), true);
  assert.equal(isGuardedChangeFile('.github/workflows/ci.yml'), true);
  assert.equal(isGuardedChangeFile('README.md'), false);
});

test('high-risk canonical paths derive mandatory impact domains', () => {
  assert.deepEqual(requiredDomainsForFile('src/catalog.js'), ['catalog']);
  assert.deepEqual(requiredDomainsForFile('src/designState.js').sort(), ['persistence', 'state']);
  assert.deepEqual(requiredDomainsForFile('src/scene3d.js'), ['renderer']);
  assert.deepEqual(requiredDomainsForFile('src/moduleRecipes.js'), ['bom']);
  assert.deepEqual(requiredDomainsForFile('src/autoDepot.js'), ['composition']);
  assert.deepEqual(requiredDomainsForFile('public/models/example.glb'), ['assets']);
  assert.deepEqual(requiredDomainsForFile('index.html'), ['ui']);
});

test('placement core changes require both behavior and placement declarations', () => {
  assert.deepEqual(requiredDomainsForFile('src/modulePlacement.js').sort(), ['behavior', 'placement']);
});
