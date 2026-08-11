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
`export const TABLE_CHAIR_SET_DIMENSIONS = Object.freeze({
  widthCm: 150,
  depthCm: 150,
  heightCm: 90,
  chairWidthCm: 46,
  chairDepthCm: 46,
  tableDiameterCm: 55,
  tableHeightCm: 74,
});`,
`export const TABLE_CHAIR_SET_DIMENSIONS = Object.freeze({
  widthCm: 150,
  depthCm: 150,
  heightCm: 90,
  chairWidthCm: 46,
  chairDepthCm: 46,
  tableDiameterCm: 55,
  tableHeightCm: 74,
});

export const BAR_STOOL_DIMENSIONS = Object.freeze({
  widthCm: 50,
  depthCm: 50,
  heightCm: 80,
});`
  ],
  [
`  TABLE_CHAIR_SET: { type: 'table-chair-set', widthCm: 150, depthCm: 150, heightCm: 90, label: 'Masa Sandalye Takımı' },`,
`  TABLE_CHAIR_SET: { type: 'table-chair-set', widthCm: 150, depthCm: 150, heightCm: 90, label: 'Masa Sandalye Takımı' },
  BAR_STOOL: { type: 'bar-stool', widthCm: 50, depthCm: 50, heightCm: 80, label: 'Bar Taburesi' },`
  ],
]);

patch('src/designState.js', [
  [
`export function createTableChairSetModuleState() {
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
}`,
`export function createTableChairSetModuleState() {
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
}

export function createBarStoolModuleState() {
  return {
    id: createId('module'),
    type: 'bar-stool',
    widthCm: 50,
    depthCm: 50,
    heightCm: 80,
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
`  createBaseModuleState,
  createCounterModuleState,`,
`  createBarStoolModuleState,
  createBaseModuleState,
  createCounterModuleState,`
  ],
  [
`  else if (module.type === 'table-chair-set') state = createTableChairSetModuleState();`,
`  else if (module.type === 'table-chair-set') state = createTableChairSetModuleState();
  else if (module.type === 'bar-stool') state = createBarStoolModuleState();`
  ],
]);

patch('src/moduleDragSidebar.js', [
  [
`  'TABLE_CHAIR_SET',
  'BASE_200',`,
`  'TABLE_CHAIR_SET',
  'BAR_STOOL',
  'BASE_200',`
  ],
  [
`    .module-drag-table-chair::after { content:''; position:absolute; left:4px; top:4px; width:13px; height:13px; border:2px solid #9aa0a6; border-radius:4px; background:#f8fafc; box-shadow:37px 0 0 -2px #f8fafc,37px 0 0 0 #9aa0a6,0 37px 0 -2px #f8fafc,0 37px 0 0 #9aa0a6,37px 37px 0 -2px #f8fafc,37px 37px 0 0 #9aa0a6; }`,
`    .module-drag-table-chair::after { content:''; position:absolute; left:4px; top:4px; width:13px; height:13px; border:2px solid #9aa0a6; border-radius:4px; background:#f8fafc; box-shadow:37px 0 0 -2px #f8fafc,37px 0 0 0 #9aa0a6,0 37px 0 -2px #f8fafc,0 37px 0 0 #9aa0a6,37px 37px 0 -2px #f8fafc,37px 37px 0 0 #9aa0a6; }
    .module-drag-bar-stool { position:relative; width:44px; height:58px; }
    .module-drag-bar-stool::before { content:''; position:absolute; left:8px; top:4px; width:28px; height:20px; border:2px solid #9aa0a6; border-radius:10px 10px 5px 5px; background:#f8fafc; }
    .module-drag-bar-stool::after { content:''; position:absolute; left:11px; top:24px; width:22px; height:27px; border-left:3px solid #7b838c; border-right:3px solid #7b838c; border-bottom:3px solid #7b838c; border-radius:0 0 10px 10px; }`
  ],
  [
`  if (module.type === 'base') {`,
`  if (module.type === 'bar-stool') {
    const body = document.createElement('div');
    body.className = 'module-drag-bar-stool';
    preview.appendChild(body);
    return preview;
  }

  if (module.type === 'base') {`
  ],
]);

patch('src/modulePlacement.js', [
  [
`    const useWallInnerFaces = moduleType === 'sofa-set' || moduleType === 'table-chair-set';`,
`    const useWallInnerFaces = moduleType === 'sofa-set' || moduleType === 'table-chair-set' || moduleType === 'bar-stool';`
  ],
]);

let scene = fs.readFileSync('src/scene3d.js', 'utf8');
if (!scene.includes("type === 'bar-stool'")) {
  scene = scene.replace(
`function isFloorFixtureType(type) {
  return type === 'counter' || type === 'base' || type === 'sofa-set' || type === 'table-chair-set';
}`,
`function isFloorFixtureType(type) {
  return type === 'counter' || type === 'base' || type === 'sofa-set' || type === 'table-chair-set' || type === 'bar-stool';
}`,
  );

  scene = scene.replace(
`      } else if (moduleState.type === 'table-chair-set') {
        module = createTableChairSetModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'shelf') {`,
`      } else if (moduleState.type === 'table-chair-set') {
        module = createTableChairSetModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'bar-stool') {
        module = createBarStoolModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'shelf') {`,
  );

  scene = scene.replace(
`    if (moduleState?.type === 'table-chair-set') return 'Masa Sandalye Takımı';`,
`    if (moduleState?.type === 'table-chair-set') return 'Masa Sandalye Takımı';
    if (moduleState?.type === 'bar-stool') return 'Bar Taburesi';`,
  );

  const barStoolFn = `function createBarStoolModule(moduleState, moduleIndex) {
  const group = new THREE.Group();
  group.userData = { kind: 'module', moduleIndex, moduleId: moduleState.id, type: 'bar-stool', widthCm: 50, depthCm: 50, heightCm: 80 };

  const seatMaterial = new THREE.MeshStandardMaterial({ color: moduleState.surface?.color ?? '#ffffff', roughness: 0.56, metalness: 0, emissive: 0x000000, emissiveIntensity: 0 });
  const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x8a4f24, roughness: 0.62, metalness: 0 });
  const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x30343a, roughness: 0.32, metalness: 0.72 });
  const colorTargets = [];

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.07, 0.40), seatMaterial.clone());
  seat.position.set(0, 0.60, 0.02);
  seat.rotation.x = -0.03;
  seat.castShadow = true;
  seat.receiveShadow = true;
  group.add(seat);
  colorTargets.push(seat);

  const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.055), seatMaterial.clone());
  back.position.set(0, 0.72, -0.17);
  back.rotation.x = -0.12;
  back.castShadow = true;
  group.add(back);
  colorTargets.push(back);

  const legGeometry = new THREE.CylinderGeometry(0.022, 0.017, 0.61, 14);
  [[-0.16,-0.14],[0.16,-0.14],[-0.16,0.14],[0.16,0.14]].forEach(([lx,lz]) => {
    const leg = new THREE.Mesh(legGeometry, woodMaterial.clone());
    leg.position.set(lx, 0.30, lz);
    leg.rotation.z = lx < 0 ? 0.09 : -0.09;
    leg.rotation.x = lz < 0 ? -0.09 : 0.09;
    leg.castShadow = true;
    group.add(leg);
  });

  const footRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.012, 10, 40),
    metalMaterial.clone(),
  );
  footRing.rotation.x = Math.PI / 2;
  footRing.position.set(0, 0.25, 0);
  group.add(footRing);

  const selectable = colorTargets[0];
  const selectionFrame = createSelectionFrame(0.42, 0.24);
  selectionFrame.visible = false;
  selectable.add(selectionFrame);
  selectable.userData = { kind: 'surface', moduleType: 'bar-stool', selectionMode: 'module', acceptsImage: false, moduleIndex, moduleId: moduleState.id, widthCm: 50, stripIndex: null, stripNumber: null, surfaceRole: 'seat', surfaceId: moduleState.surface?.id, surfaceState: moduleState.surface, selectionFrame, colorTargets };
  colorTargets.forEach((mesh, index) => {
    if (index === 0) return;
    mesh.userData = { ...selectable.userData, surfaceId: String(moduleState.surface?.id) + '-' + index, selectionFrame: null };
  });

  return { group, surfaces: colorTargets };
}

`;
  scene = scene.replace('function createTableChairSetModule(moduleState, moduleIndex) {', barStoolFn + 'function createTableChairSetModule(moduleState, moduleIndex) {');
}
fs.writeFileSync('src/scene3d.js', scene);

const testPath = 'test/barStool.test.js';
if (!fs.existsSync(testPath)) {
  fs.writeFileSync(testPath, `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { BAR_STOOL_DIMENSIONS, MODULE_CATALOG } from '../src/catalog.js';\nimport { createBarStoolModuleState } from '../src/designState.js';\nimport { snapPlacementToStand } from '../src/modulePlacement.js';\n\ntest('bar taburesi 50 x 50 x 80 cm ölçülerini kullanır', () => {\n  assert.deepEqual(BAR_STOOL_DIMENSIONS, { widthCm: 50, depthCm: 50, heightCm: 80 });\n  assert.equal(MODULE_CATALOG.BAR_STOOL.widthCm, 50);\n  assert.equal(MODULE_CATALOG.BAR_STOOL.depthCm, 50);\n  assert.equal(MODULE_CATALOG.BAR_STOOL.heightCm, 80);\n  const state = createBarStoolModuleState();\n  assert.equal(state.type, 'bar-stool');\n  assert.equal(state.widthCm, 50);\n  assert.equal(state.depthCm, 50);\n  assert.equal(state.heightCm, 80);\n});\n\ntest('bar taburesi serbest gezer ve duvar iç yüzüne sıfır yanaşır', () => {\n  const left = snapPlacementToStand({ standType: 'l-left', moduleType: 'bar-stool', widthCm: 50, depthCm: 50, forceFree: true, pointerXCm: 40, pointerYCm: 40, standXCm: 600, standYCm: 600 });\n  assert.equal(left.ok, true);\n  assert.equal(left.placement.xCm, 5);\n  assert.equal(left.placement.yCm, 30);\n\n  const right = snapPlacementToStand({ standType: 'l-right', moduleType: 'bar-stool', widthCm: 50, depthCm: 50, forceFree: true, pointerXCm: 560, pointerYCm: 40, standXCm: 600, standYCm: 600 });\n  assert.equal(right.ok, true);\n  assert.equal(right.placement.xCm, 545);\n  assert.equal(right.placement.yCm, 30);\n\n  const island = snapPlacementToStand({ standType: 'island', moduleType: 'bar-stool', widthCm: 50, depthCm: 50, forceFree: true, pointerXCm: 40, pointerYCm: 40, standXCm: 600, standYCm: 600 });\n  assert.equal(island.ok, true);\n  assert.equal(island.placement.xCm, 0);\n  assert.equal(island.placement.yCm, 25);\n});\n`);
}
