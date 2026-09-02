import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

test('fabric records its owning surfaces and modules', () => {
  assert.match(scene, /state\.fabricOwnerSurfaceIds = \[\.\.\.fabricOwnerSurfaceIds\]/);
  assert.match(scene, /state\.fabricOwnerModuleIds = \[\.\.\.fabricOwnerModuleIds\]/);
  assert.match(scene, /normalizeFabricOwnership\(\);/);
});

test('single-module fabric overlay is parented to its module', () => {
  assert.match(scene, /const overlayParent = singleModuleGroup \?\? wallRoot/);
  assert.match(scene, /overlayParent\.worldToLocal\(centerWorld\.clone\(\)\)/);
  assert.match(scene, /overlayParent\.add\(overlay\)/);
});

test('multi-module one-piece fabric blocks individual movement', () => {
  assert.match(scene, /function getFabricMoveLock\(moduleId\)/);
  assert.match(scene, /if \(moduleIds\.size > 1\) return/);
  assert.match(scene, /Taşımak için önce kaplamayı kaldır/);
  assert.match(scene, /Döndürmek için önce kaplamayı kaldır/);
});

test('fabric ownership metadata is cleared when fabric is removed', () => {
  assert.match(scene, /delete state\.fabricOwnerSurfaceIds/);
  assert.match(scene, /delete state\.fabricOwnerModuleIds/);
});
