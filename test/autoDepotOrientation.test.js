import test from 'node:test';
import assert from 'node:assert/strict';
import { planAutomaticDepot } from '../src/autoDepot.js';

function sideWalls(plan) {
  return plan.specs.filter((spec) => spec.kind === 'wall' && spec.widthCm === 100 && spec.placement.yCm === plan.originYCm);
}

test('1x1 back-wall depot exposes both side panel faces outward', () => {
  const plan = planAutomaticDepot({
    standType: 'back-wall',
    standXCm: 500,
    standYCm: 500,
    sizeKey: '100x100',
  });
  assert.equal(plan.ok, true);

  const walls = sideWalls(plan);
  const left = walls.find((spec) => spec.placement.xCm === plan.originXCm);
  const right = walls.find((spec) => spec.placement.xCm === plan.originXCm + plan.widthCm);

  assert.equal(left?.placement.rotationZDeg, 270);
  assert.equal(right?.placement.rotationZDeg, 90);
});
