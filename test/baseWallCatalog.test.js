import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import { createBaseWallModuleState } from '../src/designState.js';

test('Panel Bazalı 100 150 200 catalog entries exist in shared catalog keys', () => {
  for (const width of [100, 150, 200]) {
    const moduleKey = `wall_base_${width}`;
    assert.equal(MODULE_CATALOG[moduleKey].type, 'base-wall');
    assert.ok(MODULE_CATALOG_KEYS.includes(moduleKey));
  }
});

test('Panel Bazalı state carries seven wall panels plus three baza faces', () => {
  const state = createBaseWallModuleState(100);
  assert.equal(state.type, 'base-wall');
  assert.equal(state.depthCm, 50);
  assert.equal(state.heightCm, 350);
  assert.equal(state.strips.length, 7);
  assert.deepEqual(Object.keys(state.faces).sort(), ['front', 'left', 'right']);
});
