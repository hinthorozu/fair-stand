import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('multi-panel lightbox fabric is exposed from panel context menu', () => {
  const menu = readFileSync(new URL('../src/moduleContextMenu.js', import.meta.url), 'utf8');
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(menu, /data-module-action="toggle-fabric"/);
  assert.match(menu, /Beze çevir/);
  assert.match(menu, /Bezden çıkar/);
  assert.match(main, /function changeContextFabricMode/);
  assert.match(main, /scene3d\.applyFabricMode\(selectedPanels, enabled\)/);
});

test('fabric conversion requires a rectangular multi-panel block and renders one overlay', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /function applyFabricMode\(meshOrMeshes, enabled\)/);
  assert.match(scene, /meshes\.length < 2/);
  assert.match(scene, /createRectSelection\(/);
  assert.match(scene, /fabricGroupId/);
  assert.match(scene, /function rebuildFabricOverlays\(\)/);
  assert.match(scene, /role = 'lightbox-fabric'/);
  assert.match(scene, /new THREE\.PlaneGeometry\(width, height\)/);
  assert.match(scene, /overlay\.raycast = \(\) => \{\}/);
});
