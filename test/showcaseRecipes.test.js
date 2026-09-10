import test from 'node:test';
import assert from 'node:assert/strict';

import { getItem } from '../src/items.js';
import { getProductionItem } from '../src/productionParts.js';
import { getExpandedModuleRecipe, getModuleRecipe } from '../src/moduleRecipes.js';

test('fake aggregate showcase production parts are removed', () => {
  assert.equal(getProductionItem('showcase_2_100'), null);
  assert.equal(getProductionItem('showcase_3_100'), null);
  assert.equal(getItem('wall_showcase_100_2').itemKey, 'wall_showcase_100_2');
  assert.equal(getItem('wall_showcase_100_3').itemKey, 'wall_showcase_100_3');
});

test('2-eye wall showcase BASE recipe matches verified production data', () => {
  const recipe = getModuleRecipe('showcase-2', 100);
  assert.deepEqual(recipe.items, [
    { itemKey: 'profile_91', quantity: 4 },
    { itemKey: 'upright_346_5', quantity: 2 },
    { itemKey: 'panel_98', quantity: 5 },
    { itemKey: 'connector_start', quantity: 4 },
    { itemKey: 'connector_single', quantity: 9 },
    { itemKey: 'showcase_side_94_6_30', quantity: 2 },
    { itemKey: 'showcase_horizontal_87_4_30', quantity: 2 },
    { itemKey: 'glass_shelf', quantity: 1 },
  ]);
  assert.equal(recipe.variants, undefined);
});

test('3-eye wall showcase BASE recipe matches verified production data', () => {
  const recipe = getModuleRecipe('showcase-3', 100);
  assert.deepEqual(recipe.items, [
    { itemKey: 'profile_91', quantity: 4 },
    { itemKey: 'upright_346_5', quantity: 2 },
    { itemKey: 'panel_98', quantity: 4 },
    { itemKey: 'connector_start', quantity: 4 },
    { itemKey: 'connector_single', quantity: 7 },
    { itemKey: 'showcase_side_143_5_30', quantity: 2 },
    { itemKey: 'showcase_horizontal_87_4_30', quantity: 2 },
    { itemKey: 'glass_shelf', quantity: 2 },
  ]);
  assert.equal(recipe.variants, undefined);
});

test('expanded showcase recipes resolve only real physical child Items', () => {
  for (const [type, expectedSide, glassQuantity] of [
    ['showcase-2', 'showcase_side_94_6_30', 1],
    ['showcase-3', 'showcase_side_143_5_30', 2],
  ]) {
    const expanded = getExpandedModuleRecipe(type, 100);
    const keys = new Set(expanded.items.map((entry) => entry.itemKey));
    assert.ok(keys.has(expectedSide));
    assert.ok(keys.has('showcase_horizontal_87_4_30'));
    assert.ok(keys.has('glass_shelf'));
    assert.equal(expanded.items.find((entry) => entry.itemKey === 'glass_shelf').quantity, glassQuantity);
    assert.equal(keys.has('showcase_2_100'), false);
    assert.equal(keys.has('showcase_3_100'), false);
  }
});
