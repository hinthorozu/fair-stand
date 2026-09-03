import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sceneSource = await readFile(new URL('../src/scene3d.js', import.meta.url), 'utf8');
const catalogDragSource = await readFile(new URL('../src/moduleDragSidebar.js', import.meta.url), 'utf8');

test('all interactive rotation paths resolve their delta through moduleBehavior', () => {
  assert.match(sceneSource, /resolveModuleRotationDeltaDeg\(dragSession\.moduleState, requestedDeltaDeg\)/);
  assert.match(sceneSource, /resolveModuleRotationDeltaDeg\(moduleState, deltaDeg\)/);
  assert.match(catalogDragSource, /resolveModuleRotationDeltaDeg\(activeModuleState, -90\)/);
  assert.doesNotMatch(sceneSource, /getModuleRotationStepDeg/);
  assert.doesNotMatch(catalogDragSource, /getModuleRotationStepDeg/);
});
