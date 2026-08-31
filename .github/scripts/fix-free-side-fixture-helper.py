from pathlib import Path

placement_path = Path('src/modulePlacement.js')
s = placement_path.read_text()
marker = "export function planFreeSideInsertion({\n"
if marker not in s:
    raise SystemExit('planFreeSideInsertion marker not found')
if 'function createFreeSideFixturePlacement({' not in s:
    helper = r'''function createFreeSideFixturePlacement({
  sourceModule,
  insertedModule,
  side,
  standXCm,
  standYCm,
} = {}) {
  if (!sourceModule?.placement || !insertedModule) return null;
  const sourceWidth = Number(sourceModule.widthCm);
  const sourceDepth = Number(sourceModule.depthCm);
  const insertedWidth = Number(insertedModule.widthCm);
  const insertedDepth = Number(insertedModule.depthCm);
  if (![sourceWidth, insertedWidth, insertedDepth].every(Number.isFinite)) return null;

  const sourceRotation = normalizeModuleRotationZDeg(sourceModule.placement.rotationZDeg);
  const insertedRotation = normalizeModuleRotationZDeg(
    insertedModule.type === 'bar-stool' ? 270 : sourceRotation,
  );
  const right = getVisualRightVector(sourceRotation);
  const direction = side === 'right' ? 1 : -1;
  const sourceCenter = getPlacementCenterCm(sourceModule.placement, sourceWidth);
  if (!sourceCenter) return null;

  const sourcePhysicalDepth = Number.isFinite(sourceDepth) && sourceDepth > 0
    ? sourceDepth
    : MODULE_COLLISION_DEPTH_CM;
  const sourceExtents = getRotatedHalfExtentsCm(sourceWidth, sourcePhysicalDepth, sourceRotation);
  const insertedExtents = getRotatedHalfExtentsCm(insertedWidth, insertedDepth, insertedRotation);
  const centerDistance = Math.abs(right.x) * (sourceExtents.halfX + insertedExtents.halfX)
    + Math.abs(right.y) * (sourceExtents.halfY + insertedExtents.halfY);

  let centerXCm = sourceCenter.xCm + right.x * centerDistance * direction;
  let centerYCm = sourceCenter.yCm + right.y * centerDistance * direction;
  const xLimit = Number(standXCm);
  const yLimit = Number(standYCm);
  if (![centerXCm, centerYCm, xLimit, yLimit].every(Number.isFinite)) return null;

  // Keep the side contact, but clamp the perpendicular axis so deeper fixtures remain inside the stand.
  const perpendicular = { x: -right.y, y: right.x };
  const minCenterX = insertedExtents.halfX;
  const maxCenterX = xLimit - insertedExtents.halfX;
  const minCenterY = insertedExtents.halfY;
  const maxCenterY = yLimit - insertedExtents.halfY;
  if (maxCenterX < minCenterX || maxCenterY < minCenterY) return null;

  if (Math.abs(perpendicular.x) > Math.abs(perpendicular.y)) {
    centerXCm = clamp(centerXCm, minCenterX, maxCenterX);
  } else {
    centerYCm = clamp(centerYCm, minCenterY, maxCenterY);
  }

  return placementFromCenterCm({
    centerXCm,
    centerYCm,
    widthCm: insertedWidth,
    rotationZDeg: insertedRotation,
    template: {
      zCm: insertedModule.placement?.zCm ?? sourceModule.placement.zCm ?? 0,
      wallId: 'free',
    },
  });
}

'''
    s = s.replace(marker, helper + marker, 1)
placement_path.write_text(s)

test_path = Path('test/modulePlacement.test.js')
t = test_path.read_text()
needle = "test('free context insertion rejects stand overflow and real collision'"
regression = r'''

test('free-side insertion supports strict-depth fixtures without throwing', () => {
  const source = {
    id: 'counter-source',
    type: 'counter',
    widthCm: 100,
    depthCm: 50,
    placement: { xCm: 100, yCm: 100, zCm: 0, rotationZDeg: 0, wallId: 'free' },
  };
  const stool = {
    id: 'stool-new',
    type: 'bar-stool',
    widthCm: 60,
    depthCm: 55,
    placement: { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 270, wallId: 'free' },
  };

  const result = planFreeSideInsertion({
    modules: [source],
    insertedModules: [stool],
    targetModuleId: source.id,
    side: 'right',
    standType: 'island',
    standXCm: 500,
    standYCm: 500,
  });

  assert.equal(result.ok, true);
  assert.equal(result.placements.has(stool.id), true);
  assert.equal(result.placements.get(stool.id).rotationZDeg, 270);
});
'''
if "free-side insertion supports strict-depth fixtures without throwing" not in t:
    idx = t.find(needle)
    if idx < 0:
        t += regression
    else:
        t = t[:idx] + regression + '\n' + t[idx:]
test_path.write_text(t)
print('Restored createFreeSideFixturePlacement and added regression test.')
