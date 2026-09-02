from pathlib import Path

scene_path = Path('src/scene3d.js')
main_path = Path('src/main.js')
scene = scene_path.read_text(encoding='utf-8')
main = main_path.read_text(encoding='utf-8')

scene_needle = """      mesh.material.needsUpdate = true;\n    });\n  }\n\n  renderer.domElement.addEventListener('contextmenu', (event) => {\n"""
scene_replacement = """      mesh.material.needsUpdate = true;\n    });\n    if (fabricGroupIds.size) rebuildFabricOverlays();\n  }\n\n  function clearImageAssetById(assetId) {\n    if (!assetId) return 0;\n\n    const directSurfaces = surfaceMeshes.filter(\n      (surface) => surface.userData?.surfaceState?.imageAssetId === assetId,\n    );\n    const fabricGroupIds = new Set(\n      surfaceMeshes\n        .filter((surface) => surface.userData?.surfaceState?.fabricImageAssetId === assetId)\n        .map((surface) => surface.userData?.surfaceState?.fabricGroupId)\n        .filter(Boolean),\n    );\n    const fabricSurfaces = surfaceMeshes.filter(\n      (surface) => fabricGroupIds.has(surface.userData?.surfaceState?.fabricGroupId),\n    );\n    const targets = [...new Set([...directSurfaces, ...fabricSurfaces])];\n    if (!targets.length) return 0;\n\n    clearImage(targets);\n    renderer.render(scene, camera);\n    return targets.length;\n  }\n\n  renderer.domElement.addEventListener('contextmenu', (event) => {\n"""
if scene_needle not in scene:
    raise SystemExit('scene clearImage insertion point not found')
scene = scene.replace(scene_needle, scene_replacement, 1)

return_needle = """    applyRectImageAsset,\n    clearImage,\n    previewCatalogModuleDrag,\n"""
return_replacement = """    applyRectImageAsset,\n    clearImage,\n    clearImageAssetById,\n    previewCatalogModuleDrag,\n"""
if return_needle not in scene:
    raise SystemExit('scene return insertion point not found')
scene = scene.replace(return_needle, return_replacement, 1)

main_needle = """  if (usageCount > 0) {\n    clearImageAssetReferences(currentModules, assetId);\n    clearImageAssetReferences(currentStand, assetId);\n    if (currentStand) rebuildWall({ resetView: false });\n  }\n"""
main_replacement = """  if (usageCount > 0) {\n    // Canlı sahneyi önce Kaldır davranışıyla temizle; blob silme/persist beklenmez.\n    scene3d.clearImageAssetById(assetId);\n    clearImageAssetReferences(currentModules, assetId);\n    clearImageAssetReferences(currentStand, assetId);\n  }\n"""
if main_needle not in main:
    raise SystemExit('main delete usage block not found')
main = main.replace(main_needle, main_replacement, 1)

scene_path.write_text(scene, encoding='utf-8')
main_path.write_text(main, encoding='utf-8')

Path('test/imageAssetLiveDelete.test.js').write_text("""import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport fs from 'node:fs';\n\nconst scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\nconst main = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');\n\ntest('asset deletion clears matching live panel and fabric textures immediately', () => {\n  assert.match(scene, /function clearImageAssetById\(assetId\)/);\n  assert.match(scene, /surfaceState\?\.imageAssetId === assetId/);\n  assert.match(scene, /surfaceState\?\.fabricImageAssetId === assetId/);\n  assert.match(scene, /clearImage\(targets\);/);\n  assert.match(scene, /renderer\.render\(scene, camera\);/);\n  assert.match(scene, /clearImageAssetById,/);\n});\n\ntest('clearImage rebuilds fabric overlays after removing a fabric image', () => {\n  const clearStart = scene.indexOf('function clearImage(meshOrMeshes)');\n  const clearEnd = scene.indexOf("renderer.domElement.addEventListener('contextmenu'", clearStart);\n  const clearBlock = scene.slice(clearStart, clearEnd);\n  assert.match(clearBlock, /if \(fabricGroupIds\.size\) rebuildFabricOverlays\(\);/);\n});\n\ntest('library deletion clears the live scene before persisted references', () => {\n  const deleteStart = main.indexOf('async function requestDeleteImageAsset(assetId)');\n  const deleteEnd = main.indexOf('function setActiveAsset', deleteStart);\n  const block = main.slice(deleteStart, deleteEnd);\n  const liveIndex = block.indexOf('scene3d.clearImageAssetById(assetId);');\n  const stateIndex = block.indexOf('clearImageAssetReferences(currentModules, assetId);');\n  assert.ok(liveIndex >= 0);\n  assert.ok(stateIndex > liveIndex);\n  assert.doesNotMatch(block, /rebuildWall\(\{ resetView: false \}\)/);\n});\n""", encoding='utf-8')
