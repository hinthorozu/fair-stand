import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('illuminated foam exposes module metadata for selection and drag', () => {
  const source = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const start = source.indexOf('function createIlluminatedFoamModule(');
  const end = source.indexOf('function createTvModule(', start);
  const block = source.slice(start, end);
  assert.match(block, /group\.userData\.kind = 'module'/);
  assert.match(block, /group\.userData\.moduleId = moduleState\.id/);
  assert.match(block, /group\.userData\.moduleType = 'illuminated-foam'/);
  assert.match(block, /group\.userData\.type = 'illuminated-foam'/);
  assert.match(block, /group\.userData\.widthCm/);
  assert.match(block, /group\.userData\.depthCm/);
  assert.match(block, /group\.userData\.heightCm/);
});
