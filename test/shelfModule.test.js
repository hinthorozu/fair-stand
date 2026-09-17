import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCatalogItem,
} from '../src/catalog.js';
import { createModuleStateFromDescriptor } from '../src/designState.js';
import { snapPlacementToStand } from '../src/modulePlacement.js';
import { getItem } from '../src/items.js';

test('wall_shelf catalog kayıtları yoktur; leaf shelf_* durur', () => {
  for (const itemKey of [
    'wall_shelf_2_100', 'wall_shelf_3_100',
    'wall_shelf_2_150', 'wall_shelf_3_150',
    'wall_shelf_2_200', 'wall_shelf_3_200',
  ]) {
    assert.equal(getCatalogItem(itemKey), null, itemKey);
    assert.equal(getItem(itemKey), null, itemKey);
  }

  assert.equal(getItem('shelf_100').itemKey, 'shelf_100');
  assert.equal(getItem('shelf_150').itemKey, 'shelf_150');
  assert.equal(getItem('shelf_200').itemKey, 'shelf_200');
  assert.equal(createModuleStateFromDescriptor({ type: 'shelf', widthCm: 100 }), null);
  const state = createModuleStateFromDescriptor({ itemKey: 'shelf_100', type: 'shelf' });
  assert.equal(state.itemKey, 'shelf_100');
  assert.equal(state.type, 'shelf');
});

test('shelf heights sit on Maxima 50 cm panel seams', () => {
  const shelf100 = getItem('shelf_100');
  const shelf150 = getItem('shelf_150');
  const shelf200 = getItem('shelf_200');
  assert.equal(shelf100.dimensions.lengthCm, 100);
  assert.equal(shelf150.dimensions.lengthCm, 150);
  assert.equal(shelf200.dimensions.lengthCm, 200);
  assert.equal(shelf100.dimensions.depthCm, 38);
  assert.equal(shelf100.dimensions.thicknessCm, 1.8);
  assert.equal('projectionCm' in shelf100.dimensions, false);
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
