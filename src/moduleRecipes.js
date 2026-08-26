import { getProductionPart } from './productionParts.js';

const STRAIGHT_WALL_RECIPES = Object.freeze({
  50: Object.freeze({
    recipeId: 'wall-straight-50',
    moduleType: 'wall',
    nominalWidthCm: 50,
    connectionMode: 'straight',
    items: Object.freeze([
      Object.freeze({ partId: 'profile_41_5', quantity: 2 }),
      Object.freeze({ partId: 'upright_346_5', quantity: 2 }),
      Object.freeze({ partId: 'panel_48_5', quantity: 7 }),
      Object.freeze({ partId: 'connector_start', quantity: 2 }),
      Object.freeze({ partId: 'connector_single', quantity: 13 }),
    ]),
    variants: Object.freeze({
      innerCornerPanelPartId: 'panel_corner_42_5',
    }),
  }),
  100: Object.freeze({
    recipeId: 'wall-straight-100',
    moduleType: 'wall',
    nominalWidthCm: 100,
    connectionMode: 'straight',
    items: Object.freeze([
      Object.freeze({ partId: 'profile_91', quantity: 2 }),
      Object.freeze({ partId: 'upright_346_5', quantity: 2 }),
      Object.freeze({ partId: 'panel_98', quantity: 7 }),
      Object.freeze({ partId: 'connector_start', quantity: 2 }),
      Object.freeze({ partId: 'connector_single', quantity: 13 }),
    ]),
    variants: Object.freeze({
      innerCornerPanelPartId: 'panel_corner_92',
    }),
  }),
  150: Object.freeze({
    recipeId: 'wall-straight-150',
    moduleType: 'wall',
    nominalWidthCm: 150,
    connectionMode: 'straight',
    items: Object.freeze([
      Object.freeze({ partId: 'profile_140_5', quantity: 2 }),
      Object.freeze({ partId: 'upright_346_5', quantity: 2 }),
      Object.freeze({ partId: 'panel_147_5', quantity: 7 }),
      Object.freeze({ partId: 'connector_start', quantity: 2 }),
      Object.freeze({ partId: 'connector_single', quantity: 13 }),
    ]),
    variants: Object.freeze({
      innerCornerPanelPartId: 'panel_corner_142_5',
    }),
  }),
  200: Object.freeze({
    recipeId: 'wall-straight-200',
    moduleType: 'wall',
    nominalWidthCm: 200,
    connectionMode: 'straight',
    items: Object.freeze([
      Object.freeze({ partId: 'profile_190', quantity: 2 }),
      Object.freeze({ partId: 'upright_346_5', quantity: 2 }),
      Object.freeze({ partId: 'panel_197', quantity: 7 }),
      Object.freeze({ partId: 'connector_start', quantity: 2 }),
      Object.freeze({ partId: 'connector_single', quantity: 13 }),
    ]),
    variants: Object.freeze({
      innerCornerPanelPartId: 'panel_corner_192',
    }),
  }),
});

export function getStraightWallRecipe(nominalWidthCm) {
  return STRAIGHT_WALL_RECIPES[nominalWidthCm] ?? null;
}

export function listStraightWallRecipes() {
  return Object.values(STRAIGHT_WALL_RECIPES);
}

export function expandRecipe(recipe) {
  if (!recipe) return null;

  return {
    ...recipe,
    items: recipe.items.map((item) => ({
      ...item,
      part: getProductionPart(item.partId),
    })),
  };
}

export function getExpandedStraightWallRecipe(nominalWidthCm) {
  return expandRecipe(getStraightWallRecipe(nominalWidthCm));
}
