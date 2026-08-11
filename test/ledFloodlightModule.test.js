import test from 'node:test';
import assert from 'node:assert/strict';
import { LED_FLOODLIGHT_DIMENSIONS, MODULE_CATALOG } from '../src/catalog.js';
import { createLedFloodlightModuleState, totalWallWidthCm } from '../src/designState.js';
import { getWallUsedCm, placementsOverlap } from '../src/modulePlacement.js';

test('LED projektor katalogda 50 cm ust aksesuar olarak tanimlidir', () => {
  assert.equal(MODULE_CATALOG.LED_FLOODLIGHT.type, 'led-floodlight');
  assert.equal(LED_FLOODLIGHT_DIMENSIONS.widthCm, 50);
  assert.equal(LED_FLOODLIGHT_DIMENSIONS.depthCm, 20);
  assert.equal(LED_FLOODLIGHT_DIMENSIONS.mountHeightCm, 350);
});

test('LED projektor state sabit siyah govde ve ust aksesuar olculerini tasir', () => {
  const light = createLedFloodlightModuleState();
  assert.equal(light.type, 'led-floodlight');
  assert.equal(light.widthCm, 50);
  assert.equal(light.depthCm, 20);
  assert.equal(light.heightCm, 35);
  assert.equal(light.surface.color, '#17191c');
});

test('LED projektor duvar kapasitesini ve fiziksel collision hesabini etkilemez', () => {
  const wall = { id: 'wall', type: 'flat-panel', widthCm: 100, placement: { xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' } };
  const light = createLedFloodlightModuleState();
  light.placement = { xCm: 0, yCm: 0, zCm: 350, rotationZDeg: 0, wallId: 'back' };
  assert.equal(getWallUsedCm([wall, light], 'back'), 100);
  assert.equal(totalWallWidthCm([wall, light]), 100);
  assert.equal(placementsOverlap(wall, light), false);
});
