import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionItem } from '../src/productionParts.js';
import { getExpandedModuleRecipe, getModuleRecipe, getRecipeItemKey, getStraightWallRecipe } from '../src/moduleRecipes.js';

const RECIPE_CASES = [
  ['wall', 200, {}, 7],
  ['shelf', 200, { shelfCount: 2 }, 7],
  ['shelf', 200, { shelfCount: 3 }, 7],
  ['counter', 200, { shape: 'L' }, 4],
  ['counter', 200, {}, 2],
  ['base-wall', 200, {}, 7],
  ['base', 200, {}, 2],
];

test('panel_197 is a canonical single production Item', () => {
  const item = getProductionItem('panel_197');

  assert.equal(item.itemKey, 'panel_197');
  assert.equal(item.partId, undefined);
  assert.equal(item.name, 'Panel 197 × 47 cm');
  assert.equal(item.type, 'panel');
  assert.equal(item.unit, 'adet');
  assert.deepEqual(item.dimensions, { widthCm: 197, heightCm: 47, thicknessCm: 0.8 });
  assert.equal(item.panelRole, 'straight');
  assert.equal(item.nominalModuleWidthCm, 200);
});

test('panel_197 uses canonical itemKey in exactly seven verified parent recipes with quantity parity', () => {
  let occurrences = 0;

  for (const [type, width, options, quantity] of RECIPE_CASES) {
    const recipe = getModuleRecipe(type, width, options);
    assert.ok(recipe);
    const matches = recipe.items.filter((item) => getRecipeItemKey(item) === 'panel_197');
    assert.equal(matches.length, 1, recipe.recipeId);
    assert.deepEqual(matches[0], { itemKey: 'panel_197', quantity });
    occurrences += matches.length;
  }

  assert.equal(occurrences, 7);
});

test('expanded recipe resolves panel_197 metadata through canonical itemKey', () => {
  const expanded = getExpandedModuleRecipe('counter', 200);
  const panel = expanded.items.find((item) => item.itemKey === 'panel_197');

  assert.ok(panel);
  assert.equal(panel.part.itemKey, 'panel_197');
  assert.equal(panel.part.partId, undefined);
  assert.equal(panel.part.unit, 'adet');
  assert.deepEqual(panel.part.dimensions, { widthCm: 197, heightCm: 47, thicknessCm: 0.8 });
});

test('panel_197 migration does not migrate neighboring straight or still-legacy corner panel Items', () => {
  for (const itemKey of ['panel_48_5', 'panel_98', 'panel_147_5', 'panel_corner_42_5', 'panel_corner_92', 'panel_corner_142_5']) {
    const item = getProductionItem(itemKey);
    assert.equal(item.itemKey, undefined, itemKey);
    assert.equal(item.partId, itemKey);
  }

  assert.equal(getStraightWallRecipe(200).variants.innerCornerPanelItemKey, 'panel_corner_192');
  assert.equal(getStraightWallRecipe(200).variants.innerCornerPanelPartId, undefined);
});
