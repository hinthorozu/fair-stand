import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionItem } from '../src/productionParts.js';
import { getExpandedModuleRecipe, getModuleRecipe, getRecipeItemKey } from '../src/moduleRecipes.js';

const CASES = [
  {
    itemKey: 'upright_99',
    name: 'Dikme 99 cm',
    dimensions: { lengthCm: 99, thicknessCm: 8 },
    recipes: [
      ['counter', 100, {}, 4],
      ['counter', 150, {}, 4],
      ['counter', 200, {}, 4],
      ['counter', 100, { shape: 'L' }, 5],
      ['counter', 150, { shape: 'L' }, 5],
      ['counter', 200, { shape: 'L' }, 5],
    ],
  },
  {
    itemKey: 'upright_49_5',
    name: 'Dikme 49,5 cm',
    dimensions: { lengthCm: 49.5, thicknessCm: 8 },
    recipes: [
      ['base-wall', 100, {}, 2],
      ['base-wall', 150, {}, 2],
      ['base-wall', 200, {}, 2],
      ['base', 100, {}, 4],
      ['base', 150, {}, 4],
      ['base', 200, {}, 4],
    ],
  },
];

for (const { itemKey, name, dimensions, recipes } of CASES) {
  test(`${itemKey} is a canonical single production Item`, () => {
    const item = getProductionItem(itemKey);
    assert.equal(item.itemKey, itemKey);
    assert.equal(item.partId, undefined);
    assert.equal(item.name, name);
    assert.equal(item.type, 'upright');
    assert.equal(item.unit, 'adet');
    assert.deepEqual(item.dimensions, dimensions);
  });

  test(`${itemKey} uses canonical itemKey and preserves all verified quantities`, () => {
    let occurrences = 0;
    for (const [type, width, options, quantity] of recipes) {
      const recipe = getModuleRecipe(type, width, options);
      assert.ok(recipe);
      const match = recipe.items.find((item) => getRecipeItemKey(item) === itemKey);
      assert.deepEqual(match, { itemKey, quantity });
      occurrences += 1;
    }
    assert.equal(occurrences, 6);
  });

  test(`${itemKey} expanded recipe resolves metadata through canonical itemKey`, () => {
    const [type, width, options] = recipes[0];
    const expanded = getExpandedModuleRecipe(type, width, options);
    const item = expanded.items.find((entry) => entry.itemKey === itemKey);
    assert.ok(item);
    assert.equal(item.part.itemKey, itemKey);
    assert.equal(item.part.name, name);
    assert.equal(item.part.unit, 'adet');
    assert.deepEqual(item.part.dimensions, dimensions);
  });
}
