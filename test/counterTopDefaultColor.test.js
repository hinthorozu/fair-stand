import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionItem } from '../src/productionParts.js';

const COUNTER_TOP_KEYS = [
  'counter_top_110_60',
  'counter_top_52_60',
  'counter_top_160_60',
  'counter_top_102_60',
  'counter_top_210_60',
  'counter_top_150_60',
];

test('all counter-top Items carry the canonical optional default color', () => {
  for (const itemKey of COUNTER_TOP_KEYS) {
    const item = getProductionItem(itemKey);
    assert.equal(item.defaultColor, 0xf8fafc, itemKey);
  }
});

test('defaultColor remains optional for Items without a product default color', () => {
  assert.equal(getProductionItem('panel_98').defaultColor, undefined);
});
