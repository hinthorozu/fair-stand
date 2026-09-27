import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeGroupSizeSlice,
  computeImageFit,
  computeImageSizeTile,
  resolveImageTileHeightCm,
} from '../src/imageFit.js';

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

test('a 60 by 35 cm image on a 100 by 50 cm face repeats from the sides and the top', () => {
  const tile = computeImageSizeTile(100, 50, 60, 35);

  assert.equal(tile.repeatX, 100 / 60);
  assert.equal(tile.repeatY, 50 / 35);
  assert.equal(tile.offsetX, (1 - 100 / 60) / 2);
  assert.equal(tile.offsetY, 0);
});

test('a 400 by 200 cm area starts with the image at that size, one slice per panel', () => {
  const tile = computeImageSizeTile(400, 200, 400, 200);
  const bottomLeft = computeGroupSizeSlice({ startX: 0, startY: 0, width: 0.5, height: 0.5 }, tile);

  assert.equal(tile.repeatX, 1);
  assert.equal(tile.repeatY, 1);
  assert.equal(tile.offsetX, 0);
  assert.equal(tile.offsetY, 0);
  assert.equal(bottomLeft.repeatX, 0.5);
  assert.equal(bottomLeft.repeatY, 0.5);
  assert.equal(bottomLeft.offsetX, 0);
  assert.equal(bottomLeft.offsetY, 0);
});

test('shrinking a 400 by 200 cm area to 300 by 150 repeats into the gaps', () => {
  const tile = computeImageSizeTile(400, 200, 300, 150);

  assert.equal(tile.repeatX, 400 / 300);
  assert.equal(tile.repeatY, 200 / 150);
  assert.equal(tile.offsetX, (1 - 400 / 300) / 2);
  assert.equal(tile.offsetY, 0);
});

test('growing a 400 by 200 cm area to 500 by 300 overflows the area', () => {
  const tile = computeImageSizeTile(400, 200, 500, 300);

  assert.equal(tile.repeatX, 400 / 500);
  assert.equal(tile.repeatY, 200 / 300);
  assert.ok(tile.repeatX < 1);
  assert.ok(tile.repeatY < 1);
  assert.equal(tile.offsetX, (1 - 400 / 500) / 2);
  assert.equal(tile.offsetY, 0);
});

test('missing tile height follows the image aspect', () => {
  assert.equal(resolveImageTileHeightCm(60, null, 2000, 1000), 30);
  assert.equal(resolveImageTileHeightCm(60, 40, 2000, 1000), 40);
  assert.equal(computeImageSizeTile(100, 50, 0, 30), null);
});
