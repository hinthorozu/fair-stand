from pathlib import Path

scene_path = Path('src/scene3d.js')
with scene_path.open('r', encoding='utf-8', newline='') as handle:
    raw = handle.read()
newline = '\r\n' if '\r\n' in raw else '\n'
scene = raw.replace('\r\n', '\n')


def replace_once(old, new, label):
    global scene
    count = scene.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected 1 match, found {count}')
    scene = scene.replace(old, new, 1)

# Persist exact fabric ownership on the selected surfaces/modules.
old_create = """      const groupId = `fabric-${globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}`;\n      const initialFabricColor = meshes[0]?.userData.surfaceState?.color ?? '#ffffff';\n      meshes.forEach((mesh) => {\n        const state = mesh.userData.surfaceState;\n        state.fabricGroupId = groupId;\n        state.fabricColor = initialFabricColor;\n        state.fabricImageAssetId = null;\n        state.fabricImageFit = 'cover';\n      });\n"""
new_create = """      const groupId = `fabric-${globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}`;\n      const initialFabricColor = meshes[0]?.userData.surfaceState?.color ?? '#ffffff';\n      const fabricOwnerSurfaceIds = [...new Set(\n        meshes.map((mesh) => mesh.userData.surfaceId).filter(Boolean),\n      )];\n      const fabricOwnerModuleIds = [...new Set(\n        meshes.map((mesh) => mesh.userData.moduleId).filter(Boolean),\n      )];\n      meshes.forEach((mesh) => {\n        const state = mesh.userData.surfaceState;\n        state.fabricGroupId = groupId;\n        state.fabricColor = initialFabricColor;\n        state.fabricImageAssetId = null;\n        state.fabricImageFit = 'cover';\n        state.fabricOwnerSurfaceIds = [...fabricOwnerSurfaceIds];\n        state.fabricOwnerModuleIds = [...fabricOwnerModuleIds];\n      });\n"""
replace_once(old_create, new_create, 'fabric creation ownership')

# Existing explicit fabric removals must also clear ownership metadata.
old_delete_tail = "          delete surface.userData.surfaceState.fabricLightingOn;\n"
new_delete_tail = """          delete surface.userData.surfaceState.fabricLightingOn;\n          delete surface.userData.surfaceState.fabricOwnerSurfaceIds;\n          delete surface.userData.surfaceState.fabricOwnerModuleIds;\n"""
count = scene.count(old_delete_tail)
if count < 2:
    raise SystemExit(f'fabric deletion metadata: expected at least 2 matches, found {count}')
scene = scene.replace(old_delete_tail, new_delete_tail)

# Add ownership normalization and a movement lock for multi-module one-piece fabrics.
marker = "\n  function applyFabricOverlayLighting(overlay, fabricState = {}) {"
if scene.count(marker) != 1:
    raise SystemExit('fabric helper insertion marker missing or ambiguous')
helpers = r'''
  function clearFabricState(surface, { restore = true } = {}) {
    const state = surface?.userData?.surfaceState;
    if (!state) return;
    delete state.fabricGroupId;
    delete state.fabricColor;
    delete state.fabricImageAssetId;
    delete state.fabricImageFit;
    delete state.fabricLightingOn;
    delete state.fabricOwnerSurfaceIds;
    delete state.fabricOwnerModuleIds;
    if (restore) restoreFabricSurface(surface);
  }

  function normalizeFabricOwnership() {
    const groups = new Map();
    surfaceMeshes.forEach((surface) => {
      const groupId = surface?.userData?.surfaceState?.fabricGroupId;
      if (!groupId) return;
      if (!groups.has(groupId)) groups.set(groupId, []);
      groups.get(groupId).push(surface);
    });

    groups.forEach((surfaces) => {
      const firstState = surfaces[0]?.userData?.surfaceState;
      if (!firstState) return;

      const currentSurfaceIds = surfaces
        .map((surface) => surface.userData?.surfaceId)
        .filter(Boolean);
      const ownerSurfaceIds = Array.isArray(firstState.fabricOwnerSurfaceIds)
        && firstState.fabricOwnerSurfaceIds.length
        ? [...new Set(firstState.fabricOwnerSurfaceIds.filter(Boolean))]
        : [...new Set(currentSurfaceIds)];
      const ownerSurfaceSet = new Set(ownerSurfaceIds);

      // A duplicated module may clone the old fabricGroupId. It must not silently
      // become part of the original physical fabric, so strip only unexpected clones.
      surfaces
        .filter((surface) => !ownerSurfaceSet.has(surface.userData?.surfaceId))
        .forEach((surface) => clearFabricState(surface));

      const ownedSurfaces = surfaces.filter(
        (surface) => ownerSurfaceSet.has(surface.userData?.surfaceId),
      );
      const actualSurfaceSet = new Set(
        ownedSurfaces.map((surface) => surface.userData?.surfaceId).filter(Boolean),
      );

      // If an original owner surface disappeared (module deleted/type changed), the
      // one-piece fabric no longer exists physically. Dissolve it instead of leaving
      // an orphaned or shortened overlay behind.
      if (ownerSurfaceIds.some((surfaceId) => !actualSurfaceSet.has(surfaceId))) {
        ownedSurfaces.forEach((surface) => clearFabricState(surface));
        return;
      }

      const ownerModuleIds = [...new Set(
        ownedSurfaces.map((surface) => surface.userData?.moduleId).filter(Boolean),
      )];
      ownedSurfaces.forEach((surface) => {
        const state = surface.userData.surfaceState;
        state.fabricOwnerSurfaceIds = [...ownerSurfaceIds];
        state.fabricOwnerModuleIds = [...ownerModuleIds];
      });
    });
  }

  function getFabricMoveLock(moduleId) {
    if (!moduleId) return null;
    const groupIds = new Set(
      surfaceMeshes
        .filter((surface) => surface.userData?.moduleId === moduleId)
        .map((surface) => surface.userData?.surfaceState?.fabricGroupId)
        .filter(Boolean),
    );

    for (const groupId of groupIds) {
      const moduleIds = new Set(
        surfaceMeshes
          .filter((surface) => surface.userData?.surfaceState?.fabricGroupId === groupId)
          .map((surface) => surface.userData?.moduleId)
          .filter(Boolean),
      );
      if (moduleIds.size > 1) return { groupId, moduleIds: [...moduleIds] };
    }
    return null;
  }
'''
scene = scene.replace(marker, '\n' + helpers.rstrip() + marker, 1)

# Normalize stale/duplicated fabric state before creating visual overlays.
replace_once(
    """  function rebuildFabricOverlays() {\n    clearFabricOverlays();\n\n    const groups = new Map();\n""",
    """  function rebuildFabricOverlays() {\n    clearFabricOverlays();\n    normalizeFabricOwnership();\n\n    const groups = new Map();\n""",
    'normalize before overlays',
)

# Overlay parenting is per fabric: one-module fabric becomes a real child of that module.
replace_once(
    """    if (!groups.size) return;\n    wallRoot.updateWorldMatrix(true, true);\n    const wallQuaternion = wallRoot.getWorldQuaternion(new THREE.Quaternion());\n    const inverseWallQuaternion = wallQuaternion.clone().invert();\n\n    groups.forEach((surfaces, groupId) => {\n""",
    """    if (!groups.size) return;\n\n    groups.forEach((surfaces, groupId) => {\n""",
    'remove wall-root-only overlay transform',
)

replace_once(
    """      const first = surfaces[0];\n      first.updateWorldMatrix(true, false);\n      const surfaceQuaternion = first.getWorldQuaternion(new THREE.Quaternion());\n""",
    """      const moduleIds = new Set(\n        surfaces.map((surface) => surface.userData?.moduleId).filter(Boolean),\n      );\n      const [singleModuleId] = moduleIds.size === 1 ? moduleIds : [];\n      const singleModuleGroup = singleModuleId\n        ? wallRoot.children.find((group) => (\n            group.userData?.moduleState?.id === singleModuleId\n            || group.userData?.moduleId === singleModuleId\n          ))\n        : null;\n      const overlayParent = singleModuleGroup ?? wallRoot;\n      overlayParent.updateWorldMatrix(true, true);\n      const inverseOverlayParentQuaternion = overlayParent\n        .getWorldQuaternion(new THREE.Quaternion())\n        .invert();\n\n      const first = surfaces[0];\n      first.updateWorldMatrix(true, false);\n      const surfaceQuaternion = first.getWorldQuaternion(new THREE.Quaternion());\n""",
    'choose fabric overlay parent',
)

replace_once(
    """      overlay.position.copy(wallRoot.worldToLocal(centerWorld.clone()));\n      overlay.quaternion.copy(inverseWallQuaternion.clone().multiply(surfaceQuaternion));\n""",
    """      overlay.position.copy(overlayParent.worldToLocal(centerWorld.clone()));\n      overlay.quaternion.copy(inverseOverlayParentQuaternion.clone().multiply(surfaceQuaternion));\n""",
    'fabric overlay local transform',
)
replace_once(
    """      wallRoot.add(overlay);\n      fabricOverlayMeshes.push(overlay);\n""",
    """      overlayParent.add(overlay);\n      fabricOverlayMeshes.push(overlay);\n""",
    'fabric overlay parent add',
)

# A one-piece fabric spanning multiple modules is a rigid ownership group: do not
# allow one member module to be dragged away from the fabric.
replace_once(
    """    if (!moduleState) {\n      handleSurfaceSelectionAt(event.clientX, event.clientY, false);\n      return;\n    }\n\n    controls.enabled = false;\n""",
    """    if (!moduleState) {\n      handleSurfaceSelectionAt(event.clientX, event.clientY, false);\n      return;\n    }\n\n    const fabricMoveLock = getFabricMoveLock(moduleState.id);\n    if (fabricMoveLock) {\n      handleSurfaceSelectionAt(event.clientX, event.clientY, false, moduleState.id);\n      showPlacementFeedback('Bu modül tek parça beze bağlı. Taşımak için önce Bezi kaldır.', {\n        clientX: event.clientX,\n        clientY: event.clientY,\n        durationMs: 1800,\n      });\n      event.preventDefault();\n      event.stopImmediatePropagation();\n      return;\n    }\n\n    controls.enabled = false;\n""",
    'block drag for multi-module fabric',
)

replace_once(
    """    if (!moduleGroup || !moduleState?.placement) return { handled: false, ok: false };\n\n    const stepDeg = getModuleRotationStepDeg(moduleState);\n""",
    """    if (!moduleGroup || !moduleState?.placement) return { handled: false, ok: false };\n\n    if (getFabricMoveLock(moduleState.id)) {\n      const message = 'Bu modül tek parça beze bağlı. Döndürmek için önce Bezi kaldır.';\n      showPlacementFeedback(message, { durationMs: 1800 });\n      return { handled: true, ok: false, message };\n    }\n\n    const stepDeg = getModuleRotationStepDeg(moduleState);\n""",
    'block rotation for multi-module fabric',
)

replace_once(
    """      if (!moduleGroup || !moduleState?.placement || !stageLayout) return;\n\n      event.preventDefault();\n      const stepCm = isTopFixtureType(moduleState.type)\n""",
    """      if (!moduleGroup || !moduleState?.placement || !stageLayout) return;\n\n      event.preventDefault();\n      if (getFabricMoveLock(moduleState.id)) {\n        showPlacementFeedback('Bu modül tek parça beze bağlı. Taşımak için önce Bezi kaldır.', {\n          durationMs: 1800,\n        });\n        return;\n      }\n      const stepCm = isTopFixtureType(moduleState.type)\n""",
    'block keyboard move for multi-module fabric',
)

with scene_path.open('w', encoding='utf-8', newline='') as handle:
    handle.write(scene.replace('\n', newline))

# Source-contract regression test. This is intentionally static because Three.js scene
# construction depends on DOM/WebGL, while these ownership invariants are source-level.
test_path = Path('test/fabricModuleOwnership.test.js')
test_path.write_text("""import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport fs from 'node:fs';\n\nconst scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n\ntest('fabric records its owning surfaces and modules', () => {\n  assert.match(scene, /state\\.fabricOwnerSurfaceIds = \\[\\.\\.\\.fabricOwnerSurfaceIds\\]/);\n  assert.match(scene, /state\\.fabricOwnerModuleIds = \\[\\.\\.\\.fabricOwnerModuleIds\\]/);\n  assert.match(scene, /normalizeFabricOwnership\\(\\);/);\n});\n\ntest('single-module fabric overlay is parented to its module', () => {\n  assert.match(scene, /const overlayParent = singleModuleGroup \\?\\? wallRoot/);\n  assert.match(scene, /overlayParent\\.worldToLocal\\(centerWorld\\.clone\\(\\)\\)/);\n  assert.match(scene, /overlayParent\\.add\\(overlay\\)/);\n});\n\ntest('multi-module one-piece fabric blocks individual movement', () => {\n  assert.match(scene, /function getFabricMoveLock\\(moduleId\\)/);\n  assert.match(scene, /if \\(moduleIds\\.size > 1\\) return/);\n  assert.match(scene, /Taşımak için önce Bezi kaldır/);\n  assert.match(scene, /Döndürmek için önce Bezi kaldır/);\n});\n\ntest('fabric ownership metadata is cleared when fabric is removed', () => {\n  assert.match(scene, /delete state\\.fabricOwnerSurfaceIds/);\n  assert.match(scene, /delete state\\.fabricOwnerModuleIds/);\n});\n""", encoding='utf-8')

print('fabric module ownership patch applied')
