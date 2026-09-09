import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { getProductionItem } from '../src/productionParts.js';
import { getExpandedModuleRecipe, getModuleRecipe, getRecipeItemKey } from '../src/moduleRecipes.js';
import { GLASS_APPEARANCE, getMaterialAppearance } from '../src/theme.js';

const EXPECTED_DIMENSIONS = Object.freeze({
  lengthCm: 87.3,
  depthCm: 28.5,
  thicknessCm: 0.6,
});

test('glass_shelf uses canonical identity with verified 87.3 x 28.5 x 0.6 cm glass metadata', () => {
  const item = getProductionItem('glass_shelf');
  assert.equal(item.itemKey, 'glass_shelf');
  assert.equal(item.partId, undefined);
  assert.equal(item.name, 'Cam Raf');
  assert.equal(item.type, 'showcase-accessory');
  assert.equal(item.unit, 'adet');
  assert.deepEqual(item.dimensions, EXPECTED_DIMENSIONS);
  assert.equal(item.material, 'cam');
  assert.equal(getMaterialAppearance(item.material), GLASS_APPEARANCE);
});

test('showcase recipes use canonical glass_shelf itemKey while preserving 2/3 quantity parity', () => {
  const cases = [
    ['showcase-2', 2],
    ['showcase-3', 3],
  ];

  for (const [type, quantity] of cases) {
    const recipe = getModuleRecipe(type, 100);
    const matches = recipe.items.filter((entry) => getRecipeItemKey(entry) === 'glass_shelf');
    assert.equal(matches.length, 1, type);
    assert.deepEqual(matches[0], { itemKey: 'glass_shelf', quantity });

    const expanded = getExpandedModuleRecipe(type, 100);
    const shelf = expanded.items.find((entry) => entry.itemKey === 'glass_shelf');
    assert.ok(shelf, type);
    assert.equal(shelf.quantity, quantity);
    assert.equal(shelf.part.unit, 'adet');
    assert.equal(shelf.part.itemKey, 'glass_shelf');
    assert.equal(shelf.part.partId, undefined);
    assert.deepEqual(shelf.part.dimensions, EXPECTED_DIMENSIONS);
    assert.equal(shelf.part.material, 'cam');
  }
});

test('showcase renderer consumes canonical glass_shelf dimensions/material and shared glass appearance', () => {
  const source = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const start = source.indexOf('function createShowcaseModule(');
  const end = source.indexOf('function createSelectionFrame', start);
  const showcase = source.slice(start, end);

  assert.match(showcase, /getProductionItem\('glass_shelf'\)/);
  assert.match(showcase, /getMaterialAppearance\(glassShelfItem\?\.material\)/);
  assert.match(showcase, /glassShelfItem\.dimensions\.lengthCm \/ 100/);
  assert.match(showcase, /glassShelfItem\.dimensions\.depthCm \/ 100/);
  assert.match(showcase, /glassShelfItem\.dimensions\.thicknessCm \/ 100/);
  assert.match(showcase, /new THREE\.BoxGeometry\(\s*glassShelfLengthM,\s*glassShelfThicknessM,\s*glassShelfDepthM,/);
  assert.match(showcase, /shelf\.userData\.itemKey = glassShelfItem\.itemKey/);
  assert.doesNotMatch(showcase, /color:\s*0xb7d5b5/);
  assert.doesNotMatch(showcase, /Math\.max\(innerWidth - 0\.035, 0\.02\)/);
  assert.doesNotMatch(showcase, /Math\.max\(showcaseDepth - 0\.035, 0\.04\)/);
});
