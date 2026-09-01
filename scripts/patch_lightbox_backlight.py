from pathlib import Path


def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'{label} marker not found')
    return text.replace(old, new, 1)

# moduleContextMenu.js
path = Path('src/moduleContextMenu.js')
text = path.read_text(encoding='utf-8')
text = replace_once(
    text,
    """  onGlassModeChange,\n  onFabricModeChange,\n  getShelfLightingState,\n""",
    """  onGlassModeChange,\n  onFabricModeChange,\n  onFabricLightingChange,\n  getShelfLightingState,\n""",
    'menu callback signature',
)
text = replace_once(
    text,
    """    <button type=\"button\" data-module-action=\"toggle-fabric\" hidden>Beze çevir</button>\n    <button type=\"button\" data-module-action=\"toggle-shelf-light\" hidden>Raf altı aydınlatmayı aç</button>\n""",
    """    <button type=\"button\" data-module-action=\"toggle-fabric\" hidden>Beze çevir</button>\n    <button type=\"button\" data-module-action=\"toggle-fabric-light\" hidden>Lightbox aydınlatmayı aç</button>\n    <button type=\"button\" data-module-action=\"toggle-shelf-light\" hidden>Raf altı aydınlatmayı aç</button>\n""",
    'fabric light button html',
)
text = replace_once(
    text,
    """  const fabricModeButton = menu.querySelector('[data-module-action=\"toggle-fabric\"]');\n  const shelfLightingButton = menu.querySelector('[data-module-action=\"toggle-shelf-light\"]');\n""",
    """  const fabricModeButton = menu.querySelector('[data-module-action=\"toggle-fabric\"]');\n  const fabricLightingButton = menu.querySelector('[data-module-action=\"toggle-fabric-light\"]');\n  const shelfLightingButton = menu.querySelector('[data-module-action=\"toggle-shelf-light\"]');\n""",
    'fabric light button query',
)
text = replace_once(
    text,
    """    fabricModeButton.textContent = context.isFabric\n      ? 'Bezden çıkar'\n      : 'Beze çevir';\n\n    const isShelf = (context.moduleType ?? context.type) === 'shelf';\n""",
    """    fabricModeButton.textContent = context.isFabric\n      ? 'Bezden çıkar'\n      : 'Beze çevir';\n\n    fabricLightingButton.hidden = !context.isFabric;\n    fabricLightingButton.textContent = context.fabricLightingOn\n      ? 'Lightbox aydınlatmayı kapat'\n      : 'Lightbox aydınlatmayı aç';\n\n    const isShelf = (context.moduleType ?? context.type) === 'shelf';\n""",
    'fabric light button state',
)
text = replace_once(
    text,
    """    if (action === 'toggle-fabric' && context.supportsFabric) {\n      close();\n      onFabricModeChange?.(context, !context.isFabric);\n      return;\n    }\n\n    if (action === 'toggle-shelf-light' && (context.moduleType ?? context.type) === 'shelf') {\n""",
    """    if (action === 'toggle-fabric' && context.supportsFabric) {\n      close();\n      onFabricModeChange?.(context, !context.isFabric);\n      return;\n    }\n\n    if (action === 'toggle-fabric-light' && context.isFabric) {\n      close();\n      onFabricLightingChange?.(context, !context.fabricLightingOn);\n      return;\n    }\n\n    if (action === 'toggle-shelf-light' && (context.moduleType ?? context.type) === 'shelf') {\n""",
    'fabric light click',
)
path.write_text(text, encoding='utf-8')

# scene3d.js
path = Path('src/scene3d.js')
text = path.read_text(encoding='utf-8')
text = replace_once(
    text,
    """      supportsFabric: supportsGlass,\n      isFabric: supportsGlass ? Boolean(surface.userData.surfaceState?.fabricGroupId) : false,\n      clientX: event.clientX,\n""",
    """      supportsFabric: supportsGlass,\n      isFabric: supportsGlass ? Boolean(surface.userData.surfaceState?.fabricGroupId) : false,\n      fabricLightingOn: supportsGlass ? Boolean(surface.userData.surfaceState?.fabricLightingOn) : false,\n      clientX: event.clientX,\n""",
    'context lighting state',
)

lighting_helper = r'''  function applyFabricOverlayLighting(overlay, fabricState = {}) {
    const material = overlay?.material;
    if (!material) return;

    const lightingOn = Boolean(fabricState.fabricLightingOn);
    if (!lightingOn) {
      material.emissiveMap = null;
      material.emissive.set(0x000000);
      material.emissiveIntensity = 0;
      material.needsUpdate = true;
      return;
    }

    if (material.map) {
      // Aynı baskı dokusu emissiveMap olarak kullanılır: görsel kendi içinden parlar,
      // fakat sahneye fiziksel ışık saçılmaz.
      material.emissive.set(0xffffff);
      material.emissiveMap = material.map;
      material.emissiveIntensity = 1.35;
    } else {
      material.emissiveMap = null;
      material.emissive.set(fabricState.fabricColor ?? fabricState.color ?? '#ffffff');
      material.emissiveIntensity = 0.72;
    }
    material.needsUpdate = true;
  }

'''
text = replace_once(
    text,
    """  function loadFabricOverlayImage(overlay, assetId, fit = 'cover') {\n""",
    lighting_helper + """  function loadFabricOverlayImage(overlay, assetId, fit = 'cover') {\n""",
    'fabric lighting helper insertion',
)
text = replace_once(
    text,
    """        overlay.material.map = fabricTexture;\n        overlay.material.color.set(0xffffff);\n        overlay.material.needsUpdate = true;\n        sourceTexture.dispose();\n""",
    """        overlay.material.map = fabricTexture;\n        overlay.material.color.set(0xffffff);\n        applyFabricOverlayLighting(overlay, overlay.userData.fabricState);\n        sourceTexture.dispose();\n""",
    'apply lighting after fabric image load',
)
text = replace_once(
    text,
    """          metalness: 0,\n          side: THREE.DoubleSide,\n          polygonOffset: true,\n""",
    """          metalness: 0,\n          emissive: 0x000000,\n          emissiveIntensity: 0,\n          side: THREE.DoubleSide,\n          polygonOffset: true,\n""",
    'fabric material emissive fields',
)
text = replace_once(
    text,
    """      overlay.userData.role = 'lightbox-fabric';\n      overlay.userData.fabricGroupId = groupId;\n      // Bez öndeki tek parça yüzeydir; seçim/raycast alttaki gerçek panellerden devam eder.\n""",
    """      overlay.userData.role = 'lightbox-fabric';\n      overlay.userData.fabricGroupId = groupId;\n      overlay.userData.fabricState = fabricState;\n      applyFabricOverlayLighting(overlay, fabricState);\n      // Bez öndeki tek parça yüzeydir; seçim/raycast alttaki gerçek panellerden devam eder.\n""",
    'fabric overlay lighting init',
)
# delete lighting state when replacing old group
text = text.replace(
    """          delete surface.userData.surfaceState.fabricImageFit;\n        });\n        replacedSurfaces.forEach(restoreFabricSurface);\n""",
    """          delete surface.userData.surfaceState.fabricImageFit;\n          delete surface.userData.surfaceState.fabricLightingOn;\n        });\n        replacedSurfaces.forEach(restoreFabricSurface);\n""",
    1,
)
text = replace_once(
    text,
    """        state.fabricImageAssetId = null;\n        state.fabricImageFit = 'cover';\n      });\n""",
    """        state.fabricImageAssetId = null;\n        state.fabricImageFit = 'cover';\n        state.fabricLightingOn = false;\n      });\n""",
    'initialize fabric light state',
)
text = replace_once(
    text,
    """        delete surface.userData.surfaceState.fabricImageFit;\n      }\n    });\n    restoredSurfaces.forEach(restoreFabricSurface);\n    rebuildFabricOverlays();\n    return { ok: true, enabled: false, panelCount: meshes.length };\n  }\n\n  function applyGlassMode(meshOrMeshes, isGlass) {\n""",
    """        delete surface.userData.surfaceState.fabricImageFit;\n        delete surface.userData.surfaceState.fabricLightingOn;\n      }\n    });\n    restoredSurfaces.forEach(restoreFabricSurface);\n    rebuildFabricOverlays();\n    return { ok: true, enabled: false, panelCount: meshes.length };\n  }\n\n  function setFabricLighting(meshOrMeshes, enabled) {\n    const meshes = normalizeMeshes(meshOrMeshes).filter(\n      (mesh) => mesh?.userData?.selectionMode === 'panel' && mesh.userData.surfaceState?.fabricGroupId,\n    );\n    const groupIds = new Set(\n      meshes.map((mesh) => mesh.userData.surfaceState.fabricGroupId).filter(Boolean),\n    );\n    if (groupIds.size !== 1) {\n      return { ok: false, message: 'Aydınlatma için tek bir lightbox bezi seç.' };\n    }\n\n    const [groupId] = groupIds;\n    const lightingOn = Boolean(enabled);\n    const groupSurfaces = surfaceMeshes.filter(\n      (surface) => surface.userData.surfaceState?.fabricGroupId === groupId,\n    );\n    groupSurfaces.forEach((surface) => {\n      surface.userData.surfaceState.fabricLightingOn = lightingOn;\n    });\n\n    fabricOverlayMeshes\n      .filter((overlay) => overlay.userData?.fabricGroupId === groupId)\n      .forEach((overlay) => applyFabricOverlayLighting(overlay, groupSurfaces[0]?.userData.surfaceState));\n\n    return { ok: true, enabled: lightingOn, panelCount: groupSurfaces.length, fabricGroupId: groupId };\n  }\n\n  function applyGlassMode(meshOrMeshes, isGlass) {\n""",
    'fabric lighting setter',
)
text = replace_once(
    text,
    """    applyColor,\n    applyGlassMode,\n    applyFabricMode,\n    applyImageAsset,\n""",
    """    applyColor,\n    applyGlassMode,\n    applyFabricMode,\n    setFabricLighting,\n    applyImageAsset,\n""",
    'scene export fabric lighting',
)
path.write_text(text, encoding='utf-8')

# main.js
path = Path('src/main.js')
text = path.read_text(encoding='utf-8')
marker = """function changeContextPanelGlassMode(context, isGlass) {\n"""
insert = r'''function changeContextFabricLighting(context, enabled) {
  if (!context?.isFabric) return;

  const selectedPanels = scene3d.getSelectedSurfaces().filter(
    (surface) => surface.userData.selectionMode === 'panel',
  );
  const result = scene3d.setFabricLighting(selectedPanels, enabled);
  if (!result?.ok) {
    selectionInfo.textContent = result?.message || 'Lightbox aydınlatması değiştirilemedi.';
    return;
  }

  selectionInfo.textContent = result.enabled
    ? 'Lightbox aydınlatması açıldı · yalnızca bez/görsel parlıyor.'
    : 'Lightbox aydınlatması kapatıldı.';
}

'''
text = replace_once(text, marker, insert + marker, 'main fabric lighting function')
text = replace_once(
    text,
    """  onGlassModeChange: changeContextPanelGlassMode,\n  onFabricModeChange: changeContextFabricMode,\n  getShelfLightingState: getContextShelfLightingState,\n""",
    """  onGlassModeChange: changeContextPanelGlassMode,\n  onFabricModeChange: changeContextFabricMode,\n  onFabricLightingChange: changeContextFabricLighting,\n  getShelfLightingState: getContextShelfLightingState,\n""",
    'main menu callback',
)
path.write_text(text, encoding='utf-8')

# test
Path('test/lightboxFabricLighting.test.js').write_text(r'''import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('lightbox fabric lighting is a right-click toggle', () => {
  const menu = readFileSync(new URL('../src/moduleContextMenu.js', import.meta.url), 'utf8');
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(menu, /data-module-action="toggle-fabric-light"/);
  assert.match(menu, /Lightbox aydınlatmayı aç/);
  assert.match(menu, /Lightbox aydınlatmayı kapat/);
  assert.match(main, /function changeContextFabricLighting/);
  assert.match(main, /scene3d\.setFabricLighting\(selectedPanels, enabled\)/);
});

test('lightbox backlight brightens only the fabric material without a physical light', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /function applyFabricOverlayLighting/);
  assert.match(scene, /fabricLightingOn/);
  assert.match(scene, /material\.emissiveMap = material\.map/);
  assert.match(scene, /material\.emissiveIntensity = 1\.35/);
  assert.match(scene, /function setFabricLighting/);
  assert.match(scene, /setFabricLighting,/);
});
''', encoding='utf-8')
