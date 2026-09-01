import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULE_CATALOG } from '../src/catalog.js';
import { createTvModuleState } from '../src/designState.js';
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
});

test('TV module has explicit ghost behavior contract', () => {
  assert.equal(getModuleGhostBehavior({ type: 'tv' }).kind, 'real-model');
  assert.equal(getModuleGhostBehavior({ type: 'tv' }).renderer, 'tv');
});

test('TV renderer is one 5 cm BoxGeometry with the supplied image only on its front face', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const start = source.indexOf('function createTvModule(');
  assert.ok(start >= 0);
  const finish = source.indexOf('\n}', start) + 2;
  const tvSource = source.slice(start, finish);
  assert.match(tvSource, /const depthM = 0\.05/);
  assert.match(tvSource, /new THREE\.BoxGeometry\(widthM, heightM, depthM\)/);
  assert.match(tvSource, /createTvScreenTexture\(\)/);
  assert.doesNotMatch(tvSource, /getTvScreenTexture\(\)\.clone\(\)/);
  assert.match(tvSource, /map: screenTexture/);
  assert.match(tvSource, /createSelectionFrame\(widthM, heightM\)/);
  assert.match(tvSource, /wallFrontM = STAND_DIMENSIONS\.depth \/ 2 \+ 0\.0015/);
  assert.match(tvSource, /wallFrontM \+ depthM \/ 2 \+ 0\.003/);
  assert.match(tvSource, /tv\.userData\.selectionFrame = selectionFrame/);
  assert.doesNotMatch(tvSource, /new THREE\.PlaneGeometry/);
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
  assert.equal(behavior.renderer, 'tv');
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /function getWallOverlayDragPoint/);
  assert.match(source, /Math\.round\(rawOffsetCm \/ 10\) \* 10/);
  assert.match(source, /snap: \{ mode: 'wall-overlay'/);
});
