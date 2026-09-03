import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const README_URL = new URL('../README.md', import.meta.url);
const CONTRACT_URL = new URL('../SYSTEM_DEVELOPMENT_CONTRACT.md', import.meta.url);

test('README documents the universal impact sweep and canonical browser CI order', async () => {
  const source = await readFile(README_URL, 'utf8');

  assert.match(source, /SYSTEM_CHANGE_GATE\.md/);
  assert.match(source, /SYSTEM_IMPACT_SWEEP\.md/);
  assert.match(source, /SYSTEM_DEVELOPMENT_CONTRACT\.md/);
  assert.match(source, /SYSTEM_AUDIT_CHECKLIST\.md/);
  assert.match(source, /\.github\/change-contract\.json/);
  assert.match(source, /SYSTEM_IMPACT_DOMAINS/);
  assert.match(source, /SYSTEM_BROWSER_E2E_DOMAINS/);
  assert.match(source, /npm run contract:verify/);
  assert.match(source, /contract:verify[\s\S]*npm ci[\s\S]*npm test[\s\S]*npm run build[\s\S]*Chromium[\s\S]*npm run e2e/);
  assert.match(source, /targeted regression/);
  assert.match(source, /targeted E2E/);
  assert.match(source, /post-merge ROG CI/);
});

test('SYSTEM_DEVELOPMENT_CONTRACT hands off to the dynamic universal gate and browser E2E policy', async () => {
  const source = await readFile(CONTRACT_URL, 'utf8');

  assert.match(source.slice(0, 1600), /SYSTEM_CHANGE_GATE\.md/);
  assert.match(source.slice(0, 2000), /SYSTEM_IMPACT_SWEEP\.md/);
  assert.match(source.slice(0, 2200), /\.github\/change-contract\.json/);
  assert.match(source, /SYSTEM_IMPACT_DOMAINS/);
  assert.doesNotMatch(source, /tüm 17 impact domain/);
  assert.match(source, /SYSTEM_BROWSER_E2E_DOMAINS/);
  assert.match(source, /npm run contract:verify/);
  assert.match(source, /contract:verify → npm ci → npm test → npm run build[\s\S]*npm run e2e/);
  assert.match(source, /post-merge ROG CI/);
});
