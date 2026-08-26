import { getProductionPart } from './productionParts.js';

const STRAIGHT_WALL_RECIPES = Object.freeze({
  50: Object.freeze({ recipeId: 'wall-straight-50', moduleType: 'wall', nominalWidthCm: 50, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_41_5', quantity: 2 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'panel_48_5', quantity: 7 }), Object.freeze({ partId: 'connector_start', quantity: 2 }), Object.freeze({ partId: 'connector_single', quantity: 13 }),
  ]), variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_42_5' }) }),
  100: Object.freeze({ recipeId: 'wall-straight-100', moduleType: 'wall', nominalWidthCm: 100, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_91', quantity: 2 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'panel_98', quantity: 7 }), Object.freeze({ partId: 'connector_start', quantity: 2 }), Object.freeze({ partId: 'connector_single', quantity: 13 }),
  ]), variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_92' }) }),
  150: Object.freeze({ recipeId: 'wall-straight-150', moduleType: 'wall', nominalWidthCm: 150, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_140_5', quantity: 2 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'panel_147_5', quantity: 7 }), Object.freeze({ partId: 'connector_start', quantity: 2 }), Object.freeze({ partId: 'connector_single', quantity: 13 }),
  ]), variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_142_5' }) }),
  200: Object.freeze({ recipeId: 'wall-straight-200', moduleType: 'wall', nominalWidthCm: 200, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_190', quantity: 2 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'panel_197', quantity: 7 }), Object.freeze({ partId: 'connector_start', quantity: 2 }), Object.freeze({ partId: 'connector_single', quantity: 13 }),
  ]), variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_192' }) }),
});

const MODULE_RECIPES = Object.freeze({
  'door:100': Object.freeze({ recipeId: 'door-100', moduleType: 'door', nominalWidthCm: 100, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_91', quantity: 1 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'panel_98', quantity: 3 }), Object.freeze({ partId: 'connector_start', quantity: 2 }), Object.freeze({ partId: 'connector_single', quantity: 5 }), Object.freeze({ partId: 'door_100', quantity: 1 }),
  ]), variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_92' }) }),

  'shelf:100:2': Object.freeze({ recipeId: 'shelf-wall-100-2', moduleType: 'shelf', nominalWidthCm: 100, shelfCount: 2, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_91', quantity: 2 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'panel_98', quantity: 7 }), Object.freeze({ partId: 'connector_start', quantity: 2 }), Object.freeze({ partId: 'connector_single', quantity: 13 }), Object.freeze({ partId: 'shelf_100', quantity: 2 }), Object.freeze({ partId: 'shelf_leg', quantity: 4 }),
  ]), variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_92' }) }),
  'shelf:150:2': Object.freeze({ recipeId: 'shelf-wall-150-2', moduleType: 'shelf', nominalWidthCm: 150, shelfCount: 2, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_140_5', quantity: 2 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'panel_147_5', quantity: 7 }), Object.freeze({ partId: 'connector_start', quantity: 2 }), Object.freeze({ partId: 'connector_single', quantity: 13 }), Object.freeze({ partId: 'shelf_150', quantity: 2 }), Object.freeze({ partId: 'shelf_leg', quantity: 4 }),
  ]), variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_142_5' }) }),
  'shelf:200:2': Object.freeze({ recipeId: 'shelf-wall-200-2', moduleType: 'shelf', nominalWidthCm: 200, shelfCount: 2, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_190', quantity: 2 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'panel_197', quantity: 7 }), Object.freeze({ partId: 'connector_start', quantity: 2 }), Object.freeze({ partId: 'connector_single', quantity: 13 }), Object.freeze({ partId: 'shelf_200', quantity: 2 }), Object.freeze({ partId: 'shelf_leg', quantity: 6 }),
  ]), variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_192' }) }),
  'shelf:100:3': Object.freeze({ recipeId: 'shelf-wall-100-3', moduleType: 'shelf', nominalWidthCm: 100, shelfCount: 3, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_91', quantity: 2 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'panel_98', quantity: 7 }), Object.freeze({ partId: 'connector_start', quantity: 2 }), Object.freeze({ partId: 'connector_single', quantity: 13 }), Object.freeze({ partId: 'shelf_100', quantity: 3 }), Object.freeze({ partId: 'shelf_leg', quantity: 6 }),
  ]), variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_92' }) }),
  'shelf:150:3': Object.freeze({ recipeId: 'shelf-wall-150-3', moduleType: 'shelf', nominalWidthCm: 150, shelfCount: 3, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_140_5', quantity: 2 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'panel_147_5', quantity: 7 }), Object.freeze({ partId: 'connector_start', quantity: 2 }), Object.freeze({ partId: 'connector_single', quantity: 13 }), Object.freeze({ partId: 'shelf_150', quantity: 3 }), Object.freeze({ partId: 'shelf_leg', quantity: 6 }),
  ]), variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_142_5' }) }),
  'shelf:200:3': Object.freeze({ recipeId: 'shelf-wall-200-3', moduleType: 'shelf', nominalWidthCm: 200, shelfCount: 3, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_190', quantity: 2 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'panel_197', quantity: 7 }), Object.freeze({ partId: 'connector_start', quantity: 2 }), Object.freeze({ partId: 'connector_single', quantity: 13 }), Object.freeze({ partId: 'shelf_200', quantity: 3 }), Object.freeze({ partId: 'shelf_leg', quantity: 9 }),
  ]), variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_192' }) }),

  'showcase-2:100': Object.freeze({ recipeId: 'showcase-2-100', moduleType: 'showcase-2', nominalWidthCm: 100, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_91', quantity: 4 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'panel_98', quantity: 5 }), Object.freeze({ partId: 'connector_start', quantity: 4 }), Object.freeze({ partId: 'connector_single', quantity: 9 }), Object.freeze({ partId: 'showcase_2_100', quantity: 1 }), Object.freeze({ partId: 'glass_shelf', quantity: 2 }),
  ]), variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_92' }) }),
  'showcase-3:100': Object.freeze({ recipeId: 'showcase-3-100', moduleType: 'showcase-3', nominalWidthCm: 100, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_91', quantity: 4 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'panel_98', quantity: 4 }), Object.freeze({ partId: 'connector_start', quantity: 4 }), Object.freeze({ partId: 'connector_single', quantity: 7 }), Object.freeze({ partId: 'showcase_3_100', quantity: 1 }), Object.freeze({ partId: 'glass_shelf', quantity: 3 }),
  ]), variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_92' }) }),

  'separator:50': Object.freeze({ recipeId: 'separator-50', moduleType: 'separator', nominalWidthCm: 50, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_41_5', quantity: 2 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'separator_panel_48_5', quantity: 1 }), Object.freeze({ partId: 'separator_panel_98', quantity: 3 }), Object.freeze({ partId: 'connector_start', quantity: 2 }), Object.freeze({ partId: 'connector_single', quantity: 7 }),
  ]) }),
  'separator:100': Object.freeze({ recipeId: 'separator-100', moduleType: 'separator', nominalWidthCm: 100, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_91', quantity: 2 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'separator_panel_98', quantity: 7 }), Object.freeze({ partId: 'connector_start', quantity: 2 }), Object.freeze({ partId: 'connector_single', quantity: 13 }),
  ]) }),

  'counter:100': Object.freeze({ recipeId: 'counter-100', moduleType: 'counter', nominalWidthCm: 100, items: Object.freeze([
    Object.freeze({ partId: 'profile_91', quantity: 3 }), Object.freeze({ partId: 'profile_41_5', quantity: 4 }), Object.freeze({ partId: 'upright_99', quantity: 4 }), Object.freeze({ partId: 'panel_98', quantity: 2 }), Object.freeze({ partId: 'panel_48_5', quantity: 4 }), Object.freeze({ partId: 'connector_start', quantity: 6 }), Object.freeze({ partId: 'connector_single', quantity: 12 }), Object.freeze({ partId: 'counter_top_110_60', quantity: 1 }),
  ]) }),
  'counter:150': Object.freeze({ recipeId: 'counter-150', moduleType: 'counter', nominalWidthCm: 150, items: Object.freeze([
    Object.freeze({ partId: 'profile_140_5', quantity: 3 }), Object.freeze({ partId: 'profile_41_5', quantity: 4 }), Object.freeze({ partId: 'upright_99', quantity: 4 }), Object.freeze({ partId: 'panel_147_5', quantity: 2 }), Object.freeze({ partId: 'panel_48_5', quantity: 4 }), Object.freeze({ partId: 'connector_start', quantity: 6 }), Object.freeze({ partId: 'connector_single', quantity: 12 }), Object.freeze({ partId: 'counter_top_160_60', quantity: 1 }),
  ]) }),
  'counter:200': Object.freeze({ recipeId: 'counter-200', moduleType: 'counter', nominalWidthCm: 200, items: Object.freeze([
    Object.freeze({ partId: 'profile_190', quantity: 3 }), Object.freeze({ partId: 'profile_41_5', quantity: 4 }), Object.freeze({ partId: 'upright_99', quantity: 4 }), Object.freeze({ partId: 'panel_197', quantity: 2 }), Object.freeze({ partId: 'panel_48_5', quantity: 4 }), Object.freeze({ partId: 'connector_start', quantity: 6 }), Object.freeze({ partId: 'connector_single', quantity: 12 }), Object.freeze({ partId: 'counter_top_210_60', quantity: 1 }),
  ]) }),

  'base-wall:100': Object.freeze({ recipeId: 'base-wall-100', moduleType: 'base-wall', nominalWidthCm: 100, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_91', quantity: 4 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'profile_41_5', quantity: 4 }), Object.freeze({ partId: 'upright_49_5', quantity: 2 }), Object.freeze({ partId: 'panel_98', quantity: 7 }), Object.freeze({ partId: 'panel_48_5', quantity: 2 }), Object.freeze({ partId: 'connector_start', quantity: 6 }), Object.freeze({ partId: 'connector_single', quantity: 17 }), Object.freeze({ partId: 'base_top_107_50', quantity: 1 }),
  ]), variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_92' }) }),
  'base-wall:150': Object.freeze({ recipeId: 'base-wall-150', moduleType: 'base-wall', nominalWidthCm: 150, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_140_5', quantity: 4 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'profile_41_5', quantity: 4 }), Object.freeze({ partId: 'upright_49_5', quantity: 2 }), Object.freeze({ partId: 'panel_147_5', quantity: 7 }), Object.freeze({ partId: 'panel_48_5', quantity: 2 }), Object.freeze({ partId: 'connector_start', quantity: 6 }), Object.freeze({ partId: 'connector_single', quantity: 17 }), Object.freeze({ partId: 'base_top_157_50', quantity: 1 }),
  ]), variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_142_5' }) }),
  'base-wall:200': Object.freeze({ recipeId: 'base-wall-200', moduleType: 'base-wall', nominalWidthCm: 200, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ partId: 'profile_190', quantity: 4 }), Object.freeze({ partId: 'upright_346_5', quantity: 2 }), Object.freeze({ partId: 'profile_41_5', quantity: 4 }), Object.freeze({ partId: 'upright_49_5', quantity: 2 }), Object.freeze({ partId: 'panel_197', quantity: 7 }), Object.freeze({ partId: 'panel_48_5', quantity: 2 }), Object.freeze({ partId: 'connector_start', quantity: 6 }), Object.freeze({ partId: 'connector_single', quantity: 17 }), Object.freeze({ partId: 'base_top_206_50', quantity: 1 }),
  ]), variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_192' }) }),

  'base:100': Object.freeze({ recipeId: 'base-100', moduleType: 'base', nominalWidthCm: 100, items: Object.freeze([
    Object.freeze({ partId: 'profile_91', quantity: 4 }), Object.freeze({ partId: 'profile_41_5', quantity: 4 }), Object.freeze({ partId: 'upright_49_5', quantity: 4 }), Object.freeze({ partId: 'panel_98', quantity: 2 }), Object.freeze({ partId: 'panel_48_5', quantity: 2 }), Object.freeze({ partId: 'connector_start', quantity: 8 }), Object.freeze({ partId: 'connector_single', quantity: 8 }), Object.freeze({ partId: 'base_top_107_50', quantity: 1 }),
  ]) }),
  'base:150': Object.freeze({ recipeId: 'base-150', moduleType: 'base', nominalWidthCm: 150, items: Object.freeze([
    Object.freeze({ partId: 'profile_140_5', quantity: 4 }), Object.freeze({ partId: 'profile_41_5', quantity: 4 }), Object.freeze({ partId: 'upright_49_5', quantity: 4 }), Object.freeze({ partId: 'panel_147_5', quantity: 2 }), Object.freeze({ partId: 'panel_48_5', quantity: 2 }), Object.freeze({ partId: 'connector_start', quantity: 8 }), Object.freeze({ partId: 'connector_single', quantity: 8 }), Object.freeze({ partId: 'base_top_157_50', quantity: 1 }),
  ]) }),
  'base:200': Object.freeze({ recipeId: 'base-200', moduleType: 'base', nominalWidthCm: 200, items: Object.freeze([
    Object.freeze({ partId: 'profile_190', quantity: 4 }), Object.freeze({ partId: 'profile_41_5', quantity: 4 }), Object.freeze({ partId: 'upright_49_5', quantity: 4 }), Object.freeze({ partId: 'panel_197', quantity: 2 }), Object.freeze({ partId: 'panel_48_5', quantity: 2 }), Object.freeze({ partId: 'connector_start', quantity: 8 }), Object.freeze({ partId: 'connector_single', quantity: 8 }), Object.freeze({ partId: 'base_top_206_50', quantity: 1 }),
  ]) }),
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
  return { ...recipe, items: recipe.items.map((item) => ({ ...item, part: getProductionPart(item.partId) })) };
}

export function getExpandedStraightWallRecipe(nominalWidthCm) {
  return expandRecipe(getStraightWallRecipe(nominalWidthCm));
}

export function getExpandedModuleRecipe(moduleType, nominalWidthCm, options = {}) {
  return expandRecipe(getModuleRecipe(moduleType, nominalWidthCm, options));
}
