import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionItem } from '../src/productionParts.js';
import { getExpandedModuleRecipe, getModuleRecipe, getRecipeItemKey } from '../src/moduleRecipes.js';

const expected = Object.freeze({
  counter_top_110_60: { widthCm: 110, depthCm: 60, thicknessCm: 1.8, nominalModuleWidthCm: 100, occurrences: 2 },
  counter_top_52_60: { widthCm: 52, depthCm: 60, thicknessCm: 1.8, nominalModuleWidthCm: 100, occurrences: 1 },
  counter_top_160_60: { widthCm: 160, depthCm: 60, thicknessCm: 1.8, nominalModuleWidthCm: 150, occurrences: 2 },
  counter_top_102_60: { widthCm: 102, depthCm: 60, thicknessCm: 1.8, nominalModuleWidthCm: 150, occurrences: 1 },
  counter_top_210_60: { widthCm: 210, depthCm: 60, thicknessCm: 1.8, nominalModuleWidthCm: 200, occurrences: 2 },
  counter_top_150_60: { widthCm: 150, depthCm: 60, thicknessCm: 1.8, nominalModuleWidthCm: 200, occurrences: 1 },
});

const recipes = [
  getModuleRecipe('counter', 100, { shape: 'L' }),
  getModuleRecipe('counter', 150, { shape: 'L' }),
  getModuleRecipe('counter', 200, { shape: 'L' }),
  getModuleRecipe('counter', 100),
  getModuleRecipe('counter', 150),
  getModuleRecipe('counter', 200),
];

test('all six counter tops are canonical 1.8 cm production Items', () => {
  for (const [itemKey, meta] of Object.entries(expected)) {
    const item = getProductionItem(itemKey);
    assert.equal(item.itemKey, itemKey);
    assert.equal(item.partId, undefined);
    assert.equal(item.type, 'counter-top');
    assert.equal(item.unit, 'adet');
    assert.deepEqual(item.dimensions, { widthCm: meta.widthCm, depthCm: meta.depthCm, thicknessCm: 1.8 });
    assert.equal(item.nominalModuleWidthCm, meta.nominalModuleWidthCm);
  }
});

test('counter top migration preserves exactly nine canonical recipe rows at quantity one', () => {
  const seen = Object.fromEntries(Object.keys(expected).map((key) => [key, 0]));
  let total = 0;
  for (const recipe of recipes) {
    for (const item of recipe.items) {
      const key = getRecipeItemKey(item);
      if (!(key in seen)) continue;
      assert.equal(item.itemKey, key, `${recipe.recipeId}: ${key} must use canonical itemKey`);
      assert.equal(item.partId, undefined, `${recipe.recipeId}: ${key} must not keep legacy partId`);
      assert.equal(item.quantity, 1, `${recipe.recipeId}: ${key} quantity parity`);
      seen[key] += 1;
      total += 1;
    }
  }
  assert.equal(total, 9);
  assert.deepEqual(seen, Object.fromEntries(Object.entries(expected).map(([key, meta]) => [key, meta.occurrences])));
});

test('expanded straight and L counter recipes resolve canonical counter-top metadata', () => {
  for (const [width, options] of [[100, {}], [150, {}], [200, {}], [100, { shape: 'L' }], [150, { shape: 'L' }], [200, { shape: 'L' }]]) {
    const expanded = getExpandedModuleRecipe('counter', width, options);
    const tops = expanded.items.filter((item) => item.part?.type === 'counter-top');
    assert.ok(tops.length >= 1);
    for (const top of tops) {
      assert.equal(top.itemKey, top.part.itemKey);
      assert.equal(top.part.dimensions.thicknessCm, 1.8);
      assert.equal(top.quantity, 1);
    }
  }
});
