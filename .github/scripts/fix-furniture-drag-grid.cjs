const fs = require('fs');

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const before = `    const snapped = snapPlacementToStand({\n      standType: stageLayout.standType,\n      widthCm: moduleState.widthCm,\n      depthCm: moduleState.depthCm,\n      forceFree: isFloorFixtureType(moduleState.type),`;
const after = `    const snapped = snapPlacementToStand({\n      standType: stageLayout.standType,\n      moduleType: moduleState.type,\n      shape: moduleState.shape,\n      widthCm: moduleState.widthCm,\n      depthCm: moduleState.depthCm,\n      forceFree: isFloorFixtureType(moduleState.type),`;

if (!source.includes(before)) {
  if (source.includes(after)) process.exit(0);
  throw new Error('drag snapPlacementToStand call not found');
}
source = source.replace(before, after);
fs.writeFileSync(path, source);
