import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MODULE_CATALOG, MODULE_CATALOG_GROUPS } from '../src/catalog.js';
import { createCoatRackModuleState } from '../src/designState.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';

test('coat rack is a Depo catalog module backed by the supplied GLB', () => {
  const item = MODULE_CATALOG.DEPOT_COAT_RACK;
  assert.deepEqual(item, {
    type: 'coat-rack',
    widthCm: 43,
    depthCm: 43,
    heightCm: 180,
    label: 'Askılık',
  });
  const depot = MODULE_CATALOG_GROUPS.find((group) => group.label === 'Depo');
  assert.ok(depot?.keys.includes('DEPOT_COAT_RACK'));

  const state = createCoatRackModuleState();
  assert.equal(state.type, 'coat-rack');
  assert.equal(state.widthCm, 43);
  assert.equal(state.depthCm, 43);
  assert.equal(state.heightCm, 180);

  const behavior = getModuleBehavior(state);
  assert.equal(behavior.placement, 'free');
  assert.equal(behavior.collision, 'footprint');

  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /models\/coat_rack\.glb/);
  assert.match(scene, /function createCoatRackModule\(moduleState, moduleIndex\)/);
  assert.match(scene, /moduleState\.type === 'coat-rack'/);

  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /createCoatRackModuleState/);
  assert.match(main, /module\.type === 'coat-rack'/);
});
