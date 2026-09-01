import test from 'node:test';
import assert from 'node:assert/strict';

import { MODULE_CATALOG } from '../src/catalog.js';
import { createKettleModuleState } from '../src/designState.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';
import { placementsOverlap } from '../src/modulePlacement.js';

test('kettle catalog and state stay aligned', () => {
  const catalog = MODULE_CATALOG.DEPOT_KETTLE;
  const state = createKettleModuleState();
  assert.deepEqual([catalog.widthCm, catalog.depthCm, catalog.heightCm], [24, 19, 25]);
  assert.deepEqual([state.widthCm, state.depthCm, state.heightCm], [24, 19, 25]);
});

test('kettle is free-positioned at fridge-top elevation without floor-footprint collision', () => {
  const behavior = getModuleBehavior({ type: 'kettle' });
  assert.equal(behavior.placement, 'free');
  assert.equal(behavior.collision, 'none');
  assert.equal(behavior.rotationStepDeg, 90);
});


test('kettle may share the mini-fridge footprint at its raised placement', () => {
  const fridge = {
    id: 'fridge',
    type: 'mini-fridge',
    widthCm: 45,
    depthCm: 43,
    heightCm: 66,
    placement: { xCm: 100, yCm: 100, zCm: 0, rotationZDeg: 0, wallId: 'free' },
  };
  const kettle = {
    id: 'kettle',
    type: 'kettle',
    widthCm: 24,
    depthCm: 19,
    heightCm: 25,
    placement: { xCm: 110, yCm: 110, zCm: 66, rotationZDeg: 0, wallId: 'free' },
  };

  assert.equal(placementsOverlap(kettle, fridge), false);
  assert.equal(placementsOverlap(fridge, kettle), false);
});
