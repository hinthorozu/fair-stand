import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionPart } from '../src/productionParts.js';
import { getExpandedModuleRecipe, getModuleRecipe } from '../src/moduleRecipes.js';

test('production catalog contains verified baza upright and tops', () => {
  assert.equal(getProductionPart('upright_49_5').dimensions.lengthCm, 49.5);
  assert.deepEqual(getProductionPart('base_top_107_50').dimensions, { widthCm: 107, depthCm: 50 });
  assert.deepEqual(getProductionPart('base_top_157_50').dimensions, { widthCm: 157, depthCm: 50 });
  assert.deepEqual(getProductionPart('base_top_206_50').dimensions, { widthCm: 206, depthCm: 50 });
});

const expectedRecipes = {
  100: {
    profilePartId: 'profile_91',
    panelPartId: 'panel_98',
    topPartId: 'base_top_107_50',
  },
  150: {
    profilePartId: 'profile_140_5',
    panelPartId: 'panel_147_5',
    topPartId: 'base_top_157_50',
  },
  200: {
    profilePartId: 'profile_190',
    panelPartId: 'panel_197',
    topPartId: 'base_top_206_50',
  },
};

for (const [width, expected] of Object.entries(expectedRecipes)) {
  test(`baza ${width} recipe matches verified production data`, () => {
    const recipe = getModuleRecipe('base', Number(width));
    const quantities = Object.fromEntries(recipe.items.map((item) => [item.partId, item.quantity]));

    assert.equal(quantities[expected.profilePartId], 4);
    assert.equal(quantities.profile_41_5, 4);
    assert.equal(quantities.upright_49_5, 4);
    assert.equal(quantities[expected.panelPartId], 2);
    assert.equal(quantities.panel_48_5, 2);
    assert.equal(quantities.connector_start, 8);
    assert.equal(quantities.connector_single, 8);
    assert.equal(quantities[expected.topPartId], 1);
  });
}

test('expanded baza recipe resolves top and upright production parts', () => {
  const expanded = getExpandedModuleRecipe('base', 150);
  assert.equal(expanded.items.find((item) => item.partId === 'upright_49_5').part.name, 'Dikme 49,5 cm');
  assert.equal(expanded.items.at(-1).part.name, 'Baza Üstü 157 × 50 cm');
});
