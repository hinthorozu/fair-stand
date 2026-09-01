from pathlib import Path

scene_path = Path('src/scene3d.js')
main_path = Path('src/main.js')
test_path = Path('test/ctrlMultiSelect.test.js')

scene = scene_path.read_text()
main = main_path.read_text()

marker = """  function selectRectangleTo(mesh) {\n"""
insert = """  function toggleSurfaceSelection(mesh) {\n    if (!mesh || mesh.userData?.selectionMode === 'module') return false;\n    if (mesh.userData?.moduleType === 'counter') return toggleCounterSurface(mesh);\n\n    if (selectedSurfaces.has(mesh)) {\n      selectedSurfaces.delete(mesh);\n      setSelectionVisual(mesh, false);\n    } else {\n      selectedSurfaces.add(mesh);\n      setSelectionVisual(mesh, true);\n    }\n\n    floorSelected = false;\n    const selectedModuleIds = new Set(\n      [...selectedSurfaces].map((surface) => surface.userData?.moduleId).filter(Boolean),\n    );\n    selectedModuleId = selectedModuleIds.size === 1 ? [...selectedModuleIds][0] : null;\n    selectionAnchorSurfaceId = [...selectedSurfaces][0]?.userData.surfaceId ?? null;\n    notifySelection();\n    return true;\n  }\n\n""" + marker
if marker not in scene:
    raise SystemExit('selectRectangleTo marker not found')
scene = scene.replace(marker, insert, 1)

old = """    if (hit) {\n      if (rectangleSelect && hit.object.userData.moduleType === 'counter') {\n        toggleCounterSurface(hit.object);\n        return;\n      }\n\n      const anchorMesh = surfaceMeshes.find(\n        (surface) => surface.userData.surfaceId === selectionAnchorSurfaceId,\n      );\n      const canRectangleSelect = rectangleSelect\n        && hit.object.userData.selectionMode !== 'module'\n        && anchorMesh?.userData.selectionMode !== 'module';\n\n      if (canRectangleSelect) selectRectangleTo(hit.object);\n      else selectOnly(hit.object);\n      return;\n    }\n"""
new = """    if (hit) {\n      // Ctrl/Cmd + sol tık klasik çoklu seçim gibi davranır: tıklanan paneli\n      // mevcut seçime ekler veya seçimden çıkarır. Dikdörtgen doğrulaması\n      // Beze çevir / toplu görsel işlemi uygulanırken ayrıca yapılır.\n      if (rectangleSelect && hit.object.userData.selectionMode !== 'module') {\n        toggleSurfaceSelection(hit.object);\n        return;\n      }\n\n      selectOnly(hit.object);\n      return;\n    }\n"""
if old not in scene:
    raise SystemExit('handleSurfaceSelectionAt selection block not found')
scene = scene.replace(old, new, 1)

old_hint = "const DEFAULT_SELECTION_HINT = 'Bir panel seç; Ctrl/Cmd + tık ile karşı köşeyi seçip dikdörtgen blok oluştur.';"
new_hint = "const DEFAULT_SELECTION_HINT = 'Bir panel seç; Ctrl/Cmd + tık ile panelleri çoklu seç.';"
if old_hint not in main:
    raise SystemExit('default selection hint not found')
main = main.replace(old_hint, new_hint, 1)

old_empty = "selectionInfo.textContent = 'Bir panel seç; Ctrl/Cmd + tık ile karşı köşeyi seçip dikdörtgen blok oluştur.';"
new_empty = "selectionInfo.textContent = 'Bir panel seç; Ctrl/Cmd + tık ile panelleri çoklu seç.';"
if old_empty not in main:
    raise SystemExit('empty selection hint not found')
main = main.replace(old_empty, new_empty, 1)

old_single = "selectionInfo.textContent = `Modül ${moduleIndex + 1} · ${widthCm} cm · alttan ${stripNumber}. panel · Ctrl/Cmd + tık ile blok seç.`;"
new_single = "selectionInfo.textContent = `Modül ${moduleIndex + 1} · ${widthCm} cm · alttan ${stripNumber}. panel · Ctrl/Cmd + tık ile çoklu seç.`;"
if old_single not in main:
    raise SystemExit('single selection hint not found')
main = main.replace(old_single, new_single, 1)

old_multi = """    const shape = describeRectSelection(\n      surfaces.map((surface) => ({\n        moduleIndex: surface.userData.moduleIndex,\n        stripIndex: surface.userData.stripIndex,\n      })),\n    );\n\n    selectionInfo.textContent = `${shape.columnCount} × ${shape.rowCount} blok · ${shape.panelCount} panel seçili.`;\n"""
new_multi = """    selectionInfo.textContent = `${surfaces.length} panel seçili · Beze çevir için eksiksiz dikdörtgen panel grubunu seç.`;\n"""
if old_multi not in main:
    raise SystemExit('multi selection feedback block not found')
main = main.replace(old_multi, new_multi, 1)

test = """import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { readFileSync } from 'node:fs';\n\ntest('Ctrl/Cmd left click is captured before OrbitControls and toggles individual panels', () => {\n  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n  assert.match(scene, /if \\(event\\.button !== 0 \\|\\| !\\(event\\.ctrlKey \\|\\| event\\.metaKey\\)\\) return/);\n  assert.match(scene, /event\\.preventDefault\\(\\);\\s*event\\.stopImmediatePropagation\\(\\);\\s*handleSurfaceSelectionAt\\(event\\.clientX, event\\.clientY, true\\)/s);\n  assert.match(scene, /\\}, \\{ capture: true \\}\\);/);\n  assert.match(scene, /function toggleSurfaceSelection\\(mesh\\)/);\n  assert.match(scene, /if \\(selectedSurfaces\\.has\\(mesh\\)\\)[\\s\\S]*selectedSurfaces\\.delete\\(mesh\\)[\\s\\S]*selectedSurfaces\\.add\\(mesh\\)/);\n  assert.match(scene, /if \\(rectangleSelect && hit\\.object\\.userData\\.selectionMode !== 'module'\\) \\{\\s*toggleSurfaceSelection\\(hit\\.object\\)/s);\n});\n"""

scene_path.write_text(scene)
main_path.write_text(main)
test_path.write_text(test)
