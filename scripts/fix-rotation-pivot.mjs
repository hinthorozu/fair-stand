import fs from 'node:fs';

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) throw new Error(`Missing pattern: ${label}`);
  return text.replace(from, to);
}

{
  const path = 'src/modulePlacement.js';
  let text = fs.readFileSync(path, 'utf8');
  const start = text.indexOf('export function rotateModulePlacementAroundCenter(');
  const end = text.indexOf('\nexport function isVerticalModuleRotation', start);
  if (start < 0 || end < 0) throw new Error('rotation function not found');

  const replacement = `export function rotateModulePlacementAroundCenter(placement, widthCm, deltaDeg = 90, depthCm = null) {\n  if (!placement) return null;\n  const width = Number(widthCm);\n  const x = Number(placement.xCm);\n  const y = Number(placement.yCm);\n  if (![width, x, y].every(Number.isFinite) || width <= 0) return null;\n\n  const currentRotation = normalizeModuleRotationZDeg(placement.rotationZDeg);\n  const nextRotation = rotateModuleRotationZDeg(currentRotation, deltaDeg);\n  const currentVertical = isVerticalModuleRotation(currentRotation);\n  const nextVertical = isVerticalModuleRotation(nextRotation);\n\n  // R ile dönüşte modülün dünya merkezini sabit tut. Grid snap yalnız sürükleme/yerleştirmede uygulanır.\n  const centerX = x + (currentVertical ? 0 : width / 2);\n  const centerY = y + (currentVertical ? width / 2 : 0);\n\n  return createModulePlacement({\n    ...placement,\n    xCm: nextVertical ? centerX : centerX - width / 2,\n    yCm: nextVertical ? centerY - width / 2 : centerY,\n    rotationZDeg: nextRotation,\n  });\n}\n`;
  text = text.slice(0, start) + replacement + text.slice(end);
  fs.writeFileSync(path, text);
}

{
  const path = 'test/modulePlacement.test.js';
  let text = fs.readFileSync(path, 'utf8');
  const oldTest = `test('selected module center rotation stays on the 50 cm grid', () => {\n  const rotated = rotateModulePlacementAroundCenter({\n    xCm: 100,\n    yCm: 100,\n    zCm: 0,\n    rotationZDeg: 0,\n    wallId: 'free',\n  }, 50, 90);\n\n  assert.equal(rotated.xCm % 50, 0);\n  assert.equal(rotated.yCm % 50, 0);\n  assert.equal(rotated.rotationZDeg, 90);\n});`;
  const newTest = `test('selected module rotation keeps its world center fixed without grid snapping', () => {\n  const rotated = rotateModulePlacementAroundCenter({\n    xCm: 100,\n    yCm: 100,\n    zCm: 0,\n    rotationZDeg: 0,\n    wallId: 'free',\n  }, 50, 90);\n\n  // Başlangıç merkezi (125, 100), dönüş sonrası da aynı kalmalı.\n  assert.equal(rotated.xCm, 125);\n  assert.equal(rotated.yCm, 75);\n  assert.equal(rotated.rotationZDeg, 90);\n});`;
  text = replaceOnce(text, oldTest, newTest, 'rotation grid test');
  fs.writeFileSync(path, text);
}
