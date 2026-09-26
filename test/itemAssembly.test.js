import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  buildLiveAssemblyParts,
  colorIntToCss,
  computeAssemblyPartsAabbCm,
  computeAssemblySceneFitTransform,
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

test('computeAssemblyPartsAabbCm unions axis-aligned parts', () => {
  const aabb = computeAssemblyPartsAabbCm([
    {
      xCm: 0, yCm: 0, zCm: 0,
      widthCm: 100, depthCm: 20, heightCm: 50,
      rotationXDeg: 0, rotationYDeg: 0, rotationZDeg: 0,
    },
    {
      xCm: 150, yCm: 10, zCm: 0,
      widthCm: 100, depthCm: 20, heightCm: 50,
      rotationXDeg: 0, rotationYDeg: 0, rotationZDeg: 0,
    },
  ]);
  assert.ok(aabb);
  assert.equal(aabb.minX, -50);
  assert.equal(aabb.maxX, 200);
  assert.equal(aabb.widthCm, 250);
  assert.equal(aabb.depthCm, 30);
  assert.equal(aabb.heightCm, 50);
});

test('computeAssemblySceneFitTransform scales W to scene target; missing axes stay 1', () => {
  const aabb = {
    minX: -50, minY: 0, minZ: 0,
    maxX: 200, maxY: 30, maxZ: 50,
    widthCm: 250, depthCm: 30, heightCm: 50,
  };
  const fit = computeAssemblySceneFitTransform(aabb, {
    widthCm: 100,
    depthCm: null,
    heightCm: 50,
  });
  assert.ok(fit);
  assert.equal(fit.scale.x, 100 / 250);
  assert.equal(fit.scale.y, 1);
  assert.equal(fit.scale.z, 1);
  // Merkez X=(−50+200)/2=75 → posX = −75*(100/250)/100
  assert.equal(fit.positionM.x, (-75 * (100 / 250)) / 100);
  assert.equal(fit.positionM.y, 0);
  assert.equal(fit.positionM.z, (-15 * 1) / 100);
});

test('computeAssemblySceneFitTransform centers W/D like procedural base placement', () => {
  const aabb = {
    minX: 0, minY: 0, minZ: 10,
    maxX: 200, maxY: 40, maxZ: 110,
    widthCm: 200, depthCm: 40, heightCm: 100,
  };
  const fit = computeAssemblySceneFitTransform(aabb, {
    widthCm: 100,
    depthCm: 20,
    heightCm: 50,
  });
  assert.deepEqual(fit.scale, { x: 0.5, y: 0.5, z: 0.5 });
  // center X=100, Y=20; minZ=10 → after scale footprint ±50 / ±10, height 0..50
  assert.deepEqual(fit.positionM, {
    x: (-100 * 0.5) / 100,
    y: (-10 * 0.5) / 100,
    z: (-20 * 0.5) / 100,
  });
});

test('computeAssemblySceneFitTransform returns null when target W/D/H all missing', () => {
  const aabb = {
    minX: 0, minY: 0, minZ: 0,
    maxX: 10, maxY: 10, maxZ: 10,
    widthCm: 10, depthCm: 10, heightCm: 10,
  };
  assert.equal(computeAssemblySceneFitTransform(aabb, {}), null);
  assert.equal(computeAssemblySceneFitTransform(aabb, {
    widthCm: null, depthCm: null, heightCm: null,
  }), null);
});

test('createItemAssemblyModule fits content to resolveModuleSceneBoxCm', () => {
  const source = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const start = source.indexOf('function createItemAssemblyModule');
  const end = source.indexOf('function createFlatPanelModule');
  assert.ok(start >= 0 && end > start, 'createItemAssemblyModule slice missing');
  const body = source.slice(start, end);
  assert.match(body, /resolveModuleSceneBoxCm\(moduleState\)/);
  assert.match(body, /computeAssemblyPartsAabbCm\(drawnSpecs\)/);
  assert.match(body, /computeAssemblySceneFitTransform\(/);
  assert.match(body, /content\.scale\.set\(fit\.scale\.x,\s*fit\.scale\.z,\s*fit\.scale\.y\)/);
  assert.match(body, /content\.position\.set\(fit\.positionM\.x,\s*fit\.positionM\.y,\s*fit\.positionM\.z\)/);
  assert.match(body, /content\.add\(mesh\)/);
  assert.doesNotMatch(body, /group\.add\(mesh\)/);
});
