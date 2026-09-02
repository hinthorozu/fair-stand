import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import { createTvModuleState } from '../src/designState.js';
import { getTvDefinition, TV_42_BASE } from '../src/tvConfig.js';
import { getModuleBehavior, getModuleGhostBehavior, isWallOverlayModule } from '../src/moduleBehavior.js';

test('TV 42 catalog and state use one shared 93.0 x 52.3 screen', () => {
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

test('TV uses the central silhouette ghost contract', () => {
  assert.deepEqual(getModuleGhostBehavior({ type: 'tv' }), {
    kind: 'silhouette',
    renderer: 'module-silhouette',
    opacity: 0.38,
  });
});

test('TV renderer is one 5 cm BoxGeometry with the supplied image only on its front face', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const start = source.indexOf('function createTvModule(');
  assert.ok(start >= 0);
  const finish = source.indexOf('\n}', start) + 2;
  const tvSource = source.slice(start, finish);
  assert.match(tvSource, /const depthM = Number\(moduleState\.depthCm \|\| 5\) \/ 100/);
  assert.match(tvSource, /new THREE\.BoxGeometry\(widthM, heightM, depthM\)/);
  assert.match(tvSource, /createTvScreenTexture\(\)/);
  assert.doesNotMatch(tvSource, /getTvScreenTexture\(\)\.clone\(\)/);
  assert.match(tvSource, /map: screenTexture/);
  assert.doesNotMatch(tvSource, /createSelectionFrame\(widthM, heightM\)/);
  assert.match(tvSource, /wallFrontM = STAND_DIMENSIONS\.depth \/ 2 \+ 0\.0015/);
  assert.match(tvSource, /wallFrontM \+ depthM \/ 2 \+ 0\.003/);
  assert.doesNotMatch(tvSource, /tv\.userData\.selectionFrame/);
  assert.doesNotMatch(tvSource, /new THREE\.PlaneGeometry/);
});


test('module selection frame honors renderer-provided local bounds', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const start = source.indexOf('function ensureModuleSelectionFrame');
  const finish = source.indexOf('\n  function setModuleSelectionVisual', start);
  assert.ok(start >= 0 && finish > start);
  const selectionSource = source.slice(start, finish);
  assert.match(selectionSource, /moduleGroup\.userData\?\.selectionBounds/);
  assert.match(selectionSource, /selectionBounds\?\.widthM/);
  assert.match(selectionSource, /selectionBounds\?\.heightM/);
  assert.match(selectionSource, /selectionBounds\?\.depthM/);
  assert.match(selectionSource, /Number\.isFinite\(centerY\) \? centerY : heightM \/ 2/);
});

test('TV 42 55 and 65 selection bounds follow the real rendered screen box', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const start = source.indexOf('function createTvModule(');
  assert.ok(start >= 0);
  const finish = source.indexOf('\n}', start) + 2;
  const tvSource = source.slice(start, finish);

  assert.match(tvSource, /const widthM = Number\(moduleState\.screenWidthCm \|\| 93\) \/ 100/);
  assert.match(tvSource, /const heightM = Number\(moduleState\.screenHeightCm \|\| 52\.3\) \/ 100/);
  assert.match(tvSource, /group\.userData\.selectionBounds = Object\.freeze\(\{/);
  assert.match(tvSource, /widthM,\s+heightM,\s+depthM,/);
  assert.match(tvSource, /centerX: tv\.position\.x/);
  assert.match(tvSource, /centerY: tv\.position\.y/);
  assert.match(tvSource, /centerZ: tv\.position\.z/);

  const expected = {
    42: [0.93, 0.523],
    55: [1.218, 0.685],
    65: [1.439, 0.809],
  };
  for (const sizeInch of [42, 55, 65]) {
    const state = createTvModuleState(sizeInch);
    assert.deepEqual(
      [state.screenWidthCm / 100, state.screenHeightCm / 100],
      expected[sizeInch],
    );
  }
});

test('scene keeps the shared textureLoader for normal panel images', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const sceneStart = source.indexOf('export function createStandScene');
  const surfaceStart = source.indexOf('let surfaceMeshes', sceneStart);
  const setupSource = source.slice(sceneStart, surfaceStart);
  assert.match(setupSource, /const textureLoader = new THREE\.TextureLoader\(\)/);
});

test('TV texture loads from a real public JPEG asset', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /load\(import\.meta\.env\.BASE_URL \+ 'tv-screen\.jpg'\)/);
  assert.match(source, /texture\.colorSpace = THREE\.SRGBColorSpace/);
  assert.doesNotMatch(source, /atob\(/);
  assert.doesNotMatch(source, /TV_SCREEN_DATA_URL/);
  assert.equal(fs.existsSync(new URL('../public/tv-screen.jpg', import.meta.url)), true);
});

test('TV 42 does not inherit flat panel state', () => {
  const tv = createTvModuleState(42);
  assert.equal(tv.type, 'tv');
  assert.equal(tv.widthCm, 100);
  assert.equal(tv.screenWidthCm, 93);
  assert.equal(tv.screenHeightCm, 52.3);
  assert.equal('strips' in tv, false);
  assert.equal('faces' in tv, false);
});


test('TV uses the public JPEG asset and no GLB or inline data module', () => {
  assert.equal(fs.existsSync(new URL('../public/models/tv.glb', import.meta.url)), false);
  assert.equal(fs.existsSync(new URL('../src/tvScreenImage.js', import.meta.url)), false);
  assert.equal(fs.existsSync(new URL('../public/tv-screen.jpg', import.meta.url)), true);
});

test('TV is a non-colliding wall overlay accessory', () => {
  const behavior = getModuleBehavior({ type: 'tv' });
  assert.equal(behavior.placement, 'wall-overlay');
  assert.equal(behavior.collision, 'none');
  assert.equal(behavior.allowSideInsert, false);
  assert.equal(isWallOverlayModule({ type: 'tv' }), true);
});


test('TV wall overlay drag snaps horizontal and height movement to 10 cm', () => {
  const behavior = getModuleGhostBehavior({ type: 'tv' });
  assert.equal(behavior.renderer, 'module-silhouette');
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /function getWallOverlayDragPoint/);
  assert.match(source, /Math\.round\(rawOffsetCm \/ 10\) \* 10/);
  assert.match(source, /snap: \{ mode: 'wall-overlay'/);
});

test('TV catalog preview uses a dedicated TV silhouette instead of panel strips', () => {
  const source = fs.readFileSync(new URL('../src/moduleDragSidebar.js', import.meta.url), 'utf8');
  assert.match(source, /module-drag-tv/);
  assert.match(source, /module\.type === 'tv'/);
  assert.match(source, /body\.className = 'module-drag-tv'/);
});
