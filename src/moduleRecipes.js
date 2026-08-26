import { getProductionPart } from './productionParts.js';

const STRAIGHT_WALL_RECIPES = Object.freeze({
  50: Object.freeze({
    recipeId: 'wall-straight-50', moduleType: 'wall', nominalWidthCm: 50, connectionMode: 'straight',
    items: Object.freeze([
      Object.freeze({ partId: 'profile_41_5', quantity: 2 }),
      Object.freeze({ partId: 'upright_346_5', quantity: 2 }),
      Object.freeze({ partId: 'panel_48_5', quantity: 7 }),
      Object.freeze({ partId: 'connector_start', quantity: 2 }),
      Object.freeze({ partId: 'connector_single', quantity: 13 }),
    ]),
    variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_42_5' }),
  }),
  100: Object.freeze({
    recipeId: 'wall-straight-100', moduleType: 'wall', nominalWidthCm: 100, connectionMode: 'straight',
    items: Object.freeze([
      Object.freeze({ partId: 'profile_91', quantity: 2 }),
      Object.freeze({ partId: 'upright_346_5', quantity: 2 }),
      Object.freeze({ partId: 'panel_98', quantity: 7 }),
      Object.freeze({ partId: 'connector_start', quantity: 2 }),
      Object.freeze({ partId: 'connector_single', quantity: 13 }),
    ]),
    variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_92' }),
  }),
  150: Object.freeze({
    recipeId: 'wall-straight-150', moduleType: 'wall', nominalWidthCm: 150, connectionMode: 'straight',
    items: Object.freeze([
      Object.freeze({ partId: 'profile_140_5', quantity: 2 }),
      Object.freeze({ partId: 'upright_346_5', quantity: 2 }),
      Object.freeze({ partId: 'panel_147_5', quantity: 7 }),
      Object.freeze({ partId: 'connector_start', quantity: 2 }),
      Object.freeze({ partId: 'connector_single', quantity: 13 }),
    ]),
    variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_142_5' }),
  }),
  200: Object.freeze({
    recipeId: 'wall-straight-200', moduleType: 'wall', nominalWidthCm: 200, connectionMode: 'straight',
    items: Object.freeze([
      Object.freeze({ partId: 'profile_190', quantity: 2 }),
      Object.freeze({ partId: 'upright_346_5', quantity: 2 }),
      Object.freeze({ partId: 'panel_197', quantity: 7 }),
      Object.freeze({ partId: 'connector_start', quantity: 2 }),
      Object.freeze({ partId: 'connector_single', quantity: 13 }),
    ]),
    variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_192' }),
  }),
});

const MODULE_RECIPES = Object.freeze({
  'door:100': Object.freeze({
    recipeId: 'door-100',
    moduleType: 'door',
    nominalWidthCm: 100,
    connectionMode: 'straight',
    items: Object.freeze([
      Object.freeze({ partId: 'profile_91', quantity: 1 }),
      Object.freeze({ partId: 'upright_346_5', quantity: 2 }),
      Object.freeze({ partId: 'panel_98', quantity: 3 }),
      Object.freeze({ partId: 'connector_start', quantity: 2 }),
      Object.freeze({ partId: 'connector_single', quantity: 5 }),
      Object.freeze({ partId: 'door_100', quantity: 1 }),
    ]),
    variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_92' }),
  }),
  'shelf:100:2': Object.freeze({
    recipeId: 'shelf-wall-100-2',
    moduleType: 'shelf',
    nominalWidthCm: 100,
    shelfCount: 2,
    connectionMode: 'straight',
    items: Object.freeze([
      Object.freeze({ partId: 'profile_91', quantity: 2 }),
      Object.freeze({ partId: 'upright_346_5', quantity: 2 }),
      Object.freeze({ partId: 'panel_98', quantity: 7 }),
      Object.freeze({ partId: 'connector_start', quantity: 2 }),
      Object.freeze({ partId: 'connector_single', quantity: 13 }),
      Object.freeze({ partId: 'shelf_100', quantity: 2 }),
      Object.freeze({ partId: 'shelf_leg', quantity: 4 }),
    ]),
    variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_92' }),
  }),
  'shelf:150:2': Object.freeze({
    recipeId: 'shelf-wall-150-2',
    moduleType: 'shelf',
    nominalWidthCm: 150,
    shelfCount: 2,
    connectionMode: 'straight',
    items: Object.freeze([
      Object.freeze({ partId: 'profile_140_5', quantity: 2 }),
      Object.freeze({ partId: 'upright_346_5', quantity: 2 }),
      Object.freeze({ partId: 'panel_147_5', quantity: 7 }),
      Object.freeze({ partId: 'connector_start', quantity: 2 }),
      Object.freeze({ partId: 'connector_single', quantity: 13 }),
      Object.freeze({ partId: 'shelf_150', quantity: 2 }),
      Object.freeze({ partId: 'shelf_leg', quantity: 4 }),
    ]),
    variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_142_5' }),
  }),
  'shelf:200:2': Object.freeze({
    recipeId: 'shelf-wall-200-2',
    moduleType: 'shelf',
    nominalWidthCm: 200,
    shelfCount: 2,
    connectionMode: 'straight',
    items: Object.freeze([
      Object.freeze({ partId: 'profile_190', quantity: 2 }),
      Object.freeze({ partId: 'upright_346_5', quantity: 2 }),
      Object.freeze({ partId: 'panel_197', quantity: 7 }),
      Object.freeze({ partId: 'connector_start', quantity: 2 }),
      Object.freeze({ partId: 'connector_single', quantity: 13 }),
      Object.freeze({ partId: 'shelf_200', quantity: 2 }),
      Object.freeze({ partId: 'shelf_leg', quantity: 6 }),
    ]),
    variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_192' }),
  }),
  'shelf:100:3': Object.freeze({
    recipeId: 'shelf-wall-100-3',
    moduleType: 'shelf',
    nominalWidthCm: 100,
    shelfCount: 3,
    connectionMode: 'straight',
    items: Object.freeze([
      Object.freeze({ partId: 'profile_91', quantity: 2 }),
      Object.freeze({ partId: 'upright_346_5', quantity: 2 }),
      Object.freeze({ partId: 'panel_98', quantity: 7 }),
      Object.freeze({ partId: 'connector_start', quantity: 2 }),
      Object.freeze({ partId: 'connector_single', quantity: 13 }),
      Object.freeze({ partId: 'shelf_100', quantity: 3 }),
      Object.freeze({ partId: 'shelf_leg', quantity: 6 }),
    ]),
    variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_92' }),
  }),
  'shelf:150:3': Object.freeze({
    recipeId: 'shelf-wall-150-3',
    moduleType: 'shelf',
    nominalWidthCm: 150,
    shelfCount: 3,
    connectionMode: 'straight',
    items: Object.freeze([
      Object.freeze({ partId: 'profile_140_5', quantity: 2 }),
      Object.freeze({ partId: 'upright_346_5', quantity: 2 }),
      Object.freeze({ partId: 'panel_147_5', quantity: 7 }),
      Object.freeze({ partId: 'connector_start', quantity: 2 }),
      Object.freeze({ partId: 'connector_single', quantity: 13 }),
      Object.freeze({ partId: 'shelf_150', quantity: 3 }),
      Object.freeze({ partId: 'shelf_leg', quantity: 6 }),
    ]),
    variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_142_5' }),
  }),
  'shelf:200:3': Object.freeze({
    recipeId: 'shelf-wall-200-3',
    moduleType: 'shelf',
    nominalWidthCm: 200,
    shelfCount: 3,
    connectionMode: 'straight',
    items: Object.freeze([
      Object.freeze({ partId: 'profile_190', quantity: 2 }),
      Object.freeze({ partId: 'upright_346_5', quantity: 2 }),
      Object.freeze({ partId: 'panel_197', quantity: 7 }),
      Object.freeze({ partId: 'connector_start', quantity: 2 }),
      Object.freeze({ partId: 'connector_single', quantity: 13 }),
      Object.freeze({ partId: 'shelf_200', quantity: 3 }),
      Object.freeze({ partId: 'shelf_leg', quantity: 9 }),
    ]),
    variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_192' }),
  }),
});

export function getStraightWallRecipe(nominalWidthCm) {
  return STRAIGHT_WALL_RECIPES[nominalWidthCm] ?? null;
}

export function listStraightWallRecipes() {
  return Object.values(STRAIGHT_WALL_RECIPES);
}

export function getModuleRecipe(moduleType, nominalWidthCm, options = {}) {
  if (moduleType === 'wall' || moduleType === 'flat-panel') return getStraightWallRecipe(nominalWidthCm);
  if (moduleType === 'shelf') {
    const shelfCount = Number(options.shelfCount);
    return MODULE_RECIPES[`shelf:${nominalWidthCm}:${shelfCount}`] ?? null;
  }
  return MODULE_RECIPES[`${moduleType}:${nominalWidthCm}`] ?? null;
}

export function expandRecipe(recipe) {
  if (!recipe) return null;
  return {
    ...recipe,
    items: recipe.items.map((item) => ({ ...item, part: getProductionPart(item.partId) })),
  };
}

export function getExpandedStraightWallRecipe(nominalWidthCm) {
  return expandRecipe(getStraightWallRecipe(nominalWidthCm));
}

export function getExpandedModuleRecipe(moduleType, nominalWidthCm, options = {}) {
  return expandRecipe(getModuleRecipe(moduleType, nominalWidthCm, options));
}
