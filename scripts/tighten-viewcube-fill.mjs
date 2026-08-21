import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const oldBlock = `    const distance = THREE.MathUtils.clamp(\n      depthHalf + perspectiveFit,\n      controls.minDistance,\n      controls.maxDistance,\n    );`;

const newBlock = `    // Do not add the full projected scene depth to the fit distance. That conservative\n    // term made isometric/home presets pull far away even though the stand already fit.\n    // A small depth allowance keeps near corners safe while letting the stand actually\n    // occupy the intended ~82% of the viewport.\n    const depthAllowance = depthHalf * 0.16;\n    const distance = THREE.MathUtils.clamp(\n      perspectiveFit + depthAllowance,\n      controls.minDistance,\n      controls.maxDistance,\n    );`;

if (!source.includes(oldBlock)) throw new Error('ViewCube distance block not found');
source = source.replace(oldBlock, newBlock);
fs.writeFileSync(path, source);
