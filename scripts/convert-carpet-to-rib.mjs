import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const oldGenerator = `        const fine = (random() - 0.5) * 28;\n        const weaveA = Math.sin((x * 0.34) + (y * 0.11)) * 11;\n        const weaveB = Math.sin((x * 0.08) - (y * 0.27)) * 7;\n        const tuft = Math.sin((x + y) * 0.055) * 5;\n        const value = Math.max(62, Math.min(194, 128 + fine + weaveA + weaveB + tuft));\n        const bump = Math.max(72, Math.min(184, 128 + fine * 0.75 + weaveA * 1.45 + weaveB * 1.15 + tuft));`;

const newGenerator = `        // Exhibition RIP carpet: narrow, parallel ribs with only a trace of fiber noise.\n        // The rib axis follows canvas Y, so the finished floor reads as one directional roll.\n        const fine = (random() - 0.5) * 5;\n        const rib = Math.sin(x * 1.18);\n        const ribHarmonic = Math.sin(x * 2.36) * 0.22;\n        const ribProfile = rib * 13 + ribHarmonic * 5;\n        const value = Math.max(92, Math.min(164, 128 + ribProfile + fine));\n        const bump = Math.max(82, Math.min(174, 128 + ribProfile * 1.65 + fine * 0.45));`;

if (!source.includes(oldGenerator)) {
  throw new Error('Expected woven carpet generator not found');
}
source = source.replace(oldGenerator, newGenerator);

const oldComment = `  // Lightweight procedural carpet texture: neutral fibers multiplied by the chosen\n  // carpet color, plus a subtle bump map so grazing light reads as real textile.\n  // Generated in-browser to avoid another heavy image asset or network request.`;
const newComment = `  // Lightweight procedural RIP exhibition carpet. Narrow parallel ribs stay readable\n  // from normal editing distance without turning into a decorative household pattern.\n  // Generated in-browser to avoid another heavy image asset or network request.`;
source = source.replace(oldComment, newComment);

const oldMaterial = `      material.bumpScale = 0.032;\n      if (stageLayout) {\n        // Slightly larger weave remains readable from normal editing distance,\n        // while still staying subtle enough not to look like a printed pattern.\n        const repeatX = Math.max(2, stageLayout.widthM / 1.05);\n        const repeatY = Math.max(2, stageLayout.depthM / 1.05);`;

const newMaterial = `      material.bumpScale = 0.014;\n      if (stageLayout) {\n        // A 256px tile spans roughly 34 cm across the ribs. The Y axis repeats slowly\n        // because RIP carpet is directionally continuous rather than a square pattern.\n        const repeatX = Math.max(2, stageLayout.widthM / 0.34);\n        const repeatY = Math.max(1, stageLayout.depthM / 2.4);`;

if (!source.includes(oldMaterial)) {
  throw new Error('Expected woven carpet material settings not found');
}
source = source.replace(oldMaterial, newMaterial);

if (!source.includes('const rib = Math.sin(x * 1.18);')) {
  throw new Error('RIP rib generator was not applied');
}
if (!source.includes('material.bumpScale = 0.014;')) {
  throw new Error('RIP material settings were not applied');
}

fs.writeFileSync(path, source);
