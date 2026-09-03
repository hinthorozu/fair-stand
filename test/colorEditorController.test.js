import test from 'node:test';
import assert from 'node:assert/strict';
import { createColorEditorController } from '../src/colorEditorController.js';

function createFixture() {
  const colorInput = { value: '#000000' };
  const colorHexInput = { value: '#000000' };
  const colorRgbInputs = { r: { value: '' }, g: { value: '' }, b: { value: '' } };
  const colorCmykInputs = { c: { value: '' }, m: { value: '' }, y: { value: '' }, k: { value: '' } };
  let applyCount = 0;
  const controller = createColorEditorController({
    colorInput,
    colorHexInput,
    colorRgbInputs,
    colorCmykInputs,
    onApply: () => { applyCount += 1; },
  });
  return { colorInput, colorHexInput, colorRgbInputs, colorCmykInputs, controller, getApplyCount: () => applyCount };
}

test('syncFromHex updates HEX, RGB and CMYK without applying by default', () => {
  const f = createFixture();
  assert.equal(f.controller.syncFromHex('#ff0000'), true);
  assert.equal(f.colorInput.value, '#FF0000');
  assert.equal(f.colorHexInput.value, '#FF0000');
  assert.deepEqual(Object.fromEntries(Object.entries(f.colorRgbInputs).map(([k, v]) => [k, v.value])), { r: '255', g: '0', b: '0' });
  assert.deepEqual(Object.fromEntries(Object.entries(f.colorCmykInputs).map(([k, v]) => [k, v.value])), { c: '0', m: '100', y: '100', k: '0' });
  assert.equal(f.getApplyCount(), 0);
});

test('syncFromHex rejects invalid hex without mutating or applying', () => {
  const f = createFixture();
  assert.equal(f.controller.syncFromHex('nope', { apply: true }), false);
  assert.equal(f.colorInput.value, '#000000');
  assert.equal(f.getApplyCount(), 0);
});

test('syncFromRgbInputs converts current RGB fields and preserves void return', () => {
  const f = createFixture();
  f.colorRgbInputs.r.value = '12';
  f.colorRgbInputs.g.value = '34';
  f.colorRgbInputs.b.value = '56';
  assert.equal(f.controller.syncFromRgbInputs(), undefined);
  assert.equal(f.colorInput.value, '#0C2238');
  assert.equal(f.colorHexInput.value, '#0C2238');
  assert.equal(f.getApplyCount(), 1);
});

test('syncFromCmykInputs clamps fields, updates RGB/HEX and preserves void return', () => {
  const f = createFixture();
  f.colorCmykInputs.c.value = '-5';
  f.colorCmykInputs.m.value = '101';
  f.colorCmykInputs.y.value = '0';
  f.colorCmykInputs.k.value = '0';
  assert.equal(f.controller.syncFromCmykInputs(), undefined);
  assert.deepEqual(Object.fromEntries(Object.entries(f.colorCmykInputs).map(([k, v]) => [k, v.value])), { c: '0', m: '100', y: '0', k: '0' });
  assert.deepEqual(Object.fromEntries(Object.entries(f.colorRgbInputs).map(([k, v]) => [k, v.value])), { r: '255', g: '0', b: '255' });
  assert.equal(f.colorInput.value, '#FF00FF');
  assert.equal(f.getApplyCount(), 1);
});

test('blank numeric groups do not apply and keep void return', () => {
  const f = createFixture();
  assert.equal(f.controller.syncFromRgbInputs(), undefined);
  assert.equal(f.controller.syncFromCmykInputs(), undefined);
  assert.equal(f.getApplyCount(), 0);
});
