import test from 'node:test';
import assert from 'node:assert/strict';
import { createFlatPanelModuleState } from '../src/designState.js';
import {
  getItem,
  resolveAutomaticWallFlatPanelItemKey,
} from '../src/items.js';

test('otomatik duvar widthCm → flat-panel Item registry’den (hardcoded map yok)', () => {
  assert.equal(resolveAutomaticWallFlatPanelItemKey(50), 'wall_50');
  assert.equal(resolveAutomaticWallFlatPanelItemKey(100), 'wall_100');
  assert.equal(resolveAutomaticWallFlatPanelItemKey(150), 'wall_150');
  assert.equal(resolveAutomaticWallFlatPanelItemKey(200), 'wall_200');
  assert.equal(resolveAutomaticWallFlatPanelItemKey(250), null);

  const wall = createFlatPanelModuleState(200);
  assert.equal(wall.itemKey, 'wall_200');
  assert.equal(wall.widthCm, 200);

  assert.equal(getItem('wall_200_short_up_2')?.dimensions?.widthCm, 200);
  assert.notEqual(resolveAutomaticWallFlatPanelItemKey(200), 'wall_200_short_up_2');
});
