from pathlib import Path

# Shared TV definition: 42 inch is the canonical/base TV. 55/65 only override screen size metadata.
tv_config = '''export const TV_42_BASE = Object.freeze({
  type: 'tv',
  widthCm: 100,
  depthCm: 5,
  catalogHeightCm: 350,
  sizeInch: 42,
  screenWidthCm: 93.0,
  screenHeightCm: 52.3,
});

const TV_SIZE_OVERRIDES = Object.freeze({
  42: Object.freeze({}),
  55: Object.freeze({
    sizeInch: 55,
    screenWidthCm: 121.8,
    screenHeightCm: 68.5,
  }),
  65: Object.freeze({
    sizeInch: 65,
    screenWidthCm: 143.9,
    screenHeightCm: 80.9,
  }),
});

export const TV_SIZE_INCHES = Object.freeze([42, 55, 65]);

export function getTvDefinition(sizeInch = 42) {
  const override = TV_SIZE_OVERRIDES[Number(sizeInch)];
  if (!override) return null;
  return Object.freeze({ ...TV_42_BASE, ...override });
}
'''
Path('src/tvConfig.js').write_text(tv_config, encoding='utf-8')

# catalog.js
p = Path('src/catalog.js')
s = p.read_text(encoding='utf-8')
if "from './tvConfig.js'" not in s:
    s = "import { getTvDefinition } from './tvConfig.js';\n\n" + s

old = '''export const TV_42_DIMENSIONS = Object.freeze({
  moduleWidthCm: 100,
  screenWidthCm: 93.0,
  screenHeightCm: 52.3,
  heightCm: 350,
});'''
new = '''const TV_42_DEFINITION = getTvDefinition(42);
const TV_55_DEFINITION = getTvDefinition(55);
const TV_65_DEFINITION = getTvDefinition(65);

function createTvCatalogItem(definition) {
  return Object.freeze({
    type: definition.type,
    widthCm: definition.widthCm,
    depthCm: definition.depthCm,
    heightCm: definition.catalogHeightCm,
    screenWidthCm: definition.screenWidthCm,
    screenHeightCm: definition.screenHeightCm,
    sizeInch: definition.sizeInch,
    label: `TV ${definition.sizeInch}\"`,
  });
}

export const TV_42_DIMENSIONS = Object.freeze({
  moduleWidthCm: TV_42_DEFINITION.widthCm,
  screenWidthCm: TV_42_DEFINITION.screenWidthCm,
  screenHeightCm: TV_42_DEFINITION.screenHeightCm,
  heightCm: TV_42_DEFINITION.catalogHeightCm,
});'''
if old not in s:
    raise SystemExit('catalog TV_42_DIMENSIONS block not found')
s = s.replace(old, new, 1)

old = "  TV_42: { type: 'tv', widthCm: 100, heightCm: 350, screenWidthCm: 93.0, screenHeightCm: 52.3, sizeInch: 42, label: 'TV 42\"' },"
new = '''  TV_42: createTvCatalogItem(TV_42_DEFINITION),
  TV_55: createTvCatalogItem(TV_55_DEFINITION),
  TV_65: createTvCatalogItem(TV_65_DEFINITION),'''
if old not in s:
    raise SystemExit('catalog TV_42 item not found')
s = s.replace(old, new, 1)

old = "  'TV_42',\n  'LED_FLOODLIGHT',"
new = "  'TV_42',\n  'TV_55',\n  'TV_65',\n  'LED_FLOODLIGHT',"
if old not in s:
    raise SystemExit('catalog TV key block not found')
s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')

# designState.js
p = Path('src/designState.js')
s = p.read_text(encoding='utf-8')
if "from './tvConfig.js'" not in s:
    s = "import { getTvDefinition } from './tvConfig.js';\n\n" + s
old = '''export function createTvModuleState(sizeInch = 42) {
  if (Number(sizeInch) !== 42) return null;
  return {
    id: createId('module'),
    type: 'tv',
    widthCm: 100,
    depthCm: 6,
    heightCm: 52.3,
    sizeInch: 42,
    screenWidthCm: 93.0,
    screenHeightCm: 52.3,
  };
}'''
new = '''export function createTvModuleState(sizeInch = 42) {
  const definition = getTvDefinition(sizeInch);
  if (!definition) return null;
  return {
    id: createId('module'),
    type: definition.type,
    widthCm: definition.widthCm,
    depthCm: definition.depthCm,
    heightCm: definition.screenHeightCm,
    sizeInch: definition.sizeInch,
    screenWidthCm: definition.screenWidthCm,
    screenHeightCm: definition.screenHeightCm,
  };
}'''
if old not in s:
    raise SystemExit('createTvModuleState block not found')
s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')

# scene3d.js: render depth follows shared state, ghost follows each TV screen dimensions, labels are dynamic.
p = Path('src/scene3d.js')
s = p.read_text(encoding='utf-8')
s = s.replace("  const depthM = 0.05;\n", "  const depthM = Number(moduleState.depthCm || 5) / 100;\n", 1)

old = "    const key = [moduleOrWidthCm?.type ?? 'generic', dimensions.widthCm, dimensions.depthM, dimensions.heightM].join(':');"
new = "    const key = [moduleOrWidthCm?.type ?? 'generic', dimensions.widthCm, dimensions.depthM, dimensions.heightM, moduleOrWidthCm?.screenWidthCm ?? '', moduleOrWidthCm?.screenHeightCm ?? ''].join(':');"
if old not in s:
    raise SystemExit('placement ghost key not found')
s = s.replace(old, new, 1)

old = '''    if (ghostBehavior.renderer === 'tv') {
    const root = new THREE.Group();
    const ghostMaterial = new THREE.MeshBasicMaterial({
      color: PLACEMENT_VALID_COLOR,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.93, 0.523, 0.05),
      ghostMaterial,
    );
    mesh.position.set(0, 1.75, 0.055);
    mesh.renderOrder = 10000;
    root.add(mesh);

    const bezelMaterial = ghostMaterial.clone();
    bezelMaterial.opacity = 0.9;
    const bezel = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.93, 0.523, 0.05)),
      new THREE.LineBasicMaterial({
        color: PLACEMENT_VALID_COLOR,
        transparent: true,
        opacity: 0.95,
        depthTest: false,
      }),
    );
    bezel.position.copy(mesh.position);
    bezel.renderOrder = 10001;
    root.add(bezel);
    scene.add(root);

    placementGhost = {
      root,
      mesh,
      tintMaterials: [ghostMaterial],
      key,
      widthCm: dimensions.widthCm,
      ownsGeometry: true,
      colorHex: PLACEMENT_VALID_COLOR,
    };
    return placementGhost;
  }'''
new = '''    if (ghostBehavior.renderer === 'tv') {
      const tvWidthM = Math.max(Number(moduleOrWidthCm?.screenWidthCm || 93) / 100, 0.02);
      const tvHeightM = Math.max(Number(moduleOrWidthCm?.screenHeightCm || 52.3) / 100, 0.02);
      const tvDepthM = Math.max(Number(moduleOrWidthCm?.depthCm || 5) / 100, 0.02);
      const root = new THREE.Group();
      const ghostMaterial = new THREE.MeshBasicMaterial({
        color: PLACEMENT_VALID_COLOR,
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(tvWidthM, tvHeightM, tvDepthM),
        ghostMaterial,
      );
      mesh.position.set(0, 1.75, 0.055);
      mesh.renderOrder = 10000;
      root.add(mesh);

      const bezelMaterial = ghostMaterial.clone();
      bezelMaterial.opacity = 0.9;
      const bezel = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(tvWidthM, tvHeightM, tvDepthM)),
        new THREE.LineBasicMaterial({
          color: PLACEMENT_VALID_COLOR,
          transparent: true,
          opacity: 0.95,
          depthTest: false,
        }),
      );
      bezel.position.copy(mesh.position);
      bezel.renderOrder = 10001;
      root.add(bezel);
      scene.add(root);

      placementGhost = {
        root,
        mesh,
        tintMaterials: [ghostMaterial],
        key,
        widthCm: dimensions.widthCm,
        ownsGeometry: true,
        colorHex: PLACEMENT_VALID_COLOR,
      };
      return placementGhost;
    }'''
if old not in s:
    raise SystemExit('TV ghost block not found')
s = s.replace(old, new, 1)

old = "    if (moduleState?.type === 'tv') return 'TV 42\\\"';"
new = "    if (moduleState?.type === 'tv') return `TV ${Number(moduleState.sizeInch) || 42}\\\"`;"
if old not in s:
    raise SystemExit('TV drag label not found')
s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')

# main.js: one dynamic TV selection branch for the whole family.
p = Path('src/main.js')
s = p.read_text(encoding='utf-8')
old = '''      if (moduleType === 'tv') {
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · TV 42\\" · 93.0 × 52.3 cm · bağımsız GLB model.';
        return;
      }

      if (moduleType === 'tv') {
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · TV 42" · 93.0 × 52.3 cm ekran.';
        return;
      }'''
new = '''      if (moduleType === 'tv') {
        const tvState = currentModules[moduleIndex];
        const sizeInch = Number(tvState?.sizeInch) || 42;
        const screenWidthCm = Number(tvState?.screenWidthCm) || 93;
        const screenHeightCm = Number(tvState?.screenHeightCm) || 52.3;
        selectionInfo.textContent = `Modül ${moduleIndex + 1} · TV ${sizeInch}" · ${screenWidthCm} × ${screenHeightCm} cm ekran.`;
        return;
      }'''
if old not in s:
    raise SystemExit('main TV selection blocks not found')
s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')

# Tests: lock the inheritance contract and dynamic ghost sizing.
p = Path('test/tv42Module.test.js')
s = p.read_text(encoding='utf-8')
s = s.replace("import { MODULE_CATALOG } from '../src/catalog.js';", "import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';")
s = s.replace("import { createTvModuleState } from '../src/designState.js';", "import { createTvModuleState } from '../src/designState.js';\nimport { getTvDefinition, TV_42_BASE } from '../src/tvConfig.js';")
s = s.replace("  assert.equal(state.screenHeightCm, 52.3);\n});", "  assert.equal(state.screenHeightCm, 52.3);\n  assert.equal(state.depthCm, 5);\n});", 1)

insert_after = '''test('TV 42 catalog and state use one shared 93.0 x 52.3 screen', () => {
  const item = MODULE_CATALOG.TV_42;
  assert.equal(item.type, 'tv');
  assert.equal(item.screenWidthCm, 93);
  assert.equal(item.screenHeightCm, 52.3);
  const state = createTvModuleState(42);
  assert.equal(state.widthCm, 100);
  assert.equal(state.screenWidthCm, 93);
  assert.equal(state.screenHeightCm, 52.3);
  assert.equal(state.depthCm, 5);
});
'''
addition = '''

test('TV 55 and 65 inherit TV 42 and override only their screen size identity', () => {
  const expected = {
    42: [93, 52.3],
    55: [121.8, 68.5],
    65: [143.9, 80.9],
  };

  for (const sizeInch of [42, 55, 65]) {
    const definition = getTvDefinition(sizeInch);
    const item = MODULE_CATALOG[`TV_${sizeInch}`];
    const state = createTvModuleState(sizeInch);
    assert.ok(definition);
    assert.ok(item);
    assert.ok(state);
    assert.equal(definition.type, TV_42_BASE.type);
    assert.equal(definition.widthCm, TV_42_BASE.widthCm);
    assert.equal(definition.depthCm, TV_42_BASE.depthCm);
    assert.equal(definition.catalogHeightCm, TV_42_BASE.catalogHeightCm);
    assert.equal(item.type, TV_42_BASE.type);
    assert.equal(item.widthCm, TV_42_BASE.widthCm);
    assert.equal(item.depthCm, 5);
    assert.equal(state.type, TV_42_BASE.type);
    assert.equal(state.widthCm, TV_42_BASE.widthCm);
    assert.equal(state.depthCm, 5);
    assert.equal(state.sizeInch, sizeInch);
    assert.equal(state.screenWidthCm, expected[sizeInch][0]);
    assert.equal(state.screenHeightCm, expected[sizeInch][1]);
  }

  assert.ok(MODULE_CATALOG_KEYS.includes('TV_42'));
  assert.ok(MODULE_CATALOG_KEYS.includes('TV_55'));
  assert.ok(MODULE_CATALOG_KEYS.includes('TV_65'));
  assert.equal(createTvModuleState(50), null);
});
'''
if insert_after not in s:
    raise SystemExit('test insertion anchor not found')
s = s.replace(insert_after, insert_after + addition, 1)

s = s.replace("  assert.match(tvSource, /const depthM = 0\\.05/);", "  assert.match(tvSource, /const depthM = Number\\(moduleState\\.depthCm \\|\\| 5\\) \\/ 100/);")

anchor = "test('TV module has explicit ghost behavior contract', () => {\n"
ghost_test = '''test('TV ghost geometry reads each TV state screen dimensions instead of hard-coding 42 inch', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /moduleOrWidthCm\\?\\.screenWidthCm/);
  assert.match(source, /moduleOrWidthCm\\?\\.screenHeightCm/);
  assert.match(source, /new THREE\\.BoxGeometry\\(tvWidthM, tvHeightM, tvDepthM\\)/);
  assert.doesNotMatch(source, /new THREE\\.BoxGeometry\\(0\\.93, 0\\.523, 0\\.05\\)/);
});

'''
if anchor not in s:
    raise SystemExit('ghost test anchor not found')
s = s.replace(anchor, ghost_test + anchor, 1)
p.write_text(s, encoding='utf-8')
