import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  MODULE_CATALOG,
  MODULE_CATALOG_GROUPS,
  MODULE_CATALOG_KEYS,
} from '../src/catalog.js';
import { getItem, listRegisteredItems } from '../src/items.js';

const CATALOG_CATEGORY_KEYS_BY_LABEL = Object.freeze({
  'Panel & Duvar': 'panel-wall',
  'Panel Ek Modül': 'panel-addon',
  'Raf & Vitrin': 'shelf-showcase',
  'Banko & Baza': 'counter-base',
  Extra: 'extra',
  'Elektronik & Aydınlatma': 'electronics-lighting',
});

const EXPECTED_CATALOG_GROUPS = Object.freeze([
  Object.freeze({
    label: 'Panel & Duvar',
    keys: Object.freeze([
      'wall_200',
      'wall_150',
      'wall_100',
      'wall_50',
      'wall_separator_100',
      'wall_separator_50',
      'wall_separator_100_sarmasik',
      'wall_separator_50_sarmasik',
      'wall_base_200',
      'wall_base_150',
      'wall_base_100',
      'door_100',
    ]),
  }),
  Object.freeze({
    label: 'Panel Ek Modül',
    keys: Object.freeze([
      'wall_200_short_up_2',
      'wall_150_short_up_2',
      'wall_100_short_up_2',
      'wall_50_short_up_2',
      'wall_200_short_up_1',
      'wall_150_short_up_1',
      'wall_100_short_up_1',
      'wall_50_short_up_1',
      'upright_346_5',
      'profile_190',
      'profile_140_5',
      'profile_91',
      'profile_41_5',
    ]),
  }),
  Object.freeze({
    label: 'Raf & Vitrin',
    keys: Object.freeze([
      'wall_showcase_100_3',
      'wall_showcase_100_2',
      'wall_shelf_3_200',
      'wall_shelf_3_150',
      'wall_shelf_3_100',
      'wall_shelf_2_200',
      'wall_shelf_2_150',
      'wall_shelf_2_100',
    ]),
  }),
  Object.freeze({
    label: 'Banko & Baza',
    keys: Object.freeze([
      'desk_banko_200',
      'desk_banko_150',
      'desk_banko_100',
      'desk_banko_200_L',
      'desk_banko_150_L',
      'desk_banko_100_L',
      'BASE_200',
      'BASE_150',
      'BASE_100',
    ]),
  }),
  Object.freeze({
    label: 'Extra',
    keys: Object.freeze([
      'furniture_sofa_set_classic',
      'furniture_sofa_single_classic',
      'furniture_sofa_double_classic',
      'furniture_coffee_table_classic',
      'furniture_table_chair_set_eames',
      'chair_eames',
      'glass_table',
      'furniture_bar_stool_classic',
      'MINI_FRIDGE_AVANTI',
      'KETTLE',
      'COAT_RACK',
      'PLASTIC_TRASH_BIN',
      'EXTRA_INDOOR_PLANT_1',
      'EXTRA_LONG_PLANTER_100',
      'EXTRA_LONG_PLANTER_150',
      'EXTRA_LONG_PLANTER_200',
    ]),
  }),
  Object.freeze({
    label: 'Elektronik & Aydınlatma',
    keys: Object.freeze([
      'TV_42',
      'TV_55',
      'VIDEO_WALL_2X2',
      'VIDEO_WALL_3X3',
      'TV_65',
      'led_floodlight',
    ]),
  }),
]);

const EXPECTED_CATALOG_KEYS = Object.freeze(EXPECTED_CATALOG_GROUPS.flatMap((group) => group.keys));

function expectedFieldsForItemKey(itemKey) {
  for (const group of EXPECTED_CATALOG_GROUPS) {
    const index = group.keys.indexOf(itemKey);
    if (index === -1) continue;
    return {
      catalogVisible: true,
      catalogCategory: CATALOG_CATEGORY_KEYS_BY_LABEL[group.label],
      catalogItemIndex: index + 1,
    };
  }
  return {
    catalogVisible: false,
    catalogCategory: null,
    catalogItemIndex: null,
  };
}

test('mevcut katalog Item listesi ve grup sırası değişmemiştir', () => {
  assert.deepEqual([...MODULE_CATALOG_KEYS], [...EXPECTED_CATALOG_KEYS]);
  assert.equal(Object.keys(MODULE_CATALOG).length, EXPECTED_CATALOG_KEYS.length);
  assert.deepEqual(
    MODULE_CATALOG_GROUPS.map((group) => ({ label: group.label, keys: [...group.keys] })),
    EXPECTED_CATALOG_GROUPS.map((group) => ({ label: group.label, keys: [...group.keys] })),
  );

  EXPECTED_CATALOG_GROUPS.forEach((group) => {
    const groupSet = new Set(group.keys);
    const uiOrder = MODULE_CATALOG_KEYS.filter((itemKey) => groupSet.has(itemKey));
    assert.deepEqual(uiOrder, [...group.keys], group.label);
  });
});

test('104 Item katalog metadata alanlarını taşır ve canlı katalog üyeliğiyle birebir örtüşür', () => {
  const items = listRegisteredItems();
  assert.equal(items.length, 104);

  let visibleCount = 0;
  let missingVisible = 0;
  let missingCategory = 0;
  let missingIndex = 0;
  let visibleNullCategory = 0;
  let visibleNullIndex = 0;
  let hiddenNonNullCategory = 0;
  let hiddenNonNullIndex = 0;
  const byCategory = new Map();

  for (const item of items) {
    if (!Object.hasOwn(item, 'catalogVisible')) missingVisible += 1;
    if (!Object.hasOwn(item, 'catalogCategory')) missingCategory += 1;
    if (!Object.hasOwn(item, 'catalogItemIndex')) missingIndex += 1;

    const expected = expectedFieldsForItemKey(item.itemKey);
    assert.equal(item.catalogVisible, expected.catalogVisible, item.itemKey);
    assert.equal(item.catalogCategory, expected.catalogCategory, item.itemKey);
    assert.equal(item.catalogItemIndex, expected.catalogItemIndex, item.itemKey);
    assert.deepEqual(getItem(item.itemKey), item, item.itemKey);

    if (item.catalogVisible === true) {
      visibleCount += 1;
      if (item.catalogCategory == null) visibleNullCategory += 1;
      if (item.catalogItemIndex == null) visibleNullIndex += 1;
      const rows = byCategory.get(item.catalogCategory) ?? [];
      rows.push(item);
      byCategory.set(item.catalogCategory, rows);
    } else {
      if (item.catalogCategory != null) hiddenNonNullCategory += 1;
      if (item.catalogItemIndex != null) hiddenNonNullIndex += 1;
    }
  }

  assert.equal(missingVisible, 0);
  assert.equal(missingCategory, 0);
  assert.equal(missingIndex, 0);
  assert.equal(visibleCount, EXPECTED_CATALOG_KEYS.length);
  assert.equal(visibleNullCategory, 0);
  assert.equal(visibleNullIndex, 0);
  assert.equal(hiddenNonNullCategory, 0);
  assert.equal(hiddenNonNullIndex, 0);

  let duplicateIndex = 0;
  let gapIndex = 0;
  for (const group of EXPECTED_CATALOG_GROUPS) {
    const categoryKey = CATALOG_CATEGORY_KEYS_BY_LABEL[group.label];
    const rows = byCategory.get(categoryKey) ?? [];
    assert.equal(rows.length, group.keys.length, categoryKey);
    const indexes = rows.map((item) => item.catalogItemIndex).sort((a, b) => a - b);
    if (new Set(indexes).size !== indexes.length) duplicateIndex += 1;
    const expectedIndexes = group.keys.map((_, index) => index + 1);
    if (JSON.stringify(indexes) !== JSON.stringify(expectedIndexes)) gapIndex += 1;
    const orderedKeys = [...rows]
      .sort((a, b) => a.catalogItemIndex - b.catalogItemIndex)
      .map((item) => item.itemKey);
    assert.deepEqual(orderedKeys, [...group.keys], categoryKey);
  }
  assert.equal(duplicateIndex, 0);
  assert.equal(gapIndex, 0);

  assert.equal(getItem('wall_200').catalogVisible, true);
  assert.equal(getItem('wall_200').catalogCategory, 'panel-wall');
  assert.equal(getItem('wall_200').catalogItemIndex, 1);
  assert.equal(getItem('panel_197').catalogVisible, false);
  assert.equal(getItem('panel_197').catalogCategory, null);
  assert.equal(getItem('panel_197').catalogItemIndex, null);
});

test('katalog UI listCatalogGroups üzerinden catalogName ve catalogIndex kullanır', () => {
  const sidebar = readFileSync(new URL('../src/moduleDragSidebar.js', import.meta.url), 'utf8');
  const contextMenu = readFileSync(new URL('../src/moduleContextMenu.js', import.meta.url), 'utf8');
  const items = readFileSync(new URL('../src/items.js', import.meta.url), 'utf8');

  assert.match(sidebar, /listCatalogGroups/);
  assert.match(contextMenu, /listCatalogGroups/);
  assert.match(sidebar, /catalogName/);
  assert.match(contextMenu, /catalogName/);
  assert.doesNotMatch(sidebar, /MODULE_CATALOG_GROUPS/);
  assert.doesNotMatch(contextMenu, /MODULE_CATALOG_GROUPS/);
  assert.match(items, /catalogVisible: true/);
  assert.match(items, /catalogCategory: 'panel-wall'/);

  for (const itemKey of MODULE_CATALOG_KEYS) {
    assert.equal(Object.hasOwn(MODULE_CATALOG[itemKey], 'catalogVisible'), false, itemKey);
    assert.equal(Object.hasOwn(MODULE_CATALOG[itemKey], 'catalogCategory'), false, itemKey);
    assert.equal(Object.hasOwn(MODULE_CATALOG[itemKey], 'catalogItemIndex'), false, itemKey);
  }
});

test('CATALOG.md catalogKey tablosu canlı kategorilerle örtüşür', () => {
  const catalogDoc = readFileSync(new URL('../docs/refactor/CATALOG.md', import.meta.url), 'utf8');

  assert.match(catalogDoc, /# Catalog/);
  assert.match(catalogDoc, /listCatalogGroups/);
  assert.match(catalogDoc, /listCatalogCategories/);

  EXPECTED_CATALOG_GROUPS.forEach((group, index) => {
    const categoryKey = CATALOG_CATEGORY_KEYS_BY_LABEL[group.label];
    const row = new RegExp(
      `\\| \`${categoryKey}\` \\| ${group.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\| ${index + 1} \\| ${group.keys.length} \\|`,
    );
    assert.match(catalogDoc, row, categoryKey);
    assert.equal(getItem(group.keys[0]).catalogCategory, categoryKey, group.keys[0]);
  });
});

test('ITEMS.md yalnız onaylı katalog şemasını taşır; gerçekleşmemiş method yazmaz', () => {
  const itemsDoc = readFileSync(new URL('../docs/refactor/ITEMS.md', import.meta.url), 'utf8');

  assert.match(itemsDoc, /# Item/);
  assert.match(itemsDoc, /### catalogVisible/);
  assert.match(itemsDoc, /### catalogCategory/);
  assert.match(itemsDoc, /### catalogItemIndex/);
  assert.match(itemsDoc, /# Canonical Mechanism Connections/);
  assert.match(itemsDoc, /# Item Schema/);
  assert.match(itemsDoc, /# Architectural Rules/);
  assert.match(itemsDoc, /listCatalogCategories/);
  assert.match(itemsDoc, /listCatalogGroups/);
  assert.doesNotMatch(itemsDoc, /listCatalogItems\(\)[^\n]*mevcut/);
});
