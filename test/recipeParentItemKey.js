import { expandRecipe, getRecipeItemKey } from '../src/moduleRecipes.js';
import {
  catalogDoorItemKey,
  catalogPlainSeparatorItemKey,
  catalogWallFlatPanelItemKey,
  getItem,
  getShowcaseItemKeyForType,
} from '../src/items.js';

export function recipeParentItemKey(moduleType, widthCm, options = {}) {
  if (moduleType === 'wall' || moduleType === 'flat-panel') {
    return catalogWallFlatPanelItemKey(widthCm);
  }
  if (moduleType === 'door') return catalogDoorItemKey(100);
  if (moduleType === 'showcase-2') return getShowcaseItemKeyForType('showcase-2');
  if (moduleType === 'showcase-3') return getShowcaseItemKeyForType('showcase-3');
  if (moduleType === 'separator') return catalogPlainSeparatorItemKey(widthCm);
  if (moduleType === 'counter' && options.shape === 'L') return `desk_banko_${widthCm}_l`;
  if (moduleType === 'counter') return `desk_banko_${widthCm}`;
  if (moduleType === 'base') return `base_${widthCm}`;
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
  return expandRecipe(recipeParentItem(moduleType, widthCm, options));
}

export function getStraightWallRecipe(widthCm) {
  return getModuleRecipe('wall', widthCm);
}

export function listStraightWallRecipes() {
  return [50, 100, 150, 200].map((widthCm) => getStraightWallRecipe(widthCm));
}

export function getExpandedStraightWallRecipe(widthCm) {
  return expandRecipe(getItem(catalogWallFlatPanelItemKey(widthCm)));
}

export { expandRecipe, getRecipeItemKey };
