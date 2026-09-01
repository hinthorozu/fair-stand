import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

test('wall overlay drag prefers its current wall while that wall intersection remains valid', () => {
  assert.match(source, /const targetWallId = allowedWalls\.includes\(preferredWallId\) \? preferredWallId : null/);
  assert.match(source, /const preferredIntersection = targetWallId/);
  assert.match(source, /preferredIntersection \?\? intersections\[0\]/);
});

test('wall overlay move uses the dragged module current wall instead of the module under the pointer', () => {
  assert.match(source, /const currentWallId = \['back', 'left', 'right'\]\.includes\(dragSession\.preview\?\.placement\?\.wallId\)/);
  assert.match(source, /getWallOverlayDragPoint\([\s\S]*?currentWallId,[\s\S]*?moduleState/);
});

test('top fixture keeps preferred wall when both walls are within the existing 30 cm snap zone', () => {
  assert.match(source, /const wallSnapDistanceCm = 30/);
  assert.match(source, /const preferredWall = wallDistances\.find\(\(entry\) => entry\.wallId === preferredWallId\)/);
  assert.match(source, /const snapWall = preferredWall && preferredWall\.distanceCm <= wallSnapDistanceCm/);
});
