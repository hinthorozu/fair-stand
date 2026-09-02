import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { clearImageAssetReferences, countImageAssetReferences } from '../src/imageAssetReferences.js';

test('image asset reference helper finds normal panel and fabric assignments', () => {
  const state = {
    modules: [
      { strips: [{ imageAssetId: 'asset-a' }, { imageAssetId: 'asset-b' }] },
      { strips: [{ fabricImageAssetId: 'asset-a', fabricImageFit: 'contain' }] },
    ],
  };
  assert.equal(countImageAssetReferences(state, 'asset-a'), 2);
  assert.equal(countImageAssetReferences(state, 'asset-b'), 1);
});

test('clearing one image asset removes only that asset assignments', () => {
  const state = {
    modules: [
      { strips: [{ imageAssetId: 'asset-a', imageTransform: { fit: 'cover' } }] },
      { strips: [{ imageAssetId: 'asset-b' }, { fabricImageAssetId: 'asset-a', fabricImageFit: 'contain' }] },
    ],
  };
  assert.equal(clearImageAssetReferences(state, 'asset-a'), 2);
  assert.equal(state.modules[0].strips[0].imageAssetId, null);
  assert.equal(state.modules[1].strips[0].imageAssetId, 'asset-b');
  assert.equal(state.modules[1].strips[1].fabricImageAssetId, null);
  assert.equal(state.modules[1].strips[1].fabricImageFit, 'cover');
});

test('image library exposes right-click and focused Delete through one safe delete path', () => {
  const main = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const store = fs.readFileSync(new URL('../src/assetStore.js', import.meta.url), 'utf8');

  assert.match(main, /button\.addEventListener\('contextmenu'/);
  assert.match(main, /openAssetContextMenu\(asset\.id, event\.clientX, event\.clientY\)/);
  assert.match(main, /if \(event\.key !== 'Delete'\) return;/);
  assert.match(main, /event\.stopImmediatePropagation\(\)/);
  assert.match(main, /void requestDeleteImageAsset\(assetId\)/);
  assert.match(main, /şu anda sahnede bir veya daha fazla yere atanmış/);
  assert.match(main, /silersen atandığı panel\/bezlerden de kaldırılacak/);
  assert.match(store, /export async function deleteImageAsset\(projectId, assetId\)/);
});
