import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import { createBarStool2ModuleState } from '../src/designState.js';

test('Tabure 2 katalog ve state kimliği sabittir', () => {
  const item = MODULE_CATALOG.furniture_bar_stool_2;
  assert.ok(item);
  assert.equal(item.type, 'bar-stool-2');
  assert.equal(item.label, 'Tabure 2');
  assert.equal(item.widthCm, 60);
  assert.equal(item.depthCm, 55);
  assert.equal(item.heightCm, 121);
  assert.ok(MODULE_CATALOG_KEYS.includes('furniture_bar_stool_2'));

  const state = createBarStool2ModuleState();
  assert.equal(state.type, 'bar-stool-2');
  assert.equal(state.widthCm, 60);
  assert.equal(state.depthCm, 55);
  assert.equal(state.heightCm, 121);
});
