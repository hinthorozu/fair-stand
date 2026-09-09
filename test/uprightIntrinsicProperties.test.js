import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionItem } from '../src/productionParts.js';

const UPRIGHT_KEYS = ['upright_346_5', 'upright_99', 'upright_49_5'];

test('all production upright Items keep canonical aluminum material and default color', () => {
  for (const itemKey of UPRIGHT_KEYS) {
    const item = getProductionItem(itemKey);
    assert.ok(item, itemKey);
    assert.equal(item.type, 'upright', itemKey);
    assert.equal(item.material, 'alüminyum', itemKey);
    assert.equal(item.defaultColor, 0xd0d3d4, itemKey);
  }
});
