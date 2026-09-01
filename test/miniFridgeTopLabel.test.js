import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('mini fridge owns centered two-line BUZ DOLABI top label', () => {
  const source = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /function createMiniFridgeTopLabel\(heightCm\)/);
  assert.match(source, /const centerX = canvas\.width \/ 2/);
  assert.match(source, /strokeText\('BUZ', centerX/);
  assert.match(source, /strokeText\('DOLABI', centerX/);
  assert.match(source, /fillText\('BUZ', centerX/);
  assert.match(source, /fillText\('DOLABI', centerX/);
  assert.match(source, /PlaneGeometry\(0\.40, 0\.30\)/);
  assert.match(source, /const topLabel = createMiniFridgeTopLabel\(heightCm\)/);
  assert.match(source, /role = 'mini-fridge-top-label'/);
});
