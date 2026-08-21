import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const from = `    } else if (PARQUET_TYPES.has(resolved)) {\n      material.map = null;\n      material.bumpMap = null;\n      material.bumpScale = 0;\n      material.color.set(PARQUET_COLORS[resolved]);\n      material.roughness = 0.78;\n      material.metalness = 0;\n`;

const to = `    } else if (PARQUET_TYPES.has(resolved)) {\n      material.map = null;\n      material.bumpMap = null;\n      material.bumpScale = 0;\n      material.color.set(PARQUET_COLORS[resolved]);\n      material.roughness = resolved === 'parke-beton' ? 0.98 : 0.78;\n      material.metalness = 0;\n      // Beton parke, güçlü sahne ışığında rengini yıkamadan daha mat ve dengeli kalsın.\n      material.emissive.set(resolved === 'parke-beton' ? PARQUET_COLORS[resolved] : '#000000');\n      material.emissiveIntensity = resolved === 'parke-beton' ? 0.06 : 0;\n`;

if (!source.includes(to)) {
  if (!source.includes(from)) throw new Error('Parquet material anchor not found');
  source = source.replace(from, to);
  fs.writeFileSync(path, source);
}
