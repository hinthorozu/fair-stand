import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const ripComment = `  // Lightweight procedural RIP exhibition carpet. Narrow parallel ribs stay readable\n  // from normal editing distance without turning into a decorative household pattern.`;
const tileComment = `  // Lightweight procedural carpet texture: neutral fibers multiplied by the chosen\n  // carpet color, plus a subtle bump map so grazing light reads as real textile.`;
if (source.includes(ripComment)) source = source.replace(ripComment, tileComment);

const ripGenerator = `        // Exhibition RIP carpet: narrow, parallel ribs with only a trace of fiber noise.\n        // The rib axis follows canvas Y, so the finished floor reads as one directional roll.\n        const fine = (random() - 0.5) * 5;\n        const rib = Math.sin(x * 1.18);\n        const ribHarmonic = Math.sin(x * 2.36) * 0.22;\n        const ribProfile = rib * 13 + ribHarmonic * 5;\n        const value = Math.max(92, Math.min(164, 128 + ribProfile + fine));\n        const bump = Math.max(82, Math.min(174, 128 + ribProfile * 1.65 + fine * 0.45));`;
const tileGenerator = `        const fine = (random() - 0.5) * 34;\n        const fiber = Math.sin((x * 0.72) + (y * 0.18)) * 5;\n        const value = Math.max(72, Math.min(184, 128 + fine + fiber));\n        const bump = Math.max(88, Math.min(168, 128 + fine * 0.9 + fiber * 1.5));`;
if (!source.includes(ripGenerator)) throw new Error('RIP carpet generator anchor not found');
source = source.replace(ripGenerator, tileGenerator);

const ripMaterial = `      material.bumpScale = 0.014;\n      if (stageLayout) {\n        // A 256px tile spans roughly 34 cm across the ribs. The Y axis repeats slowly\n        // because RIP carpet is directionally continuous rather than a square pattern.\n        const repeatX = Math.max(2, stageLayout.widthM / 0.34);\n        const repeatY = Math.max(1, stageLayout.depthM / 2.4);`;
const tileMaterial = `      material.bumpScale = 0.018;\n      if (stageLayout) {\n        // Restore the earlier compact carpet-tile scale the editor used before the RIP pass.\n        const repeatX = Math.max(2, stageLayout.widthM / 0.7);\n        const repeatY = Math.max(2, stageLayout.depthM / 0.7);`;
if (!source.includes(ripMaterial)) throw new Error('RIP carpet material anchor not found');
source = source.replace(ripMaterial, tileMaterial);

if (!source.includes('const fiber = Math.sin((x * 0.72) + (y * 0.18)) * 5;')) {
  throw new Error('Carpet tile generator restore failed');
}
if (!source.includes('material.bumpScale = 0.018;')) {
  throw new Error('Carpet tile material restore failed');
}

fs.writeFileSync(path, source);
