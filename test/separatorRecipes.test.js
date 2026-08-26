import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionPart } from '../src/productionParts.js';
import { getExpandedModuleRecipe, getModuleRecipe } from '../src/moduleRecipes.js';

test('production catalog contains separator panel parts', () => {
  assert.equal(getProductionPart('separator_panel_48_5').name, 'Separatör Paneli 48,5 × 47 cm');
  assert.equal(getProductionPart('separator_panel_98').name, 'Separatör Paneli 98 × 47 cm');
});

test('separator 50 recipe matches verified production data', () => {
  const recipe = getModuleRecipe('separator', 50);
  assert.deepEqual(recipe.items, [
    { partId: 'profile_41_5', quantity: 2 },
    { partId: 'upright_346_5', quantity: 2 },
    { partId: 'separator_panel_48_5', quantity: 1 },
    { partId: 'separator_panel_98', quantity: 3 },
    { partId: 'connector_start', quantity: 2 },
    { partId: 'connector_single', quantity: 7 },
  ]);
});

test('separator 100 recipe matches verified production data', () => {
  const recipe = getModuleRecipe('separator', 100);
  assert.deepEqual(recipe.items, [
    { partId: 'profile_91', quantity: 2 },
    { partId: 'upright_346_5', quantity: 2 },
    { partId: 'separator_panel_98', quantity: 7 },
    { partId: 'connector_start', quantity: 2 },
    { partId: 'connector_single', quantity: 13 },
  ]);
});

test('expanded separator recipe resolves separator panel metadata', () => {
  const expanded = getExpandedModuleRecipe('separator', 50);
  assert.equal(expanded.items[2].part.dimensions.widthCm, 48.5);
  assert.equal(expanded.items[3].part.dimensions.widthCm, 98);
});
