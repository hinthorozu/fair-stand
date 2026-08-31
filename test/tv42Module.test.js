import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULE_CATALOG } from '../src/catalog.js';
import { createTvModuleState } from '../src/designState.js';
import { getModuleGhostBehavior } from '../src/moduleBehavior.js';

test('TV 42 catalog and state use one shared GLB-scaled 93.0 x 52.3 screen', () => {
  const item = MODULE_CATALOG.TV_42;
  assert.equal(item.type, 'tv');
  assert.equal(item.screenWidthCm, 93);
  assert.equal(item.screenHeightCm, 52.3);
  const state = createTvModuleState(42);
  assert.equal(state.widthCm, 100);
  assert.equal(state.screenWidthCm, 93);
  assert.equal(state.screenHeightCm, 52.3);
});

test('TV module has explicit ghost behavior contract', () => {
  assert.equal(getModuleGhostBehavior({ type: 'tv' }).mode, 'proxy');
});

test('TV renderer loads shared tv.glb and hides receiver meshes', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /models\/tv\.glb/);
  assert.match(source, /new Set\(\['Object_4', 'Object_5'\]\)/);
  assert.match(source, /KYROX/);
});
