import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createGroundLayout } from '../src/groundLayout.js';

test('TEST_SUPPORT helper keeps 1 metre grid cells at the default size', () => {
  const layout = createGroundLayout(5);

  assert.equal(layout.sizeM, 30);
  assert.equal(layout.divisions, 30);
  assert.equal(layout.cellSizeM, 1);
  assert.equal(layout.leftX, -5);
  assert.equal(layout.rightX, 25);
});

test('grows the ground in 10 metre steps as the wall extends', () => {
  const layout = createGroundLayout(24);

  assert.equal(layout.sizeM, 40);
  assert.equal(layout.divisions, 40);
  assert.equal(layout.cellSizeM, 1);
  assert.equal(layout.centerX, 15);
  assert.equal(layout.rightX, 35);
});

test('supports very long walls without changing grid cell size', () => {
  const layout = createGroundLayout(55);

  assert.equal(layout.sizeM, 70);
  assert.equal(layout.divisions, 70);
  assert.equal(layout.cellSizeM, 1);
  assert.ok(layout.rightX > 55);
});

test('production scene grid does not import the TEST_SUPPORT groundLayout helper', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.doesNotMatch(scene, /groundLayout/);
  assert.match(scene, /function createRectangularGrid\(/);
});
