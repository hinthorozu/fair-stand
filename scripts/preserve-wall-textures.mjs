import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const stateAnchor = '  let placementFeedbackTimer = null;\n';
const statePatch = `  let placementFeedbackTimer = null;\n  // Structural wall rebuilds (insert/delete/reorder) reuse the already uploaded GPU\n  // textures. This prevents branded panels from flashing blank while TextureLoader\n  // reloads the same assets after every catalog operation. Keys prefer the persistent\n  // surface-state object, so inserting a module before another does not depend on index.\n  let rebuildTextureTransfer = null;\n\n  function getRebuildTextureKey(mesh) {\n    const surfaceState = mesh?.userData?.surfaceState;\n    if (surfaceState && typeof surfaceState === 'object') return surfaceState;\n    return mesh?.userData?.surfaceId ?? null;\n  }\n\n  function retainWallTexturesForRebuild() {\n    const retained = new Map();\n    surfaceMeshes.forEach((surface) => {\n      const texture = surface?.material?.map;\n      const key = getRebuildTextureKey(surface);\n      if (!texture || !key) return;\n      retained.set(key, texture);\n      // disposeWall() owns the old materials. Detach maps first so disposing the old\n      // material does not also destroy a texture that the replacement mesh will reuse.\n      surface.material.map = null;\n    });\n    rebuildTextureTransfer = retained;\n  }\n\n  function disposeUnusedRebuildTextures() {\n    if (!rebuildTextureTransfer) return;\n    rebuildTextureTransfer.forEach((texture) => texture?.dispose?.());\n    rebuildTextureTransfer = null;\n  }\n`;

if (!source.includes('function retainWallTexturesForRebuild()')) {
  if (!source.includes(stateAnchor)) throw new Error('texture-transfer state anchor not found');
  source = source.replace(stateAnchor, statePatch);
}

const buildAnchor = `    clearPlacementDrag();\n    disposeWall({ notify: false, keepAnchor: true });\n\n    const totalWidth = modules.reduce((sum, module) => sum + module.widthCm / 100, 0);`;
const buildPatch = `    clearPlacementDrag();\n    retainWallTexturesForRebuild();\n    disposeWall({ notify: false, keepAnchor: true });\n\n    const totalWidth = modules.reduce((sum, module) => sum + module.widthCm / 100, 0);`;
if (!source.includes('retainWallTexturesForRebuild();\n    disposeWall({ notify: false, keepAnchor: true });')) {
  if (!source.includes(buildAnchor)) throw new Error('buildWall rebuild anchor not found');
  source = source.replace(buildAnchor, buildPatch);
}

const buildEndAnchor = `    if (resetView) {\n      if (hasMultiEdgePlacement && stageLayout) resetStageView();\n      else resetDefaultView(totalWidth);\n    }\n    notifySelection();\n    return { totalWidth, surfaceCount: surfaceMeshes.length };`;
const buildEndPatch = `    if (resetView) {\n      if (hasMultiEdgePlacement && stageLayout) resetStageView();\n      else resetDefaultView(totalWidth);\n    }\n    // Any retained texture left here belonged to a deleted surface/module. Reused\n    // textures are removed from the transfer map by applyStoredImage().\n    disposeUnusedRebuildTextures();\n    notifySelection();\n    return { totalWidth, surfaceCount: surfaceMeshes.length };`;
if (!source.includes('// Any retained texture left here belonged to a deleted surface/module.')) {
  if (!source.includes(buildEndAnchor)) throw new Error('buildWall end anchor not found');
  source = source.replace(buildEndAnchor, buildEndPatch);
}

const storedImageAnchor = `  function applyStoredImage(mesh) {\n    if (mesh.userData.acceptsImage === false) return;\n    const assetId = mesh.userData.surfaceState?.imageAssetId;\n    if (assetId) loadImageOnSurface(mesh, assetId);\n  }`;
const storedImagePatch = `  function applyStoredImage(mesh) {\n    if (mesh.userData.acceptsImage === false) return;\n\n    const transferKey = getRebuildTextureKey(mesh);\n    const retainedTexture = transferKey ? rebuildTextureTransfer?.get(transferKey) : null;\n    if (retainedTexture && mesh.material) {\n      mesh.material.map = retainedTexture;\n      mesh.material.color.set(0xffffff);\n      mesh.material.needsUpdate = true;\n      rebuildTextureTransfer.delete(transferKey);\n      return;\n    }\n\n    const assetId = mesh.userData.surfaceState?.imageAssetId;\n    if (assetId) loadImageOnSurface(mesh, assetId);\n  }`;
if (!source.includes('const retainedTexture = transferKey ? rebuildTextureTransfer?.get(transferKey) : null;')) {
  if (!source.includes(storedImageAnchor)) throw new Error('applyStoredImage anchor not found');
  source = source.replace(storedImageAnchor, storedImagePatch);
}

fs.writeFileSync(path, source);
