import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getContinuousWallCapacityCm,
  getContinuousWallSegments,
  planContinuousWallInsertion,
  planContinuousWallLayout,
} from '../src/wallReflow.js';

function module(id, widthCm, placement) {
  return { id, widthCm, placement };
}

test('U stand 400 x 400 exposes a 1200 cm continuous wall chain', () => {
  assert.equal(getContinuousWallCapacityCm('u-stand', 400, 400), 1200);
  assert.deepEqual(getContinuousWallSegments('u-stand', 400, 400), [
    { wallId: 'left', lengthCm: 400, offsetCm: 0 },
    { wallId: 'back', lengthCm: 400, offsetCm: 400 },
    { wallId: 'right', lengthCm: 400, offsetCm: 800 },
  ]);
});

test('L stand 500 x 400 exposes a 900 cm chain from the physical left side', () => {
  assert.equal(getContinuousWallCapacityCm('l-left', 500, 400), 900);
  assert.deepEqual(getContinuousWallSegments('l-left', 500, 400), [
    { wallId: 'left', lengthCm: 400, offsetCm: 0 },
    { wallId: 'back', lengthCm: 500, offsetCm: 400 },
  ]);
});

test('automatic U wall starts at left, crosses back and ends on right', () => {
  const modules = [
    module('a', 200),
    module('b', 200),
    module('c', 200),
    module('d', 200),
    module('e', 200),
    module('f', 200),
  ];

  const result = planContinuousWallLayout({
    modules,
    standType: 'u-stand',
    standXCm: 400,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.placements.get('a'), {
    xCm: 0,
    yCm: 200,
    zCm: 0,
    rotationZDeg: 90,
    wallId: 'left',
  });
  assert.equal(result.placements.get('c').wallId, 'back');
  assert.equal(result.placements.get('c').xCm, 0);
  assert.equal(result.placements.get('e').wallId, 'right');
  assert.equal(result.placements.get('e').yCm, 0);
  assert.equal(result.placements.get('f').yCm, 200);
  assert.equal(result.capacityCm, 1200);
});

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
    // Sol yan duvarda UI/main teknik yönü bir kez çevirerek planner'a left gönderir.
    side: 'left',
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
    side: 'left',
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

test('left insertion at the path boundary falls back to shifting target and following modules right', () => {
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

test('right insertion keeps an existing gap instead of pulling a distant module into the corner', () => {
  const target = module('left-target', 100, {
    xCm: 0,
    yCm: 200,
    zCm: 0,
    rotationZDeg: 90,
    wallId: 'left',
  });
  const distantBack = module('back-distant', 100, {
    xCm: 100,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  const inserted = module('inserted', 100, null);

  const result = planContinuousWallInsertion({
    modules: [target, distantBack],
    insertedModules: [inserted],
    targetModuleId: target.id,
    side: 'left',
    standType: 'u-stand',
    standXCm: 500,
    standYCm: 500,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.orderedModuleIds, ['left-target', 'inserted', 'back-distant']);
  assert.deepEqual(result.placements.get('inserted'), {
    xCm: 0,
    yCm: 100,
    zCm: 0,
    rotationZDeg: 90,
    wallId: 'left',
  });
  assert.equal(result.placements.has('back-distant'), false);
});

test('left insertion uses the free gap before target and does not move target or distant next module', () => {
  const target = module('target', 100, {
    xCm: 200,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  const distantNext = module('next', 100, {
    xCm: 500,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  const inserted = module('inserted', 100, null);

  const result = planContinuousWallInsertion({
    modules: [target, distantNext],
    insertedModules: [inserted],
    targetModuleId: target.id,
    side: 'left',
    standType: 'back-wall',
    standXCm: 800,
    standYCm: 500,
  });

  assert.equal(result.ok, true);
  assert.equal(result.placements.get('inserted').xCm, 100);
  assert.equal(result.placements.has('target'), false);
  assert.equal(result.placements.has('next'), false);
});

test('left insertion succeeds in a 50 cm gap even when the chain to the right is completely full', () => {
  const previous = module('previous', 200, {
    xCm: 0,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  const target = module('target', 100, {
    xCm: 300,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  const next = module('next', 100, {
    xCm: 400,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  const inserted = module('inserted', 50, null);

  const result = planContinuousWallInsertion({
    modules: [previous, target, next],
    insertedModules: [inserted],
    targetModuleId: target.id,
    side: 'left',
    standType: 'back-wall',
    standXCm: 500,
    standYCm: 500,
  });

  assert.equal(result.ok, true);
  assert.equal(result.placements.get('inserted').xCm, 250);
  assert.equal(result.placements.has('target'), false);
  assert.equal(result.placements.has('next'), false);
});

test('right wall visual-left add uses the gap before target even when the right end is full', () => {
  const backEnd = module('back-end', 100, {
    xCm: 400,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  const target = module('right-target', 100, {
    xCm: 500,
    yCm: 100,
    zCm: 0,
    rotationZDeg: 90,
    wallId: 'right',
  });
  const next = module('right-next', 300, {
    xCm: 500,
    yCm: 200,
    zCm: 0,
    rotationZDeg: 90,
    wallId: 'right',
  });
  const inserted = module('inserted', 50, null);

  const result = planContinuousWallInsertion({
    modules: [backEnd, target, next],
    insertedModules: [inserted],
    targetModuleId: target.id,
    // Context menu sağ yan duvarda görsel solu teknik 'right' olarak gönderiyor.
    side: 'right',
    standType: 'u-stand',
    standXCm: 500,
    standYCm: 500,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.placements.get('inserted'), {
    xCm: 500,
    yCm: 50,
    zCm: 0,
    rotationZDeg: 90,
    wallId: 'right',
  });
  assert.equal(result.placements.has('right-target'), false);
  assert.equal(result.placements.has('right-next'), false);
});

test('right insertion uses an available gap after target without moving a distant next module', () => {
  const target = module('target', 100, {
    xCm: 100,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  const next = module('next', 100, {
    xCm: 250,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
  const inserted = module('inserted', 50, null);

  const result = planContinuousWallInsertion({
    modules: [target, next],
    insertedModules: [inserted],
    targetModuleId: target.id,
    side: 'right',
    standType: 'back-wall',
    standXCm: 500,
    standYCm: 500,
  });

  assert.equal(result.ok, true);
  assert.equal(result.placements.get('inserted').xCm, 200);
  assert.equal(result.placements.has('next'), false);
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
