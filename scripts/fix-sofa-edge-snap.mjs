import fs from 'node:fs';

const path = 'src/modulePlacement.js';
let s = fs.readFileSync(path, 'utf8');

s = s.replace(
`function createFreePlacement({
  widthCm,
  depthCm = null,
  pointerXCm,
  pointerYCm,
  standXCm,
  standYCm,
  rotationZDeg,
}) {`,
`function createFreePlacement({
  moduleType = null,
  widthCm,
  depthCm = null,
  pointerXCm,
  pointerYCm,
  standXCm,
  standYCm,
  standType = null,
  rotationZDeg,
}) {`,
);

s = s.replace(
`function createFreePlacement({
  widthCm,
  depthCm = null,
  pointerXCm,
  pointerYCm,
  standXCm,
  standYCm,
  standType = null,
  rotationZDeg,
}) {`,
`function createFreePlacement({
  moduleType = null,
  widthCm,
  depthCm = null,
  pointerXCm,
  pointerYCm,
  standXCm,
  standYCm,
  standType = null,
  rotationZDeg,
}) {`,
);

s = s.replace(
`  const freePlacement = strictMovingDepth ? createFreePlacement({
    widthCm: width,`,
`  const freePlacement = strictMovingDepth ? createFreePlacement({
    moduleType,
    widthCm: width,`,
);

s = s.replace(
`export function snapPlacementToStand({
  standType,
  widthCm,`,
`export function snapPlacementToStand({
  standType,
  moduleType = null,
  widthCm,`,
);

s = s.replace(
`  const freePlacement = createFreePlacement({
    widthCm: width,`,
`  const freePlacement = createFreePlacement({
    moduleType,
    widthCm: width,`,
);

s = s.replace(
`    standXCm,
    standYCm,
    rotationZDeg: resolvedRotation,`,
`    standXCm,
    standYCm,
    standType,
    rotationZDeg: resolvedRotation,`,
);

s = s.replace(
`    standXCm: xLimit,
    standYCm: yLimit,
    rotationZDeg: preferredRotation,`,
`    standXCm: xLimit,
    standYCm: yLimit,
    standType,
    rotationZDeg: preferredRotation,`,
);

const oldEdgeBlock = `  if (strictDepth) {
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
  }`;

const globalWallEdgeBlock = `  if (strictDepth) {
    const edgeSnap = MODULE_PLACEMENT_SNAP_CM;
    const wallFaceOffsetCm = MODULE_COLLISION_DEPTH_CM / 2;
    const activeWalls = getAllowedWallIds(standType);
    const leftEdgeCm = activeWalls.includes('left') ? wallFaceOffsetCm : 0;
    const rightEdgeCm = activeWalls.includes('right') ? xLimit - wallFaceOffsetCm : xLimit;
    const backEdgeCm = activeWalls.includes('back') ? wallFaceOffsetCm : 0;

    if (!vertical) {
      if (xCm - leftEdgeCm <= edgeSnap + EPSILON_CM) xCm = leftEdgeCm;
      if (rightEdgeCm - (xCm + width) <= edgeSnap + EPSILON_CM) xCm = rightEdgeCm - width;
      if ((yCm - halfDepth) - backEdgeCm <= edgeSnap + EPSILON_CM) yCm = backEdgeCm + halfDepth;
      if (yLimit - (yCm + halfDepth) <= edgeSnap + EPSILON_CM) yCm = yLimit - halfDepth;
    } else {
      if ((xCm - halfDepth) - leftEdgeCm <= edgeSnap + EPSILON_CM) xCm = leftEdgeCm + halfDepth;
      if (rightEdgeCm - (xCm + halfDepth) <= edgeSnap + EPSILON_CM) xCm = rightEdgeCm - halfDepth;
      if (yCm - backEdgeCm <= edgeSnap + EPSILON_CM) yCm = backEdgeCm;
      if (yLimit - (yCm + width) <= edgeSnap + EPSILON_CM) yCm = yLimit - width;
    }
  }`;

const sofaOnlyEdgeBlock = `  if (strictDepth) {
    const edgeSnap = MODULE_PLACEMENT_SNAP_CM;
    const useWallInnerFaces = moduleType === 'sofa-set';
    const wallFaceOffsetCm = MODULE_COLLISION_DEPTH_CM / 2;
    const activeWalls = useWallInnerFaces ? getAllowedWallIds(standType) : [];
    const leftEdgeCm = activeWalls.includes('left') ? wallFaceOffsetCm : 0;
    const rightEdgeCm = activeWalls.includes('right') ? xLimit - wallFaceOffsetCm : xLimit;
    const backEdgeCm = activeWalls.includes('back') ? wallFaceOffsetCm : 0;

    if (!vertical) {
      if (xCm - leftEdgeCm <= edgeSnap + EPSILON_CM) xCm = leftEdgeCm;
      if (rightEdgeCm - (xCm + width) <= edgeSnap + EPSILON_CM) xCm = rightEdgeCm - width;
      if ((yCm - halfDepth) - backEdgeCm <= edgeSnap + EPSILON_CM) yCm = backEdgeCm + halfDepth;
      if (yLimit - (yCm + halfDepth) <= edgeSnap + EPSILON_CM) yCm = yLimit - halfDepth;
    } else {
      if ((xCm - halfDepth) - leftEdgeCm <= edgeSnap + EPSILON_CM) xCm = leftEdgeCm + halfDepth;
      if (rightEdgeCm - (xCm + halfDepth) <= edgeSnap + EPSILON_CM) xCm = rightEdgeCm - halfDepth;
      if (yCm - backEdgeCm <= edgeSnap + EPSILON_CM) yCm = backEdgeCm;
      if (yLimit - (yCm + width) <= edgeSnap + EPSILON_CM) yCm = yLimit - width;
    }
  }`;

if (!s.includes(sofaOnlyEdgeBlock)) {
  if (s.includes(globalWallEdgeBlock)) s = s.replace(globalWallEdgeBlock, sofaOnlyEdgeBlock);
  else if (s.includes(oldEdgeBlock)) s = s.replace(oldEdgeBlock, sofaOnlyEdgeBlock);
  else throw new Error('edge snap block not found');
}

fs.writeFileSync(path, s);

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');
scene = scene.replace(
`    const snapped = snapPlacementToStand({
      standType: stageLayout.standType,
      widthCm: moduleState.widthCm,`,
`    const snapped = snapPlacementToStand({
      standType: stageLayout.standType,
      moduleType: moduleState.type,
      widthCm: moduleState.widthCm,`,
);
fs.writeFileSync(scenePath, scene);

const testPath = 'test/sofaSet.test.js';
let t = fs.readFileSync(testPath, 'utf8');
const marker = 'koltuk takımı duvarın 5 cm iç yüzüne köşede tam oturur';
if (!t.includes(marker)) {
  t += `\n\ntest('${marker}', () => {\n  const left = snapPlacementToStand({ standType: 'l-left', moduleType: 'sofa-set', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 120, pointerYCm: 120, standXCm: 600, standYCm: 600 });\n  assert.equal(left.ok, true);\n  assert.equal(left.placement.xCm, 5);\n  assert.equal(left.placement.yCm, 80);\n\n  const right = snapPlacementToStand({ standType: 'l-right', moduleType: 'sofa-set', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 480, pointerYCm: 120, standXCm: 600, standYCm: 600 });\n  assert.equal(right.ok, true);\n  assert.equal(right.placement.xCm, 445);\n  assert.equal(right.placement.yCm, 80);\n\n  const island = snapPlacementToStand({ standType: 'island', moduleType: 'sofa-set', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 120, pointerYCm: 120, standXCm: 600, standYCm: 600 });\n  assert.equal(island.ok, true);\n  assert.equal(island.placement.xCm, 0);\n  assert.equal(island.placement.yCm, 75);\n});\n`;
} else {
  t = t.replaceAll("standType: 'l-left', widthCm: 150", "standType: 'l-left', moduleType: 'sofa-set', widthCm: 150");
  t = t.replaceAll("standType: 'l-right', widthCm: 150", "standType: 'l-right', moduleType: 'sofa-set', widthCm: 150");
  t = t.replaceAll("standType: 'island', widthCm: 150", "standType: 'island', moduleType: 'sofa-set', widthCm: 150");
}
fs.writeFileSync(testPath, t);
