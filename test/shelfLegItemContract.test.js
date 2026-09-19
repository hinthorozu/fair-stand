import test from 'node:test';
import assert from 'node:assert/strict';
import { getItem } from '../src/items.js';
import {
  getModuleRecipe,
} from './recipeParentItemKey.js';

test('shelf_leg is canonical without invented product metadata', () => {
  const item = getItem('shelf_leg');
  assert.deepEqual(item, {
    itemKey: 'shelf_leg',
    catalogVisible: false,
    categoryId: null,
    catalogItemIndex: null,
    name: 'Raf Ayağı',
    type: 'shelf-accessory',
    unit: 'adet',
  });
  assert.equal(item.partId, undefined);
});

test('silinen wall_shelf recipes shelf_leg satırı taşımaz', () => {
  for (const widthCm of [100, 150, 200]) {
    assert.equal(getModuleRecipe('shelf', widthCm, { shelfCount: 2 }), null);
    assert.equal(getModuleRecipe('shelf', widthCm, { shelfCount: 3 }), null);
  }
});
