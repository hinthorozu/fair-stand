const fs = require('node:fs');
const path = require('node:path');

const scenePath = 'src/scene3d.js';
let source = fs.readFileSync(scenePath, 'utf8');

if (!source.includes("import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';")) {
  source = source.replace(
    "import { OrbitControls } from 'three/addons/controls/OrbitControls.js';\n",
    "import { OrbitControls } from 'three/addons/controls/OrbitControls.js';\nimport { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';\n",
  );
}

const oldLoaderStart = source.indexOf('const EAMES_CHAIR_POSITION_SCALE = 1000;');
const oldLoaderEndMarker = '\n\nfunction isFloorFixtureType(type) {';
const oldLoaderEnd = source.indexOf(oldLoaderEndMarker, oldLoaderStart);
if (oldLoaderStart < 0 || oldLoaderEnd < 0) throw new Error('old Eames loader block not found');

const newLoader = `const EAMES_CHAIR_TARGET_HEIGHT_M = 0.82;\nlet eamesChairModelPromise = null;\n\nfunction loadEamesChairModel() {\n  if (!eamesChairModelPromise) {\n    const loader = new GLTFLoader();\n    eamesChairModelPromise = loader\n      .loadAsync(import.meta.env.BASE_URL + 'models/eames_chair.glb')\n      .then((gltf) => gltf.scene);\n  }\n  return eamesChairModelPromise;\n}\n`;
source = source.slice(0, oldLoaderStart) + newLoader + source.slice(oldLoaderEnd);

const fnStart = source.indexOf('function createEamesTableChairSetModule(moduleState, moduleIndex) {');
const fnEndMarker = '\nfunction createTableChairSetModule(moduleState, moduleIndex) {';
const fnEnd = source.indexOf(fnEndMarker, fnStart);
if (fnStart < 0 || fnEnd < 0) throw new Error('Eames renderer function not found');

const newFn = String.raw`function createEamesTableChairSetModule(moduleState, moduleIndex) {
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

  const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x30343a, roughness: 0.32, metalness: 0.74 });
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

  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.375, 0.375, 0.018, 64), tabletopMaterial);
  top.position.set(0, 0.74, 0);
  top.receiveShadow = true;
  group.add(top);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.70, 20), metalMaterial.clone());
  stem.position.set(0, 0.37, 0);
  stem.castShadow = true;
  group.add(stem);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.035, 32), metalMaterial.clone());
  base.position.set(0, 0.018, 0);
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const colorTargets = [];
  const surfaces = [];
  const chairPlacements = [
    [-0.43, -0.43, Math.PI / 4],
    [0.43, -0.43, -Math.PI / 4],
    [-0.43, 0.43, Math.PI * 3 / 4],
    [0.43, 0.43, -Math.PI * 3 / 4],
  ];

  chairPlacements.forEach(([x, z, rotationY], index) => {
    const proxy = new THREE.Mesh(
      new THREE.BoxGeometry(0.50, 0.82, 0.56),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
    );
    proxy.position.set(x, 0.41, z);
    proxy.rotation.y = rotationY;
    group.add(proxy);

    const selectionFrame = index === 0 ? createSelectionFrame(0.50, 0.82) : null;
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

  loadEamesChairModel().then((template) => {
    if (!group.parent) return;

    chairPlacements.forEach(([x, z, rotationY]) => {
      const chair = template.clone(true);
      chair.traverse((object) => {
        if (!object.isMesh) return;
        object.castShadow = true;
        object.receiveShadow = true;
        if (object.material) object.material = object.material.clone();
        if (object.material?.name === 'plastic_wit') {
          object.material.color.set(moduleState.surface?.color ?? '#ffffff');
          colorTargets.push(object);
        }
      });

      chair.updateMatrixWorld(true);
      let box = new THREE.Box3().setFromObject(chair);
      const size = box.getSize(new THREE.Vector3());
      const scale = size.y > 0 ? EAMES_CHAIR_TARGET_HEIGHT_M / size.y : 1;
      chair.scale.multiplyScalar(scale);
      chair.updateMatrixWorld(true);
      box = new THREE.Box3().setFromObject(chair);
      const center = box.getCenter(new THREE.Vector3());
      chair.position.x -= center.x;
      chair.position.z -= center.z;
      chair.position.y -= box.min.y;

      const holder = new THREE.Group();
      holder.position.set(x, 0, z);
      holder.rotation.y = rotationY;
      holder.add(chair);
      group.add(holder);
    });
  }).catch((error) => {
    console.warn('Eames GLB modeli yüklenemedi:', error);
  });

  return { group, surfaces };
}
`;

source = source.slice(0, fnStart) + newFn + source.slice(fnEnd);
fs.writeFileSync(scenePath, source);

const testPath = 'test/eamesTableChairSetContract.test.js';
let testSource = fs.readFileSync(testPath, 'utf8');
testSource = testSource.replace(
  /test\('Eames renderer uses[\s\S]*?\n\}\);\n\ntest\('optimized Eames payload and attribution are present'[\s\S]*?\n\}\);\n?/,
  `test('Eames renderer loads the original GLB once and clones four chairs', () => {\n  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n  assert.match(source, /GLTFLoader/);\n  assert.match(source, /models\\/eames_chair\\.glb/);\n  assert.match(source, /template\\.clone\\(true\\)/);\n  assert.match(source, /chairPlacements\\.forEach/);\n});\n\ntest('original Eames GLB asset is present', () => {\n  const payload = fs.statSync(new URL('../public/models/eames_chair.glb', import.meta.url));\n  assert.ok(payload.size > 400000);\n});\n`,
);
fs.writeFileSync(testPath, testSource);
