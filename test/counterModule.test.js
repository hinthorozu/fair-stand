import test from 'node:test';
import assert from 'node:assert/strict';
import { createCounterModuleState, duplicateModuleState } from '../src/designState.js';
import { rotateModulePlacementAroundCenter, snapPlacementToStand, validatePlacementAgainstModules } from '../src/modulePlacement.js';

test('counter state exposes three independent editable faces', () => {
  const counter = createCounterModuleState(150);
  assert.equal(counter.type, 'counter');
  assert.equal(counter.widthCm, 150);
  assert.equal(counter.depthCm, 50);
  assert.equal(counter.heightCm, 100);
  assert.deepEqual(Object.keys(counter.faces), ['front', 'left', 'right']);
  assert.notEqual(counter.faces.front.id, counter.faces.left.id);
  counter.faces.front.color = '#ff0000';
  assert.equal(counter.faces.left.color, '#ffffff');
});

test('duplicating a counter gives every face a new surface id', () => {
  const source = createCounterModuleState(100);
  const copy = duplicateModuleState(source);
  assert.notEqual(copy.id, source.id);
  for (const key of ['front', 'left', 'right']) {
    assert.notEqual(copy.faces[key].id, source.faces[key].id);
  }
});

test('counter free placement stays inside the stand with 50 cm physical depth', () => {
  const result = snapPlacementToStand({
    standType: 'u-stand',
    widthCm: 150,
    depthCm: 50,
    forceFree: true,
    pointerXCm: 220,
    pointerYCm: 20,
    standXCm: 800,
    standYCm: 600,
  });
  assert.equal(result.ok, true);
  assert.equal(result.placement.wallId, 'free');
  assert.equal(result.placement.rotationZDeg, 0);
  assert.equal(result.placement.yCm, 25);
  const validation = validatePlacementAgainstModules({
    placement: result.placement,
    widthCm: 150,
    depthCm: 50,
    moduleId: 'counter',
    modules: [],
    standType: 'u-stand',
    standXCm: 800,
    standYCm: 600,
  });
  assert.equal(validation.ok, true);
});

test('counter depth participates in collision checks', () => {
  const counter = {
    id: 'counter-a', widthCm: 150, depthCm: 50,
    placement: { xCm: 100, yCm: 125, zCm: 0, rotationZDeg: 0, wallId: 'free' },
  };
  const overlap = validatePlacementAgainstModules({
    moduleId: 'counter-b',
    widthCm: 100,
    depthCm: 50,
    placement: { xCm: 150, yCm: 150, zCm: 0, rotationZDeg: 0, wallId: 'free' },
    modules: [counter],
    standType: 'island',
    standXCm: 800,
    standYCm: 600,
  });
  assert.equal(overlap.ok, false);
});

test('counter selected rotation remains free and snaps its 50 cm depth axis safely', () => {
  const rotated = rotateModulePlacementAroundCenter({
    xCm: 100, yCm: 125, zCm: 0, rotationZDeg: 0, wallId: 'free',
  }, 150, 90, 50);
  assert.equal(rotated.rotationZDeg, 90);
  assert.equal((rotated.xCm - 25) % 50, 0);
  assert.equal(rotated.yCm % 50, 0);
});
