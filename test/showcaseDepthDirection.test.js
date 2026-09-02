import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

test('showcase extra depth projects behind the panel, not in front', () => {
  assert.match(scene, /const caseFrontZ = depth \/ 2;/);
  assert.match(scene, /const caseCenterZ = caseFrontZ - showcaseDepth \/ 2;/);
  assert.doesNotMatch(scene, /caseCenterZ = \(showcaseDepth - depth\) \/ 2/);
});
