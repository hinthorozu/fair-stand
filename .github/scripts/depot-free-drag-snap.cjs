const fs = require('fs');

const sourcePath = 'src/modulePlacement.js';
let source = fs.readFileSync(sourcePath, 'utf8');

const constantAnchor = "const EPSILON_CM = 0.001;";
if (!source.includes(constantAnchor)) throw new Error('EPSILON anchor not found');
source = source.replace(
  constantAnchor,
  "const DEPOT_FREE_NO_MAGNETIC_SNAP_TYPES = new Set(['mini-fridge', 'kettle', 'coat-rack']);\n\n" + constantAnchor,
);

const functionAnchor = `  snapDistanceCm = MODULE_NEIGHBOR_SNAP_DISTANCE_CM,\n} = {}) {\n  const width = Number(widthCm);`;
if (!source.includes(functionAnchor)) throw new Error('snapPlacementToModules anchor not found');
source = source.replace(
  functionAnchor,
  `  snapDistanceCm = MODULE_NEIGHBOR_SNAP_DISTANCE_CM,\n} = {}) {\n  if (DEPOT_FREE_NO_MAGNETIC_SNAP_TYPES.has(moduleType)) return null;\n\n  const width = Number(widthCm);`,
);

fs.writeFileSync(sourcePath, source);

fs.writeFileSync('test/depotFreeDragSnap.test.js', `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { snapPlacementToModules } from '../src/modulePlacement.js';\n\ntest('depot fixtures do not magnetically snap to nearby modules', () => {\n  for (const moduleType of ['mini-fridge', 'kettle', 'coat-rack']) {\n    const result = snapPlacementToModules({\n      moduleType,\n      widthCm: 50,\n      depthCm: 40,\n      pointerXCm: 100,\n      pointerYCm: 100,\n      rotationZDeg: 0,\n      modules: [{\n        id: 'wall-1',\n        type: 'flat-panel',\n        widthCm: 100,\n        placement: { xCm: 100, yCm: 100, zCm: 0, rotationZDeg: 0, wallId: 'free' },\n      }],\n      standType: 'island',\n      standXCm: 500,\n      standYCm: 500,\n    });\n    assert.equal(result, null, moduleType);\n  }\n});\n`);
