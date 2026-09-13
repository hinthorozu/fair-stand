import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  ASSET_PROJECT_INDEX,
  ASSET_STORE_NAME,
  CONFIGURATOR_DB_NAME,
  CONFIGURATOR_DB_VERSION,
  PROJECT_STORE_NAME,
} from '../src/configuratorDb.js';

const db = readFileSync(new URL('../src/configuratorDb.js', import.meta.url), 'utf8');
const projectStore = readFileSync(new URL('../src/projectStore.js', import.meta.url), 'utf8');
const assetStore = readFileSync(new URL('../src/assetStore.js', import.meta.url), 'utf8');

test('IndexedDB adı sürüm ve depolar tek sahibin sabitleridir', () => {
  assert.equal(CONFIGURATOR_DB_NAME, 'fair-stand-configurator');
  assert.equal(CONFIGURATOR_DB_VERSION, 2);
  assert.equal(PROJECT_STORE_NAME, 'projects');
  assert.equal(ASSET_STORE_NAME, 'image-assets');
  assert.equal(ASSET_PROJECT_INDEX, 'projectId');
  assert.match(db, /function openConfiguratorDb\(/);
  assert.match(db, /indexedDB\.open\(CONFIGURATOR_DB_NAME, CONFIGURATOR_DB_VERSION\)/);
});

test('projectStore ve assetStore kendi openDb şemasını taşımaz', () => {
  assert.doesNotMatch(projectStore, /indexedDB\.open/);
  assert.doesNotMatch(assetStore, /indexedDB\.open/);
  assert.match(projectStore, /openConfiguratorDb/);
  assert.match(assetStore, /openConfiguratorDb/);
});
