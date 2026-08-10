import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeHexColor,
  rgbToHex,
  hexToRgb,
  rgbToCmyk,
  cmykToRgb,
  colorValuesFromHex,
} from '../src/colorUtils.js';

test('normalizes short and long HEX values', () => {
  assert.equal(normalizeHexColor('#abc'), '#AABBCC');
  assert.equal(normalizeHexColor('905A51'), '#905A51');
  assert.equal(normalizeHexColor('#GG0000'), null);
});

test('converts HEX and RGB in both directions', () => {
  assert.deepEqual(hexToRgb('#905A51'), { r: 144, g: 90, b: 81 });
  assert.equal(rgbToHex(144, 90, 81), '#905A51');
});

test('converts black and white RGB values to CMYK', () => {
  assert.deepEqual(rgbToCmyk(0, 0, 0), { c: 0, m: 0, y: 0, k: 100 });
  assert.deepEqual(rgbToCmyk(255, 255, 255), { c: 0, m: 0, y: 0, k: 0 });
});

test('converts CMYK back to RGB', () => {
  assert.deepEqual(cmykToRgb(0, 0, 0, 0), { r: 255, g: 255, b: 255 });
  assert.deepEqual(cmykToRgb(0, 0, 0, 100), { r: 0, g: 0, b: 0 });
});

test('returns synchronized HEX RGB and CMYK values', () => {
  const values = colorValuesFromHex('#905A51');
  assert.equal(values.hex, '#905A51');
  assert.deepEqual(values.rgb, { r: 144, g: 90, b: 81 });
  assert.deepEqual(values.cmyk, rgbToCmyk(144, 90, 81));
});
