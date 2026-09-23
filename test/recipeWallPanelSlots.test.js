import test from 'node:test';
import assert from 'node:assert/strict';

import {
  countRecipeWallPanelSlots,
  getItem,
  resolveFlatPanelStripCount,
  resolveSceneDimensions,
} from '../src/items.js';
import { createFlatPanelModuleState } from '../src/designState.js';
import { WALL_PANEL_BAND_PITCH_CM } from '../src/wallPanelBand.js';

test('countRecipeWallPanelSlots sums panel and separator-panel BOM lines', () => {
  const wallPanelCount = countRecipeWallPanelSlots(getItem('wall_200'));
  assert.ok(wallPanelCount >= 1);
  assert.equal(countRecipeWallPanelSlots(getItem('wall_200_short_up_2')), 2);
  assert.equal(countRecipeWallPanelSlots(getItem('profile_190')), null);
});

test('createFlatPanelModuleState strip slots follow recipe panel count', () => {
  const wall = createFlatPanelModuleState({ itemKey: 'wall_200' });
  assert.equal(wall.strips.length, resolveFlatPanelStripCount(getItem('wall_200')));
  const shortUp = createFlatPanelModuleState({ itemKey: 'wall_200_short_up_2' });
  assert.equal(shortUp.strips.length, 2);
});

test('recipe-driven flat-panel height matches panel count × stand strip pitch', () => {
  const pitchCm = WALL_PANEL_BAND_PITCH_CM;
  const wall = createFlatPanelModuleState({ itemKey: 'wall_200' });
  assert.equal(wall.heightCm, wall.strips.length * pitchCm);
  const shortUp = createFlatPanelModuleState({ itemKey: 'wall_200_short_up_2' });
  assert.equal(shortUp.heightCm, 2 * pitchCm);
});

test('strip slots never exceed item ceiling height from catalog', () => {
  const pitchCm = WALL_PANEL_BAND_PITCH_CM;
  for (const itemKey of ['wall_200', 'wall_200_short_up_2']) {
    const item = getItem(itemKey);
    const ceilingHeightCm = resolveSceneDimensions(item).heightCm;
    const maxSlots = Math.max(1, Math.floor(ceilingHeightCm / pitchCm));
    const recipeSlots = countRecipeWallPanelSlots(item);
    assert.equal(resolveFlatPanelStripCount(item), Math.min(recipeSlots ?? maxSlots, maxSlots));
    const state = createFlatPanelModuleState({ itemKey });
    assert.ok(state.strips.length <= maxSlots);
    assert.ok(state.heightCm <= ceilingHeightCm);
  }
});
