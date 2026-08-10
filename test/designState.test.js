import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createFlatPanelModuleState,
  reconcileWallModules,
  totalWallWidthCm,
} from '../src/designState.js';

test('adding a module preserves existing panel color and image state', () => {
  const first = createFlatPanelModuleState(200);
  first.strips[2].color = '#ff6600';
  first.strips[2].imageAssetId = 'logo-1';

  const reconciled = reconcileWallModules([first], [200, 100]);

  assert.equal(reconciled[0], first);
  assert.equal(reconciled[0].strips[2].color, '#ff6600');
  assert.equal(reconciled[0].strips[2].imageAssetId, 'logo-1');
  assert.equal(reconciled[1].widthCm, 100);
  assert.equal(reconciled[1].strips[0].color, '#ffffff');
  assert.equal(totalWallWidthCm(reconciled), 300);
});

test('same automatic wall composition reuses existing module state', () => {
  const modules = [
    createFlatPanelModuleState(200),
    createFlatPanelModuleState(150),
  ];
  modules[1].strips[5].color = '#112233';

  const reconciled = reconcileWallModules(modules, [200, 150]);

  assert.equal(reconciled[0], modules[0]);
  assert.equal(reconciled[1], modules[1]);
  assert.equal(reconciled[1].strips[5].color, '#112233');
});
