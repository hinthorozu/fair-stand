from pathlib import Path

scene_path = Path('src/scene3d.js')
test_path = Path('test/ctrlMultiSelect.test.js')

scene = scene_path.read_text(encoding='utf-8')
test = test_path.read_text(encoding='utf-8')

old_wall = """    if (['back', 'left', 'right'].includes(wallId)) {
      const pathCm = wallId === 'back'
        ? Number(placement.xCm)
        : Number(placement.yCm);
      if (!Number.isFinite(pathCm)) return null;
      return {
        wallId,
        planeKey: `wall:${wallId}`,
        pathCm,
        moduleId,
      };
    }
"""
new_wall = """    if (['back', 'left', 'right'].includes(wallId)) {
      const pathCm = wallId === 'back'
        ? Number(placement.xCm)
        : Number(placement.yCm);
      const crossCm = wallId === 'back'
        ? Number(placement.yCm)
        : Number(placement.xCm);
      const axis = wallId === 'back' ? 'x' : 'y';
      const widthCm = Number(moduleState?.widthCm ?? surface.userData.widthCm);
      if (![pathCm, crossCm, widthCm].every(Number.isFinite) || widthCm <= 0) return null;
      return {
        wallId,
        planeKey: `wall:${wallId}`,
        pathCm,
        axis,
        crossCm,
        startCm: pathCm,
        endCm: pathCm + widthCm,
        moduleId,
      };
    }
"""
if old_wall not in scene:
    raise SystemExit('wall selection metadata block not found')
scene = scene.replace(old_wall, new_wall, 1)

old_condition = "if (anchorMeta.wallId === 'free' && targetMeta.wallId === 'free') {"
new_condition = "if (anchorMeta.wallId === 'free' || targetMeta.wallId === 'free') {"
if old_condition not in scene:
    raise SystemExit('free-free branch condition not found')
scene = scene.replace(old_condition, new_condition, 1)

old_filter = ".filter((meta) => meta?.wallId === 'free' && meta.moduleId)"
new_filter = ".filter((meta) => meta?.moduleId && (meta.axis === 'x' || meta.axis === 'y'))"
if old_filter not in scene:
    raise SystemExit('free module meta filter not found')
scene = scene.replace(old_filter, new_filter, 1)

old_test = "assert.match(scene, /anchorMeta\\.wallId === 'free' && targetMeta\\.wallId === 'free'/);"
new_test = "assert.match(scene, /anchorMeta\\.wallId === 'free' \\|\\| targetMeta\\.wallId === 'free'/);"
if old_test not in test:
    raise SystemExit('ctrl static free-free assertion not found')
test = test.replace(old_test, new_test, 1)

needle = "  assert.match(scene, /const freePathSet = new Set\\(freePath\\.moduleIds\\)/);\n"
insert = needle + "  assert.match(scene, /const axis = wallId === 'back' \\? 'x' : 'y'/);\n  assert.match(scene, /\\.filter\\(\\(meta\\) => meta\\?\\.moduleId && \\(meta\\.axis === 'x' \\|\\| meta\\.axis === 'y'\\)\\)/);\n"
if needle not in test:
    raise SystemExit('ctrl static freePath assertion not found')
test = test.replace(needle, insert, 1)

scene_path.write_text(scene, encoding='utf-8')
test_path.write_text(test, encoding='utf-8')
