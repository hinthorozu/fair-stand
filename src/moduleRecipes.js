import { getItem } from './items.js';

export function getRecipeItemKey(item) {
  return item?.itemKey ?? null;
}

export function getRecipeInnerCornerPanelKey(item) {
  return item?.composition?.innerCorner?.panelItemKey ?? null;
}

function applyVariantItemReplacements(items, replacements = [], recipeId = 'unknown') {
  let resolvedItems = items;

  for (const replacement of replacements) {
    const sourceItemKey = replacement?.itemKey ?? null;
    const replacementItems = replacement?.items;
    if (!sourceItemKey || !Array.isArray(replacementItems) || !replacementItems.length) {
      throw new TypeError(`Invalid recipe variant replacement in ${recipeId}.`);
    }

    let replaced = false;
    resolvedItems = resolvedItems.flatMap((item) => {
      if (getRecipeItemKey(item) !== sourceItemKey) return [item];
      if (replaced) {
        throw new TypeError(`Recipe ${recipeId} contains duplicate variant source Item ${sourceItemKey}.`);
      }
      replaced = true;
      return replacementItems.map((replacementItem) => Object.freeze({ ...replacementItem }));
    });

    if (!replaced) {
      throw new TypeError(`Recipe ${recipeId} has no variant source Item ${sourceItemKey}.`);
    }
  }

  return resolvedItems;
}

function resolveRecipeItemsForPanelVariant(item, panelVariant = 'straight') {
  const items = item.composition.items;
  if (panelVariant !== 'inner-corner') return items;

  const cornerPanelItemKey = item.composition.innerCorner?.panelItemKey ?? null;
  if (!cornerPanelItemKey) return items;

  const cornerPanel = getItem(cornerPanelItemKey);
  if (!cornerPanel || cornerPanel.type !== 'panel' || cornerPanel.panelRole !== 'inner-corner') {
    throw new TypeError(`Invalid inner-corner panel Item: ${cornerPanelItemKey}.`);
  }

  const straightPanelIndex = items.findIndex((entry) => {
    const productionItem = getItem(getRecipeItemKey(entry));
    return productionItem?.type === 'panel'
      && productionItem.panelRole === 'straight'
      && productionItem.nominalModuleWidthCm === cornerPanel.nominalModuleWidthCm;
  });

  if (straightPanelIndex < 0) {
    throw new TypeError(`Recipe ${item.itemKey ?? 'unknown'} has no matching straight panel for ${cornerPanelItemKey}.`);
  }

  const panelAdjustedItems = items.map((entry, index) => {
    if (index !== straightPanelIndex) return entry;
    return Object.freeze({ itemKey: cornerPanelItemKey, quantity: entry.quantity });
  });

  return applyVariantItemReplacements(
    panelAdjustedItems,
    item.composition.innerCorner?.itemReplacements ?? [],
    item.itemKey ?? 'unknown',
  );
}

export function expandRecipe(item, options = {}) {
  if (!item) return null;
  if (!Array.isArray(item.composition?.items)) return null;
  const items = resolveRecipeItemsForPanelVariant(item, options.panelVariant);
  return {
    recipeId: item.itemKey,
    items: items.map((entry) => ({ ...entry, part: getItem(getRecipeItemKey(entry)) })),
  };
}
