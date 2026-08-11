import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, content) { fs.writeFileSync(path, content); }
function replaceOnce(source, from, to, label) {
  const count = source.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected 1 occurrence, found ${count}`);
  return source.replace(from, to);
}
function replaceCount(source, from, to, expected, label) {
  const count = source.split(from).length - 1;
  if (count !== expected) throw new Error(`${label}: expected ${expected}, found ${count}`);
  return source.split(from).join(to);
}

// modulePlacement.js
{
  const path = 'src/modulePlacement.js';
  let s = read(path);

  s = replaceOnce(
    s,
    `export function snapPlacementToModules({\n  moduleId = null,\n  widthCm,\n  pointerXCm,`,
    `export function snapPlacementToModules({\n  moduleId = null,\n  widthCm,\n  depthCm = null,\n  pointerXCm,`,
    'snap module face depth signature',
  );

  s = replaceOnce(
    s,
    `  const resolvedRotation = normalizeModuleRotationZDeg(rotationZDeg);\n  const movingAxis = isVerticalModuleRotation(resolvedRotation) ? 'y' : 'x';\n  const candidates = [];`,
    `  const resolvedRotation = normalizeModuleRotationZDeg(rotationZDeg);\n  const movingAxis = isVerticalModuleRotation(resolvedRotation) ? 'y' : 'x';\n  const strictMovingDepth = hasStrictDepthBounds(depthCm);\n  const movingDepthCm = strictMovingDepth ? Number(depthCm) : MODULE_COLLISION_DEPTH_CM;\n  const freePlacement = strictMovingDepth ? createFreePlacement({\n    widthCm: width,\n    depthCm,\n    pointerXCm: pointerX,\n    pointerYCm: pointerY,\n    standXCm,\n    standYCm,\n    rotationZDeg: resolvedRotation,\n  }) : null;\n  const candidates = [];`,
    'snap module face setup',
  );

  s = replaceOnce(
    s,
    `      placement,\n      widthCm: width,\n      moduleId,\n      modules,`,
    `      placement,\n      widthCm: width,\n      depthCm,\n      moduleId,\n      modules,`,
    'snap validation moving depth',
  );

  s = replaceOnce(
    s,
    `    const target = getGroundSegment(targetModule);\n    if (!target) return;\n\n    if (target.axis === movingAxis) {`,
    `    const target = getGroundSegment(targetModule);\n    if (!target) return;\n\n    if (strictMovingDepth) {\n      if (!freePlacement || target.axis !== movingAxis) return;\n\n      const targetDepthCm = getModuleCollisionDepthCm(targetModule);\n      const faceGapCm = (movingDepthCm + targetDepthCm) / 2;\n\n      [-1, 1].forEach((direction) => {\n        const placement = createModulePlacement({\n          ...freePlacement,\n          xCm: movingAxis === 'y'\n            ? target.fixedCm + (direction * faceGapCm)\n            : freePlacement.xCm,\n          yCm: movingAxis === 'x'\n            ? target.fixedCm + (direction * faceGapCm)\n            : freePlacement.yCm,\n          rotationZDeg: resolvedRotation,\n          wallId: 'free',\n        });\n\n        const movingSegment = getGroundSegment({ widthCm: width, depthCm, placement });\n        if (!movingSegment) return;\n        const longitudinalOverlap = movingSegment.startCm < target.endCm - EPSILON_CM\n          && target.startCm < movingSegment.endCm - EPSILON_CM;\n        if (!longitudinalOverlap) return;\n\n        addCandidate(placement, targetModule.id, 'face', -1);\n      });\n      return;\n    }\n\n    if (target.axis === movingAxis) {`,
    'counter face contact snap',
  );

  write(path, s);
}

// scene3d.js
{
  const path = 'src/scene3d.js';
  let s = read(path);
  s = replaceCount(
    s,
    `const magneticSnap = moduleState.type === 'counter' ? null : snapPlacementToModules({`,
    `const magneticSnap = snapPlacementToModules({`,
    2,
    'enable counter face snap',
  );
  s = replaceCount(
    s,
    `      modules: renderedModules.filter((module) => module.type !== 'counter'),`,
    `      modules: moduleState.type === 'counter'\n        ? renderedModules\n        : renderedModules.filter((module) => module.type !== 'counter'),`,
    2,
    'counter face snap targets',
  );
  write(path, s);
}

// modulePlacement.test.js
{
  const path = 'test/modulePlacement.test.js';
  let s = read(path);
  const marker = `\ntest('physical module depth rejects parallel bodies that are too close', () => {`;
  const testBlock = `\ntest('counter snaps flush to a parallel module face without overlapping it', () => {\n  const modules = [{\n    id: 'wall',\n    widthCm: 300,\n    placement: { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' },\n  }];\n\n  const snapped = snapPlacementToModules({\n    moduleId: 'counter',\n    widthCm: 100,\n    depthCm: 50,\n    pointerXCm: 150,\n    pointerYCm: 25,\n    rotationZDeg: 0,\n    modules,\n    standType: 'u-stand',\n    standXCm: 800,\n    standYCm: 600,\n  });\n\n  assert.equal(snapped?.snapKind, 'face');\n  assert.equal(snapped?.placement.xCm, 100);\n  assert.equal(snapped?.placement.yCm, 30);\n\n  const validation = validatePlacementAgainstModules({\n    moduleId: 'counter',\n    widthCm: 100,\n    depthCm: 50,\n    placement: snapped.placement,\n    modules,\n    standType: 'u-stand',\n    standXCm: 800,\n    standYCm: 600,\n  });\n  assert.equal(validation.ok, true);\n});\n`;
  s = replaceOnce(s, marker, testBlock + marker, 'counter face snap regression test');
  write(path, s);
}

// Changelog.md
{
  const path = 'Changelog.md';
  let s = read(path);
  if (!s.includes('432. Bankolar paralel bir duvar/modül yüzüne')) {
    s += `\n\n## Banko yüzeye yaslama düzeltmesi\n\n432. Bankolar paralel bir duvar/modül yüzüne yaklaştırıldığında gerçek fiziksel yüzey temasıyla snap olacak şekilde güncellendi; 50 cm banko derinliği ile hedef modülün kasa derinliği birlikte hesaba katılır.\n433. Temas artık geçerli yerleşimdir; gövdeler birbirinin içine girdiğinde mevcut collision uyarısı korunur. Böylece 50 cm banko, 10 cm duvar modülüne merkez çizgileri arasında 30 cm mesafede sıfır yüzey temasıyla yaslanabilir.\n434. Katalogdan bırakma ve sahnedeki bankoyu taşıma akışlarında aynı yüzeye yaslama snap davranışı etkinleştirildi; normal duvar modüllerinin bankoya manyetik snap davranışı değiştirilmedi.\n`;
  }
  write(path, s);
}

console.log('Counter face snap patch applied.');
