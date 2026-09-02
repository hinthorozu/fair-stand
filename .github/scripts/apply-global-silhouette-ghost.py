from pathlib import Path
import re


def replace_exact(path, old, new, count=1):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    found = text.count(old)
    if found != count:
        raise SystemExit(f'{path}: expected {count} occurrences, found {found}: {old!r}')
    p.write_text(text.replace(old, new, count), encoding='utf-8')


# 1) Central contract: every module uses the same lightweight silhouette ghost behavior.
replace_exact(
    'src/moduleBehavior.js',
    "const DEFAULT_GHOST_BEHAVIOR = Object.freeze({\n  kind: 'proxy',\n  renderer: 'proxy',\n  opacity: 0.30,\n});",
    "const DEFAULT_GHOST_BEHAVIOR = Object.freeze({\n  kind: 'silhouette',\n  renderer: 'module-silhouette',\n  opacity: 0.38,\n});",
)
for old in [
    "    ghost: Object.freeze({ kind: 'custom', renderer: 'sofa-set-classic', opacity: 0.38 }),\n",
    "    ghost: Object.freeze({ kind: 'custom', renderer: 'table-chair-set-eames', opacity: 0.38 }),\n",
    "    ghost: Object.freeze({ kind: 'real-model', renderer: 'bar-stool', opacity: 0.38 }),\n",
    "    ghost: Object.freeze({ kind: 'real-model', renderer: 'tv', opacity: 0.38 }),\n",
]:
    replace_exact('src/moduleBehavior.js', old, '')

scene_path = Path('src/scene3d.js')
scene = scene_path.read_text(encoding='utf-8')

# 2) Replace every per-module ghost renderer with one singleton silhouette renderer.
start = scene.find('  function disposePlacementGhost() {')
end = scene.find('  function disposeDragBadge() {', start)
if start < 0 or end < 0:
    raise SystemExit('scene3d.js: ghost block anchors not found')

new_ghost_block = r'''  function disposePlacementGhost() {
    if (!placementGhost) return;
    placementGhost.root.visible = false;
  }

  function destroyPlacementGhost() {
    if (!placementGhost) return;
    scene.remove(placementGhost.root);
    placementGhost.material?.dispose?.();
    placementGhost = null;
  }

  function getPlacementGhostDimensions(moduleOrWidthCm) {
    if (typeof moduleOrWidthCm === 'object' && moduleOrWidthCm) {
      return {
        widthCm: Number(moduleOrWidthCm.widthCm),
        depthM: Math.max(Number(moduleOrWidthCm.depthCm ?? (STAND_DIMENSIONS.depth * 100)) / 100, 0.02),
        heightM: Math.max(Number(moduleOrWidthCm.heightCm ?? (STAND_DIMENSIONS.height * 100)) / 100, 0.02),
      };
    }
    return {
      widthCm: Number(moduleOrWidthCm),
      depthM: Math.max(STAND_DIMENSIONS.depth, 0.08),
      heightM: STAND_DIMENSIONS.height,
    };
  }

  function getPlacementGhostKey(moduleOrWidthCm, dimensions) {
    if (!moduleOrWidthCm || typeof moduleOrWidthCm !== 'object') {
      return ['generic', dimensions.widthCm, dimensions.depthM, dimensions.heightM].join(':');
    }
    return [
      moduleOrWidthCm.type ?? 'generic',
      dimensions.widthCm,
      dimensions.depthM,
      dimensions.heightM,
      moduleOrWidthCm.shape ?? '',
      moduleOrWidthCm.shelfCount ?? '',
      moduleOrWidthCm.sizeInch ?? '',
      moduleOrWidthCm.screenWidthCm ?? '',
      moduleOrWidthCm.screenHeightCm ?? '',
    ].join(':');
  }

  function createSilhouetteGhostMaterial(opacity) {
    return new THREE.MeshBasicMaterial({
      color: PLACEMENT_VALID_COLOR,
      transparent: true,
      opacity: Number(opacity) || 0.38,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
      toneMapped: false,
      fog: false,
    });
  }

  function preparePlacementGhostTree(object, ghostMaterial) {
    if (!object) return;

    if (!object.userData?.placementGhostAddWrapped) {
      const originalAdd = object.add.bind(object);
      object.add = (...children) => {
        children.forEach((child) => preparePlacementGhostTree(child, ghostMaterial));
        return originalAdd(...children);
      };
      object.userData = {
        ...object.userData,
        placementGhostAddWrapped: true,
      };
    }

    object.raycast = () => {};

    if (
      object.isLight
      || object.isLine
      || object.isLineSegments
      || object.isPoints
      || object.isSprite
      || object.userData?.isModuleSelectionVisual
    ) {
      object.visible = false;
    } else if (object.isMesh) {
      const sourceMaterials = Array.isArray(object.material) ? object.material : [object.material];
      const isInvisiblePickingProxy = sourceMaterials.some((material) => (
        material?.colorWrite === false
        || (material?.transparent === true && Number(material?.opacity) === 0)
      ));

      if (isInvisiblePickingProxy) {
        object.visible = false;
        object.userData = {
          ...object.userData,
          placementGhostHiddenProxy: true,
        };
      } else {
        object.material = ghostMaterial;
        object.castShadow = false;
        object.receiveShadow = false;
        object.renderOrder = 10000;
      }
    }

    object.children.forEach((child) => preparePlacementGhostTree(child, ghostMaterial));
  }

  function createFallbackPlacementGhost(dimensions, key, opacity) {
    const root = new THREE.Group();
    const material = createSilhouetteGhostMaterial(opacity);
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(
        Math.max(dimensions.widthCm / 100, 0.02),
        dimensions.heightM,
        dimensions.depthM,
      ),
      material,
    );
    mesh.position.y = dimensions.heightM / 2;
    mesh.renderOrder = 10000;
    mesh.raycast = () => {};
    root.add(mesh);
    root.visible = false;
    scene.add(root);
    return {
      root,
      material,
      key,
      widthCm: dimensions.widthCm,
      colorHex: PLACEMENT_VALID_COLOR,
      isFallback: true,
    };
  }

  function createPlacementGhost(moduleOrWidthCm, dimensions, key, ghostBehavior) {
    if (!moduleOrWidthCm || typeof moduleOrWidthCm !== 'object') {
      return createFallbackPlacementGhost(dimensions, key, ghostBehavior.opacity);
    }

    const built = createRenderableModule(moduleOrWidthCm, -1, null);
    if (!built?.group) {
      console.warn('Silüet ghost için modül renderer bulunamadı; kutu fallback kullanılıyor:', moduleOrWidthCm.type);
      return createFallbackPlacementGhost(dimensions, key, ghostBehavior.opacity);
    }

    const root = built.group;
    root.position.set(0, 0, 0);
    root.rotation.set(0, 0, 0);
    root.scale.set(1, 1, 1);
    root.visible = false;

    const material = createSilhouetteGhostMaterial(ghostBehavior.opacity);
    preparePlacementGhostTree(root, material);
    scene.add(root);

    return {
      root,
      material,
      key,
      widthCm: dimensions.widthCm,
      colorHex: PLACEMENT_VALID_COLOR,
      isFallback: false,
    };
  }

  function ensurePlacementGhost(moduleOrWidthCm) {
    const ghostBehavior = getModuleGhostBehavior(moduleOrWidthCm);
    const dimensions = getPlacementGhostDimensions(moduleOrWidthCm);
    const key = getPlacementGhostKey(moduleOrWidthCm, dimensions);
    if (placementGhost?.key === key) return placementGhost;

    destroyPlacementGhost();
    placementGhost = createPlacementGhost(moduleOrWidthCm, dimensions, key, ghostBehavior);
    return placementGhost;
  }

  function showPlacementGhost(moduleOrWidthCm, placement, valid) {
    const ghost = ensurePlacementGhost(moduleOrWidthCm);
    const colorHex = valid ? PLACEMENT_VALID_COLOR : PLACEMENT_INVALID_COLOR;
    ghost.colorHex = colorHex;
    ghost.material?.color?.setHex(colorHex);
    if (moduleOrWidthCm && typeof moduleOrWidthCm === 'object') {
      ghost.root.userData.type = moduleOrWidthCm.type ?? ghost.root.userData.type;
    }
    applyPlacementToGroup(ghost.root, placement, ghost.widthCm);
    ghost.root.visible = true;
  }

'''
scene = scene[:start] + new_ghost_block + scene[end:]

# 3) Centralize normal module rendering. Ghost generation reuses this exact factory.
build_anchor = '  function buildWall(modules, { resetView = true } = {}) {'
idx = scene.find(build_anchor)
if idx < 0:
    raise SystemExit('scene3d.js: buildWall anchor not found')

render_factory = r'''  function createRenderableModule(moduleState, moduleIndex, onSurfaceReady = null) {
    if (moduleState.type === 'separator') {
      return createSeparatorModule(moduleState, moduleIndex);
    }
    if (moduleState.type === 'base-wall') {
      return createBaseWallModule(moduleState, moduleIndex, onSurfaceReady);
    }
    if (moduleState.type === 'base') {
      return createBaseModule(moduleState, moduleIndex, onSurfaceReady);
    }
    if (moduleState.type === 'counter') {
      return createCounterModule(moduleState, moduleIndex, onSurfaceReady);
    }
    if (moduleState.type === 'sofa-set-classic') {
      return createBeigeSofaSetModule(moduleState, moduleIndex);
    }
    if (moduleState.type === 'table-chair-set-eames') {
      return createEamesTableChairSetModule(moduleState, moduleIndex);
    }
    if (moduleState.type === 'bar-stool') {
      return createBarStoolModule(moduleState, moduleIndex);
    }
    if (moduleState.type === 'mini-fridge') {
      return createMiniFridgeModule(moduleState, moduleIndex);
    }
    if (moduleState.type === 'kettle') {
      return createKettleModule(moduleState, moduleIndex);
    }
    if (moduleState.type === 'coat-rack') {
      return createCoatRackModule(moduleState, moduleIndex);
    }
    if (moduleState.type === 'indoor-plant-1') {
      return createIndoorPlantModule(moduleState, moduleIndex);
    }
    if (moduleState.type === 'tv') {
      return createTvModule(moduleState, moduleIndex);
    }
    if (moduleState.type === 'led-floodlight') {
      return createLedFloodlightModule(moduleState, moduleIndex);
    }
    if (moduleState.type === 'shelf') {
      return createShelfModule(moduleState, moduleIndex, onSurfaceReady);
    }
    if (moduleState.type === 'door') {
      return createDoorModule(moduleState, moduleIndex, onSurfaceReady);
    }
    if (moduleState.type === 'showcase-2' || moduleState.type === 'showcase-3') {
      return createShowcaseModule(moduleState, moduleIndex, onSurfaceReady);
    }
    if (moduleState.type === 'flat-panel') {
      return createFlatPanelModule(moduleState, moduleIndex, onSurfaceReady);
    }
    return null;
  }

'''
scene = scene[:idx] + render_factory + scene[idx:]

pattern = re.compile(
    r"    modules\.forEach\(\(moduleState, moduleIndex\) => \{\n"
    r"      let module;\n"
    r"      if \(moduleState\.type === 'separator'\) \{.*?"
    r"      \} else \{\n"
    r"        console\.warn\('Desteklenmeyen modül tipi atlandı:', moduleState\.type, moduleState\.id\);\n"
    r"        return;\n"
    r"      \}\n\n"
    r"      const widthCm = Number\(moduleState\.widthCm\);",
    re.S,
)
replacement = r'''    modules.forEach((moduleState, moduleIndex) => {
      const module = createRenderableModule(
        moduleState,
        moduleIndex,
        (surface) => applyStoredImage(surface),
      );
      if (!module) {
        console.warn('Desteklenmeyen modül tipi atlandı:', moduleState.type, moduleState.id);
        return;
      }

      const widthCm = Number(moduleState.widthCm);'''
scene, count = pattern.subn(replacement, scene, count=1)
if count != 1:
    raise SystemExit(f'scene3d.js: buildWall routing replacement count {count}')

scene_path.write_text(scene, encoding='utf-8')

# 4) Update old tests that explicitly required special-case ghost renderers.
behavior_test_path = Path('tests/moduleBehavior.test.js')
behavior_test = behavior_test_path.read_text(encoding='utf-8')
behavior_start = behavior_test.find("test('ghost behavior is part of the central module contract'")
if behavior_start < 0:
    raise SystemExit('tests/moduleBehavior.test.js: ghost contract anchor not found')
behavior_test = behavior_test[:behavior_start] + r'''test('ghost behavior is one central silhouette contract for every module', () => {
  const expected = {
    kind: 'silhouette', renderer: 'module-silhouette', opacity: 0.38,
  };
  for (const type of ['bar-stool', 'table-chair-set-eames', 'sofa-set-classic', 'tv', 'future-module']) {
    assert.deepEqual(getModuleGhostBehavior({ type }), expected);
  }
});
'''
behavior_test_path.write_text(behavior_test, encoding='utf-8')

tv_test_path = Path('test/tv42Module.test.js')
tv_test = tv_test_path.read_text(encoding='utf-8')
tv_test, tv_contract_count = re.subn(
    r"test\('TV ghost geometry reads each TV state screen dimensions instead of hard-coding 42 inch', \(\) => \{.*?\n\}\);\n\n"
    r"test\('TV module has explicit ghost behavior contract', \(\) => \{.*?\n\}\);\n",
    r'''test('TV uses the central silhouette ghost contract', () => {
  assert.deepEqual(getModuleGhostBehavior({ type: 'tv' }), {
    kind: 'silhouette',
    renderer: 'module-silhouette',
    opacity: 0.38,
  });
});
''',
    tv_test,
    count=1,
    flags=re.S,
)
if tv_contract_count != 1:
    raise SystemExit(f'test/tv42Module.test.js: ghost contract replacement count {tv_contract_count}')
if tv_test.count("  assert.equal(behavior.renderer, 'tv');\n") != 1:
    raise SystemExit('test/tv42Module.test.js: wall overlay ghost assertion anchor mismatch')
tv_test = tv_test.replace(
    "  assert.equal(behavior.renderer, 'tv');\n",
    "  assert.equal(behavior.renderer, 'module-silhouette');\n",
    1,
)
tv_test_path.write_text(tv_test, encoding='utf-8')

# 5) Regression contract: exact model geometry, one textureless material, one active ghost object.
Path('test/globalSilhouetteGhost.test.js').write_text(r'''import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MODULE_CATALOG } from '../src/catalog.js';
import { getModuleGhostBehavior } from '../src/moduleBehavior.js';

test('every current and future module inherits the lightweight silhouette ghost rule', () => {
  const expected = { kind: 'silhouette', renderer: 'module-silhouette', opacity: 0.38 };
  assert.deepEqual(getModuleGhostBehavior('future-module-without-explicit-ghost'), expected);
  for (const module of Object.values(MODULE_CATALOG)) {
    assert.deepEqual(getModuleGhostBehavior(module), expected);
  }
});

test('scene ghost reuses normal module geometry and one textureless basic material', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /function createRenderableModule\(moduleState, moduleIndex, onSurfaceReady = null\)/);
  assert.match(scene, /const built = createRenderableModule\(moduleOrWidthCm, -1, null\)/);
  assert.match(scene, /new THREE\.MeshBasicMaterial\(\{[\s\S]*?transparent: true,[\s\S]*?depthWrite: false,[\s\S]*?depthTest: false,[\s\S]*?toneMapped: false,[\s\S]*?fog: false/);
  assert.match(scene, /object\.material = ghostMaterial/);
  assert.match(scene, /object\.castShadow = false/);
  assert.match(scene, /object\.receiveShadow = false/);
  assert.match(scene, /object\.raycast = \(\) => \{\}/);
  assert.match(scene, /object\.isLight[\s\S]*?object\.visible = false/);
  assert.match(scene, /object\.add = \(\.\.\.children\) =>/);
  assert.doesNotMatch(scene, /ghostBehavior\.renderer ===/);
});

test('placement ghost is a singleton instead of a per-model cache', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.doesNotMatch(scene, /placementGhostTemplates/);
  assert.match(scene, /if \(placementGhost\?\.key === key\) return placementGhost/);
  assert.match(scene, /destroyPlacementGhost\(\);\n    placementGhost = createPlacementGhost/);
  assert.match(scene, /function disposePlacementGhost\(\) \{\n    if \(!placementGhost\) return;\n    placementGhost\.root\.visible = false/);
});
''', encoding='utf-8')

print('Global singleton silhouette ghost rule applied.')
