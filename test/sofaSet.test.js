import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, SOFA_SET_DIMENSIONS } from '../src/catalog.js';
import { createSofaSetModuleState, duplicateModuleState } from '../src/designState.js';
import { snapPlacementToStand, rotateModulePlacementAroundCenter, validatePlacementAgainstModules } from '../src/modulePlacement.js';

test('koltuk takımı tek katalog modülü ve sabit 250 x 250 cm footprint kullanır', () => {
  assert.equal(MODULE_CATALOG.SOFA_SET.type, 'sofa-set');
  assert.equal(SOFA_SET_DIMENSIONS.loveseatWidthCm, 160);
  assert.equal(SOFA_SET_DIMENSIONS.chairWidthCm, 65);
  assert.equal(SOFA_SET_DIMENSIONS.tableDiameterCm, 60);
  assert.equal(SOFA_SET_DIMENSIONS.widthCm, 250);
  assert.equal(SOFA_SET_DIMENSIONS.depthCm, 250);
});

test('koltuk takımı tek renk state taşır ve kopyada bağımsız surface id üretir', () => {
  const state = createSofaSetModuleState();
  assert.equal(state.type, 'sofa-set');
  assert.equal(state.widthCm, 250);
  assert.equal(state.depthCm, 250);
  state.surface.color = '#112233';
  const copy = duplicateModuleState(state);
  assert.equal(copy.surface.color, '#112233');
  assert.notEqual(copy.surface.id, state.surface.id);
});

test('koltuk takımı serbest yerleşir ve 90 derece döner', () => {
  const placed = snapPlacementToStand({ standType: 'island', widthCm: 250, depthCm: 250, forceFree: true, pointerXCm: 300, pointerYCm: 300, standXCm: 800, standYCm: 800 });
  assert.equal(placed.ok, true);
  assert.equal(placed.placement.wallId, 'free');
  const rotated = rotateModulePlacementAroundCenter(placed.placement, 250, 90, 250);
  assert.equal(rotated.rotationZDeg, 90);
});

test('koltuk takımı gerçek footprint çakışmasını reddeder', () => {
  const modules = [{ id: 'sofa-a', type: 'sofa-set', widthCm: 250, depthCm: 250, placement: { xCm: 100, yCm: 100, zCm: 0, rotationZDeg: 0, wallId: 'free' } }];
  const result = validatePlacementAgainstModules({ moduleId: 'sofa-b', moduleType: 'sofa-set', widthCm: 250, depthCm: 250, placement: { xCm: 150, yCm: 150, zCm: 0, rotationZDeg: 0, wallId: 'free' }, modules, standType: 'island', standXCm: 900, standYCm: 900 });
  assert.equal(result.ok, false);
});
