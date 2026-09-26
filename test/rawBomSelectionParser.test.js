import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getExpandedModuleRecipe,
} from './recipeParentItemKey.js';
import { describeSurfaceSelection } from '../src/selectionFeedback.js';

function lCounterSelectionMessage(widthCm, surfaceRole = 'front') {
  return describeSurfaceSelection([{
    userData: {
      moduleIndex: 0,
      moduleType: 'counter',
      counterShape: 'L',
      widthCm,
      depthCm: widthCm,
      surfaceRole,
    },
  }]).message;
}

const CASES = [
  [100, 'desk_banko_100_l'],
  [150, 'desk_banko_150_l'],
  [200, 'desk_banko_200_l'],
];

test('selection feedback L-counter labels map to expanded recipes', () => {
  for (const [widthCm, recipeId] of CASES) {
    const message = lCounterSelectionMessage(widthCm);
    assert.match(message, new RegExp(`Köşe\\s+Banko\\s+${widthCm}`, 'i'));
    const recipe = getExpandedModuleRecipe('counter', widthCm, { shape: 'L' });
    assert.equal(recipe?.recipeId, recipeId);
  }
});

test('L-counter selection roles keep width in feedback text', () => {
  for (const role of ['front', 'left', 'right', 'return']) {
    assert.match(lCounterSelectionMessage(150, role), /Köşe\s+Banko\s+150/i);
    assert.match(lCounterSelectionMessage(200, role), /Köşe\s+Banko\s+200/i);
  }
});
