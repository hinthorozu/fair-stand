import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const from = `    const material = new THREE.LineBasicMaterial({
      color: PARQUET_TYPES.has(floorType) ? 0x746f68 : 0x9aa0a6,
      transparent: true,
      opacity: PARQUET_TYPES.has(floorType) ? 0.34 : 0.68,
    });`;

const to = `    const isConcreteParquet = floorType === 'parke-beton';
    const material = new THREE.LineBasicMaterial({
      // Beton parkede derzler yeni sahne oluşturulduktan sonra da net okunmalı.
      // Ahşap parkelerin mevcut görünümüne dokunmuyoruz.
      color: isConcreteParquet
        ? 0x3f3d39
        : (PARQUET_TYPES.has(floorType) ? 0x746f68 : 0x9aa0a6),
      transparent: true,
      opacity: isConcreteParquet
        ? 0.62
        : (PARQUET_TYPES.has(floorType) ? 0.34 : 0.68),
      depthTest: !isConcreteParquet,
      depthWrite: false,
      toneMapped: false,
    });`;

if (!source.includes(to)) {
  if (!source.includes(from)) throw new Error('floor pattern material anchor not found');
  source = source.replace(from, to);
  fs.writeFileSync(path, source);
}
