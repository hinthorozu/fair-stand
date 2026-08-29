const fs = require('fs');

function replace(path, before, after) {
  let source = fs.readFileSync(path, 'utf8');
  if (!source.includes(before)) {
    if (source.includes(after)) return;
    throw new Error(`${path}: anchor not found`);
  }
  source = source.replace(before, after);
  fs.writeFileSync(path, source);
}

// catalog.js — keep the existing sofa set and add a separate catalog item.
replace(
  'src/catalog.js',
  "export const furniture_sofa_set_classic_DIMENSIONS = Object.freeze({\n  widthCm: 150,\n  depthCm: 150,\n  heightCm: 80,\n  loveseatWidthCm: 150,\n  chairWidthCm: 65,\n  tableDiameterCm: 60,\n});",
  "export const furniture_sofa_set_classic_DIMENSIONS = Object.freeze({\n  widthCm: 150,\n  depthCm: 150,\n  heightCm: 80,\n  loveseatWidthCm: 150,\n  chairWidthCm: 65,\n  tableDiameterCm: 60,\n});\n\nexport const furniture_sofa_set_beige_DIMENSIONS = Object.freeze({\n  widthCm: 150,\n  depthCm: 150,\n  heightCm: 78,\n  loveseatWidthCm: 150,\n  chairWidthCm: 65,\n  tableWidthCm: 60,\n  tableDepthCm: 42,\n  tableHeightCm: 38,\n});"
);
replace(
  'src/catalog.js',
  "  furniture_sofa_set_classic: { type: 'sofa-set', widthCm: 150, depthCm: 150, heightCm: 80, label: 'Koltuk Takımı' },\n  furniture_table_chair_set_eames:",
  "  furniture_sofa_set_classic: { type: 'sofa-set', widthCm: 150, depthCm: 150, heightCm: 80, label: 'Koltuk Takımı' },\n  furniture_sofa_set_beige: { type: 'sofa-set-beige', widthCm: 150, depthCm: 150, heightCm: 78, label: 'Bej Koltuk Takımı' },\n  furniture_table_chair_set_eames:"
);
replace(
  'src/catalog.js',
  "  'furniture_sofa_set_classic',\n  'furniture_table_chair_set_eames',",
  "  'furniture_sofa_set_classic',\n  'furniture_sofa_set_beige',\n  'furniture_table_chair_set_eames',"
);

// designState.js
replace(
  'src/designState.js',
  "export function createEamesTableChairSetModuleState() {",
  "export function createBeigeSofaSetModuleState() {\n  return {\n    id: createId('module'),\n    type: 'sofa-set-beige',\n    widthCm: 150,\n    depthCm: 150,\n    heightCm: 78,\n    surface: {\n      id: createId('surface'),\n      color: '#e7ddca',\n    },\n  };\n}\n\nexport function createEamesTableChairSetModuleState() {"
);

// main.js import + factory mapping.
replace(
  'src/main.js',
  "  createSofaSetModuleState,\n  createShowcaseModuleState,",
  "  createSofaSetModuleState,\n  createBeigeSofaSetModuleState,\n  createShowcaseModuleState,"
);
replace(
  'src/main.js',
  "  else if (module.type === 'sofa-set') state = createSofaSetModuleState();\n  else if (module.type === 'table-chair-set-eames')",
  "  else if (module.type === 'sofa-set') state = createSofaSetModuleState();\n  else if (module.type === 'sofa-set-beige') state = createBeigeSofaSetModuleState();\n  else if (module.type === 'table-chair-set-eames')"
);

// modulePlacement.js: same verified 10 cm furniture grid as the existing sofa set.
replace(
  'src/modulePlacement.js',
  "  return moduleType === 'sofa-set' || moduleType === 'table-chair-set-eames' || moduleType === 'bar-stool'\n    ? 10",
  "  return moduleType === 'sofa-set' || moduleType === 'sofa-set-beige' || moduleType === 'table-chair-set-eames' || moduleType === 'bar-stool'\n    ? 10"
);
replace(
  'src/modulePlacement.js',
  "  const useWallInnerFaces = moduleType === 'sofa-set'\n    || moduleType === 'table-chair-set-eames';",
  "  const useWallInnerFaces = moduleType === 'sofa-set'\n    || moduleType === 'sofa-set-beige'\n    || moduleType === 'table-chair-set-eames';"
);

// scene3d.js: floor fixture, label, build dispatch and dedicated renderer.
replace(
  'src/scene3d.js',
  "    || type === 'sofa-set'\n    || type === 'table-chair-set-eames'",
  "    || type === 'sofa-set'\n    || type === 'sofa-set-beige'\n    || type === 'table-chair-set-eames'"
);
replace(
  'src/scene3d.js',
  "    if (moduleState?.type === 'sofa-set') return 'Koltuk Takımı';\n    if (moduleState?.type === 'table-chair-set-eames')",
  "    if (moduleState?.type === 'sofa-set') return 'Koltuk Takımı';\n    if (moduleState?.type === 'sofa-set-beige') return 'Bej Koltuk Takımı';\n    if (moduleState?.type === 'table-chair-set-eames')"
);
replace(
  'src/scene3d.js',
  "      preview.style.height = moduleState?.type === 'sofa-set' ? '34px' : (moduleState?.type === 'base' ? '22px' : (moduleState?.type === 'counter' ? '28px' : '48px'));\n      if (moduleState?.type === 'sofa-set') {",
  "      preview.style.height = (moduleState?.type === 'sofa-set' || moduleState?.type === 'sofa-set-beige') ? '34px' : (moduleState?.type === 'base' ? '22px' : (moduleState?.type === 'counter' ? '28px' : '48px'));\n      if (moduleState?.type === 'sofa-set' || moduleState?.type === 'sofa-set-beige') {"
);
replace(
  'src/scene3d.js',
  "      } else if (moduleState.type === 'sofa-set') {\n        module = createSofaSetModule(moduleState, moduleIndex);      } else if (moduleState.type === 'table-chair-set-eames') {",
  "      } else if (moduleState.type === 'sofa-set') {\n        module = createSofaSetModule(moduleState, moduleIndex);\n      } else if (moduleState.type === 'sofa-set-beige') {\n        module = createBeigeSofaSetModule(moduleState, moduleIndex);\n      } else if (moduleState.type === 'table-chair-set-eames') {"
);

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');
const sofaAnchor = "function createSofaSetModule(moduleState, moduleIndex) {";
if (!scene.includes('function createBeigeSofaSetModule(moduleState, moduleIndex) {')) {
  if (!scene.includes(sofaAnchor)) throw new Error('scene3d.js: sofa renderer anchor not found');
  const beigeRenderer = `function createBeigeSofaSetModule(moduleState, moduleIndex) {\n  const widthCm = Number(moduleState.widthCm || 150);\n  const depthCm = Number(moduleState.depthCm || 150);\n  const heightCm = Number(moduleState.heightCm || 78);\n  const widthM = widthCm / 100;\n  const depthM = depthCm / 100;\n  const group = new THREE.Group();\n  group.userData = { kind: 'module', moduleIndex, moduleId: moduleState.id, type: 'sofa-set-beige', widthCm, depthCm, heightCm };\n\n  const upholstery = [];\n  const fabricMaterial = new THREE.MeshStandardMaterial({\n    color: moduleState.surface?.color ?? '#e7ddca',\n    roughness: 0.9,\n    metalness: 0,\n  });\n  const shadowFabric = new THREE.MeshStandardMaterial({ color: 0xd2c5ae, roughness: 0.94, metalness: 0 });\n  const woodMaterial = new THREE.MeshStandardMaterial({ color: 0xb99772, roughness: 0.72, metalness: 0 });\n  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x6d6256, roughness: 0.55, metalness: 0.08 });\n\n  const addFabricBox = (w, h, d, x, y, z, material = fabricMaterial) => {\n    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material.clone());\n    mesh.position.set(x, y, z);\n    mesh.castShadow = true;\n    mesh.receiveShadow = true;\n    group.add(mesh);\n    upholstery.push(mesh);\n    return mesh;\n  };\n\n  const addLeg = (x, z, y = 0.055) => {\n    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.11, 0.055), legMaterial.clone());\n    leg.position.set(x, y, z);\n    leg.castShadow = true;\n    group.add(leg);\n  };\n\n  const addSeat = ({ x, z, seatWidth, facing = 'front', twoSeat = false }) => {\n    const dir = facing === 'front' ? 1 : -1;\n    const seatDepth = 0.52;\n    const armW = 0.105;\n    const baseH = 0.16;\n    const seatY = 0.27;\n    const backT = 0.12;\n    const backH = 0.64;\n\n    // Low upholstered carcass and four visible feet.\n    addFabricBox(seatWidth, baseH, seatDepth, x, 0.16, z, shadowFabric);\n    addLeg(x - seatWidth / 2 + 0.10, z - 0.18);\n    addLeg(x + seatWidth / 2 - 0.10, z - 0.18);\n    addLeg(x - seatWidth / 2 + 0.10, z + 0.18);\n    addLeg(x + seatWidth / 2 - 0.10, z + 0.18);\n\n    // Seat cushions. The loveseat is split into two cushions like the source set.\n    if (twoSeat) {\n      const cushionW = (seatWidth - armW * 2 - 0.035) / 2;\n      [-1, 1].forEach((side) => {\n        addFabricBox(cushionW, 0.14, 0.39, x + side * (cushionW / 2 + 0.009), seatY, z + dir * 0.035);\n      });\n    } else {\n      addFabricBox(seatWidth - armW * 2 - 0.025, 0.14, 0.39, x, seatY, z + dir * 0.035);\n    }\n\n    // Full arms and slightly reclined-looking back with separate back cushions.\n    addFabricBox(armW, 0.46, seatDepth, x - seatWidth / 2 + armW / 2, 0.29, z);\n    addFabricBox(armW, 0.46, seatDepth, x + seatWidth / 2 - armW / 2, 0.29, z);\n    const backZ = z - dir * (seatDepth / 2 - backT / 2);\n    addFabricBox(seatWidth - 0.02, backH, backT, x, backH / 2 + 0.08, backZ, shadowFabric);\n\n    if (twoSeat) {\n      const backCushionW = (seatWidth - armW * 2 - 0.05) / 2;\n      [-1, 1].forEach((side) => {\n        const cushion = addFabricBox(backCushionW, 0.38, 0.11, x + side * (backCushionW / 2 + 0.012), 0.50, backZ + dir * 0.065);\n        cushion.rotation.x = dir * -0.08;\n      });\n    } else {\n      const cushion = addFabricBox(seatWidth - armW * 2 - 0.025, 0.38, 0.11, x, 0.50, backZ + dir * 0.065);\n      cushion.rotation.x = dir * -0.08;\n    }\n  };\n\n  // Same 150 x 150 cm layout language as the verified existing set.\n  addSeat({ x: 0, z: -depthM / 2 + 0.26, seatWidth: 1.50, facing: 'front', twoSeat: true });\n  addSeat({ x: -0.425, z: depthM / 2 - 0.26, seatWidth: 0.65, facing: 'back' });\n  addSeat({ x: 0.425, z: depthM / 2 - 0.26, seatWidth: 0.65, facing: 'back' });\n\n  // Requested rectangular center coffee table.\n  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.055, 0.42), woodMaterial.clone());\n  tableTop.position.set(0, 0.38, 0);\n  tableTop.castShadow = true;\n  tableTop.receiveShadow = true;\n  group.add(tableTop);\n  [[-0.24,-0.15],[0.24,-0.15],[-0.24,0.15],[0.24,0.15]].forEach(([x,z]) => {\n    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.34, 0.045), legMaterial.clone());\n    leg.position.set(x, 0.18, z);\n    leg.castShadow = true;\n    group.add(leg);\n  });\n\n  const selectable = upholstery[0];\n  const selectionFrame = createSelectionFrame(1.46, 0.22);\n  selectionFrame.visible = false;\n  selectable.add(selectionFrame);\n  selectable.userData = {\n    kind: 'surface',\n    moduleType: 'sofa-set-beige',\n    selectionMode: 'module',\n    acceptsImage: false,\n    moduleIndex,\n    moduleId: moduleState.id,\n    widthCm,\n    stripIndex: null,\n    stripNumber: null,\n    surfaceRole: 'upholstery',\n    surfaceId: moduleState.surface?.id,\n    surfaceState: moduleState.surface,\n    selectionFrame,\n    colorTargets: upholstery,\n  };\n  upholstery.forEach((mesh, index) => {\n    if (index === 0) return;\n    mesh.userData = { ...selectable.userData, surfaceId: moduleState.surface?.id + '-' + index, selectionFrame: null };\n  });\n\n  return { group, surfaces: upholstery };\n}\n\n`;
  scene = scene.replace(sofaAnchor, beigeRenderer + sofaAnchor);
  fs.writeFileSync(scenePath, scene);
}

console.log('Beige sofa set module patched successfully.');
