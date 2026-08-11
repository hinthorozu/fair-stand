import fs from 'node:fs';

const path = 'test/modulePlacement.test.js';
let s = fs.readFileSync(path, 'utf8');
if (s.includes("counter side faces snap flush to perpendicular walls")) process.exit(0);

const marker = `\ntest('physical module depth rejects parallel bodies that are too close', () => {`;
if (!s.includes(marker)) throw new Error('test insertion marker not found');

const block = `\ntest('counter side faces snap flush to perpendicular walls', () => {\n  const leftWall = [{\n    id: 'left-wall', widthCm: 400,\n    placement: { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 90, wallId: 'left' },\n  }];\n  const left = snapPlacementToModules({\n    moduleId: 'counter', widthCm: 100, depthCm: 50,\n    pointerXCm: 55, pointerYCm: 125, rotationZDeg: 0, modules: leftWall,\n    standType: 'u-stand', standXCm: 800, standYCm: 600,\n  });\n  assert.equal(left?.snapKind, 'face');\n  assert.equal(left?.placement.xCm, 5);\n  assert.equal(validatePlacementAgainstModules({\n    moduleId: 'counter', widthCm: 100, depthCm: 50, placement: left.placement, modules: leftWall,\n    standType: 'u-stand', standXCm: 800, standYCm: 600,\n  }).ok, true);\n\n  const rightWall = [{\n    id: 'right-wall', widthCm: 400,\n    placement: { xCm: 800, yCm: 0, zCm: 0, rotationZDeg: 270, wallId: 'right' },\n  }];\n  const right = snapPlacementToModules({\n    moduleId: 'counter', widthCm: 100, depthCm: 50,\n    pointerXCm: 745, pointerYCm: 125, rotationZDeg: 0, modules: rightWall,\n    standType: 'u-stand', standXCm: 800, standYCm: 600,\n  });\n  assert.equal(right?.snapKind, 'face');\n  assert.equal(right?.placement.xCm, 695);\n  assert.equal(validatePlacementAgainstModules({\n    moduleId: 'counter', widthCm: 100, depthCm: 50, placement: right.placement, modules: rightWall,\n    standType: 'u-stand', standXCm: 800, standYCm: 600,\n  }).ok, true);\n});\n\ntest('rotated counter side face snaps flush to a perpendicular back wall', () => {\n  const backWall = [{\n    id: 'back-wall', widthCm: 500,\n    placement: { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' },\n  }];\n  const snapped = snapPlacementToModules({\n    moduleId: 'counter', widthCm: 100, depthCm: 50,\n    pointerXCm: 125, pointerYCm: 55, rotationZDeg: 90, modules: backWall,\n    standType: 'u-stand', standXCm: 800, standYCm: 600,\n  });\n  assert.equal(snapped?.snapKind, 'face');\n  assert.equal(snapped?.placement.yCm, 5);\n  assert.equal(validatePlacementAgainstModules({\n    moduleId: 'counter', widthCm: 100, depthCm: 50, placement: snapped.placement, modules: backWall,\n    standType: 'u-stand', standXCm: 800, standYCm: 600,\n  }).ok, true);\n});\n`;

s = s.replace(marker, block + marker);
fs.writeFileSync(path, s);
console.log('Banko four-side snap tests added.');
