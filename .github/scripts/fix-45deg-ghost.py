from pathlib import Path

p = Path('src/modulePlacement.js')
s = p.read_text()
old = """    const centerXCm = clamp(snapCm(pointerX, placementSnapCm), extents.halfX, xLimit - extents.halfX);\n    const centerYCm = clamp(snapCm(pointerY, placementSnapCm), extents.halfY, yLimit - extents.halfY);"""
new = """    const centerXCm = clamp(snapCm(pointerXCm, placementSnapCm), extents.halfX, xLimit - extents.halfX);\n    const centerYCm = clamp(snapCm(pointerYCm, placementSnapCm), extents.halfY, yLimit - extents.halfY);"""
if old not in s:
    raise SystemExit('45deg pointer bug block not found')
s = s.replace(old, new, 1)
p.write_text(s)

p = Path('tests/moduleBehavior.test.js')
s = p.read_text()
s = s.replace(
    "  rotateModulePlacementAroundCenter,\n  validateModulePlacement,\n",
    "  rotateModulePlacementAroundCenter,\n  snapPlacementToStand,\n  validateModulePlacement,\n",
    1,
)
append = r'''

test('Bar Taburesi 45 degree catalog preview placement stays valid', () => {
  const result = snapPlacementToStand({
    standType: 'island',
    moduleType: 'bar-stool',
    widthCm: 60,
    depthCm: 55,
    forceFree: true,
    pointerXCm: 150,
    pointerYCm: 150,
    standXCm: 400,
    standYCm: 400,
    preferredRotationZDeg: 315,
    rotationLocked: true,
  });
  assert.equal(result.ok, true);
  assert.equal(result.placement.rotationZDeg, 315);
  assert.equal(result.placement.wallId, 'free');
});

test('straight Banko 45 degree catalog preview placement stays valid', () => {
  const result = snapPlacementToStand({
    standType: 'island',
    moduleType: 'counter',
    widthCm: 150,
    depthCm: 50,
    forceFree: true,
    pointerXCm: 200,
    pointerYCm: 200,
    standXCm: 500,
    standYCm: 500,
    preferredRotationZDeg: 45,
    rotationLocked: true,
  });
  assert.equal(result.ok, true);
  assert.equal(result.placement.rotationZDeg, 45);
  assert.equal(result.placement.wallId, 'free');
});
'''
if "Bar Taburesi 45 degree catalog preview placement stays valid" not in s:
    s += append
p.write_text(s)
print('Fixed 45-degree ghost placement pointer variables and added regressions.')
