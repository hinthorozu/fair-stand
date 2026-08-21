import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const from = `    const material = new THREE.LineBasicMaterial({\n      color: PARQUET_TYPES.has(floorType) ? 0x746f68 : 0x9aa0a6,\n      transparent: true,\n      opacity: PARQUET_TYPES.has(floorType) ? 0.34 : 0.68,\n    });\n`;

const to = `    const isConcreteParquetPattern = floorType === 'parke-beton';\n    const material = new THREE.LineBasicMaterial({\n      // Beton parke derzleri sahne ışığından bağımsız, daha koyu ve net kalsın.\n      color: isConcreteParquetPattern\n        ? 0x3f3d39\n        : (PARQUET_TYPES.has(floorType) ? 0x746f68 : 0x9aa0a6),\n      transparent: true,\n      opacity: isConcreteParquetPattern\n        ? 0.62\n        : (PARQUET_TYPES.has(floorType) ? 0.34 : 0.68),\n      toneMapped: !isConcreteParquetPattern,\n    });\n`;

if (!source.includes(to)) {
  if (!source.includes(from)) throw new Error('Floor pattern material anchor not found');
  source = source.replace(from, to);
  fs.writeFileSync(path, source);
}
