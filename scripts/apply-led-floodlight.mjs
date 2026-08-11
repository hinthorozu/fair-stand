import fs from 'node:fs';

function update(path, transform) {
  const before = fs.readFileSync(path, 'utf8');
  const after = transform(before);
  if (after === before) throw new Error(`No change produced for ${path}`);
  fs.writeFileSync(path, after);
}

function replaceOnce(text, search, replacement, label) {
  if (!text.includes(search)) throw new Error(`Missing target: ${label}`);
  return text.replace(search, replacement);
}

update('src/catalog.js', (text) => {
  text = replaceOnce(text,
`export const BAR_STOOL_DIMENSIONS = Object.freeze({
  widthCm: 50,
  depthCm: 50,
  heightCm: 80,
});
`,
`export const BAR_STOOL_DIMENSIONS = Object.freeze({
  widthCm: 50,
  depthCm: 50,
  heightCm: 80,
});

export const LED_FLOODLIGHT_DIMENSIONS = Object.freeze({
  widthCm: 50,
  depthCm: 20,
  heightCm: 35,
  mountHeightCm: 350,
});
`, 'catalog dimensions');

  text = replaceOnce(text,
`  BAR_STOOL: { type: 'bar-stool', widthCm: 50, depthCm: 50, heightCm: 80, label: 'Bar Taburesi' },
`,
`  BAR_STOOL: { type: 'bar-stool', widthCm: 50, depthCm: 50, heightCm: 80, label: 'Bar Taburesi' },
  LED_FLOODLIGHT: { type: 'led-floodlight', widthCm: 50, depthCm: 20, heightCm: 35, label: 'LED Projektör' },
`, 'catalog item');
  return text;
});

update('src/designState.js', (text) => {
  text = replaceOnce(text,
`export function createBarStoolModuleState() {
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
}
`,
`export function createBarStoolModuleState() {
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
}

export function createLedFloodlightModuleState() {
  return {
    id: createId('module'),
    type: 'led-floodlight',
    widthCm: 50,
    depthCm: 20,
    heightCm: 35,
    surface: {
      id: createId('surface'),
      color: '#17191c',
    },
  };
}
`, 'design state factory');

  text = replaceOnce(text,
`export function totalWallWidthCm(modules) {
  return modules.reduce((sum, module) => sum + module.widthCm, 0);
}

export function moduleWidths(modules) {
  return modules.map((module) => module.widthCm);
}
`,
`export function totalWallWidthCm(modules) {
  return modules.reduce(
    (sum, module) => sum + (module?.type === 'led-floodlight' ? 0 : Number(module?.widthCm) || 0),
    0,
  );
}

export function moduleWidths(modules) {
  return modules
    .filter((module) => module?.type !== 'led-floodlight')
    .map((module) => module.widthCm);
}
`, 'wall summary exclusion');
  return text;
});

update('src/modulePlacement.js', (text) => {
  text = replaceOnce(text,
`function usesLogicalFixtureEndpoint(moduleType) {
  return moduleType === 'counter' || moduleType === 'base';
}
`,
`function usesLogicalFixtureEndpoint(moduleType) {
  return moduleType === 'counter' || moduleType === 'base';
}

function isTopFixtureType(moduleType) {
  return moduleType === 'led-floodlight';
}
`, 'top fixture helper');

  text = replaceOnce(text,
`export function getWallUsedCm(modules = [], wallId = 'back') {
  return modules.reduce((sum, module) => (
    module?.placement?.wallId === wallId ? sum + (Number(module.widthCm) || 0) : sum
  ), 0);
}
`,
`export function getWallUsedCm(modules = [], wallId = 'back') {
  return modules.reduce((sum, module) => (
    module?.placement?.wallId === wallId && !isTopFixtureType(module?.type)
      ? sum + (Number(module.widthCm) || 0)
      : sum
  ), 0);
}
`, 'wall used exclusion');

  text = replaceOnce(text,
`export function getWallExtentCm(modules = [], wallId = 'back') {
  return modules.reduce((max, module) => {
    if (module?.placement?.wallId !== wallId) return max;
`,
`export function getWallExtentCm(modules = [], wallId = 'back') {
  return modules.reduce((max, module) => {
    if (module?.placement?.wallId !== wallId || isTopFixtureType(module?.type)) return max;
`, 'wall extent exclusion');

  text = replaceOnce(text,
`export function placementsOverlap(moduleA, moduleB) {
  const a = getGroundSegment(moduleA);
`,
`export function placementsOverlap(moduleA, moduleB) {
  if (isTopFixtureType(moduleA?.type) || isTopFixtureType(moduleB?.type)) return false;
  const a = getGroundSegment(moduleA);
`, 'collision exclusion');
  return text;
});

update('src/main.js', (text) => {
  text = replaceOnce(text,
`  createBarStoolModuleState,
  createBaseModuleState,
`,
`  createBarStoolModuleState,
  createLedFloodlightModuleState,
  createBaseModuleState,
`, 'main import');

  text = replaceOnce(text,
`      if (moduleType === 'sofa-set') {
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Koltuk Takımı · koltuk döşeme rengi değiştirilebilir · cam sehpa sabittir.';
        return;
      }
`,
`      if (moduleType === 'sofa-set') {
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Koltuk Takımı · koltuk döşeme rengi değiştirilebilir · cam sehpa sabittir.';
        return;
      }

      if (moduleType === 'led-floodlight') {
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · LED Projektör · 350 cm üst profile bağlı aydınlatma.';
        return;
      }
`, 'selection label');

  text = replaceOnce(text,
`  else if (module.type === 'bar-stool') state = createBarStoolModuleState();
`,
`  else if (module.type === 'bar-stool') state = createBarStoolModuleState();
  else if (module.type === 'led-floodlight') state = createLedFloodlightModuleState();
`, 'catalog factory');
  return text;
});

update('src/moduleDragSidebar.js', (text) => {
  text = replaceOnce(text,
`  'BAR_STOOL',
  'BASE_200',
`,
`  'BAR_STOOL',
  'LED_FLOODLIGHT',
  'BASE_200',
`, 'sidebar key');

  text = replaceOnce(text,
`    .module-drag-bar-stool::after { content:''; position:absolute; left:11px; top:24px; width:22px; height:27px; border-left:3px solid #7b838c; border-right:3px solid #7b838c; border-bottom:3px solid #7b838c; border-radius:0 0 10px 10px; }
`,
`    .module-drag-bar-stool::after { content:''; position:absolute; left:11px; top:24px; width:22px; height:27px; border-left:3px solid #7b838c; border-right:3px solid #7b838c; border-bottom:3px solid #7b838c; border-radius:0 0 10px 10px; }
    .module-drag-floodlight { position:relative; width:52px; height:52px; }
    .module-drag-floodlight::before { content:''; position:absolute; left:10px; top:7px; width:32px; height:22px; border:4px solid #17191c; border-radius:3px; background:#f5fff2; box-shadow:inset 0 0 0 2px #c7ead0; transform:rotate(-8deg); }
    .module-drag-floodlight::after { content:''; position:absolute; left:23px; top:29px; width:6px; height:16px; border-left:3px solid #292c31; border-bottom:3px solid #292c31; }
`, 'sidebar floodlight css');

  text = replaceOnce(text,
`  if (module.type === 'bar-stool') {
    const body = document.createElement('div');
    body.className = 'module-drag-bar-stool';
    preview.appendChild(body);
    return preview;
  }
`,
`  if (module.type === 'bar-stool') {
    const body = document.createElement('div');
    body.className = 'module-drag-bar-stool';
    preview.appendChild(body);
    return preview;
  }

  if (module.type === 'led-floodlight') {
    const body = document.createElement('div');
    body.className = 'module-drag-floodlight';
    preview.appendChild(body);
    return preview;
  }
`, 'sidebar preview');
  return text;
});

update('src/scene3d.js', (text) => {
  text = replaceOnce(text,
`function isFloorFixtureType(type) {
  return type === 'counter' || type === 'base' || type === 'sofa-set' || type === 'table-chair-set' || type === 'bar-stool';
}
`,
`function isFloorFixtureType(type) {
  return type === 'counter' || type === 'base' || type === 'sofa-set' || type === 'table-chair-set' || type === 'bar-stool';
}

function isTopFixtureType(type) {
  return type === 'led-floodlight';
}
`, 'scene top fixture helper');

  text = replaceOnce(text,
`      } else if (moduleState.type === 'bar-stool') {
        module = createBarStoolModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'shelf') {
`,
`      } else if (moduleState.type === 'bar-stool') {
        module = createBarStoolModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'led-floodlight') {
        module = createLedFloodlightModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'shelf') {
`, 'scene build switch');

  text = replaceOnce(text,
`    const renderedModules = getRenderedModuleStates();
    const magneticSnap = snapPlacementToModules({
`,
`    if (isTopFixtureType(moduleState.type)) {
      const placement = {
        ...snapped.placement,
        zCm: Math.round(STAND_DIMENSIONS.height * 100),
      };
      showPlacementGhost(moduleState, placement, true);
      clearPlacementFeedback();
      return {
        ok: true,
        placement: { ...placement },
        message: null,
        plan: {
          ok: true,
          movingPlacement: { ...placement },
          placements: new Map([[moduleState.id, { ...placement }]]),
        },
        snap: { mode: 'top-wall' },
      };
    }

    const renderedModules = getRenderedModuleStates();
    const magneticSnap = snapPlacementToModules({
`, 'catalog top fixture preview');

  const updateNeedle = `    const renderedModules = getRenderedModuleStates();\n    const magneticSnap = snapPlacementToModules({\n      moduleId: moduleState.id,\n      moduleType: moduleState.type,\n      widthCm: moduleState.widthCm,\n      depthCm: moduleState.depthCm,\n      forceFree: isFloorFixtureType(moduleState.type),\n      pointerXCm: ground.xCm,\n      pointerYCm: ground.yCm,\n      rotationZDeg: dragSession.preferredRotationZDeg,`;
  if (!text.includes(updateNeedle)) throw new Error('Missing target: existing drag top fixture preview');
  text = text.replace(updateNeedle,
`    if (isTopFixtureType(moduleState.type)) {
      const placement = {
        ...snapped.placement,
        zCm: Math.round(STAND_DIMENSIONS.height * 100),
      };
      dragSession.preview = {
        placement,
        valid: true,
        message: null,
        plan: {
          ok: true,
          movingPlacement: { ...placement },
          placements: new Map([[moduleState.id, { ...placement }]]),
        },
        snap: { mode: 'top-wall' },
      };
      showPlacementGhost(moduleState, placement, true);
      clearPlacementFeedback();
      return;
    }

    const renderedModules = getRenderedModuleStates();
    const magneticSnap = snapPlacementToModules({
      moduleId: moduleState.id,
      moduleType: moduleState.type,
      widthCm: moduleState.widthCm,
      depthCm: moduleState.depthCm,
      forceFree: isFloorFixtureType(moduleState.type),
      pointerXCm: ground.xCm,
      pointerYCm: ground.yCm,
      rotationZDeg: dragSession.preferredRotationZDeg,`);

  text = replaceOnce(text,
`function createBarStoolModule(moduleState, moduleIndex) {
`,
`function createLedFloodlightModule(moduleState, moduleIndex) {
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: 'led-floodlight',
    widthCm: 50,
    depthCm: 20,
    heightCm: 35,
  };

  const blackMaterial = new THREE.MeshStandardMaterial({
    color: 0x17191c,
    roughness: 0.38,
    metalness: 0.58,
  });
  const lensMaterial = new THREE.MeshStandardMaterial({
    color: 0xf6fff2,
    emissive: 0xeaffdf,
    emissiveIntensity: 1.8,
    roughness: 0.18,
    metalness: 0,
    side: THREE.DoubleSide,
  });

  const mount = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.055, 0.08), blackMaterial.clone());
  mount.position.set(0, 0.0275, 0.015);
  mount.castShadow = true;
  group.add(mount);

  const stem = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.17, 0.055), blackMaterial.clone());
  stem.position.set(0, 0.125, 0.055);
  stem.rotation.x = -0.12;
  stem.castShadow = true;
  group.add(stem);

  const head = new THREE.Group();
  head.position.set(0, 0.255, 0.135);
  head.rotation.x = -0.40;
  group.add(head);

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.23, 0.055), blackMaterial.clone());
  body.castShadow = true;
  body.receiveShadow = true;
  head.add(body);

  const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.285, 0.175), lensMaterial);
  lens.position.z = 0.029;
  head.add(lens);

  const spot = new THREE.SpotLight(0xf5ffe8, 38, 5.2, 0.52, 0.55, 1.45);
  spot.position.set(0, 0.24, 0.17);
  spot.castShadow = false;
  spot.target.position.set(0, -1.55, 1.35);
  group.add(spot, spot.target);

  const selectionFrame = createSelectionFrame(0.34, 0.23);
  selectionFrame.visible = false;
  lens.add(selectionFrame);
  lens.userData = {
    kind: 'surface',
    moduleType: 'led-floodlight',
    selectionMode: 'module',
    acceptsImage: false,
    moduleIndex,
    moduleId: moduleState.id,
    widthCm: 50,
    stripIndex: null,
    stripNumber: null,
    surfaceRole: 'light',
    surfaceId: moduleState.surface?.id,
    surfaceState: moduleState.surface,
    selectionFrame,
    colorTargets: [],
  };

  return { group, surfaces: [lens] };
}

function createBarStoolModule(moduleState, moduleIndex) {
`, 'floodlight renderer');

  text = replaceOnce(text,
`    if (moduleState?.type === 'bar-stool') return 'Bar Taburesi';
`,
`    if (moduleState?.type === 'bar-stool') return 'Bar Taburesi';
    if (moduleState?.type === 'led-floodlight') return 'LED Projektör';
`, 'drag label');

  return text;
});

const testContent = `import test from 'node:test';
import assert from 'node:assert/strict';
import { LED_FLOODLIGHT_DIMENSIONS, MODULE_CATALOG } from '../src/catalog.js';
import { createLedFloodlightModuleState, totalWallWidthCm } from '../src/designState.js';
import { getWallUsedCm, placementsOverlap } from '../src/modulePlacement.js';

test('LED projektor katalogda 50 cm ust aksesuar olarak tanimlidir', () => {
  assert.equal(MODULE_CATALOG.LED_FLOODLIGHT.type, 'led-floodlight');
  assert.equal(LED_FLOODLIGHT_DIMENSIONS.widthCm, 50);
  assert.equal(LED_FLOODLIGHT_DIMENSIONS.mountHeightCm, 350);
});

test('LED projektor state sabit siyah govde ve ust aksesuar olculerini tasir', () => {
  const light = createLedFloodlightModuleState();
  assert.equal(light.type, 'led-floodlight');
  assert.equal(light.widthCm, 50);
  assert.equal(light.depthCm, 20);
  assert.equal(light.heightCm, 35);
  assert.equal(light.surface.color, '#17191c');
});

test('LED projektor duvar kapasitesini ve fiziksel collision hesabini etkilemez', () => {
  const wall = { id: 'wall', type: 'flat-panel', widthCm: 100, placement: { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' } };
  const light = createLedFloodlightModuleState();
  light.placement = { xCm: 0, yCm: 0, zCm: 350, rotationZDeg: 0, wallId: 'back' };
  assert.equal(getWallUsedCm([wall, light], 'back'), 100);
  assert.equal(totalWallWidthCm([wall, light]), 100);
  assert.equal(placementsOverlap(wall, light), false);
});
`;
fs.writeFileSync('test/ledFloodlightModule.test.js', testContent);

update('ROADMAP.md', (text) => {
  const marker = '- [ ] 3. En üste lamba eklenmesi';
  if (!text.includes(marker)) return text;
  return text.replace(marker, `${marker}\n  - LED projektör tipi: siyah ince floodlight gövde + üst profil braketi + panel yüzüne gerçek SpotLight aydınlatması.\n  - Üst aksesuar duvar kapasitesini ve zemin collision hesabını tüketmez; 350 cm üst kotta izin verilen duvar kenarlarına 50 cm snap ile yerleşir.`);
});

update('Changelog.md', (text) => text + `\n\n## 11 Ağustos 2026 — LED projektör ilk sürüm\n\n- LED Projektör katalog modülü eklendi; siyah ince floodlight gövde, braket ve emissive lens geometrisi oluşturuldu.\n- Projektör 350 cm duvar üst kotuna bağlanan üst aksesuar olarak tanımlandı; duvar kapasitesini ve normal modül collision hesabını tüketmez.\n- Sırt/L/U standların izin verilen duvar üst kenarlarına 50 cm snap ile sürüklenebilir ve taşınabilir hale getirildi.\n- Her projektöre panel yüzüne doğru gerçek Three.js SpotLight ışığı eklendi.\n`);

fs.rmSync('scripts/apply-led-floodlight.mjs');
fs.rmSync('.github/workflows/apply-led-floodlight.yml');
