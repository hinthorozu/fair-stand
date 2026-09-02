from pathlib import Path

scene_path = Path('src/scene3d.js')
test_path = Path('test/ctrlMultiSelect.test.js')

with scene_path.open('r', encoding='utf-8', newline='') as handle:
    scene = handle.read()
newline = '\r\n' if '\r\n' in scene else '\n'

old_scene = """    const anchorMeta = getSurfaceSelectionPlaneMeta(anchorMesh);
    const targetMeta = getSurfaceSelectionPlaneMeta(mesh);
    // Köşeyi dönüp başka duvara taşma: dikdörtgen seçim yalnızca aynı fiziksel
    // duvar düzleminde yapılır. Raflı modül gibi farklı tipler aynı düzlemdeyse dahildir.
    if (!anchorMeta || !targetMeta || anchorMeta.planeKey !== targetMeta.planeKey) return;

    const planePanels = surfaceMeshes
""".replace('\n', newline)

new_scene = """    const anchorMeta = getSurfaceSelectionPlaneMeta(anchorMesh);
    const targetMeta = getSurfaceSelectionPlaneMeta(mesh);
    if (!anchorMeta || !targetMeta) return;

    // Aynı fiziksel düzlemde bugünkü plane-aware seçim korunur. İki uç farklı
    // stand duvarlarındaysa eski duvar-zinciri dikdörtgen seçimini kullan: örneğin
    // sol üst + arka duvarda üstten ikinci panel, aradaki 2 x N panel bloğunu seçer.
    // Serbest ön sıralar bu fallback'e girmez; yalnızca gerçek stand duvarları girer.
    if (anchorMeta.planeKey !== targetMeta.planeKey) {
      const wallIds = ['back', 'left', 'right'];
      if (!wallIds.includes(anchorMeta.wallId) || !wallIds.includes(targetMeta.wallId)) return;

      const wallPanels = surfaceMeshes
        .filter((surface) => surface.userData.selectionMode === 'panel')
        .map((surface) => ({ surface, meta: getSurfaceSelectionPlaneMeta(surface) }))
        .filter((entry) => wallIds.includes(entry.meta?.wallId))
        .map(({ surface }) => ({
          mesh: surface,
          moduleIndex: Number(surface.userData.moduleIndex),
          stripIndex: Number(surface.userData.stripIndex),
        }));

      const crossWallResult = createPanelRangeSelection(
        wallPanels,
        {
          moduleIndex: Number(anchorMesh.userData.moduleIndex),
          stripIndex: Number(anchorMesh.userData.stripIndex),
        },
        {
          moduleIndex: Number(mesh.userData.moduleIndex),
          stripIndex: Number(mesh.userData.stripIndex),
        },
      );
      if (!crossWallResult.ok) return;

      clearSelection({ notify: false, keepAnchor: true });
      crossWallResult.entries.forEach((entry) => {
        selectedSurfaces.add(entry.mesh);
        setSelectionVisual(entry.mesh, true);
      });
      const selectedModuleIds = new Set(
        crossWallResult.entries.map((entry) => entry.mesh.userData?.moduleId).filter(Boolean),
      );
      selectedModuleId = selectedModuleIds.size === 1 ? [...selectedModuleIds][0] : null;
      notifySelection();
      return;
    }

    const planePanels = surfaceMeshes
""".replace('\n', newline)

if old_scene not in scene:
    raise SystemExit('cross-wall selection insertion point not found')
scene = scene.replace(old_scene, new_scene, 1)

with scene_path.open('w', encoding='utf-8', newline='') as handle:
    handle.write(scene)

test = test_path.read_text(encoding='utf-8')
old_test = """  assert.match(scene, /anchorMeta\\.planeKey !== targetMeta\\.planeKey/);
  assert.doesNotMatch(scene, /anchorMeta\\.wallId !== targetMeta\\.wallId/);
"""
new_test = """  assert.match(scene, /anchorMeta\\.planeKey !== targetMeta\\.planeKey/);
  assert.match(scene, /const wallIds = \\['back', 'left', 'right'\\]/);
  assert.match(scene, /\\.filter\\(\\(entry\\) => wallIds\\.includes\\(entry\\.meta\\?\\.wallId\\)\\)/);
  assert.match(scene, /const crossWallResult = createPanelRangeSelection\\([\\s\\S]*wallPanels[\\s\\S]*moduleIndex: Number\\(anchorMesh\\.userData\\.moduleIndex\\)[\\s\\S]*moduleIndex: Number\\(mesh\\.userData\\.moduleIndex\\)/);
  assert.doesNotMatch(scene, /anchorMeta\\.wallId !== targetMeta\\.wallId/);
"""
if old_test not in test:
    raise SystemExit('ctrl multiselect test insertion point not found')
test_path.write_text(test.replace(old_test, new_test, 1), encoding='utf-8')
