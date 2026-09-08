import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionItem } from '../src/productionParts.js';
import {
  getExpandedModuleRecipe,
  getModuleRecipe,
  getRecipeInnerCornerPanelKey,
  getRecipeItemKey,
} from '../src/moduleRecipes.js';

const CORNER_RECIPE_CASES = [
  ['wall', 200, {}, 7],
  ['shelf', 200, { shelfCount: 2 }, 7],
  ['shelf', 200, { shelfCount: 3 }, 7],
  ['base-wall', 200, {}, 7],
];

test('panel_corner_192 is a canonical single production Item', () => {
  const item = getProductionItem('panel_corner_192');

  assert.equal(item.itemKey, 'panel_corner_192');
  assert.equal(item.partId, undefined);
  assert.equal(item.name, 'İç Köşe Paneli 192 × 47 cm');
  assert.equal(item.type, 'panel');
  assert.equal(item.unit, 'adet');
  assert.deepEqual(item.dimensions, { widthCm: 192, heightCm: 47, thicknessCm: 0.8 });
  assert.equal(item.panelRole, 'inner-corner');
  assert.equal(item.nominalModuleWidthCm, 200);
});

test('panel_corner_192 uses canonical itemKey in exactly four verified 200 cm recipe variants', () => {
  let occurrences = 0;

  for (const [type, width, options] of CORNER_RECIPE_CASES) {
    const recipe = getModuleRecipe(type, width, options);
    assert.ok(recipe);
    assert.equal(recipe.variants.innerCornerPanelItemKey, 'panel_corner_192', recipe.recipeId);
    assert.equal(recipe.variants.innerCornerPanelPartId, undefined, recipe.recipeId);
    assert.equal(getRecipeInnerCornerPanelKey(recipe), 'panel_corner_192', recipe.recipeId);
    occurrences += 1;
  }

  assert.equal(occurrences, 4);
});

test('inner-corner BOM resolution replaces panel_197 1:1 and preserves all other recipe quantities', () => {
  for (const [type, width, options, expectedQuantity] of CORNER_RECIPE_CASES) {
    const source = getModuleRecipe(type, width, options);
    const normal = getExpandedModuleRecipe(type, width, options);
    const corner = getExpandedModuleRecipe(type, width, { ...options, panelVariant: 'inner-corner' });

    const sourceStraight = source.items.find((item) => getRecipeItemKey(item) === 'panel_197');
    const normalStraight = normal.items.find((item) => getRecipeItemKey(item) === 'panel_197');
    const cornerStraight = corner.items.find((item) => getRecipeItemKey(item) === 'panel_197');
    const cornerPanel = corner.items.find((item) => getRecipeItemKey(item) === 'panel_corner_192');

    assert.equal(sourceStraight.quantity, expectedQuantity, source.recipeId);
    assert.equal(normalStraight.quantity, expectedQuantity, source.recipeId);
    assert.equal(cornerStraight, undefined, source.recipeId);
    assert.ok(cornerPanel, source.recipeId);
    assert.equal(cornerPanel.quantity, expectedQuantity, source.recipeId);
    assert.equal(cornerPanel.part.itemKey, 'panel_corner_192', source.recipeId);
    assert.equal(cornerPanel.part.unit, 'adet', source.recipeId);

    const sourceNonPanel = source.items
      .filter((item) => getRecipeItemKey(item) !== 'panel_197')
      .map((item) => [getRecipeItemKey(item), item.quantity]);
    const cornerNonPanel = corner.items
      .filter((item) => getRecipeItemKey(item) !== 'panel_corner_192')
      .map((item) => [getRecipeItemKey(item), item.quantity]);
    assert.deepEqual(cornerNonPanel, sourceNonPanel, source.recipeId);
  }
});

test('legacy corner-panel metadata does not activate replacement before that Item migrates', () => {
  const source = getModuleRecipe('wall', 100);
  const expanded = getExpandedModuleRecipe('wall', 100, { panelVariant: 'inner-corner' });

  assert.equal(source.variants.innerCornerPanelItemKey, undefined);
  assert.equal(source.variants.innerCornerPanelPartId, 'panel_corner_92');
  assert.ok(expanded.items.some((item) => getRecipeItemKey(item) === 'panel_98'));
  assert.equal(expanded.items.some((item) => getRecipeItemKey(item) === 'panel_corner_92'), false);
});

test('neighboring corner panel Items remain legacy', () => {
  for (const itemKey of ['panel_corner_42_5', 'panel_corner_92', 'panel_corner_142_5']) {
    const item = getProductionItem(itemKey);
    assert.equal(item.itemKey, undefined, itemKey);
    assert.equal(item.partId, itemKey);
  }
});
