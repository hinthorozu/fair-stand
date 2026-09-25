import test from 'node:test';
import assert from 'node:assert/strict';

import {
  colorIntToCss,
  expandBomRenderInstances,
  mergeAssemblyPoses,
  normalizeAssemblyPartsPayload,
  readItemBoxCm,
} from '../src/itemAssembly.js';

test('colorIntToCss pads hex', () => {
  assert.equal(colorIntToCss(0xffffff), '#ffffff');
  assert.equal(colorIntToCss(255), '#0000ff');
  assert.equal(colorIntToCss(null), '#9ca3af');
});

test('readItemBoxCm prefers sceneDimensions', () => {
  const box = readItemBoxCm({
    dimensions: { widthCm: 100, depthCm: 10, heightCm: 50 },
    sceneDimensions: { widthCm: 200, depthCm: 8, heightCm: 350 },
  });
  assert.deepEqual(box, { widthCm: 200, depthCm: 8, heightCm: 350 });
});

test('expandBomRenderInstances expands isRender children only', () => {
  const parent = {
    composition: {
      mode: 'recipe',
      items: [
        { itemKey: 'panel_197', quantity: 2 },
        { itemKey: 'floor_carpet', quantity: 1 },
      ],
    },
  };
  const registry = {
    panel_197: {
      itemKey: 'panel_197',
      isRender: true,
      defaultColor: 0xff0000,
      dimensions: { widthCm: 197, depthCm: 1.8, heightCm: 47 },
    },
    floor_carpet: {
      itemKey: 'floor_carpet',
      isRender: false,
      defaultColor: 0x111111,
      dimensions: { widthCm: 100, depthCm: 100, heightCm: 1 },
    },
  };
  const parts = expandBomRenderInstances(parent, (key) => registry[key] ?? null);
  assert.equal(parts.length, 2);
  assert.equal(parts[0].childItemKey, 'panel_197');
  assert.equal(parts[0].instanceIndex, 0);
  assert.equal(parts[1].instanceIndex, 1);
  assert.equal(parts[1].zCm, 47);
});

test('mergeAssemblyPoses overlays saved poses', () => {
  const bom = [
    {
      childItemKey: 'panel_197',
      instanceIndex: 0,
      widthCm: 197,
      depthCm: 1.8,
      heightCm: 47,
      colorCss: '#ff0000',
      xCm: 0,
      yCm: 0,
      zCm: 0,
      rotationZDeg: 0,
    },
  ];
  const merged = mergeAssemblyPoses(bom, [
    { childItemKey: 'panel_197', instanceIndex: 0, xCm: 10, yCm: 5, zCm: 20, rotationZDeg: 90 },
  ]);
  assert.equal(merged[0].xCm, 10);
  assert.equal(merged[0].rotationZDeg, 90);
});

test('normalizeAssemblyPartsPayload accepts snake and camel', () => {
  const parts = normalizeAssemblyPartsPayload([
    {
      child_item_key: 'panel_197',
      instance_index: 1,
      x_cm: 1,
      y_cm: 2,
      z_cm: 3,
      rotation_z_deg: 45,
    },
  ]);
  assert.deepEqual(parts[0], {
    childItemKey: 'panel_197',
    instanceIndex: 1,
    xCm: 1,
    yCm: 2,
    zCm: 3,
    rotationXDeg: 0,
    rotationYDeg: 0,
    rotationZDeg: 45,
  });
});
