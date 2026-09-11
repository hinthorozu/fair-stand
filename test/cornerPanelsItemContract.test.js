import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionItem } from '../src/productionParts.js';
import {
  getExpandedModuleRecipe,
  getModuleRecipe,
  getRecipeInnerCornerPanelKey,
  getRecipeItemKey,
} from '../src/moduleRecipes.js';

const CORNER_PANEL_CASES = {
  panel_corner_42_5: {
    metadata: {
      name: 'İç Köşe Paneli 42,5 × 47 cm',
      dimensions: { widthCm: 42.5, heightCm: 47, thicknessCm: 0.8 },
      nominalModuleWidthCm: 50,
      straightPanelItemKey: 'panel_48_5',
    },
    recipes: [
      ['wall', 50, {}, 7],
    ],
  },
  panel_corner_92: {
    metadata: {
      name: 'İç Köşe Paneli 92 × 47 cm',
      dimensions: { widthCm: 92, heightCm: 47, thicknessCm: 0.8 },
      nominalModuleWidthCm: 100,
      straightPanelItemKey: 'panel_98',
    },
    recipes: [
      ['wall', 100, {}, 7],
      ['door', 100, {}, 3],
      ['shelf', 100, { shelfCount: 2 }, 7],
      ['shelf', 100, { shelfCount: 3 }, 7],
      ['showcase-2', 100, {}, 5],
      ['showcase-3', 100, {}, 4],
      ['base-wall', 100, {}, 7],
    ],
  },
  panel_corner_142_5: {
    metadata: {
      name: 'İç Köşe Paneli 142,5 × 47 cm',
      dimensions: { widthCm: 142.5, heightCm: 47, thicknessCm: 0.8 },
      nominalModuleWidthCm: 150,
      straightPanelItemKey: 'panel_147_5',
    },
    recipes: [
      ['wall', 150, {}, 7],
      ['shelf', 150, { shelfCount: 2 }, 7],
      ['shelf', 150, { shelfCount: 3 }, 7],
      ['base-wall', 150, {}, 7],
    ],
  },
};

test('remaining inner-corner panels are canonical single production Items with metadata parity', () => {
  for (const [itemKey, { metadata }] of Object.entries(CORNER_PANEL_CASES)) {
    const item = getProductionItem(itemKey);
    assert.equal(item.itemKey, itemKey);
    assert.equal(item.partId, undefined, itemKey);
    assert.equal(item.name, metadata.name);
    assert.equal(item.type, 'panel');
    assert.equal(item.unit, 'adet');
    assert.deepEqual(item.dimensions, metadata.dimensions);
    assert.equal(item.panelRole, 'inner-corner');
    assert.equal(item.nominalModuleWidthCm, metadata.nominalModuleWidthCm);
  }
});

test('remaining inner-corner panels use canonical itemKey in exactly twelve active recipe variants', () => {
  let totalOccurrences = 0;

  for (const [itemKey, { recipes }] of Object.entries(CORNER_PANEL_CASES)) {
    let occurrences = 0;
    for (const [type, width, options] of recipes) {
      const recipe = getModuleRecipe(type, width, options);
      assert.ok(recipe);
      assert.equal(recipe.variants.innerCornerPanelItemKey, itemKey, recipe.recipeId);
      assert.equal(recipe.variants.innerCornerPanelPartId, undefined, recipe.recipeId);
      assert.equal(getRecipeInnerCornerPanelKey(recipe), itemKey, recipe.recipeId);
      occurrences += 1;
    }
    assert.equal(occurrences, recipes.length, itemKey);
    totalOccurrences += occurrences;
  }

  assert.equal(totalOccurrences, 12);
});

test('inner-corner BOM resolution replaces each matching straight panel 1:1 and applies declared recipe item replacements', () => {
  for (const [itemKey, { metadata, recipes }] of Object.entries(CORNER_PANEL_CASES)) {
    for (const [type, width, options, expectedQuantity] of recipes) {
      const source = getModuleRecipe(type, width, options);
      const normal = getExpandedModuleRecipe(type, width, options);
      const corner = getExpandedModuleRecipe(type, width, { ...options, panelVariant: 'inner-corner' });

      const sourceStraight = source.items.find((item) => getRecipeItemKey(item) === metadata.straightPanelItemKey);
      const normalStraight = normal.items.find((item) => getRecipeItemKey(item) === metadata.straightPanelItemKey);
      const cornerStraight = corner.items.find((item) => getRecipeItemKey(item) === metadata.straightPanelItemKey);
      const cornerPanel = corner.items.find((item) => getRecipeItemKey(item) === itemKey);

      assert.ok(sourceStraight, source.recipeId);
      assert.equal(sourceStraight.quantity, expectedQuantity, source.recipeId);
      assert.equal(normalStraight.quantity, expectedQuantity, source.recipeId);
      assert.equal(cornerStraight, undefined, source.recipeId);
      assert.ok(cornerPanel, source.recipeId);
      assert.equal(cornerPanel.quantity, expectedQuantity, source.recipeId);
      assert.equal(cornerPanel.part.itemKey, itemKey, source.recipeId);
      assert.equal(cornerPanel.part.partId, undefined, source.recipeId);
      assert.equal(cornerPanel.part.unit, 'adet', source.recipeId);

      const sourceNonPanel = source.items
        .filter((item) => getRecipeItemKey(item) !== metadata.straightPanelItemKey)
        .map((item) => [getRecipeItemKey(item), item.quantity]);
      const declaredReplacements = new Map(
        (source.variants?.innerCornerItemReplacements ?? []).map((replacement) => [replacement.itemKey, replacement.items]),
      );
      const expectedCornerNonPanel = sourceNonPanel.flatMap(([sourceItemKey, quantity]) => {
        const replacementItems = declaredReplacements.get(sourceItemKey);
        if (!replacementItems) return [[sourceItemKey, quantity]];
        return replacementItems.map((replacementItem) => [
          getRecipeItemKey(replacementItem),
          replacementItem.quantity,
        ]);
      });
      const cornerNonPanel = corner.items
        .filter((item) => getRecipeItemKey(item) !== itemKey)
        .map((item) => [getRecipeItemKey(item), item.quantity]);
      assert.deepEqual(cornerNonPanel, expectedCornerNonPanel, source.recipeId);
    }
  }
});

test('canonical corner-panel cutover does not create duplicate straight-plus-corner panel quantities', () => {
  for (const [itemKey, { metadata, recipes }] of Object.entries(CORNER_PANEL_CASES)) {
    for (const [type, width, options, expectedQuantity] of recipes) {
      const corner = getExpandedModuleRecipe(type, width, { ...options, panelVariant: 'inner-corner' });
      const quantities = Object.fromEntries(corner.items.map((item) => [getRecipeItemKey(item), item.quantity]));
      assert.equal(quantities[metadata.straightPanelItemKey], undefined, `${type}:${width}:${itemKey}`);
      assert.equal(quantities[itemKey], expectedQuantity, `${type}:${width}:${itemKey}`);
    }
  }
});
