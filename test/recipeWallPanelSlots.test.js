import test from 'node:test';
import assert from 'node:assert/strict';

import {
  countRecipeWallPanelSlots,
  getItem,
  resolveFlatPanelStripCount,
} from '../src/items.js';
import { createFlatPanelModuleState } from '../src/designState.js';
import { WALL_PANEL_BAND_PITCH_CM } from '../src/wallPanelBand.js';

test('countRecipeWallPanelSlots sums panel and separator-panel BOM lines', () => {
  const wallPanelCount = countRecipeWallPanelSlots(getItem('wall_200_350'));
  assert.ok(wallPanelCount >= 1);
  assert.equal(countRecipeWallPanelSlots(getItem('wall_200_short_up_2')), 2);
  assert.equal(countRecipeWallPanelSlots(getItem('profile_190')), null);
});

test('createFlatPanelModuleState strip slots follow recipe panel count', () => {
  const wall = createFlatPanelModuleState({ itemKey: 'wall_200_350' });
  assert.equal(wall.strips.length, resolveFlatPanelStripCount(getItem('wall_200_350')));
  const shortUp = createFlatPanelModuleState({ itemKey: 'wall_200_short_up_2' });
  assert.equal(shortUp.strips.length, 2);
});

test('recipe-driven flat-panel height matches panel count × stand strip pitch', () => {
  const pitchCm = WALL_PANEL_BAND_PITCH_CM;
  const wall = createFlatPanelModuleState({ itemKey: 'wall_200_350' });
  assert.equal(wall.heightCm, wall.strips.length * pitchCm);
  const shortUp = createFlatPanelModuleState({ itemKey: 'wall_200_short_up_2' });
  assert.equal(shortUp.heightCm, 2 * pitchCm);
});

test('strip slots follow recipe BOM quantity (no silent ceiling clamp)', () => {
  for (const itemKey of ['wall_200_350', 'wall_200_short_up_2']) {
    const item = getItem(itemKey);
    const recipeSlots = countRecipeWallPanelSlots(item);
    assert.ok(recipeSlots != null);
    assert.equal(resolveFlatPanelStripCount(item), recipeSlots);
    const state = createFlatPanelModuleState({ itemKey });
    assert.equal(state.strips.length, recipeSlots);
    assert.equal(state.heightCm, recipeSlots * WALL_PANEL_BAND_PITCH_CM);
  }
});
