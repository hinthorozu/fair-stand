import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionItem } from '../src/productionParts.js';
import {
  getExpandedStraightWallRecipe,
  getModuleRecipe,
  getRecipeItemKey,
  listStraightWallRecipes,
} from '../src/moduleRecipes.js';

function listAllVerifiedRecipes() {
  return [
    ...listStraightWallRecipes(),
    ...[
      ['door', 100],
      ['shelf', 100, { shelfCount: 2 }],
      ['shelf', 150, { shelfCount: 2 }],
      ['shelf', 200, { shelfCount: 2 }],
      ['shelf', 100, { shelfCount: 3 }],
      ['shelf', 150, { shelfCount: 3 }],
      ['shelf', 200, { shelfCount: 3 }],
      ['showcase-2', 100],
      ['showcase-3', 100],
      ['separator', 50],
      ['separator', 100],
      ['counter', 100, { shape: 'L' }],
      ['counter', 150, { shape: 'L' }],
      ['counter', 200, { shape: 'L' }],
      ['counter', 100],
      ['counter', 150],
      ['counter', 200],
      ['base-wall', 100],
      ['base-wall', 150],
      ['base-wall', 200],
      ['base', 100],
      ['base', 150],
      ['base', 200],
    ].map(([type, width, options]) => getModuleRecipe(type, width, options ?? {})),
  ];
}

test('upright_346_5 is a canonical single production Item', () => {
  const item = getProductionItem('upright_346_5');

  assert.equal(item.itemKey, 'upright_346_5');
  assert.equal(item.partId, undefined);
  assert.equal(item.type, 'upright');
  assert.equal(item.unit, 'adet');
  assert.deepEqual(item.dimensions, { lengthCm: 346.5, thicknessCm: 8 });
});

test('upright_346_5 uses canonical itemKey in all 18 verified parent recipes and keeps quantity 2', () => {
  let occurrences = 0;

  for (const recipe of listAllVerifiedRecipes()) {
    assert.ok(recipe);
    for (const item of recipe.items) {
      if (getRecipeItemKey(item) !== 'upright_346_5') continue;
      occurrences += 1;
      assert.deepEqual(item, { itemKey: 'upright_346_5', quantity: 2 });
    }
  }

  assert.equal(occurrences, 18);
});

test('upright_346_5 remains canonical while neighboring upright Items migrate independently', () => {
  for (const itemKey of ['upright_346_5', 'upright_99', 'upright_49_5']) {
    const item = getProductionItem(itemKey);
    assert.equal(item.itemKey, itemKey);
    assert.equal(item.partId, undefined);
    assert.equal(item.type, 'upright');
    assert.equal(item.unit, 'adet');
  }
});

test('expanded recipe resolves upright_346_5 metadata through canonical itemKey', () => {
  const expanded = getExpandedStraightWallRecipe(200);
  const upright = expanded.items.find((item) => item.itemKey === 'upright_346_5');

  assert.ok(upright);
  assert.equal(upright.part.itemKey, 'upright_346_5');
  assert.equal(upright.part.name, 'Dikme 346,5 cm');
  assert.equal(upright.part.unit, 'adet');
  assert.deepEqual(upright.part.dimensions, { lengthCm: 346.5, thicknessCm: 8 });
});
