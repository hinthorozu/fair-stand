from pathlib import Path

scene_path = Path('src/scene3d.js')
rect_path = Path('src/rectSelection.js')
ctrl_test_path = Path('test/ctrlMultiSelect.test.js')
rect_test_path = Path('test/rectSelection.test.js')

scene = scene_path.read_text()
rect = rect_path.read_text()
ctrl_test = ctrl_test_path.read_text()
rect_test = rect_test_path.read_text()

# Restore the original corner-to-corner rectangle behaviour. Ctrl/Cmd capture remains,
# so OrbitControls cannot steal the click.
old_hit = """    if (hit) {\n      // Ctrl/Cmd + sol tık klasik çoklu seçim gibi davranır: tıklanan paneli\n      // mevcut seçime ekler veya seçimden çıkarır. Dikdörtgen doğrulaması\n      // Beze çevir / toplu görsel işlemi uygulanırken ayrıca yapılır.\n      if (rectangleSelect && hit.object.userData.selectionMode !== 'module') {\n        toggleSurfaceSelection(hit.object);\n        return;\n      }\n\n      selectOnly(hit.object);\n      return;\n    }\n"""
new_hit = """    if (hit) {\n      if (rectangleSelect && hit.object.userData.moduleType === 'counter') {\n        toggleCounterSurface(hit.object);\n        return;\n      }\n\n      const anchorMesh = surfaceMeshes.find(\n        (surface) => surface.userData.surfaceId === selectionAnchorSurfaceId,\n      );\n      const canRectangleSelect = rectangleSelect\n        && hit.object.userData.selectionMode === 'panel'\n        && anchorMesh?.userData.selectionMode === 'panel';\n\n      if (canRectangleSelect) selectRectangleTo(hit.object);\n      else selectOnly(hit.object);\n      return;\n    }\n"""
if old_hit not in scene:
    raise SystemExit('current ctrl-toggle hit block not found')
scene = scene.replace(old_hit, new_hit, 1)

# Only true wall panels participate in rectangle selection.
old_filter = ".filter((surface) => surface.userData.selectionMode !== 'module')"
new_filter = ".filter((surface) => surface.userData.selectionMode === 'panel')"
if old_filter not in scene:
    raise SystemExit('rectangle surface filter not found')
scene = scene.replace(old_filter, new_filter, 1)

# Remove the accidental individual panel toggle helper; counters keep their own toggle helper.
start = scene.find("  function toggleSurfaceSelection(mesh) {")
if start != -1:
    end = scene.find("\n  function selectRectangleTo(mesh) {", start)
    if end == -1:
        raise SystemExit('toggleSurfaceSelection end marker not found')
    scene = scene[:start] + scene[end + 1:]

# Rectangle columns must be based on existing selectable panel columns, not raw global
# moduleIndex distance. This lets a rectangle work when non-panel modules occupy indices
# between two panel modules.
old_rect = """  const minModuleIndex = Math.min(anchor.moduleIndex, target.moduleIndex);\n  const maxModuleIndex = Math.max(anchor.moduleIndex, target.moduleIndex);\n  const minStripIndex = Math.min(anchor.stripIndex, target.stripIndex);\n  const maxStripIndex = Math.max(anchor.stripIndex, target.stripIndex);\n\n  const columnCount = maxModuleIndex - minModuleIndex + 1;\n  const rowCount = maxStripIndex - minStripIndex + 1;\n  const expectedCount = columnCount * rowCount;\n\n  const entries = items\n    .filter((item) => (\n      item.moduleIndex >= minModuleIndex\n      && item.moduleIndex <= maxModuleIndex\n      && item.stripIndex >= minStripIndex\n      && item.stripIndex <= maxStripIndex\n    ))\n    .sort((a, b) => (\n      a.stripIndex - b.stripIndex\n      || a.moduleIndex - b.moduleIndex\n    ));\n"""
new_rect = """  const selectableModuleIndices = [...new Set(\n    items\n      .map((item) => Number(item?.moduleIndex))\n      .filter(Number.isInteger),\n  )].sort((a, b) => a - b);\n  const anchorColumn = selectableModuleIndices.indexOf(anchor.moduleIndex);\n  const targetColumn = selectableModuleIndices.indexOf(target.moduleIndex);\n  if (anchorColumn < 0 || targetColumn < 0) {\n    return { ok: false, message: 'Seçim başlangıç veya bitiş paneli bulunamadı.' };\n  }\n\n  const minColumn = Math.min(anchorColumn, targetColumn);\n  const maxColumn = Math.max(anchorColumn, targetColumn);\n  const selectedModuleIndices = selectableModuleIndices.slice(minColumn, maxColumn + 1);\n  const selectedModuleSet = new Set(selectedModuleIndices);\n  const minModuleIndex = selectedModuleIndices[0];\n  const maxModuleIndex = selectedModuleIndices.at(-1);\n  const minStripIndex = Math.min(anchor.stripIndex, target.stripIndex);\n  const maxStripIndex = Math.max(anchor.stripIndex, target.stripIndex);\n\n  const columnCount = selectedModuleIndices.length;\n  const rowCount = maxStripIndex - minStripIndex + 1;\n  const expectedCount = columnCount * rowCount;\n  const columnOrder = new Map(selectedModuleIndices.map((moduleIndex, index) => [moduleIndex, index]));\n\n  const entries = items\n    .filter((item) => (\n      selectedModuleSet.has(item.moduleIndex)\n      && item.stripIndex >= minStripIndex\n      && item.stripIndex <= maxStripIndex\n    ))\n    .sort((a, b) => (\n      a.stripIndex - b.stripIndex\n      || columnOrder.get(a.moduleIndex) - columnOrder.get(b.moduleIndex)\n    ));\n"""
if old_rect not in rect:
    raise SystemExit('raw module-index rectangle block not found')
rect = rect.replace(old_rect, new_rect, 1)

ctrl_test = """import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { readFileSync } from 'node:fs';\n\ntest('Ctrl/Cmd left click is captured before OrbitControls and selects a rectangle', () => {\n  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n  assert.match(scene, /if \\(event\\.button !== 0 \\|\\| !\\(event\\.ctrlKey \\|\\| event\\.metaKey\\)\\) return/);\n  assert.match(scene, /event\\.preventDefault\\(\\);\\s*event\\.stopImmediatePropagation\\(\\);\\s*handleSurfaceSelectionAt\\(event\\.clientX, event\\.clientY, true\\)/s);\n  assert.match(scene, /\\}, \\{ capture: true \\}\\);/);\n  assert.doesNotMatch(scene, /function toggleSurfaceSelection\\(mesh\\)/);\n  assert.match(scene, /const canRectangleSelect = rectangleSelect[\\s\\S]*selectionMode === 'panel'[\\s\\S]*selectRectangleTo\\(hit\\.object\\)/);\n  assert.match(scene, /\\.filter\\(\\(surface\\) => surface\\.userData\\.selectionMode === 'panel'\\)/);\n});\n"""

extra_test = """\n\ntest('rectangle columns ignore gaps from non-panel module indices', () => {\n  const items = [\n    { moduleIndex: 0, stripIndex: 1, id: '0:1' },\n    { moduleIndex: 0, stripIndex: 2, id: '0:2' },\n    { moduleIndex: 3, stripIndex: 1, id: '3:1' },\n    { moduleIndex: 3, stripIndex: 2, id: '3:2' },\n  ];\n  const result = createRectSelection(\n    items,\n    { moduleIndex: 0, stripIndex: 1 },\n    { moduleIndex: 3, stripIndex: 2 },\n  );\n\n  assert.equal(result.ok, true);\n  assert.equal(result.columnCount, 2);\n  assert.equal(result.rowCount, 2);\n  assert.equal(result.panelCount, 4);\n  assert.deepEqual(result.entries.map((item) => item.id), ['0:1', '3:1', '0:2', '3:2']);\n});\n"""
if "rectangle columns ignore gaps from non-panel module indices" not in rect_test:
    rect_test += extra_test

scene_path.write_text(scene)
rect_path.write_text(rect)
ctrl_test_path.write_text(ctrl_test)
rect_test_path.write_text(rect_test)
