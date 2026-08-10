import test from 'node:test';
import assert from 'node:assert/strict';
import { planContinuousWallInsertion } from '../src/wallReflow.js';

function module(id, widthCm, placement) {
  return { id, widthCm, placement };
}

test('U stand pushes an occupied corner forward like one continuous straight wall', () => {
  const target = module('left-target', 200, {
    xCm: 0,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 90,
    wallId: 'left',
  });
  const back = module('back-existing', 150, {
    xCm: 0,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  const inserted = module('inserted', 200, null);

  const result = planContinuousWallInsertion({
    modules: [target, back],
    insertedModules: [inserted],
    targetModuleId: target.id,
    side: 'right',
    standType: 'u-stand',
    standXCm: 500,
    standYCm: 500,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.orderedModuleIds, ['left-target', 'inserted', 'back-existing']);
  assert.deepEqual(result.placements.get('inserted'), {
    xCm: 0,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  assert.equal(result.placements.get('back-existing').wallId, 'back');
  assert.equal(result.placements.get('back-existing').xCm, 200);
});

test('reflow crosses both U stand corners and keeps pushing modules', () => {
  const leftTarget = module('left-target', 200, {
    xCm: 0,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 90,
    wallId: 'left',
  });
  const backA = module('back-a', 200, {
    xCm: 0,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  const backB = module('back-b', 200, {
    xCm: 200,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  const rightA = module('right-a', 200, {
    xCm: 500,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 90,
    wallId: 'right',
  });
  const inserted = module('inserted', 200, null);

  const result = planContinuousWallInsertion({
    modules: [leftTarget, backA, backB, rightA],
    insertedModules: [inserted],
    targetModuleId: leftTarget.id,
    side: 'right',
    standType: 'u-stand',
    standXCm: 500,
    standYCm: 500,
  });

  assert.equal(result.ok, true);
  assert.equal(result.placements.get('inserted').wallId, 'back');
  assert.equal(result.placements.get('back-a').xCm, 200);
  assert.equal(result.placements.get('back-b').wallId, 'right');
  assert.equal(result.placements.get('back-b').yCm, 0);
  assert.equal(result.placements.get('right-a').wallId, 'right');
  assert.equal(result.placements.get('right-a').yCm, 200);
});

test('inserting on the left shifts target and following modules forward', () => {
  const target = module('back-target', 200, {
    xCm: 0,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  const next = module('back-next', 150, {
    xCm: 200,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  const inserted = module('inserted', 100, null);

  const result = planContinuousWallInsertion({
    modules: [target, next],
    insertedModules: [inserted],
    targetModuleId: target.id,
    side: 'left',
    standType: 'back-wall',
    standXCm: 500,
    standYCm: 500,
  });

  assert.equal(result.ok, true);
  assert.equal(result.placements.get('inserted').xCm, 0);
  assert.equal(result.placements.get('back-target').xCm, 100);
  assert.equal(result.placements.get('back-next').xCm, 300);
});

test('rejects only when the continuous active wall chain has no remaining capacity', () => {
  const target = module('back-target', 300, {
    xCm: 0,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  const next = module('back-next', 200, {
    xCm: 300,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  const inserted = module('inserted', 100, null);

  const result = planContinuousWallInsertion({
    modules: [target, next],
    insertedModules: [inserted],
    targetModuleId: target.id,
    side: 'right',
    standType: 'back-wall',
    standXCm: 500,
    standYCm: 500,
  });

  assert.equal(result.ok, false);
  assert.match(result.message, /yeterli alan yok/i);
});
