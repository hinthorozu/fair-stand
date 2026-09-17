import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCatalogItem,
  listCatalogGroups,
} from '../src/catalog.js';
import { createCoatRackModuleState, createModuleStateFromDescriptor } from '../src/designState.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';

test('coat rack is an Extra catalog module backed by the supplied GLB', () => {
  const item = getCatalogItem('COAT_RACK');
  assert.deepEqual(item, {
    itemKey: 'COAT_RACK',
    type: 'coat-rack',
    label: 'Askılık',
    catalogPreview: 'coat-rack',
    widthCm: 43,
    depthCm: 43,
    heightCm: 180,
    modelFile: 'coat_rack.glb',
    unit: 'adet',
  });
  const extra = listCatalogGroups().find((group) => group.label === 'Extra');
  assert.ok(extra?.keys.includes('COAT_RACK'));

  const state = createCoatRackModuleState();
  assert.equal(state.type, 'coat-rack');
  assert.equal(state.widthCm, 43);
  assert.equal(state.depthCm, 43);
  assert.equal(state.heightCm, 180);

  const canonicalState = createModuleStateFromDescriptor(item, { itemKey: 'COAT_RACK' });
  assert.ok(canonicalState);
  assert.equal(canonicalState.type, 'coat-rack');
  assert.equal(canonicalState.itemKey, 'COAT_RACK');

  const behavior = getModuleBehavior(state);
  assert.equal(behavior.placement, 'free');
  assert.equal(behavior.collision, 'none');

  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.equal(item.modelFile, 'coat_rack.glb');
  assert.ok(scene.includes("getItem('COAT_RACK').modelFile"));
  assert.match(scene, /function createCoatRackModule\(moduleState, moduleIndex\)/);
  assert.match(scene, /moduleState\.type === 'coat-rack'/);
});
