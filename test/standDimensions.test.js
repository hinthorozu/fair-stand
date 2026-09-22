import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCanonicalItemCatalog } from './registerCanonicalItemCatalog.mjs';
import { CANONICAL_STAND_DIMENSIONS } from './mapCatalogSeed.mjs';
import {
  getStandDimensions,
  initializeStandDimensions,
  resetStandDimensions,
  STAND_DIMENSIONS,
} from '../src/standDimensions.js';

test('canonical fixture matches live STAND_DIMENSIONS getters', () => {
  assert.deepEqual({ ...getStandDimensions() }, CANONICAL_STAND_DIMENSIONS);
  assert.equal(STAND_DIMENSIONS.heightCm, 350);
  assert.equal(STAND_DIMENSIONS.stripCount, 7);
  assert.equal(STAND_DIMENSIONS.height, 3.5);
  assert.equal(STAND_DIMENSIONS.stripHeightCm, 50);
  assert.equal(STAND_DIMENSIONS.stripHeight, 0.5);
});

test('initializeStandDimensions rejects invalid payload and restores canonical catalog', () => {
  try {
    resetStandDimensions();
    assert.throws(() => getStandDimensions(), /not bootstrapped/);
    assert.throws(() => initializeStandDimensions(null), TypeError);
    assert.throws(
      () => initializeStandDimensions({ ...CANONICAL_STAND_DIMENSIONS, heightCm: 0 }),
      /positive/,
    );
    initializeStandDimensions({ ...CANONICAL_STAND_DIMENSIONS, heightCm: 950 });
    assert.equal(getStandDimensions().heightCm, 950);
    assert.equal(STAND_DIMENSIONS.height, 9.5);
  } finally {
    loadCanonicalItemCatalog();
  }
});
