import test from 'node:test';
import assert from 'node:assert/strict';
import { moble_bar_stool_classic_DIMENSIONS, MODULE_CATALOG } from '../src/catalog.js';
import { createBarStoolModuleState } from '../src/designState.js';
import { snapPlacementToStand } from '../src/modulePlacement.js';

test('bar taburesi 50 x 50 x 80 cm ölçülerini kullanır', () => {
  assert.deepEqual(moble_bar_stool_classic_DIMENSIONS, { widthCm: 50, depthCm: 50, heightCm: 80 });
  assert.equal(MODULE_CATALOG.moble_bar_stool_classic.widthCm, 50);
  assert.equal(MODULE_CATALOG.moble_bar_stool_classic.depthCm, 50);
  assert.equal(MODULE_CATALOG.moble_bar_stool_classic.heightCm, 80);
  const state = createBarStoolModuleState();
  assert.equal(state.type, 'bar-stool');
  assert.equal(state.widthCm, 50);
  assert.equal(state.depthCm, 50);
  assert.equal(state.heightCm, 80);
});

test('bar taburesi serbest gezer ve duvar iç yüzüne sıfır yanaşır', () => {
  const left = snapPlacementToStand({ standType: 'l-left', moduleType: 'bar-stool', widthCm: 50, depthCm: 50, forceFree: true, pointerXCm: 40, pointerYCm: 40, standXCm: 600, standYCm: 600 });
  assert.equal(left.ok, true);
  assert.equal(left.placement.xCm, 5);
  assert.equal(left.placement.yCm, 30);

  const right = snapPlacementToStand({ standType: 'l-right', moduleType: 'bar-stool', widthCm: 50, depthCm: 50, forceFree: true, pointerXCm: 560, pointerYCm: 40, standXCm: 600, standYCm: 600 });
  assert.equal(right.ok, true);
  assert.equal(right.placement.xCm, 545);
  assert.equal(right.placement.yCm, 30);

  const island = snapPlacementToStand({ standType: 'island', moduleType: 'bar-stool', widthCm: 50, depthCm: 50, forceFree: true, pointerXCm: 40, pointerYCm: 40, standXCm: 600, standYCm: 600 });
  assert.equal(island.ok, true);
  assert.equal(island.placement.xCm, 0);
  assert.equal(island.placement.yCm, 25);
});
