import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Ctrl/Cmd left click is captured before OrbitControls and selects a rectangle', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /if \(event\.button !== 0 \|\| !\(event\.ctrlKey \|\| event\.metaKey\)\) return/);
  assert.match(scene, /event\.preventDefault\(\);\s*event\.stopImmediatePropagation\(\);\s*handleSurfaceSelectionAt\(event\.clientX, event\.clientY, true\)/s);
  assert.match(scene, /\}, \{ capture: true \}\);/);
  assert.doesNotMatch(scene, /function toggleSurfaceSelection\(mesh\)/);
  assert.match(scene, /const canRectangleSelect = rectangleSelect[\s\S]*selectionMode === 'panel'[\s\S]*selectRectangleTo\(hit\.object\)/);
  assert.match(scene, /function getSurfaceSelectionPlaneMeta\(surface\)/);
  assert.match(scene, /planeKey: `wall:\$\{wallId\}`/);
  assert.match(scene, /planeKey: `free:\$\{axis\}:\$\{quantizedCrossCm\}`/);
  assert.match(scene, /anchorMeta\.planeKey !== targetMeta\.planeKey/);
  assert.match(scene, /createConnectedPanelModulePath/);
  assert.match(scene, /anchorMeta\.wallId === 'free' && targetMeta\.wallId === 'free'/);
  assert.match(scene, /const freePathSet = new Set\(freePath\.moduleIds\)/);
  assert.match(scene, /const wallIds = \['back', 'left', 'right'\]/);
  assert.match(scene, /\.filter\(\(entry\) => wallIds\.includes\(entry\.meta\?\.wallId\)\)/);
  assert.match(scene, /const crossWallResult = createPanelRangeSelection\([\s\S]*wallPanels[\s\S]*moduleIndex: Number\(anchorMesh\.userData\.moduleIndex\)[\s\S]*moduleIndex: Number\(mesh\.userData\.moduleIndex\)/);
  assert.doesNotMatch(scene, /anchorMeta\.wallId !== targetMeta\.wallId/);
  assert.match(scene, /const pathCm = wallId === 'back'[\s\S]*Number\(placement\.xCm\)[\s\S]*Number\(placement\.yCm\)/);
  assert.match(scene, /orderedModules[\s\S]*sort\(\(a, b\) => \(a\.pathCm - b\.pathCm\)\)/);
  assert.match(scene, /columnByModuleId/);
  assert.match(scene, /planePanels\.map/);
  assert.match(scene, /\.filter\(\(entry\) => entry\.meta\?\.planeKey === anchorMeta\.planeKey\)/);
});
