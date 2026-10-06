import test from 'node:test';
import assert from 'node:assert/strict';
import { applyCounterFacePanelIdentity, createCounterModuleState, duplicateModuleState, normalizeModuleItemState } from '../src/designState.js';
import { getItem } from '../src/items.js';
import { rotateModulePlacementAroundCenter, snapPlacementToStand, validatePlacementAgainstModules } from '../src/modulePlacement.js';

test('100, 150 and 200 cm counters expose six independent stacked editable faces', () => {
  const faceKeys = [
    'frontLower', 'frontUpper',
    'leftLower', 'leftUpper',
    'rightLower', 'rightUpper',
  ];

  for (const widthCm of [100, 150, 200]) {
    const counter = createCounterModuleState(widthCm);
    assert.equal(counter.type, 'counter');
    assert.equal(counter.widthCm, widthCm);
    assert.equal(counter.depthCm, 50);
    assert.equal(counter.heightCm, 100);
    assert.deepEqual(Object.keys(counter.faces), faceKeys);
    assert.equal(new Set(faceKeys.map((key) => counter.faces[key].id)).size, 6);
    counter.faces.frontLower.color = '#ff0000';
    assert.equal(counter.faces.frontUpper.color, '#ffffff');
    assert.equal(counter.faces.leftLower.color, '#ffffff');
  }
});

test('duplicating a counter gives all six panels new surface ids', () => {
  const source = createCounterModuleState(100);
  const copy = duplicateModuleState(source);
  assert.notEqual(copy.id, source.id);
  for (const key of Object.keys(source.faces)) {
    assert.notEqual(copy.faces[key].id, source.faces[key].id);
  }
});

test('counter free placement stays inside the stand with 50 cm physical depth', () => {
  const result = snapPlacementToStand({
    standType: 'u-stand',
    widthCm: 150,
    depthCm: 50,
    forceFree: true,
    pointerXCm: 220,
    pointerYCm: 20,
    standXCm: 800,
    standYCm: 600,
  });
  assert.equal(result.ok, true);
  assert.equal(result.placement.wallId, 'free');
  assert.equal(result.placement.rotationZDeg, 0);
  assert.equal(result.placement.yCm, 25);
  const validation = validatePlacementAgainstModules({
    placement: result.placement,
    widthCm: 150,
    depthCm: 50,
    moduleId: 'counter',
    modules: [],
    standType: 'u-stand',
    standXCm: 800,
    standYCm: 600,
  });
  assert.equal(validation.ok, true);
});

test('counter depth participates in collision checks', () => {
  const counter = {
    id: 'counter-a', widthCm: 150, depthCm: 50,
    placement: { xCm: 100, yCm: 125, zCm: 0, rotationZDeg: 0, wallId: 'free' },
  };
  const overlap = validatePlacementAgainstModules({
    moduleId: 'counter-b',
    widthCm: 100,
    depthCm: 50,
    placement: { xCm: 150, yCm: 150, zCm: 0, rotationZDeg: 0, wallId: 'free' },
    modules: [counter],
    standType: 'island',
    standXCm: 800,
    standYCm: 600,
  });
  assert.equal(overlap.ok, false);
});

test('counter selected rotation remains free and snaps its 50 cm depth axis safely', () => {
  const rotated = rotateModulePlacementAroundCenter({
    xCm: 100, yCm: 125, zCm: 0, rotationZDeg: 0, wallId: 'free',
  }, 150, 90, 50);
  assert.equal(rotated.rotationZDeg, 90);
  assert.equal((rotated.xCm - 25) % 50, 0);
  assert.equal(rotated.yCm % 50, 0);
});

const COUNTER_FACE_CASES = [
  { widthCm: 100, shape: null, wideKey: 'panel_98' },
  { widthCm: 150, shape: null, wideKey: 'panel_147_5' },
  { widthCm: 200, shape: null, wideKey: 'panel_197' },
  { widthCm: 100, shape: 'L', wideKey: 'panel_98' },
  { widthCm: 150, shape: 'L', wideKey: 'panel_147_5' },
  { widthCm: 200, shape: 'L', wideKey: 'panel_197' },
];

function expectedCounterFaceKey(shape, faceKey, wideKey) {
  if (shape === 'L') {
    return faceKey.startsWith('front') || faceKey.startsWith('right') ? wideKey : 'panel_48_5';
  }
  return faceKey.startsWith('front') ? wideKey : 'panel_48_5';
}

function assertCounterFacePanels(counter, shape, wideKey) {
  for (const [faceKey, face] of Object.entries(counter.faces)) {
    assert.equal(face.itemKey, expectedCounterFaceKey(shape, faceKey, wideKey), `${counter.itemKey} ${faceKey}`);
  }
}

function counterParentInAlphabeticalOrder(itemKey) {
  const item = getItem(itemKey);
  const items = [...item.composition.items].sort((left, right) => (
    left.itemKey < right.itemKey ? -1 : left.itemKey > right.itemKey ? 1 : 0
  ));
  return {
    shape: item.shape,
    dimensions: item.dimensions,
    composition: { mode: 'recipe', items },
  };
}

function blankCounterFaces(shape) {
  const keys = [
    'frontLower', 'frontUpper', 'leftLower', 'leftUpper', 'rightLower', 'rightUpper',
  ];
  if (shape === 'L') keys.push('returnLower', 'returnUpper');
  return Object.fromEntries(keys.map((key) => [key, {
    color: '#abcdef',
    imageAssetId: 'logo',
  }]));
}

test('counter faces take the wide or 48.5 panel from the opening, in recipe order and in alphabetical order', () => {
  for (const { widthCm, shape, wideKey } of COUNTER_FACE_CASES) {
    const options = shape === 'L' ? { shape: 'L' } : {};
    const created = createCounterModuleState(widthCm, options);
    assertCounterFacePanels(created, shape, wideKey);
    const faces = blankCounterFaces(shape);
    applyCounterFacePanelIdentity(faces, counterParentInAlphabeticalOrder(created.itemKey), 'stamp');
    assertCounterFacePanels({ itemKey: created.itemKey, faces }, shape, wideKey);
    assert.equal(faces.frontLower.imageAssetId, 'logo');
  }
});

test('opening a counter rewrites a recipe panel on the wrong face and keeps the image and color', () => {
  const straight = createCounterModuleState(100);
  straight.faces.frontLower.itemKey = 'panel_48_5';
  straight.faces.frontLower.widthCm = 48.5;
  straight.faces.frontLower.heightCm = 47;
  straight.faces.frontLower.color = '#112233';
  straight.faces.frontLower.imageAssetId = 'logo';
  straight.faces.frontLower.imageTransform = { mode: 'single' };
  straight.faces.rightLower.itemKey = 'panel_98';
  normalizeModuleItemState(straight);
  assert.equal(straight.faces.frontLower.itemKey, 'panel_98');
  assert.equal(straight.faces.frontLower.color, '#112233');
  assert.equal(straight.faces.frontLower.imageAssetId, 'logo');
  assert.deepEqual(straight.faces.frontLower.imageTransform, { mode: 'single' });
  assert.equal(straight.faces.rightLower.itemKey, 'panel_48_5');

  const corner = createCounterModuleState(150, { shape: 'L' });
  corner.faces.leftLower.itemKey = 'panel_147_5';
  corner.faces.rightLower.itemKey = 'panel_48_5';
  corner.faces.returnUpper.imageAssetId = 'logo';
  normalizeModuleItemState(corner);
  assert.equal(corner.faces.leftLower.itemKey, 'panel_48_5');
  assert.equal(corner.faces.rightLower.itemKey, 'panel_147_5');
  assert.equal(corner.faces.frontLower.itemKey, 'panel_147_5');
  assert.equal(corner.faces.returnUpper.itemKey, 'panel_48_5');
  assert.equal(corner.faces.returnUpper.imageAssetId, 'logo');

  const custom = createCounterModuleState(200);
  custom.faces.frontLower.itemKey = 'panel_corner_192';
  custom.faces.frontLower.imageAssetId = 'keep';
  normalizeModuleItemState(custom);
  assert.equal(custom.faces.frontLower.itemKey, 'panel_corner_192');
  assert.equal(custom.faces.frontLower.imageAssetId, 'keep');
});
