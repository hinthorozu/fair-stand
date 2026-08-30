import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import { createBarStoolModuleState } from '../src/designState.js';

test('Bar Taburesi katalog ve state kimliği sabittir', () => {
  const item = MODULE_CATALOG.furniture_bar_stool_classic;
  assert.ok(item);
  assert.equal(item.type, 'bar-stool');
  assert.equal(item.label, 'Bar Taburesi');
  assert.equal(item.widthCm, 60);
  assert.equal(item.depthCm, 55);
  assert.equal(item.heightCm, 121);
  assert.ok(MODULE_CATALOG_KEYS.includes('furniture_bar_stool_classic'));

  const state = createBarStoolModuleState();
  assert.equal(state.type, 'bar-stool');
  assert.equal(state.widthCm, 60);
  assert.equal(state.depthCm, 55);
  assert.equal(state.heightCm, 121);
});
