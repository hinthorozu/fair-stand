import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getModuleRotationStepDeg,
  resolveModuleRotationDeltaDeg,
} from '../src/moduleBehavior.js';

test('clockwise and counter-clockwise deltas always use the module rotation step', () => {
  const cases = [
    [{ type: 'flat-panel' }, 90],
    [{ type: 'counter', shape: 'L', widthCm: 100 }, 90],
    [{ type: 'counter', widthCm: 100 }, 45],
    [{ type: 'counter', widthCm: 150 }, 45],
    [{ type: 'counter', widthCm: 200 }, 45],
    [{ type: 'bar-stool' }, 45],
    [{ type: 'mini-fridge' }, 90],
    [{ type: 'kettle' }, 90],
    [{ type: 'coat-rack' }, 90],
    [{ type: 'indoor-plant-1' }, 90],
    [{ type: 'illuminated-foam' }, 90],
    [{ type: 'tv' }, 90],
    [{ type: 'led-floodlight' }, 90],
  ];

  for (const [moduleState, expectedStep] of cases) {
    assert.equal(getModuleRotationStepDeg(moduleState), expectedStep);
    assert.equal(resolveModuleRotationDeltaDeg(moduleState, -90), -expectedStep);
    assert.equal(resolveModuleRotationDeltaDeg(moduleState, 90), expectedStep);
  }
});

test('zero requested rotation remains zero', () => {
  assert.equal(resolveModuleRotationDeltaDeg({ type: 'bar-stool' }, 0), 0);
});
