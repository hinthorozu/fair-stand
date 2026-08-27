import fs from 'node:fs';

function replaceOnce(file, from, to, label) {
  let text = fs.readFileSync(file, 'utf8');
  if (!text.includes(from)) throw new Error(`Missing patch target: ${label}`);
  text = text.replace(from, to);
  fs.writeFileSync(file, text);
}

const anchor = `    // Dik modül: hedef modül boyunca her 50 cm bağlantı noktasını aday yap.\n`;
const insertion = `    // İnce 50 cm panel, Banko/Baza gibi 50 cm derinlikli bir fixture'ın\n    // kısa yan yüzüne geldiğinde merkez çizgisinden başlatma. Paneli fiziksel\n    // yan yüzün tamamına ortala; böylece 150x50 Banko + 50 panel gerçek flush\n    // köşe bağlantısı oluşturur ve collision motoru bunu yanlışlıkla reddetmez.\n    const targetDepthCm = getModuleCollisionDepthCm(targetModule);\n    const thinMovingModule = movingDepthCm <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM;\n    const matchesFixtureSide = thinMovingModule\n      && usesLogicalFixtureEndpoint(targetModule?.type)\n      && targetDepthCm > MODULE_COLLISION_DEPTH_CM + EPSILON_CM\n      && nearlyEqual(width, targetDepthCm);\n\n    if (matchesFixtureSide) {\n      [target.startCm, target.endCm].forEach((endpointCm) => {\n        const placement = createModulePlacement({\n          xCm: movingAxis === 'y' ? endpointCm : target.fixedCm - width / 2,\n          yCm: movingAxis === 'y' ? target.fixedCm - width / 2 : endpointCm,\n          zCm: 0,\n          rotationZDeg: resolvedRotation,\n          wallId: 'free',\n        });\n        placement.wallId = inferPlacementWallId({ placement, standType, standXCm });\n        addCandidate(placement, targetModule.id, 'fixture-side', -2);\n      });\n    }\n\n${anchor}`;
replaceOnce('src/modulePlacement.js', anchor, insertion, 'fixture side snap insertion');

const testFile = 'test/modulePlacement.test.js';
let tests = fs.readFileSync(testFile, 'utf8');
const testName = '50 cm panel snaps centered to the short side of Banko 150';
if (!tests.includes(testName)) {
  tests += `\n\ntest('${testName}', () => {\n  const modules = [{\n    id: 'counter-150',\n    type: 'counter',\n    widthCm: 150,\n    depthCm: 50,\n    placement: { xCm: 100, yCm: 200, zCm: 0, rotationZDeg: 0, wallId: 'free' },\n  }];\n\n  const result = snapPlacementToModules({\n    moduleId: 'panel-50',\n    moduleType: 'flat-panel',\n    widthCm: 50,\n    pointerXCm: 250,\n    pointerYCm: 200,\n    rotationZDeg: 90,\n    modules,\n    standType: 'island',\n    standXCm: 800,\n    standYCm: 600,\n  });\n\n  assert.equal(result?.snapKind, 'fixture-side');\n  assert.deepEqual(result?.placement, {\n    xCm: 250, yCm: 175, zCm: 0, rotationZDeg: 90, wallId: 'free',\n  });\n});\n`;
  fs.writeFileSync(testFile, tests);
}
