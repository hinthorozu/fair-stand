import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCatalogItem,
  listCatalogGroups,
} from '../src/catalog.js';
import { createCoatRackModuleState, createModuleStateFromDescriptor } from '../src/designState.js';
import { getItem } from '../src/items.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';

test('coat rack is an Extra catalog module backed by the supplied GLB', () => {
  const item = getCatalogItem('coat_rack');
  assert.deepEqual(item, {
    itemKey: 'coat_rack',
    label: 'Askılık',
    previewId: 5,
  });
  const extra = listCatalogGroups().find((group) => group.label === 'Extra');
  assert.ok(extra?.keys.includes('coat_rack'));

  const state = createCoatRackModuleState();
  assert.equal(state.type, 'coat-rack');
  assert.equal(state.widthCm, 43);
  assert.equal(state.depthCm, 43);
  assert.equal(state.heightCm, 180);

  const canonicalState = createModuleStateFromDescriptor(item, { itemKey: 'coat_rack' });
  assert.ok(canonicalState);
  assert.equal(canonicalState.type, 'coat-rack');
  assert.equal(canonicalState.itemKey, 'coat_rack');

  const behavior = getModuleBehavior(state);
  assert.equal(behavior.placement, 'free');
  assert.equal(behavior.collision, 'none');

  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.equal(getItem('coat_rack').modelFile, 'coat_rack.glb');
  assert.match(scene, /loadItemModel\('coat_rack'\)/);
  assert.match(scene, /function createCoatRackModule\(moduleState, moduleIndex\)/);
  assert.match(scene, /moduleState\.type === 'coat-rack'/);
});
