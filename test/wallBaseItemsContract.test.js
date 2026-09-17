import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCatalogItem,
} from '../src/catalog.js';
import {
  createModuleStateFromDescriptor,
  MODULE_STATE_TYPES,
} from '../src/designState.js';
import { getItem, resolveItemKey } from '../src/items.js';
import { resolveModuleContract } from '../src/moduleContracts.js';
import { getModuleRecipe } from '../src/moduleRecipes.js';

const REMOVED_WALL_BASE_KEYS = Object.freeze([
  'wall_base_100',
  'wall_base_150',
  'wall_base_200',
]);

test('silinen wall_base composite Item, catalog, contract ve recipe kayıtları yoktur', () => {
  for (const itemKey of REMOVED_WALL_BASE_KEYS) {
    assert.equal(getItem(itemKey), null, itemKey);
    assert.equal(getCatalogItem(itemKey), null, itemKey);
    assert.equal(resolveModuleContract(itemKey), null, itemKey);
  }

  assert.equal(getModuleRecipe('base-wall', 100), null);
  assert.equal(getModuleRecipe('base-wall', 150), null);
  assert.equal(getModuleRecipe('base-wall', 200), null);
});

test('base-wall factory kaldırıldı; BASE_* leaf/composite durur', () => {
  assert.equal(MODULE_STATE_TYPES.includes('base-wall'), false);
  assert.equal(createModuleStateFromDescriptor({ type: 'base-wall', widthCm: 100 }), null);
  assert.equal(createModuleStateFromDescriptor({ itemKey: 'wall_base_100', type: 'base-wall' }), null);
  assert.equal(resolveItemKey({ type: 'base-wall', widthCm: 100 }), null);

  const base = getItem('BASE_100');
  assert.equal(base.itemKey, 'BASE_100');
  assert.equal(base.type, 'base');
  assert.equal(getItem('base_top_107_50').itemKey, 'base_top_107_50');
  assert.equal(createModuleStateFromDescriptor({ itemKey: 'BASE_100', type: 'base' }).itemKey, 'BASE_100');
});
