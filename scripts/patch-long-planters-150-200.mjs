import fs from 'node:fs';

function replaceOnce(path, oldText, newText) {
  const text = fs.readFileSync(path, 'utf8');
  if (!text.includes(oldText)) throw new Error(`Pattern not found in ${path}`);
  fs.writeFileSync(path, text.replace(oldText, newText));
}

replaceOnce(
  'src/catalog.js',
  `  EXTRA_LONG_PLANTER_100: {
    type: 'indoor-plant-1',
    widthCm: 100,
    depthCm: 30,
    heightCm: 30,
    modelFile: 'saksi_bitkili_100x30x30.glb',
    modelRotationYDeg: 90,
    preserveModelScale: true,
    label: 'Uzun Saksı 100',
  },`,
  `  EXTRA_LONG_PLANTER_100: {
    type: 'indoor-plant-1',
    widthCm: 100,
    depthCm: 30,
    heightCm: 30,
    modelFile: 'saksi_bitkili_100x30x30.glb',
    modelRotationYDeg: 90,
    preserveModelScale: true,
    label: 'Uzun Saksı 100',
  },
  EXTRA_LONG_PLANTER_150: {
    type: 'indoor-plant-1',
    widthCm: 150,
    depthCm: 30,
    heightCm: 30,
    modelFile: 'saksi_bitkili_150x30x30.glb',
    modelRotationYDeg: 90,
    preserveModelScale: true,
    label: 'Uzun Saksı 150',
  },
  EXTRA_LONG_PLANTER_200: {
    type: 'indoor-plant-1',
    widthCm: 200,
    depthCm: 30,
    heightCm: 30,
    modelFile: 'saksi_bitkili_200x30x30.glb',
    modelRotationYDeg: 90,
    preserveModelScale: true,
    label: 'Uzun Saksı 200',
  },`
);

replaceOnce(
  'src/catalog.js',
  `  'EXTRA_INDOOR_PLANT_1',
  'EXTRA_LONG_PLANTER_100',
  'TV_42',`,
  `  'EXTRA_INDOOR_PLANT_1',
  'EXTRA_LONG_PLANTER_100',
  'EXTRA_LONG_PLANTER_150',
  'EXTRA_LONG_PLANTER_200',
  'TV_42',`
);

replaceOnce(
  'src/catalog.js',
  `keys: Object.freeze(['furniture_sofa_set_classic', 'furniture_table_chair_set_eames', 'furniture_bar_stool_classic', 'DEPOT_MINI_FRIDGE_AVANTI', 'DEPOT_KETTLE', 'DEPOT_COAT_RACK', 'EXTRA_INDOOR_PLANT_1', 'EXTRA_LONG_PLANTER_100']),`,
  `keys: Object.freeze(['furniture_sofa_set_classic', 'furniture_table_chair_set_eames', 'furniture_bar_stool_classic', 'DEPOT_MINI_FRIDGE_AVANTI', 'DEPOT_KETTLE', 'DEPOT_COAT_RACK', 'EXTRA_INDOOR_PLANT_1', 'EXTRA_LONG_PLANTER_100', 'EXTRA_LONG_PLANTER_150', 'EXTRA_LONG_PLANTER_200']),`
);

replaceOnce(
  'src/moduleDragSidebar.js',
  `if (module.type === 'indoor-plant-1' && module.modelFile === 'saksi_bitkili_100x30x30.glb') {`,
  `if (module.type === 'indoor-plant-1' && /^saksi_bitkili_\\d+x30x30\\.glb$/i.test(module.modelFile ?? '')) {`
);

replaceOnce(
  'src/main.js',
  `selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Uzun Saksı 100 · saksı gövdesi · renk uygulanabilir.';`,
  `selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Uzun Saksı ' + (Number(currentModules[moduleIndex]?.widthCm) || '') + ' · saksı gövdesi · renk uygulanabilir.';`
);

console.log('Uzun Saksı 150 ve 200 kataloğa eklendi.');
