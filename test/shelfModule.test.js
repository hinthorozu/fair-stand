import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, SHELF_DIMENSIONS } from '../src/catalog.js';
import { createModuleStateFromDescriptor } from '../src/designState.js';
import { snapPlacementToStand } from '../src/modulePlacement.js';
import { getShelfLeafItem, getItem } from '../src/items.js';

test('wall_shelf catalog kayıtları yoktur; leaf shelf_* durur', () => {
  for (const itemKey of [
    'wall_shelf_2_100', 'wall_shelf_3_100',
    'wall_shelf_2_150', 'wall_shelf_3_150',
    'wall_shelf_2_200', 'wall_shelf_3_200',
  ]) {
    assert.equal(MODULE_CATALOG[itemKey], undefined, itemKey);
    assert.equal(getItem(itemKey), null, itemKey);
  }

  assert.equal(getShelfLeafItem(100).itemKey, 'shelf_100');
  assert.equal(getShelfLeafItem(150).itemKey, 'shelf_150');
  assert.equal(getShelfLeafItem(200).itemKey, 'shelf_200');
  assert.equal(createModuleStateFromDescriptor({ type: 'shelf', widthCm: 100 }), null);
});

test('shelf heights sit on Maxima 50 cm panel seams', () => {
  assert.deepEqual(SHELF_DIMENSIONS.heightsByCountCm[2], [100, 150]);
  assert.equal(Object.hasOwn(SHELF_DIMENSIONS.heightsByCountCm, '3'), false);
  assert.equal(getShelfLeafItem(100).dimensions.depthCm, 38);
  assert.equal('projectionCm' in SHELF_DIMENSIONS, false);
  assert.equal('thicknessCm' in SHELF_DIMENSIONS, false);
});

test('shelf module uses normal wall placement instead of floor-fixture depth rules', () => {
  const result = snapPlacementToStand({
    standType: 'back-wall',
    widthCm: 200,
    pointerXCm: 210,
    pointerYCm: 10,
    standXCm: 600,
    standYCm: 400,
  });
  assert.equal(result.ok, true);
  assert.equal(result.placement.wallId, 'back');
  assert.equal(result.placement.rotationZDeg, 0);
});
