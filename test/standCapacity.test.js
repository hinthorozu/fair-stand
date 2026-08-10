import test from 'node:test';
import assert from 'node:assert/strict';
import { validateStandAxisCapacity } from '../src/standCapacity.js';

test('allows a total exactly on the X limit', () => {
  const result = validateStandAxisCapacity({
    axis: 'x',
    currentCm: 200,
    addedCm: 400,
    xCm: 600,
    yCm: 500,
  });

  assert.equal(result.ok, true);
  assert.equal(result.projectedCm, 600);
  assert.equal(result.remainingCm, 0);
});

test('rejects the whole X addition when the projected total exceeds the stand', () => {
  const result = validateStandAxisCapacity({
    axis: 'x',
    currentCm: 200,
    addedCm: 600,
    xCm: 600,
    yCm: 500,
  });

  assert.equal(result.ok, false);
  assert.equal(result.projectedCm, 800);
  assert.equal(result.limitCm, 600);
});

test('applies the same total rule on the Y axis', () => {
  assert.equal(
    validateStandAxisCapacity({
      axis: 'y',
      currentCm: 300,
      addedCm: 200,
      xCm: 1000,
      yCm: 500,
    }).ok,
    true,
  );

  assert.equal(
    validateStandAxisCapacity({
      axis: 'y',
      currentCm: 300,
      addedCm: 250,
      xCm: 1000,
      yCm: 500,
    }).ok,
    false,
  );
});
