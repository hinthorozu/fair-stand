import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import { createModuleStateFromDescriptor, normalizeModuleItemState } from '../src/designState.js';
import { resolveItemBom } from '../src/itemBom.js';
import { getItem } from '../src/items.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';
import { resolveModuleContract } from '../src/moduleContracts.js';
import { getExpandedModuleRecipe, getModuleRecipe, getRecipeItemKey } from '../src/moduleRecipes.js';
import { getProductionItem } from '../src/productionParts.js';

const EXPECTED_CHILDREN = [
  ['profile_91', 1],
  ['upright_346_5', 2],
  ['panel_98', 3],
  ['connector_start', 2],
  ['connector_single', 5],
  ['door_leaf_100', 1],
];

const EXPECTED_INNER_CORNER_CHILDREN = [
  ['profile_91', 1],
  ['upright_346_5', 2],
  ['panel_corner_92', 3],
  ['connector_start', 2],
  ['connector_single', 3],
  ['connector_corner', 2],
  ['door_leaf_100', 1],
];

test('door_100 is the single canonical composite Item identity', () => {
  const item = getItem('door_100');

  assert.equal(item.itemKey, 'door_100');
  assert.equal(item.name, 'Depo Kapısı 100');
  assert.equal(item.type, 'door');
  assert.equal(item.unit, 'adet');
  assert.deepEqual(item.dimensions, { widthCm: 100 });
  assert.deepEqual(item.composition, {
    mode: 'recipe',
    moduleType: 'door',
    nominalWidthCm: 100,
  });
  assert.equal(getProductionItem('door_100'), null, 'composite parent must not masquerade as a production leaf');
});

test('legacy uppercase DOOR_100 catalog identity is removed', () => {
  assert.equal(MODULE_CATALOG.DOOR_100, undefined);
  assert.equal(MODULE_CATALOG_KEYS.includes('DOOR_100'), false);
  assert.equal(MODULE_CATALOG_KEYS.includes('door_100'), true);

  const catalogItem = MODULE_CATALOG.door_100;
  assert.equal(catalogItem.itemKey, 'door_100');
  assert.equal(catalogItem.type, 'door');
  assert.equal(catalogItem.widthCm, 100);
  assert.equal(catalogItem.label, 'Depo Kapısı 100');
});

test('door_100 composition delegates quantities to the existing canonical recipe', () => {
  const recipe = getModuleRecipe('door', 100);
  assert.ok(recipe);
  assert.deepEqual(
    recipe.items.map((entry) => [getRecipeItemKey(entry), entry.quantity]),
    EXPECTED_CHILDREN,
  );
});

test('door_100 inner-corner recipe changes panels and connector composition canonically', () => {
  const recipe = getExpandedModuleRecipe('door', 100, { panelVariant: 'inner-corner' });
  assert.ok(recipe);
  assert.deepEqual(
    recipe.items.map((entry) => [getRecipeItemKey(entry), entry.quantity]),
    EXPECTED_INNER_CORNER_CHILDREN,
  );
});

test('door_100 recursive BOM resolves to canonical leaf Items with quantities and units', () => {
  const bom = resolveItemBom('door_100');
  assert.deepEqual(
    bom.map((line) => [line.itemKey, line.quantity, line.unit]),
    EXPECTED_CHILDREN.map(([itemKey, quantity]) => [itemKey, quantity, 'adet']),
  );
  bom.forEach((line) => {
    assert.equal(line.item.itemKey ?? line.item.partId, line.itemKey);
  });
});

test('door_100 recursive BOM resolves the verified inner-corner variant', () => {
  const bom = resolveItemBom('door_100', 1, { panelVariant: 'inner-corner' });
  assert.deepEqual(
    bom.map((line) => [line.itemKey, line.quantity, line.unit]),
    EXPECTED_INNER_CORNER_CHILDREN.map(([itemKey, quantity]) => [itemKey, quantity, 'adet']),
  );
});

test('door_100 factory/persistence identity and child door leaf identity are canonical', () => {
  const state = createModuleStateFromDescriptor(MODULE_CATALOG.door_100);
  assert.ok(state);
  assert.equal(state.itemKey, 'door_100');
  assert.equal(state.catalogKey, 'door_100');
  assert.equal(state.type, 'door');
  assert.equal(state.widthCm, 100);
  assert.equal(state.surface.itemKey, 'door_leaf_100');

  state.surface.color = '#123456';
  const normalized = normalizeModuleItemState(state);
  assert.equal(normalized.itemKey, 'door_100');
  assert.equal(normalized.surface.itemKey, 'door_leaf_100');
  assert.equal(normalized.surface.color, '#123456');
});

test('door_100 preserves the existing door behavior/contract family', () => {
  const behavior = getModuleBehavior(getItem('door_100'));
  assert.equal(behavior.placement, 'wall');
  assert.equal(behavior.moveSnapCm, 50);
  assert.equal(behavior.rotationStepDeg, 90);
  assert.equal(behavior.collision, 'segment');
  assert.equal(behavior.allowSideInsert, true);

  const contract = resolveModuleContract('door_100');
  assert.ok(contract);
  assert.equal(contract.id, 'door_100');
  assert.equal(contract.type, 'door');
  assert.equal(contract.profile, 'wall-editable');
  assert.equal(contract.bom.mode, 'recipe');
});

test('active door Item surfaces no longer carry the uppercase legacy key', () => {
  const catalogSource = readFileSync(new URL('../src/catalog.js', import.meta.url), 'utf8');
  const contractSource = readFileSync(new URL('../src/moduleContracts.js', import.meta.url), 'utf8');
  const systemCatalog = readFileSync(new URL('../SYSTEM_MODULE_CATALOG.md', import.meta.url), 'utf8');
  const rawBomSource = readFileSync(new URL('../src/rawBomDebug.js', import.meta.url), 'utf8');

  assert.doesNotMatch(catalogSource, /DOOR_100/);
  assert.doesNotMatch(contractSource, /DOOR_100/);
  assert.doesNotMatch(systemCatalog, /DOOR_100/);
  assert.match(rawBomSource, /import \{ resolveItemBom \} from '\.\/itemBom\.js'/);
  assert.match(rawBomSource, /renderItemBom\('door_100'/);
  assert.equal(existsSync(new URL('../docs/items/definitions/DOOR_100.md', import.meta.url)), false);
});
