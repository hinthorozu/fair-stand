import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { getItem, listRegisteredItems } from '../src/items.js';
import {
  getItemSurfaceCapabilities,
  itemSurfaceAcceptsImage,
} from '../src/itemCapabilities.js';
import { surfaceFlagsForItem } from './itemSurfaceFlagsSeed.mjs';

test('itemCapabilities reads Item accepts* columns, not type maps', () => {
  const source = readFileSync(new URL('../src/itemCapabilities.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /ITEM_SURFACE_CAPABILITIES_BY_TYPE/);
  assert.match(source, /item\.acceptsColor === true/);
  assert.match(source, /item\.acceptsGlass === true/);

  for (const item of listRegisteredItems()) {
    const expected = surfaceFlagsForItem(item.itemKey, item.type);
    const capabilities = getItemSurfaceCapabilities(item);
    assert.equal(item.isRender, expected.isRender, item.itemKey);
    assert.deepEqual(capabilities, {
      color: expected.acceptsColor,
      image: expected.acceptsImage,
      glass: expected.acceptsGlass,
      lightbox: expected.acceptsLightbox,
      mesh: expected.acceptsMesh,
    }, item.itemKey);
    assert.equal(itemSurfaceAcceptsImage(item), expected.acceptsImage, item.itemKey);
  }

  assert.equal(itemSurfaceAcceptsImage(getItem('wall_100')), true);
  assert.equal(getItemSurfaceCapabilities(getItem('wall_100')).glass, true);
  assert.equal(itemSurfaceAcceptsImage(getItem('desk_banko_100')), true);
  assert.equal(getItemSurfaceCapabilities(getItem('desk_banko_100')).glass, false);
  assert.equal(itemSurfaceAcceptsImage(getItem('showcase_side_94_6_30')), false);
  assert.equal(itemSurfaceAcceptsImage(getItem('tv_42')), false);
  assert.equal(getItemSurfaceCapabilities(getItem('connector_start')).color, false);
  assert.equal(getItemSurfaceCapabilities(getItem('door_leaf_100')).image, true);
  assert.equal(getItemSurfaceCapabilities(getItem('door_leaf_100')).glass, false);
});

test('scene3d binds mesh accepts* from item capabilities', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  assert.match(scene, /surfaceCapabilityUserData\(moduleState\.itemKey\)/);
  assert.match(scene, /surfaceCapabilityUserData\(doorLeafItem\)/);
  assert.match(scene, /acceptsGlass === true/);
  assert.doesNotMatch(scene, /const supportsGlass = surface\?\.userData\.selectionMode === 'panel'/);
});
