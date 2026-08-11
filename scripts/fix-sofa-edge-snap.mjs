import fs from 'node:fs';

const path = 'src/modulePlacement.js';
let s = fs.readFileSync(path, 'utf8');

const oldBlock = `  return createModulePlacement({
    xCm: !vertical
      ? clamp(snapCm(Number(pointerXCm) - width / 2), 0, maxX)
      : clamp(
          strictDepth ? snapDepthCenterCm(pointerXCm, depthCm) : snapCm(pointerXCm),
          minX,
          maxX,
        ),
    yCm: vertical
      ? clamp(snapCm(Number(pointerYCm) - width / 2), 0, maxY)
      : clamp(
          strictDepth ? snapDepthCenterCm(pointerYCm, depthCm) : snapCm(pointerYCm),
          minY,
          maxY,
        ),
    rotationZDeg: rotation,
    wallId: 'free',
  });
`;

const newBlock = `  let xCm = !vertical
    ? clamp(snapCm(Number(pointerXCm) - width / 2), 0, maxX)
    : clamp(
        strictDepth ? snapDepthCenterCm(pointerXCm, depthCm) : snapCm(pointerXCm),
        minX,
        maxX,
      );
  let yCm = vertical
    ? clamp(snapCm(Number(pointerYCm) - width / 2), 0, maxY)
    : clamp(
        strictDepth ? snapDepthCenterCm(pointerYCm, depthCm) : snapCm(pointerYCm),
        minY,
        maxY,
      );

  if (strictDepth) {
    const edgeSnap = MODULE_PLACEMENT_SNAP_CM;
    if (!vertical) {
      if (xCm <= edgeSnap + EPSILON_CM) xCm = 0;
      if (xLimit - (xCm + width) <= edgeSnap + EPSILON_CM) xCm = xLimit - width;
      if (yCm - halfDepth <= edgeSnap + EPSILON_CM) yCm = halfDepth;
      if (yLimit - (yCm + halfDepth) <= edgeSnap + EPSILON_CM) yCm = yLimit - halfDepth;
    } else {
      if (xCm - halfDepth <= edgeSnap + EPSILON_CM) xCm = halfDepth;
      if (xLimit - (xCm + halfDepth) <= edgeSnap + EPSILON_CM) xCm = xLimit - halfDepth;
      if (yCm <= edgeSnap + EPSILON_CM) yCm = 0;
      if (yLimit - (yCm + width) <= edgeSnap + EPSILON_CM) yCm = yLimit - width;
    }
  }

  return createModulePlacement({
    xCm,
    yCm,
    rotationZDeg: rotation,
    wallId: 'free',
  });
`;

if (s.includes(oldBlock)) {
  s = s.replace(oldBlock, newBlock);
} else if (!s.includes('const edgeSnap = MODULE_PLACEMENT_SNAP_CM;')) {
  throw new Error('createFreePlacement anchor not found');
}
fs.writeFileSync(path, s);

const testPath = 'test/sofaSet.test.js';
let t = fs.readFileSync(testPath, 'utf8');
if (!t.includes('koltuk takımı köşelerde iki eksende de sıfıra oturur')) {
  t += `\n\ntest('koltuk takımı köşelerde iki eksende de sıfıra oturur', () => {\n  const tl = snapPlacementToStand({ standType: 'island', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 120, pointerYCm: 120, standXCm: 600, standYCm: 600 });\n  assert.equal(tl.ok, true);\n  assert.equal(tl.placement.xCm, 0);\n  assert.equal(tl.placement.yCm, 75);\n  const br = snapPlacementToStand({ standType: 'island', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 480, pointerYCm: 480, standXCm: 600, standYCm: 600 });\n  assert.equal(br.ok, true);\n  assert.equal(br.placement.xCm, 450);\n  assert.equal(br.placement.yCm, 525);\n});\n`;
  fs.writeFileSync(testPath, t);
}
