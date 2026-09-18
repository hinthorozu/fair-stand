import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCatalogItem,
  listCatalogGroups,
} from '../src/catalog.js';
import { createIndoorPlantModuleState, createModuleStateFromDescriptor } from '../src/designState.js';
import { getItem } from '../src/items.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';

test('Yapay Çiçek 1 is the only active artificial plant inside Extra', () => {
  assert.deepEqual(getCatalogItem('EXTRA_INDOOR_PLANT_1'), {
    itemKey: 'EXTRA_INDOOR_PLANT_1',
    label: 'Yapay Çiçek 1',
    catalogPreview: 'indoor-plant',
  });
  assert.equal(getCatalogItem('EXTRA_INDOOR_PLANT_2'), null);
  const extra = listCatalogGroups().find((group) => group.label === 'Extra');
  assert.ok(extra?.keys.includes('EXTRA_INDOOR_PLANT_1'));
  assert.equal(extra?.keys.includes('EXTRA_INDOOR_PLANT_2'), false);
});

test('Yapay Çiçek 1 uses 10 cm free-placement snapping', () => {
  const behavior = getModuleBehavior('indoor-plant-1');
  assert.equal(behavior.placement, 'free');
  assert.equal(behavior.moveSnapCm, 10);
  assert.equal(behavior.collision, 'footprint');
});

test('only Yapay Çiçek 1 is wired and the removed second GLB stays absent', () => {
  assert.equal(createIndoorPlantModuleState().type, 'indoor-plant-1');
  assert.ok(existsSync(new URL('../public/models/indoor_plants.glb', import.meta.url)));
  assert.equal(existsSync(new URL('../public/models/indoor_plants2.glb', import.meta.url)), false);

  const canonicalState = createModuleStateFromDescriptor(getCatalogItem('EXTRA_INDOOR_PLANT_1'), {
    itemKey: 'EXTRA_INDOOR_PLANT_1',
  });
  assert.ok(canonicalState);
  assert.equal(canonicalState.type, 'indoor-plant-1');
  assert.equal(canonicalState.itemKey, 'EXTRA_INDOOR_PLANT_1');

  assert.equal(getItem('EXTRA_INDOOR_PLANT_1').modelFile, 'indoor_plants.glb');
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.doesNotMatch(scene, /indoor_plants\.glb/);
  assert.doesNotMatch(scene, /indoor_plants2\.glb/);
  assert.doesNotMatch(scene, /indoor-plant-2/);
  assert.match(scene, /function createIndoorPlantModule\(moduleState, moduleIndex\)/);
  assert.match(scene, /selectionMode: 'module'/);

  const designState = readFileSync(new URL('../src/designState.js', import.meta.url), 'utf8');
  assert.match(designState, /createIndoorPlantModuleState/);
  assert.doesNotMatch(designState, /indoor-plant-2/);
});
