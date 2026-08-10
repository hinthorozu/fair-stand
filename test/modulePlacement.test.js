import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAllowedWallIds,
  snapCm,
  snapPlacementToStand,
  validatePlacementAgainstModules,
} from '../src/modulePlacement.js';

test('snaps module coordinates to 50 cm increments', () => {
  assert.equal(snapCm(24), 0);
  assert.equal(snapCm(26), 50);
  assert.equal(snapCm(174), 150);
  assert.equal(snapCm(176), 200);
});

test('L stand sides expose only the selected mirrored wall', () => {
  assert.deepEqual(getAllowedWallIds('l-left'), ['back', 'left']);
  assert.deepEqual(getAllowedWallIds('l-right'), ['back', 'right']);
  assert.deepEqual(getAllowedWallIds('u-stand'), ['back', 'left', 'right']);
});

test('snaps an L-left module to the closest active edge', () => {
  const result = snapPlacementToStand({
    standType: 'l-left',
    widthCm: 200,
    pointerXCm: 40,
    pointerYCm: 260,
    standXCm: 1000,
    standYCm: 500,
  });

  assert.equal(result.ok, true);
  assert.equal(result.placement.wallId, 'left');
  assert.equal(result.placement.rotationZDeg, 90);
  assert.equal(result.placement.xCm, 0);
  assert.equal(result.placement.yCm, 150);
});

test('snaps a back wall module and keeps it inside X limit', () => {
  const result = snapPlacementToStand({
    standType: 'u-stand',
    widthCm: 200,
    pointerXCm: 990,
    pointerYCm: 20,
    standXCm: 1000,
    standYCm: 500,
  });

  assert.equal(result.ok, true);
  assert.equal(result.placement.wallId, 'back');
  assert.equal(result.placement.xCm, 800);
  assert.equal(result.placement.yCm, 0);
});

test('rejects overlapping modules on the same wall but allows a corner connection', () => {
  const modules = [
    {
      id: 'back-1',
      widthCm: 200,
      placement: { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' },
    },
    {
      id: 'left-1',
      widthCm: 200,
      placement: { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 90, wallId: 'left' },
    },
  ];

  const overlap = validatePlacementAgainstModules({
    moduleId: 'moving',
    widthCm: 100,
    placement: { xCm: 100, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' },
    modules,
    standType: 'l-left',
    standXCm: 1000,
    standYCm: 500,
  });
  assert.equal(overlap.ok, false);

  const corner = validatePlacementAgainstModules({
    moduleId: 'moving',
    widthCm: 100,
    placement: { xCm: 0, yCm: 200, zCm: 0, rotationZDeg: 90, wallId: 'left' },
    modules,
    standType: 'l-left',
    standXCm: 1000,
    standYCm: 500,
  });
  assert.equal(corner.ok, true);
});
