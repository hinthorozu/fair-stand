import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const sourceFiles = [
  '../src/catalog.js',
  '../src/designState.js',
  '../src/main.js',
  '../src/moduleBehavior.js',
  '../src/moduleDragSidebar.js',
  '../src/scene3d.js',
];
const source = sourceFiles
  .map((file) => readFileSync(new URL(file, import.meta.url), 'utf8'))
  .join('\n');

test('Yapay Çiçek 2 is removed from every system code path', () => {
  assert.doesNotMatch(source, /indoor-plant-2/);
  assert.doesNotMatch(source, /EXTRA_INDOOR_PLANT_2/);
  assert.doesNotMatch(source, /Yapay Çiçek 2/);
  assert.doesNotMatch(source, /indoor_plants2\.glb/);
});

test('indoor_plants2.glb remains parked in public models for possible future use', () => {
  assert.equal(existsSync(new URL('../public/models/indoor_plants2.glb', import.meta.url)), true);
});
