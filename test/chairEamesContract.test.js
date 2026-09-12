import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import { createEamesChairModuleState, createEamesTableChairSetModuleState } from '../src/designState.js';
import { getItem } from '../src/items.js';

test('chair_eames katalog ve state kimliği sabittir', () => {
  const catalog = MODULE_CATALOG.chair_eames;
  const item = getItem('chair_eames');
  assert.equal(item.itemKey, 'chair_eames');
  assert.equal(item.type, 'chair');
  assert.equal(item.name, 'Eames Sandalye');
  assert.equal(catalog.type, 'chair');
  assert.equal(catalog.label, 'Eames Sandalye');
  assert.equal(catalog.widthCm, 46);
  assert.equal(catalog.depthCm, 58);
  assert.equal(catalog.heightCm, 82);
  assert.ok(MODULE_CATALOG_KEYS.includes('chair_eames'));

  const state = createEamesChairModuleState();
  assert.equal(state.itemKey, 'chair_eames');
  assert.equal(state.itemKey, 'chair_eames');
  assert.equal(state.type, 'chair');
  assert.equal(state.widthCm, 46);
  assert.equal(state.depthCm, 58);
  assert.equal(state.heightCm, 82);
  assert.equal(state.chairCount, undefined);
  assert.equal(state.surface.color, '#ffffff');
});

test('chair renderer loads the shared Eames GLB once as type chair', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /function createEamesChairModule/);
  assert.match(source, /moduleState\.type === 'chair'/);
  assert.match(source, /models\/eames_chair\.glb/);
  assert.match(source, /plastic_wit/);
});

test('Eames set is a cluster of one glass table and four chairs', () => {
  const set = createEamesTableChairSetModuleState();
  const item = getItem('furniture_table_chair_set_eames');
  assert.equal(set.itemKey, 'furniture_table_chair_set_eames');
  assert.equal(set.type, 'table-chair-set-eames');
  assert.equal(set.chairCount, 4);
  assert.deepEqual(item.composition.items, [
    { itemKey: 'glass_table', quantity: 1 },
    { itemKey: 'chair_eames', quantity: 4 },
  ]);
});
