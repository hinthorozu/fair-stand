import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { MODULE_CATALOG, MODULE_CATALOG_GROUPS } from '../src/catalog.js';
import { createIndoorPlantModuleState } from '../src/designState.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';

test('Yapay Çiçek 1 is the only active artificial plant inside Extra', () => {
  assert.deepEqual(MODULE_CATALOG.EXTRA_INDOOR_PLANT_1, {
    type: 'indoor-plant-1', widthCm: 60, depthCm: 60, heightCm: 120, label: 'Yapay Çiçek 1',
  });
  assert.equal(MODULE_CATALOG.EXTRA_INDOOR_PLANT_2, undefined);
  const extra = MODULE_CATALOG_GROUPS.find((group) => group.label === 'Extra');
  assert.ok(extra?.keys.includes('EXTRA_INDOOR_PLANT_1'));
  assert.equal(extra?.keys.includes('EXTRA_INDOOR_PLANT_2'), false);
});

test('Yapay Çiçek 1 uses 10 cm free-placement snapping', () => {
  const behavior = getModuleBehavior('indoor-plant-1');
  assert.equal(behavior.placement, 'free');
  assert.equal(behavior.moveSnapCm, 10);
  assert.equal(behavior.collision, 'footprint');
});

test('only Yapay Çiçek 1 is wired while the second GLB file remains parked', () => {
  assert.equal(createIndoorPlantModuleState().type, 'indoor-plant-1');
  assert.ok(existsSync(new URL('../public/models/indoor_plants.glb', import.meta.url)));
  assert.ok(existsSync(new URL('../public/models/indoor_plants2.glb', import.meta.url)));

  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /indoor_plants\.glb/);
  assert.doesNotMatch(scene, /indoor_plants2\.glb/);
  assert.doesNotMatch(scene, /indoor-plant-2/);
  assert.match(scene, /function createIndoorPlantModule\(moduleState, moduleIndex\)/);
  assert.match(scene, /selectionMode: 'module'/);

  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /createIndoorPlantModuleState\(\)/);
  assert.doesNotMatch(main, /createIndoorPlantModuleState\(2\)/);
  assert.doesNotMatch(main, /indoor-plant-2/);
});
