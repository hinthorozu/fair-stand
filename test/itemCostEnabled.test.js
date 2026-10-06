import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveItemBom } from '../src/itemBom.js';
import { initializeItemRegistry } from '../src/items.js';
import { loadCanonicalItemCatalog } from './registerCanonicalItemCatalog.mjs';

function leaf(isCostEnabled) {
  return {
    itemKey: 'cost_flag_leaf',
    name: 'Cost Flag Leaf',
    type: 'panel',
    unit: 'adet',
    material: 'sunta',
    isCostEnabled,
    isActive: true,
  };
}

test('item cost flag does not change BOM quantity or unit', () => {
  try {
    for (const enabled of [false, true]) {
      initializeItemRegistry([leaf(enabled)]);
      const [line] = resolveItemBom('cost_flag_leaf', 3);
      assert.equal(line.itemKey, 'cost_flag_leaf');
      assert.equal(line.quantity, 3);
      assert.equal(line.unit, 'adet');
      assert.equal(line.material, 'sunta');
      assert.equal(line.item.isCostEnabled, enabled);
    }
  } finally {
    loadCanonicalItemCatalog();
  }
});
