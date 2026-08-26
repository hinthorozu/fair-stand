import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionPart, listProductionParts } from '../src/productionParts.js';
import {
  getExpandedModuleRecipe,
  getExpandedStraightWallRecipe,
  getModuleRecipe,
  getStraightWallRecipe,
  listStraightWallRecipes,
} from '../src/moduleRecipes.js';

test('production part catalog contains the verified connector names', () => {
  assert.equal(getProductionPart('connector_start').name, 'Başlangıç Aparatı');
  assert.equal(getProductionPart('connector_single').name, 'Tekli Aparat');
  assert.equal(getProductionPart('connector_double').name, 'Çiftli Aparat');
  assert.equal(getProductionPart('connector_corner').name, 'Köşe Aparatı');
});

test('production part catalog contains all verified panel sizes', () => {
  const panelWidths = listProductionParts()
    .filter((part) => part.type === 'panel')
    .map((part) => part.dimensions.widthCm)
    .sort((a, b) => a - b);

  assert.deepEqual(panelWidths, [42.5, 48.5, 92, 98, 142.5, 147.5, 192, 197]);
});

test('production part catalog contains the 100 cm door part', () => {
  assert.equal(getProductionPart('door_100').name, 'Kapı 100 cm');
  assert.equal(getProductionPart('door_100').unit, 'adet');
});

test('production part catalog contains shelf sizes and shelf leg', () => {
  assert.equal(getProductionPart('shelf_100').name, 'Raf 100 cm');
  assert.equal(getProductionPart('shelf_150').dimensions.lengthCm, 150);
  assert.equal(getProductionPart('shelf_200').dimensions.lengthCm, 200);
  assert.equal(getProductionPart('shelf_leg').name, 'Raf Ayağı');
});

test('50 cm straight wall recipe matches the verified production recipe', () => {
  const recipe = getStraightWallRecipe(50);

  assert.deepEqual(recipe.items, [
    { partId: 'profile_41_5', quantity: 2 },
    { partId: 'upright_346_5', quantity: 2 },
    { partId: 'panel_48_5', quantity: 7 },
    { partId: 'connector_start', quantity: 2 },
    { partId: 'connector_single', quantity: 13 },
  ]);
  assert.equal(recipe.variants.innerCornerPanelPartId, 'panel_corner_42_5');
});

test('100/150/200 cm straight wall recipes preserve quantities and change verified sizes', () => {
  const expected = {
    100: ['profile_91', 'panel_98', 'panel_corner_92'],
    150: ['profile_140_5', 'panel_147_5', 'panel_corner_142_5'],
    200: ['profile_190', 'panel_197', 'panel_corner_192'],
  };

  for (const [width, [profilePartId, panelPartId, cornerPanelPartId]] of Object.entries(expected)) {
    const recipe = getStraightWallRecipe(Number(width));
    const quantities = Object.fromEntries(recipe.items.map((item) => [item.partId, item.quantity]));

    assert.equal(quantities[profilePartId], 2);
    assert.equal(quantities.upright_346_5, 2);
    assert.equal(quantities[panelPartId], 7);
    assert.equal(quantities.connector_start, 2);
    assert.equal(quantities.connector_single, 13);
    assert.equal(recipe.variants.innerCornerPanelPartId, cornerPanelPartId);
  }
});

test('100 cm door recipe matches verified production data', () => {
  const recipe = getModuleRecipe('door', 100);
  assert.deepEqual(recipe.items, [
    { partId: 'profile_91', quantity: 1 },
    { partId: 'upright_346_5', quantity: 2 },
    { partId: 'panel_98', quantity: 3 },
    { partId: 'connector_start', quantity: 2 },
    { partId: 'connector_single', quantity: 5 },
    { partId: 'door_100', quantity: 1 },
  ]);
  assert.equal(recipe.variants.innerCornerPanelPartId, 'panel_corner_92');
});

test('100 and 150 cm two-shelf wall recipes match verified production data', () => {
  const expected = {
    100: ['profile_91', 'panel_98', 'panel_corner_92', 'shelf_100'],
    150: ['profile_140_5', 'panel_147_5', 'panel_corner_142_5', 'shelf_150'],
  };

  for (const [width, [profilePartId, panelPartId, cornerPanelPartId, shelfPartId]] of Object.entries(expected)) {
    const recipe = getModuleRecipe('shelf', Number(width), { shelfCount: 2 });
    const quantities = Object.fromEntries(recipe.items.map((item) => [item.partId, item.quantity]));
    assert.equal(quantities[profilePartId], 2);
    assert.equal(quantities.upright_346_5, 2);
    assert.equal(quantities[panelPartId], 7);
    assert.equal(quantities.connector_start, 2);
    assert.equal(quantities.connector_single, 13);
    assert.equal(quantities[shelfPartId], 2);
    assert.equal(quantities.shelf_leg, 4);
    assert.equal(recipe.variants.innerCornerPanelPartId, cornerPanelPartId);
  }
});

test('200 cm two-shelf wall recipe uses six shelf legs', () => {
  const recipe = getModuleRecipe('shelf', 200, { shelfCount: 2 });
  const quantities = Object.fromEntries(recipe.items.map((item) => [item.partId, item.quantity]));
  assert.equal(quantities.profile_190, 2);
  assert.equal(quantities.upright_346_5, 2);
  assert.equal(quantities.panel_197, 7);
  assert.equal(quantities.connector_start, 2);
  assert.equal(quantities.connector_single, 13);
  assert.equal(quantities.shelf_200, 2);
  assert.equal(quantities.shelf_leg, 6);
  assert.equal(recipe.variants.innerCornerPanelPartId, 'panel_corner_192');
});

test('100 and 150 cm three-shelf wall recipes match verified production data', () => {
  const expected = {
    100: ['profile_91', 'panel_98', 'panel_corner_92', 'shelf_100'],
    150: ['profile_140_5', 'panel_147_5', 'panel_corner_142_5', 'shelf_150'],
  };

  for (const [width, [profilePartId, panelPartId, cornerPanelPartId, shelfPartId]] of Object.entries(expected)) {
    const recipe = getModuleRecipe('shelf', Number(width), { shelfCount: 3 });
    const quantities = Object.fromEntries(recipe.items.map((item) => [item.partId, item.quantity]));
    assert.equal(quantities[profilePartId], 2);
    assert.equal(quantities.upright_346_5, 2);
    assert.equal(quantities[panelPartId], 7);
    assert.equal(quantities.connector_start, 2);
    assert.equal(quantities.connector_single, 13);
    assert.equal(quantities[shelfPartId], 3);
    assert.equal(quantities.shelf_leg, 6);
    assert.equal(recipe.variants.innerCornerPanelPartId, cornerPanelPartId);
  }
});

test('200 cm three-shelf wall recipe uses nine shelf legs', () => {
  const recipe = getModuleRecipe('shelf', 200, { shelfCount: 3 });
  const quantities = Object.fromEntries(recipe.items.map((item) => [item.partId, item.quantity]));
  assert.equal(quantities.profile_190, 2);
  assert.equal(quantities.upright_346_5, 2);
  assert.equal(quantities.panel_197, 7);
  assert.equal(quantities.connector_start, 2);
  assert.equal(quantities.connector_single, 13);
  assert.equal(quantities.shelf_200, 3);
  assert.equal(quantities.shelf_leg, 9);
  assert.equal(recipe.variants.innerCornerPanelPartId, 'panel_corner_192');
});

test('recipe lookup rejects unsupported nominal wall widths', () => {
  assert.equal(getStraightWallRecipe(75), null);
  assert.equal(getStraightWallRecipe(250), null);
  assert.equal(listStraightWallRecipes().length, 4);
});

test('expanded recipe resolves production part metadata without mutating source recipe', () => {
  const expanded = getExpandedStraightWallRecipe(200);

  assert.equal(expanded.items[0].part.name, 'Profil 190 cm');
  assert.equal(expanded.items[1].part.dimensions.lengthCm, 346.5);
  assert.equal(expanded.items[2].part.dimensions.widthCm, 197);
  assert.equal(getStraightWallRecipe(200).items[0].part, undefined);
});

test('expanded door recipe resolves the door production part', () => {
  const expanded = getExpandedModuleRecipe('door', 100);
  assert.equal(expanded.items.at(-1).part.name, 'Kapı 100 cm');
  assert.equal(expanded.items[2].part.dimensions.widthCm, 98);
});

test('expanded shelf recipe resolves shelf and leg production parts', () => {
  const expanded = getExpandedModuleRecipe('shelf', 150, { shelfCount: 3 });
  assert.equal(expanded.items.at(-2).part.name, 'Raf 150 cm');
  assert.equal(expanded.items.at(-1).part.name, 'Raf Ayağı');
});
