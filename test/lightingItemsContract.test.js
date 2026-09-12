import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS, resolveModuleCatalogKey } from '../src/catalog.js';
import {
  createIlluminatedFoamModuleState,
  createLedFloodlightModuleState,
  createModuleStateFromDescriptor,
  duplicateModuleState,
  normalizeModuleItemState,
} from '../src/designState.js';
import { getItem, NON_CATALOG_ITEMS, TOP_LIGHT_ITEMS } from '../src/items.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';
import { resolveModuleContract } from '../src/moduleContracts.js';

test('led_floodlight: canonical identity, catalog and hydrate', () => {
  const item = TOP_LIGHT_ITEMS.led_floodlight;
  assert.equal(getItem('led_floodlight'), item);
  assert.equal(getItem('LED_FLOODLIGHT'), null);

  const catalog = MODULE_CATALOG.led_floodlight;
  assert.equal(catalog.itemKey, 'led_floodlight');
  assert.equal(catalog.label, 'LED Projektör');
  assert.equal(catalog.type, 'led-floodlight');
  assert.equal(catalog.widthCm, 50);
  assert.equal(catalog.depthCm, 20);
  assert.equal(catalog.heightCm, 35);
  assert.equal(Object.hasOwn(catalog, 'mountHeightCm'), false);
  assert.equal(MODULE_CATALOG.LED_FLOODLIGHT, undefined);
  assert.equal(MODULE_CATALOG_KEYS.includes('led_floodlight'), true);
  assert.equal(MODULE_CATALOG_KEYS.includes('LED_FLOODLIGHT'), false);
  assert.equal(MODULE_CATALOG_KEYS.includes('illuminated-foam'), false);

  const state = createLedFloodlightModuleState();
  assert.equal(state.itemKey, 'led_floodlight');
  assert.equal(state.catalogKey, 'led_floodlight');
  assert.equal(state.type, 'led-floodlight');
  assert.equal(state.widthCm, 50);
  assert.equal(state.depthCm, 20);
  assert.equal(state.heightCm, 35);
  assert.equal(Object.hasOwn(state, 'mountHeightCm'), false);
  assert.equal(state.surface.color, '#17191c');
  assert.equal(Object.hasOwn(item, 'unit'), false);

  const fromCatalog = createModuleStateFromDescriptor(catalog);
  assert.equal(fromCatalog.itemKey, 'led_floodlight');
  assert.equal(fromCatalog.catalogKey, 'led_floodlight');

  const behavior = getModuleBehavior(state);
  assert.equal(behavior.placement, 'top');
  assert.equal(behavior.wallCapacity, 'exclude');
  assert.equal(behavior.moveSnapCm, 20);
  assert.equal(behavior.rotationStepDeg, 90);

  const contract = resolveModuleContract('led_floodlight');
  assert.equal(contract.bom.mode, 'decision-required');
  assert.equal(contract.bom.source, null);
  assert.equal(contract.profile, 'top-light');

  const legacy = {
    type: 'led-floodlight',
    widthCm: 50,
    depthCm: 20,
    heightCm: 35,
    catalogKey: 'LED_FLOODLIGHT',
  };
  const restored = normalizeModuleItemState(legacy);
  assert.equal(restored.itemKey, 'led_floodlight');
  assert.equal(restored.catalogKey, 'led_floodlight');
  assert.equal(resolveModuleCatalogKey(restored), 'led_floodlight');

  const duplicate = duplicateModuleState(state);
  assert.notEqual(duplicate.id, state.id);
  assert.equal(duplicate.itemKey, 'led_floodlight');
});

test('illuminated-foam: canonical identity stays off catalog', () => {
  const item = NON_CATALOG_ITEMS['illuminated-foam'];
  assert.equal(getItem('illuminated-foam'), item);
  assert.equal(item.name, 'Işıklı Strafor / Logo');
  assert.equal(item.dimensions.widthCm, 200);
  assert.equal(item.dimensions.heightCm, 50);
  assert.equal(item.dimensions.depthCm, 3.5);
  assert.equal(item.dimensions.wallGapCm, 1.5);
  assert.equal(Object.hasOwn(item, 'unit'), false);
  assert.equal(MODULE_CATALOG['illuminated-foam'], undefined);

  const state = createIlluminatedFoamModuleState('asset-1');
  assert.equal(state.itemKey, 'illuminated-foam');
  assert.equal(Object.hasOwn(state, 'catalogKey'), false);
  assert.equal(state.type, 'illuminated-foam');
  assert.equal(state.widthCm, 200);
  assert.equal(state.heightCm, 50);
  assert.equal(state.depthCm, 3.5);
  assert.equal(state.wallGapCm, 1.5);
  assert.equal(state.haloColor, '#ffffff');
  assert.equal(state.imageAssetId, 'asset-1');

  const sized = createModuleStateFromDescriptor(
    { type: 'illuminated-foam', widthCm: 180, heightCm: 45, haloColor: '#abcdef' },
    { imageAssetId: 'asset-2' },
  );
  assert.equal(sized.itemKey, 'illuminated-foam');
  assert.equal(Object.hasOwn(sized, 'catalogKey'), false);
  assert.equal(sized.widthCm, 180);
  assert.equal(sized.heightCm, 45);

  const behavior = getModuleBehavior(state);
  assert.equal(behavior.placement, 'wall-overlay');
  assert.equal(behavior.moveSnapCm, 10);

  const contract = resolveModuleContract('illuminated-foam');
  assert.equal(contract.catalogKey, null);
  assert.equal(contract.bom.mode, 'decision-required');
  assert.equal(contract.bom.source, null);

  const legacy = { type: 'illuminated-foam', widthCm: 120, heightCm: 40, imageAssetId: 'old' };
  const restored = normalizeModuleItemState(legacy);
  assert.equal(restored.itemKey, 'illuminated-foam');
  assert.equal(Object.hasOwn(restored, 'catalogKey'), false);

  const duplicate = duplicateModuleState(state);
  assert.notEqual(duplicate.id, state.id);
  assert.equal(duplicate.itemKey, 'illuminated-foam');
});
