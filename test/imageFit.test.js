import test from 'node:test';
import assert from 'node:assert/strict';
import { computeImageFit } from '../src/imageFit.js';

test('contain keeps the full image visible and centers letterboxing', () => {
  const fit = computeImageFit(2000, 1000, 1000, 1000, 'contain');

  assert.equal(fit.fit, 'contain');
  assert.equal(fit.drawWidth, 1000);
  assert.equal(fit.drawHeight, 500);
  assert.equal(fit.drawX, 0);
  assert.equal(fit.drawY, 250);
});

test('cover fills the target and crops the overflow from the center', () => {
  const fit = computeImageFit(2000, 1000, 1000, 1000, 'cover');

  assert.equal(fit.fit, 'cover');
  assert.equal(fit.drawWidth, 2000);
  assert.equal(fit.drawHeight, 1000);
  assert.equal(fit.drawX, -500);
  assert.equal(fit.drawY, 0);
});

test('unknown fit mode falls back to contain', () => {
  const fit = computeImageFit(1000, 2000, 1000, 500, 'other');
  assert.equal(fit.fit, 'contain');
});

test('invalid dimensions are rejected', () => {
  assert.equal(computeImageFit(0, 100, 100, 100, 'cover'), null);
});
