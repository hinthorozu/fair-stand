import { expandRecipe, getRecipeItemKey } from '../src/moduleRecipes.js';
import { getItem } from '../src/items.js';

export function recipeParentItemKey(moduleType, widthCm, options = {}) {
  if (moduleType === 'wall' || moduleType === 'flat-panel') return `wall_${widthCm}`;
  if (moduleType === 'door') return 'door_100';
  if (moduleType === 'showcase-2') return 'wall_showcase_100_2';
  if (moduleType === 'showcase-3') return 'wall_showcase_100_3';
  if (moduleType === 'separator') return `wall_separator_${widthCm}`;
  if (moduleType === 'counter' && options.shape === 'L') return `desk_banko_${widthCm}_L`;
  if (moduleType === 'counter') return `desk_banko_${widthCm}`;
  if (moduleType === 'base') return `BASE_${widthCm}`;
  if (moduleType === 'wall-short-up-1') return `wall_${widthCm}_short_up_1`;
  if (moduleType === 'wall-short-up-2') return `wall_${widthCm}_short_up_2`;
  return null;
}

export function recipeParentItem(moduleType, widthCm, options = {}) {
  const itemKey = recipeParentItemKey(moduleType, widthCm, options);
  return itemKey ? getItem(itemKey) : null;
}

function recipeView(item) {
  if (!item?.composition?.items) return null;
  return {
    recipeId: item.itemKey,
    items: item.composition.items,
    composition: item.composition,
  };
}

export function getModuleRecipe(moduleType, widthCm, options = {}) {
  return recipeView(recipeParentItem(moduleType, widthCm, options));
}

export function getExpandedModuleRecipe(moduleType, widthCm, options = {}) {
  return expandRecipe(recipeParentItem(moduleType, widthCm, options), options);
}

export function getStraightWallRecipe(widthCm) {
  return getModuleRecipe('wall', widthCm);
}

export function listStraightWallRecipes() {
  return [50, 100, 150, 200].map((widthCm) => getStraightWallRecipe(widthCm));
}

export function getExpandedStraightWallRecipe(widthCm, options = {}) {
  return expandRecipe(getItem(`wall_${widthCm}`), options);
}

export { expandRecipe, getRecipeItemKey };
