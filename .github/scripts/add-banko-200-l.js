import fs from 'node:fs';

function replaceOnce(file, from, to, label) {
  let text = fs.readFileSync(file, 'utf8');
  if (!text.includes(from)) throw new Error(`Missing patch target: ${label}`);
  text = text.replace(from, to);
  fs.writeFileSync(file, text);
}

// Catalog
replaceOnce(
  'src/catalog.js',
  "  desk_banko_200: { type: 'counter', widthCm: 200, depthCm: 50, heightCm: 100, label: 'Banko 200' },\n",
  "  desk_banko_200: { type: 'counter', widthCm: 200, depthCm: 50, heightCm: 100, label: 'Banko 200' },\n  desk_banko_200_L: { type: 'counter', shape: 'L', widthCm: 200, depthCm: 200, heightCm: 100, label: 'Köşe Banko 200×200' },\n",
  'catalog 200 L entry',
);
replaceOnce(
  'src/catalog.js',
  "  'desk_banko_200',\n  'desk_banko_150',\n",
  "  'desk_banko_200',\n  'desk_banko_200_L',\n  'desk_banko_150',\n",
  'catalog 200 L key',
);

// Production part used only by BOM/reporting; renderer remains independent.
replaceOnce(
  'src/productionParts.js',
  "  counter_top_210_60: Object.freeze({ partId: 'counter_top_210_60', name: 'Banko Üstü 210 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 210, depthCm: 60 }), nominalModuleWidthCm: 200 }),\n",
  "  counter_top_210_60: Object.freeze({ partId: 'counter_top_210_60', name: 'Banko Üstü 210 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 210, depthCm: 60 }), nominalModuleWidthCm: 200 }),\n  counter_top_150_60: Object.freeze({ partId: 'counter_top_150_60', name: 'Banko Üstü 150 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 150, depthCm: 60 }), nominalModuleWidthCm: 200 }),\n",
  '200 L return top part',
);

// Recipe
const recipeAnchor = "  'counter:100': Object.freeze({ recipeId: 'counter-100', moduleType: 'counter', nominalWidthCm: 100, items: Object.freeze([\n";
const recipe = "  'counter-l:200': Object.freeze({ recipeId: 'counter-l-200', moduleType: 'counter', shape: 'L', nominalWidthCm: 200, items: Object.freeze([\n    Object.freeze({ partId: 'profile_190', quantity: 5 }), Object.freeze({ partId: 'profile_140_5', quantity: 1 }), Object.freeze({ partId: 'profile_41_5', quantity: 4 }), Object.freeze({ partId: 'upright_99', quantity: 5 }), Object.freeze({ partId: 'panel_197', quantity: 4 }), Object.freeze({ partId: 'panel_48_5', quantity: 4 }), Object.freeze({ partId: 'connector_start', quantity: 8 }), Object.freeze({ partId: 'connector_single', quantity: 16 }), Object.freeze({ partId: 'counter_top_210_60', quantity: 1 }), Object.freeze({ partId: 'counter_top_150_60', quantity: 1 }),\n  ]) }),\n\n" + recipeAnchor;
replaceOnce('src/moduleRecipes.js', recipeAnchor, recipe, '200 L recipe');

// Make renderer comment size-agnostic. No geometry formula changes required.
replaceOnce(
  'src/scene3d.js',
  '    // Banko 150 L, normal Banko 150 renderer mantığını kullanır: 2 cm tabla taşması.\n',
  '    // 150/200 L bankolar normal düz banko renderer mantığını kullanır: 2 cm tabla taşması.\n',
  'generic L renderer comment',
);

// Contract test
const testFile = 'test/lCounter200Contract.test.js';
fs.writeFileSync(testFile, `import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import { createCounterModuleState } from '../src/designState.js';
import { getModuleRecipe } from '../src/moduleRecipes.js';
import { getProductionPart } from '../src/productionParts.js';

test('desk_banko_200_L is a 200 x 200 catalog module', () => {
  assert.deepEqual(MODULE_CATALOG.desk_banko_200_L, {
    type: 'counter', shape: 'L', widthCm: 200, depthCm: 200, heightCm: 100, label: 'Köşe Banko 200×200',
  });
  assert.ok(MODULE_CATALOG_KEYS.includes('desk_banko_200_L'));
});

test('200 L counter state keeps 200 cm physical depth and eight editable faces', () => {
  const state = createCounterModuleState(200, { shape: 'L', depthCm: 200 });
  assert.equal(state.widthCm, 200);
  assert.equal(state.depthCm, 200);
  assert.equal(state.shape, 'L');
  assert.equal(Object.keys(state.faces).length, 8);
});

test('200 L renderer is 200 x 200 with a 50 cm arm and 150 cm return extension', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /const widthCm = Number\\(moduleState\\.widthCm\\) \\|\\| 100;/);
  assert.match(source, /const depthCm = Number\\(moduleState\\.depthCm\\) \\|\\| widthCm;/);
  assert.match(source, /const armM = 0\\.50;/);
  assert.match(source, /const returnExtensionM = Math\\.max\\(depthM - armM, 0\\.02\\);/);
  assert.match(source, /widthM \\+ topOverhangM \\* 2/);
});

test('200 L counter BOM remains separate from renderer geometry', () => {
  const recipe = getModuleRecipe('counter', 200, { shape: 'L' });
  assert.equal(recipe.recipeId, 'counter-l-200');
  assert.deepEqual(recipe.items.map(({ partId, quantity }) => [partId, quantity]), [
    ['profile_190', 5], ['profile_140_5', 1], ['profile_41_5', 4], ['upright_99', 5],
    ['panel_197', 4], ['panel_48_5', 4], ['connector_start', 8], ['connector_single', 16],
    ['counter_top_210_60', 1], ['counter_top_150_60', 1],
  ]);
  assert.equal(getProductionPart('counter_top_150_60').dimensions.widthCm, 150);
});
`);
