import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyColorOverride,
  createFlatPanelModuleState,
  createSeparatorModuleState,
  createShowcaseModuleState,
  duplicateModuleState,
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

test('duplicating a module preserves its design but creates independent identities', () => {
  const original = createFlatPanelModuleState(150);
  original.strips[1].color = '#ff5500';
  original.strips[3].imageAssetId = 'asset-42';
  original.strips[3].imageTransform = {
    mode: 'rect-group',
    groupAspect: 3,
    regionStartX: 0.25,
    regionStartY: 0,
    regionWidth: 0.5,
    regionHeight: 1,
  };

  const duplicate = duplicateModuleState(original);

  assert.notEqual(duplicate, original);
  assert.notEqual(duplicate.id, original.id);
  assert.equal(duplicate.type, original.type);
  assert.equal(duplicate.widthCm, 150);
  assert.equal(duplicate.strips[1].color, '#ff5500');
  assert.equal(duplicate.strips[3].imageAssetId, 'asset-42');
  assert.deepEqual(duplicate.strips[3].imageTransform, original.strips[3].imageTransform);
  duplicate.strips.forEach((strip, index) => {
    assert.notEqual(strip.id, original.strips[index].id);
  });

  duplicate.strips[1].color = '#000000';
  assert.equal(original.strips[1].color, '#ff5500');
});

test('separator state is color-only and uses the requested module width', () => {
  const separator50 = createSeparatorModuleState(50);
  const separator100 = createSeparatorModuleState(100);

  assert.equal(separator50.type, 'separator');
  assert.equal(separator100.type, 'separator');
  assert.equal(separator50.widthCm, 50);
  assert.equal(separator100.widthCm, 100);
  assert.equal(separator50.surface.color, separator100.surface.color);
  assert.equal('imageAssetId' in separator50.surface, false);

  applyColorOverride(separator50.surface, '#123456');
  assert.equal(separator50.surface.color, '#123456');
  assert.equal('imageAssetId' in separator50.surface, false);
});

test('duplicating a separator preserves color with independent ids', () => {
  const original = createSeparatorModuleState(100);
  original.surface.color = '#654321';

  const duplicate = duplicateModuleState(original);

  assert.notEqual(duplicate.id, original.id);
  assert.notEqual(duplicate.surface.id, original.surface.id);
  assert.equal(duplicate.type, 'separator');
  assert.equal(duplicate.widthCm, 100);
  assert.equal(duplicate.surface.color, '#654321');
});

test('showcase states are 100 cm color-only modules with 2 or 3 compartments', () => {
  const showcase3 = createShowcaseModuleState('showcase-3', 100);
  const showcase2 = createShowcaseModuleState('showcase-2', 100);

  assert.equal(showcase3.type, 'showcase-3');
  assert.equal(showcase2.type, 'showcase-2');
  assert.equal(showcase3.widthCm, 100);
  assert.equal(showcase2.widthCm, 100);
  assert.equal('imageAssetId' in showcase3.surface, false);
  assert.equal('imageAssetId' in showcase2.surface, false);
  assert.equal(createShowcaseModuleState('unknown', 100), null);
});

test('duplicating a showcase preserves its type and color with independent ids', () => {
  const original = createShowcaseModuleState('showcase-3', 100);
  original.surface.color = '#334455';

  const duplicate = duplicateModuleState(original);

  assert.notEqual(duplicate.id, original.id);
  assert.notEqual(duplicate.surface.id, original.surface.id);
  assert.equal(duplicate.type, 'showcase-3');
  assert.equal(duplicate.widthCm, 100);
  assert.equal(duplicate.surface.color, '#334455');
});
