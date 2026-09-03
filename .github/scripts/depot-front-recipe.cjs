const fs = require('fs');
const path = 'src/autoDepot.js';
let s = fs.readFileSync(path, 'utf8');
const before = `function addFront(specs, xCm, yCm, widthCm) {
  if (widthCm === 100) { specs.push(door(xCm, yCm)); return; }
  if (widthCm === 150) { specs.push(wall(50, xCm, yCm), door(xCm + 50, yCm)); return; }
  specs.push(wall(50, xCm, yCm), door(xCm + 50, yCm), wall(50, xCm + 150, yCm));
}`;
const after = `function addFront(specs, xCm, yCm, widthCm, standType) {
  if (widthCm === 100) { specs.push(door(xCm, yCm)); return; }
  if (widthCm === 150) { specs.push(wall(50, xCm, yCm), door(xCm + 50, yCm)); return; }
  if (widthCm === 200) {
    // 2 m depo önü: 100 cm kapı + 100 cm panel.
    // Sırt duvar / ada (ve U) standda kapı solda. L standlarda kapı dış duvarın tersinde, stand içine doğru kalır.
    if (standType === 'l-left') specs.push(wall(100, xCm, yCm), door(xCm + 100, yCm));
    else specs.push(door(xCm, yCm), wall(100, xCm + 100, yCm));
    return;
  }
  specs.push(door(xCm, yCm), wall(widthCm - 100, xCm + 100, yCm));
}`;
if (!s.includes(before)) throw new Error('addFront anchor missing');
s = s.replace(before, after);
const callBefore = `  addFront(specs, xCm, yCm + size.depthCm, size.widthCm);`;
const callAfter = `  addFront(specs, xCm, yCm + size.depthCm, size.widthCm, standType);`;
if (!s.includes(callBefore)) throw new Error('addFront call anchor missing');
s = s.replace(callBefore, callAfter);
fs.writeFileSync(path, s);

fs.writeFileSync('test/depotFrontRecipe.test.js', `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { planAutomaticDepot } from '../src/autoDepot.js';\n\nfunction front(plan) {\n  return plan.specs.filter((s) => s.kind === 'door' || (s.kind === 'wall' && s.placement.yCm === plan.originYCm + plan.depthCm));\n}\n\nfor (const standType of ['back-wall', 'island', 'u-stand', 'l-right']) {\n  test('2m depot door is left for ' + standType, () => {\n    const plan = planAutomaticDepot({ standType, standXCm: 600, standYCm: 500, sizeKey: '200x100' });\n    assert.equal(plan.ok, true);\n    const items = front(plan);\n    assert.deepEqual(items.map((s) => [s.kind, s.widthCm, s.placement.xCm - plan.originXCm]), [['door', 100, 0], ['wall', 100, 100]]);\n  });\n}\n\ntest('2m depot on L-left keeps door toward stand interior', () => {\n  const plan = planAutomaticDepot({ standType: 'l-left', standXCm: 600, standYCm: 500, sizeKey: '200x100' });\n  assert.equal(plan.ok, true);\n  const items = front(plan);\n  assert.deepEqual(items.map((s) => [s.kind, s.widthCm, s.placement.xCm - plan.originXCm]), [['wall', 100, 0], ['door', 100, 100]]);\n});\n\nfor (const sizeKey of ['200x100', '200x200']) {\n  test(sizeKey + ' uses exactly one 100cm door and one 100cm panel', () => {\n    const plan = planAutomaticDepot({ standType: 'back-wall', standXCm: 600, standYCm: 500, sizeKey });\n    const items = front(plan);\n    assert.equal(items.filter((s) => s.kind === 'door' && s.widthCm === 100).length, 1);\n    assert.equal(items.filter((s) => s.kind === 'wall' && s.widthCm === 100).length, 1);\n  });\n}\n`);
