import test from 'node:test';
import assert from 'node:assert/strict';
import { snapPlacementToModules } from '../src/modulePlacement.js';

test('depot fixtures do not magnetically snap to nearby modules', () => {
  for (const moduleType of ['mini-fridge', 'kettle', 'coat-rack']) {
    const result = snapPlacementToModules({
      moduleType,
      widthCm: 50,
      depthCm: 40,
      pointerXCm: 100,
      pointerYCm: 100,
      rotationZDeg: 0,
      modules: [{
        id: 'wall-1',
        type: 'flat-panel',
        widthCm: 100,
        placement: { xCm: 100, yCm: 100, zCm: 0, rotationZDeg: 0, wallId: 'free' },
      }],
      standType: 'island',
      standXCm: 500,
      standYCm: 500,
    });
    assert.equal(result, null, moduleType);
  }
});
