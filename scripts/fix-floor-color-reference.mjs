import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');
const before = '      floorColor: currentFloorColor,';
const after = '      floorColor: floorColors[currentFloorType] ?? null,';
if (!source.includes(before)) {
  throw new Error('Expected currentFloorColor reference not found');
}
source = source.replace(before, after);
fs.writeFileSync(path, source);
