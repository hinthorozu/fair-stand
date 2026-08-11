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
  assert.deepEqual(getAllowedWallIds('l-left'), ['back', 'left', 'free']);
  assert.deepEqual(getAllowedWallIds('l-right'), ['back', 'right', 'free']);
  assert.deepEqual(getAllowedWallIds('u-stand'), ['back', 'left', 'right', 'free']);
  assert.deepEqual(getAllowedWallIds('island'), ['free']);
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
    pointerXCm: 920,
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


test('snaps a module inside every stand to the 50 cm free grid', () => {
  const result = snapPlacementToStand({
    standType: 'back-wall',
    widthCm: 100,
    pointerXCm: 375,
    pointerYCm: 275,
    standXCm: 800,
    standYCm: 600,
  });

  assert.equal(result.ok, true);
  assert.equal(result.mode, 'free');
  assert.deepEqual(result.placement, {
    xCm: 300,
    yCm: 300,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'free',
  });
});

test('rotation lock keeps a perpendicular return free instead of snapping it onto the back wall', () => {
  const result = snapPlacementToStand({
    standType: 'u-stand',
    widthCm: 100,
    pointerXCm: 300,
    pointerYCm: 20,
    standXCm: 800,
    standYCm: 600,
    preferredRotationZDeg: 90,
    rotationLocked: true,
  });

  assert.equal(result.ok, true);
  assert.equal(result.placement.wallId, 'free');
  assert.equal(result.placement.rotationZDeg, 90);
  assert.equal(result.placement.xCm, 300);
});

test('free parallel walls may overlap in axis range when they are on different grid lines', () => {
  const modules = [{
    id: 'a',
    widthCm: 200,
    placement: { xCm: 100, yCm: 100, zCm: 0, rotationZDeg: 0, wallId: 'free' },
  }];
  const result = validatePlacementAgainstModules({
    moduleId: 'b',
    widthCm: 200,
    placement: { xCm: 100, yCm: 200, zCm: 0, rotationZDeg: 0, wallId: 'free' },
    modules,
    standType: 'back-wall',
    standXCm: 800,
    standYCm: 600,
  });
  assert.equal(result.ok, true);
});

test('free L and T joins are allowed but a plus crossing is rejected', () => {
  const horizontal = {
    id: 'horizontal',
    widthCm: 300,
    placement: { xCm: 100, yCm: 200, zCm: 0, rotationZDeg: 0, wallId: 'free' },
  };

  const tJoin = validatePlacementAgainstModules({
    moduleId: 't',
    widthCm: 100,
    placement: { xCm: 250, yCm: 100, zCm: 0, rotationZDeg: 90, wallId: 'free' },
    modules: [horizontal],
    standType: 'u-stand',
    standXCm: 800,
    standYCm: 600,
  });
  assert.equal(tJoin.ok, true);

  const plusCross = validatePlacementAgainstModules({
    moduleId: 'plus',
    widthCm: 300,
    placement: { xCm: 250, yCm: 100, zCm: 0, rotationZDeg: 90, wallId: 'free' },
    modules: [horizontal],
    standType: 'u-stand',
    standXCm: 800,
    standYCm: 600,
  });
  assert.equal(plusCross.ok, false);
});
