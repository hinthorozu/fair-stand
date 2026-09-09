import test from 'node:test';
import assert from 'node:assert/strict';

import { getExpandedModuleRecipe } from '../src/moduleRecipes.js';
import { parseLCounterSelection } from '../src/rawBomDebug.js';
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
  [100, 'counter-l-100'],
  [150, 'counter-l-150'],
  [200, 'counter-l-200'],
];

test('selection feedback -> Raw BOM parser -> expanded recipe resolves all supported L counters', () => {
  for (const [widthCm, recipeId] of CASES) {
    const parsed = parseLCounterSelection(lCounterSelectionMessage(widthCm));
    assert.deepEqual(parsed, {
      moduleType: 'counter',
      widthCm,
      label: `Köşe Banko ${widthCm}×${widthCm}`,
      options: { shape: 'L' },
    });

    const recipe = getExpandedModuleRecipe(parsed.moduleType, parsed.widthCm, parsed.options);
    assert.equal(recipe?.recipeId, recipeId);
  }
});

test('Raw BOM L-counter parser handles every single-face selection role', () => {
  for (const role of ['front', 'left', 'right', 'return']) {
    assert.equal(parseLCounterSelection(lCounterSelectionMessage(150, role))?.widthCm, 150);
    assert.equal(parseLCounterSelection(lCounterSelectionMessage(200, role))?.widthCm, 200);
  }
});

test('Raw BOM L-counter selection parser preserves ASCII x compatibility', () => {
  assert.equal(parseLCounterSelection('Köşe Banko 150x150')?.widthCm, 150);
});

test('Raw BOM L-counter selection parser rejects straight and unsupported rectangular labels', () => {
  assert.equal(parseLCounterSelection('Banko 150 cm'), null);
  assert.equal(parseLCounterSelection('Köşe Banko 150×100'), null);
  assert.equal(parseLCounterSelection('Köşe Banko 250×250'), null);
});
