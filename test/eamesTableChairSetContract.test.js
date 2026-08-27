import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import {
  createEamesTableChairSetModuleState,
  createTableChairSetModuleState,
} from '../src/designState.js';

test('Eames table chair set is a separate catalog module after the original set', () => {
  const original = MODULE_CATALOG.furniture_table_chair_set_minyon;
  const eames = MODULE_CATALOG.furniture_table_chair_set_eames;
  assert.equal(original.type, 'table-chair-set');
  assert.equal(eames.type, 'table-chair-set-eames');
  assert.equal(eames.widthCm, 150);
  assert.equal(eames.depthCm, 150);
  assert.ok(
    MODULE_CATALOG_KEYS.indexOf('furniture_table_chair_set_eames')
      === MODULE_CATALOG_KEYS.indexOf('furniture_table_chair_set_minyon') + 1,
  );
});

test('Eames set contains four chairs without changing the original state factory', () => {
  const original = createTableChairSetModuleState();
  const eames = createEamesTableChairSetModuleState();
  assert.equal(original.type, 'table-chair-set');
  assert.equal(eames.type, 'table-chair-set-eames');
  assert.equal(eames.chairCount, 4);
  assert.equal(eames.widthCm, 150);
  assert.equal(eames.depthCm, 150);
});

test('Eames renderer uses the optimized external mesh once for four chairs', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /function createEamesTableChairSetModule/);
  assert.match(source, /models\/eames-table-chair\.mesh\.bin/);
  assert.match(source, /chairPlacements.forEach/);
  assert.match(source, /EAMES_CHAIR_MODEL_SCALE/);
});

test('optimized Eames payload and attribution are present', () => {
  const payload = fs.statSync(new URL('../public/models/eames-table-chair.mesh.bin', import.meta.url));
  assert.equal(payload.size, 14999);
  const attribution = fs.readFileSync(
    new URL('../public/models/EAMES_CHAIR_ATTRIBUTION.txt', import.meta.url),
    'utf8',
  );
  assert.match(attribution, /faiyaz5yaz/);
  assert.match(attribution, /CC BY 4.0/);
});
