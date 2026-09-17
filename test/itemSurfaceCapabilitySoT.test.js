import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { getItem, listRegisteredItems } from '../src/items.js';
import {
  getItemSurfaceCapabilities,
  itemSurfaceAcceptsImage,
} from '../src/itemCapabilities.js';

const IMAGE_CAPABLE_TYPES = new Set([
  'door-leaf',
  'flat-panel',
  'base',
  'counter',
  'door',
  'showcase-2',
  'showcase-3',
]);

const COLOR_AND_IMAGE = Object.freeze({
  color: true,
  image: true,
  glass: false,
  lightbox: false,
  mesh: false,
});

const NO_SURFACE = Object.freeze({
  color: false,
  image: false,
  glass: false,
  lightbox: false,
  mesh: false,
});

test('itemCapabilities image flag matches production mesh families after compatibility mapping', () => {
  const byType = new Map();
  for (const item of listRegisteredItems()) {
    const capabilities = getItemSurfaceCapabilities(item);
    const expected = IMAGE_CAPABLE_TYPES.has(item.type) ? COLOR_AND_IMAGE : NO_SURFACE;
    assert.deepEqual(capabilities, expected, item.itemKey);
    assert.equal(itemSurfaceAcceptsImage(item), IMAGE_CAPABLE_TYPES.has(item.type), item.itemKey);
    byType.set(item.type, capabilities.image);
  }

  assert.equal(byType.get('door-leaf'), true);
  assert.equal(byType.get('flat-panel'), true);
  assert.equal(byType.get('base'), true);
  assert.equal(byType.get('counter'), true);
  assert.equal(byType.get('door'), true);
  assert.equal(byType.get('showcase-2'), true);
  assert.equal(byType.get('showcase-3'), true);
  assert.equal(byType.get('panel'), false);
  assert.equal(byType.get('showcase-board'), false);
  assert.equal(byType.get('separator'), false);
  assert.equal(byType.get('tv'), false);
});

test('scene3d derives mesh acceptsImage from itemCapabilities instead of hardcoded true', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  assert.doesNotMatch(scene, /acceptsImage:\s*true/);
  assert.match(scene, /acceptsImage: itemSurfaceAcceptsImage\(moduleState\.itemKey\)/);
  assert.match(scene, /acceptsImage: doorLeafCapabilities\.image/);
  assert.match(scene, /acceptsImage: itemSurfaceAcceptsImage\(bodyDefinition\.sideItem\)/);
  assert.match(scene, /tv\.userData\.acceptsImage = itemSurfaceAcceptsImage\(moduleState\.itemKey\)/);
  assert.equal(itemSurfaceAcceptsImage(getItem('wall_100')), true);
  assert.equal(itemSurfaceAcceptsImage(getItem('BASE_100')), true);
  assert.equal(itemSurfaceAcceptsImage(getItem('desk_banko_100')), true);
  assert.equal(itemSurfaceAcceptsImage(getItem('door_100')), true);
  assert.equal(itemSurfaceAcceptsImage(getItem('wall_showcase_100_2')), true);
  assert.equal(itemSurfaceAcceptsImage(getItem('showcase_side_94_6_30')), false);
  assert.equal(itemSurfaceAcceptsImage(getItem('TV_42')), false);
  assert.equal(itemSurfaceAcceptsImage(getItem('wall_separator_100')), false);
});
