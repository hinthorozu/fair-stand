import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, content) { fs.writeFileSync(path, content); }
function replaceExact(source, from, to, label, expected = 1) {
  const count = source.split(from).length - 1;
  if (count !== expected) throw new Error(`${label}: expected ${expected}, found ${count}`);
  return source.split(from).join(to);
}

// catalog
{
  const path = 'src/catalog.js';
  let s = read(path);
  if (!s.includes('export const BASE_DIMENSIONS')) {
    s = replaceExact(s,
`export const COUNTER_DIMENSIONS = Object.freeze({
  depthCm: 50,
  heightCm: 100,
  widthsCm: Object.freeze([100, 150, 200]),
});`,
`export const COUNTER_DIMENSIONS = Object.freeze({
  depthCm: 50,
  heightCm: 100,
  widthsCm: Object.freeze([100, 150, 200]),
});

export const BASE_DIMENSIONS = Object.freeze({
  depthCm: 50,
  heightCm: 50,
  widthsCm: Object.freeze([100, 150, 200]),
});`,
'base dimensions');
  }
  if (!s.includes('BASE_100:')) {
    s = replaceExact(s,
`  COUNTER_100: { type: 'counter', widthCm: 100, depthCm: 50, heightCm: 100, label: 'Banko 100' },
  COUNTER_150: { type: 'counter', widthCm: 150, depthCm: 50, heightCm: 100, label: 'Banko 150' },
  COUNTER_200: { type: 'counter', widthCm: 200, depthCm: 50, heightCm: 100, label: 'Banko 200' },`,
`  COUNTER_100: { type: 'counter', widthCm: 100, depthCm: 50, heightCm: 100, label: 'Banko 100' },
  COUNTER_150: { type: 'counter', widthCm: 150, depthCm: 50, heightCm: 100, label: 'Banko 150' },
  COUNTER_200: { type: 'counter', widthCm: 200, depthCm: 50, heightCm: 100, label: 'Banko 200' },
  BASE_100: { type: 'base', widthCm: 100, depthCm: 50, heightCm: 50, label: 'Baza 100' },
  BASE_150: { type: 'base', widthCm: 150, depthCm: 50, heightCm: 50, label: 'Baza 150' },
  BASE_200: { type: 'base', widthCm: 200, depthCm: 50, heightCm: 50, label: 'Baza 200' },`,
'base catalog entries');
  }
  write(path, s);
}

// design state
{
  const path = 'src/designState.js';
  let s = read(path);
  if (!s.includes('export function createBaseModuleState')) {
    const anchor = `export function duplicateModuleState(moduleState) {`;
    const block = `export function createBaseModuleState(widthCm) {\n  const width = Number(widthCm);\n  if (![100, 150, 200].includes(width)) return null;\n\n  return {\n    id: createId('module'),\n    type: 'base',\n    widthCm: width,\n    depthCm: 50,\n    heightCm: 50,\n    faces: {\n      front: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n      left: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n      right: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n    },\n  };\n}\n\n`;
    s = replaceExact(s, anchor, block + anchor, 'base state insertion');
  }
  write(path, s);
}

// main wiring
{
  const path = 'src/main.js';
  let s = read(path);
  if (!s.includes('createBaseModuleState,')) {
    s = replaceExact(s, `  createCounterModuleState,\n`, `  createBaseModuleState,\n  createCounterModuleState,\n`, 'base state import');
  }
  if (!s.includes("if (moduleType === 'base')")) {
    s = replaceExact(s,
`      if (moduleType === 'counter') {
        const faceLabel = surface.userData.surfaceRole === 'front'
          ? 'ön'
          : (surface.userData.surfaceRole === 'left' ? 'sol yan' : 'sağ yan');
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Banko ' + widthCm + ' cm · ' + faceLabel + ' cephe · renk + görsel uygulanabilir.';
        return;
      }
`,
`      if (moduleType === 'counter') {
        const faceLabel = surface.userData.surfaceRole === 'front'
          ? 'ön'
          : (surface.userData.surfaceRole === 'left' ? 'sol yan' : 'sağ yan');
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Banko ' + widthCm + ' cm · ' + faceLabel + ' cephe · renk + görsel uygulanabilir.';
        return;
      }

      if (moduleType === 'base') {
        const faceLabel = surface.userData.surfaceRole === 'front'
          ? 'ön'
          : (surface.userData.surfaceRole === 'left' ? 'sol yan' : 'sağ yan');
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Baza ' + widthCm + ' cm · ' + faceLabel + ' panel · renk + görsel uygulanabilir.';
        return;
      }
`,
'base selection info');
  }
  if (!s.includes("else if (module.type === 'base') state = createBaseModuleState")) {
    s = replaceExact(s,
`  if (module.type === 'flat-panel') state = createFlatPanelModuleState(module.widthCm);
  else if (module.type === 'counter') state = createCounterModuleState(module.widthCm);`,
`  if (module.type === 'flat-panel') state = createFlatPanelModuleState(module.widthCm);
  else if (module.type === 'base') state = createBaseModuleState(module.widthCm);
  else if (module.type === 'counter') state = createCounterModuleState(module.widthCm);`,
'base catalog state');
  }
  write(path, s);
}

// context label
{
  const path = 'src/moduleContextMenu.js';
  let s = read(path);
  if (!s.includes("  base: 'Baza',")) {
    s = replaceExact(s, `  counter: 'Banko',\n`, `  counter: 'Banko',\n  base: 'Baza',\n`, 'base context label');
  }
  write(path, s);
}

// drag sidebar
{
  const path = 'src/moduleDragSidebar.js';
  let s = read(path);
  if (!s.includes("  'BASE_200',")) {
    s = replaceExact(s,
`  'COUNTER_200',
  'COUNTER_150',
  'COUNTER_100',`,
`  'BASE_200',
  'BASE_150',
  'BASE_100',
  'COUNTER_200',
  'COUNTER_150',
  'COUNTER_100',`,
'base drag keys');
  }
  if (!s.includes('.module-drag-base {')) {
    s = replaceExact(s,
`    .module-drag-counter { position:relative; height:34px; border:3px solid #7b838c; background:#f8fafc; box-shadow:5px 5px 0 #d7dde4,0 2px 5px rgba(15,23,42,.08); }
    .module-drag-counter::after { content:''; position:absolute; left:-3px; right:-3px; top:-6px; height:5px; border:1px solid #9aa0a6; background:#eef2f6; }`,
`    .module-drag-base { position:relative; height:24px; border:3px solid #7b838c; background:#ffffff; box-shadow:4px 4px 0 #d7dde4,0 2px 5px rgba(15,23,42,.08); }
    .module-drag-base::before { content:''; position:absolute; inset:3px; border:1px solid #cbd5e1; background:#f8fafc; }
    .module-drag-base::after { content:''; position:absolute; left:-5px; right:-5px; top:-7px; height:5px; border:1px solid #9aa0a6; background:#ffffff; }
    .module-drag-counter { position:relative; height:34px; border:3px solid #7b838c; background:#f8fafc; box-shadow:5px 5px 0 #d7dde4,0 2px 5px rgba(15,23,42,.08); }
    .module-drag-counter::after { content:''; position:absolute; left:-3px; right:-3px; top:-6px; height:5px; border:1px solid #9aa0a6; background:#eef2f6; }`,
'base drag css');
  }
  if (!s.includes("if (module.type === 'base')")) {
    s = replaceExact(s,
`  if (module.type === 'counter') {
    const body = document.createElement('div');
    body.className = 'module-drag-counter';
    body.style.width = Math.max(34, previewWidthPx(module.widthCm)) + 'px';
    preview.appendChild(body);
    return preview;
  }
`,
`  if (module.type === 'base') {
    const body = document.createElement('div');
    body.className = 'module-drag-base';
    body.style.width = Math.max(34, previewWidthPx(module.widthCm)) + 'px';
    preview.appendChild(body);
    return preview;
  }

  if (module.type === 'counter') {
    const body = document.createElement('div');
    body.className = 'module-drag-counter';
    body.style.width = Math.max(34, previewWidthPx(module.widthCm)) + 'px';
    preview.appendChild(body);
    return preview;
  }
`,
'base drag preview');
  }
  write(path, s);
}

// placement: baza inherits banko's exact logical endpoint/corner behavior
{
  const path = 'src/modulePlacement.js';
  let s = read(path);
  if (!s.includes('function usesLogicalFixtureEndpoint')) {
    s = replaceExact(s,
`function hasStrictDepthBounds(depthCm) {
  const depth = Number(depthCm);
  return Number.isFinite(depth) && depth > MODULE_COLLISION_DEPTH_CM + EPSILON_CM;
}
`,
`function hasStrictDepthBounds(depthCm) {
  const depth = Number(depthCm);
  return Number.isFinite(depth) && depth > MODULE_COLLISION_DEPTH_CM + EPSILON_CM;
}

function usesLogicalFixtureEndpoint(moduleType) {
  return moduleType === 'counter' || moduleType === 'base';
}
`,
'fixture endpoint helper');
  }
  s = replaceExact(s,
`    const counterModule = horizontalModule?.type === 'counter'
      ? horizontalModule
      : (verticalModule?.type === 'counter' ? verticalModule : null);`,
`    const counterModule = usesLogicalFixtureEndpoint(horizontalModule?.type)
      ? horizontalModule
      : (usesLogicalFixtureEndpoint(verticalModule?.type) ? verticalModule : null);`,
'fixture endpoint collision');
  s = replaceExact(s,
`  const isCounter = moduleType === 'counter';`,
`  const isCounter = usesLogicalFixtureEndpoint(moduleType);`,
'fixture snap mode');
  write(path, s);
}

// scene rendering / movement
{
  const path = 'src/scene3d.js';
  let s = read(path);
  if (!s.includes('function isFloorFixtureType')) {
    s = replaceExact(s,
`const STAGE_HOME_DIRECTION = new THREE.Vector3(1, 1.05, 1).normalize();`,
`const STAGE_HOME_DIRECTION = new THREE.Vector3(1, 1.05, 1).normalize();

function isFloorFixtureType(type) {
  return type === 'counter' || type === 'base';
}`,
'floor fixture helper');
  }
  if (!s.includes("moduleState.type === 'base'")) {
    s = replaceExact(s,
`      if (moduleState.type === 'separator') {
        module = createSeparatorModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'counter') {`,
`      if (moduleState.type === 'separator') {
        module = createSeparatorModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'base') {
        module = createBaseModule(
          moduleState,
          moduleIndex,
          (surface) => applyStoredImage(surface),
        );
      } else if (moduleState.type === 'counter') {`,
'base build branch');
  }
  s = replaceExact(s,
`    nextPlacement.wallId = moduleState.type === 'counter'
      ? 'free'`,
`    nextPlacement.wallId = isFloorFixtureType(moduleState.type)
      ? 'free'`,
'base selected rotation');
  s = replaceExact(s,
`      forceFree: moduleState.type === 'counter',`,
`      forceFree: isFloorFixtureType(moduleState.type),`,
'base force free', 4);
  if (!s.includes("if (moduleState?.type === 'base') return `Baza")) {
    s = replaceExact(s,
`    if (moduleState?.type === 'counter') return \`Banko \${widthCm}\`;`,
`    if (moduleState?.type === 'base') return \`Baza \${widthCm}\`;
    if (moduleState?.type === 'counter') return \`Banko \${widthCm}\`;`,
'base drag label');
  }
  if (!s.includes("moduleState?.type === 'base' ? '22px'")) {
    s = replaceExact(s,
`      preview.style.height = moduleState?.type === 'counter' ? '28px' : '48px';
      if (moduleState?.type === 'counter') {
        preview.style.background = 'linear-gradient(to bottom,#eef2f6 0 16%,#d1d5db 16% 20%,#f8fafc 20% 100%)';
      } else if (moduleState?.type === 'separator') {`,
`      preview.style.height = moduleState?.type === 'base' ? '22px' : (moduleState?.type === 'counter' ? '28px' : '48px');
      if (moduleState?.type === 'base') {
        preview.style.background = 'linear-gradient(to bottom,#ffffff 0 20%,#9aa0a6 20% 29%,#f8fafc 29% 86%,#9aa0a6 86% 100%)';
      } else if (moduleState?.type === 'counter') {
        preview.style.background = 'linear-gradient(to bottom,#eef2f6 0 16%,#d1d5db 16% 20%,#f8fafc 20% 100%)';
      } else if (moduleState?.type === 'separator') {`,
'base drag badge');
  }
  if (!s.includes('function createBaseModule(moduleState')) {
    const anchor = `function createCounterModule(moduleState, moduleIndex, onSurfaceReady) {`;
    const block = `function createBaseModule(moduleState, moduleIndex, onSurfaceReady) {\n  const widthCm = Number(moduleState.widthCm);\n  const depthCm = Number(moduleState.depthCm) || 50;\n  const heightCm = Number(moduleState.heightCm) || 50;\n  const widthM = widthCm / 100;\n  const depthM = depthCm / 100;\n  const heightM = heightCm / 100;\n  const profileM = PANEL_VERTICAL_PROFILE_WIDTH_M;\n  const topThicknessM = 0.035;\n  const topOverhangM = 0.02;\n  const frameHeightM = Math.max(heightM - topThicknessM, profileM * 3);\n  const panelHeightM = Math.max(frameHeightM - profileM * 2, 0.05);\n  const frontPanelWidthM = Math.max(widthM - profileM * 2, 0.05);\n  const sidePanelWidthM = Math.max(depthM - profileM * 2, 0.05);\n  const group = new THREE.Group();\n  group.userData = {\n    kind: 'module',\n    moduleIndex,\n    moduleId: moduleState.id,\n    type: moduleState.type,\n    widthCm,\n    depthCm,\n    heightCm,\n  };\n\n  const frameMaterial = new THREE.MeshStandardMaterial({\n    color: FRAME_COLOR,\n    metalness: 0.68,\n    roughness: 0.28,\n  });\n  const addProfile = (geometry, position) => {\n    const mesh = new THREE.Mesh(geometry, frameMaterial.clone());\n    mesh.position.copy(position);\n    mesh.castShadow = true;\n    mesh.receiveShadow = true;\n    group.add(mesh);\n    return mesh;\n  };\n\n  // Four visible Maxima corner profiles. Rear remains open; only front/left/right are paneled.\n  const cornerPostGeometry = new THREE.BoxGeometry(profileM, frameHeightM, profileM);\n  [-1, 1].forEach((xSide) => {\n    [-1, 1].forEach((zSide) => {\n      addProfile(\n        cornerPostGeometry.clone(),\n        new THREE.Vector3(\n          xSide * (widthM / 2 - profileM / 2),\n          frameHeightM / 2,\n          zSide * (depthM / 2 - profileM / 2),\n        ),\n      );\n    });\n  });\n\n  const frontRailGeometry = new THREE.BoxGeometry(frontPanelWidthM, profileM, profileM);\n  [profileM / 2, frameHeightM - profileM / 2].forEach((y) => {\n    addProfile(\n      frontRailGeometry.clone(),\n      new THREE.Vector3(0, y, depthM / 2 - profileM / 2),\n    );\n  });\n\n  const sideRailGeometry = new THREE.BoxGeometry(profileM, profileM, sidePanelWidthM);\n  [-1, 1].forEach((xSide) => {\n    [profileM / 2, frameHeightM - profileM / 2].forEach((y) => {\n      addProfile(\n        sideRailGeometry.clone(),\n        new THREE.Vector3(xSide * (widthM / 2 - profileM / 2), y, 0),\n      );\n    });\n  });\n\n  const top = new THREE.Mesh(\n    new THREE.BoxGeometry(\n      widthM + topOverhangM * 2,\n      topThicknessM,\n      depthM + topOverhangM * 2,\n    ),\n    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.74, metalness: 0 }),\n  );\n  top.position.set(0, frameHeightM + topThicknessM / 2, 0);\n  top.castShadow = true;\n  top.receiveShadow = true;\n  group.add(top);\n\n  const surfaces = [];\n  const addPanelFace = (surfaceRole, surfaceState, faceWidthM, position, rotationY = 0) => {\n    if (!surfaceState) return;\n\n    const backing = new THREE.Mesh(\n      new THREE.BoxGeometry(faceWidthM, panelHeightM, 0.012),\n      new THREE.MeshStandardMaterial({ color: PANEL_BACK_COLOR, roughness: 0.74, metalness: 0 }),\n    );\n    backing.position.copy(position);\n    backing.rotation.y = rotationY;\n    backing.castShadow = true;\n    backing.receiveShadow = true;\n    group.add(backing);\n\n    const surface = new THREE.Mesh(\n      new THREE.PlaneGeometry(faceWidthM, panelHeightM),\n      new THREE.MeshStandardMaterial({\n        color: surfaceState.imageAssetId ? 0xffffff : surfaceState.color,\n        roughness: 0.72,\n        metalness: 0,\n        side: THREE.DoubleSide,\n        emissive: 0x000000,\n        emissiveIntensity: 0,\n      }),\n    );\n    surface.position.copy(position);\n    surface.rotation.y = rotationY;\n    if (surfaceRole === 'front') surface.position.z += 0.0065;\n    else if (surfaceRole === 'left') surface.position.x -= 0.0065;\n    else surface.position.x += 0.0065;\n\n    const selectionFrame = createSelectionFrame(faceWidthM, panelHeightM);\n    selectionFrame.visible = false;\n    surface.add(selectionFrame);\n    surface.userData = {\n      kind: 'surface',\n      moduleType: 'base',\n      selectionMode: 'module',\n      acceptsImage: true,\n      moduleIndex,\n      moduleId: moduleState.id,\n      widthCm,\n      stripIndex: null,\n      stripNumber: null,\n      surfaceRole,\n      surfaceId: surfaceState.id,\n      surfaceState,\n      selectionFrame,\n      backing,\n    };\n    group.add(surface);\n    surfaces.push(surface);\n    onSurfaceReady?.(surface);\n  };\n\n  const panelCenterY = profileM + panelHeightM / 2;\n  addPanelFace(\n    'front',\n    moduleState.faces?.front,\n    frontPanelWidthM,\n    new THREE.Vector3(0, panelCenterY, depthM / 2 - profileM - 0.006),\n  );\n  addPanelFace(\n    'left',\n    moduleState.faces?.left,\n    sidePanelWidthM,\n    new THREE.Vector3(-widthM / 2 + profileM + 0.006, panelCenterY, 0),\n    -Math.PI / 2,\n  );\n  addPanelFace(\n    'right',\n    moduleState.faces?.right,\n    sidePanelWidthM,\n    new THREE.Vector3(widthM / 2 - profileM - 0.006, panelCenterY, 0),\n    Math.PI / 2,\n  );\n\n  return { group, surfaces };\n}\n\n`;
    s = replaceExact(s, anchor, block + anchor, 'base renderer insertion');
  }
  write(path, s);
}

// tests
{
  const path = 'test/baseModule.test.js';
  const content = `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { BASE_DIMENSIONS, MODULE_CATALOG } from '../src/catalog.js';\nimport { createBaseModuleState, duplicateModuleState } from '../src/designState.js';\nimport {\n  rotateModulePlacementAroundCenter,\n  snapPlacementToModules,\n  snapPlacementToStand,\n  validatePlacementAgainstModules,\n} from '../src/modulePlacement.js';\n\ntest('baza catalog exposes 100 150 200 cm sizes at 50 x 50 cm depth and height', () => {\n  assert.deepEqual(BASE_DIMENSIONS.widthsCm, [100, 150, 200]);\n  assert.equal(BASE_DIMENSIONS.depthCm, 50);\n  assert.equal(BASE_DIMENSIONS.heightCm, 50);\n  assert.equal(MODULE_CATALOG.BASE_100.label, 'Baza 100');\n  assert.equal(MODULE_CATALOG.BASE_150.label, 'Baza 150');\n  assert.equal(MODULE_CATALOG.BASE_200.label, 'Baza 200');\n});\n\ntest('baza state has independent front left and right editable panels', () => {\n  const base = createBaseModuleState(150);\n  assert.equal(base.type, 'base');\n  assert.equal(base.widthCm, 150);\n  assert.equal(base.depthCm, 50);\n  assert.equal(base.heightCm, 50);\n  assert.deepEqual(Object.keys(base.faces), ['front', 'left', 'right']);\n  assert.notEqual(base.faces.front.id, base.faces.left.id);\n  base.faces.front.color = '#112233';\n  assert.equal(base.faces.left.color, '#ffffff');\n  assert.equal(createBaseModuleState(50), null);\n});\n\ntest('duplicating a baza preserves design and creates independent face ids', () => {\n  const source = createBaseModuleState(200);\n  source.faces.right.imageAssetId = 'base-art';\n  const copy = duplicateModuleState(source);\n  assert.notEqual(copy.id, source.id);\n  assert.equal(copy.faces.right.imageAssetId, 'base-art');\n  for (const key of ['front', 'left', 'right']) {\n    assert.notEqual(copy.faces[key].id, source.faces[key].id);\n  }\n});\n\ntest('baza uses the same 50 cm free footprint and four-direction center rotation as banko', () => {\n  const placed = snapPlacementToStand({\n    standType: 'u-stand',\n    widthCm: 150,\n    depthCm: 50,\n    forceFree: true,\n    pointerXCm: 220,\n    pointerYCm: 20,\n    standXCm: 800,\n    standYCm: 600,\n  });\n  assert.equal(placed.ok, true);\n  assert.equal(placed.placement.wallId, 'free');\n  assert.equal(placed.placement.yCm, 25);\n\n  const rotated = rotateModulePlacementAroundCenter(placed.placement, 150, 90, 50);\n  assert.equal(rotated.rotationZDeg, 90);\n  assert.equal((rotated.xCm - 25) % 50, 0);\n  assert.equal(rotated.yCm % 50, 0);\n});\n\ntest('all baza widths fit exact logical grid gaps next to thin Maxima modules', () => {\n  [100, 150, 200].forEach((widthCm) => {\n    const modules = [{\n      id: 'separator',\n      type: 'separator',\n      widthCm: 300,\n      placement: { xCm: widthCm, yCm: 0, zCm: 0, rotationZDeg: 90, wallId: 'right' },\n    }];\n    const snapped = snapPlacementToModules({\n      moduleId: 'base',\n      moduleType: 'base',\n      widthCm,\n      depthCm: 50,\n      pointerXCm: widthCm / 2,\n      pointerYCm: 125,\n      rotationZDeg: 0,\n      modules,\n      standType: 'u-stand',\n      standXCm: widthCm,\n      standYCm: 400,\n    });\n    assert.equal(snapped?.snapKind, 'face', String(widthCm));\n    assert.equal(snapped?.placement.xCm, 0, String(widthCm));\n    assert.equal(validatePlacementAgainstModules({\n      moduleId: 'base',\n      moduleType: 'base',\n      widthCm,\n      depthCm: 50,\n      placement: snapped.placement,\n      modules,\n      standType: 'u-stand',\n      standXCm: widthCm,\n      standYCm: 400,\n    }).ok, true, String(widthCm));\n  });\n});\n\ntest('baza physical depth still rejects real body overlap', () => {\n  const modules = [{\n    id: 'base-a',\n    type: 'base',\n    widthCm: 150,\n    depthCm: 50,\n    placement: { xCm: 100, yCm: 125, zCm: 0, rotationZDeg: 0, wallId: 'free' },\n  }];\n  const overlap = validatePlacementAgainstModules({\n    moduleId: 'base-b',\n    moduleType: 'base',\n    widthCm: 100,\n    depthCm: 50,\n    placement: { xCm: 150, yCm: 150, zCm: 0, rotationZDeg: 0, wallId: 'free' },\n    modules,\n    standType: 'island',\n    standXCm: 800,\n    standYCm: 600,\n  });\n  assert.equal(overlap.ok, false);\n});\n`;
  write(path, content);
}

// project rules
{
  const path = 'PROJECT_RULES.md';
  let s = read(path);
  if (!s.includes('## Baza modülü standardı')) {
    s += `\n\n## Baza modülü standardı\n\n- Baza genişlikleri X = 100 / 150 / 200 cm; derinlik Y = 50 cm; ilk referans model yüksekliği H = 50 cm.\n- Üst tabla sabit beyaz ahşap/levha görünümündedir ve panel yüzeyi değildir.\n- Ön X paneli ile sol ve sağ Y panelleri birbirinden bağımsız seçilebilir; her panele ayrı renk veya görsel atanabilir.\n- Arka yüz panel ile kapatılmaz; yapı ön/sol/sağ panel ve görünür Maxima köşe profilleriyle oluşturulur.\n- Baza banko gibi serbest yerleşim modülüdür; aktif duvar zincirine otomatik katılmaz. 0/90/180/270 dönüş, R / Shift+R, 50 cm fiziksel derinlik, stand sınırı, collision ve magnetic snap kuralları geçerlidir.\n- İnce Maxima modüllerine uçtan bağlantıda bankoda kullanılan mantıksal merkez/bağlantı çizgisi davranışı uygulanır; nominal 100/150/200 cm ölçüler korunur.\n`;
  }
  write(path, s);
}

// roadmap order previously requested by user
{
  const path = 'ROADMAP.md';
  let s = read(path);
  if (!s.includes('## Planlanan yeni modül geliştirme sırası')) {
    s += `\n\n## Planlanan yeni modül geliştirme sırası\n\n1. Baza\n2. Raf\n3. Koltuk\n4. Masa Sandalye Takımı\n5. Bar Taburesi\n`;
  }
  write(path, s);
}

// changelog
{
  const path = 'Changelog.md';
  let s = read(path);
  if (!s.includes('449. Baza 100/150/200')) {
    s += `\n\n## Baza modülü\n\n449. Baza 100/150/200 modülleri eklendi; ölçüler X = 100/150/200 cm, Y = 50 cm, H = 50 cm.\n450. Baza geometrisi sabit beyaz üst tabla, ön/sol/sağ bağımsız panel ve dört görünür Maxima köşe profiliyle oluşturuldu; arka yüz açık bırakıldı.\n451. Ön, sol ve sağ baza panelleri birbirinden bağımsız renk ve görsel alabilir; üst tabla sabit beyazdır.\n452. Baza bankoyla aynı serbest placement davranışını kullanır: 50 cm fiziksel derinlik, 4 yön dönüş, R/Shift+R, collision, stand sınırı ve magnetic snap.\n453. Bankoda kullanılan ince Maxima modülü mantıksal endpoint bağlantısı baza için de aktif edildi; 100/150/200 nominal grid aralıkları korunur.\n454. Baza katalog drag kartları, seçim bilgisi, sağ tık etiketi, reset/duplicate state desteği ve regresyon testleri eklendi.\n455. Sonraki modül geliştirme sırası Roadmap'e Baza → Raf → Koltuk → Masa Sandalye Takımı → Bar Taburesi olarak kaydedildi.\n`;
  }
  write(path, s);
}

console.log('Base module patch applied.');
