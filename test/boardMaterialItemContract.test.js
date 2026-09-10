import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionItem } from '../src/productionParts.js';

const SUNTA_ITEM_KEYS = Object.freeze([
  'panel_147_5',
  'panel_197',
  'panel_48_5',
  'panel_98',
  'panel_corner_142_5',
  'panel_corner_192',
  'panel_corner_42_5',
  'panel_corner_92',
  'base_top_107_50',
  'base_top_157_50',
  'base_top_206_50',
  'counter_top_102_60',
  'counter_top_110_60',
  'counter_top_150_60',
  'counter_top_160_60',
  'counter_top_210_60',
  'counter_top_52_60',
  'shelf_100',
  'shelf_150',
  'shelf_200',
  'showcase_side_94_6_30',
  'showcase_side_143_5_30',
  'showcase_horizontal_87_4_30',
]);

test('all verified board Items use sunta as canonical production material', () => {
  assert.equal(SUNTA_ITEM_KEYS.length, 23);
  for (const itemKey of SUNTA_ITEM_KEYS) {
    const item = getProductionItem(itemKey);
    assert.ok(item, itemKey);
    assert.equal(item.material, 'sunta', itemKey);
  }
});
