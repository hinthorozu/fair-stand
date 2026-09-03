import test from 'node:test';
import assert from 'node:assert/strict';
import { planAutomaticDepot } from '../src/autoDepot.js';

function front(plan) {
  return plan.specs.filter((s) => s.kind === 'door' || (s.kind === 'wall' && s.placement.yCm === plan.originYCm + plan.depthCm));
}

for (const sizeKey of ['150x100', '200x100', '200x200']) {
  for (const standType of ['back-wall', 'island', 'u-stand', 'l-right']) {
    test(sizeKey + ' depot door is left for ' + standType, () => {
      const plan = planAutomaticDepot({ standType, standXCm: 600, standYCm: 500, sizeKey });
      assert.equal(plan.ok, true);
      const items = front(plan);
      const panelWidth = plan.widthCm - 100;
      assert.deepEqual(items.map((s) => [s.kind, s.widthCm, s.placement.xCm - plan.originXCm]), [['door', 100, 0], ['wall', panelWidth, 100]]);
    });
  }

  test(sizeKey + ' depot on L-left keeps door toward stand interior', () => {
    const plan = planAutomaticDepot({ standType: 'l-left', standXCm: 600, standYCm: 500, sizeKey });
    assert.equal(plan.ok, true);
    const items = front(plan);
    const panelWidth = plan.widthCm - 100;
    assert.deepEqual(items.map((s) => [s.kind, s.widthCm, s.placement.xCm - plan.originXCm]), [['wall', panelWidth, 0], ['door', 100, panelWidth]]);
  });
}

for (const sizeKey of ['200x100', '200x200']) {
  test(sizeKey + ' uses exactly one 100cm door and one 100cm panel', () => {
    const plan = planAutomaticDepot({ standType: 'back-wall', standXCm: 600, standYCm: 500, sizeKey });
    const items = front(plan);
    assert.equal(items.filter((s) => s.kind === 'door' && s.widthCm === 100).length, 1);
    assert.equal(items.filter((s) => s.kind === 'wall' && s.widthCm === 100).length, 1);
  });
}

test('150x100 uses exactly one 100cm door and one 50cm panel', () => {
  const plan = planAutomaticDepot({ standType: 'back-wall', standXCm: 600, standYCm: 500, sizeKey: '150x100' });
  const items = front(plan);
  assert.equal(items.filter((s) => s.kind === 'door' && s.widthCm === 100).length, 1);
  assert.equal(items.filter((s) => s.kind === 'wall' && s.widthCm === 50).length, 1);
});
