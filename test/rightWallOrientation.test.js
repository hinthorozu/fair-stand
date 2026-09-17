import test from 'node:test';
import assert from 'node:assert/strict';

import { planContinuousWallLayout } from '../src/wallReflow.js';

test('production wall reflow uses canonical 270 degree right-wall orientation', () => {
  const reflowResult = planContinuousWallLayout({
    modules: [
      { id: 'left-a', widthCm: 200 },
      { id: 'left-b', widthCm: 200 },
      { id: 'back-a', widthCm: 200 },
      { id: 'back-b', widthCm: 200 },
      { id: 'right-a', widthCm: 200 },
    ],
    standType: 'u-stand',
    standXCm: 500,
    standYCm: 400,
  });

  assert.equal(reflowResult.ok, true);
  assert.deepEqual(reflowResult.placements.get('right-a'), {
    xCm: 500,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 270,
    wallId: 'right',
  });
});
