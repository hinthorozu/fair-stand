import test from 'node:test';
import assert from 'node:assert/strict';

import { getItem, getItemSnapSpec, SNAP_EDGES, SNAP_FACES } from '../src/items.js';
import { snapPlacementToItemAnchor } from '../src/itemSnap.js';
import { createModuleStateFromCatalogKey } from '../src/designState.js';
import { usesPanelSeamOverlaySnap, isTopPlacementModule } from '../src/moduleBehavior.js';

test('snap capability enums and floodlight/shelf requires from Item', () => {
  assert.ok(SNAP_FACES.includes('front'));
  assert.ok(SNAP_EDGES.includes('top'));
  assert.equal(getItemSnapSpec('led_floodlight')?.requires, 'top-rail');
  assert.equal(getItem('led_floodlight').snapRequires, 'top-rail');
  assert.equal(getItem('profile_190').snapProvides, 'top-rail');
  assert.equal(getItem('profile_190').snapFace, 'top');
  assert.equal(getItem('panel_197').snapProvides, 'shelf-rail');
  assert.equal(getItem('panel_197').snapFace, 'front');
  assert.equal(getItemSnapSpec('shelf_100')?.requires, 'shelf-rail');
  assert.equal(getItemSnapSpec('shelf_100')?.mountMode, 'panel-seam');
  assert.equal(getItemSnapSpec('wall_200'), null);
  assert.equal(usesPanelSeamOverlaySnap('shelf_100'), true);
  assert.equal(isTopPlacementModule('led_floodlight'), true);
});

test('floodlight snaps Z to nearest top-rail provider, not a 350 literal', () => {
  const light = createModuleStateFromCatalogKey('led_floodlight');
  const profile = createModuleStateFromCatalogKey('profile_190');
  profile.id = 'profile-a';
  profile.placement = { xCm: 100, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' };
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

test('wall recipe host matches via child profile provides top-rail', () => {
  const light = createModuleStateFromCatalogKey('led_floodlight');
  const wall = createModuleStateFromCatalogKey('wall_200');
  wall.id = 'wall-a';
  wall.placement = { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' };
  const placement = { xCm: 50, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' };
  const snapped = snapPlacementToItemAnchor(light, placement, [wall]);
  assert.ok(snapped);
  assert.equal(snapped.zCm, Number(wall.placement.zCm) + Number(wall.heightCm));
});
