import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, resolveModuleCatalogKey } from '../src/catalog.js';
import {
  createIndoorPlantModuleState,
  createModuleStateFromDescriptor,
  duplicateModuleState,
  normalizeModuleItemState,
} from '../src/designState.js';
import { getItem } from '../src/items.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';
import { resolveModuleContract } from '../src/moduleContracts.js';

const PLANT_KEYS = [
  'EXTRA_INDOOR_PLANT_1',
  'EXTRA_LONG_PLANTER_100',
  'EXTRA_LONG_PLANTER_150',
  'EXTRA_LONG_PLANTER_200',
];

const EXPECTED = {
  EXTRA_INDOOR_PLANT_1: {
    widthCm: 60,
    depthCm: 60,
    heightCm: 120,
    modelFile: null,
    runtimeModelFile: 'indoor_plants.glb',
    modelRotationYDeg: 0,
    preserveModelScale: false,
    hasSurface: false,
    profile: 'free-model-fixed',
  },
  EXTRA_LONG_PLANTER_100: {
    widthCm: 100,
    depthCm: 30,
    heightCm: 30,
    modelFile: 'saksi_bitkili_100x30x30.glb',
    runtimeModelFile: 'saksi_bitkili_100x30x30.glb',
    modelRotationYDeg: 90,
    preserveModelScale: true,
    hasSurface: true,
    profile: 'free-model-color',
  },
  EXTRA_LONG_PLANTER_150: {
    widthCm: 150,
    depthCm: 30,
    heightCm: 30,
    modelFile: 'saksi_bitkili_150x30x30.glb',
    runtimeModelFile: 'saksi_bitkili_150x30x30.glb',
    modelRotationYDeg: 90,
    preserveModelScale: true,
    hasSurface: true,
    profile: 'free-model-color',
  },
  EXTRA_LONG_PLANTER_200: {
    widthCm: 200,
    depthCm: 30,
    heightCm: 30,
    modelFile: 'saksi_bitkili_200x30x30.glb',
    runtimeModelFile: 'saksi_bitkili_200x30x30.glb',
    modelRotationYDeg: 90,
    preserveModelScale: true,
    hasSurface: true,
    profile: 'free-model-color',
  },
};

for (const itemKey of PLANT_KEYS) {
  test(`${itemKey}: canonical indoor-plant identity and state parity`, () => {
    const item = getItem(itemKey);
    const expected = EXPECTED[itemKey];
    const catalog = MODULE_CATALOG[itemKey];

    assert.equal(item.itemKey, itemKey);
    assert.equal(item.type, 'indoor-plant-1');
    assert.equal(Object.hasOwn(item, 'unit'), false);
    assert.equal(Object.hasOwn(item, 'composition'), false);
    assert.deepEqual(item.dimensions, {
      widthCm: expected.widthCm,
      depthCm: expected.depthCm,
      heightCm: expected.heightCm,
    });
    assert.equal(item.modelFile ?? null, expected.modelFile);
    assert.equal(item.modelRotationYDeg, expected.modelRotationYDeg);
    assert.equal(item.preserveModelScale, expected.preserveModelScale);

    assert.equal(catalog.itemKey, itemKey);
    assert.equal(catalog.label, item.name);
    assert.equal(catalog.type, 'indoor-plant-1');
    assert.equal(catalog.widthCm, expected.widthCm);
    assert.equal(catalog.modelFile ?? null, expected.modelFile);

    const state = createModuleStateFromDescriptor(catalog);
    assert.equal(state.itemKey, itemKey);
    assert.equal(state.catalogKey, itemKey);
    assert.equal(state.type, 'indoor-plant-1');
    assert.equal(state.modelFile, expected.runtimeModelFile);
    assert.equal(Boolean(state.surface), expected.hasSurface);
    if (expected.hasSurface) assert.equal(state.surface.color, '#ffffff');

    const behavior = getModuleBehavior(state);
    assert.equal(behavior.placement, 'free');
    assert.equal(behavior.moveSnapCm, 10);
    assert.equal(behavior.collision, 'footprint');

    const contract = resolveModuleContract(itemKey);
    assert.equal(contract.profile, expected.profile);
    assert.equal(contract.bom.mode, 'decision-required');

    const legacy = JSON.parse(JSON.stringify(state));
    delete legacy.itemKey;
    delete legacy.catalogKey;
    const restored = normalizeModuleItemState(legacy);
    assert.equal(restored.itemKey, itemKey);
    assert.equal(resolveModuleCatalogKey({
      type: restored.type,
      widthCm: restored.widthCm,
      depthCm: restored.depthCm,
      modelFile: restored.modelFile === 'indoor_plants.glb' ? null : restored.modelFile,
    }), itemKey);

    const duplicate = duplicateModuleState(state);
    assert.notEqual(duplicate.id, state.id);
    assert.equal(duplicate.itemKey, itemKey);
  });
}

test('boş factory EXTRA_INDOOR_PLANT_1 default üretir', () => {
  const state = createIndoorPlantModuleState();
  assert.equal(state.itemKey, 'EXTRA_INDOOR_PLANT_1');
  assert.equal(state.modelFile, 'indoor_plants.glb');
  assert.equal(state.surface, undefined);
});
