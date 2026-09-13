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
import { getModuleBehavior, getModuleCollisionHeightRangeCm } from '../src/moduleBehavior.js';
import { placementsOverlap } from '../src/modulePlacement.js';
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

const SHORT_UP_2 = {
  wall_50_short_up_2: {
    widthCm: 50,
    parentKey: 'wall_50',
    recipeQuantities: {
      profile_41_5: 2, upright_99: 2, panel_48_5: 2, connector_start: 2, connector_single: 3,
    },
  },
  wall_100_short_up_2: {
    widthCm: 100,
    parentKey: 'wall_100',
    recipeQuantities: {
      profile_91: 2, upright_99: 2, panel_98: 2, connector_start: 2, connector_single: 3,
    },
  },
  wall_150_short_up_2: {
    widthCm: 150,
    parentKey: 'wall_150',
    recipeQuantities: {
      profile_140_5: 2, upright_99: 2, panel_147_5: 2, connector_start: 2, connector_single: 3,
    },
  },
  wall_200_short_up_2: {
    widthCm: 200,
    parentKey: 'wall_200',
    recipeQuantities: {
      profile_190: 2, upright_99: 2, panel_197: 2, connector_start: 2, connector_single: 3,
    },
  },
};

for (const [itemKey, expected] of Object.entries(SHORT_UP_2)) {
  test(`${itemKey} is a hanging two-panel Item that does not replace ${expected.parentKey}`, () => {
    const item = getItem(itemKey);
    const parent = getItem(expected.parentKey);
    const catalog = MODULE_CATALOG[itemKey];

    assert.equal(item.itemKey, itemKey);
    assert.equal(item.type, 'flat-panel');
    assert.equal(item.variant, 'short-up-2');
    assert.deepEqual(item.stripOccupancy, { align: 'top', stripCount: 2 });
    assert.equal(item.composition.moduleType, 'wall-short-up-2');
    assert.deepEqual(item.dimensions, { widthCm: expected.widthCm });
    assert.equal(parent.composition.moduleType, 'wall');
    assert.equal(parent.stripOccupancy, undefined);
    assert.equal(catalog.variant, 'short-up-2');
    assert.deepEqual(catalog.stripOccupancy, { align: 'top', stripCount: 2 });
    assert.equal(resolveItemKey({ type: 'flat-panel', widthCm: expected.widthCm }), expected.parentKey);
    assert.equal(resolveItemKey(catalog), itemKey);

    const state = createModuleStateFromDescriptor(catalog);
    assert.equal(state.itemKey, itemKey);
    assert.equal(state.strips.length, 2);

    const recipe = getModuleRecipe('wall-short-up-2', expected.widthCm);
    const quantities = Object.fromEntries(
      recipe.items.map((entry) => [entry.itemKey ?? entry.partId, entry.quantity]),
    );
    assert.deepEqual(quantities, expected.recipeQuantities);
  });
}

const SHORT_UP_1 = {
  wall_50_short_up_1: {
    widthCm: 50,
    parentKey: 'wall_50',
    recipeQuantities: {
      profile_41_5: 2, upright_49_5: 2, panel_48_5: 1, connector_start: 2, connector_single: 3,
    },
  },
  wall_100_short_up_1: {
    widthCm: 100,
    parentKey: 'wall_100',
    recipeQuantities: {
      profile_91: 2, upright_49_5: 2, panel_98: 1, connector_start: 2, connector_single: 3,
    },
  },
  wall_150_short_up_1: {
    widthCm: 150,
    parentKey: 'wall_150',
    recipeQuantities: {
      profile_140_5: 2, upright_49_5: 2, panel_147_5: 1, connector_start: 2, connector_single: 3,
    },
  },
  wall_200_short_up_1: {
    widthCm: 200,
    parentKey: 'wall_200',
    recipeQuantities: {
      profile_190: 2, upright_49_5: 2, panel_197: 1, connector_start: 2, connector_single: 3,
    },
  },
};

for (const [itemKey, expected] of Object.entries(SHORT_UP_1)) {
  test(`${itemKey} is a hanging one-panel Item that does not replace ${expected.parentKey}`, () => {
    const item = getItem(itemKey);
    const parent = getItem(expected.parentKey);
    const catalog = MODULE_CATALOG[itemKey];

    assert.equal(item.itemKey, itemKey);
    assert.equal(item.type, 'flat-panel');
    assert.equal(item.variant, 'short-up-1');
    assert.deepEqual(item.stripOccupancy, { align: 'top', stripCount: 1 });
    assert.equal(item.composition.moduleType, 'wall-short-up-1');
    assert.deepEqual(item.dimensions, { widthCm: expected.widthCm });
    assert.equal(parent.composition.moduleType, 'wall');
    assert.equal(parent.stripOccupancy, undefined);
    assert.equal(catalog.variant, 'short-up-1');
    assert.deepEqual(catalog.stripOccupancy, { align: 'top', stripCount: 1 });
    assert.equal(resolveItemKey({ type: 'flat-panel', widthCm: expected.widthCm }), expected.parentKey);
    assert.equal(resolveItemKey(catalog), itemKey);

    const state = createModuleStateFromDescriptor(catalog);
    assert.equal(state.itemKey, itemKey);
    assert.equal(state.strips.length, 1);

    const recipe = getModuleRecipe('wall-short-up-1', expected.widthCm);
    const quantities = Object.fromEntries(
      recipe.items.map((entry) => [entry.itemKey ?? entry.partId, entry.quantity]),
    );
    assert.deepEqual(quantities, expected.recipeQuantities);
  });
}

test('wall_200_short_up_2 skips floor collisions but keeps wall snap policy', () => {
  const hanging = {
    id: 'shot',
    itemKey: 'wall_200_short_up_2',
    type: 'flat-panel',
    widthCm: 200,
    placement: { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' },
  };
  const counter = {
    id: 'counter',
    itemKey: 'desk_banko_200',
    type: 'counter',
    widthCm: 200,
    depthCm: 50,
    heightCm: 100,
    placement: { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'free' },
  };
  const wall = {
    id: 'wall',
    itemKey: 'wall_200',
    type: 'flat-panel',
    widthCm: 200,
    placement: { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' },
  };
  const neighbor = {
    ...hanging,
    id: 'shot-neighbor',
    placement: { xCm: 200, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' },
  };

  const behavior = getModuleBehavior(hanging);
  assert.equal(behavior.magneticSnap, 'standard');
  assert.equal(behavior.moveSnapCm, 50);
  assert.equal(behavior.collision, 'segment');
  assert.equal(behavior.collisionHeight, 'full');
  assert.deepEqual(getModuleCollisionHeightRangeCm(hanging), { minCm: 250, maxCm: 350 });

  assert.equal(placementsOverlap(hanging, counter), false);
  assert.equal(placementsOverlap(hanging, wall), true);
  assert.equal(placementsOverlap(wall, neighbor), false);
});

