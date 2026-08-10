import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveModuleSidePlacement } from '../src/moduleContextMenu.js';

test('back wall keeps visual left and right directions', () => {
  const context = { placement: { wallId: 'back' } };
  assert.equal(resolveModuleSidePlacement(context, 'left'), 'left');
  assert.equal(resolveModuleSidePlacement(context, 'right'), 'right');
});

test('left wall reverses technical axis so visual left and right stay correct', () => {
  const context = { placement: { wallId: 'left' } };
  assert.equal(resolveModuleSidePlacement(context, 'left'), 'right');
  assert.equal(resolveModuleSidePlacement(context, 'right'), 'left');
});

test('right wall keeps technical axis aligned with visual left and right', () => {
  const context = { placement: { wallId: 'right' } };
  assert.equal(resolveModuleSidePlacement(context, 'left'), 'left');
  assert.equal(resolveModuleSidePlacement(context, 'right'), 'right');
});

test('direction mapping is independent of camera data', () => {
  const contextA = {
    placement: { wallId: 'left' },
    cameraSide: 'front',
  };
  const contextB = {
    placement: { wallId: 'left' },
    cameraSide: 'back',
  };

  assert.equal(resolveModuleSidePlacement(contextA, 'left'), 'right');
  assert.equal(resolveModuleSidePlacement(contextB, 'left'), 'right');
});
