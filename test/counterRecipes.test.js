import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionPart } from '../src/productionParts.js';
import { getExpandedModuleRecipe, getModuleRecipe } from '../src/moduleRecipes.js';

test('production catalog contains verified banko upright and tops', () => {
  assert.equal(getProductionPart('upright_99').dimensions.lengthCm, 99);
  assert.deepEqual(getProductionPart('counter_top_110_60').dimensions, { widthCm: 110, depthCm: 60 });
  assert.deepEqual(getProductionPart('counter_top_160_60').dimensions, { widthCm: 160, depthCm: 60 });
  assert.deepEqual(getProductionPart('counter_top_210_60').dimensions, { widthCm: 210, depthCm: 60 });
});

test('banko 100 recipe matches verified production data', () => {
  const recipe = getModuleRecipe('counter', 100);
  assert.deepEqual(recipe.items, [
    { partId: 'profile_91', quantity: 3 },
    { partId: 'profile_41_5', quantity: 4 },
    { partId: 'upright_99', quantity: 4 },
    { partId: 'panel_98', quantity: 2 },
    { partId: 'panel_48_5', quantity: 4 },
    { partId: 'connector_start', quantity: 6 },
    { partId: 'connector_single', quantity: 12 },
    { partId: 'counter_top_110_60', quantity: 1 },
  ]);
});

test('banko 150 recipe matches verified production data', () => {
  const quantities = Object.fromEntries(getModuleRecipe('counter', 150).items.map((item) => [item.partId, item.quantity]));
  assert.equal(quantities.profile_140_5, 3);
  assert.equal(quantities.profile_41_5, 4);
  assert.equal(quantities.upright_99, 4);
  assert.equal(quantities.panel_147_5, 2);
  assert.equal(quantities.panel_48_5, 4);
  assert.equal(quantities.connector_start, 6);
  assert.equal(quantities.connector_single, 12);
  assert.equal(quantities.counter_top_160_60, 1);
});

test('banko 200 recipe matches verified production data', () => {
  const quantities = Object.fromEntries(getModuleRecipe('counter', 200).items.map((item) => [item.partId, item.quantity]));
  assert.equal(quantities.profile_190, 3);
  assert.equal(quantities.profile_41_5, 4);
  assert.equal(quantities.upright_99, 4);
  assert.equal(quantities.panel_197, 2);
  assert.equal(quantities.panel_48_5, 4);
  assert.equal(quantities.connector_start, 6);
  assert.equal(quantities.connector_single, 12);
  assert.equal(quantities.counter_top_210_60, 1);
});

test('expanded banko recipe resolves top and upright production parts', () => {
  const expanded = getExpandedModuleRecipe('counter', 100);
  assert.equal(expanded.items[2].part.name, 'Dikme 99 cm');
  assert.equal(expanded.items.at(-1).part.name, 'Banko Üstü 110 × 60 cm');
});
