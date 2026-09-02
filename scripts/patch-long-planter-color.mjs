import fs from 'node:fs';

function replaceOnce(path, oldText, newText) {
  const text = fs.readFileSync(path, 'utf8');
  if (!text.includes(oldText)) throw new Error(`Pattern not found in ${path}`);
  fs.writeFileSync(path, text.replace(oldText, newText));
}

replaceOnce(
  'src/designState.js',
  `export function createIndoorPlantModuleState(descriptor = {}) {
  return {
    id: createId('module'),
    type: 'indoor-plant-1',
    widthCm: Number(descriptor.widthCm) || 60,
    depthCm: Number(descriptor.depthCm) || 60,
    heightCm: Number(descriptor.heightCm) || 120,
    modelFile: descriptor.modelFile ?? 'indoor_plants.glb',
    modelRotationYDeg: Number(descriptor.modelRotationYDeg) || 0,
    preserveModelScale: Boolean(descriptor.preserveModelScale),
  };
}`,
  `export function createIndoorPlantModuleState(descriptor = {}) {
  const modelFile = descriptor.modelFile ?? 'indoor_plants.glb';
  const isLongPlanter = /^saksi_bitkili_/i.test(modelFile);
  return {
    id: createId('module'),
    type: 'indoor-plant-1',
    widthCm: Number(descriptor.widthCm) || 60,
    depthCm: Number(descriptor.depthCm) || 60,
    heightCm: Number(descriptor.heightCm) || 120,
    modelFile,
    modelRotationYDeg: Number(descriptor.modelRotationYDeg) || 0,
    preserveModelScale: Boolean(descriptor.preserveModelScale),
    ...(isLongPlanter ? {
      surface: {
        id: createId('surface'),
        color: DEFAULT_PANEL_COLOR,
      },
    } : {}),
  };
}`,
);

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');
const sectionStart = scene.indexOf('function createIndoorPlantModule(moduleState, moduleIndex)');
const sectionEnd = scene.indexOf('\nfunction ', sectionStart + 10);
if (sectionStart < 0 || sectionEnd < 0) throw new Error('createIndoorPlantModule section not found');
let section = scene.slice(sectionStart, sectionEnd);
section = section.replace(
  `    surfaceRole: 'plant',
    surfaceState: null,
    selectionFrame: null,
    colorTargets: [],`,
  `    surfaceRole: moduleState.surface ? 'planter-body' : 'plant',
    surfaceId: moduleState.surface?.id ?? null,
    surfaceState: moduleState.surface ?? null,
    selectionFrame: null,
    colorTargets: [],`,
);
section = section.replace(
  `    model.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });`,
  `    model.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;

      if (moduleState.surface) {
        const targetName = [child.name, child.geometry?.name, child.material?.name]
          .filter(Boolean)
          .join(' ');
        if (/planter|plant_pot|pot_0/i.test(targetName)) {
          child.material = Array.isArray(child.material)
            ? child.material.map((material) => material.clone())
            : child.material?.clone?.() ?? child.material;
          proxy.userData.colorTargets.push(child);
        }
      }
    });

    if (moduleState.surface?.color && proxy.userData.colorTargets.length) {
      proxy.userData.colorTargets.forEach((target) => {
        const materials = Array.isArray(target.material) ? target.material : [target.material];
        materials.forEach((material) => {
          if (!material?.color) return;
          material.color.set(moduleState.surface.color);
          material.needsUpdate = true;
        });
      });
    }`,
);
if (section === scene.slice(sectionStart, sectionEnd)) throw new Error('scene3d patch did not change section');
fs.writeFileSync(scenePath, scene.slice(0, sectionStart) + section + scene.slice(sectionEnd));

replaceOnce(
  'src/main.js',
  `      if (moduleType === 'mini-fridge') {`,
  `      if (moduleType === 'indoor-plant-1' && currentModules[moduleIndex]?.surface) {
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Uzun Saksı 100 · saksı gövdesi · renk uygulanabilir.';
        return;
      }

      if (moduleType === 'mini-fridge') {`,
);
