import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, SOFA_SET_DIMENSIONS } from '../src/catalog.js';
import { createSofaSetModuleState, duplicateModuleState } from '../src/designState.js';
import { snapPlacementToStand, rotateModulePlacementAroundCenter, validatePlacementAgainstModules } from '../src/modulePlacement.js';

test('koltuk takımı tek katalog modülü ve sabit 150 x 150 cm footprint kullanır', () => {
  assert.equal(MODULE_CATALOG.SOFA_SET.type, 'sofa-set');
  assert.equal(SOFA_SET_DIMENSIONS.loveseatWidthCm, 150);
  assert.equal(SOFA_SET_DIMENSIONS.chairWidthCm, 65);
  assert.equal(SOFA_SET_DIMENSIONS.tableDiameterCm, 60);
  assert.equal(SOFA_SET_DIMENSIONS.widthCm, 150);
  assert.equal(SOFA_SET_DIMENSIONS.depthCm, 150);
});

test('koltuk takımı tek renk state taşır ve kopyada bağımsız surface id üretir', () => {
  const state = createSofaSetModuleState();
  assert.equal(state.type, 'sofa-set');
  assert.equal(state.widthCm, 150);
  assert.equal(state.depthCm, 150);
  state.surface.color = '#112233';
  const copy = duplicateModuleState(state);
  assert.equal(copy.surface.color, '#112233');
  assert.notEqual(copy.surface.id, state.surface.id);
});

test('koltuk takımı serbest yerleşir ve 90 derece döner', () => {
  const placed = snapPlacementToStand({ standType: 'island', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 300, pointerYCm: 300, standXCm: 800, standYCm: 800 });
  assert.equal(placed.ok, true);
  assert.equal(placed.placement.wallId, 'free');
  const rotated = rotateModulePlacementAroundCenter(placed.placement, 150, 90, 150);
  assert.equal(rotated.rotationZDeg, 90);
});

test('koltuk takımı gerçek footprint çakışmasını reddeder', () => {
  const modules = [{ id: 'sofa-a', type: 'sofa-set', widthCm: 150, depthCm: 150, placement: { xCm: 100, yCm: 100, zCm: 0, rotationZDeg: 0, wallId: 'free' } }];
  const result = validatePlacementAgainstModules({ moduleId: 'sofa-b', moduleType: 'sofa-set', widthCm: 150, depthCm: 150, placement: { xCm: 150, yCm: 150, zCm: 0, rotationZDeg: 0, wallId: 'free' }, modules, standType: 'island', standXCm: 900, standYCm: 900 });
  assert.equal(result.ok, false);
});


test('koltuk takımı 50 cm grid üzerinde gider ve dört kenara sıfır yanaşır', () => {
  const backLeft = snapPlacementToStand({ standType: 'island', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 10, pointerYCm: 10, standXCm: 600, standYCm: 600 });
  assert.equal(backLeft.ok, true);
  assert.equal(backLeft.placement.xCm, 0);
  assert.equal(backLeft.placement.yCm - 75, 0);

  const grid = snapPlacementToStand({ standType: 'island', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 235, pointerYCm: 235, standXCm: 600, standYCm: 600 });
  assert.equal(grid.ok, true);
  assert.equal(grid.placement.xCm % 50, 0);
  assert.equal((grid.placement.yCm - 75) % 50, 0);

  const frontRight = snapPlacementToStand({ standType: 'island', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 590, pointerYCm: 590, standXCm: 600, standYCm: 600 });
  assert.equal(frontRight.ok, true);
  assert.equal(frontRight.placement.xCm + 150, 600);
  assert.equal(frontRight.placement.yCm + 75, 600);
});


test('koltuk takımı köşelerde iki eksende de sıfıra oturur', () => {
  const tl = snapPlacementToStand({ standType: 'island', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 120, pointerYCm: 120, standXCm: 600, standYCm: 600 });
  assert.equal(tl.ok, true);
  assert.equal(tl.placement.xCm, 0);
  assert.equal(tl.placement.yCm, 75);
  const br = snapPlacementToStand({ standType: 'island', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 480, pointerYCm: 480, standXCm: 600, standYCm: 600 });
  assert.equal(br.ok, true);
  assert.equal(br.placement.xCm, 450);
  assert.equal(br.placement.yCm, 525);
});
