import fs from 'node:fs';

const path = 'src/scene3d.js';
let s = fs.readFileSync(path, 'utf8');

const replacements = [
  [
    "addSofa({ x: 0, z: -depthM / 2 + 0.39, seatWidth: 1.50, seatDepth: 0.78, twoSeat: true, facing: 'front' });",
    "addSofa({ x: 0, z: -depthM / 2 + 0.225, seatWidth: 1.50, seatDepth: 0.45, twoSeat: true, facing: 'front' });",
  ],
  [
    "addSofa({ x: -0.425, z: depthM / 2 - 0.375, seatWidth: 0.65, seatDepth: 0.75, facing: 'back' });",
    "addSofa({ x: -0.425, z: depthM / 2 - 0.225, seatWidth: 0.65, seatDepth: 0.45, facing: 'back' });",
  ],
  [
    "addSofa({ x: 0.425, z: depthM / 2 - 0.375, seatWidth: 0.65, seatDepth: 0.75, facing: 'back' });",
    "addSofa({ x: 0.425, z: depthM / 2 - 0.225, seatWidth: 0.65, seatDepth: 0.45, facing: 'back' });",
  ],
  ["glass.position.set(0, 0.42, 0.10);", "glass.position.set(0, 0.42, 0);"],
  ["stem.position.set(0, 0.21, 0.10);", "stem.position.set(0, 0.21, 0);"],
  ["base.position.set(0, 0.018, 0.10);", "base.position.set(0, 0.018, 0);"],
];

for (const [oldText, newText] of replacements) {
  if (s.includes(newText)) continue;
  if (!s.includes(oldText)) throw new Error(`Sofa geometry anchor not found: ${oldText}`);
  s = s.replace(oldText, newText);
}

fs.writeFileSync(path, s);
