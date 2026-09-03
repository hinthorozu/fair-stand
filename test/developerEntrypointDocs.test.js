import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const README_URL = new URL('../README.md', import.meta.url);
const CONTRACT_URL = new URL('../SYSTEM_DEVELOPMENT_CONTRACT.md', import.meta.url);

test('README documents the universal change-gate developer entrypoint and canonical CI order', async () => {
  const source = await readFile(README_URL, 'utf8');

  assert.match(source, /SYSTEM_CHANGE_GATE\.md/);
  assert.match(source, /SYSTEM_DEVELOPMENT_CONTRACT\.md/);
  assert.match(source, /SYSTEM_AUDIT_CHECKLIST\.md/);
  assert.match(source, /\.github\/change-contract\.json/);
  assert.match(source, /npm run contract:verify/);
  assert.match(source, /contract:verify[\s\S]*npm ci[\s\S]*npm test[\s\S]*npm run build/);
  assert.match(source, /targeted regression/);
  assert.match(source, /post-merge ROG CI/);
});

test('SYSTEM_DEVELOPMENT_CONTRACT explicitly hands off from the universal gate', async () => {
  const source = await readFile(CONTRACT_URL, 'utf8');

  assert.match(source.slice(0, 1200), /SYSTEM_CHANGE_GATE\.md/);
  assert.match(source.slice(0, 1600), /\.github\/change-contract\.json/);
  assert.match(source, /17 impact domain/);
  assert.match(source, /npm run contract:verify/);
  assert.match(source, /contract:verify → npm ci → npm test → npm run build/);
  assert.match(source, /post-merge ROG CI/);
});
