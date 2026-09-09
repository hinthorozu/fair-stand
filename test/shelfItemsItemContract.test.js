import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { getShelfProductionItem, getProductionItem } from '../src/productionParts.js';
import { getExpandedModuleRecipe, getModuleRecipe, getRecipeItemKey } from '../src/moduleRecipes.js';

const SHELF_CASES = Object.freeze({
  shelf_100: Object.freeze({ widthCm: 100, quantities: Object.freeze([2, 3]) }),
  shelf_150: Object.freeze({ widthCm: 150, quantities: Object.freeze([2, 3]) }),
  shelf_200: Object.freeze({ widthCm: 200, quantities: Object.freeze([2, 3]) }),
});

const EXPECTED_COLOR = 0xffffff;

test('shelf production Items use canonical identity and verified sunta dimensions/default color', () => {
  for (const [itemKey, { widthCm }] of Object.entries(SHELF_CASES)) {
    const item = getProductionItem(itemKey);
    assert.equal(item.itemKey, itemKey);
    assert.equal(item.partId, undefined);
    assert.equal(item.name, `Raf ${widthCm} cm`);
    assert.equal(item.type, 'shelf');
    assert.equal(item.unit, 'adet');
    assert.deepEqual(item.dimensions, { lengthCm: widthCm, depthCm: 38, thicknessCm: 1.8 });
    assert.equal(item.material, 'sunta');
    assert.equal(item.defaultColor, EXPECTED_COLOR);
    assert.equal(item.nominalModuleWidthCm, widthCm);
    assert.equal(getShelfProductionItem(widthCm), item);
  }

  assert.equal(getShelfProductionItem(50), null);
});

test('shelf Items use canonical itemKey in exactly six verified parent recipes with quantity parity', () => {
  let occurrences = 0;

  for (const [itemKey, { widthCm, quantities }] of Object.entries(SHELF_CASES)) {
    for (const quantity of quantities) {
      const recipe = getModuleRecipe('shelf', widthCm, { shelfCount: quantity });
      assert.ok(recipe);
      const matches = recipe.items.filter((item) => getRecipeItemKey(item) === itemKey);
      assert.equal(matches.length, 1, `${recipe.recipeId}:${itemKey}`);
      assert.deepEqual(matches[0], { itemKey, quantity });
      occurrences += matches.length;
    }
  }

  assert.equal(occurrences, 6);
});

test('expanded shelf recipes resolve canonical Item metadata without changing shelf-leg ownership', () => {
  for (const [itemKey, { widthCm }] of Object.entries(SHELF_CASES)) {
    const expanded = getExpandedModuleRecipe('shelf', widthCm, { shelfCount: 3 });
    const shelf = expanded.items.find((item) => item.itemKey === itemKey);
    const leg = expanded.items.find((item) => getRecipeItemKey(item) === 'shelf_leg');

    assert.ok(shelf, itemKey);
    assert.equal(shelf.part.itemKey, itemKey);
    assert.equal(shelf.part.partId, undefined);
    assert.equal(shelf.part.dimensions.depthCm, 38);
    assert.equal(shelf.part.dimensions.thicknessCm, 1.8);
    assert.equal(shelf.part.material, 'sunta');
    assert.equal(shelf.part.defaultColor, EXPECTED_COLOR);
    assert.ok(leg);
    assert.equal(leg.part.partId, 'shelf_leg');
  }
});

test('shelf renderer consumes canonical Item depth, thickness and default color while retaining explicit fit override', () => {
  const catalogSource = readFileSync(new URL('../src/catalog.js', import.meta.url), 'utf8');
  const rendererSource = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

  assert.doesNotMatch(catalogSource, /projectionCm:\s*38/);
  assert.doesNotMatch(catalogSource, /thicknessCm:\s*3/);
  assert.match(rendererSource, /const shelfItem = getShelfProductionItem\(moduleState\.widthCm\)/);
  assert.match(rendererSource, /shelfItem\.dimensions\.depthCm/);
  assert.match(rendererSource, /shelfItem\.dimensions\.thicknessCm/);
  assert.match(rendererSource, /color: shelfItem\.defaultColor/);
  assert.match(rendererSource, /new THREE\.BoxGeometry\(innerWidthM, shelfThicknessM, shelfDepthM\)/);
  assert.doesNotMatch(rendererSource, /color:\s*0xb8bcc1/);
});
