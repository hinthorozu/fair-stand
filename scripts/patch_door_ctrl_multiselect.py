from pathlib import Path

scene_path = Path('src/scene3d.js')
scene = scene_path.read_text()

old = """    const anchorMeta = getSurfaceSelectionPlaneMeta(anchorMesh);\n    const targetMeta = getSurfaceSelectionPlaneMeta(mesh);\n    // Köşeyi dönüp başka duvara taşma: dikdörtgen seçim yalnızca aynı fiziksel\n    // duvar düzleminde yapılır. Raflı modül gibi farklı tipler aynı düzlemdeyse dahildir.\n    if (!anchorMeta || !targetMeta || anchorMeta.wallId !== targetMeta.wallId) return;\n"""
new = """    const anchorModuleId = anchorMesh.userData.moduleId ?? null;\n    const targetModuleId = mesh.userData.moduleId ?? null;\n\n    // Aynı modül içindeki gerçek panel aralığı duvar placement hesabına bağlı değildir.\n    // Kapının üst 3 paneli (strip 4-6), raf modülü ve diğer panel taşıyan modüller\n    // kendi içlerinde doğrudan dikey Ctrl/Cmd aralık seçimine izin verir.\n    if (anchorModuleId && anchorModuleId === targetModuleId) {\n      const modulePanels = surfaceMeshes\n        .filter((surface) => (\n          surface.userData.selectionMode === 'panel'\n          && surface.userData.moduleId === anchorModuleId\n          && Number.isInteger(Number(surface.userData.stripIndex))\n        ))\n        .map((surface) => ({\n          mesh: surface,\n          moduleIndex: 0,\n          stripIndex: Number(surface.userData.stripIndex),\n        }));\n      const sameModuleResult = createPanelRangeSelection(\n        modulePanels,\n        { moduleIndex: 0, stripIndex: Number(anchorMesh.userData.stripIndex) },\n        { moduleIndex: 0, stripIndex: Number(mesh.userData.stripIndex) },\n      );\n      if (!sameModuleResult.ok) return;\n\n      clearSelection({ notify: false, keepAnchor: true });\n      sameModuleResult.entries.forEach((entry) => {\n        selectedSurfaces.add(entry.mesh);\n        setSelectionVisual(entry.mesh, true);\n      });\n      selectedModuleId = anchorModuleId;\n      notifySelection();\n      return;\n    }\n\n    const anchorMeta = getSurfaceSelectionPlaneMeta(anchorMesh);\n    const targetMeta = getSurfaceSelectionPlaneMeta(mesh);\n    // Köşeyi dönüp başka duvara taşma: dikdörtgen seçim yalnızca aynı fiziksel\n    // duvar düzleminde yapılır. Raflı modül gibi farklı tipler aynı düzlemdeyse dahildir.\n    if (!anchorMeta || !targetMeta || anchorMeta.wallId !== targetMeta.wallId) return;\n"""
if old not in scene:
    raise SystemExit('same-module insertion anchor not found')
scene = scene.replace(old, new, 1)

old = """    const hit = raycaster.intersectObjects(surfaceMeshes, false)[0];\n\n    if (hit) {\n"""
new = """    const hits = raycaster.intersectObjects(surfaceMeshes, false);\n    // Ctrl/Cmd seçiminin kuralı paneldir: görünür noktada panel hit'i varsa\n    // modül proxy/yardımcı yüzeyinden önce onu seç. Panel yoksa eski ilk-hit\n    // davranışını koru (örn. banko özel çoklu seçimi).\n    const panelHit = rectangleSelect\n      ? hits.find((entry) => entry.object?.userData?.selectionMode === 'panel')\n      : null;\n    const hit = panelHit ?? hits[0];\n\n    if (hit) {\n"""
if old not in scene:
    raise SystemExit('raycast selection anchor not found')
scene = scene.replace(old, new, 1)
scene_path.write_text(scene)

test_path = Path('test/panelMultiSelectRule.test.js')
test = test_path.read_text()
marker = """test('door upper panels 4-6 can be selected vertically as one range', () => {\n"""
if marker not in test:
    raise SystemExit('door test marker not found')

extra = """\ntest('scene handles same-module panel ranges before wall-plane selection', () => {\n  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n  assert.match(scene, /anchorModuleId && anchorModuleId === targetModuleId/);\n  assert.match(scene, /sameModuleResult = createPanelRangeSelection/);\n  assert.match(scene, /surface\.userData\.moduleId === anchorModuleId/);\n  assert.match(scene, /selectedModuleId = anchorModuleId/);\n});\n\ntest('Ctrl\/Cmd raycast prefers a real panel surface over module proxy hits', () => {\n  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n  assert.match(scene, /const hits = raycaster\.intersectObjects\(surfaceMeshes, false\)/);\n  assert.match(scene, /hits\.find\(\(entry\) => entry\.object\?\.userData\?\.selectionMode === 'panel'\)/);\n  assert.match(scene, /const hit = panelHit \?\? hits\[0\]/);\n});\n\n"""
# Insert once before existing door helper test.
test = test.replace(marker, extra + marker, 1)
test_path.write_text(test)
