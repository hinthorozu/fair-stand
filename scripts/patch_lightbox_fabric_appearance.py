from pathlib import Path
import re


def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'{label} marker not found')
    return text.replace(old, new, 1)

scene_path = Path('src/scene3d.js')
scene = scene_path.read_text(encoding='utf-8')

# Dispose temporary fabric texture maps too.
scene = replace_once(
    scene,
    """      if (Array.isArray(overlay.material)) {\n        overlay.material.forEach((material) => material?.dispose?.());\n      } else {\n        overlay.material?.dispose?.();\n      }\n""",
    """      if (Array.isArray(overlay.material)) {\n        overlay.material.forEach((material) => {\n          material?.map?.dispose?.();\n          material?.dispose?.();\n        });\n      } else {\n        overlay.material?.map?.dispose?.();\n        overlay.material?.dispose?.();\n      }\n""",
    'fabric overlay dispose',
)

# Dedicated single-surface image loader for the fabric overlay.
fabric_image_helper = r'''  function loadFabricOverlayImage(overlay, assetId, fit = 'cover') {
    const assetUrl = getAssetUrl(assetId);
    if (!overlay?.material || !assetUrl) return;

    textureLoader.load(
      assetUrl,
      (sourceTexture) => {
        const image = sourceTexture.image;
        const imageWidth = Number(image?.naturalWidth || image?.videoWidth || image?.width) || 0;
        const imageHeight = Number(image?.naturalHeight || image?.videoHeight || image?.height) || 0;
        const planeWidth = Number(overlay.geometry?.parameters?.width) || 1;
        const planeHeight = Number(overlay.geometry?.parameters?.height) || 1;
        const targetAspect = Math.max(0.01, planeWidth / Math.max(planeHeight, 0.01));
        const maxCanvasSide = 1536;
        const canvas = document.createElement('canvas');
        if (targetAspect >= 1) {
          canvas.width = maxCanvasSide;
          canvas.height = Math.max(1, Math.round(maxCanvasSide / targetAspect));
        } else {
          canvas.height = maxCanvasSide;
          canvas.width = Math.max(1, Math.round(maxCanvasSide * targetAspect));
        }

        const context = canvas.getContext('2d');
        const layout = computeImageFit(
          imageWidth,
          imageHeight,
          canvas.width,
          canvas.height,
          fit,
        );
        if (!context || !layout) {
          sourceTexture.dispose();
          return;
        }

        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(
          image,
          layout.drawX,
          layout.drawY,
          layout.drawWidth,
          layout.drawHeight,
        );

        const fabricTexture = new THREE.CanvasTexture(canvas);
        fabricTexture.colorSpace = THREE.SRGBColorSpace;
        fabricTexture.needsUpdate = true;
        overlay.material.map?.dispose?.();
        overlay.material.map = fabricTexture;
        overlay.material.color.set(0xffffff);
        overlay.material.needsUpdate = true;
        sourceTexture.dispose();
      },
      undefined,
      () => {},
    );
  }

'''
scene = replace_once(
    scene,
    """  function rebuildFabricOverlays() {\n""",
    fabric_image_helper + """  function rebuildFabricOverlays() {\n""",
    'fabric image helper insertion',
)

scene = replace_once(
    scene,
    """      const baseColor = first.material?.color?.clone?.() ?? new THREE.Color(0xffffff);\n      const overlay = new THREE.Mesh(\n""",
    """      const fabricState = first.userData.surfaceState ?? {};\n      const fabricImageAssetId = fabricState.fabricImageAssetId ?? null;\n      const fabricImageFit = fabricState.fabricImageFit === 'contain' ? 'contain' : 'cover';\n      const fabricColor = fabricState.fabricColor ?? fabricState.color ?? '#ffffff';\n      const baseColor = new THREE.Color(fabricImageAssetId ? '#ffffff' : fabricColor);\n      const overlay = new THREE.Mesh(\n""",
    'fabric overlay appearance state',
)

scene = replace_once(
    scene,
    """      wallRoot.add(overlay);\n      fabricOverlayMeshes.push(overlay);\n""",
    """      wallRoot.add(overlay);\n      fabricOverlayMeshes.push(overlay);\n      if (fabricImageAssetId) {\n        loadFabricOverlayImage(overlay, fabricImageAssetId, fabricImageFit);\n      }\n""",
    'fabric overlay image load',
)

old_group_create = """      const groupId = `fabric-${globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}`;\n      meshes.forEach((mesh) => {\n        mesh.userData.surfaceState.fabricGroupId = groupId;\n      });\n"""
new_group_create = """      const groupId = `fabric-${globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}`;\n      const initialFabricColor = meshes[0]?.userData.surfaceState?.color ?? '#ffffff';\n      meshes.forEach((mesh) => {\n        const state = mesh.userData.surfaceState;\n        state.fabricGroupId = groupId;\n        state.fabricColor = initialFabricColor;\n        state.fabricImageAssetId = null;\n        state.fabricImageFit = 'cover';\n      });\n"""
scene = replace_once(scene, old_group_create, new_group_create, 'fabric group appearance init')

# When a fabric group is replaced/removed, remove its group appearance fields too.
scene = scene.replace(
    """            delete surface.userData.surfaceState.fabricGroupId;\n""",
    """            delete surface.userData.surfaceState.fabricGroupId;\n            delete surface.userData.surfaceState.fabricColor;\n            delete surface.userData.surfaceState.fabricImageAssetId;\n            delete surface.userData.surfaceState.fabricImageFit;\n""",
)
scene = scene.replace(
    """        delete surface.userData.surfaceState.fabricGroupId;\n""",
    """        delete surface.userData.surfaceState.fabricGroupId;\n        delete surface.userData.surfaceState.fabricColor;\n        delete surface.userData.surfaceState.fabricImageAssetId;\n        delete surface.userData.surfaceState.fabricImageFit;\n""",
)

# Color on any selected member of a fabric group colors the whole single-piece fabric.
match = re.search(r"  function applyColor\(meshOrMeshes, hexColor\) \{.*?\n  \}\n\n  function ", scene, re.S)
if not match:
    raise SystemExit('applyColor function not found')
func = match.group(0)
func2 = func.replace(
    """    normalizeMeshes(meshOrMeshes).forEach((mesh) => {\n""",
    """    const meshes = normalizeMeshes(meshOrMeshes);\n    const fabricGroupIds = new Set(\n      meshes.map((mesh) => mesh.userData.surfaceState?.fabricGroupId).filter(Boolean),\n    );\n    fabricGroupIds.forEach((groupId) => {\n      surfaceMeshes.forEach((surface) => {\n        const state = surface.userData.surfaceState;\n        if (state?.fabricGroupId !== groupId) return;\n        state.fabricColor = hexColor;\n        state.fabricImageAssetId = null;\n        state.fabricImageFit = 'cover';\n      });\n    });\n\n    meshes.filter((mesh) => !mesh.userData.surfaceState?.fabricGroupId).forEach((mesh) => {\n""",
    1,
)
if func2 == func:
    raise SystemExit('applyColor loop marker not found')
last_close = func2.rfind("\n  }\n\n  function ")
func2 = func2[:last_close] + "\n    if (fabricGroupIds.size) rebuildFabricOverlays();" + func2[last_close:]
scene = scene[:match.start()] + func2 + scene[match.end():]

# A selected fabric gets one image across the whole fabric plane.
marker = """  function applyRectImageAsset(meshOrMeshes, assetId, fit = 'contain') {\n    const meshes = normalizeMeshes(meshOrMeshes);\n    if (!assetId) return { ok: false, message: 'Önce bir görsel seç.' };\n"""
replacement = marker + """    const fabricGroupIds = new Set(\n      meshes.map((mesh) => mesh.userData.surfaceState?.fabricGroupId).filter(Boolean),\n    );\n    if (fabricGroupIds.size > 1) {\n      return { ok: false, message: 'Görsel için tek bir bez seç.' };\n    }\n    if (fabricGroupIds.size === 1) {\n      const [groupId] = fabricGroupIds;\n      if (!meshes.every((mesh) => mesh.userData.surfaceState?.fabricGroupId === groupId)) {\n        return { ok: false, message: 'Bez ile normal panelleri aynı anda görselleme; tek bir bez seç.' };\n      }\n      const groupSurfaces = surfaceMeshes.filter(\n        (surface) => surface.userData.surfaceState?.fabricGroupId === groupId,\n      );\n      groupSurfaces.forEach((surface) => {\n        const state = surface.userData.surfaceState;\n        state.fabricImageAssetId = assetId;\n        state.fabricImageFit = fit === 'contain' ? 'contain' : 'cover';\n      });\n      rebuildFabricOverlays();\n      return {\n        ok: true,\n        mode: 'fabric-group',\n        panelCount: groupSurfaces.length,\n        fabricGroupId: groupId,\n      };\n    }\n"""
scene = replace_once(scene, marker, replacement, 'fabric image application')

# Clearing an image from any member clears the image from the entire fabric.
match = re.search(r"  function clearImage\(meshOrMeshes\) \{.*?\n  \}\n\n  function ", scene, re.S)
if not match:
    raise SystemExit('clearImage function not found')
func = match.group(0)
func2 = func.replace(
    """    normalizeMeshes(meshOrMeshes).forEach((mesh) => {\n""",
    """    const meshes = normalizeMeshes(meshOrMeshes);\n    const fabricGroupIds = new Set(\n      meshes.map((mesh) => mesh.userData.surfaceState?.fabricGroupId).filter(Boolean),\n    );\n    fabricGroupIds.forEach((groupId) => {\n      surfaceMeshes.forEach((surface) => {\n        const state = surface.userData.surfaceState;\n        if (state?.fabricGroupId !== groupId) return;\n        state.fabricImageAssetId = null;\n        state.fabricImageFit = 'cover';\n      });\n    });\n\n    meshes.filter((mesh) => !mesh.userData.surfaceState?.fabricGroupId).forEach((mesh) => {\n""",
    1,
)
if func2 == func:
    raise SystemExit('clearImage loop marker not found')
last_close = func2.rfind("\n  }\n\n  function ")
func2 = func2[:last_close] + "\n    if (fabricGroupIds.size) rebuildFabricOverlays();" + func2[last_close:]
scene = scene[:match.start()] + func2 + scene[match.end():]

scene_path.write_text(scene, encoding='utf-8')

# Main UI: identify a selected fabric as a single editable surface and report image placement clearly.
main_path = Path('src/main.js')
main = main_path.read_text(encoding='utf-8')
main = replace_once(
    main,
    """    const shape = describeRectSelection(\n      surfaces.map((surface) => ({\n""",
    """    const selectedFabricGroupIds = new Set(\n      surfaces.map((surface) => surface.userData.surfaceState?.fabricGroupId).filter(Boolean),\n    );\n    if (selectedFabricGroupIds.size === 1\n      && surfaces.every((surface) => surface.userData.surfaceState?.fabricGroupId)) {\n      selectionInfo.textContent = 'Tek parça lightbox bezi seçili · renk + görsel uygulanabilir.';\n      return;\n    }\n\n    const shape = describeRectSelection(\n      surfaces.map((surface) => ({\n""",
    'fabric selection feedback',
)
main = replace_once(
    main,
    """  if (result.mode === 'rect-group') {\n    selectionInfo.textContent = `${result.columnCount} × ${result.rowCount} blokta ${result.panelCount} panele görsel · ${fitLabel}.`;\n  } else {\n    selectionInfo.textContent = `Görsel seçili panele uygulandı · ${fitLabel}.`;\n  }\n""",
    """  if (result.mode === 'fabric-group') {\n    selectionInfo.textContent = `Tek parça lightbox bezine görsel uygulandı · ${fitLabel}.`;\n  } else if (result.mode === 'rect-group') {\n    selectionInfo.textContent = `${result.columnCount} × ${result.rowCount} blokta ${result.panelCount} panele görsel · ${fitLabel}.`;\n  } else {\n    selectionInfo.textContent = `Görsel seçili panele uygulandı · ${fitLabel}.`;\n  }\n""",
    'fabric image feedback',
)
main_path.write_text(main, encoding='utf-8')

# Tests
test_path = Path('test/lightboxFabricAppearance.test.js')
test_path.write_text(r'''import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('lightbox fabric owns one persistent color and image state', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /fabricColor/);
  assert.match(scene, /fabricImageAssetId/);
  assert.match(scene, /fabricImageFit/);
  assert.match(scene, /loadFabricOverlayImage/);
  assert.match(scene, /mode: 'fabric-group'/);
  assert.match(scene, /state\.fabricColor = hexColor/);
  assert.match(scene, /state\.fabricImageAssetId = assetId/);
  assert.match(scene, /new THREE\.CanvasTexture\(canvas\)/);
});

test('main editor treats a fabric group as one color and image target', () => {
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /Tek parça lightbox bezi seçili · renk \+ görsel uygulanabilir/);
  assert.match(main, /result\.mode === 'fabric-group'/);
  assert.match(main, /Tek parça lightbox bezine görsel uygulandı/);
});
''', encoding='utf-8')
