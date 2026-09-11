import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, resolveModuleCatalogKey } from '../src/catalog.js';
import {
  createBaseWallModuleState,
  createModuleStateFromDescriptor,
  duplicateModuleState,
  normalizeModuleItemState,
} from '../src/designState.js';
import { getItem } from '../src/items.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';
import { resolveModuleContract } from '../src/moduleContracts.js';
import { getModuleRecipe } from '../src/moduleRecipes.js';

const WALL_BASE_KEYS = ['wall_base_100', 'wall_base_150', 'wall_base_200'];

const EXPECTED = {
  wall_base_100: {
    widthCm: 100,
    recipeQuantities: {
      profile_91: 4,
      upright_346_5: 2,
      profile_41_5: 4,
      upright_49_5: 2,
      panel_98: 7,
      panel_48_5: 2,
      connector_start: 6,
      connector_single: 17,
      base_top_107_50: 1,
    },
    cornerPanel: 'panel_corner_92',
  },
  wall_base_150: {
    widthCm: 150,
    recipeQuantities: {
      profile_140_5: 4,
      upright_346_5: 2,
      profile_41_5: 4,
      upright_49_5: 2,
      panel_147_5: 7,
      panel_48_5: 2,
      connector_start: 6,
      connector_single: 17,
      base_top_157_50: 1,
    },
    cornerPanel: 'panel_corner_142_5',
  },
  wall_base_200: {
    widthCm: 200,
    recipeQuantities: {
      profile_190: 4,
      upright_346_5: 2,
      profile_41_5: 4,
      upright_49_5: 2,
      panel_197: 7,
      panel_48_5: 2,
      connector_start: 6,
      connector_single: 17,
      base_top_206_50: 1,
    },
    cornerPanel: 'panel_corner_192',
  },
};

for (const itemKey of WALL_BASE_KEYS) {
  test(`${itemKey}: canonical composite identity, state and recipe parity`, () => {
    const item = getItem(itemKey);
    const expected = EXPECTED[itemKey];
    const catalog = MODULE_CATALOG[itemKey];

    assert.equal(item.itemKey, itemKey);
    assert.equal(item.type, 'base-wall');
    assert.equal(item.composition?.mode, 'recipe');
    assert.equal(item.composition?.moduleType, 'base-wall');
    assert.equal(item.composition?.nominalWidthCm, expected.widthCm);
    assert.equal(Object.hasOwn(item, 'unit'), false);
    assert.deepEqual(item.dimensions, {
      widthCm: expected.widthCm,
      depthCm: 50,
      heightCm: 350,
    });

    assert.equal(catalog.itemKey, itemKey);
    assert.equal(catalog.label, item.name);
    assert.equal(catalog.type, 'base-wall');
    assert.equal(catalog.widthCm, expected.widthCm);
    assert.equal(catalog.depthCm, 50);
    assert.equal(catalog.heightCm, 350);

    const state = createModuleStateFromDescriptor(catalog);
    assert.equal(state.itemKey, itemKey);
    assert.equal(state.catalogKey, itemKey);
    assert.equal(state.type, 'base-wall');
    assert.equal(state.widthCm, expected.widthCm);
    assert.equal(state.depthCm, 50);
    assert.equal(state.heightCm, 350);
    assert.equal(state.strips.length, 7);
    assert.deepEqual(Object.keys(state.faces).sort(), ['front', 'left', 'right']);

    const byWidth = createBaseWallModuleState(expected.widthCm);
    assert.equal(byWidth.itemKey, itemKey);
    assert.equal(byWidth.catalogKey, itemKey);

    const behavior = getModuleBehavior(state);
    assert.equal(behavior.placement, 'wall');
    assert.equal(behavior.moveSnapCm, 50);
    assert.equal(behavior.rotationStepDeg, 90);
    assert.equal(behavior.collisionDepth, 'wall-backbone');

    const contract = resolveModuleContract(itemKey);
    assert.equal(contract.bom.mode, 'recipe');
    assert.equal(contract.bom.source, 'src/moduleRecipes.js');

    const recipe = getModuleRecipe('base-wall', expected.widthCm);
    const quantities = Object.fromEntries(
      recipe.items.map((entry) => [entry.itemKey ?? entry.partId, entry.quantity]),
    );
    assert.deepEqual(quantities, expected.recipeQuantities);
    assert.equal(recipe.variants.innerCornerPanelItemKey, expected.cornerPanel);

    const legacy = JSON.parse(JSON.stringify(state));
    delete legacy.itemKey;
    delete legacy.catalogKey;
    const restored = normalizeModuleItemState(legacy);
    assert.equal(restored.itemKey, itemKey);
    assert.equal(resolveModuleCatalogKey(restored), itemKey);

    const duplicate = duplicateModuleState(state);
    assert.notEqual(duplicate.id, state.id);
    assert.equal(duplicate.itemKey, itemKey);
    assert.notEqual(duplicate.strips[0].id, state.strips[0].id);
    assert.notEqual(duplicate.faces.front.id, state.faces.front.id);
  });
}
