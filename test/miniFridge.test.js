import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getCatalogItem,
} from '../src/catalog.js';
import { createMiniFridgeModuleState } from '../src/designState.js';
import { getItem } from '../src/items.js';
import { getModuleBehavior, getModuleRotationStepDeg } from '../src/moduleBehavior.js';

test('mini fridge catalog/state dimensions stay aligned', () => {
  const catalog = getCatalogItem('MINI_FRIDGE_AVANTI');
  const item = getItem('MINI_FRIDGE_AVANTI');
  const state = createMiniFridgeModuleState();
  assert.equal(catalog.itemKey, 'MINI_FRIDGE_AVANTI');
  assert.deepEqual(
    [item.dimensions.widthCm, item.dimensions.depthCm, item.dimensions.heightCm],
    [50, 50, 66],
  );
  assert.deepEqual(
    [state.widthCm, state.depthCm, state.heightCm],
    [50, 50, 66],
  );
});

test('mini fridge is a free module without inter-module collision', () => {
  const behavior = getModuleBehavior({ type: 'mini-fridge' });
  assert.equal(behavior.placement, 'free');
  assert.equal(behavior.collision, 'none');
  assert.equal(getModuleRotationStepDeg({ itemKey: 'MINI_FRIDGE_AVANTI' }), 90);
});
