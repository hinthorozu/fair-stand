const CATALOG_CEILING_CM = 350;
const WALL_SHORT_HEIGHT_CM = Object.freeze({
  'wall-short-1': 50,
  'wall-short-2': 100,
});

export function applyItemScenePose(item) {
  if (item.type === 'profile') {
    const crossSection = item.dimensions?.heightCm
      ?? item.dimensions?.depthCm
      ?? item.sceneDimensions?.depthCm
      ?? 8;
    item.sceneDimensions = { ...(item.sceneDimensions ?? {}), heightCm: crossSection };
    item.defaultZCm = CATALOG_CEILING_CM - crossSection;
  }
  if (item.type === 'upright') {
    const crossSection = item.dimensions?.widthCm
      ?? item.dimensions?.depthCm
      ?? item.sceneDimensions?.depthCm
      ?? 8;
    const height = item.dimensions?.heightCm;
    const scene = { ...(item.sceneDimensions ?? {}) };
    if (scene.widthCm == null) scene.widthCm = crossSection;
    if (scene.depthCm == null) scene.depthCm = item.dimensions?.depthCm ?? crossSection;
    if (scene.heightCm == null && height != null) scene.heightCm = height;
    item.sceneDimensions = scene;
  }
  const wallShortHeight = WALL_SHORT_HEIGHT_CM[item.variant];
  if (wallShortHeight != null) {
    item.sceneDimensions = { ...(item.sceneDimensions ?? {}), heightCm: wallShortHeight };
    item.defaultZCm = CATALOG_CEILING_CM - wallShortHeight;
  }
  return item;
}
