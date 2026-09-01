import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('mini fridge owns BUZ DOLABI top label', () => {
  const source = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /function createMiniFridgeTopLabel\(heightCm\)/);
  assert.match(source, /strokeText\('BUZ DOLABI'/);
  assert.match(source, /fillText\('BUZ DOLABI'/);
  assert.match(source, /const topLabel = createMiniFridgeTopLabel\(heightCm\)/);
  assert.match(source, /role = 'mini-fridge-top-label'/);
});
