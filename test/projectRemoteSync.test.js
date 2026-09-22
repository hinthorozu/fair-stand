import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  clearProjectAssetSyncState,
  isAssetSynced,
  markAssetDirty,
  markAssetSynced,
  markProjectAssetsSynced,
} from '../src/projectRemote.js';

const remoteSource = readFileSync(new URL('../src/projectRemote.js', import.meta.url), 'utf8');

function blobAsset(id, { size = 12, name = 'logo.png', type = 'image/png' } = {}) {
  return {
    id,
    name,
    type,
    blob: { size },
  };
}

test('projectRemote defaults saveProject asset sync to dirty-only', () => {
  assert.match(remoteSource, /syncAssets = 'dirty'/);
  assert.match(remoteSource, /mode === 'all' \|\| !isAssetSynced/);
  assert.match(remoteSource, /fair-stand\.asset-sync\.v1/);
});

test('asset sync fingerprint skips unchanged uploads and dirty forces re-upload', () => {
  const projectId = 'project-sync-a';
  const asset = blobAsset('asset-1', { size: 100, name: 'a.webp', type: 'image/webp' });

  clearProjectAssetSyncState(projectId);
  assert.equal(isAssetSynced(projectId, asset), false);

  markAssetSynced(projectId, asset);
  assert.equal(isAssetSynced(projectId, asset), true);

  // Same id, changed bytes → needs upload again
  const changed = blobAsset('asset-1', { size: 200, name: 'a.webp', type: 'image/webp' });
  assert.equal(isAssetSynced(projectId, changed), false);

  markAssetSynced(projectId, changed);
  assert.equal(isAssetSynced(projectId, changed), true);

  markAssetDirty(projectId, 'asset-1');
  assert.equal(isAssetSynced(projectId, changed), false);

  clearProjectAssetSyncState(projectId);
});

test('markProjectAssetsSynced bulk-marks server-hydrated assets', () => {
  const projectId = 'project-sync-b';
  const assets = [
    blobAsset('a1', { size: 10 }),
    blobAsset('a2', { size: 20, name: 'b.png' }),
  ];

  clearProjectAssetSyncState(projectId);
  markProjectAssetsSynced(projectId, assets);

  assert.equal(isAssetSynced(projectId, assets[0]), true);
  assert.equal(isAssetSynced(projectId, assets[1]), true);
  assert.equal(isAssetSynced(projectId, blobAsset('a3')), false);

  clearProjectAssetSyncState(projectId);
  assert.equal(isAssetSynced(projectId, assets[0]), false);
});
