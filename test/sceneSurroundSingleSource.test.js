import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SCENE_SURROUND_M } from '../src/sceneDimensions.js';
import { validateStandSetup } from '../src/standSetup.js';

const standSetupSource = readFileSync(new URL('../src/standSetup.js', import.meta.url), 'utf8');
const scene3dSource = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

test('SCENE_SURROUND_M is the single canonical 1 metre scene surround', () => {
  assert.equal(SCENE_SURROUND_M, 1);

  const result = validateStandSetup({
    standType: 'island',
    xCm: 500,
    yCm: 400,
  });

  assert.equal(result.ok, true);
  assert.equal(result.sceneWidthM, 7);
  assert.equal(result.sceneDepthM, 6);
});

test('setup and renderer consume the canonical scene surround without legacy aliases', () => {
  assert.match(standSetupSource, /import \{ SCENE_SURROUND_M \} from '\.\/sceneDimensions\.js';/);
  assert.match(scene3dSource, /import \{ SCENE_SURROUND_M \} from '\.\/sceneDimensions\.js';/);

  assert.doesNotMatch(standSetupSource, /STAND_SURROUND_M/);
  assert.doesNotMatch(scene3dSource, /STAGE_SURROUND_M/);

  assert.ok((standSetupSource.match(/SCENE_SURROUND_M/g) ?? []).length >= 3);
  assert.equal((scene3dSource.match(/SCENE_SURROUND_M/g) ?? []).length, 12);
});
