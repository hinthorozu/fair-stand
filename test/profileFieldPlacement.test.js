import test from 'node:test';
import assert from 'node:assert/strict';

import { MODULE_CATALOG, MODULE_CATALOG_GROUPS, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import { createModuleStateFromDescriptor, normalizeModuleItemState } from '../src/designState.js';
import { resolveItemBom } from '../src/itemBom.js';
import { getModuleBehavior, getModuleMagneticSnapStrategy } from '../src/moduleBehavior.js';
import { resolveModuleContract } from '../src/moduleContracts.js';
import { placementsOverlap, snapPlacementToModules } from '../src/modulePlacement.js';
import { getExpandedStraightWallRecipe } from '../src/moduleRecipes.js';
import { getProductionItem } from '../src/productionParts.js';

const PROFILE_KEYS = ['profile_190', 'profile_140_5', 'profile_91', 'profile_41_5'];

test('Panel Ek Modül holds field profiles after upright_346_5', () => {
  const extraPanel = MODULE_CATALOG_GROUPS.find((group) => group.label === 'Panel Ek Modül');
  assert.ok(extraPanel);
  for (const key of PROFILE_KEYS) {
    assert.equal(extraPanel.keys.includes(key), true);
    assert.equal(MODULE_CATALOG_KEYS.includes(key), true);
    assert.equal(MODULE_CATALOG[key].type, 'profile');
  }
});

test('field profiles are self BOM ×1 and do not change parent wall recipe ×2', () => {
  assert.equal(MODULE_CATALOG.profile_190.widthCm, 200);
  assert.equal(MODULE_CATALOG.profile_140_5.widthCm, 150);
  assert.equal(MODULE_CATALOG.profile_91.widthCm, 100);
  assert.equal(MODULE_CATALOG.profile_41_5.widthCm, 50);
  assert.equal(MODULE_CATALOG.profile_190.depthCm, 8);
  assert.equal(MODULE_CATALOG.profile_190.heightCm, 8);
  assert.equal(resolveModuleContract('profile_190').bom.mode, 'self');
  const bom = resolveItemBom('profile_190');
  assert.equal(bom.length, 1);
  assert.equal(bom[0].itemKey, 'profile_190');
  assert.equal(bom[0].quantity, 1);
  assert.equal(bom[0].unit, 'adet');
  const parent = getExpandedStraightWallRecipe(200).items.find((item) => item.itemKey === 'profile_190');
  assert.equal(parent.quantity, 2);
  assert.equal(getProductionItem('profile_190').dimensions.lengthCm, 190);
  assert.equal(getProductionItem('profile_140_5').dimensions.lengthCm, 140.5);
  assert.equal(getProductionItem('profile_91').dimensions.lengthCm, 91);
  assert.equal(getProductionItem('profile_41_5').dimensions.lengthCm, 41.5);
});

test('profile uses wall_200 move/rotate/snap contract and does not nest into a neighbor wall', () => {
  const profile = createModuleStateFromDescriptor(MODULE_CATALOG.profile_190);
  const behavior = getModuleBehavior(profile);
  assert.equal(profile.type, 'profile');
  assert.equal(profile.widthCm, 200);
  assert.equal(profile.heightCm, 350);
  assert.equal(behavior.placement, 'wall');
  assert.equal(behavior.magneticSnap, 'standard');
  assert.equal(behavior.collision, 'segment');
  assert.equal(behavior.moveSnapCm, 50);
  assert.equal(behavior.rotationStepDeg, 90);
  assert.equal(getModuleMagneticSnapStrategy(profile), 'standard');
  assert.deepEqual(behavior.overlapWithTypes, ['separator']);

  const düzWall = {
    id: 'wall-1',
    itemKey: 'wall_200',
    type: 'flat-panel',
    widthCm: 200,
    placement: { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' },
  };
  const neighborProfile = {
    id: 'profile-1',
    itemKey: 'profile_190',
    type: 'profile',
    widthCm: 200,
    placement: { xCm: 200, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' },
  };

  const hit = snapPlacementToModules({
    moduleId: profile.id,
    moduleType: profile.type,
    itemKey: profile.itemKey,
    heightCm: profile.heightCm,
    widthCm: profile.widthCm,
    depthCm: profile.depthCm,
    pointerXCm: 298,
    pointerYCm: 2,
    rotationZDeg: 0,
    modules: [düzWall],
    standType: 'island',
    standXCm: 800,
    standYCm: 600,
  });
  assert.equal(hit?.ok, true);
  assert.equal(hit.snapKind, 'end-to-end');
  assert.equal(hit.placement.xCm, 200);
  assert.equal(hit.placement.yCm, 0);
  assert.equal(placementsOverlap(düzWall, neighborProfile), false);
  assert.equal(placementsOverlap(düzWall, { ...profile, placement: düzWall.placement }), true);
});

test('field profile spans the same wall slot as a separator without collision', () => {
  const profile = createModuleStateFromDescriptor(MODULE_CATALOG.profile_190);
  profile.id = 'profile-span';
  profile.placement = { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' };
  const slat = createModuleStateFromDescriptor(MODULE_CATALOG.wall_separator_100);
  slat.id = 'separator-mid';
  slat.placement = { xCm: 100, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' };
  assert.equal(slat.type, 'separator');
  assert.equal(placementsOverlap(profile, slat), false);
});

test('two field profiles snap end-to-end on the wall slot with no gap', () => {
  const first = createModuleStateFromDescriptor(MODULE_CATALOG.profile_190);
  first.id = 'profile-a';
  first.placement = { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' };
  const second = createModuleStateFromDescriptor(MODULE_CATALOG.profile_190);
  const hit = snapPlacementToModules({
    moduleId: second.id,
    moduleType: second.type,
    itemKey: second.itemKey,
    heightCm: second.heightCm,
    widthCm: second.widthCm,
    depthCm: second.depthCm,
    pointerXCm: 298,
    pointerYCm: 2,
    rotationZDeg: 0,
    modules: [first],
    standType: 'island',
    standXCm: 800,
    standYCm: 600,
  });
  assert.equal(first.widthCm, 200);
  assert.equal(second.widthCm, 200);
  assert.equal(hit?.ok, true);
  assert.equal(hit.snapKind, 'end-to-end');
  assert.equal(hit.placement.xCm, 200);
  assert.equal(hit.placement.yCm, 0);
  assert.equal(placementsOverlap(first, { ...second, placement: hit.placement }), false);

  const stale = normalizeModuleItemState({
    id: 'stale',
    itemKey: 'profile_190',
    type: 'profile',
    widthCm: 190,
    depthCm: 8,
    heightCm: 350,
  });
  assert.equal(stale.widthCm, 200);
});

test('field profile renderer is a thick top rail, not a 4mm line or a 7-strip panel', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const fn = source.slice(source.indexOf('function createProfileModule'), source.indexOf('function createKettleModule'));
  assert.match(fn, /getStraightWallNominalWidthForProfileItem/);
  assert.match(fn, /BoxGeometry\(widthM, frameDepth, frameDepth\)/);
  assert.match(fn, /frameHeight - frameDepth \/ 2/);
  assert.match(fn, /FRAME_COLOR/);
  assert.doesNotMatch(fn, /PANEL_RAIL_HEIGHT_M/);
  assert.doesNotMatch(fn, /stripCount/);
  assert.doesNotMatch(fn, /dimensions\?\.lengthCm/);
});

test('catalog preview for profile is a horizontal bar', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../src/moduleDragSidebar.js', import.meta.url), 'utf8');
  assert.match(source, /module\.type === 'profile'/);
  assert.match(source, /module-drag-profile/);
  assert.match(source, /\.module-drag-profile \{ height:12px/);
});
