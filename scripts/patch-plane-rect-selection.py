from pathlib import Path

scene_path = Path('src/scene3d.js')
test_path = Path('test/ctrlMultiSelect.test.js')
scene = scene_path.read_text()
test = test_path.read_text()

old = """  function selectRectangleTo(mesh) {
    if (!mesh) return;

    const anchorMesh = surfaceMeshes.find(
      (surface) => surface.userData.surfaceId === selectionAnchorSurfaceId,
    ) ?? [...selectedSurfaces][0] ?? mesh;

    if (!selectionAnchorSurfaceId) {
      selectionAnchorSurfaceId = anchorMesh.userData.surfaceId ?? null;
    }

    const result = createRectSelection(
      surfaceMeshes
        .filter((surface) => surface.userData.selectionMode === 'panel')
        .map((surface) => ({
          mesh: surface,
          moduleIndex: surface.userData.moduleIndex,
          stripIndex: surface.userData.stripIndex,
        })),
      anchorMesh.userData,
      mesh.userData,
    );

    if (!result.ok) return;

    clearSelection({ notify: false, keepAnchor: true });
    result.entries.forEach((entry) => {
      selectedSurfaces.add(entry.mesh);
      setSelectionVisual(entry.mesh, true);
    });
    const selectedModuleIds = new Set(
      result.entries.map((entry) => entry.mesh.userData?.moduleId).filter(Boolean),
    );
    selectedModuleId = selectedModuleIds.size === 1 ? [...selectedModuleIds][0] : null;
    notifySelection();
  }
"""

new = """  function getSurfaceSelectionPlaneMeta(surface) {
    if (!surface || surface.userData?.selectionMode !== 'panel') return null;
    const moduleGroup = findModuleGroup(surface);
    const moduleState = moduleGroup?.userData?.moduleState;
    const placement = moduleState?.placement ?? moduleGroup?.userData?.placement;
    const wallId = placement?.wallId ?? null;
    if (!['back', 'left', 'right'].includes(wallId)) return null;

    // Dikdörtgen seçim global moduleIndex sırasına değil, panelin gerçekten
    // bulunduğu duvar düzlemindeki fiziksel yatay konuma göre ilerler.
    const pathCm = wallId === 'back'
      ? Number(placement.xCm)
      : Number(placement.yCm);
    if (!Number.isFinite(pathCm)) return null;

    return {
      wallId,
      pathCm,
      moduleId: surface.userData.moduleId ?? moduleState?.id ?? null,
    };
  }

  function selectRectangleTo(mesh) {
    if (!mesh) return;

    const anchorMesh = surfaceMeshes.find(
      (surface) => surface.userData.surfaceId === selectionAnchorSurfaceId,
    ) ?? [...selectedSurfaces][0] ?? mesh;

    if (!selectionAnchorSurfaceId) {
      selectionAnchorSurfaceId = anchorMesh.userData.surfaceId ?? null;
    }

    const anchorMeta = getSurfaceSelectionPlaneMeta(anchorMesh);
    const targetMeta = getSurfaceSelectionPlaneMeta(mesh);
    // Köşeyi dönüp başka duvara taşma: dikdörtgen seçim yalnızca aynı fiziksel
    // duvar düzleminde yapılır. Raflı modül gibi farklı tipler aynı düzlemdeyse dahildir.
    if (!anchorMeta || !targetMeta || anchorMeta.wallId !== targetMeta.wallId) return;

    const planePanels = surfaceMeshes
      .filter((surface) => surface.userData.selectionMode === 'panel')
      .map((surface) => ({ surface, meta: getSurfaceSelectionPlaneMeta(surface) }))
      .filter((entry) => entry.meta?.wallId === anchorMeta.wallId);

    const orderedModules = [...new Map(
      planePanels
        .filter((entry) => entry.meta.moduleId)
        .map((entry) => [entry.meta.moduleId, entry.meta]),
    ).values()].sort((a, b) => (a.pathCm - b.pathCm));
    const columnByModuleId = new Map(
      orderedModules.map((entry, index) => [entry.moduleId, index]),
    );
    const anchorColumn = columnByModuleId.get(anchorMeta.moduleId);
    const targetColumn = columnByModuleId.get(targetMeta.moduleId);
    if (!Number.isInteger(anchorColumn) || !Number.isInteger(targetColumn)) return;

    const result = createRectSelection(
      planePanels.map(({ surface, meta }) => ({
        mesh: surface,
        moduleIndex: columnByModuleId.get(meta.moduleId),
        stripIndex: surface.userData.stripIndex,
      })),
      { moduleIndex: anchorColumn, stripIndex: anchorMesh.userData.stripIndex },
      { moduleIndex: targetColumn, stripIndex: mesh.userData.stripIndex },
    );

    if (!result.ok) return;

    clearSelection({ notify: false, keepAnchor: true });
    result.entries.forEach((entry) => {
      selectedSurfaces.add(entry.mesh);
      setSelectionVisual(entry.mesh, true);
    });
    const selectedModuleIds = new Set(
      result.entries.map((entry) => entry.mesh.userData?.moduleId).filter(Boolean),
    );
    selectedModuleId = selectedModuleIds.size === 1 ? [...selectedModuleIds][0] : null;
    notifySelection();
  }
"""

if old not in scene:
    raise SystemExit('selectRectangleTo block not found')
scene = scene.replace(old, new, 1)

old_test = """  assert.match(scene, /\\.filter\\(\\(surface\\) => surface\\.userData\\.selectionMode === 'panel'\\)/);\n"""
new_test = """  assert.match(scene, /function getSurfaceSelectionPlaneMeta\\(surface\\)/);\n  assert.match(scene, /anchorMeta\\.wallId !== targetMeta\\.wallId/);\n  assert.match(scene, /const pathCm = wallId === 'back'[\\s\\S]*Number\\(placement\\.xCm\\)[\\s\\S]*Number\\(placement\\.yCm\\)/);\n  assert.match(scene, /orderedModules[\\s\\S]*sort\\(\\(a, b\\) => \\(a\\.pathCm - b\\.pathCm\\)\\)/);\n  assert.match(scene, /columnByModuleId/);\n  assert.match(scene, /planePanels\\.map/);\n"""
if old_test not in test:
    raise SystemExit('ctrl test assertion not found')
test = test.replace(old_test, new_test, 1)

scene_path.write_text(scene)
test_path.write_text(test)
