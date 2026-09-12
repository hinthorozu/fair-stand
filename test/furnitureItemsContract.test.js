import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, resolveItemKey } from '../src/catalog.js';
import {
  createBarStoolModuleState,
  createBeigeSofaSetModuleState,
  createCoffeeTableClassicModuleState,
  createEamesChairModuleState,
  createSofaDoubleClassicModuleState,
  createSofaSingleClassicModuleState,
  createEamesTableChairSetModuleState,
  createGlassTableModuleState,
  createModuleStateFromDescriptor,
  duplicateModuleState,
  normalizeModuleItemState,
} from '../src/designState.js';
import { FURNITURE_ITEMS, getItem } from '../src/items.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';
import { resolveModuleContract } from '../src/moduleContracts.js';

const EXPECTED = {
  furniture_sofa_set_classic: {
    type: 'sofa-set-classic',
    widthCm: 150,
    depthCm: 150,
    heightCm: 78,
    chairCount: null,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    boundarySnap: 'wall-inner-face',
    factory: createBeigeSofaSetModuleState,
    profile: 'free-model-color',
    hasSurface: true,
    composition: [
      { itemKey: 'furniture_sofa_double_classic', quantity: 1 },
      { itemKey: 'furniture_sofa_single_classic', quantity: 2 },
      { itemKey: 'furniture_coffee_table_classic', quantity: 1 },
    ],
  },
  furniture_sofa_single_classic: {
    type: 'sofa-single-classic',
    widthCm: 65,
    depthCm: 45,
    heightCm: 78,
    chairCount: null,
    rotationStepDeg: 45,
    defaultRotationDeg: 0,
    boundarySnap: 'stand-edge',
    collision: 'none',
    factory: createSofaSingleClassicModuleState,
    profile: 'free-model-color',
    hasSurface: true,
    visualRotationYDeg: -135,
  },
  furniture_sofa_double_classic: {
    type: 'sofa-double-classic',
    widthCm: 150,
    depthCm: 45,
    heightCm: 78,
    chairCount: null,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    boundarySnap: 'stand-edge',
    collision: 'none',
    factory: createSofaDoubleClassicModuleState,
    profile: 'free-model-color',
    hasSurface: true,
    visualRotationYDeg: -45,
  },
  furniture_coffee_table_classic: {
    type: 'coffee-table-classic',
    widthCm: 60,
    depthCm: 42,
    heightCm: 38,
    chairCount: null,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    boundarySnap: 'stand-edge',
    collision: 'none',
    factory: createCoffeeTableClassicModuleState,
    profile: 'free-model-fixed',
    hasSurface: false,
  },
  furniture_table_chair_set_eames: {
    type: 'table-chair-set-eames',
    widthCm: 150,
    depthCm: 150,
    heightCm: 82,
    chairCount: 4,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    boundarySnap: 'stand-edge',
    collision: 'none',
    factory: createEamesTableChairSetModuleState,
    profile: 'free-model-color',
    hasSurface: true,
    composition: [
      { itemKey: 'glass_table', quantity: 1 },
      { itemKey: 'chair_eames', quantity: 4 },
    ],
  },
  chair_eames: {
    type: 'chair',
    widthCm: 46,
    depthCm: 58,
    heightCm: 82,
    chairCount: null,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    boundarySnap: 'stand-edge',
    collision: 'none',
    factory: createEamesChairModuleState,
    profile: 'free-model-color',
    hasSurface: true,
  },
  glass_table: {
    type: 'table-glass',
    widthCm: 75,
    depthCm: 75,
    heightCm: 74,
    chairCount: null,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    boundarySnap: 'stand-edge',
    collision: 'none',
    factory: createGlassTableModuleState,
    profile: 'free-model-fixed',
    hasSurface: false,
  },
  furniture_bar_stool_classic: {
    type: 'bar-stool',
    widthCm: 60,
    depthCm: 55,
    heightCm: 121,
    chairCount: null,
    rotationStepDeg: 45,
    defaultRotationDeg: 270,
    boundarySnap: 'stand-edge',
    collision: 'none',
    factory: createBarStoolModuleState,
    profile: 'free-model-color',
    hasSurface: true,
  },
};

for (const itemKey of Object.keys(FURNITURE_ITEMS)) {
  test(`${itemKey}: canonical furniture identity and state parity`, () => {
    const item = getItem(itemKey);
    const expected = EXPECTED[itemKey];
    const catalog = MODULE_CATALOG[itemKey];

    assert.equal(item.itemKey, itemKey);
    assert.equal(item.type, expected.type);
    assert.equal(Object.hasOwn(item, 'unit'), false);
    assert.equal(Object.hasOwn(item, 'chairCount'), false);
    assert.equal(Object.hasOwn(item, 'modelFile'), false);
    if (expected.composition) {
      assert.deepEqual(item.composition.items, expected.composition);
    } else {
      assert.equal(Object.hasOwn(item, 'composition'), false);
    }
    assert.equal(item.dimensions.widthCm, expected.widthCm);
    assert.equal(item.dimensions.depthCm, expected.depthCm);
    assert.equal(item.dimensions.heightCm, expected.heightCm);

    assert.equal(catalog.itemKey, itemKey);
    assert.equal(catalog.label, item.name);
    assert.equal(catalog.type, expected.type);
    assert.equal(catalog.widthCm, expected.widthCm);
    assert.equal(catalog.depthCm, expected.depthCm);
    assert.equal(catalog.heightCm, expected.heightCm);

    const state = createModuleStateFromDescriptor(catalog);
    assert.equal(state.itemKey, itemKey);
    assert.equal(state.itemKey, itemKey);
    assert.equal(state.type, expected.type);
    assert.equal(state.widthCm, expected.widthCm);
    assert.equal(state.depthCm, expected.depthCm);
    assert.equal(state.heightCm, expected.heightCm);
    assert.equal(state.chairCount ?? null, expected.chairCount);
    if (expected.visualRotationYDeg != null) {
      assert.equal(item.visualRotationYDeg, expected.visualRotationYDeg);
      assert.equal(state.visualRotationYDeg, expected.visualRotationYDeg);
    }
    if (expected.hasSurface) {
      assert.equal(state.surface.color, '#ffffff');
    } else {
      assert.equal(state.surface, undefined);
    }

    const emptyFactory = expected.factory();
    assert.equal(emptyFactory.itemKey, itemKey);
    assert.equal(emptyFactory.itemKey, itemKey);

    const behavior = getModuleBehavior(state);
    assert.equal(behavior.placement, 'free');
    assert.equal(behavior.moveSnapCm, 10);
    assert.equal(behavior.rotationStepDeg, expected.rotationStepDeg);
    assert.equal(behavior.defaultRotationDeg, expected.defaultRotationDeg);
    assert.equal(behavior.boundarySnap, expected.boundarySnap);
    if (expected.collision) {
      assert.equal(behavior.collision, expected.collision);
    }

    const contract = resolveModuleContract(itemKey);
    assert.equal(contract.profile, expected.profile);
    assert.equal(contract.bom.mode, 'decision-required');
    assert.equal(contract.bom.source, null);

    const legacy = JSON.parse(JSON.stringify(state));
    delete legacy.itemKey;
    const restored = normalizeModuleItemState(legacy);
    assert.equal(restored.itemKey, itemKey);
    assert.equal(resolveItemKey({
      type: restored.type,
      widthCm: restored.widthCm,
      depthCm: restored.depthCm,
    }), itemKey);

    const duplicate = duplicateModuleState(state);
    assert.notEqual(duplicate.id, state.id);
    assert.equal(duplicate.itemKey, itemKey);
  });
}
