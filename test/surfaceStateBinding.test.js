import test from 'node:test';
import assert from 'node:assert/strict';

import { applyColorOverride } from '../src/designState.js';
import {
  applyGlassOverride,
  bindRendererSurfaceState,
  clearFabricFields,
  cloneSurfaceStateForRenderer,
  syncRendererSurfaceState,
} from '../src/surfaceStateBinding.js';

test('renderer kopyası kalıcı yüzey nesnesinden ayrıdır', () => {
  const persistent = {
    id: 'surface-1',
    color: '#ffffff',
    imageAssetId: null,
    imageTransform: { mode: 'single', offsetX: 0, offsetY: 0, repeatX: 1, repeatY: 1, rotation: 0 },
  };
  const bound = bindRendererSurfaceState(persistent);

  assert.equal(bound.persistentSurfaceState, persistent);
  assert.notEqual(bound.surfaceState, persistent);
  assert.deepEqual(bound.surfaceState, persistent);

  bound.surfaceState.color = '#ff0000';
  assert.equal(persistent.color, '#ffffff');
});

test('kalıcı yazı kopyaya senkronlanır; kopya yazısı kalıcıyı değiştirmez', () => {
  const persistent = {
    id: 'surface-2',
    color: '#ffffff',
    imageAssetId: 'asset-a',
    imageTransform: { mode: 'single', offsetX: 0, offsetY: 0, repeatX: 1, repeatY: 1, rotation: 0 },
  };
  const copy = cloneSurfaceStateForRenderer(persistent);
  applyColorOverride(persistent, '#112233');
  syncRendererSurfaceState(copy, persistent);

  assert.equal(persistent.color, '#112233');
  assert.equal(persistent.imageAssetId, null);
  assert.equal(copy.color, '#112233');
  assert.equal(copy.imageAssetId, null);
  assert.notEqual(copy, persistent);

  copy.color = '#abcdef';
  assert.equal(persistent.color, '#112233');
});

test('cam ve kumaş alanları kalıcı nesnede yazılıp kopyadan silinebilir', () => {
  const persistent = { id: 'surface-3', color: '#ffffff' };
  const copy = cloneSurfaceStateForRenderer(persistent);
  applyGlassOverride(persistent, true);
  persistent.fabricGroupId = 'fabric-1';
  syncRendererSurfaceState(copy, persistent);
  assert.equal(copy.isGlass, true);
  assert.equal(copy.fabricGroupId, 'fabric-1');

  clearFabricFields(persistent);
  applyGlassOverride(persistent, false);
  syncRendererSurfaceState(copy, persistent);
  assert.equal(copy.isGlass, false);
  assert.equal('fabricGroupId' in copy, false);
});
