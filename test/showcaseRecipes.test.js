import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionPart } from '../src/productionParts.js';
import { getExpandedModuleRecipe, getModuleRecipe } from '../src/moduleRecipes.js';

test('production catalog contains showcase parts and glass shelf', () => {
  assert.equal(getProductionPart('showcase_2_100').name, '2 Gözlü Vitrin 100 cm');
  assert.equal(getProductionPart('showcase_3_100').name, '3 Gözlü Vitrin 100 cm');
  assert.equal(getProductionPart('glass_shelf').name, 'Cam Raf');
});

test('2-eye showcase 100 recipe matches verified production data', () => {
  const recipe = getModuleRecipe('showcase-2', 100);
  assert.deepEqual(recipe.items, [
    { partId: 'profile_91', quantity: 4 },
    { partId: 'upright_346_5', quantity: 2 },
    { partId: 'panel_98', quantity: 5 },
    { partId: 'connector_start', quantity: 4 },
    { partId: 'connector_single', quantity: 9 },
    { partId: 'showcase_2_100', quantity: 1 },
    { partId: 'glass_shelf', quantity: 2 },
  ]);
  assert.equal(recipe.variants.innerCornerPanelPartId, 'panel_corner_92');
});

test('3-eye showcase 100 recipe matches verified production data', () => {
  const recipe = getModuleRecipe('showcase-3', 100);
  assert.deepEqual(recipe.items, [
    { partId: 'profile_91', quantity: 4 },
    { partId: 'upright_346_5', quantity: 2 },
    { partId: 'panel_98', quantity: 4 },
    { partId: 'connector_start', quantity: 4 },
    { partId: 'connector_single', quantity: 7 },
    { partId: 'showcase_3_100', quantity: 1 },
    { partId: 'glass_shelf', quantity: 3 },
  ]);
  assert.equal(recipe.variants.innerCornerPanelPartId, 'panel_corner_92');
});

test('expanded showcase recipe resolves showcase and glass shelf parts', () => {
  const expanded = getExpandedModuleRecipe('showcase-3', 100);
  assert.equal(expanded.items.at(-2).part.name, '3 Gözlü Vitrin 100 cm');
  assert.equal(expanded.items.at(-1).part.name, 'Cam Raf');
});
