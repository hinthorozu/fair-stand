from pathlib import Path


def replace_once(path, old, new):
    p = Path(path)
    s = p.read_text(encoding='utf-8')
    if old not in s:
        raise SystemExit(f'anchor not found in {path}: {old[:100]!r}')
    p.write_text(s.replace(old, new, 1), encoding='utf-8')

# catalog.js
p = Path('src/catalog.js')
s = p.read_text(encoding='utf-8')
anchor = "export const furniture_bar_stool_classic_DIMENSIONS = Object.freeze({\n  widthCm: 50,\n  depthCm: 50,\n  heightCm: 80,\n});\n"
addition = anchor + "\nexport const furniture_bar_stool_2_DIMENSIONS = Object.freeze({\n  widthCm: 60,\n  depthCm: 55,\n  heightCm: 121,\n});\n"
if 'furniture_bar_stool_2_DIMENSIONS' not in s:
    if anchor not in s: raise SystemExit('catalog dimensions anchor missing')
    s = s.replace(anchor, addition, 1)

catalog_anchor = "  furniture_bar_stool_classic: { type: 'bar-stool', widthCm: 50, depthCm: 50, heightCm: 80, label: 'Bar Taburesi' },"
if "furniture_bar_stool_2:" not in s:
    if catalog_anchor not in s: raise SystemExit('catalog item anchor missing')
    s = s.replace(catalog_anchor, catalog_anchor + "\n  furniture_bar_stool_2: { type: 'bar-stool-2', widthCm: 60, depthCm: 55, heightCm: 121, label: 'Tabure 2' },", 1)

keys_anchor = "  'furniture_bar_stool_classic',"
if "  'furniture_bar_stool_2'," not in s:
    if keys_anchor not in s: raise SystemExit('catalog key anchor missing')
    s = s.replace(keys_anchor, keys_anchor + "\n  'furniture_bar_stool_2',", 1)
p.write_text(s, encoding='utf-8')

# designState.js
p = Path('src/designState.js')
s = p.read_text(encoding='utf-8')
if 'export function createBarStool2ModuleState()' not in s:
    anchor = "export function createBarStoolModuleState() {\n  return {\n    id: createId('module'),\n    type: 'bar-stool',\n    widthCm: 50,\n    depthCm: 50,\n    heightCm: 80,\n    surface: {\n      id: createId('surface'),\n      color: DEFAULT_PANEL_COLOR,\n    },\n  };\n}\n"
    addition = anchor + "\nexport function createBarStool2ModuleState() {\n  return {\n    id: createId('module'),\n    type: 'bar-stool-2',\n    widthCm: 60,\n    depthCm: 55,\n    heightCm: 121,\n    surface: {\n      id: createId('surface'),\n      color: DEFAULT_PANEL_COLOR,\n    },\n  };\n}\n"
    if anchor not in s: raise SystemExit('designState bar stool anchor missing')
    s = s.replace(anchor, addition, 1)
p.write_text(s, encoding='utf-8')

# main.js
p = Path('src/main.js')
s = p.read_text(encoding='utf-8')
if 'createBarStool2ModuleState,' not in s:
    s = s.replace('  createBarStoolModuleState,\n', '  createBarStoolModuleState,\n  createBarStool2ModuleState,\n', 1)
if "module.type === 'bar-stool-2'" not in s:
    anchor = "  else if (module.type === 'bar-stool') state = createBarStoolModuleState();"
    if anchor not in s: raise SystemExit('main bar-stool dispatch anchor missing')
    s = s.replace(anchor, anchor + "\n  else if (module.type === 'bar-stool-2') state = createBarStool2ModuleState();", 1)
if "moduleType === 'bar-stool-2'" not in s:
    anchor = "      if (moduleType === 'led-floodlight') {"
    block = "      if (moduleType === 'bar-stool-2') {\n        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Tabure 2 · GLB model.';\n        return;\n      }\n\n"
    if anchor not in s: raise SystemExit('main selection anchor missing')
    s = s.replace(anchor, block + anchor, 1)
p.write_text(s, encoding='utf-8')

# scene3d.js
p = Path('src/scene3d.js')
s = p.read_text(encoding='utf-8')
if 'function loadBarStool2Model()' not in s:
    anchor = "let beigeSofaModelPromise = null;"
    loader = "let barStool2ModelPromise = null;\n\nfunction loadBarStool2Model() {\n  if (!barStool2ModelPromise) {\n    const loader = new GLTFLoader();\n    barStool2ModelPromise = loader\n      .loadAsync(import.meta.env.BASE_URL + 'models/bar_chair.glb')\n      .then((gltf) => gltf.scene);\n  }\n  return barStool2ModelPromise;\n}\n\n"
    if anchor not in s: raise SystemExit('scene loader anchor missing')
    s = s.replace(anchor, loader + anchor, 1)

if "|| type === 'bar-stool-2';" not in s:
    old = "    || type === 'bar-stool';"
    if old not in s: raise SystemExit('isFloorFixture bar-stool anchor missing')
    s = s.replace(old, "    || type === 'bar-stool'\n    || type === 'bar-stool-2';", 1)

if 'function createBarStool2Module(moduleState, moduleIndex)' not in s:
    anchor = "\n\nfunction createEamesTableChairSetModule(moduleState, moduleIndex) {"
    fn = r'''

function createBarStool2Module(moduleState, moduleIndex) {
  const widthCm = Number(moduleState.widthCm || 60);
  const depthCm = Number(moduleState.depthCm || 55);
  const heightCm = Number(moduleState.heightCm || 121);
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: 'bar-stool-2',
    widthCm,
    depthCm,
    heightCm,
  };

  // Selection proxy only; the uploaded GLB remains visually/materially untouched.
  const proxy = new THREE.Mesh(
    new THREE.BoxGeometry(widthCm / 100, heightCm / 100, depthCm / 100),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
  );
  proxy.position.set(0, heightCm / 200, 0);
  group.add(proxy);

  const selectionFrame = createSelectionFrame(widthCm / 100, heightCm / 100);
  selectionFrame.visible = false;
  proxy.add(selectionFrame);
  proxy.userData = {
    kind: 'surface',
    moduleType: 'bar-stool-2',
    selectionMode: 'module',
    acceptsImage: false,
    moduleIndex,
    moduleId: moduleState.id,
    widthCm,
    stripIndex: null,
    stripNumber: null,
    surfaceRole: 'chair',
    surfaceId: moduleState.surface?.id,
    surfaceState: moduleState.surface,
    selectionFrame,
    colorTargets: [],
  };

  loadBarStool2Model().then((template) => {
    if (!group.parent) return;
    const chair = template.clone(true);
    chair.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = true;
      object.receiveShadow = true;
      // Do not replace, recolor or rebuild GLB materials/textures.
    });

    chair.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(chair);
    const center = box.getCenter(new THREE.Vector3());
    chair.position.x -= center.x;
    chair.position.z -= center.z;
    chair.position.y -= box.min.y;
    group.add(chair);
  }).catch((error) => {
    console.warn('Tabure 2 GLB modeli yüklenemedi:', error);
  });

  return { group, surfaces: [proxy] };
}
'''
    if anchor not in s: raise SystemExit('scene Eames anchor missing')
    s = s.replace(anchor, fn + anchor, 1)

if "moduleState.type === 'bar-stool-2'" not in s:
    anchor = "      } else if (moduleState.type === 'bar-stool') {\n        module = createBarStoolModule(moduleState, moduleIndex);"
    if anchor not in s: raise SystemExit('scene renderer dispatch anchor missing')
    s = s.replace(anchor, anchor + "\n      } else if (moduleState.type === 'bar-stool-2') {\n        module = createBarStool2Module(moduleState, moduleIndex);", 1)
p.write_text(s, encoding='utf-8')

# Focused regression test
Path('test/barStool2.test.js').write_text("""import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import { createBarStool2ModuleState } from '../src/designState.js';

test('Tabure 2 katalog ve state kimliği sabittir', () => {
  const item = MODULE_CATALOG.furniture_bar_stool_2;
  assert.ok(item);
  assert.equal(item.type, 'bar-stool-2');
  assert.equal(item.label, 'Tabure 2');
  assert.equal(item.widthCm, 60);
  assert.equal(item.depthCm, 55);
  assert.equal(item.heightCm, 121);
  assert.ok(MODULE_CATALOG_KEYS.includes('furniture_bar_stool_2'));

  const state = createBarStool2ModuleState();
  assert.equal(state.type, 'bar-stool-2');
  assert.equal(state.widthCm, 60);
  assert.equal(state.depthCm, 55);
  assert.equal(state.heightCm, 121);
});
""", encoding='utf-8')
