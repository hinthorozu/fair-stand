import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { MODULE_CATALOG, MODULE_CATALOG_GROUPS } from '../src/catalog.js';
import { createIndoorPlantModuleState } from '../src/designState.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';

test('artificial plants are catalogued inside Extra', () => {
  assert.deepEqual(MODULE_CATALOG.EXTRA_INDOOR_PLANT_1, {
    type: 'indoor-plant-1', widthCm: 60, depthCm: 60, heightCm: 120, label: 'Yapay Çiçek 1',
  });
  assert.deepEqual(MODULE_CATALOG.EXTRA_INDOOR_PLANT_2, {
    type: 'indoor-plant-2', widthCm: 60, depthCm: 60, heightCm: 120, label: 'Yapay Çiçek 2',
  });
  const extra = MODULE_CATALOG_GROUPS.find((group) => group.label === 'Extra');
  assert.ok(extra?.keys.includes('EXTRA_INDOOR_PLANT_1'));
  assert.ok(extra?.keys.includes('EXTRA_INDOOR_PLANT_2'));
});

test('artificial plants use 10 cm free-placement snapping', () => {
  for (const type of ['indoor-plant-1', 'indoor-plant-2']) {
    const behavior = getModuleBehavior(type);
    assert.equal(behavior.placement, 'free');
    assert.equal(behavior.moveSnapCm, 10);
    assert.equal(behavior.collision, 'footprint');
  }
});

test('artificial plant state variants and GLB files are wired', () => {
  assert.equal(createIndoorPlantModuleState(1).type, 'indoor-plant-1');
  assert.equal(createIndoorPlantModuleState(2).type, 'indoor-plant-2');
  assert.ok(existsSync(new URL('../public/models/indoor_plants.glb', import.meta.url)));
  assert.ok(existsSync(new URL('../public/models/indoor_plants2.glb', import.meta.url)));

  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /indoor_plants\.glb/);
  assert.match(scene, /indoor_plants2\.glb/);
  assert.match(scene, /function createIndoorPlantModule\(moduleState, moduleIndex\)/);
  assert.match(scene, /selectionMode: 'module'/);

  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /createIndoorPlantModuleState\(1\)/);
  assert.match(main, /createIndoorPlantModuleState\(2\)/);
});
