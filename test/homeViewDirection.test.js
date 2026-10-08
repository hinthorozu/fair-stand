import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolveHomeViewDirection } from '../src/viewCube.js';

const viewCubeSource = await readFile(new URL('../src/viewCube.js', import.meta.url), 'utf8');
const sceneSource = await readFile(new URL('../src/scene3d.js', import.meta.url), 'utf8');

test('l-right home looks from the left-front corner', () => {
  const right = resolveHomeViewDirection('l-right');
  assert.ok(right.x < 0);
  assert.ok(right.y > 0);
  assert.ok(right.z > 0);

  for (const standType of ['l-left', 'u-stand', 'back-wall', 'island', null]) {
    const direction = resolveHomeViewDirection(standType);
    assert.ok(direction.x > 0, standType ?? 'empty');
    assert.ok(direction.z > 0);
  }
});

test('view cube clicks ask the editor to draw the new camera', () => {
  assert.match(viewCubeSource, /animateToDirection\(getHomeDirection\?\.\(\) \?\? HOME_DIRECTION\)/);
  assert.match(viewCubeSource, /onViewChange\?\.\(\)/);
  assert.match(
    sceneSource,
    /resolveHomeViewDirection\(stageLayout\?\.standType\),\s*requestEditorRender/,
  );
});
