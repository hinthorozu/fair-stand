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

test('panel_corner_192 is a canonical single production Item', () => {
  const item = getItem('panel_corner_192');

  assert.equal(item.itemKey, 'panel_corner_192');
  assert.equal(item.partId, undefined);
  assert.equal(item.name, 'İç Köşe Paneli 192 × 47 cm');
  assert.equal(item.type, 'panel');
  assert.equal(item.unit, 'adet');
  assert.deepEqual(item.dimensions, { widthCm: 192, heightCm: 47, thicknessCm: 0.8 });
  assert.equal(item.panelRole, 'inner-corner');
  assert.equal(item.nominalModuleWidthCm, undefined);
});

test('panel_corner_192 is not selected by wall_200 recipe expansion', () => {
  const recipe = getModuleRecipe('wall', 200);
  const expanded = getExpandedModuleRecipe('wall', 200);
  assert.ok(recipe.items.find((item) => getRecipeItemKey(item) === 'panel_197'));
  assert.equal(recipe.items.find((item) => getRecipeItemKey(item) === 'panel_corner_192'), undefined);
  assert.equal(expanded.items.find((item) => item.itemKey === 'panel_197').quantity, 7);
  assert.equal(expanded.items.find((item) => item.itemKey === 'panel_corner_192'), undefined);
});

test('all inner-corner panel Items remain canonical identities', () => {
  for (const itemKey of ['panel_corner_42_5', 'panel_corner_92', 'panel_corner_142_5', 'panel_corner_192']) {
    const item = getItem(itemKey);
    assert.equal(item.itemKey, itemKey);
    assert.equal(item.partId, undefined, itemKey);
    assert.equal(item.panelRole, 'inner-corner', itemKey);
  }
});
