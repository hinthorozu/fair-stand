from pathlib import Path

scene_path = Path('src/scene3d.js')
scene = scene_path.read_text(encoding='utf-8')

old_select_module = """  function selectModuleOnly(moduleId) {
    selectedSurfaces.forEach((mesh) => setSelectionVisual(mesh, false));
    selectedSurfaces.clear();
    selectionAnchorSurfaceId = null;
    floorSelected = false;
    selectedModuleId = moduleId ?? null;
    notifySelection();
  }

  function selectRectangleTo(mesh) {
"""
new_select_module = """  function selectModuleOnly(moduleId) {
    selectedSurfaces.forEach((mesh) => setSelectionVisual(mesh, false));
    selectedSurfaces.clear();
    selectionAnchorSurfaceId = null;
    floorSelected = false;
    selectedModuleId = moduleId ?? null;
    notifySelection();
  }

  function toggleCounterSurface(mesh) {
    if (!mesh || mesh.userData?.moduleType !== 'counter') return false;

    const moduleId = mesh.userData.moduleId ?? null;
    const hasForeignSelection = [...selectedSurfaces].some(
      (surface) => surface.userData?.moduleType !== 'counter'
        || surface.userData?.moduleId !== moduleId,
    );

    if (hasForeignSelection) clearSelection({ notify: false });

    if (selectedSurfaces.has(mesh)) {
      selectedSurfaces.delete(mesh);
      setSelectionVisual(mesh, false);
    } else {
      selectedSurfaces.add(mesh);
      setSelectionVisual(mesh, true);
    }

    floorSelected = false;
    selectedModuleId = selectedSurfaces.size ? moduleId : null;
    selectionAnchorSurfaceId = [...selectedSurfaces][0]?.userData.surfaceId ?? null;
    notifySelection();
    return true;
  }

  function selectRectangleTo(mesh) {
"""
if old_select_module not in scene:
    raise SystemExit('selectModuleOnly anchor not found')
scene = scene.replace(old_select_module, new_select_module, 1)

old_hit = """    if (hit) {
      const anchorMesh = surfaceMeshes.find(
        (surface) => surface.userData.surfaceId === selectionAnchorSurfaceId,
      );
      const canRectangleSelect = rectangleSelect
        && hit.object.userData.selectionMode !== 'module'
        && anchorMesh?.userData.selectionMode !== 'module';

      if (canRectangleSelect) selectRectangleTo(hit.object);
      else selectOnly(hit.object);
      return;
    }
"""
new_hit = """    if (hit) {
      if (rectangleSelect && hit.object.userData.moduleType === 'counter') {
        toggleCounterSurface(hit.object);
        return;
      }

      const anchorMesh = surfaceMeshes.find(
        (surface) => surface.userData.surfaceId === selectionAnchorSurfaceId,
      );
      const canRectangleSelect = rectangleSelect
        && hit.object.userData.selectionMode !== 'module'
        && anchorMesh?.userData.selectionMode !== 'module';

      if (canRectangleSelect) selectRectangleTo(hit.object);
      else selectOnly(hit.object);
      return;
    }
"""
if old_hit not in scene:
    raise SystemExit('surface selection hit anchor not found')
scene = scene.replace(old_hit, new_hit, 1)
scene_path.write_text(scene, encoding='utf-8')

main_path = Path('src/main.js')
main = main_path.read_text(encoding='utf-8')

old_multi_info = """    const shape = describeRectSelection(
      surfaces.map((surface) => ({
        moduleIndex: surface.userData.moduleIndex,
        stripIndex: surface.userData.stripIndex,
      })),
    );

    selectionInfo.textContent = `${shape.columnCount} × ${shape.rowCount} blok · ${shape.panelCount} panel seçili.`;
"""
new_multi_info = """    const allCounterPanels = surfaces.every(
      (surface) => surface.userData.moduleType === 'counter',
    );
    if (allCounterPanels) {
      const widthCm = surfaces[0]?.userData.widthCm ?? '';
      selectionInfo.textContent = `Banko ${widthCm} cm · ${surfaces.length} panel seçili · renk + görsel toplu uygulanabilir.`;
      return;
    }

    const shape = describeRectSelection(
      surfaces.map((surface) => ({
        moduleIndex: surface.userData.moduleIndex,
        stripIndex: surface.userData.stripIndex,
      })),
    );

    selectionInfo.textContent = `${shape.columnCount} × ${shape.rowCount} blok · ${shape.panelCount} panel seçili.`;
"""
if old_multi_info not in main:
    raise SystemExit('multi selection info anchor not found')
main = main.replace(old_multi_info, new_multi_info, 1)

old_image_apply = """  const result = scene3d.applyRectImageAsset(selected, activeAssetId, fit);
  if (!result.ok) {
"""
new_image_apply = """  const allCounterPanels = selected.every(
    (surface) => surface.userData.moduleType === 'counter',
  );
  if (allCounterPanels) {
    scene3d.applyImageAsset(selected, activeAssetId, fit);
    const fitLabel = fit === 'cover' ? 'Doldur' : 'Sığdır';
    selectionInfo.textContent = `${selected.length} banko paneline görsel uygulandı · ${fitLabel}.`;
    return true;
  }

  const result = scene3d.applyRectImageAsset(selected, activeAssetId, fit);
  if (!result.ok) {
"""
if old_image_apply not in main:
    raise SystemExit('image apply anchor not found')
main = main.replace(old_image_apply, new_image_apply, 1)
main_path.write_text(main, encoding='utf-8')
