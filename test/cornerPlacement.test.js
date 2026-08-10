import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAdjacentPlacement } from '../src/cornerPlacement.js';

test('keeps placement on the same wall while there is enough room', () => {
  const result = resolveAdjacentPlacement({
    sourcePlacement: { xCm: 100, yCm: 0, rotationZDeg: 0, wallId: 'back' },
    sourceWidthCm: 200,
    addedWidthCm: 100,
    side: 'right',
    standType: 'u-stand',
    standXCm: 500,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.equal(result.wrapped, false);
  assert.deepEqual(result.placement, {
    xCm: 300,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
});

test('wraps from back-right corner to the right wall in U stand', () => {
  const result = resolveAdjacentPlacement({
    sourcePlacement: { xCm: 300, yCm: 0, rotationZDeg: 0, wallId: 'back' },
    sourceWidthCm: 200,
    addedWidthCm: 200,
    side: 'right',
    standType: 'u-stand',
    standXCm: 500,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.equal(result.wrapped, true);
  assert.equal(result.toWallId, 'right');
  assert.equal(result.nextSide, 'right');
  assert.deepEqual(result.placement, {
    xCm: 500,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 90,
    wallId: 'right',
  });
});

test('wraps from back-left corner to the left wall when that wall is active', () => {
  const result = resolveAdjacentPlacement({
    sourcePlacement: { xCm: 0, yCm: 0, rotationZDeg: 0, wallId: 'back' },
    sourceWidthCm: 200,
    addedWidthCm: 150,
    side: 'left',
    standType: 'l-left',
    standXCm: 500,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.equal(result.wrapped, true);
  assert.equal(result.toWallId, 'left');
  assert.equal(result.nextSide, 'right');
  assert.deepEqual(result.placement, {
    xCm: 0,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 90,
    wallId: 'left',
  });
});

test('rejects a back-right corner wrap when the stand has no right wall', () => {
  const result = resolveAdjacentPlacement({
    sourcePlacement: { xCm: 300, yCm: 0, rotationZDeg: 0, wallId: 'back' },
    sourceWidthCm: 200,
    addedWidthCm: 100,
    side: 'right',
    standType: 'l-left',
    standXCm: 500,
    standYCm: 400,
  });

  assert.equal(result.ok, false);
  assert.match(result.message, /aktif bir duvar yok/i);
});

test('wraps from the left wall back corner onto the back wall', () => {
  const result = resolveAdjacentPlacement({
    sourcePlacement: { xCm: 0, yCm: 0, rotationZDeg: 90, wallId: 'left' },
    sourceWidthCm: 200,
    addedWidthCm: 100,
    side: 'left',
    standType: 'u-stand',
    standXCm: 500,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.equal(result.toWallId, 'back');
  assert.equal(result.nextSide, 'right');
  assert.deepEqual(result.placement, {
    xCm: 0,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
});

test('wraps from the right wall back corner onto the right end of back wall', () => {
  const result = resolveAdjacentPlacement({
    sourcePlacement: { xCm: 500, yCm: 0, rotationZDeg: 90, wallId: 'right' },
    sourceWidthCm: 200,
    addedWidthCm: 100,
    side: 'left',
    standType: 'u-stand',
    standXCm: 500,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.equal(result.toWallId, 'back');
  assert.equal(result.nextSide, 'left');
  assert.deepEqual(result.placement, {
    xCm: 400,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
});

test('does not wrap through the open front edge', () => {
  const result = resolveAdjacentPlacement({
    sourcePlacement: { xCm: 0, yCm: 250, rotationZDeg: 90, wallId: 'left' },
    sourceWidthCm: 150,
    addedWidthCm: 100,
    side: 'right',
    standType: 'u-stand',
    standXCm: 500,
    standYCm: 400,
  });

  assert.equal(result.ok, false);
  assert.match(result.message, /aktif bir duvar yok/i);
});
