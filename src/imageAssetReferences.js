const IMAGE_ASSET_REFERENCE_KEYS = new Set(['imageAssetId', 'fabricImageAssetId']);

function walkImageAssetReferences(value, assetId, visitor) {
  if (!assetId || value == null || typeof value !== 'object') return;

  if (Array.isArray(value)) {
    value.forEach((item) => walkImageAssetReferences(item, assetId, visitor));
    return;
  }

  Object.entries(value).forEach(([key, item]) => {
    if (IMAGE_ASSET_REFERENCE_KEYS.has(key) && item === assetId) {
      visitor(value, key);
      return;
    }
    walkImageAssetReferences(item, assetId, visitor);
  });
}

export function countImageAssetReferences(value, assetId) {
  let count = 0;
  walkImageAssetReferences(value, assetId, () => { count += 1; });
  return count;
}

export function clearImageAssetReferences(value, assetId) {
  let count = 0;
  walkImageAssetReferences(value, assetId, (owner, key) => {
    owner[key] = null;
    if (key === 'fabricImageAssetId') owner.fabricImageFit = 'cover';
    count += 1;
  });
  return count;
}
