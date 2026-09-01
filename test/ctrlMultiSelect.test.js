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
  assert.match(scene, /\.filter\(\(surface\) => surface\.userData\.selectionMode === 'panel'\)/);
});
