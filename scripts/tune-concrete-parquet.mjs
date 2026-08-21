import fs from 'node:fs';

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');

scene = scene.replace("  'parke-beton': '#9b9993',", "  'parke-beton': '#625f58',");

const oldPattern = `    } else if (PARQUET_TYPES.has(floorType)) {\n      // Laminat/parke hissi: ince sıralar, uzun lameller ve 1/3 şaşırtma.\n      const plankDepthM = 0.16;\n      const plankLengthM = 1.40;`;
const newPattern = `    } else if (PARQUET_TYPES.has(floorType)) {\n      // Ahşap parkeler ince lamel kalır; beton parke daha geniş ve kısa plakalar kullanır.\n      const isConcreteParquet = floorType === 'parke-beton';\n      const plankDepthM = isConcreteParquet ? 0.28 : 0.16;\n      const plankLengthM = isConcreteParquet ? 1.12 : 1.40;`;
if (!scene.includes(newPattern)) {
  if (!scene.includes(oldPattern)) throw new Error('parquet pattern anchor not found');
  scene = scene.replace(oldPattern, newPattern);
}

fs.writeFileSync(scenePath, scene);

const indexPath = 'index.html';
let index = fs.readFileSync(indexPath, 'utf8');
index = index.replace('<option value="parke-acik">Parke Açık</option>', '<option value="parke-acik">Beyaz Meşe</option>');
index = index.replace('<option value="parke-sari">Parke Sarı</option>', '<option value="parke-sari">Sarı Meşe</option>');
index = index.replace('<option value="parke-beton">Parke Beton</option>', '<option value="parke-beton">Beton Parke</option>');
fs.writeFileSync(indexPath, index);
