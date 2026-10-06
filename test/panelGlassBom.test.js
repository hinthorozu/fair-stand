import assert from 'node:assert/strict';
import test from 'node:test';

import { createFlatPanelModuleState } from '../src/designState.js';
import { resolveProjectBom } from '../src/projectBom.js';
import { applyGlassPanelSplit, glassTwinKey } from '../src/panelGlassBom.js';

function qty(lines, itemKey) {
  const line = lines.find((entry) => entry.itemKey === itemKey);
  return line ? line.quantity : 0;
}

test('glass twin keys follow panel and corner syntax', () => {
  assert.equal(glassTwinKey('panel_197'), 'panel_cam_197');
  assert.equal(glassTwinKey('panel_48_5'), 'panel_cam_48_5');
  assert.equal(glassTwinKey('panel_corner_142_5'), 'panel_corner_cam_142_5');
  assert.equal(glassTwinKey('panel_corner_42_5'), 'panel_corner_cam_42_5');
  assert.equal(glassTwinKey('separator_panel_98'), null);
  assert.equal(glassTwinKey('panel_cam_197'), null);
});

test('a live wall_200 module shows glass strips as panel_cam_197', () => {
  const state = createFlatPanelModuleState({ itemKey: 'wall_200_350' });
  assert.equal(state.strips.length, 7);
  assert.equal(state.strips.every((strip) => strip.itemKey === 'panel_197'), true);
  for (let index = 0; index < 4; index += 1) state.strips[index].isGlass = true;
  const bom = resolveProjectBom([state]);
  assert.equal(qty(bom.lines, 'panel_197'), 3);
  assert.equal(qty(bom.lines, 'panel_cam_197'), 4);
});

test('glass strips without a stored itemKey still follow the wall recipe', () => {
  const state = createFlatPanelModuleState({ itemKey: 'wall_200_350' });
  for (const strip of state.strips) delete strip.itemKey;
  state.strips[0].isGlass = true;
  const bom = resolveProjectBom([state]);
  assert.equal(qty(bom.lines, 'panel_197'), 6);
  assert.equal(qty(bom.lines, 'panel_cam_197'), 1);
});

test('wall_200 glass strips split panel_197 into panel_cam_197', () => {
  const strips = Array.from({ length: 7 }, (_, index) => ({
    itemKey: 'panel_197',
    isGlass: index < 4,
  }));
  const bom = resolveProjectBom([{
    id: 'wall',
    itemKey: 'wall_200_350',
    type: 'flat-panel',
    strips,
  }]);
  assert.equal(qty(bom.lines, 'panel_197'), 3);
  assert.equal(qty(bom.lines, 'panel_cam_197'), 4);
  assert.equal(qty(bom.lines, 'upright_346_5'), 2);
  assert.equal(qty(bom.lines, 'connector_single'), 13);
  assert.ok(bom.relationshipNotes.some((note) => note.includes('panel_197 × 4 → panel_cam_197')));
});

test('glass count cannot exceed the recipe panel quantity', () => {
  const strips = Array.from({ length: 9 }, () => ({ itemKey: 'panel_197', isGlass: true }));
  const bom = resolveProjectBom([{
    id: 'wall',
    itemKey: 'wall_200_350',
    type: 'flat-panel',
    strips,
  }]);
  assert.equal(qty(bom.lines, 'panel_197'), 0);
  assert.equal(qty(bom.lines, 'panel_cam_197'), 7);
});

test('separator and unstamped glass strips stay on the sunta line', () => {
  const split = applyGlassPanelSplit(
    [{ itemKey: 'separator_panel_48_5', quantity: 7, unit: 'adet', material: 'mdf' }],
    [
      { itemKey: 'separator_panel_48_5', isGlass: true },
      { isGlass: true },
    ],
  );
  assert.equal(split.moved.length, 0);
  assert.equal(split.lines[0].quantity, 7);
});

test('corner glass faces move onto panel_corner_cam', () => {
  const split = applyGlassPanelSplit(
    [
      { itemKey: 'panel_corner_192', quantity: 2, unit: 'adet', material: 'sunta' },
      { itemKey: 'panel_197', quantity: 1, unit: 'adet', material: 'sunta' },
    ],
    [
      { itemKey: 'panel_corner_192', isGlass: true },
      { itemKey: 'panel_corner_192', isGlass: false },
      { itemKey: 'panel_197', isGlass: true },
    ],
  );
  assert.equal(qty(split.lines, 'panel_corner_192'), 1);
  assert.equal(qty(split.lines, 'panel_corner_cam_192'), 1);
  assert.equal(qty(split.lines, 'panel_197'), 0);
  assert.equal(qty(split.lines, 'panel_cam_197'), 1);
  assert.equal(split.lines.find((line) => line.itemKey === 'panel_corner_cam_192').material, 'cam');
});
