import { getProductionItem } from './productionParts.js';

const STRAIGHT_WALL_RECIPES = Object.freeze({
  50: Object.freeze({ recipeId: 'wall-straight-50', moduleType: 'wall', nominalWidthCm: 50, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_41_5', quantity: 2 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_48_5', quantity: 7 }), Object.freeze({ itemKey: 'connector_start', quantity: 2 }), Object.freeze({ itemKey: 'connector_single', quantity: 13 }),
  ]), variants: Object.freeze({ innerCornerPanelItemKey: 'panel_corner_42_5' }) }),
  100: Object.freeze({ recipeId: 'wall-straight-100', moduleType: 'wall', nominalWidthCm: 100, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_91', quantity: 2 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_98', quantity: 7 }), Object.freeze({ itemKey: 'connector_start', quantity: 2 }), Object.freeze({ itemKey: 'connector_single', quantity: 13 }),
  ]), variants: Object.freeze({ innerCornerPanelItemKey: 'panel_corner_92' }) }),
  150: Object.freeze({ recipeId: 'wall-straight-150', moduleType: 'wall', nominalWidthCm: 150, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_140_5', quantity: 2 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_147_5', quantity: 7 }), Object.freeze({ itemKey: 'connector_start', quantity: 2 }), Object.freeze({ itemKey: 'connector_single', quantity: 13 }),
  ]), variants: Object.freeze({ innerCornerPanelItemKey: 'panel_corner_142_5' }) }),
  200: Object.freeze({ recipeId: 'wall-straight-200', moduleType: 'wall', nominalWidthCm: 200, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_190', quantity: 2 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_197', quantity: 7 }), Object.freeze({ itemKey: 'connector_start', quantity: 2 }), Object.freeze({ itemKey: 'connector_single', quantity: 13 }),
  ]), variants: Object.freeze({ innerCornerPanelItemKey: 'panel_corner_192' }) }),
});

const MODULE_RECIPES = Object.freeze({
  'door:100': Object.freeze({ recipeId: 'door-100', moduleType: 'door', nominalWidthCm: 100, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_91', quantity: 1 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_98', quantity: 3 }), Object.freeze({ itemKey: 'connector_start', quantity: 2 }), Object.freeze({ itemKey: 'connector_single', quantity: 5 }), Object.freeze({ partId: 'door_100', quantity: 1 }),
  ]), variants: Object.freeze({ innerCornerPanelItemKey: 'panel_corner_92' }) }),

  'shelf:100:2': Object.freeze({ recipeId: 'shelf-wall-100-2', moduleType: 'shelf', nominalWidthCm: 100, shelfCount: 2, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_91', quantity: 2 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_98', quantity: 7 }), Object.freeze({ itemKey: 'connector_start', quantity: 2 }), Object.freeze({ itemKey: 'connector_single', quantity: 13 }), Object.freeze({ itemKey: 'shelf_100', quantity: 2 }), Object.freeze({ itemKey: 'shelf_leg', quantity: 4 }),
  ]), variants: Object.freeze({ innerCornerPanelItemKey: 'panel_corner_92' }) }),
  'shelf:150:2': Object.freeze({ recipeId: 'shelf-wall-150-2', moduleType: 'shelf', nominalWidthCm: 150, shelfCount: 2, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_140_5', quantity: 2 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_147_5', quantity: 7 }), Object.freeze({ itemKey: 'connector_start', quantity: 2 }), Object.freeze({ itemKey: 'connector_single', quantity: 13 }), Object.freeze({ itemKey: 'shelf_150', quantity: 2 }), Object.freeze({ itemKey: 'shelf_leg', quantity: 4 }),
  ]), variants: Object.freeze({ innerCornerPanelItemKey: 'panel_corner_142_5' }) }),
  'shelf:200:2': Object.freeze({ recipeId: 'shelf-wall-200-2', moduleType: 'shelf', nominalWidthCm: 200, shelfCount: 2, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_190', quantity: 2 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_197', quantity: 7 }), Object.freeze({ itemKey: 'connector_start', quantity: 2 }), Object.freeze({ itemKey: 'connector_single', quantity: 13 }), Object.freeze({ itemKey: 'shelf_200', quantity: 2 }), Object.freeze({ itemKey: 'shelf_leg', quantity: 6 }),
  ]), variants: Object.freeze({ innerCornerPanelItemKey: 'panel_corner_192' }) }),
  'shelf:100:3': Object.freeze({ recipeId: 'shelf-wall-100-3', moduleType: 'shelf', nominalWidthCm: 100, shelfCount: 3, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_91', quantity: 2 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_98', quantity: 7 }), Object.freeze({ itemKey: 'connector_start', quantity: 2 }), Object.freeze({ itemKey: 'connector_single', quantity: 13 }), Object.freeze({ itemKey: 'shelf_100', quantity: 3 }), Object.freeze({ itemKey: 'shelf_leg', quantity: 6 }),
  ]), variants: Object.freeze({ innerCornerPanelItemKey: 'panel_corner_92' }) }),
  'shelf:150:3': Object.freeze({ recipeId: 'shelf-wall-150-3', moduleType: 'shelf', nominalWidthCm: 150, shelfCount: 3, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_140_5', quantity: 2 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_147_5', quantity: 7 }), Object.freeze({ itemKey: 'connector_start', quantity: 2 }), Object.freeze({ itemKey: 'connector_single', quantity: 13 }), Object.freeze({ itemKey: 'shelf_150', quantity: 3 }), Object.freeze({ itemKey: 'shelf_leg', quantity: 6 }),
  ]), variants: Object.freeze({ innerCornerPanelItemKey: 'panel_corner_142_5' }) }),
  'shelf:200:3': Object.freeze({ recipeId: 'shelf-wall-200-3', moduleType: 'shelf', nominalWidthCm: 200, shelfCount: 3, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_190', quantity: 2 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_197', quantity: 7 }), Object.freeze({ itemKey: 'connector_start', quantity: 2 }), Object.freeze({ itemKey: 'connector_single', quantity: 13 }), Object.freeze({ itemKey: 'shelf_200', quantity: 3 }), Object.freeze({ itemKey: 'shelf_leg', quantity: 9 }),
  ]), variants: Object.freeze({ innerCornerPanelItemKey: 'panel_corner_192' }) }),

  'showcase-2:100': Object.freeze({ recipeId: 'showcase-2-100', moduleType: 'showcase-2', nominalWidthCm: 100, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_91', quantity: 4 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_98', quantity: 5 }), Object.freeze({ itemKey: 'connector_start', quantity: 4 }), Object.freeze({ itemKey: 'connector_single', quantity: 9 }), Object.freeze({ partId: 'showcase_2_100', quantity: 1 }), Object.freeze({ itemKey: 'glass_shelf', quantity: 2 }),
  ]), variants: Object.freeze({ innerCornerPanelItemKey: 'panel_corner_92' }) }),
  'showcase-3:100': Object.freeze({ recipeId: 'showcase-3-100', moduleType: 'showcase-3', nominalWidthCm: 100, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_91', quantity: 4 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_98', quantity: 4 }), Object.freeze({ itemKey: 'connector_start', quantity: 4 }), Object.freeze({ itemKey: 'connector_single', quantity: 7 }), Object.freeze({ partId: 'showcase_3_100', quantity: 1 }), Object.freeze({ itemKey: 'glass_shelf', quantity: 3 }),
  ]), variants: Object.freeze({ innerCornerPanelItemKey: 'panel_corner_92' }) }),

  'separator:50': Object.freeze({ recipeId: 'separator-50', moduleType: 'separator', nominalWidthCm: 50, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_41_5', quantity: 2 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'separator_panel_48_5', quantity: 1 }), Object.freeze({ itemKey: 'separator_panel_98', quantity: 3 }), Object.freeze({ itemKey: 'connector_start', quantity: 2 }), Object.freeze({ itemKey: 'connector_single', quantity: 7 }),
  ]) }),
  'separator:100': Object.freeze({ recipeId: 'separator-100', moduleType: 'separator', nominalWidthCm: 100, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_91', quantity: 2 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'separator_panel_98', quantity: 7 }), Object.freeze({ itemKey: 'connector_start', quantity: 2 }), Object.freeze({ itemKey: 'connector_single', quantity: 13 }),
  ]) }),

  'counter-l:100': Object.freeze({ recipeId: 'counter-l-100', moduleType: 'counter', shape: 'L', nominalWidthCm: 100, items: Object.freeze([
    Object.freeze({ itemKey: 'profile_91', quantity: 5 }), Object.freeze({ itemKey: 'profile_41_5', quantity: 5 }), Object.freeze({ itemKey: 'upright_99', quantity: 5 }), Object.freeze({ itemKey: 'panel_98', quantity: 4 }), Object.freeze({ itemKey: 'panel_48_5', quantity: 4 }), Object.freeze({ itemKey: 'connector_start', quantity: 8 }), Object.freeze({ itemKey: 'connector_single', quantity: 16 }), Object.freeze({ itemKey: 'counter_top_110_60', quantity: 1 }), Object.freeze({ itemKey: 'counter_top_52_60', quantity: 1 }),
  ]) }),
  'counter-l:150': Object.freeze({ recipeId: 'counter-l-150', moduleType: 'counter', shape: 'L', nominalWidthCm: 150, items: Object.freeze([
    Object.freeze({ itemKey: 'profile_140_5', quantity: 5 }), Object.freeze({ itemKey: 'profile_91', quantity: 1 }), Object.freeze({ itemKey: 'profile_41_5', quantity: 4 }), Object.freeze({ itemKey: 'upright_99', quantity: 5 }), Object.freeze({ itemKey: 'panel_147_5', quantity: 4 }), Object.freeze({ itemKey: 'panel_48_5', quantity: 4 }), Object.freeze({ itemKey: 'connector_start', quantity: 8 }), Object.freeze({ itemKey: 'connector_single', quantity: 16 }), Object.freeze({ itemKey: 'counter_top_160_60', quantity: 1 }), Object.freeze({ itemKey: 'counter_top_102_60', quantity: 1 }),
  ]) }),
  'counter-l:200': Object.freeze({ recipeId: 'counter-l-200', moduleType: 'counter', shape: 'L', nominalWidthCm: 200, items: Object.freeze([
    Object.freeze({ itemKey: 'profile_190', quantity: 5 }), Object.freeze({ itemKey: 'profile_140_5', quantity: 1 }), Object.freeze({ itemKey: 'profile_41_5', quantity: 4 }), Object.freeze({ itemKey: 'upright_99', quantity: 5 }), Object.freeze({ itemKey: 'panel_197', quantity: 4 }), Object.freeze({ itemKey: 'panel_48_5', quantity: 4 }), Object.freeze({ itemKey: 'connector_start', quantity: 8 }), Object.freeze({ itemKey: 'connector_single', quantity: 16 }), Object.freeze({ itemKey: 'counter_top_210_60', quantity: 1 }), Object.freeze({ itemKey: 'counter_top_150_60', quantity: 1 }),
  ]) }),

  'counter:100': Object.freeze({ recipeId: 'counter-100', moduleType: 'counter', nominalWidthCm: 100, items: Object.freeze([
    Object.freeze({ itemKey: 'profile_91', quantity: 3 }), Object.freeze({ itemKey: 'profile_41_5', quantity: 4 }), Object.freeze({ itemKey: 'upright_99', quantity: 4 }), Object.freeze({ itemKey: 'panel_98', quantity: 2 }), Object.freeze({ itemKey: 'panel_48_5', quantity: 4 }), Object.freeze({ itemKey: 'connector_start', quantity: 6 }), Object.freeze({ itemKey: 'connector_single', quantity: 12 }), Object.freeze({ itemKey: 'counter_top_110_60', quantity: 1 }),
  ]) }),
  'counter:150': Object.freeze({ recipeId: 'counter-150', moduleType: 'counter', nominalWidthCm: 150, items: Object.freeze([
    Object.freeze({ itemKey: 'profile_140_5', quantity: 3 }), Object.freeze({ itemKey: 'profile_41_5', quantity: 4 }), Object.freeze({ itemKey: 'upright_99', quantity: 4 }), Object.freeze({ itemKey: 'panel_147_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_48_5', quantity: 4 }), Object.freeze({ itemKey: 'connector_start', quantity: 6 }), Object.freeze({ itemKey: 'connector_single', quantity: 12 }), Object.freeze({ itemKey: 'counter_top_160_60', quantity: 1 }),
  ]) }),
  'counter:200': Object.freeze({ recipeId: 'counter-200', moduleType: 'counter', nominalWidthCm: 200, items: Object.freeze([
    Object.freeze({ itemKey: 'profile_190', quantity: 3 }), Object.freeze({ itemKey: 'profile_41_5', quantity: 4 }), Object.freeze({ itemKey: 'upright_99', quantity: 4 }), Object.freeze({ itemKey: 'panel_197', quantity: 2 }), Object.freeze({ itemKey: 'panel_48_5', quantity: 4 }), Object.freeze({ itemKey: 'connector_start', quantity: 6 }), Object.freeze({ itemKey: 'connector_single', quantity: 12 }), Object.freeze({ itemKey: 'counter_top_210_60', quantity: 1 }),
  ]) }),

  'base-wall:100': Object.freeze({ recipeId: 'base-wall-100', moduleType: 'base-wall', nominalWidthCm: 100, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_91', quantity: 4 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'profile_41_5', quantity: 4 }), Object.freeze({ itemKey: 'upright_49_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_98', quantity: 7 }), Object.freeze({ itemKey: 'panel_48_5', quantity: 2 }), Object.freeze({ itemKey: 'connector_start', quantity: 6 }), Object.freeze({ itemKey: 'connector_single', quantity: 17 }), Object.freeze({ itemKey: 'base_top_107_50', quantity: 1 }),
  ]), variants: Object.freeze({ innerCornerPanelItemKey: 'panel_corner_92' }) }),
  'base-wall:150': Object.freeze({ recipeId: 'base-wall-150', moduleType: 'base-wall', nominalWidthCm: 150, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_140_5', quantity: 4 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'profile_41_5', quantity: 4 }), Object.freeze({ itemKey: 'upright_49_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_147_5', quantity: 7 }), Object.freeze({ itemKey: 'panel_48_5', quantity: 2 }), Object.freeze({ itemKey: 'connector_start', quantity: 6 }), Object.freeze({ itemKey: 'connector_single', quantity: 17 }), Object.freeze({ itemKey: 'base_top_157_50', quantity: 1 }),
  ]), variants: Object.freeze({ innerCornerPanelItemKey: 'panel_corner_142_5' }) }),
  'base-wall:200': Object.freeze({ recipeId: 'base-wall-200', moduleType: 'base-wall', nominalWidthCm: 200, connectionMode: 'straight', items: Object.freeze([
    Object.freeze({ itemKey: 'profile_190', quantity: 4 }), Object.freeze({ itemKey: 'upright_346_5', quantity: 2 }), Object.freeze({ itemKey: 'profile_41_5', quantity: 4 }), Object.freeze({ itemKey: 'upright_49_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_197', quantity: 7 }), Object.freeze({ itemKey: 'panel_48_5', quantity: 2 }), Object.freeze({ itemKey: 'connector_start', quantity: 6 }), Object.freeze({ itemKey: 'connector_single', quantity: 17 }), Object.freeze({ itemKey: 'base_top_206_50', quantity: 1 }),
  ]), variants: Object.freeze({ innerCornerPanelItemKey: 'panel_corner_192' }) }),

  'base:100': Object.freeze({ recipeId: 'base-100', moduleType: 'base', nominalWidthCm: 100, items: Object.freeze([
    Object.freeze({ itemKey: 'profile_91', quantity: 4 }), Object.freeze({ itemKey: 'profile_41_5', quantity: 4 }), Object.freeze({ itemKey: 'upright_49_5', quantity: 4 }), Object.freeze({ itemKey: 'panel_98', quantity: 2 }), Object.freeze({ itemKey: 'panel_48_5', quantity: 2 }), Object.freeze({ itemKey: 'connector_start', quantity: 8 }), Object.freeze({ itemKey: 'connector_single', quantity: 8 }), Object.freeze({ itemKey: 'base_top_107_50', quantity: 1 }),
  ]) }),
  'base:150': Object.freeze({ recipeId: 'base-150', moduleType: 'base', nominalWidthCm: 150, items: Object.freeze([
    Object.freeze({ itemKey: 'profile_140_5', quantity: 4 }), Object.freeze({ itemKey: 'profile_41_5', quantity: 4 }), Object.freeze({ itemKey: 'upright_49_5', quantity: 4 }), Object.freeze({ itemKey: 'panel_147_5', quantity: 2 }), Object.freeze({ itemKey: 'panel_48_5', quantity: 2 }), Object.freeze({ itemKey: 'connector_start', quantity: 8 }), Object.freeze({ itemKey: 'connector_single', quantity: 8 }), Object.freeze({ itemKey: 'base_top_157_50', quantity: 1 }),
  ]) }),
  'base:200': Object.freeze({ recipeId: 'base-200', moduleType: 'base', nominalWidthCm: 200, items: Object.freeze([
    Object.freeze({ itemKey: 'profile_190', quantity: 4 }), Object.freeze({ itemKey: 'profile_41_5', quantity: 4 }), Object.freeze({ itemKey: 'upright_49_5', quantity: 4 }), Object.freeze({ itemKey: 'panel_197', quantity: 2 }), Object.freeze({ itemKey: 'panel_48_5', quantity: 2 }), Object.freeze({ itemKey: 'connector_start', quantity: 8 }), Object.freeze({ itemKey: 'connector_single', quantity: 8 }), Object.freeze({ itemKey: 'base_top_206_50', quantity: 1 }),
  ]) }),
});

export function getStraightWallRecipe(nominalWidthCm) { return STRAIGHT_WALL_RECIPES[nominalWidthCm] ?? null; }
export function listStraightWallRecipes() { return Object.values(STRAIGHT_WALL_RECIPES); }
export function getModuleRecipe(moduleType, nominalWidthCm, options = {}) {
  if (moduleType === 'wall' || moduleType === 'flat-panel') return getStraightWallRecipe(nominalWidthCm);
  if (moduleType === 'shelf') return MODULE_RECIPES[`shelf:${nominalWidthCm}:${Number(options.shelfCount)}`] ?? null;
  if (moduleType === 'counter' && options.shape === 'L') return MODULE_RECIPES[`counter-l:${nominalWidthCm}`] ?? null;
  return MODULE_RECIPES[`${moduleType}:${nominalWidthCm}`] ?? null;
}
export function getRecipeItemKey(item) { return item?.itemKey ?? item?.partId ?? null; }

export function getRecipeInnerCornerPanelKey(recipe) {
  return recipe?.variants?.innerCornerPanelItemKey ?? null;
}

function resolveRecipeItemsForPanelVariant(recipe, panelVariant = 'straight') {
  if (panelVariant !== 'inner-corner') return recipe.items;

  // Canonical inner-corner Item metadata activates the verified 1:1 panel replacement.
  const cornerPanelItemKey = recipe?.variants?.innerCornerPanelItemKey ?? null;
  if (!cornerPanelItemKey) return recipe.items;

  const cornerPanel = getProductionItem(cornerPanelItemKey);
  if (!cornerPanel || cornerPanel.type !== 'panel' || cornerPanel.panelRole !== 'inner-corner') {
    throw new TypeError(`Invalid inner-corner panel Item: ${cornerPanelItemKey}.`);
  }

  const straightPanelIndex = recipe.items.findIndex((item) => {
    const productionItem = getProductionItem(getRecipeItemKey(item));
    return productionItem?.type === 'panel'
      && productionItem.panelRole === 'straight'
      && productionItem.nominalModuleWidthCm === cornerPanel.nominalModuleWidthCm;
  });

  if (straightPanelIndex < 0) {
    throw new TypeError(`Recipe ${recipe.recipeId ?? 'unknown'} has no matching straight panel for ${cornerPanelItemKey}.`);
  }

  return recipe.items.map((item, index) => {
    if (index !== straightPanelIndex) return item;
    return Object.freeze({ itemKey: cornerPanelItemKey, quantity: item.quantity });
  });
}

export function expandRecipe(recipe, options = {}) {
  if (!recipe) return null;
  const items = resolveRecipeItemsForPanelVariant(recipe, options.panelVariant);
  return { ...recipe, items: items.map((item) => ({ ...item, part: getProductionItem(getRecipeItemKey(item)) })) };
}
export function getExpandedStraightWallRecipe(nominalWidthCm, options = {}) {
  return expandRecipe(getStraightWallRecipe(nominalWidthCm), options);
}
export function getExpandedModuleRecipe(moduleType, nominalWidthCm, options = {}) {
  return expandRecipe(getModuleRecipe(moduleType, nominalWidthCm, options), options);
}
