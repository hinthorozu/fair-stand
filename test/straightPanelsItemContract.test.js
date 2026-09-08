import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionItem } from '../src/productionParts.js';
import { getExpandedModuleRecipe, getModuleRecipe, getRecipeItemKey, getStraightWallRecipe } from '../src/moduleRecipes.js';

const PANEL_CASES = {
  panel_48_5: {
    metadata: { name: 'Panel 48,5 × 47 cm', dimensions: { widthCm: 48.5, heightCm: 47, thicknessCm: 0.8 }, nominalModuleWidthCm: 50 },
    recipes: [
      ['wall', 50, {}, 7],
      ['counter', 100, { shape: 'L' }, 4],
      ['counter', 150, { shape: 'L' }, 4],
      ['counter', 200, { shape: 'L' }, 4],
      ['counter', 100, {}, 4],
      ['counter', 150, {}, 4],
      ['counter', 200, {}, 4],
      ['base-wall', 100, {}, 2],
      ['base-wall', 150, {}, 2],
      ['base-wall', 200, {}, 2],
      ['base', 100, {}, 2],
      ['base', 150, {}, 2],
      ['base', 200, {}, 2],
    ],
  },
  panel_98: {
    metadata: { name: 'Panel 98 × 47 cm', dimensions: { widthCm: 98, heightCm: 47, thicknessCm: 0.8 }, nominalModuleWidthCm: 100 },
    recipes: [
      ['wall', 100, {}, 7],
      ['door', 100, {}, 3],
      ['shelf', 100, { shelfCount: 2 }, 7],
      ['shelf', 100, { shelfCount: 3 }, 7],
      ['showcase-2', 100, {}, 5],
      ['showcase-3', 100, {}, 4],
      ['counter', 100, { shape: 'L' }, 4],
      ['counter', 100, {}, 2],
      ['base-wall', 100, {}, 7],
      ['base', 100, {}, 2],
    ],
  },
  panel_147_5: {
    metadata: { name: 'Panel 147,5 × 47 cm', dimensions: { widthCm: 147.5, heightCm: 47, thicknessCm: 0.8 }, nominalModuleWidthCm: 150 },
    recipes: [
      ['wall', 150, {}, 7],
      ['shelf', 150, { shelfCount: 2 }, 7],
      ['shelf', 150, { shelfCount: 3 }, 7],
      ['counter', 150, { shape: 'L' }, 4],
      ['counter', 150, {}, 2],
      ['base-wall', 150, {}, 7],
      ['base', 150, {}, 2],
    ],
  },
};

test('straight panel production Items use canonical itemKey with verified metadata', () => {
  for (const [itemKey, { metadata }] of Object.entries(PANEL_CASES)) {
    const item = getProductionItem(itemKey);
    assert.equal(item.itemKey, itemKey);
    assert.equal(item.partId, undefined);
    assert.equal(item.name, metadata.name);
    assert.equal(item.type, 'panel');
    assert.equal(item.unit, 'adet');
    assert.deepEqual(item.dimensions, metadata.dimensions);
    assert.equal(item.panelRole, 'straight');
    assert.equal(item.nominalModuleWidthCm, metadata.nominalModuleWidthCm);
  }
});

test('straight panels use canonical itemKey in exactly 30 verified recipe occurrences with quantity parity', () => {
  let total = 0;
  for (const [itemKey, { recipes }] of Object.entries(PANEL_CASES)) {
    let occurrences = 0;
    for (const [type, width, options, quantity] of recipes) {
      const recipe = getModuleRecipe(type, width, options);
      assert.ok(recipe);
      const matches = recipe.items.filter((item) => getRecipeItemKey(item) === itemKey);
      assert.equal(matches.length, 1, `${recipe.recipeId}:${itemKey}`);
      assert.deepEqual(matches[0], { itemKey, quantity });
      occurrences += matches.length;
    }
    assert.equal(occurrences, recipes.length, itemKey);
    total += occurrences;
  }
  assert.equal(total, 30);
});

test('expanded recipes resolve straight panel metadata through canonical itemKey', () => {
  const examples = [
    ['panel_48_5', 'counter', 200, {}],
    ['panel_98', 'door', 100, {}],
    ['panel_147_5', 'shelf', 150, { shelfCount: 2 }],
  ];

  for (const [itemKey, type, width, options] of examples) {
    const expanded = getExpandedModuleRecipe(type, width, options);
    const panel = expanded.items.find((item) => item.itemKey === itemKey);
    assert.ok(panel, itemKey);
    assert.equal(panel.part.itemKey, itemKey);
    assert.equal(panel.part.partId, undefined);
    assert.equal(panel.part.type, 'panel');
    assert.equal(panel.part.panelRole, 'straight');
  }
});

test('straight panel migration remains isolated from separator Items while corner variants use canonical Item identity', () => {
  for (const itemKey of ['separator_panel_48_5', 'separator_panel_98']) {
    const item = getProductionItem(itemKey);
    assert.equal(item.itemKey, undefined, itemKey);
    assert.equal(item.partId, itemKey);
  }

  for (const width of [50, 100, 150, 200]) {
    const recipe = getStraightWallRecipe(width);
    assert.ok(recipe.variants.innerCornerPanelItemKey);
    assert.equal(recipe.variants.innerCornerPanelPartId, undefined);
  }
});
