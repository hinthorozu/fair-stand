import test from 'node:test';
import assert from 'node:assert/strict';

import { MODULE_CATALOG, MODULE_CATALOG_GROUPS, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import { createModuleStateFromDescriptor } from '../src/designState.js';
import { resolveItemBom } from '../src/itemBom.js';
import { isShortUpFamilyDescriptor } from '../src/items.js';
import { getModuleMagneticSnapStrategy, requiresShortUpJointSnap } from '../src/moduleBehavior.js';
import { resolveModuleContract } from '../src/moduleContracts.js';
import { snapPlacementToModules } from '../src/modulePlacement.js';
import { getExpandedStraightWallRecipe } from '../src/moduleRecipes.js';

const SHORT_UP_KEYS = [
  'wall_200_short_up_2',
  'wall_150_short_up_2',
  'wall_100_short_up_2',
  'wall_50_short_up_2',
  'wall_200_short_up_1',
  'wall_150_short_up_1',
  'wall_100_short_up_1',
  'wall_50_short_up_1',
];

test('Panel Ek Modül holds short-up family and field upright_346_5', () => {
  const panelWall = MODULE_CATALOG_GROUPS.find((group) => group.label === 'Panel & Duvar');
  const extraPanel = MODULE_CATALOG_GROUPS.find((group) => group.label === 'Panel Ek Modül');
  assert.ok(panelWall);
  assert.ok(extraPanel);
  assert.deepEqual(extraPanel.keys, [...SHORT_UP_KEYS, 'upright_346_5']);
  for (const key of SHORT_UP_KEYS) {
    assert.equal(panelWall.keys.includes(key), false);
    assert.equal(MODULE_CATALOG_KEYS.includes(key), true);
  }
  assert.equal(panelWall.keys.includes('wall_200'), true);
  assert.equal(panelWall.keys.includes('upright_346_5'), false);
});

test('field upright_346_5 is self BOM ×1 and does not change parent wall recipe ×2', () => {
  assert.equal(MODULE_CATALOG.upright_346_5.itemKey, 'upright_346_5');
  assert.equal(MODULE_CATALOG.upright_346_5.type, 'upright');
  assert.equal(MODULE_CATALOG.upright_346_5.widthCm, 8);
  assert.equal(MODULE_CATALOG.upright_346_5.depthCm, 8);
  assert.equal(MODULE_CATALOG.upright_346_5.heightCm, 346.5);
  assert.equal(resolveModuleContract('upright_346_5').bom.mode, 'self');
  const bom = resolveItemBom('upright_346_5');
  assert.equal(bom.length, 1);
  assert.equal(bom[0].itemKey, 'upright_346_5');
  assert.equal(bom[0].quantity, 1);
  assert.equal(bom[0].unit, 'adet');
  const parent = getExpandedStraightWallRecipe(200).items.find((item) => item.itemKey === 'upright_346_5');
  assert.equal(parent.quantity, 2);
});

test('upright snaps only to short-up joints, not to düz wall_200', () => {
  const upright = createModuleStateFromDescriptor(MODULE_CATALOG.upright_346_5);
  assert.equal(upright.type, 'upright');
  assert.equal(requiresShortUpJointSnap(upright), true);
  assert.equal(getModuleMagneticSnapStrategy(upright), 'short-up-joint');

  const shortUp = {
    id: 'short-1',
    itemKey: 'wall_200_short_up_2',
    type: 'flat-panel',
    variant: 'short-up-2',
    widthCm: 200,
    placement: { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' },
  };
  const düzWall = {
    id: 'wall-1',
    itemKey: 'wall_200',
    type: 'flat-panel',
    widthCm: 200,
    placement: { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' },
  };
  assert.equal(isShortUpFamilyDescriptor(shortUp), true);
  assert.equal(isShortUpFamilyDescriptor(düzWall), false);

  const hit = snapPlacementToModules({
    moduleId: upright.id,
    moduleType: upright.type,
    itemKey: upright.itemKey,
    heightCm: upright.heightCm,
    widthCm: upright.widthCm,
    depthCm: upright.depthCm,
    pointerXCm: 0,
    pointerYCm: 0,
    rotationZDeg: 0,
    modules: [shortUp],
    standType: 'island',
    standXCm: 500,
    standYCm: 500,
  });
  assert.equal(hit?.ok, true);
  assert.equal(hit.snapKind, 'short-up-joint');
  assert.equal(hit.placement.wallId, 'free');

  const missDüz = snapPlacementToModules({
    moduleId: upright.id,
    moduleType: upright.type,
    itemKey: upright.itemKey,
    heightCm: upright.heightCm,
    widthCm: upright.widthCm,
    depthCm: upright.depthCm,
    pointerXCm: 0,
    pointerYCm: 0,
    rotationZDeg: 0,
    modules: [düzWall],
    standType: 'island',
    standXCm: 500,
    standYCm: 500,
  });
  assert.equal(missDüz, null);

  const missEmpty = snapPlacementToModules({
    moduleId: upright.id,
    moduleType: upright.type,
    itemKey: upright.itemKey,
    heightCm: upright.heightCm,
    widthCm: upright.widthCm,
    depthCm: upright.depthCm,
    pointerXCm: 250,
    pointerYCm: 250,
    rotationZDeg: 0,
    modules: [shortUp],
    standType: 'island',
    standXCm: 500,
    standYCm: 500,
  });
  assert.equal(missEmpty, null);
});

test('field upright renderer uses a square wall-depth column, not an L', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const fn = source.slice(source.indexOf('function createUprightModule'), source.indexOf('function createKettleModule'));
  assert.match(fn, /STAND_DIMENSIONS/);
  assert.match(fn, /BoxGeometry\(frameDepth, frameHeight, frameDepth\)/);
  assert.match(fn, /FRAME_COLOR/);
  assert.match(fn, /metalness: 0\.68/);
  assert.match(fn, /roughness: 0\.28/);
  assert.doesNotMatch(fn, /rotation\.y = Math\.PI \/ 2/);
  assert.doesNotMatch(fn, /postAlongWall/);
  assert.doesNotMatch(fn, /thicknessCm \/ 100/);
  assert.doesNotMatch(fn, /item\.defaultColor/);
});
