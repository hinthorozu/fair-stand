import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const carpetFrom = `    if (resolved === 'hali') {\n      material.color.set(floorColors.hali);\n      material.roughness = 1;\n      material.metalness = 0;\n`;
const carpetTo = `    if (resolved === 'hali') {\n      material.color.set(floorColors.hali);\n      material.roughness = 1;\n      material.metalness = 0;\n      material.emissive.set('#000000');\n      material.emissiveIntensity = 0;\n`;

const tileFrom = `    } else {\n      material.color.set(floorColors.karolaj);\n      material.roughness = 0.92;\n      material.metalness = 0;\n`;
const tileTo = `    } else {\n      material.color.set(floorColors.karolaj);\n      material.roughness = 0.92;\n      material.metalness = 0;\n      material.emissive.set('#000000');\n      material.emissiveIntensity = 0;\n`;

if (!source.includes(carpetTo)) {
  if (!source.includes(carpetFrom)) throw new Error('Carpet material anchor not found');
  source = source.replace(carpetFrom, carpetTo);
}

if (!source.includes(tileTo)) {
  if (!source.includes(tileFrom)) throw new Error('Tile material anchor not found');
  source = source.replace(tileFrom, tileTo);
}

fs.writeFileSync(path, source);
