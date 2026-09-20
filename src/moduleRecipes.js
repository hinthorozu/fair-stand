import { getItem } from './items.js';

export function getRecipeItemKey(item) {
  return item?.itemKey ?? null;
}

export function expandRecipe(item, _ignoredOptions = {}) {
  if (!item) return null;
  if (!Array.isArray(item.composition?.items)) return null;
  const items = item.composition.items;
  return {
    recipeId: item.itemKey,
    items: items.map((entry) => ({ ...entry, part: getItem(getRecipeItemKey(entry)) })),
  };
}
