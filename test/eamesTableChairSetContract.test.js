import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import { createEamesTableChairSetModuleState } from '../src/designState.js';

test('Eames is the only table-chair set in the catalog', () => {
  const eames = MODULE_CATALOG.furniture_table_chair_set_eames;
  assert.equal(MODULE_CATALOG.furniture_table_chair_set_minyon, undefined);
  assert.equal(MODULE_CATALOG_KEYS.includes('furniture_table_chair_set_minyon'), false);
  assert.equal(eames.type, 'table-chair-set-eames');
  assert.equal(eames.widthCm, 150);
  assert.equal(eames.depthCm, 150);
});

test('Eames set contains four chairs', () => {
  const eames = createEamesTableChairSetModuleState();
  assert.equal(eames.type, 'table-chair-set-eames');
  assert.equal(eames.chairCount, 4);
  assert.equal(eames.widthCm, 150);
  assert.equal(eames.depthCm, 150);
});

test('Eames renderer loads the original GLB once and clones four chairs', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /GLTFLoader/);
  assert.match(source, /models\/eames_chair\.glb/);
  assert.match(source, /template\.clone\(true\)/);
  assert.match(source, /chairPlacements\.forEach/);
});

test('original Eames GLB asset is present', () => {
  const payload = fs.statSync(new URL('../public/models/eames_chair.glb', import.meta.url));
  assert.ok(payload.size > 400000);
});
