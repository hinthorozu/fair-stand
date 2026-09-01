import test from 'node:test';
import assert from 'node:assert/strict';

import { getModuleDefaultRotationDeg, getModuleRotationStepDeg } from '../src/moduleBehavior.js';

for (const widthCm of [100, 150, 200]) {
  test(`corner counter ${widthCm} defaults to the same orientation`, () => {
    const module = { type: 'counter', shape: 'L', widthCm };
    assert.equal(getModuleDefaultRotationDeg(module), 270);
    assert.equal(getModuleRotationStepDeg(module), 90);
  });
}

test('straight counter default orientation is unchanged', () => {
  const module = { type: 'counter', widthCm: 150 };
  assert.equal(getModuleDefaultRotationDeg(module), 0);
  assert.equal(getModuleRotationStepDeg(module), 45);
});
