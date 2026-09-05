import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveAdjacentPlacement } from '../src/cornerPlacement.js';
import { planContinuousWallLayout } from '../src/wallReflow.js';

test('corner helper and active wall reflow agree on canonical 270 degree right-wall orientation', () => {
  const cornerResult = resolveAdjacentPlacement({
    sourcePlacement: { xCm: 300, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' },
    sourceWidthCm: 200,
    addedWidthCm: 200,
    side: 'right',
    standType: 'u-stand',
    standXCm: 500,
    standYCm: 400,
  });

  assert.equal(cornerResult.ok, true);
  assert.equal(cornerResult.placement.wallId, 'right');
  assert.equal(cornerResult.placement.rotationZDeg, 270);

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
