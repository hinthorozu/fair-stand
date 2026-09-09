import test from 'node:test';
import assert from 'node:assert/strict';
import { getProductionItem } from '../src/productionParts.js';
import { getExpandedModuleRecipe, getModuleRecipe, getRecipeItemKey } from '../src/moduleRecipes.js';

const CASES = Object.freeze([
  { widthCm: 100, shelfCount: 2, quantity: 4 },
  { widthCm: 150, shelfCount: 2, quantity: 4 },
  { widthCm: 200, shelfCount: 2, quantity: 6 },
  { widthCm: 100, shelfCount: 3, quantity: 6 },
  { widthCm: 150, shelfCount: 3, quantity: 6 },
  { widthCm: 200, shelfCount: 3, quantity: 9 },
]);

test('shelf_leg is canonical without invented product metadata', () => {
  const item = getProductionItem('shelf_leg');
  assert.deepEqual(item, { itemKey: 'shelf_leg', name: 'Raf Ayağı', type: 'shelf-accessory', unit: 'adet' });
  assert.equal(item.partId, undefined);
});

test('shelf_leg uses canonical itemKey in all six shelf recipes with quantity parity', () => {
  for (const { widthCm, shelfCount, quantity } of CASES) {
    const recipe = getModuleRecipe('shelf', widthCm, { shelfCount });
    const matches = recipe.items.filter((entry) => getRecipeItemKey(entry) === 'shelf_leg');
    assert.equal(matches.length, 1, recipe.recipeId);
    assert.deepEqual(matches[0], { itemKey: 'shelf_leg', quantity });
  }
});

test('expanded shelf recipes resolve canonical shelf_leg metadata', () => {
  for (const { widthCm, shelfCount, quantity } of CASES) {
    const expanded = getExpandedModuleRecipe('shelf', widthCm, { shelfCount });
    const leg = expanded.items.find((entry) => entry.itemKey === 'shelf_leg');
    assert.ok(leg);
    assert.equal(leg.quantity, quantity);
    assert.equal(leg.part.itemKey, 'shelf_leg');
    assert.equal(leg.part.partId, undefined);
    assert.equal(leg.part.name, 'Raf Ayağı');
    assert.equal(leg.part.unit, 'adet');
  }
});
