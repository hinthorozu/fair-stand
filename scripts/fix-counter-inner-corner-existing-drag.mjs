import fs from 'node:fs';

const path = 'src/scene3d.js';
let s = fs.readFileSync(path, 'utf8');
const from = `    const magneticSnap = snapPlacementToModules({\n      moduleId: moduleState.id,\n      widthCm: moduleState.widthCm,\n      depthCm: moduleState.depthCm,\n      forceFree: moduleState.type === 'counter',\n      pointerXCm: ground.xCm,\n      pointerYCm: ground.yCm,\n      rotationZDeg: dragSession.preferredRotationZDeg,`;
const to = `    const magneticSnap = snapPlacementToModules({\n      moduleId: moduleState.id,\n      moduleType: moduleState.type,\n      widthCm: moduleState.widthCm,\n      depthCm: moduleState.depthCm,\n      forceFree: moduleState.type === 'counter',\n      pointerXCm: ground.xCm,\n      pointerYCm: ground.yCm,\n      rotationZDeg: dragSession.preferredRotationZDeg,`;
const count = s.split(from).length - 1;
if (count !== 1) throw new Error(`expected one existing-drag snap call, found ${count}`);
s = s.replace(from, to);
fs.writeFileSync(path, s);
console.log('Existing banko drag now receives moduleType.');
