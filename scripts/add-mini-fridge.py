from pathlib import Path


def replace_once(path, old, new):
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise SystemExit(f'marker not found in {path}: {old[:120]!r}')
    p.write_text(text.replace(old, new, 1))

# catalog
replace_once('src/catalog.js',
"export const furniture_bar_stool_classic_DIMENSIONS = Object.freeze({\n  widthCm: 60,\n  depthCm: 55,\n  heightCm: 121,\n});\n",
"export const furniture_bar_stool_classic_DIMENSIONS = Object.freeze({\n  widthCm: 60,\n  depthCm: 55,\n  heightCm: 121,\n});\n\nexport const DEPOT_MINI_FRIDGE_DIMENSIONS = Object.freeze({\n  widthCm: 45,\n  depthCm: 43,\n  heightCm: 66,\n});\n")
replace_once('src/catalog.js',
"  furniture_bar_stool_classic: { type: 'bar-stool', widthCm: 60, depthCm: 55, heightCm: 121, label: 'Bar Taburesi' },\n",
"  furniture_bar_stool_classic: { type: 'bar-stool', widthCm: 60, depthCm: 55, heightCm: 121, label: 'Bar Taburesi' },\n  DEPOT_MINI_FRIDGE_AVANTI: { type: 'mini-fridge', widthCm: 45, depthCm: 43, heightCm: 66, label: 'Mini Buzdolabı' },\n")
replace_once('src/catalog.js',
"  'furniture_bar_stool_classic',\n  'TV_42',\n",
"  'furniture_bar_stool_classic',\n  'DEPOT_MINI_FRIDGE_AVANTI',\n  'TV_42',\n")

# state
replace_once('src/designState.js',
"export function createTvModuleState(sizeInch = 42) {\n",
"export function createMiniFridgeModuleState() {\n  return {\n    id: createId('module'),\n    type: 'mini-fridge',\n    widthCm: 45,\n    depthCm: 43,\n    heightCm: 66,\n  };\n}\n\nexport function createTvModuleState(sizeInch = 42) {\n")

# behavior
replace_once('src/moduleBehavior.js',
"  'bar-stool': Object.freeze({\n    placement: 'free',\n    moveSnapCm: 10,\n    rotationStepDeg: 45,\n    defaultRotationDeg: 270,\n    allowSideInsert: true,\n    collision: 'footprint',\n    ghost: Object.freeze({ kind: 'real-model', renderer: 'bar-stool', opacity: 0.38 }),\n  }),\n",
"  'bar-stool': Object.freeze({\n    placement: 'free',\n    moveSnapCm: 10,\n    rotationStepDeg: 45,\n    defaultRotationDeg: 270,\n    allowSideInsert: true,\n    collision: 'footprint',\n    ghost: Object.freeze({ kind: 'real-model', renderer: 'bar-stool', opacity: 0.38 }),\n  }),\n  'mini-fridge': Object.freeze({\n    placement: 'free',\n    moveSnapCm: 10,\n    rotationStepDeg: 90,\n    defaultRotationDeg: 0,\n    allowSideInsert: true,\n    collision: 'footprint',\n  }),\n")

# main imports + state factory + selection text
replace_once('src/main.js',
"  createBarStoolModuleState,\n  createLedFloodlightModuleState,\n",
"  createBarStoolModuleState,\n  createMiniFridgeModuleState,\n  createLedFloodlightModuleState,\n")
replace_once('src/main.js',
"      if (moduleType === 'bar-stool') {\n        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Bar Taburesi · GLB model.';\n        return;\n      }\n",
"      if (moduleType === 'bar-stool') {\n        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Bar Taburesi · GLB model.';\n        return;\n      }\n\n      if (moduleType === 'mini-fridge') {\n        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Mini Buzdolabı · 45 × 43 × 66 cm · GLB model.';\n        return;\n      }\n")
replace_once('src/main.js',
"  else if (module.type === 'bar-stool') state = createBarStoolModuleState();\n  else if (module.type === 'tv') state = createTvModuleState(module.sizeInch ?? 42);\n",
"  else if (module.type === 'bar-stool') state = createBarStoolModuleState();\n  else if (module.type === 'mini-fridge') state = createMiniFridgeModuleState();\n  else if (module.type === 'tv') state = createTvModuleState(module.sizeInch ?? 42);\n")

# sidebar preview + group
replace_once('src/moduleDragSidebar.js',
"    .module-drag-bar-stool::after { content:''; position:absolute; left:11px; top:24px; width:22px; height:27px; border-left:3px solid ${ALUMINUM_PROFILE_COLOR}; border-right:3px solid ${ALUMINUM_PROFILE_COLOR}; border-bottom:3px solid ${ALUMINUM_PROFILE_COLOR}; border-radius:0 0 10px 10px; }\n",
"    .module-drag-bar-stool::after { content:''; position:absolute; left:11px; top:24px; width:22px; height:27px; border-left:3px solid ${ALUMINUM_PROFILE_COLOR}; border-right:3px solid ${ALUMINUM_PROFILE_COLOR}; border-bottom:3px solid ${ALUMINUM_PROFILE_COLOR}; border-radius:0 0 10px 10px; }\n    .module-drag-mini-fridge { position:relative; width:38px; height:58px; border:3px solid #6b7280; border-radius:5px; background:#e7e5df; box-shadow:3px 3px 0 #cbd5e1; box-sizing:border-box; }\n    .module-drag-mini-fridge::before { content:''; position:absolute; left:2px; right:2px; top:18px; height:2px; background:#8b8f94; }\n    .module-drag-mini-fridge::after { content:''; position:absolute; right:4px; top:7px; width:2px; height:8px; border-radius:2px; background:#555b61; box-shadow:0 21px 0 #555b61; }\n")
replace_once('src/moduleDragSidebar.js',
"  if (module.type === 'bar-stool') {\n    const body = document.createElement('div');\n    body.className = 'module-drag-bar-stool';\n    preview.appendChild(body);\n    return preview;\n  }\n",
"  if (module.type === 'bar-stool') {\n    const body = document.createElement('div');\n    body.className = 'module-drag-bar-stool';\n    preview.appendChild(body);\n    return preview;\n  }\n\n  if (module.type === 'mini-fridge') {\n    const body = document.createElement('div');\n    body.className = 'module-drag-mini-fridge';\n    preview.appendChild(body);\n    return preview;\n  }\n")
replace_once('src/moduleDragSidebar.js',
"    {\n      label: 'Elektronik & Aydınlatma',\n      keys: ['TV_42', 'TV_55', 'TV_65', 'LED_FLOODLIGHT'],\n    },\n",
"    {\n      label: 'Depo',\n      keys: ['DEPOT_MINI_FRIDGE_AVANTI'],\n    },\n    {\n      label: 'Elektronik & Aydınlatma',\n      keys: ['TV_42', 'TV_55', 'TV_65', 'LED_FLOODLIGHT'],\n    },\n")

# scene GLB loader
replace_once('src/scene3d.js',
"function loadBarStoolModel() {\n  if (!barStoolModelPromise) {\n    const loader = new GLTFLoader();\n    barStoolModelPromise = loader\n      .loadAsync(import.meta.env.BASE_URL + 'models/bar_chair.glb')\n      .then((gltf) => gltf.scene);\n  }\n  return barStoolModelPromise;\n}\n",
"function loadBarStoolModel() {\n  if (!barStoolModelPromise) {\n    const loader = new GLTFLoader();\n    barStoolModelPromise = loader\n      .loadAsync(import.meta.env.BASE_URL + 'models/bar_chair.glb')\n      .then((gltf) => gltf.scene);\n  }\n  return barStoolModelPromise;\n}\n\nlet miniFridgeModelPromise = null;\n\nfunction loadMiniFridgeModel() {\n  if (!miniFridgeModelPromise) {\n    const loader = new GLTFLoader();\n    miniFridgeModelPromise = loader\n      .loadAsync(import.meta.env.BASE_URL + 'models/80s_avanti_mini_fridge.glb')\n      .then((gltf) => gltf.scene);\n  }\n  return miniFridgeModelPromise;\n}\n")

# build branch
replace_once('src/scene3d.js',
"      } else if (moduleState.type === 'bar-stool') {\n        module = createBarStoolModule(moduleState, moduleIndex);\n      } else if (moduleState.type === 'tv') {\n",
"      } else if (moduleState.type === 'bar-stool') {\n        module = createBarStoolModule(moduleState, moduleIndex);\n      } else if (moduleState.type === 'mini-fridge') {\n        module = createMiniFridgeModule(moduleState, moduleIndex);\n      } else if (moduleState.type === 'tv') {\n")

# drag label
replace_once('src/scene3d.js',
"    if (moduleState?.type === 'bar-stool') return 'Bar Taburesi';\n    if (moduleState?.type === 'tv') return `TV ${Number(moduleState.sizeInch) || 42}\\\"`;\n",
"    if (moduleState?.type === 'bar-stool') return 'Bar Taburesi';\n    if (moduleState?.type === 'mini-fridge') return 'Mini Buzdolabı';\n    if (moduleState?.type === 'tv') return `TV ${Number(moduleState.sizeInch) || 42}\\\"`;\n")

# renderer function before LED renderer
fridge_fn = r'''function createMiniFridgeModule(moduleState, moduleIndex) {
  const widthCm = Number(moduleState.widthCm || 45);
  const depthCm = Number(moduleState.depthCm || 43);
  const heightCm = Number(moduleState.heightCm || 66);
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    moduleType: 'mini-fridge',
    type: 'mini-fridge',
    widthCm,
    depthCm,
    heightCm,
  };

  const proxy = new THREE.Mesh(
    new THREE.BoxGeometry(widthCm / 100, heightCm / 100, depthCm / 100),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
  );
  proxy.position.y = heightCm / 200;
  proxy.userData = {
    kind: 'surface',
    surfaceId: `${moduleState.id}:mini-fridge`,
    moduleId: moduleState.id,
    moduleType: 'mini-fridge',
    moduleIndex,
    selectionMode: 'module',
    acceptsImage: false,
    widthCm,
    depthCm,
    heightCm,
  };
  group.add(proxy);

  loadMiniFridgeModel().then((template) => {
    const model = template.clone(true);
    model.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = true;
      object.receiveShadow = true;
    });

    model.updateMatrixWorld(true);
    let box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const targetHeightM = heightCm / 100;
    const uniformScale = size.y > 0 ? targetHeightM / size.y : 1;
    model.scale.multiplyScalar(uniformScale);
    model.updateMatrixWorld(true);

    box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.x -= center.x;
    model.position.z -= center.z;
    model.position.y -= box.min.y;
    group.add(model);
  }).catch((error) => {
    console.warn('Mini Buzdolabı GLB modeli yüklenemedi:', error);
  });

  return { group, surfaces: [proxy] };
}

'''
replace_once('src/scene3d.js',
"function createLedFloodlightModule(moduleState, moduleIndex) {\n",
fridge_fn + "function createLedFloodlightModule(moduleState, moduleIndex) {\n")

# old regression test was stale after the previously requested 270-degree change.
replace_once('test/lCounterDefaultOrientation.test.js',
"    assert.equal(getModuleDefaultRotationDeg(module), 180);\n",
"    assert.equal(getModuleDefaultRotationDeg(module), 270);\n")

# Add focused test for new module behavior/catalog/state.
Path('test/miniFridge.test.js').write_text("""import test from 'node:test';\nimport assert from 'node:assert/strict';\n\nimport { MODULE_CATALOG } from '../src/catalog.js';\nimport { createMiniFridgeModuleState } from '../src/designState.js';\nimport { getModuleBehavior } from '../src/moduleBehavior.js';\n\ntest('mini fridge catalog/state dimensions stay aligned', () => {\n  const catalog = MODULE_CATALOG.DEPOT_MINI_FRIDGE_AVANTI;\n  const state = createMiniFridgeModuleState();\n  assert.deepEqual(\n    [catalog.widthCm, catalog.depthCm, catalog.heightCm],\n    [45, 43, 66],\n  );\n  assert.deepEqual(\n    [state.widthCm, state.depthCm, state.heightCm],\n    [45, 43, 66],\n  );\n});\n\ntest('mini fridge is a free footprint module', () => {\n  const behavior = getModuleBehavior({ type: 'mini-fridge' });\n  assert.equal(behavior.placement, 'free');\n  assert.equal(behavior.collision, 'footprint');\n  assert.equal(behavior.rotationStepDeg, 90);\n});\n""")

# Ensure the supplied GLB really exists on this branch before committing code that references it.
if not Path('public/models/80s_avanti_mini_fridge.glb').is_file():
    raise SystemExit('public/models/80s_avanti_mini_fridge.glb is missing')

print('mini fridge patch applied')
