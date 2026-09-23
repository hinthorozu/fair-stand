import test from 'node:test';
import assert from 'node:assert/strict';
import { getItem, resolveSceneDimensions } from '../src/items.js';

test('panel_197: W×H×D only (no legacy length/thickness fields)', () => {
  const item = getItem('panel_197');
  assert.equal(item.dimensions.widthCm, 197);
  assert.equal(item.dimensions.heightCm, 47);
  assert.equal(item.dimensions.depthCm, 0.8);
  assert.equal(Object.hasOwn(item.dimensions, 'lengthCm'), false);
  assert.equal(Object.hasOwn(item.dimensions, 'thicknessCm'), false);
  const scene = resolveSceneDimensions(item);
  assert.equal(scene.widthCm, 197);
  assert.equal(scene.heightCm, 47);
  assert.equal(scene.depthCm, 0.8);
});

test('upright_346_5: cross-section and height in W/H/D', () => {
  const item = getItem('upright_346_5');
  assert.equal(item.dimensions.widthCm, 8);
  assert.equal(item.dimensions.depthCm, 8);
  assert.equal(item.dimensions.heightCm, 346.5);
  assert.equal(item.sceneDimensions.heightCm, 346.5);
});

test('profile_190: production width in dimensions; scene strip width override', () => {
  const item = getItem('profile_190');
  assert.equal(item.dimensions.widthCm, 190);
  assert.equal(item.dimensions.depthCm, 8);
  assert.equal(item.dimensions.heightCm, 8);
  const scene = resolveSceneDimensions(item);
  assert.equal(scene.widthCm, 200);
  assert.equal(scene.depthCm, 8);
  assert.equal(scene.heightCm, 8);
});

test('shelf_100: span, depth, plank height', () => {
  const item = getItem('shelf_100');
  assert.equal(item.dimensions.widthCm, 100);
  assert.equal(item.dimensions.depthCm, 38);
  assert.equal(item.dimensions.heightCm, 1.8);
});
