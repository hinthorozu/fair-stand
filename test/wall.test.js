import test from 'node:test';
import assert from 'node:assert/strict';
import { composeStraightWall, validateWallLength } from '../src/wall.js';

test('350 cm duvarı 200 + 150 olarak çözer', () => {
  const result = composeStraightWall(350);

  assert.equal(result.ok, true);
  assert.deepEqual(result.modules, [200, 150]);
  assert.equal(result.moduleCount, 2);
});

test('600 cm duvarı üç adet 200 cm modülle çözer', () => {
  const result = composeStraightWall(600);

  assert.equal(result.ok, true);
  assert.deepEqual(result.modules, [200, 200, 200]);
});

test('50 cm katı olmayan ölçüyü reddeder', () => {
  const result = validateWallLength(375);

  assert.equal(result.ok, false);
});

test('50 cm altındaki duvarı reddeder', () => {
  const result = validateWallLength(25);

  assert.equal(result.ok, false);
});
