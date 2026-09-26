import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getCatalogItem, listCatalogGroups } from '../src/catalog.js';
import { createBoxBlockModuleState, createModuleStateFromCatalogKey } from '../src/designState.js';
import {
  getModuleBehavior,
  getModuleDefaultRotationDeg,
  getModuleRotationStepDeg,
} from '../src/moduleBehavior.js';
import { resolveItemDefaultZCm } from '../src/items.js';

const KEY = 'box_block';

test('box_block is cataloged under Panel Ek Modül with free box-block type', () => {
  const descriptor = getCatalogItem(KEY);
  assert.ok(descriptor);
  assert.equal(descriptor.label, 'Kutu blok');

  const group = listCatalogGroups().find((entry) => entry.label === 'Panel Ek Modül');
  assert.ok(group?.keys.includes(KEY));
  assert.equal(
    listCatalogGroups().flatMap((entry) => entry.keys).filter((key) => key === KEY).length,
    1,
  );
});

test('box-block state reads WDH opacity rotation and defaultZ from item DB fields', () => {
  const state = createModuleStateFromCatalogKey(KEY);
  assert.ok(state);
  assert.equal(state.itemKey, KEY);
  assert.equal(state.type, 'box-block');
  assert.deepEqual([state.widthCm, state.depthCm, state.heightCm], [100, 50, 50]);
  assert.equal(state.opacity, 0.85);
  assert.equal(getModuleBehavior(state).placement, 'free');
  assert.equal(getModuleRotationStepDeg(state), 90);
  assert.equal(getModuleDefaultRotationDeg(state), 0);
  assert.equal(resolveItemDefaultZCm(state), 0);
});

test('createBoxBlockModuleState accepts instance WDH opacity overrides', () => {
  const state = createBoxBlockModuleState({
    itemKey: KEY,
    widthCm: 80,
    depthCm: 40,
    heightCm: 30,
    opacity: 0.4,
  });
  assert.ok(state);
  assert.deepEqual([state.widthCm, state.depthCm, state.heightCm], [80, 40, 30]);
  assert.equal(state.opacity, 0.4);
});

test('createBoxBlockModule renderer is centered BoxGeometry with opacity', () => {
  const source = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const start = source.indexOf('function createBoxBlockModule');
  const end = source.indexOf('function createIlluminatedFoamModule');
  assert.ok(start >= 0 && end > start);
  const body = source.slice(start, end);
  assert.match(body, /new THREE\.BoxGeometry\(widthM, heightM, depthM\)/);
  assert.match(body, /transparent:\s*opacity < 1/);
  assert.match(body, /mesh\.position\.set\(0,\s*heightM \/ 2,\s*0\)/);
});
