import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import { createGlassTableModuleState } from '../src/designState.js';
import { getItem } from '../src/items.js';

test('glass_table katalog ve state kimliği sabittir', () => {
  const catalog = MODULE_CATALOG.glass_table;
  const item = getItem('glass_table');
  assert.equal(item.itemKey, 'glass_table');
  assert.equal(item.type, 'table-glass');
  assert.equal(item.name, 'Cam Masa');
  assert.equal(item.dimensions.tableDiameterCm, 75);
  assert.equal(catalog.type, 'table-glass');
  assert.equal(catalog.label, 'Cam Masa');
  assert.equal(catalog.widthCm, 75);
  assert.equal(catalog.depthCm, 75);
  assert.equal(catalog.heightCm, 74);
  assert.ok(MODULE_CATALOG_KEYS.includes('glass_table'));

  const state = createGlassTableModuleState();
  assert.equal(state.itemKey, 'glass_table');
  assert.equal(state.itemKey, 'glass_table');
  assert.equal(state.type, 'table-glass');
  assert.equal(state.widthCm, 75);
  assert.equal(state.depthCm, 75);
  assert.equal(state.heightCm, 74);
  assert.equal(state.surface, undefined);
});

test('glass_table renderer uses the canonical Item diameter', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /function createGlassTableModule/);
  assert.match(source, /moduleState\.type === 'table-glass'/);
  assert.match(source, /function addProceduralGlassTable/);
  assert.match(source, /getItem\('glass_table'\)/);
});
