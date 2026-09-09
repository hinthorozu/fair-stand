import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionItem } from '../src/productionParts.js';
import {
  getExpandedModuleRecipe,
  getExpandedStraightWallRecipe,
  getModuleRecipe,
  getRecipeItemKey,
  getStraightWallRecipe,
} from '../src/moduleRecipes.js';

const CASES = [
  [getStraightWallRecipe(200), 2],
  [getModuleRecipe('shelf', 200, { shelfCount: 2 }), 2],
  [getModuleRecipe('shelf', 200, { shelfCount: 3 }), 2],
  [getModuleRecipe('counter', 200, { shape: 'L' }), 5],
  [getModuleRecipe('counter', 200), 3],
  [getModuleRecipe('base-wall', 200), 4],
  [getModuleRecipe('base', 200), 4],
];

test('profile_190 is a canonical single production Item with verified 190 x 8 cm dimensions', () => {
  const item = getProductionItem('profile_190');

  assert.equal(item.itemKey, 'profile_190');
  assert.equal(item.partId, undefined);
  assert.equal(item.name, 'Profil 190 cm');
  assert.equal(item.type, 'profile');
  assert.equal(item.unit, 'adet');
  assert.deepEqual(item.dimensions, { lengthCm: 190, thicknessCm: 8 });
});

test('profile_190 uses canonical itemKey in all 7 verified parent recipes and preserves quantities', () => {
  const quantities = [];

  for (const [recipe, expectedQuantity] of CASES) {
    assert.ok(recipe);
    const matches = recipe.items.filter((item) => getRecipeItemKey(item) === 'profile_190');
    assert.equal(matches.length, 1, recipe.recipeId);
    assert.deepEqual(matches[0], { itemKey: 'profile_190', quantity: expectedQuantity });
    quantities.push(expectedQuantity);
  }

  assert.deepEqual(quantities, [2, 2, 2, 5, 3, 4, 4]);
});

test('expanded recipes resolve profile_190 metadata through canonical itemKey', () => {
  const expandedWall = getExpandedStraightWallRecipe(200);
  const wallProfile = expandedWall.items.find((item) => item.itemKey === 'profile_190');
  assert.ok(wallProfile);
  assert.equal(wallProfile.part.itemKey, 'profile_190');
  assert.deepEqual(wallProfile.part.dimensions, { lengthCm: 190, thicknessCm: 8 });

  const expandedCounter = getExpandedModuleRecipe('counter', 200, { shape: 'L' });
  const counterProfile = expandedCounter.items.find((item) => item.itemKey === 'profile_190');
  assert.ok(counterProfile);
  assert.equal(counterProfile.quantity, 5);
  assert.equal(counterProfile.part.name, 'Profil 190 cm');
});

test('the full production profile family now uses canonical Item identity', () => {
  for (const itemKey of ['profile_41_5', 'profile_91', 'profile_140_5', 'profile_190']) {
    const item = getProductionItem(itemKey);
    assert.equal(item.itemKey, itemKey);
    assert.equal(item.partId, undefined, itemKey);
    assert.equal(item.type, 'profile');
  }
});
