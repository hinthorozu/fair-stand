import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getModuleRotationStepDeg,
  resolveModuleRotationDeltaDeg,
} from '../src/moduleBehavior.js';

test('clockwise and counter-clockwise deltas always use the Item rotation step', () => {
  const cases = [
    [{ itemKey: 'wall_200_350' }, 90],
    [{ itemKey: 'desk_banko_100_l' }, 90],
    [{ itemKey: 'desk_banko_100' }, 45],
    [{ itemKey: 'desk_banko_150' }, 45],
    [{ itemKey: 'desk_banko_200' }, 45],
    [{ itemKey: 'furniture_bar_stool_classic' }, 45],
    [{ itemKey: 'furniture_sofa_single_classic' }, 45],
    [{ itemKey: 'furniture_sofa_double_classic' }, 90],
    [{ itemKey: 'mini_fridge_avanti' }, 90],
    [{ itemKey: 'kettle' }, 90],
    [{ itemKey: 'coat_rack' }, 90],
    [{ itemKey: 'extra_indoor_plant_1' }, 90],
    [{ itemKey: 'illuminated-foam' }, 90],
    [{ itemKey: 'tv_42' }, 90],
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
