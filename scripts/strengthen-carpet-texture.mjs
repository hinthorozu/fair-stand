import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const oldGenerator = `        const fine = (random() - 0.5) * 34;\n        const fiber = Math.sin((x * 0.72) + (y * 0.18)) * 5;\n        const value = Math.max(72, Math.min(184, 128 + fine + fiber));\n        const bump = Math.max(88, Math.min(168, 128 + fine * 0.9 + fiber * 1.5));`;
const newGenerator = `        const fine = (random() - 0.5) * 28;\n        const weaveA = Math.sin((x * 0.34) + (y * 0.11)) * 11;\n        const weaveB = Math.sin((x * 0.08) - (y * 0.27)) * 7;\n        const tuft = Math.sin((x + y) * 0.055) * 5;\n        const value = Math.max(62, Math.min(194, 128 + fine + weaveA + weaveB + tuft));\n        const bump = Math.max(72, Math.min(184, 128 + fine * 0.75 + weaveA * 1.45 + weaveB * 1.15 + tuft));`;

if (!source.includes(oldGenerator)) throw new Error('Carpet generator target not found');
source = source.replace(oldGenerator, newGenerator);

const oldMaterial = `      material.bumpScale = 0.018;\n      if (stageLayout) {\n        const repeatX = Math.max(2, stageLayout.widthM / 0.7);\n        const repeatY = Math.max(2, stageLayout.depthM / 0.7);`;
const newMaterial = `      material.bumpScale = 0.032;\n      if (stageLayout) {\n        // Slightly larger weave remains readable from normal editing distance,\n        // while still staying subtle enough not to look like a printed pattern.\n        const repeatX = Math.max(2, stageLayout.widthM / 1.05);\n        const repeatY = Math.max(2, stageLayout.depthM / 1.05);`;

if (!source.includes(oldMaterial)) throw new Error('Carpet material target not found');
source = source.replace(oldMaterial, newMaterial);

fs.writeFileSync(path, source);
