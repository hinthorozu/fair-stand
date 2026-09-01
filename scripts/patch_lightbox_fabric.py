from pathlib import Path


def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'{label} marker not found')
    return text.replace(old, new, 1)

# --- module context menu ---
menu_path = Path('src/moduleContextMenu.js')
menu = menu_path.read_text(encoding='utf-8')
menu = replace_once(
    menu,
    """  onGlassModeChange,\n  getShelfLightingState,\n""",
    """  onGlassModeChange,\n  onFabricModeChange,\n  getShelfLightingState,\n""",
    'menu callback signature',
)
menu = replace_once(
    menu,
    """    <button type=\"button\" data-module-action=\"toggle-glass\" hidden>Cam panele çevir</button>\n    <button type=\"button\" data-module-action=\"toggle-shelf-light\" hidden>Raf altı aydınlatmayı aç</button>\n""",
    """    <button type=\"button\" data-module-action=\"toggle-glass\" hidden>Cam panele çevir</button>\n    <button type=\"button\" data-module-action=\"toggle-fabric\" hidden>Beze çevir</button>\n    <button type=\"button\" data-module-action=\"toggle-shelf-light\" hidden>Raf altı aydınlatmayı aç</button>\n""",
    'fabric button html',
)
menu = replace_once(
    menu,
    """  const glassModeButton = menu.querySelector('[data-module-action=\"toggle-glass\"]');\n  const shelfLightingButton = menu.querySelector('[data-module-action=\"toggle-shelf-light\"]');\n""",
    """  const glassModeButton = menu.querySelector('[data-module-action=\"toggle-glass\"]');\n  const fabricModeButton = menu.querySelector('[data-module-action=\"toggle-fabric\"]');\n  const shelfLightingButton = menu.querySelector('[data-module-action=\"toggle-shelf-light\"]');\n""",
    'fabric button query',
)
menu = replace_once(
    menu,
    """    glassModeButton.textContent = context.isGlass\n      ? 'Normal panele çevir'\n      : 'Cam panele çevir';\n\n    const isShelf = (context.moduleType ?? context.type) === 'shelf';\n""",
    """    glassModeButton.textContent = context.isGlass\n      ? 'Normal panele çevir'\n      : 'Cam panele çevir';\n\n    fabricModeButton.hidden = !context.supportsFabric;\n    fabricModeButton.textContent = context.isFabric\n      ? 'Bezden çıkar'\n      : 'Beze çevir';\n\n    const isShelf = (context.moduleType ?? context.type) === 'shelf';\n""",
    'fabric button state',
)
menu = replace_once(
    menu,
    """    if (action === 'toggle-glass' && context.supportsGlass) {\n      close();\n      onGlassModeChange?.(context, !context.isGlass);\n      return;\n    }\n\n    if (action === 'toggle-shelf-light' && (context.moduleType ?? context.type) === 'shelf') {\n""",
    """    if (action === 'toggle-glass' && context.supportsGlass) {\n      close();\n      onGlassModeChange?.(context, !context.isGlass);\n      return;\n    }\n\n    if (action === 'toggle-fabric' && context.supportsFabric) {\n      close();\n      onFabricModeChange?.(context, !context.isFabric);\n      return;\n    }\n\n    if (action === 'toggle-shelf-light' && (context.moduleType ?? context.type) === 'shelf') {\n""",
    'fabric button click',
)
menu_path.write_text(menu, encoding='utf-8')

# --- scene ---
scene_path = Path('src/scene3d.js')
scene = scene_path.read_text(encoding='utf-8')
scene = replace_once(
    scene,
    """  let surfaceMeshes = [];\n  const selectedSurfaces = new Set();\n""",
    """  let surfaceMeshes = [];\n  let fabricOverlayMeshes = [];\n  const selectedSurfaces = new Set();\n""",
    'fabric overlay state',
)

fabric_helpers = r'''  function clearFabricOverlays() {
    fabricOverlayMeshes.forEach((overlay) => {
      overlay.parent?.remove(overlay);
      overlay.geometry?.dispose?.();
      if (Array.isArray(overlay.material)) {
        overlay.material.forEach((material) => material?.dispose?.());
      } else {
        overlay.material?.dispose?.();
      }
    });
    fabricOverlayMeshes = [];
  }

  function rebuildFabricOverlays() {
    clearFabricOverlays();

    const groups = new Map();
    surfaceMeshes.forEach((surface) => {
      if (surface?.userData?.selectionMode !== 'panel') return;
      const groupId = surface.userData.surfaceState?.fabricGroupId;
      if (!groupId) return;
      if (!groups.has(groupId)) groups.set(groupId, []);
      groups.get(groupId).push(surface);
    });

    if (!groups.size) return;
    wallRoot.updateWorldMatrix(true, true);
    const wallQuaternion = wallRoot.getWorldQuaternion(new THREE.Quaternion());
    const inverseWallQuaternion = wallQuaternion.clone().invert();

    groups.forEach((surfaces, groupId) => {
      if (surfaces.length < 2) return;

      const first = surfaces[0];
      first.updateWorldMatrix(true, false);
      const surfaceQuaternion = first.getWorldQuaternion(new THREE.Quaternion());
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(surfaceQuaternion).normalize();
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(surfaceQuaternion).normalize();
      const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(surfaceQuaternion).normalize();

      let minU = Infinity;
      let maxU = -Infinity;
      let minV = Infinity;
      let maxV = -Infinity;
      let planeN = 0;
      let validCount = 0;

      surfaces.forEach((surface) => {
        surface.updateWorldMatrix(true, false);
        const center = surface.getWorldPosition(new THREE.Vector3());
        const width = Number(surface.geometry?.parameters?.width) || 0;
        const height = Number(surface.geometry?.parameters?.height) || 0;
        const u = center.dot(right);
        const v = center.dot(up);
        minU = Math.min(minU, u - width / 2);
        maxU = Math.max(maxU, u + width / 2);
        minV = Math.min(minV, v - height / 2);
        maxV = Math.max(maxV, v + height / 2);
        planeN += center.dot(normal);
        validCount += 1;
      });

      if (!validCount || !Number.isFinite(minU) || !Number.isFinite(minV)) return;
      planeN /= validCount;
      const width = maxU - minU;
      const height = maxV - minV;
      if (width <= 0 || height <= 0) return;

      const centerWorld = right.clone().multiplyScalar((minU + maxU) / 2)
        .add(up.clone().multiplyScalar((minV + maxV) / 2))
        .add(normal.clone().multiplyScalar(planeN + 0.006));

      const baseColor = first.material?.color?.clone?.() ?? new THREE.Color(0xffffff);
      const overlay = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.86,
          metalness: 0,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: -2,
          polygonOffsetUnits: -2,
        }),
      );
      overlay.position.copy(wallRoot.worldToLocal(centerWorld.clone()));
      overlay.quaternion.copy(inverseWallQuaternion.clone().multiply(surfaceQuaternion));
      overlay.castShadow = false;
      overlay.receiveShadow = true;
      overlay.renderOrder = 3;
      overlay.userData.kind = 'decoration';
      overlay.userData.role = 'lightbox-fabric';
      overlay.userData.fabricGroupId = groupId;
      // Bez öndeki tek parça yüzeydir; seçim/raycast alttaki gerçek panellerden devam eder.
      overlay.raycast = () => {};
      wallRoot.add(overlay);
      fabricOverlayMeshes.push(overlay);
    });
  }

  function applyFabricMode(meshOrMeshes, enabled) {
    const meshes = normalizeMeshes(meshOrMeshes).filter(
      (mesh) => mesh?.userData?.selectionMode === 'panel' && mesh.userData.surfaceState,
    );
    const fabric = Boolean(enabled);

    if (fabric) {
      if (meshes.length < 2) {
        return { ok: false, message: 'Ctrl ile en az 2 panel seç; bez tek parça blok olarak oluşturulur.' };
      }

      const moduleIndices = meshes.map((mesh) => Number(mesh.userData.moduleIndex));
      const stripIndices = meshes.map((mesh) => Number(mesh.userData.stripIndex));
      const bounds = {
        minModuleIndex: Math.min(...moduleIndices),
        maxModuleIndex: Math.max(...moduleIndices),
        minStripIndex: Math.min(...stripIndices),
        maxStripIndex: Math.max(...stripIndices),
      };
      const rect = createRectSelection(
        meshes.map((mesh) => ({
          mesh,
          moduleIndex: Number(mesh.userData.moduleIndex),
          stripIndex: Number(mesh.userData.stripIndex),
        })),
        { moduleIndex: bounds.minModuleIndex, stripIndex: bounds.minStripIndex },
        { moduleIndex: bounds.maxModuleIndex, stripIndex: bounds.maxStripIndex },
      );
      if (!rect.ok || rect.entries.length !== meshes.length) {
        return { ok: false, message: 'Bez yalnızca eksiksiz dikdörtgen panel bloğundan oluşturulabilir.' };
      }

      const first = meshes[0];
      first.updateWorldMatrix(true, false);
      const firstQuaternion = first.getWorldQuaternion(new THREE.Quaternion());
      const firstNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(firstQuaternion).normalize();
      const firstPosition = first.getWorldPosition(new THREE.Vector3());
      const firstPlane = firstPosition.dot(firstNormal);
      const samePlane = meshes.every((mesh) => {
        mesh.updateWorldMatrix(true, false);
        const quaternion = mesh.getWorldQuaternion(new THREE.Quaternion());
        const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion).normalize();
        const position = mesh.getWorldPosition(new THREE.Vector3());
        return Math.abs(normal.dot(firstNormal)) > 0.999
          && Math.abs(position.dot(firstNormal) - firstPlane) < 0.03;
      });
      if (!samePlane) {
        return { ok: false, message: 'Bez yalnızca aynı düzlemdeki panellerden oluşturulabilir.' };
      }

      const replacedGroupIds = new Set(
        meshes.map((mesh) => mesh.userData.surfaceState?.fabricGroupId).filter(Boolean),
      );
      if (replacedGroupIds.size) {
        surfaceMeshes.forEach((surface) => {
          if (replacedGroupIds.has(surface.userData.surfaceState?.fabricGroupId)) {
            delete surface.userData.surfaceState.fabricGroupId;
          }
        });
      }

      const groupId = `fabric-${globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}`;
      meshes.forEach((mesh) => {
        mesh.userData.surfaceState.fabricGroupId = groupId;
      });
      rebuildFabricOverlays();
      return { ok: true, enabled: true, panelCount: meshes.length, fabricGroupId: groupId };
    }

    const groupIds = new Set(
      meshes.map((mesh) => mesh.userData.surfaceState?.fabricGroupId).filter(Boolean),
    );
    if (!groupIds.size) {
      return { ok: false, message: 'Seçimde kaldırılacak bez bulunamadı.' };
    }
    surfaceMeshes.forEach((surface) => {
      if (groupIds.has(surface.userData.surfaceState?.fabricGroupId)) {
        delete surface.userData.surfaceState.fabricGroupId;
      }
    });
    rebuildFabricOverlays();
    return { ok: true, enabled: false, panelCount: meshes.length };
  }

'''
scene = replace_once(
    scene,
    """  function applyGlassMode(meshOrMeshes, isGlass) {\n""",
    fabric_helpers + """  function applyGlassMode(meshOrMeshes, isGlass) {\n""",
    'fabric helpers insertion',
)
scene = replace_once(
    scene,
    """      supportsGlass,\n      isGlass: supportsGlass ? Boolean(surface.userData.surfaceState?.isGlass) : false,\n""",
    """      supportsGlass,\n      isGlass: supportsGlass ? Boolean(surface.userData.surfaceState?.isGlass) : false,\n      supportsFabric: supportsGlass,\n      isFabric: supportsGlass ? Boolean(surface.userData.surfaceState?.fabricGroupId) : false,\n""",
    'fabric context fields',
)
scene = replace_once(
    scene,
    """    surfaceMeshes.forEach((surface) => {\n      if (selectedSurfaceIds.has(surface.userData.surfaceId)) {\n        selectedSurfaces.add(surface);\n        setSelectionVisual(surface, true);\n      }\n    });\n\n    selectionAnchorSurfaceId = surfaceMeshes.some(\n""",
    """    surfaceMeshes.forEach((surface) => {\n      if (selectedSurfaceIds.has(surface.userData.surfaceId)) {\n        selectedSurfaces.add(surface);\n        setSelectionVisual(surface, true);\n      }\n    });\n\n    rebuildFabricOverlays();\n\n    selectionAnchorSurfaceId = surfaceMeshes.some(\n""",
    'fabric rebuild after wall build',
)
scene = replace_once(
    scene,
    """    applyColor,\n    applyGlassMode,\n    applyImageAsset,\n""",
    """    applyColor,\n    applyGlassMode,\n    applyFabricMode,\n    applyImageAsset,\n""",
    'fabric scene api',
)
scene_path.write_text(scene, encoding='utf-8')

# --- main ---
main_path = Path('src/main.js')
main = main_path.read_text(encoding='utf-8')
fabric_handler = r'''function changeContextFabricMode(context, enabled) {
  if (!context?.supportsFabric) return;

  const selectedPanels = scene3d.getSelectedSurfaces().filter(
    (surface) => surface.userData.selectionMode === 'panel',
  );
  const result = scene3d.applyFabricMode(selectedPanels, enabled);
  if (!result?.ok) {
    selectionInfo.textContent = result?.message || 'Bez işlemi uygulanamadı.';
    return;
  }

  selectionInfo.textContent = result.enabled
    ? `${result.panelCount} panel tek parça beze çevrildi.`
    : 'Bez kaldırıldı; paneller normal görünüme döndü.';
}

'''
main = replace_once(
    main,
    """function changeContextPanelGlassMode(context, isGlass) {\n""",
    fabric_handler + """function changeContextPanelGlassMode(context, isGlass) {\n""",
    'fabric main handler',
)
main = replace_once(
    main,
    """  onGlassModeChange: changeContextPanelGlassMode,\n  getShelfLightingState: getContextShelfLightingState,\n""",
    """  onGlassModeChange: changeContextPanelGlassMode,\n  onFabricModeChange: changeContextFabricMode,\n  getShelfLightingState: getContextShelfLightingState,\n""",
    'fabric menu callback wiring',
)
main_path.write_text(main, encoding='utf-8')

# --- test ---
test_path = Path('test/lightboxFabric.test.js')
test_path.write_text(r'''import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('multi-panel lightbox fabric is exposed from panel context menu', () => {
  const menu = readFileSync(new URL('../src/moduleContextMenu.js', import.meta.url), 'utf8');
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(menu, /data-module-action="toggle-fabric"/);
  assert.match(menu, /Beze çevir/);
  assert.match(menu, /Bezden çıkar/);
  assert.match(main, /function changeContextFabricMode/);
  assert.match(main, /scene3d\.applyFabricMode\(selectedPanels, enabled\)/);
});

test('fabric conversion requires a rectangular multi-panel block and renders one overlay', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /function applyFabricMode\(meshOrMeshes, enabled\)/);
  assert.match(scene, /meshes\.length < 2/);
  assert.match(scene, /createRectSelection\(/);
  assert.match(scene, /fabricGroupId/);
  assert.match(scene, /function rebuildFabricOverlays\(\)/);
  assert.match(scene, /role = 'lightbox-fabric'/);
  assert.match(scene, /new THREE\.PlaneGeometry\(width, height\)/);
  assert.match(scene, /overlay\.raycast = \(\) => \{\}/);
});
''', encoding='utf-8')
