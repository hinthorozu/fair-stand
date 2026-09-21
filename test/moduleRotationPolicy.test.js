import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getModuleRotationStepDeg,
  resolveModuleRotationDeltaDeg,
} from '../src/moduleBehavior.js';

test('clockwise and counter-clockwise deltas always use the Item rotation step', () => {
  const cases = [
    [{ itemKey: 'wall_200' }, 90],
    [{ itemKey: 'desk_banko_100_L' }, 90],
    [{ itemKey: 'desk_banko_100' }, 45],
    [{ itemKey: 'desk_banko_150' }, 45],
    [{ itemKey: 'desk_banko_200' }, 45],
    [{ itemKey: 'furniture_bar_stool_classic' }, 45],
    [{ itemKey: 'furniture_sofa_single_classic' }, 45],
    [{ itemKey: 'furniture_sofa_double_classic' }, 90],
    [{ itemKey: 'MINI_FRIDGE_AVANTI' }, 90],
    [{ itemKey: 'KETTLE' }, 90],
    [{ itemKey: 'COAT_RACK' }, 90],
    [{ itemKey: 'EXTRA_INDOOR_PLANT_1' }, 90],
    [{ itemKey: 'illuminated-foam' }, 90],
    [{ itemKey: 'TV_42' }, 90],
    [{ itemKey: 'led_floodlight' }, 90],
  ];

  for (const [moduleState, expectedStep] of cases) {
    assert.equal(getModuleRotationStepDeg(moduleState), expectedStep);
    assert.equal(resolveModuleRotationDeltaDeg(moduleState, -90), -expectedStep);
    assert.equal(resolveModuleRotationDeltaDeg(moduleState, 90), expectedStep);
  }
});

test('zero requested rotation remains zero', () => {
  assert.equal(resolveModuleRotationDeltaDeg({ itemKey: 'furniture_bar_stool_classic' }, 0), 0);
});
