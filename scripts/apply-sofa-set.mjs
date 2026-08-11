import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');
const write = (p, s) => fs.writeFileSync(p, s);
function replaceExact(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Missing anchor: ${label}`);
  return source.replace(from, to);
}

// catalog
{
  const path = 'src/catalog.js';
  let s = read(path);
  if (!s.includes('export const SOFA_SET_DIMENSIONS')) {
    s = replaceExact(s,
`export const SHELF_DIMENSIONS = Object.freeze({\n  projectionCm: 30,\n  thicknessCm: 3,\n  widthsCm: Object.freeze([100, 150, 200]),\n  heightsByCountCm: Object.freeze({\n    2: Object.freeze([100, 150]),\n    3: Object.freeze([100, 150, 200]),\n  }),\n});`,
`export const SHELF_DIMENSIONS = Object.freeze({\n  projectionCm: 30,\n  thicknessCm: 3,\n  widthsCm: Object.freeze([100, 150, 200]),\n  heightsByCountCm: Object.freeze({\n    2: Object.freeze([100, 150]),\n    3: Object.freeze([100, 150, 200]),\n  }),\n});\n\nexport const SOFA_SET_DIMENSIONS = Object.freeze({\n  widthCm: 250,\n  depthCm: 250,\n  heightCm: 80,\n  loveseatWidthCm: 160,\n  chairWidthCm: 65,\n  tableDiameterCm: 60,\n});`, 'sofa dimensions');
  }
  if (!s.includes("SOFA_SET: { type: 'sofa-set'")) {
    s = replaceExact(s,
`  SHELF_3_200: { type: 'shelf', widthCm: 200, shelfCount: 3, label: 'Raf 200 · 3 Raf' },\n  DOOR_100:`,
`  SHELF_3_200: { type: 'shelf', widthCm: 200, shelfCount: 3, label: 'Raf 200 · 3 Raf' },\n  SOFA_SET: { type: 'sofa-set', widthCm: 250, depthCm: 250, heightCm: 80, label: 'Koltuk Takımı' },\n  DOOR_100:`, 'sofa catalog');
  }
  write(path, s);
}

// design state
{
  const path = 'src/designState.js';
  let s = read(path);
  if (!s.includes('export function createSofaSetModuleState()')) {
    s = replaceExact(s,
`export function createBaseModuleState(widthCm) {\n  const width = Number(widthCm);\n  if (![100, 150, 200].includes(width)) return null;\n\n  return {\n    id: createId('module'),\n    type: 'base',\n    widthCm: width,\n    depthCm: 50,\n    heightCm: 50,\n    faces: {\n      front: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n      left: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n      right: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n    },\n  };\n}`,
`export function createBaseModuleState(widthCm) {\n  const width = Number(widthCm);\n  if (![100, 150, 200].includes(width)) return null;\n\n  return {\n    id: createId('module'),\n    type: 'base',\n    widthCm: width,\n    depthCm: 50,\n    heightCm: 50,\n    faces: {\n      front: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n      left: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n      right: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n    },\n  };\n}\n\nexport function createSofaSetModuleState() {\n  return {\n    id: createId('module'),\n    type: 'sofa-set',\n    widthCm: 250,\n    depthCm: 250,\n    heightCm: 80,\n    surface: {\n      id: createId('surface'),\n      color: DEFAULT_PANEL_COLOR,\n    },\n  };\n}`,
'sofa state');
  }
  write(path, s);
}

// main wiring
{
  const path = 'src/main.js';
  let s = read(path);
  if (!s.includes('  createSofaSetModuleState,')) {
    s = replaceExact(s, `  createShelfModuleState,\n`, `  createShelfModuleState,\n  createSofaSetModuleState,\n`, 'sofa import');
  }
  if (!s.includes("if (moduleType === 'sofa-set')")) {
    s = replaceExact(s,
`      if (moduleType === 'shelf') {\n        const shelfCount = Number(surface.userData.shelfCount) || 2;\n        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Raf ' + widthCm + ' cm · ' + shelfCount + ' raflı · alttan ' + stripNumber + '. panel · renk + görsel uygulanabilir.';\n        return;\n      }`,
`      if (moduleType === 'shelf') {\n        const shelfCount = Number(surface.userData.shelfCount) || 2;\n        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Raf ' + widthCm + ' cm · ' + shelfCount + ' raflı · alttan ' + stripNumber + '. panel · renk + görsel uygulanabilir.';\n        return;\n      }\n\n      if (moduleType === 'sofa-set') {\n        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Koltuk Takımı · koltuk döşeme rengi değiştirilebilir · cam sehpa sabittir.';\n        return;\n      }`, 'sofa selection');
  }
  if (!s.includes("else if (module.type === 'sofa-set') state = createSofaSetModuleState();")) {
    s = replaceExact(s,
`  else if (module.type === 'shelf') state = createShelfModuleState(module.widthCm, module.shelfCount);\n  else if (module.type === 'door')`,
`  else if (module.type === 'shelf') state = createShelfModuleState(module.widthCm, module.shelfCount);\n  else if (module.type === 'sofa-set') state = createSofaSetModuleState();\n  else if (module.type === 'door')`, 'sofa create state');
  }
  write(path, s);
}

// context menu label
{
  const path = 'src/moduleContextMenu.js';
  let s = read(path);
  if (!s.includes("  'sofa-set': 'Koltuk Takımı',")) {
    s = replaceExact(s, `  shelf: 'Raf',\n`, `  shelf: 'Raf',\n  'sofa-set': 'Koltuk Takımı',\n`, 'sofa context label');
  }
  write(path, s);
}

// drag sidebar
{
  const path = 'src/moduleDragSidebar.js';
  let s = read(path);
  if (!s.includes("  'SOFA_SET',")) {
    s = replaceExact(s, `  'BASE_200',\n`, `  'SOFA_SET',\n  'BASE_200',\n`, 'sofa drag key');
  }
  if (!s.includes('.module-drag-sofa')) {
    s = replaceExact(s,
`    .module-drag-base { position:relative; height:24px; border:3px solid #7b838c; background:#ffffff; box-shadow:4px 4px 0 #d7dde4,0 2px 5px rgba(15,23,42,.08); }`,
`    .module-drag-sofa { position:relative; width:58px; height:58px; }\n    .module-drag-sofa::before { content:''; position:absolute; left:6px; top:4px; width:46px; height:18px; border:2px solid #9aa0a6; border-radius:5px; background:#f8fafc; box-shadow:0 2px 4px rgba(15,23,42,.08); }\n    .module-drag-sofa::after { content:''; position:absolute; left:7px; bottom:4px; width:18px; height:25px; border:2px solid #9aa0a6; border-radius:5px; background:#f8fafc; box-shadow:28px 0 0 -2px #f8fafc,28px 0 0 0 #9aa0a6; }\n    .module-drag-base { position:relative; height:24px; border:3px solid #7b838c; background:#ffffff; box-shadow:4px 4px 0 #d7dde4,0 2px 5px rgba(15,23,42,.08); }`, 'sofa css');
  }
  if (!s.includes("if (module.type === 'sofa-set')")) {
    s = replaceExact(s,
`  if (module.type === 'base') {`,
`  if (module.type === 'sofa-set') {\n    const body = document.createElement('div');\n    body.className = 'module-drag-sofa';\n    preview.appendChild(body);\n    return preview;\n  }\n\n  if (module.type === 'base') {`, 'sofa preview');
  }
  write(path, s);
}

// scene rendering
{
  const path = 'src/scene3d.js';
  let s = read(path);
  if (!s.includes("return type === 'counter' || type === 'base' || type === 'sofa-set';")) {
    s = replaceExact(s,
`function isFloorFixtureType(type) {\n  return type === 'counter' || type === 'base';\n}`,
`function isFloorFixtureType(type) {\n  return type === 'counter' || type === 'base' || type === 'sofa-set';\n}`,
'sofa floor fixture');
  }
  if (!s.includes("} else if (moduleState.type === 'sofa-set') {")) {
    s = replaceExact(s,
`      } else if (moduleState.type === 'counter') {\n        module = createCounterModule(\n          moduleState,\n          moduleIndex,\n          (surface) => applyStoredImage(surface),\n        );\n      } else if (moduleState.type === 'shelf') {`,
`      } else if (moduleState.type === 'counter') {\n        module = createCounterModule(\n          moduleState,\n          moduleIndex,\n          (surface) => applyStoredImage(surface),\n        );\n      } else if (moduleState.type === 'sofa-set') {\n        module = createSofaSetModule(moduleState, moduleIndex);\n      } else if (moduleState.type === 'shelf') {`, 'sofa scene dispatch');
  }
  if (!s.includes("if (moduleState?.type === 'sofa-set') return 'Koltuk Takımı';")) {
    s = replaceExact(s,
`    if (moduleState?.type === 'base') return \`Baza \${widthCm}\`;`,
`    if (moduleState?.type === 'sofa-set') return 'Koltuk Takımı';\n    if (moduleState?.type === 'base') return \`Baza \${widthCm}\`;`, 'sofa drag label');
  }
  if (!s.includes("moduleState?.type === 'sofa-set' ? '34px'")) {
    s = replaceExact(s,
`      preview.style.height = moduleState?.type === 'base' ? '22px' : (moduleState?.type === 'counter' ? '28px' : '48px');`,
`      preview.style.height = moduleState?.type === 'sofa-set' ? '34px' : (moduleState?.type === 'base' ? '22px' : (moduleState?.type === 'counter' ? '28px' : '48px'));`, 'sofa badge height');
    s = replaceExact(s,
`      if (moduleState?.type === 'shelf') {`,
`      if (moduleState?.type === 'sofa-set') {\n        preview.style.background = 'linear-gradient(to bottom,#f8fafc 0 45%,#9aa0a6 45% 52%,#f8fafc 52% 100%)';\n      } else if (moduleState?.type === 'shelf') {`, 'sofa badge style');
  }
  if (!s.includes('function createSofaSetModule(moduleState, moduleIndex)')) {
    const anchor = `function createBaseModule(moduleState, moduleIndex, onSurfaceReady) {`;
    const block = `function createSofaSetModule(moduleState, moduleIndex) {\n  const widthM = Number(moduleState.widthCm || 250) / 100;\n  const depthM = Number(moduleState.depthCm || 250) / 100;\n  const group = new THREE.Group();\n  group.userData = { kind: 'module', moduleIndex, moduleId: moduleState.id, type: 'sofa-set', widthCm: Number(moduleState.widthCm || 250), depthCm: Number(moduleState.depthCm || 250), heightCm: Number(moduleState.heightCm || 80) };\n\n  const upholstery = [];\n  const material = new THREE.MeshStandardMaterial({ color: moduleState.surface?.color ?? '#ffffff', roughness: 0.68, metalness: 0, emissive: 0x000000, emissiveIntensity: 0 });\n  const addUpholsteredBox = (w, h, d, x, y, z, radiusHint = false) => {\n    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material.clone());\n    mesh.position.set(x, y, z);\n    mesh.castShadow = true;\n    mesh.receiveShadow = true;\n    if (radiusHint) mesh.scale.set(0.98, 1, 0.98);\n    group.add(mesh);\n    upholstery.push(mesh);\n    return mesh;\n  };\n\n  const addSofa = ({ x, z, seatWidth, seatDepth, twoSeat = false, facing = 'front' }) => {\n    const seatY = 0.29;\n    const seatH = 0.18;\n    const armW = 0.12;\n    const backH = 0.62;\n    const backT = 0.13;\n    const dir = facing === 'front' ? 1 : -1;\n    const backZ = z - dir * (seatDepth / 2 - backT / 2);\n    addUpholsteredBox(seatWidth - armW * 2, seatH, seatDepth - 0.16, x, seatY, z + dir * 0.04, true);\n    addUpholsteredBox(seatWidth, backH, backT, x, backH / 2, backZ, true);\n    addUpholsteredBox(armW, 0.52, seatDepth, x - seatWidth / 2 + armW / 2, 0.26, z, true);\n    addUpholsteredBox(armW, 0.52, seatDepth, x + seatWidth / 2 - armW / 2, 0.26, z, true);\n    if (twoSeat) {\n      const seam = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.185, seatDepth - 0.2), new THREE.MeshStandardMaterial({ color: 0xcfd4da, roughness: 0.7 }));\n      seam.position.set(x, seatY + 0.004, z + dir * 0.04);\n      group.add(seam);\n    }\n  };\n\n  addSofa({ x: 0, z: -depthM / 2 + 0.48, seatWidth: 1.60, seatDepth: 0.78, twoSeat: true, facing: 'front' });\n  addSofa({ x: -0.475, z: depthM / 2 - 0.50, seatWidth: 0.65, seatDepth: 0.75, facing: 'back' });\n  addSofa({ x: 0.475, z: depthM / 2 - 0.50, seatWidth: 0.65, seatDepth: 0.75, facing: 'back' });\n\n  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, 0.018, 48), new THREE.MeshPhysicalMaterial({ color: 0xd7e9ed, transparent: true, opacity: 0.42, roughness: 0.12, metalness: 0, transmission: 0.28, depthWrite: false }));\n  glass.position.set(0, 0.42, 0.10);\n  glass.castShadow = false;\n  glass.receiveShadow = true;\n  group.add(glass);\n  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.40, 20), new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.72, roughness: 0.28 }));\n  stem.position.set(0, 0.21, 0.10);\n  group.add(stem);\n  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.035, 32), new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.72, roughness: 0.3 }));\n  base.position.set(0, 0.018, 0.10);\n  group.add(base);\n\n  const selectable = upholstery[0];\n  const selectionFrame = createSelectionFrame(1.36, 0.18);\n  selectionFrame.visible = false;\n  selectable.add(selectionFrame);\n  selectable.userData = { kind: 'surface', moduleType: 'sofa-set', selectionMode: 'module', acceptsImage: false, moduleIndex, moduleId: moduleState.id, widthCm: Number(moduleState.widthCm || 250), stripIndex: null, stripNumber: null, surfaceRole: 'upholstery', surfaceId: moduleState.surface?.id, surfaceState: moduleState.surface, selectionFrame, colorTargets: upholstery };\n  upholstery.forEach((mesh, index) => {\n    if (index === 0) return;\n    mesh.userData = { ...selectable.userData, surfaceId: \`\${moduleState.surface?.id}-\${index}\`, selectionFrame: null };\n  });\n\n  return { group, surfaces: upholstery };\n}\n\n`;
    s = replaceExact(s, anchor, block + anchor, 'sofa scene function');
  }
  write(path, s);
}

// tests
{
  const path = 'test/sofaSet.test.js';
  if (!fs.existsSync(path)) {
    write(path, `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { MODULE_CATALOG, SOFA_SET_DIMENSIONS } from '../src/catalog.js';\nimport { createSofaSetModuleState, duplicateModuleState } from '../src/designState.js';\nimport { snapPlacementToStand, rotateModulePlacementAroundCenter, validatePlacementAgainstModules } from '../src/modulePlacement.js';\n\ntest('koltuk takımı tek katalog modülü ve sabit 250 x 250 cm footprint kullanır', () => {\n  assert.equal(MODULE_CATALOG.SOFA_SET.type, 'sofa-set');\n  assert.equal(SOFA_SET_DIMENSIONS.loveseatWidthCm, 160);\n  assert.equal(SOFA_SET_DIMENSIONS.chairWidthCm, 65);\n  assert.equal(SOFA_SET_DIMENSIONS.tableDiameterCm, 60);\n  assert.equal(SOFA_SET_DIMENSIONS.widthCm, 250);\n  assert.equal(SOFA_SET_DIMENSIONS.depthCm, 250);\n});\n\ntest('koltuk takımı tek renk state taşır ve kopyada bağımsız surface id üretir', () => {\n  const state = createSofaSetModuleState();\n  assert.equal(state.type, 'sofa-set');\n  assert.equal(state.widthCm, 250);\n  assert.equal(state.depthCm, 250);\n  state.surface.color = '#112233';\n  const copy = duplicateModuleState(state);\n  assert.equal(copy.surface.color, '#112233');\n  assert.notEqual(copy.surface.id, state.surface.id);\n});\n\ntest('koltuk takımı serbest yerleşir ve 90 derece döner', () => {\n  const placed = snapPlacementToStand({ standType: 'island', widthCm: 250, depthCm: 250, forceFree: true, pointerXCm: 300, pointerYCm: 300, standXCm: 800, standYCm: 800 });\n  assert.equal(placed.ok, true);\n  assert.equal(placed.placement.wallId, 'free');\n  const rotated = rotateModulePlacementAroundCenter(placed.placement, 250, 90, 250);\n  assert.equal(rotated.rotationZDeg, 90);\n});\n\ntest('koltuk takımı gerçek footprint çakışmasını reddeder', () => {\n  const modules = [{ id: 'sofa-a', type: 'sofa-set', widthCm: 250, depthCm: 250, placement: { xCm: 100, yCm: 100, zCm: 0, rotationZDeg: 0, wallId: 'free' } }];\n  const result = validatePlacementAgainstModules({ moduleId: 'sofa-b', moduleType: 'sofa-set', widthCm: 250, depthCm: 250, placement: { xCm: 150, yCm: 150, zCm: 0, rotationZDeg: 0, wallId: 'free' }, modules, standType: 'island', standXCm: 900, standYCm: 900 });\n  assert.equal(result.ok, false);\n});\n`);
  }
}

// docs
{
  const path = 'Changelog.md';
  let s = read(path);
  if (!s.includes('## Koltuk Takımı modülü')) {
    s += `\n\n## Koltuk Takımı modülü\n\n456. Tek parça Koltuk Takımı katalog modülü eklendi: yaklaşık 160 cm ikili koltuk, iki adet 65 cm tekli koltuk ve ortada 60 cm çapında cam sehpa.\n457. Koltuk döşemelerinin tamamı tek renk seçimiyle birlikte değişir; cam sehpa renk/görsel editöründen etkilenmez.\n458. Koltuk Takımı serbest yerleşim modülüdür; 250 x 250 cm footprint, R/Shift+R dönüş, stand sınırı ve collision kurallarını kullanır.\n`;
  }
  write(path, s);
}
{
  const path = 'PROJECT_RULES.md';
  let s = read(path);
  if (!s.includes('## Koltuk Takımı standardı')) {
    s += `\n\n## Koltuk Takımı standardı\n\n- Tek modül olarak 1 adet yaklaşık 160 cm ikili koltuk, 2 adet yaklaşık 65 cm tekli koltuk ve ortada sabit cam sehpa içerir.\n- Koltuk döşemeleri tek ortak renk state'iyle değişir; cam sehpa sabittir ve renk/görsel almaz.\n- Modül serbest yerleşir; 250 x 250 cm collision footprint kullanır ve 0/90/180/270 dönüşleri destekler.\n`;
  }
  write(path, s);
}
{
  const path = 'ROADMAP.md';
  let s = read(path);
  s = s.replace('1. Baza\n2. Raf\n3. Koltuk\n4. Masa Sandalye Takımı\n5. Bar Taburesi', '1. Baza ✅\n2. Raf ✅\n3. Koltuk Takımı ✅\n4. 55 inç TV\n5. 43 inç TV\n6. Masa Sandalye Takımı\n7. Bar Taburesi');
  write(path, s);
}

console.log('sofa-set patch applied');
