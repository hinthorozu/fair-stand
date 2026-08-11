import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, TABLE_CHAIR_SET_DIMENSIONS } from '../src/catalog.js';
import { createTableChairSetModuleState } from '../src/designState.js';
import { snapPlacementToStand } from '../src/modulePlacement.js';

test('masa sandalye takımı 120 x 120 cm sabit footprint ve 75 cm masa kullanır', () => {
  assert.equal(TABLE_CHAIR_SET_DIMENSIONS.widthCm, 120);
  assert.equal(TABLE_CHAIR_SET_DIMENSIONS.depthCm, 120);
  assert.equal(TABLE_CHAIR_SET_DIMENSIONS.tableDiameterCm, 75);
  assert.equal(MODULE_CATALOG.TABLE_CHAIR_SET.widthCm, 120);
  assert.equal(MODULE_CATALOG.TABLE_CHAIR_SET.depthCm, 120);
  const state = createTableChairSetModuleState();
  assert.equal(state.type, 'table-chair-set');
  assert.equal(state.widthCm, 120);
  assert.equal(state.depthCm, 120);
});

test('masa sandalye takımı serbest gezer ve duvar iç yüzüne sıfır yanaşır', () => {
  const left = snapPlacementToStand({ standType: 'l-left', moduleType: 'table-chair-set', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 120, pointerYCm: 120, standXCm: 600, standYCm: 600 });
  assert.equal(left.ok, true);
  assert.equal(left.placement.xCm, 5);
  assert.equal(left.placement.yCm, 80);

  const right = snapPlacementToStand({ standType: 'l-right', moduleType: 'table-chair-set', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 480, pointerYCm: 120, standXCm: 600, standYCm: 600 });
  assert.equal(right.ok, true);
  assert.equal(right.placement.xCm, 445);
  assert.equal(right.placement.yCm, 80);

  const island = snapPlacementToStand({ standType: 'island', moduleType: 'table-chair-set', widthCm: 150, depthCm: 150, forceFree: true, pointerXCm: 120, pointerYCm: 120, standXCm: 600, standYCm: 600 });
  assert.equal(island.ok, true);
  assert.equal(island.placement.xCm, 0);
  assert.equal(island.placement.yCm, 75);
});
