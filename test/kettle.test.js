import test from 'node:test';
import assert from 'node:assert/strict';

import { MODULE_CATALOG } from '../src/catalog.js';
import { createKettleModuleState } from '../src/designState.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';

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
