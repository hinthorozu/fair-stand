import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildLiveAssemblyParts,
  colorIntToCss,
  expandBomRenderInstances,
  listModuleFaceStates,
  mergeAssemblyPoses,
  normalizeAssemblyPartsPayload,
  readItemBoxCm,
  resolveAssemblyPartVisual,
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
        { itemKey: 'panel_hidden', quantity: 1 },
        { itemKey: 'panel_archived', quantity: 1 },
      ],
    },
  };
  const registry = {
    panel_197: {
      itemKey: 'panel_197',
      isRender: true,
      isActive: true,
      defaultColor: 0xff0000,
      dimensions: { widthCm: 197, depthCm: 1.8, heightCm: 47 },
    },
    floor_carpet: {
      itemKey: 'floor_carpet',
      isRender: false,
      defaultColor: 0x111111,
      dimensions: { widthCm: 100, depthCm: 100, heightCm: 1 },
    },
    panel_hidden: {
      itemKey: 'panel_hidden',
      isRender: false,
      isActive: true,
      defaultColor: 0x00ff00,
      dimensions: { widthCm: 10, depthCm: 10, heightCm: 10 },
    },
    panel_archived: {
      itemKey: 'panel_archived',
      isRender: true,
      isActive: false,
      defaultColor: 0x0000ff,
      dimensions: { widthCm: 10, depthCm: 10, heightCm: 10 },
    },
  };
  const parts = expandBomRenderInstances(parent, (key) => registry[key] ?? null);
  assert.equal(parts.length, 2);
  assert.equal(parts[0].childItemKey, 'panel_197');
  assert.equal(parts[0].instanceIndex, 0);
  assert.equal(parts[1].instanceIndex, 1);
  assert.equal(parts[1].zCm, 47);
});

test('buildLiveAssemblyParts drops saved poses for isRender=false children', () => {
  const parent = {
    composition: {
      mode: 'recipe',
      items: [
        { itemKey: 'profile_91', quantity: 1 },
        { itemKey: 'panel_98', quantity: 1 },
      ],
    },
  };
  const registry = {
    profile_91: {
      itemKey: 'profile_91',
      type: 'profile',
      isRender: true,
      isActive: true,
      defaultColor: 0x333333,
      dimensions: { widthCm: 4, depthCm: 4, heightCm: 100 },
    },
    panel_98: {
      itemKey: 'panel_98',
      type: 'panel',
      isRender: false,
      isActive: true,
      defaultColor: 0xffffff,
      dimensions: { widthCm: 98, depthCm: 2, heightCm: 48 },
    },
  };
  const live = buildLiveAssemblyParts(
    parent,
    [
      { childItemKey: 'profile_91', instanceIndex: 0, xCm: 1, yCm: 2, zCm: 3 },
      { childItemKey: 'panel_98', instanceIndex: 0, xCm: 9, yCm: 9, zCm: 9 },
    ],
    (key) => registry[key] ?? null,
  );
  assert.equal(live.length, 1);
  assert.equal(live[0].childItemKey, 'profile_91');
  assert.equal(live[0].xCm, 1);
});

test('resolveAssemblyPartVisual uses frame/panel/top roles', () => {
  const frame = resolveAssemblyPartVisual(
    { type: 'profile', defaultColor: 0x111111 },
    { frameColorCss: '#abcdef' },
  );
  assert.equal(frame.role, 'frame');
  assert.equal(frame.colorCss, '#abcdef');
  assert.equal(frame.metalness, 0.68);

  const panel = resolveAssemblyPartVisual(
    { type: 'panel', defaultColor: 0xffffff },
    { panelColorCss: '#ff0000' },
  );
  assert.equal(panel.role, 'panel');
  assert.equal(panel.colorCss, '#ff0000');

  const panelOwn = resolveAssemblyPartVisual({ type: 'panel', defaultColor: 0x00ff00 }, {});
  assert.equal(panelOwn.colorCss, '#00ff00');

  const top = resolveAssemblyPartVisual({ type: 'counter-top', defaultColor: 0xf8fafc }, {});
  assert.equal(top.role, 'top');
});

test('listModuleFaceStates preserves face objects', () => {
  const faces = listModuleFaceStates({
    faces: {
      frontLower: { id: 'a', color: '#fff' },
      frontUpper: { id: 'b', color: '#eee' },
    },
  });
  assert.equal(faces.length, 2);
  assert.equal(faces[0].id, 'a');
});

test('mergeAssemblyPoses keeps live box fields from BOM (pose does not freeze size)', () => {
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
  assert.equal(merged[0].widthCm, 197);
  assert.equal(merged[0].heightCm, 47);
  assert.equal(merged[0].xCm, 10);
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
    lockGroupId: null,
  });
});

test('normalizeAssemblyPartsPayload keeps lock_group_id', () => {
  const parts = normalizeAssemblyPartsPayload([
    {
      childItemKey: 'a',
      instanceIndex: 0,
      lock_group_id: 1,
    },
    {
      childItemKey: 'b',
      instanceIndex: 0,
      lockGroupId: 1,
    },
  ]);
  assert.equal(parts[0].lockGroupId, 1);
  assert.equal(parts[1].lockGroupId, 1);
});

test('mergeAssemblyPoses copies lockGroupId', () => {
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
    {
      childItemKey: 'panel_197',
      instanceIndex: 0,
      xCm: 10,
      yCm: 5,
      zCm: 20,
      rotationZDeg: 90,
      lockGroupId: 1,
    },
  ]);
  assert.equal(merged[0].lockGroupId, 1);
});
