import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, resolveItemKey } from '../src/catalog.js';
import {
  createFlatPanelModuleState,
  createModuleStateFromDescriptor,
  duplicateModuleState,
  normalizeModuleItemState,
} from '../src/designState.js';
import { getItem } from '../src/items.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';
import { resolveModuleContract } from '../src/moduleContracts.js';
import { getModuleRecipe } from '../src/moduleRecipes.js';

const WALL_KEYS = ['wall_50', 'wall_100', 'wall_150', 'wall_200'];

const EXPECTED = {
  wall_50: {
    widthCm: 50,
    recipeQuantities: {
      profile_41_5: 2, upright_346_5: 2, panel_48_5: 7, connector_start: 2, connector_single: 13,
    },
    cornerPanel: 'panel_corner_42_5',
  },
  wall_100: {
    widthCm: 100,
    recipeQuantities: {
      profile_91: 2, upright_346_5: 2, panel_98: 7, connector_start: 2, connector_single: 13,
    },
    cornerPanel: 'panel_corner_92',
  },
  wall_150: {
    widthCm: 150,
    recipeQuantities: {
      profile_140_5: 2, upright_346_5: 2, panel_147_5: 7, connector_start: 2, connector_single: 13,
    },
    cornerPanel: 'panel_corner_142_5',
  },
  wall_200: {
    widthCm: 200,
    recipeQuantities: {
      profile_190: 2, upright_346_5: 2, panel_197: 7, connector_start: 2, connector_single: 13,
    },
    cornerPanel: 'panel_corner_192',
  },
};

for (const itemKey of WALL_KEYS) {
  test(`${itemKey}: canonical composite identity, state and recipe parity`, () => {
    const item = getItem(itemKey);
    const expected = EXPECTED[itemKey];
    const catalog = MODULE_CATALOG[itemKey];

    assert.equal(item.itemKey, itemKey);
    assert.equal(item.type, 'flat-panel');
    assert.equal(item.composition?.mode, 'recipe');
    assert.equal(item.composition?.moduleType, 'wall');
    assert.equal(item.composition?.nominalWidthCm, expected.widthCm);
    assert.equal(Object.hasOwn(item, 'unit'), false);
    assert.deepEqual(item.dimensions, { widthCm: expected.widthCm });

    assert.equal(catalog.itemKey, itemKey);
    assert.equal(catalog.label, item.name);
    assert.equal(catalog.type, 'flat-panel');
    assert.equal(catalog.widthCm, expected.widthCm);

    const state = createModuleStateFromDescriptor(catalog);
    assert.equal(state.itemKey, itemKey);
    assert.equal(state.itemKey, itemKey);
    assert.equal(state.type, 'flat-panel');
    assert.equal(state.widthCm, expected.widthCm);
    assert.equal(state.strips.length, 7);

    const byWidth = createFlatPanelModuleState(expected.widthCm);
    assert.equal(byWidth.itemKey, itemKey);
    assert.equal(byWidth.itemKey, itemKey);

    assert.equal(getModuleBehavior(state).placement, 'wall');
    assert.equal(getModuleBehavior(state).moveSnapCm, 50);
    assert.equal(getModuleBehavior(state).rotationStepDeg, 90);

    const contract = resolveModuleContract(itemKey);
    assert.equal(contract.bom.mode, 'recipe');
    assert.equal(contract.bom.source, 'src/moduleRecipes.js');

    const recipe = getModuleRecipe('flat-panel', expected.widthCm);
    const quantities = Object.fromEntries(
      recipe.items.map((entry) => [entry.itemKey ?? entry.partId, entry.quantity]),
    );
    assert.deepEqual(quantities, expected.recipeQuantities);
    assert.equal(recipe.variants.innerCornerPanelItemKey, expected.cornerPanel);

    const legacy = JSON.parse(JSON.stringify(state));
    delete legacy.itemKey;
    const restored = normalizeModuleItemState(legacy);
    assert.equal(restored.itemKey, itemKey);
    assert.equal(resolveItemKey(restored), itemKey);

    const duplicate = duplicateModuleState(state);
    assert.notEqual(duplicate.id, state.id);
    assert.equal(duplicate.itemKey, itemKey);
    assert.notEqual(duplicate.strips[0].id, state.strips[0].id);
  });
}
