import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionItem } from '../src/productionParts.js';
import {
  getExpandedModuleRecipe,
  getModuleRecipe,
  getRecipeItemKey,
} from '../src/moduleRecipes.js';

const BASE_TOP_CASES = {
  base_top_107_50: {
    name: 'Baza Üstü 107 × 50 cm',
    dimensions: { widthCm: 107, depthCm: 50, thicknessCm: 1.8 },
    nominalModuleWidthCm: 100,
  },
  base_top_157_50: {
    name: 'Baza Üstü 157 × 50 cm',
    dimensions: { widthCm: 157, depthCm: 50, thicknessCm: 1.8 },
    nominalModuleWidthCm: 150,
  },
  base_top_206_50: {
    name: 'Baza Üstü 206 × 50 cm',
    dimensions: { widthCm: 206, depthCm: 50, thicknessCm: 1.8 },
    nominalModuleWidthCm: 200,
  },
};

test('base tops are canonical single Items with complete intrinsic defaults', () => {
  for (const [itemKey, expected] of Object.entries(BASE_TOP_CASES)) {
    const item = getProductionItem(itemKey);
    assert.ok(item, itemKey);
    assert.equal(item.itemKey, itemKey);
    assert.equal(item.partId, undefined, itemKey);
    assert.equal(item.name, expected.name);
    assert.equal(item.type, 'base-top');
    assert.equal(item.unit, 'adet');
    assert.deepEqual(item.dimensions, expected.dimensions);
    assert.equal(item.material, 'sunta', itemKey);
    assert.equal(item.defaultColor, 0xffffff, itemKey);
    assert.equal(item.nominalModuleWidthCm, expected.nominalModuleWidthCm);
  }
});

test('base tops use canonical itemKey in exactly six active parent recipe rows with ×1 parity', () => {
  let occurrences = 0;

  for (const [itemKey, expected] of Object.entries(BASE_TOP_CASES)) {
    for (const moduleType of ['base', 'base-wall']) {
      const recipe = getModuleRecipe(moduleType, expected.nominalModuleWidthCm);
      assert.ok(recipe, `${moduleType}:${expected.nominalModuleWidthCm}`);
      const matches = recipe.items.filter((item) => getRecipeItemKey(item) === itemKey);
      assert.equal(matches.length, 1, recipe.recipeId);
      assert.deepEqual(matches[0], { itemKey, quantity: 1 }, recipe.recipeId);
      assert.equal(matches[0].partId, undefined, recipe.recipeId);
      occurrences += 1;
    }
  }

  assert.equal(occurrences, 6);
});

test('expanded base/base-wall recipes resolve canonical base-top metadata and intrinsic defaults', () => {
  for (const [itemKey, expected] of Object.entries(BASE_TOP_CASES)) {
    for (const moduleType of ['base', 'base-wall']) {
      const expanded = getExpandedModuleRecipe(moduleType, expected.nominalModuleWidthCm);
      const top = expanded.items.find((item) => getRecipeItemKey(item) === itemKey);
      assert.ok(top, `${moduleType}:${expected.nominalModuleWidthCm}:${itemKey}`);
      assert.equal(top.quantity, 1, expanded.recipeId);
      assert.equal(top.part.itemKey, itemKey, expanded.recipeId);
      assert.equal(top.part.partId, undefined, expanded.recipeId);
      assert.equal(top.part.type, 'base-top', expanded.recipeId);
      assert.equal(top.part.unit, 'adet', expanded.recipeId);
      assert.deepEqual(top.part.dimensions, expected.dimensions, expanded.recipeId);
      assert.equal(top.part.material, 'sunta', expanded.recipeId);
      assert.equal(top.part.defaultColor, 0xffffff, expanded.recipeId);
    }
  }
});
