import fs from 'node:fs';

function patch(path, replacements) {
  let s = fs.readFileSync(path, 'utf8');
  for (const [oldText, newText] of replacements) {
    if (s.includes(newText)) continue;
    if (!s.includes(oldText)) throw new Error(`${path}: anchor not found`);
    s = s.replace(oldText, newText);
  }
  fs.writeFileSync(path, s);
}

patch('src/catalog.js', [
  [
`export const SOFA_SET_DIMENSIONS = Object.freeze({
  widthCm: 150,
  depthCm: 150,
  heightCm: 80,
  loveseatWidthCm: 150,
  chairWidthCm: 65,
  tableDiameterCm: 60,
});`,
`export const SOFA_SET_DIMENSIONS = Object.freeze({
  widthCm: 150,
  depthCm: 150,
  heightCm: 80,
  loveseatWidthCm: 150,
  chairWidthCm: 65,
  tableDiameterCm: 60,
});

export const TABLE_CHAIR_SET_DIMENSIONS = Object.freeze({
  widthCm: 150,
  depthCm: 150,
  heightCm: 90,
  chairWidthCm: 46,
  chairDepthCm: 46,
  tableDiameterCm: 55,
  tableHeightCm: 74,
});`
  ],
  [
`  SOFA_SET: { type: 'sofa-set', widthCm: 150, depthCm: 150, heightCm: 80, label: 'Koltuk Takımı' },`,
`  SOFA_SET: { type: 'sofa-set', widthCm: 150, depthCm: 150, heightCm: 80, label: 'Koltuk Takımı' },
  TABLE_CHAIR_SET: { type: 'table-chair-set', widthCm: 150, depthCm: 150, heightCm: 90, label: 'Masa Sandalye Takımı' },`
  ],
]);

patch('src/designState.js', [
  [
`export function createSofaSetModuleState() {
  return {
    id: createId('module'),
    type: 'sofa-set',
    widthCm: 150,
    depthCm: 150,
    heightCm: 80,
    surface: {
      id: createId('surface'),
      color: DEFAULT_PANEL_COLOR,
    },
  };
}`,
`export function createSofaSetModuleState() {
  return {
    id: createId('module'),
    type: 'sofa-set',
    widthCm: 150,
    depthCm: 150,
    heightCm: 80,
    surface: {
      id: createId('surface'),
      color: DEFAULT_PANEL_COLOR,
    },
  };
}

export function createTableChairSetModuleState() {
  return {
    id: createId('module'),
    type: 'table-chair-set',
    widthCm: 150,
    depthCm: 150,
    heightCm: 90,
    surface: {
      id: createId('surface'),
      color: DEFAULT_PANEL_COLOR,
    },
  };
}`
  ],
]);

patch('src/main.js', [
  [
`  createSofaSetModuleState,
  createShowcaseModuleState,`,
`  createSofaSetModuleState,
  createTableChairSetModuleState,
  createShowcaseModuleState,`
  ],
  [
`  else if (module.type === 'sofa-set') state = createSofaSetModuleState();`,
`  else if (module.type === 'sofa-set') state = createSofaSetModuleState();
  else if (module.type === 'table-chair-set') state = createTableChairSetModuleState();`
  ],
]);

patch('src/moduleDragSidebar.js', [
  [
`  'SOFA_SET',
  'BASE_200',`,
`  'SOFA_SET',
  'TABLE_CHAIR_SET',
  'BASE_200',`
  ],
  [
`    .module-drag-sofa::after { content:''; position:absolute; left:7px; bottom:4px; width:18px; height:25px; border:2px solid #9aa0a6; border-radius:5px; background:#f8fafc; box-shadow:28px 0 0 -2px #f8fafc,28px 0 0 0 #9aa0a6; }`,
`    .module-drag-sofa::after { content:''; position:absolute; left:7px; bottom:4px; width:18px; height:25px; border:2px solid #9aa0a6; border-radius:5px; background:#f8fafc; box-shadow:28px 0 0 -2px #f8fafc,28px 0 0 0 #9aa0a6; }
    .module-drag-table-chair { position:relative; width:58px; height:58px; }
    .module-drag-table-chair::before { content:''; position:absolute; left:19px; top:19px; width:20px; height:20px; border:2px solid #7b838c; border-radius:50%; background:#fff; }
    .module-drag-table-chair::after { content:''; position:absolute; left:4px; top:4px; width:13px; height:13px; border:2px solid #9aa0a6; border-radius:4px; background:#f8fafc; box-shadow:37px 0 0 -2px #f8fafc,37px 0 0 0 #9aa0a6,0 37px 0 -2px #f8fafc,0 37px 0 0 #9aa0a6,37px 37px 0 -2px #f8fafc,37px 37px 0 0 #9aa0a6; }`
  ],
  [
`  if (module.type === 'base') {`,
`  if (module.type === 'table-chair-set') {
    const body = document.createElement('div');
    body.className = 'module-drag-table-chair';
    preview.appendChild(body);
    return preview;
  }

  if (module.type === 'base') {`
  ],
]);

patch('src/modulePlacement.js', [
  [
`    const useWallInnerFaces = moduleType === 'sofa-set';`,
`    const useWallInnerFaces = moduleType === 'sofa-set' || moduleType === 'table-chair-set';`
  ],
]);

let scene = fs.readFileSync('src/scene3d.js', 'utf8');
if (!scene.includes("type === 'table-chair-set'")) {
  scene = scene.replace(
`function isFloorFixtureType(type) {
  return type === 'counter' || type === 'base' || type === 'sofa-set';
}`,
`function isFloorFixtureType(type) {
  return type === 'counter' || type === 'base' || type === 'sofa-set' || type === 'table-chair-set';
}`,
  );
  scene = scene.replace(
`      } else if (moduleState.type === 'sofa-set') {
        module = createSofaSetModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'shelf') {`,
`      } else if (moduleState.type === 'sofa-set') {
        module = createSofaSetModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'table-chair-set') {
        module = createTableChairSetModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'shelf') {`,
  );
  scene = scene.replace(
`    if (moduleState?.type === 'sofa-set') return 'Koltuk Takımı';`,
`    if (moduleState?.type === 'sofa-set') return 'Koltuk Takımı';
    if (moduleState?.type === 'table-chair-set') return 'Masa Sandalye Takımı';`,
  );
  scene = scene.replace(
`function createSofaSetModule(moduleState, moduleIndex) {`,
`function createTableChairSetModule(moduleState, moduleIndex) {
  const widthM = Number(moduleState.widthCm || 150) / 100;
  const depthM = Number(moduleState.depthCm || 150) / 100;
  const group = new THREE.Group();
  group.userData = { kind: 'module', moduleIndex, moduleId: moduleState.id, type: 'table-chair-set', widthCm: Number(moduleState.widthCm || 150), depthCm: Number(moduleState.depthCm || 150), heightCm: Number(moduleState.heightCm || 90) };

  const color = moduleState.surface?.color ?? '#ffffff';
  const chairMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0, emissive: 0x000000, emissiveIntensity: 0 });
  const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x30343a, roughness: 0.32, metalness: 0.74 });
  const tabletopMaterial = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.46, metalness: 0.02 });
  const colorTargets = [];

  const addChair = (x, z, rotationY) => {
    const chair = new THREE.Group();
    chair.position.set(x, 0, z);
    chair.rotation.y = rotationY;

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.075, 0.42), chairMaterial.clone());
    seat.position.set(0, 0.46, 0);
    seat.castShadow = true;
    seat.receiveShadow = true;
    chair.add(seat);
    colorTargets.push(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.48, 0.065), chairMaterial.clone());
    back.position.set(0, 0.71, -0.19);
    back.rotation.x = -0.10;
    back.castShadow = true;
    chair.add(back);
    colorTargets.push(back);

    const legGeometry = new THREE.CylinderGeometry(0.018, 0.014, 0.44, 12);
    [[-0.16,-0.14],[0.16,-0.14],[-0.16,0.14],[0.16,0.14]].forEach(([lx,lz]) => {
      const leg = new THREE.Mesh(legGeometry, metalMaterial.clone());
      leg.position.set(lx, 0.22, lz);
      leg.rotation.z = lx < 0 ? 0.05 : -0.05;
      leg.rotation.x = lz < 0 ? -0.05 : 0.05;
      chair.add(leg);
    });
    group.add(chair);
  };

  // 150 x 150 dış footprint sabit. Sandalyelerin dış uçları yaklaşık ±75 cm sınırında kalır.
  const chairOffset = 0.50;
  addChair(-chairOffset, -chairOffset, Math.PI / 4);
  addChair(chairOffset, -chairOffset, -Math.PI / 4);
  addChair(-chairOffset, chairOffset, Math.PI * 3 / 4);
  addChair(chairOffset, chairOffset, -Math.PI * 3 / 4);

  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.275, 0.275, 0.045, 48), tabletopMaterial);
  top.position.set(0, 0.74, 0);
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.70, 20), metalMaterial.clone());
  stem.position.set(0, 0.37, 0);
  group.add(stem);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.035, 32), metalMaterial.clone());
  base.position.set(0, 0.018, 0);
  group.add(base);

  const selectable = colorTargets[0];
  const selectionFrame = createSelectionFrame(0.44, 0.48);
  selectionFrame.visible = false;
  selectable.add(selectionFrame);
  selectable.userData = { kind: 'surface', moduleType: 'table-chair-set', selectionMode: 'module', acceptsImage: false, moduleIndex, moduleId: moduleState.id, widthCm: Number(moduleState.widthCm || 150), stripIndex: null, stripNumber: null, surfaceRole: 'chair', surfaceId: moduleState.surface?.id, surfaceState: moduleState.surface, selectionFrame, colorTargets };
  colorTargets.forEach((mesh, index) => {
    if (index === 0) return;
    mesh.userData = { ...selectable.userData, surfaceId: \`${moduleState.surface?.id}-\${index}\`, selectionFrame: null };
  });

  return { group, surfaces: colorTargets };
}

function createSofaSetModule(moduleState, moduleIndex) {`,
  );
}
fs.writeFileSync('src/scene3d.js', scene);

const testPath = 'test/tableChairSet.test.js';
if (!fs.existsSync(testPath)) {
  fs.writeFileSync(testPath, `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { MODULE_CATALOG, TABLE_CHAIR_SET_DIMENSIONS } from '../src/catalog.js';\nimport { createTableChairSetModuleState } from '../src/designState.js';\nimport { snapPlacementToStand } from '../src/modulePlacement.js';\n\ntest('masa sandalye takımı 150 x 150 cm sabit footprint kullanır', () => {\n  assert.equal(TABLE_CHAIR_SET_DIMENSIONS.widthCm, 150);\n  assert.equal(TABLE_CHAIR_SET_DIMENSIONS.depthCm, 150);\n  assert.equal(MODULE_CATALOG.TABLE_CHAIR_SET.widthCm, 150);\n  assert.equal(MODULE_CATALOG.TABLE_CHAIR_SET.depthCm, 150);\n  const state = createTableChairSetModuleState();\n  assert.equal(state.type, 'table-chair-set');\n  assert.equal(state.widthCm, 150);\n  assert.equal(state.depthCm, 150);\n});\n\ntest('masa sandalye takımı serbest gezer ve duvar iç yüzüne sıfır yanaşır', () => {\n  const left = snapPlacementToStand({ standType: 'l-left', moduleType: 'table-chair-set', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 120, pointerYCm: 120, standXCm: 600, standYCm: 600 });\n  assert.equal(left.ok, true);\n  assert.equal(left.placement.xCm, 5);\n  assert.equal(left.placement.yCm, 80);\n\n  const right = snapPlacementToStand({ standType: 'l-right', moduleType: 'table-chair-set', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 480, pointerYCm: 120, standXCm: 600, standYCm: 600 });\n  assert.equal(right.ok, true);\n  assert.equal(right.placement.xCm, 445);\n  assert.equal(right.placement.yCm, 80);\n\n  const island = snapPlacementToStand({ standType: 'island', moduleType: 'table-chair-set', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 120, pointerYCm: 120, standXCm: 600, standYCm: 600 });\n  assert.equal(island.ok, true);\n  assert.equal(island.placement.xCm, 0);\n  assert.equal(island.placement.yCm, 75);\n});\n`);
}
