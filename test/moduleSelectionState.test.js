import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

test('generic module selection frame never participates in raycast picking', () => {
  assert.match(scene, /frame\.raycast = \(\) => \{\};/);
});

test('clearSelection clears selectedModuleId as part of the central contract', () => {
  assert.match(scene, /function clearSelection[\s\S]*?selectedSurfaces\.clear\(\);\s*selectedModuleId = null;/);
});

test('pointerdown waits for click resolution before changing selectedModuleId', () => {
  assert.doesNotMatch(scene, /if \(moduleState\) selectedModuleId = moduleState\.id;/);
  assert.match(scene, /if \(!wasDragging\) \{\s*handleSurfaceSelectionAt\(startClientX, startClientY, false, clickedModuleId\);/);
});
