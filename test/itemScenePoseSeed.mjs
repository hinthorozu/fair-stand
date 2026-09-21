const CATALOG_CEILING_CM = 350;
const SHORT_UP_HEIGHT_CM = Object.freeze({
  'short-up-1': 50,
  'short-up-2': 100,
});

export function applyItemScenePose(item) {
  if (item.type === 'profile') {
    const thickness = item.dimensions?.thicknessCm ?? item.sceneDimensions?.depthCm ?? 8;
    item.sceneDimensions = { ...(item.sceneDimensions ?? {}), heightCm: thickness };
    item.defaultZCm = CATALOG_CEILING_CM - thickness;
  }
  if (item.type === 'upright') {
    const thickness = item.dimensions?.thicknessCm ?? item.sceneDimensions?.depthCm ?? 8;
    const length = item.dimensions?.lengthCm;
    const scene = { ...(item.sceneDimensions ?? {}) };
    if (scene.widthCm == null) scene.widthCm = thickness;
    if (scene.depthCm == null) scene.depthCm = thickness;
    if (scene.heightCm == null && length != null) scene.heightCm = length;
    item.sceneDimensions = scene;
  }
  const shortUpHeight = SHORT_UP_HEIGHT_CM[item.variant];
  if (shortUpHeight != null) {
    item.sceneDimensions = { ...(item.sceneDimensions ?? {}), heightCm: shortUpHeight };
    item.defaultZCm = CATALOG_CEILING_CM - shortUpHeight;
  }
  return item;
}
