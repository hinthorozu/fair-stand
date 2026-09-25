import { remapImageAssetReferences } from './imageAssetReferences.js';

function createAssetId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Clone an in-memory project snapshot with a new project id and remapped assets.
 * Source project and source asset files are not modified.
 */
export function buildSaveAsClone({
  snapshot,
  assets,
  newProjectId,
  newName,
  createAssetIdFn = createAssetId,
  now = Date.now(),
}) {
  if (!snapshot || typeof snapshot !== 'object') {
    throw new TypeError('Save As requires a project snapshot.');
  }
  if (!newProjectId) throw new TypeError('Save As requires a new project id.');
  if (!newName) throw new TypeError('Save As requires a new project name.');

  const idMap = new Map();
  const preparedAssets = [];
  for (const asset of assets || []) {
    if (!asset?.id || !asset?.blob) {
      throw new TypeError('Save As asset must include id and blob.');
    }
    const newAssetId = createAssetIdFn();
    idMap.set(asset.id, newAssetId);
    preparedAssets.push({
      id: newAssetId,
      name: asset.name,
      type: asset.type,
      createdAt: now,
      blob: asset.blob instanceof Blob
        ? new Blob([asset.blob], { type: asset.type || asset.blob.type })
        : asset.blob,
    });
  }

  const project = remapImageAssetReferences({
    ...snapshot,
    id: newProjectId,
    name: newName,
    createdAt: now,
    updatedAt: now,
  }, idMap);

  return { project, assets: preparedAssets, idMap };
}
