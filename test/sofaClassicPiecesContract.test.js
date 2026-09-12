import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import {
  createBeigeSofaSetModuleState,
  createCoffeeTableClassicModuleState,
  createSofaDoubleClassicModuleState,
  createSofaSingleClassicModuleState,
} from '../src/designState.js';
import { getItem } from '../src/items.js';

test('furniture_sofa_single_classic katalog ve state kimliği sabittir', () => {
  const catalog = MODULE_CATALOG.furniture_sofa_single_classic;
  const item = getItem('furniture_sofa_single_classic');
  assert.equal(item.itemKey, 'furniture_sofa_single_classic');
  assert.equal(item.type, 'sofa-single-classic');
  assert.equal(item.name, 'Tekli Koltuk');
  assert.equal(catalog.label, 'Tekli Koltuk');
  assert.equal(catalog.widthCm, 65);
  assert.equal(catalog.depthCm, 45);
  assert.equal(catalog.heightCm, 78);
  assert.ok(MODULE_CATALOG_KEYS.includes('furniture_sofa_single_classic'));

  const state = createSofaSingleClassicModuleState();
  assert.equal(state.itemKey, 'furniture_sofa_single_classic');
  assert.equal(state.catalogKey, 'furniture_sofa_single_classic');
  assert.equal(state.type, 'sofa-single-classic');
  assert.equal(state.surface.color, '#ffffff');
  assert.equal(item.visualRotationYDeg, -135);
  assert.equal(state.visualRotationYDeg, -135);
});

test('furniture_sofa_double_classic katalog ve state kimliği sabittir', () => {
  const catalog = MODULE_CATALOG.furniture_sofa_double_classic;
  const item = getItem('furniture_sofa_double_classic');
  assert.equal(item.itemKey, 'furniture_sofa_double_classic');
  assert.equal(item.type, 'sofa-double-classic');
  assert.equal(item.name, 'Çiftli Koltuk');
  assert.equal(catalog.widthCm, 150);
  assert.equal(catalog.depthCm, 45);
  assert.equal(catalog.heightCm, 78);
  assert.ok(MODULE_CATALOG_KEYS.includes('furniture_sofa_double_classic'));

  const state = createSofaDoubleClassicModuleState();
  assert.equal(state.itemKey, 'furniture_sofa_double_classic');
  assert.equal(state.type, 'sofa-double-classic');
  assert.equal(state.surface.color, '#ffffff');
  assert.equal(item.visualRotationYDeg, -45);
  assert.equal(state.visualRotationYDeg, -45);
});

test('furniture_coffee_table_classic katalog ve state kimliği sabittir', () => {
  const catalog = MODULE_CATALOG.furniture_coffee_table_classic;
  const item = getItem('furniture_coffee_table_classic');
  assert.equal(item.itemKey, 'furniture_coffee_table_classic');
  assert.equal(item.type, 'coffee-table-classic');
  assert.equal(item.name, 'Sehpa');
  assert.equal(catalog.widthCm, 60);
  assert.equal(catalog.depthCm, 42);
  assert.equal(catalog.heightCm, 38);
  assert.ok(MODULE_CATALOG_KEYS.includes('furniture_coffee_table_classic'));

  const state = createCoffeeTableClassicModuleState();
  assert.equal(state.itemKey, 'furniture_coffee_table_classic');
  assert.equal(state.type, 'coffee-table-classic');
  assert.equal(state.surface, undefined);
});

test('classic sofa set is a cluster of one double, two singles and one coffee table', () => {
  const set = createBeigeSofaSetModuleState();
  const item = getItem('furniture_sofa_set_classic');
  assert.equal(set.itemKey, 'furniture_sofa_set_classic');
  assert.equal(set.type, 'sofa-set-classic');
  assert.equal(Object.hasOwn(item, 'unit'), false);
  assert.deepEqual(item.composition.items, [
    { itemKey: 'furniture_sofa_double_classic', quantity: 1 },
    { itemKey: 'furniture_sofa_single_classic', quantity: 2 },
    { itemKey: 'furniture_coffee_table_classic', quantity: 1 },
  ]);
});

test('classic sofa pieces reuse the shared beige sofa GLB and coffee table helper', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /function createSofaSingleClassicModule/);
  assert.match(source, /function createSofaDoubleClassicModule/);
  assert.match(source, /function createCoffeeTableClassicModule/);
  assert.match(source, /function addClassicCoffeeTable/);
  assert.match(source, /getItem\('furniture_sofa_single_classic'\)/);
  assert.match(source, /getItem\('furniture_sofa_double_classic'\)/);
  assert.match(source, /getItem\('furniture_coffee_table_classic'\)/);
  assert.match(source, /moduleState\.visualRotationYDeg \?\? item\.visualRotationYDeg/);
});
