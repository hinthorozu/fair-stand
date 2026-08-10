import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveModuleSidePlacement } from '../src/moduleContextMenu.js';

function normalizeContinuousSide(context, side) {
  if (side !== 'left' && side !== 'right') return side;
  const wallId = context?.placement?.wallId ?? 'back';
  if (wallId !== 'left') return side;
  return side === 'left' ? 'right' : 'left';
}

function resolveFinalContinuousSide(context, visualSide) {
  return normalizeContinuousSide(
    context,
    resolveModuleSidePlacement(context, visualSide),
  );
}

test('back wall keeps visual left and right directions', () => {
  const context = { placement: { wallId: 'back' } };
  assert.equal(resolveFinalContinuousSide(context, 'left'), 'left');
  assert.equal(resolveFinalContinuousSide(context, 'right'), 'right');
});

test('left wall maps visual sides to the opposite continuous-chain directions', () => {
  const context = { placement: { wallId: 'left' } };
  assert.equal(resolveFinalContinuousSide(context, 'left'), 'right');
  assert.equal(resolveFinalContinuousSide(context, 'right'), 'left');
});

test('right wall maps visual sides to the opposite continuous-chain directions', () => {
  const context = { placement: { wallId: 'right' } };
  assert.equal(resolveFinalContinuousSide(context, 'left'), 'right');
  assert.equal(resolveFinalContinuousSide(context, 'right'), 'left');
});

test('direction mapping is independent of camera data', () => {
  const contextA = {
    placement: { wallId: 'right' },
    cameraSide: 'front',
  };
  const contextB = {
    placement: { wallId: 'right' },
    cameraSide: 'back',
  };

  assert.equal(resolveFinalContinuousSide(contextA, 'left'), 'right');
  assert.equal(resolveFinalContinuousSide(contextB, 'left'), 'right');
});
