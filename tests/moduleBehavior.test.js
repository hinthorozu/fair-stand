import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getModuleBehavior,
  getModuleDefaultRotationDeg,
  getModuleMoveSnapCm,
  getModuleRotationStepDeg,
} from '../src/moduleBehavior.js';
import {
  createModulePlacement,
  normalizeModuleRotationZDeg,
  rotateModulePlacementAroundCenter,
  validateModulePlacement,
} from '../src/modulePlacement.js';

test('straight 100/150/200 counters use 45 degree rotation steps', () => {
  for (const widthCm of [100, 150, 200]) {
    assert.equal(getModuleRotationStepDeg({ type: 'counter', shape: 'straight', widthCm }), 45);
  }
  assert.equal(getModuleRotationStepDeg({ type: 'counter', shape: 'L', widthCm: 150 }), 90);
});

test('Bar Taburesi standard keeps 10 cm snap, 45 degree turns and 270 default', () => {
  const stool = { type: 'bar-stool', widthCm: 60 };
  assert.equal(getModuleMoveSnapCm(stool), 10);
  assert.equal(getModuleRotationStepDeg(stool), 45);
  assert.equal(getModuleDefaultRotationDeg(stool), 270);
  assert.equal(getModuleBehavior(stool).placement, 'free');
});

test('45 degree rotation preserves module center', () => {
  const start = createModulePlacement({ xCm: 100, yCm: 100, rotationZDeg: 0, wallId: 'free' });
  const next = rotateModulePlacementAroundCenter(start, 100, 45, 50);
  assert.equal(next.rotationZDeg, 45);
  assert.equal(next.xCm, 100);
  assert.equal(next.yCm, 100);
});

test('rotation normalization supports eighth turns', () => {
  assert.equal(normalizeModuleRotationZDeg(44), 45);
  assert.equal(normalizeModuleRotationZDeg(136), 135);
  assert.equal(normalizeModuleRotationZDeg(315), 315);
});

test('rotated footprint participates in stand boundary validation', () => {
  const placement = createModulePlacement({ xCm: 0, yCm: 25, rotationZDeg: 45, wallId: 'free' });
  const result = validateModulePlacement({
    placement,
    widthCm: 100,
    depthCm: 50,
    standType: 'island',
    standXCm: 300,
    standYCm: 300,
  });
  assert.equal(result.ok, false);
});
