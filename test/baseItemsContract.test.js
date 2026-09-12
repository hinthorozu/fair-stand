import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULE_CATALOG, resolveItemKey } from '../src/catalog.js';
import {
  createBaseModuleState,
  createModuleStateFromDescriptor,
  duplicateModuleState,
  normalizeModuleItemState,
} from '../src/designState.js';
import { getItem } from '../src/items.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';
import { resolveModuleContract } from '../src/moduleContracts.js';
import { getModuleRecipe } from '../src/moduleRecipes.js';

const BASE_KEYS = ['BASE_100', 'BASE_150', 'BASE_200'];

const EXPECTED_RECIPE = {
  BASE_100: {
    widthCm: 100,
    top: 'base_top_107_50',
    profile: 'profile_91',
    panel: 'panel_98',
  },
  BASE_150: {
    widthCm: 150,
    top: 'base_top_157_50',
    profile: 'profile_140_5',
    panel: 'panel_147_5',
  },
  BASE_200: {
    widthCm: 200,
    top: 'base_top_206_50',
    profile: 'profile_190',
    panel: 'panel_197',
  },
};

for (const itemKey of BASE_KEYS) {
  test(`${itemKey}: canonical composite identity, state and recipe parity`, () => {
    const item = getItem(itemKey);
    const expected = EXPECTED_RECIPE[itemKey];
    const catalog = MODULE_CATALOG[itemKey];

    assert.equal(item.itemKey, itemKey);
    assert.equal(item.type, 'base');
    assert.equal(item.composition?.mode, 'recipe');
    assert.equal(item.composition?.moduleType, 'base');
    assert.equal(item.composition?.nominalWidthCm, expected.widthCm);
    assert.equal(Object.hasOwn(item, 'unit'), false);
    assert.deepEqual(item.dimensions, {
      widthCm: expected.widthCm,
      depthCm: 50,
      heightCm: 50,
    });

    assert.equal(catalog.itemKey, itemKey);
    assert.equal(catalog.label, item.name);
    assert.equal(catalog.type, 'base');
    assert.equal(catalog.widthCm, expected.widthCm);
    assert.equal(catalog.depthCm, 50);
    assert.equal(catalog.heightCm, 50);

    const state = createModuleStateFromDescriptor(catalog);
    assert.equal(state.itemKey, itemKey);
    assert.equal(state.itemKey, itemKey);
    assert.equal(state.type, 'base');
    assert.equal(state.widthCm, expected.widthCm);
    assert.deepEqual(Object.keys(state.faces), ['front', 'left', 'right']);

    const byWidth = createBaseModuleState(expected.widthCm);
    assert.equal(byWidth.itemKey, itemKey);
    assert.equal(byWidth.itemKey, itemKey);

    assert.equal(getModuleBehavior(state).placement, 'free');
    assert.equal(getModuleBehavior(state).connectionEndpoint, 'logical-fixture');
    assert.equal(getModuleBehavior(state).moveSnapCm, 50);

    const contract = resolveModuleContract(itemKey);
    assert.equal(contract.bom.mode, 'recipe');
    assert.equal(contract.bom.source, 'src/moduleRecipes.js');

    const recipe = getModuleRecipe('base', expected.widthCm);
    const quantities = Object.fromEntries(
      recipe.items.map((entry) => [entry.itemKey ?? entry.partId, entry.quantity]),
    );
    assert.equal(quantities[expected.profile], 4);
    assert.equal(quantities.profile_41_5, 4);
    assert.equal(quantities.upright_49_5, 4);
    assert.equal(quantities[expected.panel], 2);
    assert.equal(quantities.panel_48_5, 2);
    assert.equal(quantities.connector_start, 8);
    assert.equal(quantities.connector_single, 8);
    assert.equal(quantities[expected.top], 1);

    const legacy = JSON.parse(JSON.stringify(state));
    delete legacy.itemKey;
    const restored = normalizeModuleItemState(legacy);
    assert.equal(restored.itemKey, itemKey);
    assert.equal(resolveItemKey(restored), itemKey);

    const duplicate = duplicateModuleState(state);
    assert.notEqual(duplicate.id, state.id);
    assert.equal(duplicate.itemKey, itemKey);
    assert.notEqual(duplicate.faces.front.id, state.faces.front.id);
  });
}

test('wall_base parent Item’ları recipe ailesini BASE’ten ayrı tutar', () => {
  for (const width of [100, 150, 200]) {
    const wallKey = `wall_base_${width}`;
    const wallItem = getItem(wallKey);
    assert.equal(wallItem?.type, 'base-wall');
    assert.equal(MODULE_CATALOG[wallKey].type, 'base-wall');
    assert.equal(MODULE_CATALOG[wallKey].itemKey, wallKey);

    const baseRecipe = getModuleRecipe('base', width);
    const wallRecipe = getModuleRecipe('base-wall', width);
    const baseTop = EXPECTED_RECIPE[`BASE_${width}`].top;
    const baseQty = Object.fromEntries(baseRecipe.items.map((entry) => [entry.itemKey, entry.quantity]));
    const wallQty = Object.fromEntries(wallRecipe.items.map((entry) => [entry.itemKey, entry.quantity]));

    assert.equal(baseQty[baseTop], 1);
    assert.equal(wallQty[baseTop], 1);
    assert.equal(baseQty.upright_49_5, 4);
    assert.equal(wallQty.upright_49_5, 2);
    assert.equal(baseQty.connector_start, 8);
    assert.equal(wallQty.connector_start, 6);
    assert.equal(wallQty.upright_346_5, 2);
    assert.equal(baseQty.upright_346_5, undefined);
  }
});

test('base factory never resolves through getCommercialItemForType', () => {
  const source = fs.readFileSync(new URL('../src/designState.js', import.meta.url), 'utf8');
  assert.match(source, /base:\s*\(descriptor\)\s*=>\s*createBaseModuleState\(descriptor\)/);
  assert.doesNotMatch(source, /getCommercialItemForType\(['"]base['"]\)/);
});
