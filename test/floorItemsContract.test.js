import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import {
  FLOOR_ITEMS,
  getFloorItem,
  getFloorSelectLabel,
  getItem,
  isParquetFloorItem,
  listFloorItems,
} from '../src/items.js';

const EXPECTED_SELECT = [
  ['karolaj', 'Karolaj · 100 × 100 cm'],
  ['hali', 'Halı'],
  ['parke-acik', 'Beyaz Meşe'],
  ['parke-sari', 'Sarı Meşe'],
  ['parke-beton', 'Beton Parke'],
];

test('floor Items use existing floorType keys and stay off the module catalog', () => {
  const items = listFloorItems();
  assert.deepEqual(items.map((item) => item.itemKey), EXPECTED_SELECT.map(([key]) => key));
  assert.equal(MODULE_CATALOG_KEYS.length, 51);

  for (const [itemKey, selectLabel] of EXPECTED_SELECT) {
    const item = getFloorItem(itemKey);
    assert.equal(getItem(itemKey), item);
    assert.equal(item.type, 'floor');
    assert.equal(getFloorSelectLabel(item), selectLabel);
    assert.equal(Object.hasOwn(item, 'unit'), false);
    assert.equal(MODULE_CATALOG[itemKey], undefined);
    assert.equal(MODULE_CATALOG_KEYS.includes(itemKey), false);
  }

  assert.equal(FLOOR_ITEMS.karolaj.dimensions.widthCm, 100);
  assert.equal(FLOOR_ITEMS.karolaj.dimensions.depthCm, 100);
  assert.equal(FLOOR_ITEMS.karolaj.defaultColor, '#e9edf1');
  assert.equal(FLOOR_ITEMS.karolaj.paintable, true);
  assert.equal(FLOOR_ITEMS.hali.defaultColor, '#8b8f94');
  assert.equal(FLOOR_ITEMS.hali.paintable, true);
  assert.equal(Object.hasOwn(FLOOR_ITEMS.hali, 'dimensions'), false);

  assert.equal(isParquetFloorItem(FLOOR_ITEMS['parke-acik']), true);
  assert.equal(FLOOR_ITEMS['parke-acik'].dimensions.lengthCm, 140);
  assert.equal(FLOOR_ITEMS['parke-acik'].dimensions.depthCm, 16);
  assert.equal(FLOOR_ITEMS['parke-sari'].dimensions.lengthCm, 140);
  assert.equal(FLOOR_ITEMS['parke-beton'].dimensions.lengthCm, 112);
  assert.equal(FLOOR_ITEMS['parke-beton'].dimensions.depthCm, 28);
  assert.equal(FLOOR_ITEMS['parke-beton'].paintable, false);
  assert.equal(getFloorItem('parke'), null);
});
