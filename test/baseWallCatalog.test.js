import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULE_CATALOG } from '../src/catalog.js';
import { createBaseWallModuleState } from '../src/designState.js';

test('Panel Bazalı 100 150 200 draggable catalog entries exist', () => {
  const sidebar = fs.readFileSync(new URL('../src/moduleDragSidebar.js', import.meta.url), 'utf8');
  for (const width of [100, 150, 200]) {
    assert.equal(MODULE_CATALOG[`wall_base_${width}`].type, 'base-wall');
    assert.ok(sidebar.includes(`'wall_base_${width}'`));
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
