import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getModuleBehavior,
  getModuleCollisionStrategy,
} from '../src/moduleBehavior.js';
import {
  placementsOverlap,
  validatePlacementAgainstModules,
} from '../src/modulePlacement.js';

const PROP_TYPES = Object.freeze([
  'mini-fridge',
  'kettle',
  'coat-rack',
  'plastic-trash-bin',
  'chair',
  'table-glass',
  'table-chair-set-eames',
  'bar-stool',
]);

test('free props declare collision:none and effective strategy none', () => {
  for (const type of PROP_TYPES) {
    assert.equal(getModuleBehavior(type).collision, 'none', type);
    assert.equal(getModuleCollisionStrategy(type), 'none', type);
  }
});

test('free props ignore module-module collision but keep stand bounds', () => {
  const wall = {
    id: 'wall-1',
    type: 'flat-panel',
    widthCm: 100,
    depthCm: 10,
    placement: { xCm: 100, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' },
  };

  for (const type of PROP_TYPES) {
    const prop = {
      id: `prop-${type}`,
      type,
      widthCm: 40,
      depthCm: 40,
      placement: { xCm: 100, yCm: 25, zCm: 0, rotationZDeg: 0, wallId: 'free' },
    };

    assert.equal(placementsOverlap(prop, wall), false, type);

    const inside = validatePlacementAgainstModules({
      placement: prop.placement,
      widthCm: prop.widthCm,
      depthCm: prop.depthCm,
      moduleId: prop.id,
      moduleType: type,
      modules: [wall],
      standType: 'island',
      standXCm: 500,
      standYCm: 500,
    });
    assert.equal(inside.ok, true, type);

    const outside = validatePlacementAgainstModules({
      placement: { xCm: 490, yCm: 250, zCm: 0, rotationZDeg: 0, wallId: 'free' },
      widthCm: prop.widthCm,
      depthCm: prop.depthCm,
      moduleId: prop.id,
      moduleType: type,
      modules: [wall],
      standType: 'island',
      standXCm: 500,
      standYCm: 500,
    });
    assert.equal(outside.ok, false, type);
    assert.match(outside.message, /stand alanını aşıyor/i, type);
  }
});
