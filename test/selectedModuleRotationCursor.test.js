import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

test('selected module rotation keeps a cursor across invalid intermediate angles', () => {
  assert.match(source, /let keyboardRotationCursor = null/);
  assert.match(source, /function getKeyboardRotationCursor\(moduleState\)/);
  assert.match(source, /rotationCursor\.rotationZDeg = rotateModuleRotationZDeg\([\s\S]*effectiveDeltaDeg/);
  assert.match(source, /rotationDeltaFromCommittedDeg = effectiveDeltaDeg < 0[\s\S]*currentRotationZDeg - targetRotationZDeg/);
});

test('invalid selected rotation does not discard the speculative rotation cursor', () => {
  const invalidBranch = source.match(/if \(!validation\.ok\) \{[\s\S]*?return \{ handled: true, ok: false, message \};\n    \}/)?.[0] ?? '';
  assert.ok(invalidBranch, 'invalid rotation branch must exist');
  assert.doesNotMatch(invalidBranch, /keyboardRotationCursor = null/);
  assert.doesNotMatch(invalidBranch, /rotationCursor\.rotationZDeg = currentRotationZDeg/);
});

test('valid selected rotation advances the committed baseline to the accepted angle', () => {
  assert.match(source, /rotationCursor\.rotationZDeg = normalizeModuleRotationZDeg\(nextPlacement\.rotationZDeg\)/);
  assert.match(source, /rotationCursor\.committedPlacementSignature = getKeyboardRotationPlacementSignature\(nextPlacement\)/);
});
