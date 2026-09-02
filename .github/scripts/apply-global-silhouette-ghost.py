from pathlib import Path
import re


def replace_exact(path, old, new, count=1):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    found = text.count(old)
    if found != count:
        raise SystemExit(f'{path}: expected {count} occurrences, found {found}: {old!r}')
    p.write_text(text.replace(old, new, count), encoding='utf-8')


def regex_replace_exact(path, pattern, replacement, count=1, flags=0):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    new_text, found = re.subn(pattern, replacement, text, count=count, flags=flags)
    if found != count:
        raise SystemExit(f'{path}: expected {count} regex matches, found {found}: {pattern!r}')
    p.write_text(new_text, encoding='utf-8')


# 1) Central contract: every module, including future module types, inherits a real-shape silhouette ghost.
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

# 2) Keep reusable silhouette templates parented to the scene so async GLB loaders can finish safely.
old_state = "  let placementGhost = null;\n  let dragSession = null;"
new_state = "  let placementGhost = null;\n  const placementGhostTemplates = new Map();\n  const placementGhostTemplateRoot = new THREE.Group();\n  placementGhostTemplateRoot.name = 'placement-ghost-templates';\n  scene.add(placementGhostTemplateRoot);\n  let dragSession = null;"
if scene.count(old_state) != 1:
    raise SystemExit('scene3d.js: placement ghost state anchor mismatch')
scene = scene.replace(old_state, new_state, 1)

# 3) Replace all per-module ghost renderers and the generic box fallback with one central silhouette factory.
start = scene.find('  function disposePlacementGhost() {')
end = scene.find('  function disposeDragBadge() {', start)
if start < 0 or end < 0:
    raise SystemExit('scene3d.js: ghost block anchors not found')

new_ghost_block = r'''  function disposePlacementGhost() {
    if (!placementGhost) return;
    placementGhost.root.visible = false;
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

    if (object.isLight || object.isLine || object.isLineSegments || object.isPoints || object.isSprite || object.userData?.isModuleSelectionVisual) {
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
    const ghostMaterial = createSilhouetteGhostMaterial(opacity);
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(
        Math.max(dimensions.widthCm / 100, 0.02),
        dimensions.heightM,
        dimensions.depthM,
      ),
      ghostMaterial,
    );
    mesh.position.y = dimensions.heightM / 2;
    mesh.renderOrder = 10000;
    mesh.raycast = () => {};
    root.add(mesh);
    root.visible = false;
    placementGhostTemplateRoot.add(root);
    return {
      root,
      mesh,
      tintMaterials: [ghostMaterial],
      key,
      widthCm: dimensions.widthCm,
      colorHex: PLACEMENT_VALID_COLOR,
      isFallback: true,
    };
  }

  function createPlacementGhostTemplate(moduleOrWidthCm, dimensions, key, ghostBehavior) {
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

    const ghostMaterial = createSilhouetteGhostMaterial(ghostBehavior.opacity);
    preparePlacementGhostTree(root, ghostMaterial);
    placementGhostTemplateRoot.add(root);

    return {
      root,
      mesh: null,
      tintMaterials: [ghostMaterial],
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

    disposePlacementGhost();
    let template = placementGhostTemplates.get(key);
    if (!template) {
      template = createPlacementGhostTemplate(moduleOrWidthCm, dimensions, key, ghostBehavior);
      placementGhostTemplates.set(key, template);
    }
    placementGhost = template;
    return placementGhost;
  }

  function showPlacementGhost(moduleOrWidthCm, placement, valid) {
    const ghost = ensurePlacementGhost(moduleOrWidthCm);
    const colorHex = valid ? PLACEMENT_VALID_COLOR : PLACEMENT_INVALID_COLOR;
    ghost.colorHex = colorHex;
    ghost.tintMaterials?.forEach((material) => material.color?.setHex(colorHex));
    if (moduleOrWidthCm && typeof moduleOrWidthCm === 'object') {
      ghost.root.userData.type = moduleOrWidthCm.type ?? ghost.root.userData.type;
    }
    applyPlacementToGroup(ghost.root, placement, ghost.widthCm);
    ghost.root.visible = true;
  }

'''
scene = scene[:start] + new_ghost_block + scene[end:]

# 4) Centralize normal module rendering. The ghost factory reuses this same function,
# so future module types need only one renderer route, not a second ghost implementation.
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

# Replace the duplicated routing chain inside buildWall with the central renderer.
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

# 5) Regression contract for all current and future modules.
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

test('scene ghost uses the normal module renderer and one textureless basic material', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /function createRenderableModule\(moduleState, moduleIndex, onSurfaceReady = null\)/);
  assert.match(scene, /const built = createRenderableModule\(moduleOrWidthCm, -1, null\)/);
  assert.match(scene, /const placementGhostTemplates = new Map\(\)/);
  assert.match(scene, /new THREE\.MeshBasicMaterial\(\{[\s\S]*?transparent: true,[\s\S]*?depthWrite: false,[\s\S]*?depthTest: false,[\s\S]*?toneMapped: false,[\s\S]*?fog: false/);
  assert.match(scene, /object\.material = ghostMaterial/);
  assert.match(scene, /object\.castShadow = false/);
  assert.match(scene, /object\.receiveShadow = false/);
  assert.match(scene, /object\.add = \(\.\.\.children\) =>/);
  assert.doesNotMatch(scene, /ghostBehavior\.renderer === 'sofa-set-classic'/);
  assert.doesNotMatch(scene, /ghostBehavior\.renderer === 'table-chair-set-eames'/);
  assert.doesNotMatch(scene, /ghostBehavior\.renderer === 'bar-stool'/);
  assert.doesNotMatch(scene, /ghostBehavior\.renderer === 'tv'/);
});

test('inactive silhouette templates stay cached instead of being rebuilt on every pointer move', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /placementGhostTemplates\.get\(key\)/);
  assert.match(scene, /placementGhostTemplates\.set\(key, template\)/);
  assert.match(scene, /placementGhost\.root\.visible = false/);
  assert.doesNotMatch(scene, /scene\.remove\(placementGhost\.root\)/);
});
''', encoding='utf-8')

print('Global silhouette ghost rule applied.')
