import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/moduleDragSidebar.js', import.meta.url), 'utf8');

test('catalog drag uses only Shift+R and advances clockwise without validity gating', () => {
  assert.match(source, /String\(event\.key\)\.toLowerCase\(\) === 'r'[\s\S]*event\.shiftKey/);
  assert.match(source, /activeRotationZDeg = \(\(activeRotationZDeg - rotationStepDeg\)/);
  assert.match(source, /onPreview\?\.\([\s\S]*activeRotationZDeg,[\s\S]*rotationLocked/);
  assert.doesNotMatch(source, /event\.shiftKey \? -rotationStepDeg : rotationStepDeg/);
  assert.doesNotMatch(source, /R\/Shift\+R: modül standardına göre döndür/);
});

test('catalog drag help text documents Shift+R clockwise rotation', () => {
  assert.match(source, /Shift\+R: saat yönünde döndür/);
});
