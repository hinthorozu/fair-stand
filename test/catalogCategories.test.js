import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getCatalogCategory,
  listCatalogCategories,
  listCatalogGroups,
  getCatalogItem,
  listCatalogItems,
} from '../src/catalog.js';
import { getItem, listRegisteredItems } from '../src/items.js';

const EXPECTED_CATEGORIES = Object.freeze([
  Object.freeze({ catalogKey: 'panel-wall', catalogName: 'Panel & Duvar', catalogIndex: 1, itemCount: 9 }),
  Object.freeze({ catalogKey: 'panel-addon', catalogName: 'Panel Ek Modül', catalogIndex: 2, itemCount: 13 }),
  Object.freeze({ catalogKey: 'shelf-showcase', catalogName: 'Raf & Vitrin', catalogIndex: 3, itemCount: 5 }),
  Object.freeze({ catalogKey: 'counter-base', catalogName: 'Banko & Baza', catalogIndex: 4, itemCount: 9 }),
  Object.freeze({ catalogKey: 'extra', catalogName: 'Extra', catalogIndex: 5, itemCount: 16 }),
  Object.freeze({ catalogKey: 'electronics-lighting', catalogName: 'Elektronik & Aydınlatma', catalogIndex: 6, itemCount: 6 }),
]);

const EXPECTED_GROUP_KEYS = Object.freeze({
  'panel-wall': Object.freeze([
    'wall_200', 'wall_150', 'wall_100', 'wall_50',
    'wall_separator_100', 'wall_separator_50',
    'wall_separator_100_sarmasik', 'wall_separator_50_sarmasik',
    'door_100',
  ]),
  'panel-addon': Object.freeze([
    'wall_200_short_up_2', 'wall_150_short_up_2', 'wall_100_short_up_2', 'wall_50_short_up_2',
    'wall_200_short_up_1', 'wall_150_short_up_1', 'wall_100_short_up_1', 'wall_50_short_up_1',
    'upright_346_5', 'profile_190', 'profile_140_5', 'profile_91', 'profile_41_5',
  ]),
  'shelf-showcase': Object.freeze([
    'wall_showcase_100_3', 'wall_showcase_100_2',
    'shelf_100', 'shelf_150', 'shelf_200',
  ]),
  'counter-base': Object.freeze([
    'desk_banko_200', 'desk_banko_150', 'desk_banko_100',
    'desk_banko_200_L', 'desk_banko_150_L', 'desk_banko_100_L',
    'BASE_200', 'BASE_150', 'BASE_100',
  ]),
  extra: Object.freeze([
    'furniture_sofa_set_classic', 'furniture_sofa_single_classic', 'furniture_sofa_double_classic',
    'furniture_coffee_table_classic', 'furniture_table_chair_set_eames', 'chair_eames',
    'glass_table', 'furniture_bar_stool_classic', 'MINI_FRIDGE_AVANTI', 'KETTLE',
    'COAT_RACK', 'PLASTIC_TRASH_BIN', 'EXTRA_INDOOR_PLANT_1',
    'EXTRA_LONG_PLANTER_100', 'EXTRA_LONG_PLANTER_150', 'EXTRA_LONG_PLANTER_200',
  ]),
  'electronics-lighting': Object.freeze([
    'TV_42', 'TV_55', 'VIDEO_WALL_2X2', 'VIDEO_WALL_3X3', 'TV_65', 'led_floodlight',
  ]),
});

test('Catalog kategorileri key/name/index taşır; sıra 1..N kesintisiz ve benzersizdir', () => {
  const categories = listCatalogCategories();
  assert.equal(categories.length, EXPECTED_CATEGORIES.length);

  const keys = categories.map((category) => category.catalogKey);
  const names = categories.map((category) => category.catalogName);
  const indexes = categories.map((category) => category.catalogIndex);

  assert.equal(new Set(keys).size, keys.length);
  assert.equal(names.filter((name) => !name).length, 0);
  assert.equal(indexes.filter((index) => index == null).length, 0);
  assert.equal(new Set(indexes).size, indexes.length);
  assert.deepEqual(indexes, EXPECTED_CATEGORIES.map((_, index) => index + 1));

  EXPECTED_CATEGORIES.forEach((expected, index) => {
    const category = categories[index];
    assert.equal(category.catalogKey, expected.catalogKey);
    assert.equal(category.catalogName, expected.catalogName);
    assert.equal(category.catalogIndex, expected.catalogIndex);
    assert.deepEqual(getCatalogCategory(expected.catalogKey), categories[index]);
  });
});

test('görünür Item catalogCategory değerleri geçerli catalogKey ile eşleşir', () => {
  const catalogKeys = new Set(listCatalogCategories().map((category) => category.catalogKey));
  let invalidVisible = 0;
  let invalidHidden = 0;
  let visibleCount = 0;

  for (const item of listRegisteredItems()) {
    if (item.catalogVisible === true) {
      visibleCount += 1;
      if (!catalogKeys.has(item.catalogCategory)) invalidVisible += 1;
      if (item.catalogItemIndex == null) invalidVisible += 1;
    } else if (item.catalogCategory != null && !catalogKeys.has(item.catalogCategory)) {
      invalidHidden += 1;
    }
  }

  assert.equal(visibleCount, listCatalogItems().map((item) => item.itemKey).length);
  assert.equal(invalidVisible, 0);
  assert.equal(invalidHidden, 0);
  assert.equal(getItem('wall_200').catalogCategory, 'panel-wall');
  assert.equal(getItem('panel_197').catalogCategory, null);
});

test('listCatalogGroups kategori sırası, adı ve Item sırasını korur', () => {
  const groups = listCatalogGroups();
  assert.equal(groups.length, EXPECTED_CATEGORIES.length);
  assert.deepEqual(
    listCatalogGroups().map((group) => ({
      catalogKey: group.catalogKey,
      catalogName: group.catalogName,
      catalogIndex: group.catalogIndex,
      keys: [...group.keys],
    })),
    groups.map((group) => ({
      catalogKey: group.catalogKey,
      catalogName: group.catalogName,
      catalogIndex: group.catalogIndex,
      keys: [...group.keys],
    })),
  );

  let visibleTotal = 0;
  groups.forEach((group, index) => {
    const expected = EXPECTED_CATEGORIES[index];
    assert.equal(group.catalogKey, expected.catalogKey);
    assert.equal(group.catalogName, expected.catalogName);
    assert.equal(group.catalogIndex, expected.catalogIndex);
    assert.equal(group.label, expected.catalogName);
    assert.equal(group.keys.length, expected.itemCount);
    assert.deepEqual([...group.keys], [...EXPECTED_GROUP_KEYS[expected.catalogKey]]);
    visibleTotal += group.keys.length;
    group.keys.forEach((itemKey, itemIndex) => {
      const item = getItem(itemKey);
      assert.equal(item.catalogVisible, true, itemKey);
      assert.equal(item.catalogCategory, group.catalogKey, itemKey);
      assert.equal(item.catalogItemIndex, itemIndex + 1, itemKey);
      assert.ok(getCatalogItem(itemKey), itemKey);
    });
  });

  assert.equal(visibleTotal, 58);
  assert.equal(listCatalogItems().map((item) => item.itemKey).length, 58);
  assert.deepEqual([...listCatalogItems().map((item) => item.itemKey)], groups.flatMap((group) => group.keys));
});
