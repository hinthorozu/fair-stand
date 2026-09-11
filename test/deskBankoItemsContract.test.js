import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, resolveModuleCatalogKey } from '../src/catalog.js';
import {
  createCounterModuleState,
  createModuleStateFromDescriptor,
  duplicateModuleState,
  normalizeModuleItemState,
} from '../src/designState.js';
import { getItem } from '../src/items.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';
import { resolveModuleContract } from '../src/moduleContracts.js';
import { getExpandedModuleRecipe } from '../src/moduleRecipes.js';

const BANKO_KEYS = [
  'desk_banko_100',
  'desk_banko_150',
  'desk_banko_200',
  'desk_banko_100_L',
  'desk_banko_150_L',
  'desk_banko_200_L',
];

const EXPECTED = {
  desk_banko_100: {
    widthCm: 100, depthCm: 50, heightCm: 100, shape: 'straight', faceCount: 6,
    recipeQuantities: {
      profile_91: 3, profile_41_5: 4, upright_99: 4, panel_98: 2, panel_48_5: 4,
      connector_start: 6, connector_single: 12, counter_top_110_60: 1,
    },
  },
  desk_banko_150: {
    widthCm: 150, depthCm: 50, heightCm: 100, shape: 'straight', faceCount: 6,
    recipeQuantities: {
      profile_140_5: 3, profile_41_5: 4, upright_99: 4, panel_147_5: 2, panel_48_5: 4,
      connector_start: 6, connector_single: 12, counter_top_160_60: 1,
    },
  },
  desk_banko_200: {
    widthCm: 200, depthCm: 50, heightCm: 100, shape: 'straight', faceCount: 6,
    recipeQuantities: {
      profile_190: 3, profile_41_5: 4, upright_99: 4, panel_197: 2, panel_48_5: 4,
      connector_start: 6, connector_single: 12, counter_top_210_60: 1,
    },
  },
  desk_banko_100_L: {
    widthCm: 100, depthCm: 100, heightCm: 100, shape: 'L', faceCount: 8,
    recipeQuantities: {
      profile_91: 5, profile_41_5: 5, upright_99: 5, panel_98: 4, panel_48_5: 4,
      connector_start: 8, connector_single: 16, counter_top_110_60: 1, counter_top_52_60: 1,
    },
  },
  desk_banko_150_L: {
    widthCm: 150, depthCm: 150, heightCm: 100, shape: 'L', faceCount: 8,
    recipeQuantities: {
      profile_140_5: 5, profile_91: 1, profile_41_5: 4, upright_99: 5, panel_147_5: 4, panel_48_5: 4,
      connector_start: 8, connector_single: 16, counter_top_160_60: 1, counter_top_102_60: 1,
    },
  },
  desk_banko_200_L: {
    widthCm: 200, depthCm: 200, heightCm: 100, shape: 'L', faceCount: 8,
    recipeQuantities: {
      profile_190: 5, profile_140_5: 1, profile_41_5: 4, upright_99: 5, panel_197: 4, panel_48_5: 4,
      connector_start: 8, connector_single: 16, counter_top_210_60: 1, counter_top_150_60: 1,
    },
  },
};

for (const itemKey of BANKO_KEYS) {
  test(`${itemKey}: canonical composite identity, state and recipe parity`, () => {
    const item = getItem(itemKey);
    const expected = EXPECTED[itemKey];
    const catalog = MODULE_CATALOG[itemKey];
    const isL = expected.shape === 'L';

    assert.equal(item.itemKey, itemKey);
    assert.equal(item.type, 'counter');
    assert.equal(item.composition?.mode, 'recipe');
    assert.equal(item.composition?.moduleType, 'counter');
    assert.equal(item.composition?.nominalWidthCm, expected.widthCm);
    assert.equal(Object.hasOwn(item, 'unit'), false);
    assert.deepEqual(item.dimensions, {
      widthCm: expected.widthCm,
      depthCm: expected.depthCm,
      heightCm: expected.heightCm,
    });
    if (isL) {
      assert.equal(item.shape, 'L');
      assert.equal(item.composition?.options?.shape, 'L');
    } else {
      assert.equal(item.shape, undefined);
    }

    assert.equal(catalog.itemKey, itemKey);
    assert.equal(catalog.label, item.name);
    assert.equal(catalog.type, 'counter');
    assert.equal(catalog.widthCm, expected.widthCm);
    assert.equal(catalog.depthCm, expected.depthCm);
    assert.equal(catalog.heightCm, expected.heightCm);
    if (isL) assert.equal(catalog.shape, 'L');

    const state = createModuleStateFromDescriptor(catalog);
    assert.equal(state.itemKey, itemKey);
    assert.equal(state.catalogKey, itemKey);
    assert.equal(state.type, 'counter');
    assert.equal(state.shape, expected.shape);
    assert.equal(state.widthCm, expected.widthCm);
    assert.equal(state.depthCm, expected.depthCm);
    assert.equal(Object.keys(state.faces).length, expected.faceCount);

    const byWidth = createCounterModuleState(expected.widthCm, isL ? { shape: 'L' } : {});
    assert.equal(byWidth.itemKey, itemKey);

    assert.equal(getModuleBehavior(state).placement, 'free');
    assert.equal(getModuleBehavior(state).moveSnapCm, 50);
    if (isL) {
      assert.equal(getModuleBehavior(state).defaultRotationDeg, 270);
      assert.equal(getModuleBehavior(state).rotationStepDeg, 90);
    } else {
      assert.equal(getModuleBehavior(state).rotationStepDeg, 45);
    }

    const contract = resolveModuleContract(itemKey);
    assert.equal(contract.bom.mode, 'recipe');
    assert.equal(contract.bom.source, 'src/moduleRecipes.js');

    const recipe = getExpandedModuleRecipe('counter', expected.widthCm, isL ? { shape: 'L' } : {});
    const quantities = Object.fromEntries(
      recipe.items.map((entry) => [entry.itemKey ?? entry.partId, entry.quantity]),
    );
    assert.deepEqual(quantities, expected.recipeQuantities);

    const legacy = JSON.parse(JSON.stringify(state));
    delete legacy.itemKey;
    delete legacy.catalogKey;
    const restored = normalizeModuleItemState(legacy);
    assert.equal(restored.itemKey, itemKey);
    assert.equal(resolveModuleCatalogKey(restored), itemKey);

    const duplicate = duplicateModuleState(state);
    assert.notEqual(duplicate.id, state.id);
    assert.equal(duplicate.itemKey, itemKey);
  });
}
