import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

test('sahne yüzeyleri kalıcı state’e kopya bağlar', () => {
  assert.match(scene, /bindRendererSurfaceState/);
  assert.match(scene, /persistentSurfaceState/);
  assert.match(scene, /function writePersistentSurface\(/);
  assert.doesNotMatch(scene, /surfaceState:\s*moduleState\.surface/);
  assert.doesNotMatch(scene, /surfaceState:\s*moduleState\.bodySurface/);
  assert.doesNotMatch(scene, /surfaceState:\s*doorState/);
});

test('duvar rebuild doku anahtarı nesne kimliği değil surfaceId kullanır', () => {
  const start = scene.indexOf('function getRebuildTextureKey(mesh)');
  const end = scene.indexOf('function retainWallTexturesForRebuild', start);
  const block = scene.slice(start, end);
  assert.match(block, /mesh\?\.userData\?\.surfaceId/);
  assert.doesNotMatch(block, /return surfaceState;/);
});

test('renk yazısı kalıcı yüzeye applyColorOverride ile gider', () => {
  const start = scene.indexOf('function applyColor(meshOrMeshes, hexColor)');
  const end = scene.indexOf('function clearFabricOverlays', start);
  const block = scene.slice(start, end);
  assert.match(block, /writePersistentSurface\(mesh, \(surfaceState\) => \{\s*applyColorOverride\(surfaceState, hexColor\);/s);
  assert.doesNotMatch(block, /applyColorOverride\(mesh\.userData\.surfaceState/);
});
