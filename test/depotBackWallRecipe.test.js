import test from 'node:test';
import assert from 'node:assert/strict';
import { composeAutomaticBackWallWithDepot } from '../src/automaticWall.js';
import { planAutomaticDepot } from '../src/autoDepot.js';

for (const [sizeKey, depotWidthCm, originXCm] of [['100x100',100,450], ['150x100',150,450], ['200x100',200,400], ['200x200',200,400]]) {
  test(sizeKey + ' depot back wall keeps one exact depot-width panel', () => {
    const plan = planAutomaticDepot({ standType: 'back-wall', standXCm: 1000, standYCm: 500, sizeKey });
    assert.equal(plan.ok, true);
    assert.equal(plan.originXCm, originXCm);
    const result = composeAutomaticBackWallWithDepot({ standXCm: 1000, depotOriginXCm: plan.originXCm, depotWidthCm: plan.widthCm });
    assert.equal(result.ok, true);
    const depotPanels = result.modules.filter((item) => item.depotBack);
    assert.equal(depotPanels.length, 1);
    assert.equal(depotPanels[0].widthCm, depotWidthCm);
    assert.equal(depotPanels[0].placement.xCm, originXCm);
    assert.equal(depotPanels[0].placement.wallId, 'back');
    assert.equal(result.modules.reduce((sum, item) => sum + item.widthCm, 0), 1000);
  });
}
