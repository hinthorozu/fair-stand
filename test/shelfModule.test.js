import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, SHELF_DIMENSIONS } from '../src/catalog.js';
import { createShelfModuleState, duplicateModuleState } from '../src/designState.js';
import { snapPlacementToStand } from '../src/modulePlacement.js';

test('shelf catalog exposes 100 150 200 cm widths in 2 and 3 shelf variants', () => {
  const variants = [
    ['SHELF_2_100', 100, 2], ['SHELF_3_100', 100, 3],
    ['SHELF_2_150', 150, 2], ['SHELF_3_150', 150, 3],
    ['SHELF_2_200', 200, 2], ['SHELF_3_200', 200, 3],
  ];
  variants.forEach(([key, widthCm, shelfCount]) => {
    assert.equal(MODULE_CATALOG[key].type, 'shelf');
    assert.equal(MODULE_CATALOG[key].widthCm, widthCm);
    assert.equal(MODULE_CATALOG[key].shelfCount, shelfCount);
  });
});

test('shelf heights sit on Maxima 50 cm panel seams', () => {
  assert.deepEqual(SHELF_DIMENSIONS.heightsByCountCm[2], [100, 150]);
  assert.deepEqual(SHELF_DIMENSIONS.heightsByCountCm[3], [100, 150, 200]);
  assert.equal(SHELF_DIMENSIONS.projectionCm, 38);
});

test('shelf state keeps seven editable wall panels and its shelf count', () => {
  const shelf = createShelfModuleState(150, 3);
  assert.equal(shelf.type, 'shelf');
  assert.equal(shelf.widthCm, 150);
  assert.equal(shelf.shelfCount, 3);
  assert.equal(shelf.strips.length, 7);
  assert.equal('depthCm' in shelf, false);
  assert.equal(createShelfModuleState(50, 2), null);
  assert.equal(createShelfModuleState(100, 4), null);
});

test('duplicating a shelf preserves panel design with independent surface ids', () => {
  const source = createShelfModuleState(200, 2);
  source.strips[2].color = '#123456';
  source.strips[4].imageAssetId = 'shelf-art';
  const copy = duplicateModuleState(source);
  assert.notEqual(copy.id, source.id);
  assert.equal(copy.shelfCount, 2);
  assert.equal(copy.strips[2].color, '#123456');
  assert.equal(copy.strips[4].imageAssetId, 'shelf-art');
  copy.strips.forEach((strip, index) => assert.notEqual(strip.id, source.strips[index].id));
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
