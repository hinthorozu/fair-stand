import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCmykValues, readNumberGroup } from '../src/colorEditorInputs.js';

test('readNumberGroup preserves numeric input values', () => {
  assert.deepEqual(readNumberGroup({ r: { value: ' 12 ' }, g: { value: '34.5' }, b: { value: '0' } }), {
    r: 12,
    g: 34.5,
    b: 0,
  });
});

test('readNumberGroup rejects blank or non-finite input', () => {
  assert.equal(readNumberGroup({ r: { value: '' } }), null);
  assert.equal(readNumberGroup({ r: { value: 'abc' } }), null);
});

test('normalizeCmykValues rounds and clamps channels to 0..100', () => {
  assert.deepEqual(normalizeCmykValues({ c: -5, m: 44.6, y: 120, k: 9.2 }), {
    c: 0,
    m: 45,
    y: 100,
    k: 9,
  });
});
