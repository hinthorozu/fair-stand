import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, content) { fs.writeFileSync(path, content); }
function replaceExact(source, from, to, label, expected = 1) {
  const count = source.split(from).length - 1;
  if (count !== expected) throw new Error(`${label}: expected ${expected}, found ${count}`);
  return source.split(from).join(to);
}
function insertBefore(source, anchor, block, label) {
  if (source.includes(block.trim())) return source;
  return replaceExact(source, anchor, block + anchor, label);
}

// catalog
{
  const path = 'src/catalog.js';
  let s = read(path);
  if (!s.includes('export const SHELF_DIMENSIONS')) {
    s = replaceExact(s,
`export const BASE_DIMENSIONS = Object.freeze({
  depthCm: 50,
  heightCm: 50,
  widthsCm: Object.freeze([100, 150, 200]),
});`,
`export const BASE_DIMENSIONS = Object.freeze({
  depthCm: 50,
  heightCm: 50,
  widthsCm: Object.freeze([100, 150, 200]),
});

export const SHELF_DIMENSIONS = Object.freeze({
  projectionCm: 30,
  thicknessCm: 3,
  widthsCm: Object.freeze([100, 150, 200]),
  heightsByCountCm: Object.freeze({
    2: Object.freeze([100, 150]),
    3: Object.freeze([100, 150, 200]),
  }),
});`,
'shelf dimensions');
  }
  if (!s.includes('SHELF_2_100:')) {
    s = replaceExact(s,
`  SHOWCASE_3_100: { type: 'showcase-3', widthCm: 100, label: '3 Gözlü Vitrin 100' },
  SHOWCASE_2_100: { type: 'showcase-2', widthCm: 100, label: '2 Gözlü Vitrin 100' },
  DOOR_100: { type: 'door', widthCm: 100, label: 'Depo Kapısı 100' },`,
`  SHOWCASE_3_100: { type: 'showcase-3', widthCm: 100, label: '3 Gözlü Vitrin 100' },
  SHOWCASE_2_100: { type: 'showcase-2', widthCm: 100, label: '2 Gözlü Vitrin 100' },
  SHELF_2_100: { type: 'shelf', widthCm: 100, shelfCount: 2, label: 'Raf 100 · 2 Raf' },
  SHELF_3_100: { type: 'shelf', widthCm: 100, shelfCount: 3, label: 'Raf 100 · 3 Raf' },
  SHELF_2_150: { type: 'shelf', widthCm: 150, shelfCount: 2, label: 'Raf 150 · 2 Raf' },
  SHELF_3_150: { type: 'shelf', widthCm: 150, shelfCount: 3, label: 'Raf 150 · 3 Raf' },
  SHELF_2_200: { type: 'shelf', widthCm: 200, shelfCount: 2, label: 'Raf 200 · 2 Raf' },
  SHELF_3_200: { type: 'shelf', widthCm: 200, shelfCount: 3, label: 'Raf 200 · 3 Raf' },
  DOOR_100: { type: 'door', widthCm: 100, label: 'Depo Kapısı 100' },`,
'shelf catalog entries');
  }
  write(path, s);
}

// design state
{
  const path = 'src/designState.js';
  let s = read(path);
  if (!s.includes('export function createShelfModuleState')) {
    const anchor = `export function createDoorModuleState(widthCm = 100) {`;
    const block = `export function createShelfModuleState(widthCm, shelfCount = 2) {\n  const width = Number(widthCm);\n  const count = Number(shelfCount);\n  if (![100, 150, 200].includes(width) || ![2, 3].includes(count)) return null;\n\n  return {\n    id: createId('module'),\n    type: 'shelf',\n    widthCm: width,\n    shelfCount: count,\n    strips: Array.from(\n      { length: STRIP_COUNT },\n      (_, stripIndex) => createEditablePanelState(stripIndex, DEFAULT_PANEL_COLOR),\n    ),\n  };\n}\n\n`;
    s = replaceExact(s, anchor, block + anchor, 'shelf state insertion');
  }
  write(path, s);
}

// main wiring
{
  const path = 'src/main.js';
  let s = read(path);
  if (!s.includes('createShelfModuleState,')) {
    s = replaceExact(s, `  createSeparatorModuleState,\n`, `  createSeparatorModuleState,\n  createShelfModuleState,\n`, 'shelf state import');
  }
  if (!s.includes("if (moduleType === 'shelf')")) {
    s = replaceExact(s,
`      if (moduleType === 'showcase-3' || moduleType === 'showcase-2') {
        const eyeCount = moduleType === 'showcase-3' ? 3 : 2;
        selectionInfo.textContent = \`Modül \${moduleIndex + 1} · \${eyeCount} Gözlü Vitrin \${widthCm} cm · alttan \${stripNumber}. panel · renk + görsel uygulanabilir.\`;
        return;
      }
`,
`      if (moduleType === 'showcase-3' || moduleType === 'showcase-2') {
        const eyeCount = moduleType === 'showcase-3' ? 3 : 2;
        selectionInfo.textContent = \`Modül \${moduleIndex + 1} · \${eyeCount} Gözlü Vitrin \${widthCm} cm · alttan \${stripNumber}. panel · renk + görsel uygulanabilir.\`;
        return;
      }

      if (moduleType === 'shelf') {
        const shelfCount = Number(surface.userData.shelfCount) || 2;
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Raf ' + widthCm + ' cm · ' + shelfCount + ' raflı · alttan ' + stripNumber + '. panel · renk + görsel uygulanabilir.';
        return;
      }
`,
'shelf selection info');
  }
  if (!s.includes("else if (module.type === 'shelf') state = createShelfModuleState")) {
    s = replaceExact(s,
`  else if (module.type === 'separator') state = createSeparatorModuleState(module.widthCm);
  else if (module.type === 'door') state = createDoorModuleState(module.widthCm);`,
`  else if (module.type === 'separator') state = createSeparatorModuleState(module.widthCm);
  else if (module.type === 'shelf') state = createShelfModuleState(module.widthCm, module.shelfCount);
  else if (module.type === 'door') state = createDoorModuleState(module.widthCm);`,
'shelf catalog state');
  }
  write(path, s);
}

// context menu / picker
{
  const path = 'src/moduleContextMenu.js';
  let s = read(path);
  if (!s.includes("  shelf: 'Raf',")) {
    s = replaceExact(s, `  base: 'Baza',\n`, `  base: 'Baza',\n  shelf: 'Raf',\n`, 'shelf context label');
  }
  if (!s.includes("  'SHELF_3_200',")) {
    s = replaceExact(s,
`  'SHOWCASE_3_100',
  'SHOWCASE_2_100',`,
`  'SHOWCASE_3_100',
  'SHOWCASE_2_100',
  'SHELF_3_200',
  'SHELF_2_200',
  'SHELF_3_150',
  'SHELF_2_150',
  'SHELF_3_100',
  'SHELF_2_100',`,
'shelf picker keys');
  }
  if (!s.includes('function createShelfPreview(module)')) {
    const anchor = `  function createDoorPreview(widthCm) {`;
    const block = `  function createShelfPreview(module) {\n    const preview = createPanelPreview(module.widthCm);\n    const panel = preview.querySelector('.module-card-flat-panel');\n    if (!panel) return preview;\n    panel.style.position = 'relative';\n    const positions = Number(module.shelfCount) === 3 ? [71.5, 57.2, 42.9] : [71.5, 57.2];\n    positions.forEach((topPercent) => {\n      const shelf = document.createElement('span');\n      shelf.style.position = 'absolute';\n      shelf.style.left = '-3px';\n      shelf.style.right = '-10px';\n      shelf.style.top = topPercent + '%';\n      shelf.style.height = '4px';\n      shelf.style.border = '1px solid #9aa0a6';\n      shelf.style.background = '#ffffff';\n      shelf.style.boxShadow = '2px 2px 2px rgba(15,23,42,.14)';\n      panel.appendChild(shelf);\n    });\n    return preview;\n  }\n\n`;
    s = replaceExact(s, anchor, block + anchor, 'shelf picker preview');
  }
  if (!s.includes("if (module.type === 'shelf') return createShelfPreview(module);")) {
    s = replaceExact(s,
`  function createModulePreview(module) {
    if (module.type === 'separator') return createSeparatorPreview(module.widthCm);`,
`  function createModulePreview(module) {
    if (module.type === 'shelf') return createShelfPreview(module);
    if (module.type === 'separator') return createSeparatorPreview(module.widthCm);`,
'shelf module preview routing');
  }
  write(path, s);
}

// drag sidebar
{
  const path = 'src/moduleDragSidebar.js';
  let s = read(path);
  if (!s.includes("  'SHELF_3_200',")) {
    s = replaceExact(s,
`  'SHOWCASE_3_100',
  'SHOWCASE_2_100',`,
`  'SHOWCASE_3_100',
  'SHOWCASE_2_100',
  'SHELF_3_200',
  'SHELF_2_200',
  'SHELF_3_150',
  'SHELF_2_150',
  'SHELF_3_100',
  'SHELF_2_100',`,
'shelf drag keys');
  }
  if (!s.includes('.module-drag-shelf {')) {
    s = replaceExact(s,
`    .module-drag-showcase[data-eyes='3']::after { content:''; position:absolute; left:4px; right:4px; top:42px; height:1px; background:#9fbfa5; }`,
`    .module-drag-showcase[data-eyes='3']::after { content:''; position:absolute; left:4px; right:4px; top:42px; height:1px; background:#9fbfa5; }
    .module-drag-shelf { position:relative; }
    .module-drag-shelf i { position:absolute; left:-3px; right:-9px; height:4px; border:1px solid #9aa0a6; background:#fff; box-shadow:2px 2px 2px rgba(15,23,42,.14); pointer-events:none; }`,
'shelf drag css');
  }
  if (!s.includes("if (module.type === 'shelf')")) {
    s = replaceExact(s,
`  if (module.type === 'base') {
    const body = document.createElement('div');`,
`  if (module.type === 'shelf') {
    const body = document.createElement('div');
    body.className = 'module-drag-panel module-drag-shelf';
    body.style.width = \`${previewWidthPx(module.widthCm)}px\`;
    for (let index = 0; index < 7; index += 1) body.appendChild(document.createElement('span'));
    const tops = Number(module.shelfCount) === 3 ? [47, 37, 27] : [47, 37];
    tops.forEach((top) => {
      const shelf = document.createElement('i');
      shelf.style.top = top + 'px';
      body.appendChild(shelf);
    });
    preview.appendChild(body);
    return preview;
  }

  if (module.type === 'base') {
    const body = document.createElement('div');`,
'shelf drag preview');
  }
  write(path, s);
}

// scene rendering
{
  const path = 'src/scene3d.js';
  let s = read(path);
  if (!s.includes("import { SHELF_DIMENSIONS, STAND_DIMENSIONS } from './catalog.js';")) {
    s = replaceExact(s,
`import { STAND_DIMENSIONS } from './catalog.js';`,
`import { SHELF_DIMENSIONS, STAND_DIMENSIONS } from './catalog.js';`,
'shelf dimensions import');
  }
  if (!s.includes("moduleState.type === 'shelf'")) {
    s = replaceExact(s,
`      } else if (moduleState.type === 'door') {
        module = createDoorModule(`,
`      } else if (moduleState.type === 'shelf') {
        module = createShelfModule(
          moduleState,
          moduleIndex,
          (surface) => applyStoredImage(surface),
        );
      } else if (moduleState.type === 'door') {
        module = createDoorModule(`,
'shelf build branch');
  }
  if (!s.includes("if (moduleState?.type === 'shelf') return 'Raf '")) {
    s = replaceExact(s,
`    if (moduleState?.type === 'base') return \`Baza \${widthCm}\`;`,
`    if (moduleState?.type === 'shelf') return 'Raf ' + widthCm + ' · ' + (Number(moduleState.shelfCount) || 2) + ' Raf';
    if (moduleState?.type === 'base') return \`Baza \${widthCm}\`;`,
'shelf drag label');
  }
  if (!s.includes("moduleState?.type === 'shelf'")) {
    throw new Error('shelf type insertion failed before badge styling');
  }
  if (!s.includes("preview.style.background = moduleState?.type === 'shelf'")) {
    s = replaceExact(s,
`      if (moduleState?.type === 'base') {
        preview.style.background = 'linear-gradient(to bottom,#ffffff 0 20%,#9aa0a6 20% 29%,#f8fafc 29% 86%,#9aa0a6 86% 100%)';`,
`      if (moduleState?.type === 'shelf') {
        preview.style.background = moduleState.shelfCount === 3
          ? 'linear-gradient(to bottom,#f7f7f5 0 40%,#ffffff 40% 45%,#c4c9ce 45% 46%,#f7f7f5 46% 55%,#ffffff 55% 60%,#c4c9ce 60% 61%,#f7f7f5 61% 70%,#ffffff 70% 75%,#c4c9ce 75% 76%,#f7f7f5 76% 100%)'
          : 'linear-gradient(to bottom,#f7f7f5 0 55%,#ffffff 55% 60%,#c4c9ce 60% 61%,#f7f7f5 61% 70%,#ffffff 70% 75%,#c4c9ce 75% 76%,#f7f7f5 76% 100%)';
      } else if (moduleState?.type === 'base') {
        preview.style.background = 'linear-gradient(to bottom,#ffffff 0 20%,#9aa0a6 20% 29%,#f8fafc 29% 86%,#9aa0a6 86% 100%)';`,
'shelf drag badge');
  }
  if (!s.includes('function createShelfModule(moduleState')) {
    const anchor = `function createFlatPanelModule(moduleState, moduleIndex, onSurfaceReady) {`;
    const block = `function createShelfModule(moduleState, moduleIndex, onSurfaceReady) {\n  const built = createFlatPanelModule(moduleState, moduleIndex, onSurfaceReady);\n  const widthM = Number(moduleState.widthCm) / 100;\n  const shelfCount = Number(moduleState.shelfCount) === 3 ? 3 : 2;\n  const shelfDepthM = Number(SHELF_DIMENSIONS.projectionCm) / 100;\n  const shelfThicknessM = Number(SHELF_DIMENSIONS.thicknessCm) / 100;\n  const wallDepthM = Number(STAND_DIMENSIONS.depth);\n  const innerWidthM = Math.max(widthM - PANEL_VERTICAL_PROFILE_WIDTH_M * 2 - 0.012, 0.02);\n  const shelfHeightsCm = SHELF_DIMENSIONS.heightsByCountCm[shelfCount] ?? [];\n\n  built.group.userData.type = 'shelf';\n  built.group.userData.shelfCount = shelfCount;\n  built.surfaces.forEach((surface) => {\n    surface.userData.moduleType = 'shelf';\n    surface.userData.shelfCount = shelfCount;\n  });\n\n  const shelfMaterial = new THREE.MeshStandardMaterial({\n    color: 0xffffff,\n    roughness: 0.72,\n    metalness: 0,\n  });\n  const frameMaterial = new THREE.MeshStandardMaterial({\n    color: FRAME_COLOR,\n    metalness: 0.68,\n    roughness: 0.28,\n  });\n\n  shelfHeightsCm.forEach((heightCm) => {\n    const seamHeightM = Number(heightCm) / 100;\n    const shelf = new THREE.Mesh(\n      new THREE.BoxGeometry(innerWidthM, shelfThicknessM, shelfDepthM),\n      shelfMaterial.clone(),\n    );\n    shelf.position.set(\n      0,\n      seamHeightM + shelfThicknessM / 2,\n      wallDepthM / 2 + shelfDepthM / 2,\n    );\n    shelf.castShadow = true;\n    shelf.receiveShadow = true;\n    built.group.add(shelf);\n\n    const frontProfile = new THREE.Mesh(\n      new THREE.BoxGeometry(innerWidthM, 0.025, 0.025),\n      frameMaterial.clone(),\n    );\n    frontProfile.position.set(\n      0,\n      seamHeightM + 0.0125,\n      wallDepthM / 2 + shelfDepthM - 0.0125,\n    );\n    frontProfile.castShadow = true;\n    built.group.add(frontProfile);\n  });\n\n  return built;\n}\n\n`;
    s = replaceExact(s, anchor, block + anchor, 'shelf renderer');
  }
  write(path, s);
}

// tests
{
  const path = 'test/shelfModule.test.js';
  if (!fs.existsSync(path)) {
    write(path, `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { MODULE_CATALOG, SHELF_DIMENSIONS } from '../src/catalog.js';\nimport { createShelfModuleState, duplicateModuleState } from '../src/designState.js';\nimport { snapPlacementToStand } from '../src/modulePlacement.js';\n\ntest('shelf catalog exposes 100 150 200 cm widths in 2 and 3 shelf variants', () => {\n  const variants = [\n    ['SHELF_2_100', 100, 2], ['SHELF_3_100', 100, 3],\n    ['SHELF_2_150', 150, 2], ['SHELF_3_150', 150, 3],\n    ['SHELF_2_200', 200, 2], ['SHELF_3_200', 200, 3],\n  ];\n  variants.forEach(([key, widthCm, shelfCount]) => {\n    assert.equal(MODULE_CATALOG[key].type, 'shelf');\n    assert.equal(MODULE_CATALOG[key].widthCm, widthCm);\n    assert.equal(MODULE_CATALOG[key].shelfCount, shelfCount);\n  });\n});\n\ntest('shelf heights sit on Maxima 50 cm panel seams', () => {\n  assert.deepEqual(SHELF_DIMENSIONS.heightsByCountCm[2], [100, 150]);\n  assert.deepEqual(SHELF_DIMENSIONS.heightsByCountCm[3], [100, 150, 200]);\n  assert.equal(SHELF_DIMENSIONS.projectionCm, 30);\n});\n\ntest('shelf state keeps seven editable wall panels and its shelf count', () => {\n  const shelf = createShelfModuleState(150, 3);\n  assert.equal(shelf.type, 'shelf');\n  assert.equal(shelf.widthCm, 150);\n  assert.equal(shelf.shelfCount, 3);\n  assert.equal(shelf.strips.length, 7);\n  assert.equal('depthCm' in shelf, false);\n  assert.equal(createShelfModuleState(50, 2), null);\n  assert.equal(createShelfModuleState(100, 4), null);\n});\n\ntest('duplicating a shelf preserves panel design with independent surface ids', () => {\n  const source = createShelfModuleState(200, 2);\n  source.strips[2].color = '#123456';\n  source.strips[4].imageAssetId = 'shelf-art';\n  const copy = duplicateModuleState(source);\n  assert.notEqual(copy.id, source.id);\n  assert.equal(copy.shelfCount, 2);\n  assert.equal(copy.strips[2].color, '#123456');\n  assert.equal(copy.strips[4].imageAssetId, 'shelf-art');\n  copy.strips.forEach((strip, index) => assert.notEqual(strip.id, source.strips[index].id));\n});\n\ntest('shelf module uses normal wall placement instead of floor-fixture depth rules', () => {\n  const result = snapPlacementToStand({\n    standType: 'back-wall',\n    widthCm: 200,\n    pointerXCm: 210,\n    pointerYCm: 10,\n    standXCm: 600,\n    standYCm: 400,\n  });\n  assert.equal(result.ok, true);\n  assert.equal(result.placement.wallId, 'back');\n  assert.equal(result.placement.rotationZDeg, 0);\n});\n`);
  }
}

// changelog
{
  const path = 'Changelog.md';
  let s = read(path);
  if (!s.includes('## Raf modülü')) {
    s += `\n\n## Raf modülü\n\n456. Raf modülleri vitrin benzeri hazır duvar modülü olarak eklendi: 100/150/200 cm genişliklerin her biri 2 raflı ve 3 raflı varyanta sahiptir.\n457. Raflar panel yüzeylerinin ortasına serbest yükseklikte konmak yerine Maxima 50 cm yatay panel birleşim hatlarına oturur; 2 raflı varyant 100/150 cm, 3 raflı varyant 100/150/200 cm yüksekliklerini kullanır.\n458. Raf tablası 30 cm öne çıkar, 3 cm kalınlığında sabit beyaz yüzeydir ve ön kenarında Maxima profil görünümü bulunur.\n459. Raf modülü alttaki yedi normal paneli korur; paneller renk/görsel/cam davranışlarını sürdürür ve raf tablaları sabit beyaz kalır.\n460. Raf modülü banko/baza gibi serbest zemin fixture değildir; düz panel/vitrin gibi normal duvar placement, sürekli zincir, 50 cm grid, 0/90/180/270 dönüş ve magnetic snap kurallarını kullanır.\n461. Raf 100/150/200 · 2/3 Raf kartları hem sürükle-bırak kataloğuna hem bağlamsal modül picker'a eklendi; state, duplicate ve placement regresyon testleri eklendi.\n`;
  }
  write(path, s);
}

// project rules
{
  const path = 'PROJECT_RULES.md';
  let s = read(path);
  if (!s.includes('## Raf modülü standardı')) {
    s += `\n\n## Raf modülü standardı\n\n- Raf modülü hazır duvar modülüdür; genişlikler 100 / 150 / 200 cm, varyantlar 2 raflı ve 3 raflıdır.\n- Raf tablaları panel birleşim çizgilerine bağlanır: 2 raflı = Z 100 / 150 cm; 3 raflı = Z 100 / 150 / 200 cm.\n- Raf tablası 30 cm öne çıkar, 3 cm kalınlığında sabit beyazdır ve ön kenarında Maxima profil görünümü bulunur.\n- Raf modülünün yedi paneli normal panel davranışını korur; renk, görsel ve cam özellikleri uygulanabilir. Raf tablaları panel yüzeyi değildir ve sabit beyaz kalır.\n- Raf modülü düz panel/vitrin gibi normal duvar yerleşim sistemini kullanır; banko/baza tipi serbest zemin fixture olarak ele alınmaz.\n`;
  }
  write(path, s);
}

// roadmap status
{
  const path = 'ROADMAP.md';
  let s = read(path);
  if (!s.includes('1. Baza — tamamlandı')) {
    s = replaceExact(s,
`1. Baza
2. Raf
3. Koltuk
4. Masa Sandalye Takımı
5. Bar Taburesi`,
`1. Baza — tamamlandı
2. Raf — tamamlandı
3. Koltuk
4. Masa Sandalye Takımı
5. Bar Taburesi`,
'shelf roadmap status');
  }
  write(path, s);
}

console.log('Shelf module patch applied.');
