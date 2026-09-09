import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionItem, getProductionPart, listProductionParts } from '../src/productionParts.js';
import {
  getExpandedModuleRecipe,
  getExpandedStraightWallRecipe,
  getModuleRecipe,
  getRecipeInnerCornerPanelKey,
  getRecipeItemKey,
  getStraightWallRecipe,
  listStraightWallRecipes,
} from '../src/moduleRecipes.js';

test('production part catalog contains the verified connector names', () => {
  assert.equal(getProductionPart('connector_start').name, 'Başlangıç Aparatı');
  assert.equal(getProductionPart('connector_single').name, 'Tekli Aparat');
  assert.equal(getProductionPart('connector_double').name, 'Çiftli Aparat');
  assert.equal(getProductionPart('connector_corner').name, 'Köşe Aparatı');
});


test('connector_start remains a canonical single Item', () => {
  const item = getProductionItem('connector_start');

  assert.equal(item.itemKey, 'connector_start');
  assert.equal(item.partId, undefined);
  assert.equal(item.type, 'connector');
  assert.equal(item.connectorType, 'start');
  assert.equal(item.unit, 'adet');
});


test('all four connector production definitions use canonical itemKey identity', () => {
  const expectedTypes = {
    connector_start: 'start',
    connector_single: 'single',
    connector_double: 'double',
    connector_corner: 'corner',
  };

  for (const [itemKey, connectorType] of Object.entries(expectedTypes)) {
    const item = getProductionItem(itemKey);
    assert.equal(item.itemKey, itemKey);
    assert.equal(item.partId, undefined);
    assert.equal(item.type, 'connector');
    assert.equal(item.connectorType, connectorType);
    assert.equal(item.unit, 'adet');
  }
});

test('migrated recipe identities use itemKey while legacy parts keep partId', () => {
  const recipe = getStraightWallRecipe(200);
  const start = recipe.items.find((item) => getRecipeItemKey(item) === 'connector_start');
  const single = recipe.items.find((item) => getRecipeItemKey(item) === 'connector_single');
  const upright = recipe.items.find((item) => getRecipeItemKey(item) === 'upright_346_5');
  const panel = recipe.items.find((item) => getRecipeItemKey(item) === 'panel_197');
  const profile = recipe.items.find((item) => getRecipeItemKey(item) === 'profile_190');

  assert.deepEqual(start, { itemKey: 'connector_start', quantity: 2 });
  assert.deepEqual(single, { itemKey: 'connector_single', quantity: 13 });
  assert.deepEqual(upright, { itemKey: 'upright_346_5', quantity: 2 });
  assert.deepEqual(panel, { itemKey: 'panel_197', quantity: 7 });
  assert.equal(start.partId, undefined);
  assert.equal(single.partId, undefined);
  assert.equal(upright.partId, undefined);
  assert.equal(panel.partId, undefined);
  assert.deepEqual(profile, { itemKey: 'profile_190', quantity: 2 });
  assert.equal(profile.partId, undefined);
});

test('item-by-item migration is isolated to migrated Items across every recipe', () => {
  const recipes = [
    ...listStraightWallRecipes(),
    ...[
      ['door', 100],
      ['shelf', 100, { shelfCount: 2 }],
      ['shelf', 150, { shelfCount: 2 }],
      ['shelf', 200, { shelfCount: 2 }],
      ['shelf', 100, { shelfCount: 3 }],
      ['shelf', 150, { shelfCount: 3 }],
      ['shelf', 200, { shelfCount: 3 }],
      ['showcase-2', 100],
      ['showcase-3', 100],
      ['separator', 50],
      ['separator', 100],
      ['counter', 100, { shape: 'L' }],
      ['counter', 150, { shape: 'L' }],
      ['counter', 200, { shape: 'L' }],
      ['counter', 100],
      ['counter', 150],
      ['counter', 200],
      ['base-wall', 100],
      ['base-wall', 150],
      ['base-wall', 200],
      ['base', 100],
      ['base', 150],
      ['base', 200],
    ].map(([type, width, options]) => getModuleRecipe(type, width, options ?? {})),
  ];

  let startOccurrences = 0;
  let singleOccurrences = 0;
  const uprightOccurrences = { upright_346_5: 0, upright_99: 0, upright_49_5: 0 };
  let panel197Occurrences = 0;
  const profileOccurrences = { profile_41_5: 0, profile_91: 0, profile_140_5: 0, profile_190: 0 };
  const straightPanelOccurrences = { panel_48_5: 0, panel_98: 0, panel_147_5: 0 };
  for (const recipe of recipes) {
    assert.ok(recipe);
    for (const item of recipe.items) {
      const key = getRecipeItemKey(item);
      if (key === 'connector_start' || key === 'connector_single' || key in uprightOccurrences || key === 'panel_197' || key in profileOccurrences || key in straightPanelOccurrences) {
        if (key === 'connector_start') startOccurrences += 1;
        if (key === 'connector_single') singleOccurrences += 1;
        if (key in uprightOccurrences) uprightOccurrences[key] += 1;
        if (key === 'panel_197') panel197Occurrences += 1;
        if (key in profileOccurrences) profileOccurrences[key] += 1;
        if (key in straightPanelOccurrences) straightPanelOccurrences[key] += 1;
        assert.equal(item.itemKey, key);
        assert.equal(item.partId, undefined);
      } else {
        assert.equal(item.itemKey, undefined, `${recipe.recipeId}: unexpected itemKey migration for ${item.partId}`);
        assert.ok(item.partId, `${recipe.recipeId}: legacy recipe item lost partId`);
      }
    }
  }

  assert.equal(startOccurrences, 27);
  assert.equal(singleOccurrences, 27);
  assert.deepEqual(uprightOccurrences, { upright_346_5: 18, upright_99: 6, upright_49_5: 6 });
  assert.equal(panel197Occurrences, 7);
  assert.deepEqual(profileOccurrences, { profile_41_5: 14, profile_91: 12, profile_140_5: 8, profile_190: 7 });
  assert.deepEqual(straightPanelOccurrences, { panel_48_5: 13, panel_98: 10, panel_147_5: 7 });
});

test('expanded recipes resolve connector_start metadata through its canonical itemKey', () => {
  const expanded = getExpandedStraightWallRecipe(200);
  const connector = expanded.items.find((item) => item.itemKey === 'connector_start');

  assert.equal(connector.part.itemKey, 'connector_start');
  assert.equal(connector.part.name, 'Başlangıç Aparatı');
  assert.equal(connector.part.unit, 'adet');
  assert.equal(connector.bom, undefined);
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
    { itemKey: 'profile_41_5', quantity: 2 },
    { itemKey: 'upright_346_5', quantity: 2 },
    { itemKey: 'panel_48_5', quantity: 7 },
    { itemKey: 'connector_start', quantity: 2 },
    { itemKey: 'connector_single', quantity: 13 },
  ]);
  assert.equal(getRecipeInnerCornerPanelKey(recipe), 'panel_corner_42_5');
});

test('100/150/200 cm straight wall recipes preserve quantities and change verified sizes', () => {
  const expected = {
    100: ['profile_91', 'panel_98', 'panel_corner_92'],
    150: ['profile_140_5', 'panel_147_5', 'panel_corner_142_5'],
    200: ['profile_190', 'panel_197', 'panel_corner_192'],
  };

  for (const [width, [profilePartId, panelPartId, cornerPanelPartId]] of Object.entries(expected)) {
    const recipe = getStraightWallRecipe(Number(width));
    const quantities = Object.fromEntries(recipe.items.map((item) => [item.itemKey ?? item.partId, item.quantity]));

    assert.equal(quantities[profilePartId], 2);
    assert.equal(quantities.upright_346_5, 2);
    assert.equal(quantities[panelPartId], 7);
    assert.equal(quantities.connector_start, 2);
    assert.equal(quantities.connector_single, 13);
    assert.equal(getRecipeInnerCornerPanelKey(recipe), cornerPanelPartId);
  }
});

test('100 cm door recipe matches verified production data', () => {
  const recipe = getModuleRecipe('door', 100);
  assert.deepEqual(recipe.items, [
    { itemKey: 'profile_91', quantity: 1 },
    { itemKey: 'upright_346_5', quantity: 2 },
    { itemKey: 'panel_98', quantity: 3 },
    { itemKey: 'connector_start', quantity: 2 },
    { itemKey: 'connector_single', quantity: 5 },
    { partId: 'door_100', quantity: 1 },
  ]);
  assert.equal(getRecipeInnerCornerPanelKey(recipe), 'panel_corner_92');
});

test('100 and 150 cm two-shelf wall recipes match verified production data', () => {
  const expected = {
    100: ['profile_91', 'panel_98', 'panel_corner_92', 'shelf_100'],
    150: ['profile_140_5', 'panel_147_5', 'panel_corner_142_5', 'shelf_150'],
  };

  for (const [width, [profilePartId, panelPartId, cornerPanelPartId, shelfPartId]] of Object.entries(expected)) {
    const recipe = getModuleRecipe('shelf', Number(width), { shelfCount: 2 });
    const quantities = Object.fromEntries(recipe.items.map((item) => [item.itemKey ?? item.partId, item.quantity]));
    assert.equal(quantities[profilePartId], 2);
    assert.equal(quantities.upright_346_5, 2);
    assert.equal(quantities[panelPartId], 7);
    assert.equal(quantities.connector_start, 2);
    assert.equal(quantities.connector_single, 13);
    assert.equal(quantities[shelfPartId], 2);
    assert.equal(quantities.shelf_leg, 4);
    assert.equal(getRecipeInnerCornerPanelKey(recipe), cornerPanelPartId);
  }
});

test('200 cm two-shelf wall recipe uses six shelf legs', () => {
  const recipe = getModuleRecipe('shelf', 200, { shelfCount: 2 });
  const quantities = Object.fromEntries(recipe.items.map((item) => [item.itemKey ?? item.partId, item.quantity]));
  assert.equal(quantities.profile_190, 2);
  assert.equal(quantities.upright_346_5, 2);
  assert.equal(quantities.panel_197, 7);
  assert.equal(quantities.connector_start, 2);
  assert.equal(quantities.connector_single, 13);
  assert.equal(quantities.shelf_200, 2);
  assert.equal(quantities.shelf_leg, 6);
  assert.equal(getRecipeInnerCornerPanelKey(recipe), 'panel_corner_192');
});


test('100 and 150 cm three-shelf wall recipes match verified production data', () => {
  const expected = {
    100: ['profile_91', 'panel_98', 'panel_corner_92', 'shelf_100'],
    150: ['profile_140_5', 'panel_147_5', 'panel_corner_142_5', 'shelf_150'],
  };

  for (const [width, [profilePartId, panelPartId, cornerPanelPartId, shelfPartId]] of Object.entries(expected)) {
    const recipe = getModuleRecipe('shelf', Number(width), { shelfCount: 3 });
    const quantities = Object.fromEntries(recipe.items.map((item) => [item.itemKey ?? item.partId, item.quantity]));
    assert.equal(quantities[profilePartId], 2);
    assert.equal(quantities.upright_346_5, 2);
    assert.equal(quantities[panelPartId], 7);
    assert.equal(quantities.connector_start, 2);
    assert.equal(quantities.connector_single, 13);
    assert.equal(quantities[shelfPartId], 3);
    assert.equal(quantities.shelf_leg, 6);
    assert.equal(getRecipeInnerCornerPanelKey(recipe), cornerPanelPartId);
  }
});

test('200 cm three-shelf wall recipe uses nine shelf legs', () => {
  const recipe = getModuleRecipe('shelf', 200, { shelfCount: 3 });
  const quantities = Object.fromEntries(recipe.items.map((item) => [item.itemKey ?? item.partId, item.quantity]));
  assert.equal(quantities.profile_190, 2);
  assert.equal(quantities.upright_346_5, 2);
  assert.equal(quantities.panel_197, 7);
  assert.equal(quantities.connector_start, 2);
  assert.equal(quantities.connector_single, 13);
  assert.equal(quantities.shelf_200, 3);
  assert.equal(quantities.shelf_leg, 9);
  assert.equal(getRecipeInnerCornerPanelKey(recipe), 'panel_corner_192');
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

test('double and corner connectors are BOM-capable Items and are not baked into fixed module recipes', () => {
  const recipes = [
    ...listStraightWallRecipes(),
    getModuleRecipe('door', 100),
    ...[100, 150, 200].flatMap((width) => [
      getModuleRecipe('shelf', width, { shelfCount: 2 }),
      getModuleRecipe('shelf', width, { shelfCount: 3 }),
      getModuleRecipe('counter', width, { shape: 'L' }),
      getModuleRecipe('counter', width),
      getModuleRecipe('base-wall', width),
      getModuleRecipe('base', width),
    ]),
    getModuleRecipe('showcase-2', 100),
    getModuleRecipe('showcase-3', 100),
    getModuleRecipe('separator', 50),
    getModuleRecipe('separator', 100),
  ];

  const keys = recipes.flatMap((recipe) => recipe.items.map((item) => item.itemKey ?? item.partId));
  assert.equal(keys.includes('connector_double'), false);
  assert.equal(keys.includes('connector_corner'), false);
});
