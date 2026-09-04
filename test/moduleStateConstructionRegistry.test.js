import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import { createModuleStateFromDescriptor } from '../src/designState.js';

test('canonical state construction registry instantiates every catalog entry', () => {
  assert.equal(MODULE_CATALOG_KEYS.length, 45);

  for (const catalogKey of MODULE_CATALOG_KEYS) {
    const descriptor = MODULE_CATALOG[catalogKey];
    const state = createModuleStateFromDescriptor(descriptor, { catalogKey });
    assert.ok(state, `${catalogKey} must resolve to a runtime module state`);
    assert.equal(state.type, descriptor.type, `${catalogKey} type must be preserved`);
    assert.equal(state.catalogKey, catalogKey, `${catalogKey} identity must be attached by the canonical constructor`);
  }
});

test('canonical state construction preserves placement only when explicitly requested', () => {
  const descriptor = {
    ...MODULE_CATALOG.wall_100,
    placement: { xCm: 100, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' },
  };

  const fresh = createModuleStateFromDescriptor(descriptor, { catalogKey: 'wall_100' });
  assert.equal(fresh.placement, undefined);

  const restored = createModuleStateFromDescriptor(descriptor, {
    catalogKey: 'wall_100',
    preservePlacement: true,
  });
  assert.deepEqual(restored.placement, descriptor.placement);
  assert.notEqual(restored.placement, descriptor.placement);
});

test('canonical registry includes the active non-catalog illuminated-foam family', () => {
  const state = createModuleStateFromDescriptor(
    { type: 'illuminated-foam', widthCm: 180, heightCm: 45, haloColor: '#abcdef' },
    { imageAssetId: 'asset-1' },
  );

  assert.ok(state);
  assert.equal(state.type, 'illuminated-foam');
  assert.equal(state.imageAssetId, 'asset-1');
  assert.equal(state.widthCm, 180);
  assert.equal(state.heightCm, 45);
});

test('main.js delegates construction instead of owning a parallel type dispatcher', async () => {
  const source = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(source, /createModuleStateFromDescriptor/);
  assert.doesNotMatch(source, /createFlatPanelModuleState/);
  assert.doesNotMatch(source, /createMiniFridgeModuleState/);
  assert.doesNotMatch(source, /createIlluminatedFoamModuleState/);
  assert.doesNotMatch(source, /if \(module\.type === 'flat-panel'\)/);
});
