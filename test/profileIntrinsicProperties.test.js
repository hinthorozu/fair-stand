import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionItem } from '../src/productionParts.js';

const PROFILE_ITEM_KEYS = Object.freeze([
  'profile_41_5',
  'profile_91',
  'profile_140_5',
  'profile_190',
]);

test('all production profiles keep canonical aluminum material and default color', () => {
  for (const itemKey of PROFILE_ITEM_KEYS) {
    const item = getProductionItem(itemKey);
    assert.ok(item, itemKey);
    assert.equal(item.itemKey, itemKey);
    assert.equal(item.type, 'profile');
    assert.equal(item.material, 'alüminyum', itemKey);
    assert.equal(item.defaultColor, 0xd0d3d4, itemKey);
  }
});
