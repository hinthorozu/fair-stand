const fs = require('fs');

const placementPath = 'src/modulePlacement.js';
let source = fs.readFileSync(placementPath, 'utf8');

if (!source.includes('export function getModulePlacementSnapCm(moduleType)')) {
  const anchor = "export function snapCm(value, stepCm = MODULE_PLACEMENT_SNAP_CM) {\n  const number = Number(value);\n  const step = Number(stepCm);\n  if (!Number.isFinite(number) || !Number.isFinite(step) || step <= 0) return null;\n  return Math.round(number / step) * step;\n}\n";
  if (!source.includes(anchor)) throw new Error('snapCm anchor not found');
  source = source.replace(anchor, anchor + "\nexport function getModulePlacementSnapCm(moduleType) {\n  return moduleType === 'sofa-set' || moduleType === 'table-chair-set-eames' ? 10 : MODULE_PLACEMENT_SNAP_CM;\n}\n");
}

source = source.replace(
  "function snapDepthCenterCm(value, depthCm) {\n  const depth = Number(depthCm);\n  const halfDepth = depth / 2;\n  return halfDepth + snapCm(Number(value) - halfDepth);\n}",
  "function snapDepthCenterCm(value, depthCm, stepCm = MODULE_PLACEMENT_SNAP_CM) {\n  const depth = Number(depthCm);\n  const halfDepth = depth / 2;\n  return halfDepth + snapCm(Number(value) - halfDepth, stepCm);\n}",
);

const freeMarker = 'function createFreePlacement({';
const freeStart = source.indexOf(freeMarker);
if (freeStart < 0) throw new Error('createFreePlacement not found');
const bodyStartToken = '}) {';
const tokenPos = source.indexOf(bodyStartToken, freeStart);
if (tokenPos < 0) throw new Error('createFreePlacement body start not found');
const bodyOpen = tokenPos + bodyStartToken.length - 1;
let depth = 0;
let freeEnd = -1;
for (let i = bodyOpen; i < source.length; i += 1) {
  if (source[i] === '{') depth += 1;
  else if (source[i] === '}') {
    depth -= 1;
    if (depth === 0) { freeEnd = i; break; }
  }
}
if (freeEnd < 0) throw new Error('createFreePlacement body end not found');

let freeBlock = source.slice(freeStart, freeEnd + 1);
if (!freeBlock.includes('const placementSnapCm = getModulePlacementSnapCm(moduleType);')) {
  freeBlock = freeBlock.replace(
    "  const width = Number(widthCm);\n",
    "  const width = Number(widthCm);\n  const placementSnapCm = getModulePlacementSnapCm(moduleType);\n",
  );
  freeBlock = freeBlock.replace(
    'clamp(snapCm(Number(pointerXCm) - width / 2), 0, maxX)',
    'clamp(snapCm(Number(pointerXCm) - width / 2, placementSnapCm), 0, maxX)',
  );
  freeBlock = freeBlock.replace(
    'strictDepth ? snapDepthCenterCm(pointerXCm, depthCm) : snapCm(pointerXCm)',
    'strictDepth ? snapDepthCenterCm(pointerXCm, depthCm, placementSnapCm) : snapCm(pointerXCm, placementSnapCm)',
  );
  freeBlock = freeBlock.replace(
    'clamp(snapCm(Number(pointerYCm) - width / 2), 0, maxY)',
    'clamp(snapCm(Number(pointerYCm) - width / 2, placementSnapCm), 0, maxY)',
  );
  freeBlock = freeBlock.replace(
    'strictDepth ? snapDepthCenterCm(pointerYCm, depthCm) : snapCm(pointerYCm)',
    'strictDepth ? snapDepthCenterCm(pointerYCm, depthCm, placementSnapCm) : snapCm(pointerYCm, placementSnapCm)',
  );
  freeBlock = freeBlock.replace(
    "const useWallInnerFaces = moduleType === 'sofa-set' || moduleType === 'table-chair-set' || moduleType === 'bar-stool';",
    "const useWallInnerFaces = moduleType === 'sofa-set' || moduleType === 'table-chair-set-eames' || moduleType === 'bar-stool';",
  );
  source = source.slice(0, freeStart) + freeBlock + source.slice(freeEnd + 1);
}

if (source.includes("moduleType === 'table-chair-set'")) {
  throw new Error('legacy table-chair-set token still present in modulePlacement.js');
}

fs.writeFileSync(placementPath, source);

const testPath = 'test/modulePlacement.test.js';
let test = fs.readFileSync(testPath, 'utf8');
if (!test.includes('getModulePlacementSnapCm,')) {
  test = test.replace('  getAllowedWallIds,\n', '  getAllowedWallIds,\n  getModulePlacementSnapCm,\n');
}
if (!test.includes("furniture modules use a 10 cm free-placement grid")) {
  test += `\n\ntest('furniture modules use a 10 cm free-placement grid while other modules keep 50 cm', () => {\n  assert.equal(getModulePlacementSnapCm('sofa-set'), 10);\n  assert.equal(getModulePlacementSnapCm('table-chair-set-eames'), 10);\n  assert.equal(getModulePlacementSnapCm('counter'), 50);\n\n  for (const moduleType of ['sofa-set', 'table-chair-set-eames']) {\n    const result = snapPlacementToStand({\n      standType: 'island',\n      moduleType,\n      widthCm: 150,\n      depthCm: 150,\n      forceFree: true,\n      pointerXCm: 343,\n      pointerYCm: 343,\n      standXCm: 800,\n      standYCm: 600,\n    });\n    assert.equal(result.ok, true);\n    assert.equal(result.placement.wallId, 'free');\n    assert.equal(result.placement.xCm, 270);\n    assert.equal(result.placement.yCm, 345);\n  }\n\n  const regular = snapPlacementToStand({\n    standType: 'island',\n    moduleType: 'counter',\n    widthCm: 150,\n    depthCm: 150,\n    forceFree: true,\n    pointerXCm: 343,\n    pointerYCm: 343,\n    standXCm: 800,\n    standYCm: 600,\n  });\n  assert.equal(regular.ok, true);\n  assert.equal(regular.placement.xCm, 250);\n  assert.equal(regular.placement.yCm, 325);\n});\n`;
}
fs.writeFileSync(testPath, test);
