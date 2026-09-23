import test from 'node:test';
import assert from 'node:assert/strict';

import { getItem, getItemSnapSpec, itemProvidesSnapRule, SNAP_EDGES, SNAP_FACES, resolveItemDefaultZCm } from '../src/items.js';
import {
  listVirtualShelfRailHeightsCm,
  resolveVirtualTopRailZCm,
  snapPlacementToItemAnchor,
} from '../src/itemSnap.js';
import { createModuleStateFromCatalogKey } from '../src/designState.js';
import { usesPanelSeamOverlaySnap, isTopPlacementModule } from '../src/moduleBehavior.js';

test('snap capability enums and floodlight/shelf requires from Item', () => {
  assert.ok(SNAP_FACES.includes('front'));
  assert.ok(SNAP_EDGES.includes('top'));
  assert.equal(getItemSnapSpec('led_floodlight')?.requires, 'top-rail');
  assert.equal(getItem('led_floodlight').snapRequires, 'top-rail');
  assert.equal(getItem('profile_190').snapProvides, undefined);
  assert.equal(itemProvidesSnapRule('profile_190', { requires: 'top-rail', requiresRuleId: 1 }), true);
  assert.equal(getItem('panel_197').snapProvides, undefined);
  assert.equal(itemProvidesSnapRule('panel_197', { requires: 'shelf-rail', requiresRuleId: 2 }), true);
  assert.equal(getItemSnapSpec('shelf_100')?.requires, 'shelf-rail');
  assert.equal(getItemSnapSpec('shelf_100')?.face, 'front');
  assert.equal(getItemSnapSpec('shelf_100')?.edge, 'top');
  assert.equal(getItemSnapSpec('wall_200'), null);
  assert.equal(usesPanelSeamOverlaySnap('shelf_100'), true);
  assert.equal(isTopPlacementModule('led_floodlight'), true);
});

test('floodlight snaps Z to nearest top-rail provider, not a 350 literal', () => {
  const light = createModuleStateFromCatalogKey('led_floodlight');
  const profile = createModuleStateFromCatalogKey('profile_190');
  profile.id = 'profile-a';
  profile.placement = { xCm: 100, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' };
  // Free profile uses its own box: defaultZ is applied at drop; here zCm is base of bar.
  profile.placement.zCm = resolveItemDefaultZCm('profile_190');
  const placement = {
    xCm: 120,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  };
  const snapped = snapPlacementToItemAnchor(light, placement, [profile]);
  assert.equal(snapped.zCm, Number(profile.placement.zCm) + Number(profile.heightCm));
  assert.equal(snapPlacementToItemAnchor(light, placement, []), null);
});

test('wall recipe host top-rail Z uses profile defaultZ + height (not only AABB guess)', () => {
  const light = createModuleStateFromCatalogKey('led_floodlight');
  const wall = createModuleStateFromCatalogKey('wall_200');
  wall.id = 'wall-a';
  wall.placement = { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' };
  const placement = { xCm: 50, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' };
  const snapped = snapPlacementToItemAnchor(light, placement, [wall]);
  assert.ok(snapped);
  const profile = getItem('profile_190');
  const expected = resolveVirtualTopRailZCm(wall, profile);
  assert.equal(snapped.zCm, expected);
  assert.equal(
    expected,
    resolveItemDefaultZCm(profile) + Number(profile.sceneDimensions?.heightCm ?? profile.dimensions.heightCm),
  );
});

test('shelf-rail on wall picks panel band seam, not wall box top', () => {
  const shelf = createModuleStateFromCatalogKey('shelf_100');
  const wall = createModuleStateFromCatalogKey('wall_200');
  wall.id = 'wall-a';
  wall.placement = { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' };
  const seams = listVirtualShelfRailHeightsCm(wall);
  assert.ok(seams.length >= 1);
  assert.ok(!seams.includes(Number(wall.heightCm)));
  const placement = { xCm: 50, yCm: 0, zCm: 110, rotationZDeg: 0, wallId: 'back' };
  const snapped = snapPlacementToItemAnchor(shelf, placement, [wall]);
  assert.ok(snapped);
  assert.equal(snapped.zCm, 100);
  assert.notEqual(snapped.zCm, Number(wall.placement.zCm) + Number(wall.heightCm));
});

test('short-up wall top-rail stays inside host span via virtual profile rail', () => {
  const light = createModuleStateFromCatalogKey('led_floodlight');
  const wall = createModuleStateFromCatalogKey('wall_200_short_up_2');
  wall.id = 'wall-short';
  wall.placement = {
    xCm: 0,
    yCm: 0,
    zCm: resolveItemDefaultZCm('wall_200_short_up_2'),
    rotationZDeg: 0,
    wallId: 'back',
  };
  const placement = { xCm: 40, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' };
  const snapped = snapPlacementToItemAnchor(light, placement, [wall]);
  assert.ok(snapped);
  const hostBottom = Number(wall.placement.zCm);
  const hostTop = hostBottom + Number(wall.heightCm);
  assert.ok(snapped.zCm >= hostBottom - 0.5);
  assert.ok(snapped.zCm <= hostTop + 0.5);
});
