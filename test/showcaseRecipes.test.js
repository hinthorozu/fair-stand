import test from 'node:test';
import assert from 'node:assert/strict';

import { getItem } from '../src/items.js';
import { getProductionItem } from '../src/productionParts.js';
import { getExpandedModuleRecipe, getModuleRecipe, getRecipeItemKey } from '../src/moduleRecipes.js';

const BASE_SHOWCASE_2 = [
  { itemKey: 'profile_91', quantity: 4 },
  { itemKey: 'upright_346_5', quantity: 2 },
  { itemKey: 'panel_98', quantity: 5 },
  { itemKey: 'connector_start', quantity: 4 },
  { itemKey: 'connector_single', quantity: 9 },
  { itemKey: 'showcase_side_94_6_30', quantity: 2 },
  { itemKey: 'showcase_horizontal_87_4_30', quantity: 2 },
  { itemKey: 'glass_shelf', quantity: 1 },
];

const BASE_SHOWCASE_3 = [
  { itemKey: 'profile_91', quantity: 4 },
  { itemKey: 'upright_346_5', quantity: 2 },
  { itemKey: 'panel_98', quantity: 4 },
  { itemKey: 'connector_start', quantity: 4 },
  { itemKey: 'connector_single', quantity: 7 },
  { itemKey: 'showcase_side_143_5_30', quantity: 2 },
  { itemKey: 'showcase_horizontal_87_4_30', quantity: 2 },
  { itemKey: 'glass_shelf', quantity: 2 },
];

function compact(items) {
  return items.map((entry) => ({ itemKey: getRecipeItemKey(entry), quantity: entry.quantity }));
}

test('showcase parents are canonical composite Items, not legacy production leaf records', () => {
  assert.equal(getItem('showcase_2_100').itemKey, 'showcase_2_100');
  assert.equal(getItem('showcase_3_100').itemKey, 'showcase_3_100');
  assert.equal(getProductionItem('showcase_2_100'), null);
  assert.equal(getProductionItem('showcase_3_100'), null);
});

test('2-eye showcase 100 base recipe uses verified body boards and one glass shelf', () => {
  const recipe = getModuleRecipe('showcase-2', 100);
  assert.deepEqual(recipe.items, BASE_SHOWCASE_2);
  assert.equal(recipe.variants.innerCornerPanelItemKey, 'panel_corner_92');
});

test('3-eye showcase 100 base recipe uses verified body boards and two glass shelves', () => {
  const recipe = getModuleRecipe('showcase-3', 100);
  assert.deepEqual(recipe.items, BASE_SHOWCASE_3);
  assert.equal(recipe.variants.innerCornerPanelItemKey, 'panel_corner_92');
});

test('showcase inner-corner variants preserve panel quantity and use 5 single + 4 corner connectors', () => {
  for (const [type, panelQuantity] of [['showcase-2', 5], ['showcase-3', 4]]) {
    const expanded = getExpandedModuleRecipe(type, 100, { panelVariant: 'inner-corner' });
    const lines = compact(expanded.items);
    assert.equal(lines.some((line) => line.itemKey === 'panel_98'), false, type);
    assert.deepEqual(lines.find((line) => line.itemKey === 'panel_corner_92'), {
      itemKey: 'panel_corner_92',
      quantity: panelQuantity,
    });
    assert.deepEqual(lines.find((line) => line.itemKey === 'connector_start'), {
      itemKey: 'connector_start', quantity: 4,
    });
    assert.deepEqual(lines.find((line) => line.itemKey === 'connector_single'), {
      itemKey: 'connector_single', quantity: 5,
    });
    assert.deepEqual(lines.find((line) => line.itemKey === 'connector_corner'), {
      itemKey: 'connector_corner', quantity: 4,
    });
  }
});

test('expanded showcase recipes resolve only canonical leaf Items', () => {
  for (const type of ['showcase-2', 'showcase-3']) {
    const expanded = getExpandedModuleRecipe(type, 100);
    expanded.items.forEach((entry) => {
      assert.ok(entry.itemKey, `${type} recipe entry must use canonical itemKey`);
      assert.equal(entry.part, getProductionItem(entry.itemKey), entry.itemKey);
      assert.ok(entry.part, entry.itemKey);
    });
  }
});
