import test from 'node:test';
import assert from 'node:assert/strict';

import { getItem } from '../src/items.js';
import {
  getRecipeItemKey,
} from '../src/moduleRecipes.js';
import {
  getExpandedModuleRecipe,
  getModuleRecipe,
} from './recipeParentItemKey.js';

const CORNER_PANEL_CASES = {
  panel_corner_42_5: {
    metadata: {
      name: 'İç Köşe Paneli 42,5 × 47 cm',
      dimensions: { widthCm: 42.5, heightCm: 47, thicknessCm: 0.8 },
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
      straightPanelItemKey: 'panel_98',
    },
    recipes: [
      ['wall', 100, {}, 7],
      ['door', 100, {}, 3],
      ['showcase-2', 100, {}, 5],
      ['showcase-3', 100, {}, 4],
    ],
  },
  panel_corner_142_5: {
    metadata: {
      name: 'İç Köşe Paneli 142,5 × 47 cm',
      dimensions: { widthCm: 142.5, heightCm: 47, thicknessCm: 0.8 },
      straightPanelItemKey: 'panel_147_5',
    },
    recipes: [
      ['wall', 150, {}, 7],
    ],
  },
};

test('remaining inner-corner panels are canonical single production Items with metadata parity', () => {
  for (const [itemKey, { metadata }] of Object.entries(CORNER_PANEL_CASES)) {
    const item = getItem(itemKey);
    assert.equal(item.itemKey, itemKey);
    assert.equal(item.partId, undefined, itemKey);
    assert.equal(item.name, metadata.name);
    assert.equal(item.type, 'panel');
    assert.equal(item.unit, 'adet');
    assert.deepEqual(item.dimensions, metadata.dimensions);
    assert.equal(item.panelRole, 'inner-corner');
    assert.equal(item.nominalModuleWidthCm, undefined);
  }
});

test('legacy inner-corner recipe expansion no longer replaces straight panels', () => {
  for (const [itemKey, { metadata, recipes }] of Object.entries(CORNER_PANEL_CASES)) {
    for (const [type, width, options, expectedQuantity] of recipes) {
      const source = getModuleRecipe(type, width, options);
      const corner = getExpandedModuleRecipe(type, width, { ...options, panelVariant: 'inner-corner' });
      const sourceStraight = source.items.find((item) => getRecipeItemKey(item) === metadata.straightPanelItemKey);
      assert.equal(sourceStraight.quantity, expectedQuantity, source.recipeId);
      assert.equal(corner.items.find((item) => item.itemKey === metadata.straightPanelItemKey).quantity, expectedQuantity);
      assert.equal(corner.items.find((item) => item.itemKey === itemKey), undefined, source.recipeId);
    }
  }
});
