import test from 'node:test';
import assert from 'node:assert/strict';
import {
  composeAutomaticStandWall,
  getAutomaticWallCapacityCm,
} from '../src/automaticWall.js';

test('L stand 500 x 400 accepts 900 cm and fills left before back', () => {
  assert.equal(getAutomaticWallCapacityCm({
    standType: 'l-left',
    standXCm: 500,
    standYCm: 400,
  }), 900);

  const result = composeAutomaticStandWall({
    lengthCm: 900,
    standType: 'l-left',
    standXCm: 500,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.widths, [200, 200, 200, 200, 100]);
  assert.equal(result.placements[0].wallId, 'left');
  assert.equal(result.placements[1].wallId, 'left');
  assert.equal(result.placements[2].wallId, 'back');
  assert.equal(result.placements.at(-1).wallId, 'back');
});

test('U stand 400 x 400 accepts the full 1200 cm chain', () => {
  const result = composeAutomaticStandWall({
    lengthCm: 1200,
    standType: 'u-stand',
    standXCm: 400,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.equal(result.capacityCm, 1200);
  assert.deepEqual(result.widths, [200, 200, 200, 200, 200, 200]);
  assert.deepEqual(result.placements.map((placement) => placement.wallId), [
    'left', 'left', 'back', 'back', 'right', 'right',
  ]);
});

test('450 cm side is completed with a 50 cm module before turning the corner', () => {
  const result = composeAutomaticStandWall({
    lengthCm: 950,
    standType: 'l-left',
    standXCm: 500,
    standYCm: 450,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.widths, [200, 200, 50, 200, 200, 100]);
  assert.deepEqual(result.placements.slice(0, 3).map((placement) => placement.wallId), [
    'left', 'left', 'left',
  ]);
  assert.equal(result.placements[3].wallId, 'back');
});

test('rejects lengths above the total active wall chain', () => {
  const result = composeAutomaticStandWall({
    lengthCm: 1250,
    standType: 'u-stand',
    standXCm: 400,
    standYCm: 400,
  });

  assert.equal(result.ok, false);
  assert.equal(result.capacityCm, 1200);
  assert.match(result.message, /1200 cm/i);
});
