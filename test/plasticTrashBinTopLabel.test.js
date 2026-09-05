import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('plastic trash bin owns centered two-line ÇÖP KOVASI top label', () => {
  const source = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /function createPlasticTrashBinTopLabel\(heightCm\)/);
  assert.match(source, /strokeText\('ÇÖP', centerX/);
  assert.match(source, /strokeText\('KOVASI', centerX/);
  assert.match(source, /fillText\('ÇÖP', centerX/);
  assert.match(source, /fillText\('KOVASI', centerX/);
  assert.match(source, /PlaneGeometry\(0\.40, 0\.30\)/);
  assert.match(source, /role = 'plastic-trash-bin-top-label'/);
  assert.match(source, /label\.rotation\.z = Math\.PI/);
  assert.match(source, /const topLabel = createPlasticTrashBinTopLabel\(heightCm\)/);
  assert.match(source, /if \(topLabel\) group\.add\(topLabel\)/);
});
