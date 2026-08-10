import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyColorOverride,
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

test('color override removes the image only from the targeted panel state', () => {
  const module = createFlatPanelModuleState(100);
  module.strips.forEach((strip) => {
    strip.imageAssetId = 'group-image';
    strip.imageTransform = {
      mode: 'rect-group',
      groupAspect: 2,
      regionStartX: 0,
      regionStartY: 0,
      regionWidth: 0.5,
      regionHeight: 0.5,
    };
  });

  applyColorOverride(module.strips[0], '#ff0000');

  assert.equal(module.strips[0].color, '#ff0000');
  assert.equal(module.strips[0].imageAssetId, null);
  assert.equal(module.strips[0].imageTransform.mode, 'single');
  assert.equal(module.strips[1].imageAssetId, 'group-image');
  assert.equal(module.strips[1].imageTransform.mode, 'rect-group');
});
