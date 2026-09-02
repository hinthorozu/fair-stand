from pathlib import Path


def read_preserve(path):
    with Path(path).open('r', encoding='utf-8', newline='') as handle:
        return handle.read()


def write_preserve(path, text):
    with Path(path).open('w', encoding='utf-8', newline='') as handle:
        handle.write(text)


rect_path = Path('src/rectSelection.js')
scene_path = Path('src/scene3d.js')
rect_test_path = Path('test/rectSelection.test.js')
ctrl_test_path = Path('test/ctrlMultiSelect.test.js')

rect = read_preserve(rect_path)
scene = read_preserve(scene_path)
rect_test = read_preserve(rect_test_path)
ctrl_test = read_preserve(ctrl_test_path)

rect_nl = '\r\n' if '\r\n' in rect else '\n'
scene_nl = '\r\n' if '\r\n' in scene else '\n'
rect_test_nl = '\r\n' if '\r\n' in rect_test else '\n'
ctrl_test_nl = '\r\n' if '\r\n' in ctrl_test else '\n'

# 1) Pure helper: find the physically connected free-panel module path.
marker = f"export function createPanelRangeSelection(items, anchorPoint, targetPoint) {{{rect_nl}"
if marker not in rect:
    raise SystemExit('rectSelection insertion marker not found')

helper = """export function createConnectedPanelModulePath(modules, anchorModuleId, targetModuleId, toleranceCm = 0.5) {
  if (!Array.isArray(modules) || !anchorModuleId || !targetModuleId) {
    return { ok: false, moduleIds: [] };
  }

  const tolerance = Math.max(0, Number(toleranceCm) || 0);
  const byId = new Map();
  modules.forEach((module) => {
    const moduleId = module?.moduleId ?? null;
    const axis = module?.axis;
    const startCm = Number(module?.startCm);
    const endCm = Number(module?.endCm);
    const crossCm = Number(module?.crossCm);
    if (!moduleId || (axis !== 'x' && axis !== 'y')) return;
    if (![startCm, endCm, crossCm].every(Number.isFinite)) return;
    byId.set(moduleId, {
      moduleId,
      axis,
      startCm: Math.min(startCm, endCm),
      endCm: Math.max(startCm, endCm),
      crossCm,
    });
  });

  if (!byId.has(anchorModuleId) || !byId.has(targetModuleId)) {
    return { ok: false, moduleIds: [] };
  }
  if (anchorModuleId === targetModuleId) {
    return { ok: true, moduleIds: [anchorModuleId] };
  }

  const near = (a, b) => Math.abs(Number(a) - Number(b)) <= tolerance;
  const connected = (a, b) => {
    if (a.axis === b.axis) {
      return near(a.crossCm, b.crossCm)
        && (near(a.endCm, b.startCm) || near(b.endCm, a.startCm));
    }

    const xSegment = a.axis === 'x' ? a : b;
    const ySegment = a.axis === 'y' ? a : b;
    const intersectionX = ySegment.crossCm;
    const intersectionY = xSegment.crossCm;
    const xEndpoint = near(intersectionX, xSegment.startCm)
      || near(intersectionX, xSegment.endCm);
    const yEndpoint = near(intersectionY, ySegment.startCm)
      || near(intersectionY, ySegment.endCm);
    return xEndpoint && yEndpoint;
  };

  const ids = [...byId.keys()];
  const previous = new Map([[anchorModuleId, null]]);
  const queue = [anchorModuleId];

  while (queue.length) {
    const currentId = queue.shift();
    const current = byId.get(currentId);
    for (const candidateId of ids) {
      if (previous.has(candidateId) || candidateId === currentId) continue;
      if (!connected(current, byId.get(candidateId))) continue;
      previous.set(candidateId, currentId);
      if (candidateId === targetModuleId) {
        const moduleIds = [];
        let cursor = targetModuleId;
        while (cursor) {
          moduleIds.push(cursor);
          cursor = previous.get(cursor) ?? null;
        }
        moduleIds.reverse();
        return { ok: true, moduleIds };
      }
      queue.push(candidateId);
    }
  }

  return { ok: false, moduleIds: [] };
}

""".replace('\n', rect_nl)
if 'export function createConnectedPanelModulePath(' not in rect:
    rect = rect.replace(marker, helper + marker, 1)

# 2) Scene import.
old_import = "import { createPanelRangeSelection, createRectSelection } from './rectSelection.js';"
new_import = "import { createConnectedPanelModulePath, createPanelRangeSelection, createRectSelection } from './rectSelection.js';"
if new_import not in scene:
    if old_import not in scene:
        raise SystemExit('scene rectSelection import not found')
    scene = scene.replace(old_import, new_import, 1)

# 3) Enrich free-plane metadata with physical segment coordinates.
old_meta = """    const pathCm = vertical ? yCm : xCm;
    const crossCm = vertical ? xCm : yCm;
    const axis = vertical ? 'y' : 'x';
    const quantizedCrossCm = Math.round(crossCm * 10) / 10;

    return {
      wallId,
      planeKey: `free:${axis}:${quantizedCrossCm}`,
      pathCm,
      moduleId,
    };
""".replace('\n', scene_nl)
new_meta = """    const pathCm = vertical ? yCm : xCm;
    const crossCm = vertical ? xCm : yCm;
    const axis = vertical ? 'y' : 'x';
    const widthCm = Number(moduleState?.widthCm ?? surface.userData.widthCm);
    if (!Number.isFinite(widthCm) || widthCm <= 0) return null;
    const quantizedCrossCm = Math.round(crossCm * 10) / 10;

    return {
      wallId,
      planeKey: `free:${axis}:${quantizedCrossCm}`,
      pathCm,
      axis,
      crossCm,
      startCm: pathCm,
      endCm: pathCm + widthCm,
      moduleId,
    };
""".replace('\n', scene_nl)
if new_meta not in scene:
    if old_meta not in scene:
        raise SystemExit('free metadata block not found')
    scene = scene.replace(old_meta, new_meta, 1)

# 4) Before wall-only cross-plane fallback, support connected free L/corner chains.
old_cross = """    if (anchorMeta.planeKey !== targetMeta.planeKey) {
      const wallIds = ['back', 'left', 'right'];
      if (!wallIds.includes(anchorMeta.wallId) || !wallIds.includes(targetMeta.wallId)) return;

      const wallPanels = surfaceMeshes
""".replace('\n', scene_nl)
new_cross = """    if (anchorMeta.planeKey !== targetMeta.planeKey) {
      if (anchorMeta.wallId === 'free' && targetMeta.wallId === 'free') {
        const freeModuleMeta = [...new Map(
          surfaceMeshes
            .filter((surface) => surface.userData.selectionMode === 'panel')
            .map((surface) => getSurfaceSelectionPlaneMeta(surface))
            .filter((meta) => meta?.wallId === 'free' && meta.moduleId)
            .map((meta) => [meta.moduleId, meta]),
        ).values()];
        const freePath = createConnectedPanelModulePath(
          freeModuleMeta,
          anchorMeta.moduleId,
          targetMeta.moduleId,
        );
        if (!freePath.ok) return;

        const columnByModuleId = new Map(
          freePath.moduleIds.map((moduleId, index) => [moduleId, index]),
        );
        const freePathSet = new Set(freePath.moduleIds);
        const freePathPanels = surfaceMeshes
          .filter((surface) => (
            surface.userData.selectionMode === 'panel'
            && freePathSet.has(surface.userData.moduleId)
          ))
          .map((surface) => ({
            mesh: surface,
            moduleIndex: columnByModuleId.get(surface.userData.moduleId),
            stripIndex: Number(surface.userData.stripIndex),
          }));
        const freeCornerResult = createPanelRangeSelection(
          freePathPanels,
          {
            moduleIndex: columnByModuleId.get(anchorMeta.moduleId),
            stripIndex: Number(anchorMesh.userData.stripIndex),
          },
          {
            moduleIndex: columnByModuleId.get(targetMeta.moduleId),
            stripIndex: Number(mesh.userData.stripIndex),
          },
        );
        if (!freeCornerResult.ok) return;

        clearSelection({ notify: false, keepAnchor: true });
        freeCornerResult.entries.forEach((entry) => {
          selectedSurfaces.add(entry.mesh);
          setSelectionVisual(entry.mesh, true);
        });
        const selectedModuleIds = new Set(
          freeCornerResult.entries.map((entry) => entry.mesh.userData?.moduleId).filter(Boolean),
        );
        selectedModuleId = selectedModuleIds.size === 1 ? [...selectedModuleIds][0] : null;
        notifySelection();
        return;
      }

      const wallIds = ['back', 'left', 'right'];
      if (!wallIds.includes(anchorMeta.wallId) || !wallIds.includes(targetMeta.wallId)) return;

      const wallPanels = surfaceMeshes
""".replace('\n', scene_nl)
if new_cross not in scene:
    if old_cross not in scene:
        raise SystemExit('cross-plane selection block not found')
    scene = scene.replace(old_cross, new_cross, 1)

# 5) Add behavior tests for connected L path and disconnected rows.
old_rect_import = "import { createRectSelection, describeRectSelection } from '../src/rectSelection.js';"
new_rect_import = "import { createConnectedPanelModulePath, createRectSelection, describeRectSelection } from '../src/rectSelection.js';"
if new_rect_import not in rect_test:
    if old_rect_import not in rect_test:
        raise SystemExit('rectSelection test import not found')
    rect_test = rect_test.replace(old_rect_import, new_rect_import, 1)

if "test('finds a connected free-panel path around an L corner'" not in rect_test:
    rect_tests = """

test('finds a connected free-panel path around an L corner', () => {
  const result = createConnectedPanelModulePath([
    { moduleId: 'a', axis: 'x', startCm: 0, endCm: 100, crossCm: 300 },
    { moduleId: 'b', axis: 'x', startCm: 100, endCm: 200, crossCm: 300 },
    { moduleId: 'c', axis: 'y', startCm: 300, endCm: 400, crossCm: 200 },
  ], 'a', 'c');

  assert.equal(result.ok, true);
  assert.deepEqual(result.moduleIds, ['a', 'b', 'c']);
});

test('does not bridge separate free-panel rows', () => {
  const result = createConnectedPanelModulePath([
    { moduleId: 'a', axis: 'x', startCm: 0, endCm: 100, crossCm: 300 },
    { moduleId: 'b', axis: 'x', startCm: 100, endCm: 200, crossCm: 300 },
    { moduleId: 'other', axis: 'x', startCm: 0, endCm: 100, crossCm: 500 },
  ], 'a', 'other');

  assert.equal(result.ok, false);
  assert.deepEqual(result.moduleIds, []);
});
""".replace('\n', rect_test_nl)
    rect_test += rect_tests

# 6) Static integration contract.
anchor_assert = "  assert.match(scene, /const wallIds = \\['back', 'left', 'right'\\]/);"
if 'createConnectedPanelModulePath' not in ctrl_test:
    if anchor_assert not in ctrl_test:
        raise SystemExit('ctrl static assertion insertion point not found')
    additions = """  assert.match(scene, /createConnectedPanelModulePath/);
  assert.match(scene, /anchorMeta\\.wallId === 'free' && targetMeta\\.wallId === 'free'/);
  assert.match(scene, /const freePathSet = new Set\\(freePath\\.moduleIds\\)/);
""".replace('\n', ctrl_test_nl)
    ctrl_test = ctrl_test.replace(anchor_assert, additions + anchor_assert, 1)

write_preserve(rect_path, rect)
write_preserve(scene_path, scene)
write_preserve(rect_test_path, rect_test)
write_preserve(ctrl_test_path, ctrl_test)
