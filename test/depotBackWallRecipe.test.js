import test from 'node:test';
import assert from 'node:assert/strict';
import {
  composeAutomaticBackWallWithDepot,
  composeAutomaticSideWallWithDepot,
} from '../src/automaticWall.js';
import {
  composeDepotAlignedWidths,
  composeDepotBackWidths,
  planAutomaticDepot,
} from '../src/autoDepot.js';

const EXPECTED_DEPOT_BACK = Object.freeze({
  '100x100': [100],
  '150x100': [150],
  '200x100': [200],
  '200x200': [200],
});

test('composeDepotAlignedWidths prefers exact MODULE_WIDTHS panel', () => {
  assert.deepEqual(composeDepotAlignedWidths(50).modules, [50]);
  assert.deepEqual(composeDepotAlignedWidths(100).modules, [100]);
  assert.deepEqual(composeDepotAlignedWidths(150).modules, [150]);
  assert.deepEqual(composeDepotAlignedWidths(200).modules, [200]);
});

test('composeDepotAlignedWidths splits only when exact panel missing (e.g. 250)', () => {
  assert.deepEqual(composeDepotAlignedWidths(250).modules, [200, 50]);
});

test('composeDepotBackWidths uses same exact-or-compose rule for every size', () => {
  assert.deepEqual(composeDepotBackWidths('100x100').modules, [100]);
  assert.deepEqual(composeDepotBackWidths('150x100').modules, [150]);
  assert.deepEqual(composeDepotBackWidths('200x100').modules, [200]);
  assert.deepEqual(composeDepotBackWidths('200x200').modules, [200]);
});

for (const [sizeKey, depotWidths] of Object.entries(EXPECTED_DEPOT_BACK)) {
  test(`${sizeKey} depot back wall uses panels ${depotWidths.join('+')}`, () => {
    const plan = planAutomaticDepot({ standType: 'back-wall', standXCm: 1000, standYCm: 500, sizeKey });
    assert.equal(plan.ok, true);
    const result = composeAutomaticBackWallWithDepot({
      standXCm: 1000,
      depotOriginXCm: plan.originXCm,
      depotWidthCm: plan.widthCm,
      sizeKey: plan.sizeKey,
    });
    assert.equal(result.ok, true);
    const depotPanels = result.modules.filter((item) => item.depotBack);
    assert.deepEqual(depotPanels.map((item) => item.widthCm), depotWidths);
    assert.equal(depotPanels[0].placement.xCm, plan.originXCm);
    assert.equal(result.modules.reduce((sum, item) => sum + item.widthCm, 0), 1000);

    let cursor = plan.originXCm;
    for (const panel of depotPanels) {
      assert.equal(panel.placement.xCm, cursor);
      cursor += panel.widthCm;
    }
  });
}

test('U-stand 2x1 depot back is single 200 not 100+100', () => {
  const plan = planAutomaticDepot({ standType: 'u-stand', standXCm: 900, standYCm: 450, sizeKey: '200x100' });
  assert.equal(plan.ok, true);
  const result = composeAutomaticBackWallWithDepot({
    standXCm: 900,
    depotOriginXCm: plan.originXCm,
    depotWidthCm: plan.widthCm,
    sizeKey: plan.sizeKey,
  });
  const depotPanels = result.modules.filter((item) => item.depotBack);
  assert.deepEqual(depotPanels.map((item) => item.widthCm), [200]);
});

test('1x1 depot back is never a 200 panel', () => {
  const plan = planAutomaticDepot({ standType: 'back-wall', standXCm: 600, standYCm: 400, sizeKey: '100x100' });
  const result = composeAutomaticBackWallWithDepot({
    standXCm: 600,
    depotOriginXCm: plan.originXCm,
    depotWidthCm: plan.widthCm,
    sizeKey: '100x100',
  });
  const depotPanels = result.modules.filter((item) => item.depotBack);
  assert.deepEqual(depotPanels.map((item) => item.widthCm), [100]);
  assert.equal(depotPanels.some((item) => item.widthCm === 200), false);
});

test('L-left 1x1 shared corner side starts with wall 100 not 200', () => {
  const plan = planAutomaticDepot({ standType: 'l-left', standXCm: 500, standYCm: 400, sizeKey: '100x100' });
  const side = composeAutomaticSideWallWithDepot({
    standType: 'l-left',
    standXCm: 500,
    standYCm: 400,
    depotDepthCm: plan.depthCm,
  });
  assert.equal(side.ok, true);
  assert.equal(side.wallId, 'left');
  const depotSide = side.modules.filter((item) => item.depotSide);
  assert.deepEqual(depotSide.map((item) => item.widthCm), [100]);
  assert.equal(side.modules[0].widthCm, 100);
  assert.equal(side.modules.reduce((sum, item) => sum + item.widthCm, 0), 400);
});

test('L-right 1x1 shared corner side starts with wall 100', () => {
  const plan = planAutomaticDepot({ standType: 'l-right', standXCm: 500, standYCm: 400, sizeKey: '100x100' });
  const side = composeAutomaticSideWallWithDepot({
    standType: 'l-right',
    standXCm: 500,
    standYCm: 400,
    depotDepthCm: plan.depthCm,
  });
  assert.equal(side.ok, true);
  assert.equal(side.wallId, 'right');
  assert.deepEqual(side.modules.filter((item) => item.depotSide).map((item) => item.widthCm), [100]);
});

test('island free back uses same exact-or-compose rule', () => {
  const plan21 = planAutomaticDepot({ standType: 'island', standXCm: 600, standYCm: 500, sizeKey: '200x100' });
  const back21 = plan21.specs.filter((spec) => (
    spec.kind === 'wall'
    && spec.placement.rotationZDeg === 0
    && spec.placement.yCm === plan21.originYCm
  ));
  assert.deepEqual(back21.map((spec) => spec.widthCm), [200]);

  const plan22 = planAutomaticDepot({ standType: 'island', standXCm: 600, standYCm: 500, sizeKey: '200x200' });
  const back22 = plan22.specs.filter((spec) => (
    spec.kind === 'wall'
    && spec.placement.rotationZDeg === 0
    && spec.placement.yCm === plan22.originYCm
  ));
  assert.deepEqual(back22.map((spec) => spec.widthCm), [200]);
});
