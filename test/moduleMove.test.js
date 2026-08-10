import test from 'node:test';
import assert from 'node:assert/strict';
import {
  planContinuousModuleInsert,
  planContinuousModuleMove,
} from '../src/moduleMove.js';

function module(id, widthCm, placement) {
  return { id, widthCm, placement };
}

function back(xCm) {
  return { xCm, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' };
}

function left(yCm) {
  return { xCm: 0, yCm, zCm: 0, rotationZDeg: 90, wallId: 'left' };
}

function right(xCm, yCm) {
  return { xCm, yCm, zCm: 0, rotationZDeg: 90, wallId: 'right' };
}

test('catalog module dropped into a real gap is placed directly', () => {
  const modules = [
    module('a', 100, back(0)),
    module('c', 100, back(200)),
  ];
  const inserted = module('new', 50, null);

  const result = planContinuousModuleInsert({
    modules,
    insertedModule: inserted,
    desiredPlacement: back(100),
    standType: 'back-wall',
    standXCm: 500,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.equal(result.mode, 'direct');
  assert.deepEqual(result.movingPlacement, back(100));
  assert.equal(result.placements.size, 1);
  assert.deepEqual(result.orderedModuleIds, ['a', 'new', 'c']);
});

test('catalog module dropped onto occupied space inserts and shifts the collision chain', () => {
  const modules = [
    module('a', 100, back(0)),
    module('b', 100, back(100)),
    module('c', 100, back(200)),
  ];
  const inserted = module('new', 50, null);

  const result = planContinuousModuleInsert({
    modules,
    insertedModule: inserted,
    desiredPlacement: back(100),
    standType: 'back-wall',
    standXCm: 500,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.equal(result.mode, 'reflow');
  assert.deepEqual(result.movingPlacement, back(100));
  assert.deepEqual(result.placements.get('b'), back(150));
  assert.deepEqual(result.placements.get('c'), back(250));
  assert.deepEqual(result.orderedModuleIds, ['a', 'new', 'b', 'c']);
});

test('moving into a real gap keeps every other module in place', () => {
  const modules = [
    module('a', 100, back(0)),
    module('moving', 100, back(100)),
    module('c', 100, back(300)),
  ];

  const result = planContinuousModuleMove({
    modules,
    movingModuleId: 'moving',
    desiredPlacement: back(200),
    standType: 'back-wall',
    standXCm: 500,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.equal(result.mode, 'direct');
  assert.deepEqual(result.movingPlacement, back(200));
  assert.equal(result.placements.size, 1);
  assert.equal(result.placements.has('c'), false);
  assert.deepEqual(result.orderedModuleIds, ['a', 'moving', 'c']);
});

test('dropping onto an occupied slot inserts the moving module and shifts the collision chain', () => {
  const modules = [
    module('a', 100, back(0)),
    module('b', 100, back(100)),
    module('c', 100, back(200)),
    module('moving', 100, back(400)),
  ];

  const result = planContinuousModuleMove({
    modules,
    movingModuleId: 'moving',
    desiredPlacement: back(100),
    standType: 'back-wall',
    standXCm: 500,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.equal(result.mode, 'reflow');
  assert.deepEqual(result.movingPlacement, back(100));
  assert.deepEqual(result.placements.get('b'), back(200));
  assert.deepEqual(result.placements.get('c'), back(300));
  assert.deepEqual(result.orderedModuleIds, ['a', 'moving', 'b', 'c']);
});

test('dragging from the back wall to a free right-wall slot keeps a 90 degree placement', () => {
  const modules = [
    module('back-a', 100, back(0)),
    module('moving', 100, back(100)),
  ];

  const desired = right(400, 100);
  const result = planContinuousModuleMove({
    modules,
    movingModuleId: 'moving',
    desiredPlacement: desired,
    standType: 'u-stand',
    standXCm: 400,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.equal(result.mode, 'direct');
  assert.deepEqual(result.movingPlacement, desired);
  assert.equal(result.movingPlacement.rotationZDeg, 90);
  assert.equal(result.movingPlacement.wallId, 'right');
});

test('drag insertion can cross a U corner and push the right-wall chain forward', () => {
  const modules = [
    module('moving', 200, left(200)),
    module('back-target', 200, back(100)),
    module('right-existing', 200, right(400, 0)),
  ];

  const result = planContinuousModuleMove({
    modules,
    movingModuleId: 'moving',
    desiredPlacement: back(150),
    standType: 'u-stand',
    standXCm: 400,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.equal(result.mode, 'reflow');
  assert.equal(result.chainSide, 'right');
  assert.deepEqual(result.movingPlacement, right(400, 0));
  assert.deepEqual(result.placements.get('right-existing'), right(400, 200));
  assert.deepEqual(result.orderedModuleIds, ['back-target', 'moving', 'right-existing']);
});
