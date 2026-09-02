import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MODULE_CATALOG } from '../src/catalog.js';
import { getModuleGhostBehavior } from '../src/moduleBehavior.js';

test('every current and future module inherits the lightweight silhouette ghost rule', () => {
  const expected = { kind: 'silhouette', renderer: 'module-silhouette', opacity: 0.38 };
  assert.deepEqual(getModuleGhostBehavior('future-module-without-explicit-ghost'), expected);
  for (const module of Object.values(MODULE_CATALOG)) {
    assert.deepEqual(getModuleGhostBehavior(module), expected);
  }
});

test('scene ghost reuses normal module geometry and one textureless basic material', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /function createRenderableModule\(moduleState, moduleIndex, onSurfaceReady = null\)/);
  assert.match(scene, /const built = createRenderableModule\(moduleOrWidthCm, -1, null\)/);
  assert.match(scene, /new THREE\.MeshBasicMaterial\(\{[\s\S]*?transparent: true,[\s\S]*?depthWrite: false,[\s\S]*?depthTest: false,[\s\S]*?toneMapped: false,[\s\S]*?fog: false/);
  assert.match(scene, /object\.material = ghostMaterial/);
  assert.match(scene, /object\.castShadow = false/);
  assert.match(scene, /object\.receiveShadow = false/);
  assert.match(scene, /object\.raycast = \(\) => \{\}/);
  assert.match(scene, /object\.isLight[\s\S]*?object\.visible = false/);
  assert.match(scene, /object\.add = \(\.\.\.children\) =>/);
  assert.doesNotMatch(scene, /ghostBehavior\.renderer ===/);
});

test('placement ghost is a singleton instead of a per-model cache', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.doesNotMatch(scene, /placementGhostTemplates/);
  assert.match(scene, /if \(placementGhost\?\.key === key\) return placementGhost/);
  assert.match(scene, /destroyPlacementGhost\(\);\n    placementGhost = createPlacementGhost/);
  assert.match(scene, /function disposePlacementGhost\(\) \{\n    if \(!placementGhost\) return;\n    placementGhost\.root\.visible = false/);
});
