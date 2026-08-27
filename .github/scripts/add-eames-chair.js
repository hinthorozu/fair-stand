const fs = require('fs');
const zlib = require('zlib');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.writeFileSync(file, content);
}

function replaceOnce(source, search, replacement, label) {
  const index = source.indexOf(search);
  if (index < 0) throw new Error(`Anchor not found: ${label}`);
  if (source.indexOf(search, index + search.length) >= 0) {
    throw new Error(`Anchor is not unique: ${label}`);
  }
  return source.slice(0, index) + replacement + source.slice(index + search.length);
}

const compressedPayload = fs.readFileSync('.github/eames-table-chair.mesh.bin.gz');
const chairPayload = zlib.gunzipSync(compressedPayload);
if (chairPayload.length !== 30726) {
  throw new Error(`Unexpected Eames payload size: ${chairPayload.length}`);
}
fs.mkdirSync('public/models', { recursive: true });
fs.writeFileSync('public/models/eames-table-chair.mesh.bin', chairPayload);
fs.writeFileSync(
  'public/models/EAMES_CHAIR_ATTRIBUTION.txt',
  [
    'Eames Chair DSW',
    'Author: faiyaz5yaz (https://sketchfab.com/faiyaz5yaz)',
    'Source: https://sketchfab.com/3d-models/eames-chair-dsw-8c5266e27d9b459a814e470c5de06059',
    'License: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)',
    'Geometry optimized for fair-stand web rendering.',
    '',
  ].join('\n'),
);

{
  const file = 'src/catalog.js';
  let source = read(file);
  source = replaceOnce(
    source,
    `export const furniture_bar_stool_classic_DIMENSIONS = Object.freeze({
  widthCm: 50,
  depthCm: 50,
  heightCm: 80,
});`,
    `export const furniture_table_chair_set_eames_DIMENSIONS = Object.freeze({
  widthCm: 150,
  depthCm: 150,
  heightCm: 82,
  chairCount: 4,
  chairWidthCm: 46,
  chairDepthCm: 58,
  tableDiameterCm: 75,
  tableHeightCm: 74,
});

export const furniture_bar_stool_classic_DIMENSIONS = Object.freeze({
  widthCm: 50,
  depthCm: 50,
  heightCm: 80,
});`,
    'catalog dimensions',
  );
  source = replaceOnce(
    source,
    `  furniture_table_chair_set_minyon: { type: 'table-chair-set', widthCm: 120, depthCm: 120, heightCm: 90, label: 'Masa Sandalye Takımı' },
  furniture_bar_stool_classic: { type: 'bar-stool', widthCm: 50, depthCm: 50, heightCm: 80, label: 'Bar Taburesi' },`,
    `  furniture_table_chair_set_minyon: { type: 'table-chair-set', widthCm: 120, depthCm: 120, heightCm: 90, label: 'Masa Sandalye Takımı' },
  furniture_table_chair_set_eames: { type: 'table-chair-set-eames', widthCm: 150, depthCm: 150, heightCm: 82, label: 'Eames Masa Sandalye Takımı' },
  furniture_bar_stool_classic: { type: 'bar-stool', widthCm: 50, depthCm: 50, heightCm: 80, label: 'Bar Taburesi' },`,
    'catalog entry',
  );
  source = replaceOnce(
    source,
    `  'furniture_table_chair_set_minyon',
  'furniture_bar_stool_classic',`,
    `  'furniture_table_chair_set_minyon',
  'furniture_table_chair_set_eames',
  'furniture_bar_stool_classic',`,
    'catalog order',
  );
  write(file, source);
}

{
  const file = 'src/designState.js';
  let source = read(file);
  source = replaceOnce(
    source,
    `export function createBarStoolModuleState() {`,
    `export function createEamesTableChairSetModuleState() {
  return {
    id: createId('module'),
    type: 'table-chair-set-eames',
    widthCm: 150,
    depthCm: 150,
    heightCm: 82,
    chairCount: 4,
    surface: {
      id: createId('surface'),
      color: DEFAULT_PANEL_COLOR,
    },
  };
}

export function createBarStoolModuleState() {`,
    'Eames table chair state',
  );
  write(file, source);
}

{
  const file = 'src/main.js';
  let source = read(file);
  source = replaceOnce(
    source,
    `  createDoorModuleState,
  createFlatPanelModuleState,`,
    `  createDoorModuleState,
  createEamesTableChairSetModuleState,
  createFlatPanelModuleState,`,
    'main state import',
  );
  source = replaceOnce(
    source,
    `      if (moduleType === 'sofa-set') {
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Koltuk Takımı · koltuk döşeme rengi değiştirilebilir · cam sehpa sabittir.';
        return;
      }

      if (moduleType === 'led-floodlight') {`,
    `      if (moduleType === 'sofa-set') {
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Koltuk Takımı · koltuk döşeme rengi değiştirilebilir · cam sehpa sabittir.';
        return;
      }

      if (moduleType === 'table-chair-set-eames') {
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Eames Masa Sandalye Takımı · 4 Eames sandalye · sandalye gövde rengi değiştirilebilir · cam masa sabittir.';
        return;
      }

      if (moduleType === 'led-floodlight') {`,
    'main selection label',
  );
  source = replaceOnce(
    source,
    `  else if (module.type === 'table-chair-set') state = createTableChairSetModuleState();
  else if (module.type === 'bar-stool') state = createBarStoolModuleState();`,
    `  else if (module.type === 'table-chair-set') state = createTableChairSetModuleState();
  else if (module.type === 'table-chair-set-eames') state = createEamesTableChairSetModuleState();
  else if (module.type === 'bar-stool') state = createBarStoolModuleState();`,
    'main catalog state dispatcher',
  );
  write(file, source);
}

{
  const file = 'src/scene3d.js';
  let source = read(file);
  source = replaceOnce(
    source,
    `const STAGE_HOME_DIRECTION = new THREE.Vector3(1, 1.05, 1).normalize();

function isFloorFixtureType(type) {
  return type === 'counter' || type === 'base' || type === 'sofa-set' || type === 'table-chair-set' || type === 'bar-stool';
}`,
    `const STAGE_HOME_DIRECTION = new THREE.Vector3(1, 1.05, 1).normalize();

const EAMES_CHAIR_POSITION_SCALE = 1000;
const EAMES_CHAIR_MODEL_SCALE = 0.715;
const EAMES_CHAIR_MESH_META = Object.freeze([{"name":"Object_4","role":"shell","vertexCount":547,"faceCount":1094,"indexCount":3282,"positionOffset":0,"indexOffset":3282},{"name":"Object_3","role":"support","vertexCount":286,"faceCount":586,"indexCount":1758,"positionOffset":9846,"indexOffset":11562},{"name":"Object_2","role":"support","vertexCount":112,"faceCount":134,"indexCount":402,"positionOffset":15078,"indexOffset":15750},{"name":"Object_1","role":"support","vertexCount":138,"faceCount":206,"indexCount":618,"positionOffset":16554,"indexOffset":17382},{"name":"Object_0","role":"base","vertexCount":680,"faceCount":1338,"indexCount":4014,"positionOffset":18618,"indexOffset":22698}].map((entry) => Object.freeze(entry)));
let eamesChairPayloadPromise = null;

function loadEamesChairPayload() {
  if (!eamesChairPayloadPromise) {
    eamesChairPayloadPromise = fetch(
      import.meta.env.BASE_URL + 'models/eames-table-chair.mesh.bin',
    ).then((response) => {
      if (!response.ok) {
        throw new Error('Eames sandalye modeli yüklenemedi (' + response.status + ')');
      }
      return response.arrayBuffer();
    });
  }
  return eamesChairPayloadPromise;
}

function isFloorFixtureType(type) {
  return type === 'counter'
    || type === 'base'
    || type === 'sofa-set'
    || type === 'table-chair-set'
    || type === 'table-chair-set-eames'
    || type === 'bar-stool';
}`,
    'scene Eames loader',
  );

  source = replaceOnce(
    source,
    `    if (moduleState?.type === 'table-chair-set') return 'Masa Sandalye Takımı';
    if (moduleState?.type === 'bar-stool') return 'Bar Taburesi';`,
    `    if (moduleState?.type === 'table-chair-set') return 'Masa Sandalye Takımı';
    if (moduleState?.type === 'table-chair-set-eames') return 'Eames Masa Sandalye Takımı';
    if (moduleState?.type === 'bar-stool') return 'Bar Taburesi';`,
    'scene drag label',
  );

  source = replaceOnce(
    source,
    `      } else if (moduleState.type === 'table-chair-set') {
        module = createTableChairSetModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'bar-stool') {`,
    `      } else if (moduleState.type === 'table-chair-set') {
        module = createTableChairSetModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'table-chair-set-eames') {
        module = createEamesTableChairSetModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'bar-stool') {`,
    'scene renderer dispatcher',
  );

  const eamesFunction = `
function createEamesTableChairSetModule(moduleState, moduleIndex) {
  const widthCm = Number(moduleState.widthCm || 150);
  const depthCm = Number(moduleState.depthCm || 150);
  const heightCm = Number(moduleState.heightCm || 82);
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: 'table-chair-set-eames',
    widthCm,
    depthCm,
    heightCm,
  };

  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0x30343a,
    roughness: 0.32,
    metalness: 0.74,
  });
  const tabletopMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd7e9ed,
    transparent: true,
    opacity: 0.42,
    roughness: 0.10,
    metalness: 0,
    transmission: 0.32,
    clearcoat: 0.65,
    clearcoatRoughness: 0.08,
    depthWrite: false,
  });

  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(0.375, 0.375, 0.018, 64),
    tabletopMaterial,
  );
  top.position.set(0, 0.74, 0);
  top.receiveShadow = true;
  group.add(top);

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.045, 0.70, 20),
    metalMaterial.clone(),
  );
  stem.position.set(0, 0.37, 0);
  stem.castShadow = true;
  group.add(stem);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.24, 0.035, 32),
    metalMaterial.clone(),
  );
  base.position.set(0, 0.018, 0);
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const colorTargets = [];
  const surfaces = [];
  const chairPlacements = [
    [-0.39, -0.39, Math.PI / 4],
    [0.39, -0.39, -Math.PI / 4],
    [-0.39, 0.39, Math.PI * 3 / 4],
    [0.39, 0.39, -Math.PI * 3 / 4],
  ];

  chairPlacements.forEach(([x, z, rotationY], index) => {
    const proxy = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.82, 0.60),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        colorWrite: false,
      }),
    );
    proxy.position.set(x, 0.41, z);
    proxy.rotation.y = rotationY;
    group.add(proxy);

    const selectionFrame = index === 0 ? createSelectionFrame(0.48, 0.82) : null;
    if (selectionFrame) {
      selectionFrame.visible = false;
      proxy.add(selectionFrame);
    }

    proxy.userData = {
      kind: 'surface',
      moduleType: 'table-chair-set-eames',
      selectionMode: 'module',
      acceptsImage: false,
      moduleIndex,
      moduleId: moduleState.id,
      widthCm,
      stripIndex: null,
      stripNumber: null,
      surfaceRole: 'chair',
      surfaceId: index === 0 ? moduleState.surface?.id : moduleState.surface?.id + '-' + index,
      surfaceState: moduleState.surface,
      selectionFrame,
      colorTargets,
    };
    surfaces.push(proxy);
  });

  loadEamesChairPayload().then((buffer) => {
    if (!group.parent) return;

    const geometries = EAMES_CHAIR_MESH_META.map((meta) => {
      const quantized = new Int16Array(buffer, meta.positionOffset, meta.vertexCount * 3);
      const positions = new Float32Array(quantized.length);
      for (let index = 0; index < quantized.length; index += 1) {
        positions[index] = quantized[index] / EAMES_CHAIR_POSITION_SCALE;
      }

      const sourceIndices = new Uint16Array(buffer, meta.indexOffset, meta.indexCount);
      const indices = new Uint16Array(sourceIndices);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
      return { meta, geometry };
    });

    const shellMaterial = new THREE.MeshStandardMaterial({
      color: moduleState.surface?.color ?? '#ffffff',
      roughness: 0.46,
      metalness: 0,
    });
    const woodMaterial = new THREE.MeshStandardMaterial({
      color: 0x9b6635,
      roughness: 0.58,
      metalness: 0,
    });
    const supportMaterial = new THREE.MeshStandardMaterial({
      color: 0x25282d,
      roughness: 0.34,
      metalness: 0.58,
    });

    chairPlacements.forEach(([x, z, rotationY]) => {
      const chair = new THREE.Group();
      chair.position.set(x, 0, z);
      chair.rotation.y = rotationY;
      chair.scale.setScalar(EAMES_CHAIR_MODEL_SCALE);

      geometries.forEach(({ meta, geometry }) => {
        const material = meta.role === 'shell'
          ? shellMaterial
          : (meta.role === 'base' ? woodMaterial : supportMaterial);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        chair.add(mesh);
        if (meta.role === 'shell') colorTargets.push(mesh);
      });
      group.add(chair);
    });
  }).catch((error) => {
    console.warn('Eames masa sandalye modeli yüklenemedi:', error);
  });

  return { group, surfaces };
}

`;

  source = replaceOnce(
    source,
    `function createTableChairSetModule(moduleState, moduleIndex) {`,
    eamesFunction + `function createTableChairSetModule(moduleState, moduleIndex) {`,
    'scene Eames table chair renderer',
  );
  write(file, source);
}

{
  const file = 'src/moduleDragSidebar.js';
  let source = read(file);
  source = replaceOnce(
    source,
    `  if (module.type === 'table-chair-set') {`,
    `  if (module.type === 'table-chair-set' || module.type === 'table-chair-set-eames') {`,
    'Eames catalog preview branch',
  );
  write(file, source);
}

fs.writeFileSync('test/eamesTableChairSetContract.test.js', `import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import {
  createEamesTableChairSetModuleState,
  createTableChairSetModuleState,
} from '../src/designState.js';

test('Eames table chair set is a separate catalog module after the original set', () => {
  const original = MODULE_CATALOG.furniture_table_chair_set_minyon;
  const eames = MODULE_CATALOG.furniture_table_chair_set_eames;
  assert.equal(original.type, 'table-chair-set');
  assert.equal(eames.type, 'table-chair-set-eames');
  assert.equal(eames.widthCm, 150);
  assert.equal(eames.depthCm, 150);
  assert.ok(
    MODULE_CATALOG_KEYS.indexOf('furniture_table_chair_set_eames')
      === MODULE_CATALOG_KEYS.indexOf('furniture_table_chair_set_minyon') + 1,
  );
});

test('Eames set contains four chairs without changing the original state factory', () => {
  const original = createTableChairSetModuleState();
  const eames = createEamesTableChairSetModuleState();
  assert.equal(original.type, 'table-chair-set');
  assert.equal(eames.type, 'table-chair-set-eames');
  assert.equal(eames.chairCount, 4);
  assert.equal(eames.widthCm, 150);
  assert.equal(eames.depthCm, 150);
});

test('Eames renderer uses the optimized external mesh once for four chairs', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /function createEamesTableChairSetModule/);
  assert.match(source, /models\/eames-table-chair\.mesh\.bin/);
  assert.match(source, /chairPlacements\.forEach/);
  assert.match(source, /EAMES_CHAIR_MODEL_SCALE/);
});

test('optimized Eames payload and attribution are present', () => {
  const payload = fs.statSync(new URL('../public/models/eames-table-chair.mesh.bin', import.meta.url));
  assert.equal(payload.size, 30726);
  const attribution = fs.readFileSync(
    new URL('../public/models/EAMES_CHAIR_ATTRIBUTION.txt', import.meta.url),
    'utf8',
  );
  assert.match(attribution, /faiyaz5yaz/);
  assert.match(attribution, /CC BY 4\.0/);
});
`);

console.log('Eames 4-chair table set patch applied.');
