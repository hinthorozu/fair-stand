import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, resolveItemKey } from '../src/catalog.js';
import {
  createModuleStateFromDescriptor,
  createShelfModuleState,
  duplicateModuleState,
  normalizeModuleItemState,
} from '../src/designState.js';
import { getItem } from '../src/items.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';
import { resolveModuleContract } from '../src/moduleContracts.js';
import { getModuleRecipe } from '../src/moduleRecipes.js';

const SHELF_KEYS = [
  'wall_shelf_2_100',
  'wall_shelf_2_150',
  'wall_shelf_2_200',
  'wall_shelf_3_100',
  'wall_shelf_3_150',
  'wall_shelf_3_200',
];

const EXPECTED = {
  wall_shelf_2_100: {
    widthCm: 100,
    shelfCount: 2,
    recipeQuantities: {
      profile_91: 2, upright_346_5: 2, panel_98: 7, connector_start: 2, connector_single: 13, shelf_100: 2, shelf_leg: 4,
    },
    corner: 'panel_corner_92',
  },
  wall_shelf_2_150: {
    widthCm: 150,
    shelfCount: 2,
    recipeQuantities: {
      profile_140_5: 2, upright_346_5: 2, panel_147_5: 7, connector_start: 2, connector_single: 13, shelf_150: 2, shelf_leg: 4,
    },
    corner: 'panel_corner_142_5',
  },
  wall_shelf_2_200: {
    widthCm: 200,
    shelfCount: 2,
    recipeQuantities: {
      profile_190: 2, upright_346_5: 2, panel_197: 7, connector_start: 2, connector_single: 13, shelf_200: 2, shelf_leg: 6,
    },
    corner: 'panel_corner_192',
  },
  wall_shelf_3_100: {
    widthCm: 100,
    shelfCount: 3,
    recipeQuantities: {
      profile_91: 2, upright_346_5: 2, panel_98: 7, connector_start: 2, connector_single: 13, shelf_100: 3, shelf_leg: 6,
    },
    corner: 'panel_corner_92',
  },
  wall_shelf_3_150: {
    widthCm: 150,
    shelfCount: 3,
    recipeQuantities: {
      profile_140_5: 2, upright_346_5: 2, panel_147_5: 7, connector_start: 2, connector_single: 13, shelf_150: 3, shelf_leg: 6,
    },
    corner: 'panel_corner_142_5',
  },
  wall_shelf_3_200: {
    widthCm: 200,
    shelfCount: 3,
    recipeQuantities: {
      profile_190: 2, upright_346_5: 2, panel_197: 7, connector_start: 2, connector_single: 13, shelf_200: 3, shelf_leg: 9,
    },
    corner: 'panel_corner_192',
  },
};

for (const itemKey of SHELF_KEYS) {
  test(`${itemKey}: canonical composite identity, state and recipe parity`, () => {
    const item = getItem(itemKey);
    const expected = EXPECTED[itemKey];
    const catalog = MODULE_CATALOG[itemKey];

    assert.equal(item.itemKey, itemKey);
    assert.equal(item.type, 'shelf');
    assert.equal(item.shelfCount, expected.shelfCount);
    assert.equal(item.composition?.mode, 'recipe');
    assert.equal(item.composition?.moduleType, 'shelf');
    assert.equal(item.composition?.nominalWidthCm, expected.widthCm);
    assert.equal(item.composition?.options?.shelfCount, expected.shelfCount);
    assert.equal(Object.hasOwn(item, 'unit'), false);
    assert.deepEqual(item.dimensions, { widthCm: expected.widthCm });

    assert.equal(catalog.itemKey, itemKey);
    assert.equal(catalog.label, item.name);
    assert.equal(catalog.type, 'shelf');
    assert.equal(catalog.widthCm, expected.widthCm);
    assert.equal(catalog.shelfCount, expected.shelfCount);

    const state = createModuleStateFromDescriptor(catalog);
    assert.equal(state.itemKey, itemKey);
    assert.equal(state.itemKey, itemKey);
    assert.equal(state.type, 'shelf');
    assert.equal(state.widthCm, expected.widthCm);
    assert.equal(state.shelfCount, expected.shelfCount);
    assert.equal(state.shelfLightingOn, false);
    assert.equal(state.strips.length, 7);

    const byWidth = createShelfModuleState(expected.widthCm, expected.shelfCount);
    assert.equal(byWidth.itemKey, itemKey);

    const behavior = getModuleBehavior(state);
    assert.equal(behavior.placement, 'wall');
    assert.equal(behavior.moveSnapCm, 50);
    assert.equal(behavior.rotationStepDeg, 90);

    const contract = resolveModuleContract(itemKey);
    assert.equal(contract.bom.mode, 'recipe');
    assert.equal(contract.profile, 'wall-editable');

    const recipe = getModuleRecipe('shelf', expected.widthCm, { shelfCount: expected.shelfCount });
    const quantities = Object.fromEntries(
      recipe.items.map((entry) => [entry.itemKey ?? entry.partId, entry.quantity]),
    );
    assert.deepEqual(quantities, expected.recipeQuantities);
    assert.equal(recipe.variants.innerCornerPanelItemKey, expected.corner);

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

test('wall_shelf composite, production shelf board Item ile karışmaz', () => {
  const board = getItem('shelf_100');
  const wall = getItem('wall_shelf_2_100');
  assert.equal(board.type, 'shelf');
  assert.equal(wall.type, 'shelf');
  assert.equal(board.composition, undefined);
  assert.equal(wall.composition.moduleType, 'shelf');
  assert.equal(createShelfModuleState({ itemKey: 'shelf_100' }), null);
});
