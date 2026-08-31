from pathlib import Path

# catalog
p=Path('src/catalog.js'); s=p.read_text()
s=s.replace("export const LED_FLOODLIGHT_DIMENSIONS = Object.freeze({", "export const TV_42_DIMENSIONS = Object.freeze({\n  moduleWidthCm: 100,\n  screenWidthCm: 93.0,\n  screenHeightCm: 52.3,\n  heightCm: 350,\n});\n\nexport const LED_FLOODLIGHT_DIMENSIONS = Object.freeze({",1)
s=s.replace("  LED_FLOODLIGHT: { type: 'led-floodlight', widthCm: 50, depthCm: 20, heightCm: 35, label: 'LED Projektör' },", "  TV_42: { type: 'tv', widthCm: 100, heightCm: 350, screenWidthCm: 93.0, screenHeightCm: 52.3, sizeInch: 42, label: 'TV 42\"' },\n  LED_FLOODLIGHT: { type: 'led-floodlight', widthCm: 50, depthCm: 20, heightCm: 35, label: 'LED Projektör' },",1)
s=s.replace("  'furniture_bar_stool_classic',\n  'LED_FLOODLIGHT',", "  'furniture_bar_stool_classic',\n  'TV_42',\n  'LED_FLOODLIGHT',",1)
p.write_text(s)

# design state
p=Path('src/designState.js'); s=p.read_text()
anchor="export function createLedFloodlightModuleState() {"
func="""export function createTvModuleState(sizeInch = 42) {\n  if (Number(sizeInch) !== 42) return null;\n  const base = createFlatPanelModuleState(100);\n  return {\n    ...base,\n    type: 'tv',\n    heightCm: 350,\n    sizeInch: 42,\n    screenWidthCm: 93.0,\n    screenHeightCm: 52.3,\n  };\n}\n\n"""
assert anchor in s; s=s.replace(anchor,func+anchor,1); p.write_text(s)

# behavior explicit ghost contract
p=Path('src/moduleBehavior.js'); s=p.read_text()
anchor="  'led-floodlight': Object.freeze({"
entry="""  tv: Object.freeze({\n    placement: 'wall',\n    moveSnapCm: 50,\n    rotationStepDeg: 90,\n    defaultRotationDeg: 0,\n    allowSideInsert: true,\n    collision: 'segment',\n    ghost: Object.freeze({ mode: 'proxy', renderer: null, opacity: 0.3 }),\n  }),\n"""
assert anchor in s; s=s.replace(anchor,entry+anchor,1); p.write_text(s)

# main import and factory
p=Path('src/main.js'); s=p.read_text()
s=s.replace("  createLedFloodlightModuleState,", "  createLedFloodlightModuleState,\n  createTvModuleState,",1)
s=s.replace("  else if (module.type === 'led-floodlight') state = createLedFloodlightModuleState();", "  else if (module.type === 'tv') state = createTvModuleState(module.sizeInch ?? 42);\n  else if (module.type === 'led-floodlight') state = createLedFloodlightModuleState();",1)
s=s.replace("      if (moduleType === 'led-floodlight') {", "      if (moduleType === 'tv') {\n        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · TV 42\" · 93.0 × 52.3 cm ekran.';\n        return;\n      }\n\n      if (moduleType === 'led-floodlight') {",1)
p.write_text(s)

# scene loader + renderer
p=Path('src/scene3d.js'); s=p.read_text()
anchor="let barStoolModelPromise = null;"
loader="""let tvModelPromise = null;\n\nfunction loadTvModel() {\n  if (!tvModelPromise) {\n    const loader = new GLTFLoader();\n    tvModelPromise = loader\n      .loadAsync(import.meta.env.BASE_URL + 'models/tv.glb')\n      .then((gltf) => gltf.scene);\n  }\n  return tvModelPromise;\n}\n\n"""
assert anchor in s; s=s.replace(anchor,loader+anchor,1)
# dispatcher
needle="""      } else if (moduleState.type === 'bar-stool') {\n        module = createBarStoolModule(moduleState, moduleIndex);\n      } else if (moduleState.type === 'led-floodlight') {"""
repl="""      } else if (moduleState.type === 'bar-stool') {\n        module = createBarStoolModule(moduleState, moduleIndex);\n      } else if (moduleState.type === 'tv') {\n        module = createTvModule(moduleState, moduleIndex, (surface) => applyStoredImage(surface));\n      } else if (moduleState.type === 'led-floodlight') {"""
assert needle in s; s=s.replace(needle,repl,1)
# add renderer before LED global function
anchor="function createLedFloodlightModule(moduleState, moduleIndex) {"
renderer=r'''function createTvModule(moduleState, moduleIndex, onSurfaceReady) {
  const wallState = { ...moduleState, type: 'flat-panel' };
  const built = createFlatPanelModule(wallState, moduleIndex, onSurfaceReady);
  const group = built.group;
  group.userData.type = 'tv';
  group.userData.moduleType = 'tv';
  group.userData.moduleState = moduleState;
  built.surfaces.forEach((surface) => {
    surface.userData.moduleType = 'tv';
  });

  const targetWidthM = Number(moduleState.screenWidthCm || 93) / 100;
  const targetHeightM = Number(moduleState.screenHeightCm || 52.3) / 100;
  const mountCenterY = 1.75;
  const mountFrontZ = 0.058;

  loadTvModel().then((template) => {
    if (!group.parent) return;
    const tv = template.clone(true);
    const allowedMeshes = new Set(['Object_4', 'Object_5']);
    tv.traverse((object) => {
      if (!object.isMesh) return;
      if (!allowedMeshes.has(object.name)) {
        object.visible = false;
        return;
      }
      object.castShadow = true;
      object.receiveShadow = true;
      if (object.name === 'Object_5') {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 576;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#111318';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '700 92px Arial, sans-serif';
        const y = canvas.height / 2;
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('KYROX', 430, y);
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('.STUDIO', 680, y);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        object.material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
      }
    });

    tv.updateMatrixWorld(true);
    let box = new THREE.Box3().setFromObject(tv);
    const size = box.getSize(new THREE.Vector3());
    const scale = size.x > 0 ? targetWidthM / size.x : 1;
    tv.scale.multiplyScalar(scale);
    tv.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(tv);
    const scaledSize = box.getSize(new THREE.Vector3());
    // Width drives uniform scaling; 16:9 source should land at the requested height.
    if (Math.abs(scaledSize.y - targetHeightM) > 0.02) {
      console.warn('TV 42 GLB aspect ratio differs from catalog target:', scaledSize.x, scaledSize.y);
    }
    const center = box.getCenter(new THREE.Vector3());
    tv.position.x -= center.x;
    tv.position.y -= center.y;
    tv.position.z -= box.min.z;
    tv.position.y += mountCenterY;
    tv.position.z += mountFrontZ;
    group.add(tv);
  }).catch((error) => {
    console.warn('TV GLB modeli yüklenemedi:', error);
  });

  return built;
}

'''
assert anchor in s; s=s.replace(anchor,renderer+anchor,1)
# drag label
s=s.replace("    if (moduleState?.type === 'bar-stool') return 'Bar Taburesi';", "    if (moduleState?.type === 'bar-stool') return 'Bar Taburesi';\n    if (moduleState?.type === 'tv') return 'TV 42\"';",1)
p.write_text(s)

# tests
Path('test/tv42Module.test.js').write_text("""import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport fs from 'node:fs';\nimport { MODULE_CATALOG } from '../src/catalog.js';\nimport { createTvModuleState } from '../src/designState.js';\nimport { getModuleGhostBehavior } from '../src/moduleBehavior.js';\n\ntest('TV 42 catalog and state use one shared GLB-scaled 93.0 x 52.3 screen', () => {\n  const item = MODULE_CATALOG.TV_42;\n  assert.equal(item.type, 'tv');\n  assert.equal(item.screenWidthCm, 93);\n  assert.equal(item.screenHeightCm, 52.3);\n  const state = createTvModuleState(42);\n  assert.equal(state.widthCm, 100);\n  assert.equal(state.screenWidthCm, 93);\n  assert.equal(state.screenHeightCm, 52.3);\n});\n\ntest('TV module has explicit ghost behavior contract', () => {\n  assert.equal(getModuleGhostBehavior({ type: 'tv' }).mode, 'proxy');\n});\n\ntest('TV renderer loads shared tv.glb and hides receiver meshes', () => {\n  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n  assert.match(source, /models\\/tv\\.glb/);\n  assert.match(source, /new Set\\(\\['Object_4', 'Object_5'\\]\\)/);\n  assert.match(source, /KYROX/);\n});\n""")
