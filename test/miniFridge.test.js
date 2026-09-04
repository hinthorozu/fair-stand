import test from 'node:test';
import assert from 'node:assert/strict';

import { MODULE_CATALOG } from '../src/catalog.js';
import { createMiniFridgeModuleState } from '../src/designState.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';

test('mini fridge catalog/state dimensions stay aligned', () => {
  const catalog = MODULE_CATALOG.DEPOT_MINI_FRIDGE_AVANTI;
  const state = createMiniFridgeModuleState();
  assert.deepEqual(
    [catalog.widthCm, catalog.depthCm, catalog.heightCm],
    [50, 50, 66],
  );
  assert.deepEqual(
    [state.widthCm, state.depthCm, state.heightCm],
    [50, 50, 66],
  );
});

test('mini fridge is a free footprint module', () => {
  const behavior = getModuleBehavior({ type: 'mini-fridge' });
  assert.equal(behavior.placement, 'free');
  assert.equal(behavior.collision, 'footprint');
  assert.equal(behavior.rotationStepDeg, 90);
});
