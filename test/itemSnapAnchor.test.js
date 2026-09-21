import test from 'node:test';
import assert from 'node:assert/strict';

import { getItem, getItemSnapSpec, SNAP_ANCHORS } from '../src/items.js';
import { snapPlacementToItemAnchor } from '../src/itemSnap.js';
import { createModuleStateFromCatalogKey } from '../src/designState.js';

test('snap_anchor is only top/bottom/left/right on Item, not a type map', () => {
  assert.deepEqual([...SNAP_ANCHORS].sort(), ['bottom', 'left', 'right', 'top']);
  assert.deepEqual(getItemSnapSpec('led_floodlight'), { targetItemType: 'profile', anchor: 'top' });
  assert.equal(getItem('led_floodlight').snapTargetItemType, 'profile');
  assert.equal(getItem('led_floodlight').snapAnchor, 'top');
  assert.deepEqual(getItemSnapSpec('shelf_100'), { targetItemType: 'panel', anchor: 'top' });
  assert.equal(getItemSnapSpec('wall_200'), null);
  assert.equal(getItemSnapSpec('desk_banko_100'), null);
  assert.equal(Object.hasOwn(getItem('wall_200'), 'snapAnchor'), false);
});

test('floodlight snaps Z to nearest profile top, not a 350 literal', () => {
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
