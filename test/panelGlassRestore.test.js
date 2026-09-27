import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

function sliceFn(name, nextName) {
  const start = scene.indexOf(`function ${name}(`);
  const end = scene.indexOf(`function ${nextName}(`, start + 1);
  assert.ok(start >= 0 && end > start, name);
  return scene.slice(start, end);
}

for (const [name, next] of [
  ['createBaseModule', 'createCounterModule'],
  ['createCounterModule', 'createLCounterModule'],
  ['createLCounterModule', 'createDoorModule'],
]) {
  test(`${name} restores saved panel glass on rebuild`, () => {
    const body = sliceFn(name, next);
    assert.match(body, /panelFaceBackingMaterial\(isGlass\)/);
    assert.match(body, /panelFaceSurfaceMaterial\(surfaceState\)/);
    assert.match(body, /Boolean\(surfaceState\.isGlass\)/);
  });
}
