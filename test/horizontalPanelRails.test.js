import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

test('panel systems keep only bottom and top horizontal profiles', () => {
  assert.doesNotMatch(scene, /for \(let i = 0; i <= stripCount; i \+= 1\)/);
  assert.doesNotMatch(scene, /for \(let index = 0; index <= stripCount; index \+= 1\)/);
  assert.equal(
    (scene.match(/for \(const y of \[0, stripCount \* stripHeight\]\)/g) ?? []).length,
    2,
  );
});

test('counter and door panel systems do not create intermediate horizontal rails', () => {
  assert.doesNotMatch(scene, /const railYs = \[0, stripHeightM, frameHeightM\]/);
  assert.doesNotMatch(scene, /const railYs = \[\s*0,\s*doorHeight,/);
  assert.ok(
    (scene.match(/const railYs = \[0, frameHeightM\];/g) ?? []).length >= 2,
  );
  assert.match(scene, /const railYs = \[0, height\];/);
});
