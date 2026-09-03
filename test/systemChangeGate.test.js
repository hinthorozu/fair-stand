import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

import {
  GOVERNANCE_DOCUMENT_REQUIRED_DOMAINS,
  SOURCE_FILE_REQUIRED_DOMAINS,
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

test('guarded paths cover runtime, UI, assets, governance docs and delivery infrastructure', () => {
  assert.equal(isGuardedChangeFile('src/main.js'), true);
  assert.equal(isGuardedChangeFile('index.html'), true);
  assert.equal(isGuardedChangeFile('public/models/example.glb'), true);
  assert.equal(isGuardedChangeFile('scripts/install-server.sh'), true);
  assert.equal(isGuardedChangeFile('.github/workflows/ci.yml'), true);
  assert.equal(isGuardedChangeFile('README.md'), true);
  assert.equal(isGuardedChangeFile('SYSTEM_CHANGE_GATE.md'), true);
  assert.equal(isGuardedChangeFile('PROJECT_RULES.md'), true);
  assert.equal(isGuardedChangeFile('ROADMAP.md'), false);
});

test('canonical governance documents are guarded architecture surfaces', () => {
  const expected = [
    'README.md',
    'PROJECT_RULES.md',
    'ARCHITECTURE_RULES.md',
    'SYSTEM_DEVELOPMENT_CONTRACT.md',
    'SYSTEM_CHANGE_GATE.md',
    'MODULE_BEHAVIOR_STANDARD.md',
    'SYSTEM_AUDIT_CHECKLIST.md',
  ].sort();

  assert.deepEqual(Object.keys(GOVERNANCE_DOCUMENT_REQUIRED_DOMAINS).sort(), expected);

  for (const path of expected) {
    assert.equal(isGuardedChangeFile(path), true, `${path} must be guarded`);
    assert.deepEqual(requiredDomainsForFile(path), ['architecture'], `${path} must require architecture impact`);
  }
});

test('every current src file has an explicit non-empty impact-domain ownership mapping', () => {
  const sourceFiles = readdirSync(new URL('../src/', import.meta.url), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => `src/${entry.name}`)
    .sort();
  const mappedFiles = Object.keys(SOURCE_FILE_REQUIRED_DOMAINS).sort();

  assert.deepEqual(mappedFiles, sourceFiles, 'SOURCE_FILE_REQUIRED_DOMAINS must classify every current src file exactly once');

  for (const path of sourceFiles) {
    const domains = requiredDomainsForFile(path);
    assert.ok(domains.length > 0, `${path} must require at least one impact domain`);
    assert.ok(domains.every((domain) => SYSTEM_IMPACT_DOMAINS.includes(domain)), `${path} contains an unknown impact domain`);
  }
});

test('high-risk canonical paths derive ownership-appropriate mandatory impact domains', () => {
  assert.deepEqual(requiredDomainsForFile('src/catalog.js'), ['catalog']);
  assert.deepEqual(requiredDomainsForFile('src/designState.js').sort(), ['persistence', 'state']);
  assert.deepEqual(requiredDomainsForFile('src/moduleRecipes.js'), ['bom']);
  assert.deepEqual(requiredDomainsForFile('src/autosaveController.js'), ['persistence']);
  assert.deepEqual(requiredDomainsForFile('src/tvConfig.js').sort(), ['catalog', 'renderer', 'state']);
  assert.deepEqual(requiredDomainsForFile('src/viewKeyboardShortcuts.js').sort(), ['accessibility', 'behavior', 'ui']);
  assert.deepEqual(requiredDomainsForFile('src/wall.js').sort(), ['composition', 'placement']);
  assert.deepEqual(requiredDomainsForFile('src/groundLayout.js').sort(), ['placement', 'renderer']);
  assert.deepEqual(requiredDomainsForFile('public/models/example.glb'), ['assets']);
  assert.deepEqual(requiredDomainsForFile('index.html'), ['ui']);
});

test('central orchestration cannot hide its known cross-domain responsibilities', () => {
  const domains = new Set(requiredDomainsForFile('src/main.js'));
  for (const domain of [
    'architecture',
    'catalog',
    'behavior',
    'state',
    'placement',
    'renderer',
    'persistence',
    'ui',
    'composition',
    'assets',
    'storage',
    'importExport',
  ]) {
    assert.equal(domains.has(domain), true, `src/main.js must require ${domain}`);
  }
});

test('placement core changes require both behavior and placement declarations', () => {
  assert.deepEqual(requiredDomainsForFile('src/modulePlacement.js').sort(), ['behavior', 'placement']);
});
