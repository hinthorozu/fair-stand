from pathlib import Path
import re

path = Path('src/scene3d.js')
text = path.read_text(encoding='utf-8')

anchor = """    fabricOverlayMeshes = [];
  }

  function loadFabricOverlayImage(overlay, assetId, fit = 'cover') {
"""
insert = """    fabricOverlayMeshes = [];
  }

  function suspendFabricSurface(surface) {
    if (!surface?.material) return;
    surface.material.map?.dispose?.();
    surface.material.map = null;
    surface.material.colorWrite = false;
    surface.material.depthWrite = false;
    surface.material.needsUpdate = true;
    const backing = surface.userData?.backing;
    if (backing) backing.visible = false;
  }

  function restoreFabricSurface(surface) {
    if (!surface?.material) return;
    const state = surface.userData?.surfaceState;
    surface.material.colorWrite = true;
    surface.material.depthWrite = !Boolean(state?.isGlass);
    surface.material.needsUpdate = true;
    const backing = surface.userData?.backing;
    if (backing) backing.visible = true;

    if (state?.imageAssetId) {
      applyStoredImage(surface);
    } else {
      surface.material.color.set(state?.isGlass ? GLASS_SURFACE_COLOR : (state?.color ?? '#ffffff'));
      surface.material.needsUpdate = true;
    }
  }

  function loadFabricOverlayImage(overlay, assetId, fit = 'cover') {
"""
if anchor not in text:
    raise SystemExit('fabric helper anchor not found')
text = text.replace(anchor, insert, 1)

old_group_start = """    groups.forEach((surfaces, groupId) => {
      if (surfaces.length < 2) return;

      const first = surfaces[0];
"""
new_group_start = """    groups.forEach((surfaces, groupId) => {
      if (surfaces.length < 2) return;
      // Bez aktifken alttaki paneller yalnızca seçim proxy'si olarak kalır:
      // texture GPU'da tutulmaz, panel/backing çizimi kapatılır.
      surfaces.forEach(suspendFabricSurface);

      const first = surfaces[0];
"""
if old_group_start not in text:
    raise SystemExit('fabric group start anchor not found')
text = text.replace(old_group_start, new_group_start, 1)

pattern = re.compile(
    r"      const replacedGroupIds = new Set\(\n"
    r"        meshes\.map\(\(mesh\) => mesh\.userData\.surfaceState\?\.fabricGroupId\)\.filter\(Boolean\),\n"
    r"      \);\n"
    r"      if \(replacedGroupIds\.size\) \{.*?\n"
    r"      \}\n\n"
    r"      const groupId =",
    re.S,
)
replacement = """      const replacedGroupIds = new Set(
        meshes.map((mesh) => mesh.userData.surfaceState?.fabricGroupId).filter(Boolean),
      );
      if (replacedGroupIds.size) {
        const replacedSurfaces = [];
        surfaceMeshes.forEach((surface) => {
          if (!replacedGroupIds.has(surface.userData.surfaceState?.fabricGroupId)) return;
          replacedSurfaces.push(surface);
          delete surface.userData.surfaceState.fabricGroupId;
          delete surface.userData.surfaceState.fabricColor;
          delete surface.userData.surfaceState.fabricImageAssetId;
          delete surface.userData.surfaceState.fabricImageFit;
        });
        replacedSurfaces.forEach(restoreFabricSurface);
      }

      const groupId ="""
text, count = pattern.subn(replacement, text, count=1)
if count != 1:
    raise SystemExit(f'replaced fabric group block count={count}')

old_enable_end = """        state.fabricImageAssetId = null;
        state.fabricImageFit = 'cover';
      });
      rebuildFabricOverlays();
      return { ok: true, enabled: true, panelCount: meshes.length, fabricGroupId: groupId };
"""
new_enable_end = """        state.fabricImageAssetId = null;
        state.fabricImageFit = 'cover';
      });
      meshes.forEach(suspendFabricSurface);
      rebuildFabricOverlays();
      return { ok: true, enabled: true, panelCount: meshes.length, fabricGroupId: groupId };
"""
if old_enable_end not in text:
    raise SystemExit('fabric enable end anchor not found')
text = text.replace(old_enable_end, new_enable_end, 1)

old_disable = """    surfaceMeshes.forEach((surface) => {
      if (groupIds.has(surface.userData.surfaceState?.fabricGroupId)) {
        delete surface.userData.surfaceState.fabricGroupId;
        delete surface.userData.surfaceState.fabricColor;
        delete surface.userData.surfaceState.fabricImageAssetId;
        delete surface.userData.surfaceState.fabricImageFit;
      }
    });
    rebuildFabricOverlays();
    return { ok: true, enabled: false, panelCount: meshes.length };
"""
new_disable = """    const restoredSurfaces = [];
    surfaceMeshes.forEach((surface) => {
      if (groupIds.has(surface.userData.surfaceState?.fabricGroupId)) {
        restoredSurfaces.push(surface);
        delete surface.userData.surfaceState.fabricGroupId;
        delete surface.userData.surfaceState.fabricColor;
        delete surface.userData.surfaceState.fabricImageAssetId;
        delete surface.userData.surfaceState.fabricImageFit;
      }
    });
    restoredSurfaces.forEach(restoreFabricSurface);
    rebuildFabricOverlays();
    return { ok: true, enabled: false, panelCount: meshes.length };
"""
if old_disable not in text:
    raise SystemExit('fabric disable block anchor not found')
text = text.replace(old_disable, new_disable, 1)

old_group_guard = """        if (
          surfaceState?.imageAssetId !== assetId
          || transform?.mode !== expectedMode
        ) {
"""
new_group_guard = """        if (
          surfaceState?.fabricGroupId
          || surfaceState?.imageAssetId !== assetId
          || transform?.mode !== expectedMode
        ) {
"""
if old_group_guard not in text:
    raise SystemExit('group image async guard anchor not found')
text = text.replace(old_group_guard, new_group_guard, 1)

old_single_guard = """        if (surfaceState?.imageAssetId !== assetId) {
          sourceTexture.dispose();
          return;
        }
"""
new_single_guard = """        if (surfaceState?.fabricGroupId || surfaceState?.imageAssetId !== assetId) {
          sourceTexture.dispose();
          return;
        }
"""
if old_single_guard not in text:
    raise SystemExit('single image async guard anchor not found')
text = text.replace(old_single_guard, new_single_guard, 1)

old_stored = """  function applyStoredImage(mesh) {
    if (mesh.userData.acceptsImage === false) return;

    const transferKey = getRebuildTextureKey(mesh);
"""
new_stored = """  function applyStoredImage(mesh) {
    if (mesh.userData.acceptsImage === false) return;
    // Bez aktifken eski panel görsel state'i korunur ama texture tekrar GPU'ya yüklenmez.
    if (mesh.userData.surfaceState?.fabricGroupId) return;

    const transferKey = getRebuildTextureKey(mesh);
"""
if old_stored not in text:
    raise SystemExit('applyStoredImage anchor not found')
text = text.replace(old_stored, new_stored, 1)

path.write_text(text, encoding='utf-8')

# Regression test: source-level contract for GPU texture suspension/restore.
test_path = Path('test/lightboxFabricPerformance.test.js')
test_path.write_text("""import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('active fabric releases hidden panel GPU textures and drawing', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /function suspendFabricSurface\\(surface\\)/);
  assert.match(scene, /surface\\.material\\.map\\?\\.dispose\\?\\.\\(\\)/);
  assert.match(scene, /surface\\.material\\.colorWrite = false/);
  assert.match(scene, /backing\\) backing\\.visible = false/);
  assert.match(scene, /meshes\\.forEach\\(suspendFabricSurface\\)/);
});

test('removing fabric restores panel rendering and stored images', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /function restoreFabricSurface\\(surface\\)/);
  assert.match(scene, /surface\\.material\\.colorWrite = true/);
  assert.match(scene, /restoredSurfaces\\.forEach\\(restoreFabricSurface\\)/);
  assert.match(scene, /if \\(state\\?\\.imageAssetId\\) \\{\\s*applyStoredImage\\(surface\\)/s);
});

test('fabric state prevents hidden panel textures from reloading asynchronously', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /if \\(mesh\\.userData\\.surfaceState\\?\\.fabricGroupId\\) return/);
  assert.match(scene, /surfaceState\\?\\.fabricGroupId \\|\\| surfaceState\\?\\.imageAssetId !== assetId/);
  assert.match(scene, /surfaceState\\?\\.fabricGroupId\\s*\\|\\| surfaceState\\?\\.imageAssetId !== assetId/s);
});
""", encoding='utf-8')
