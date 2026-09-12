import { getItem } from './items.js';
import { getExpandedModuleRecipe, getRecipeItemKey } from './moduleRecipes.js';

function positiveQuantity(value, itemKey) {
  const quantity = Number(value);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new TypeError(`Invalid BOM quantity for ${itemKey}: ${value}.`);
  }
  return quantity;
}

function resolveRecipe(item, recipeOptions = {}) {
  const composition = item?.composition;
  if (!composition) return null;
  if (composition.mode !== 'recipe') return null;

  const options = {
    ...(composition.options ?? {}),
    ...(recipeOptions ?? {}),
  };
  const recipe = getExpandedModuleRecipe(
    composition.moduleType,
    composition.nominalWidthCm,
    options,
  );
  if (!recipe) {
    throw new TypeError(`Missing canonical recipe for ${item.itemKey}.`);
  }
  return recipe;
}

function resolveLines(itemKey, quantity, stack, recipeOptions = {}) {
  const item = getItem(itemKey);
  if (!item) throw new TypeError(`Unknown Item: ${itemKey}.`);

  const resolvedQuantity = positiveQuantity(quantity, itemKey);
  const recipe = resolveRecipe(item, recipeOptions);
  if (!recipe) {
    if (!item.unit) throw new TypeError(`Missing canonical unit for leaf Item: ${itemKey}.`);
    return [{ itemKey, quantity: resolvedQuantity, unit: item.unit, item }];
  }

  if (stack.includes(itemKey)) {
    throw new TypeError(`Cyclic Item composition: ${[...stack, itemKey].join(' -> ')}.`);
  }

  const nextStack = [...stack, itemKey];
  return recipe.items.flatMap((entry) => {
    const childItemKey = getRecipeItemKey(entry);
    if (!childItemKey) {
      throw new TypeError(`Recipe ${recipe.recipeId ?? itemKey} contains an Item without identity.`);
    }
    return resolveLines(
      childItemKey,
      resolvedQuantity * positiveQuantity(entry.quantity, childItemKey),
      nextStack,
    );
  });
}

export function resolveItemBom(itemKey, quantity = 1, recipeOptions = {}) {
  const lines = resolveLines(itemKey, quantity, [], recipeOptions);
  const aggregated = new Map();

  for (const line of lines) {
    const key = `${line.itemKey}\u0000${line.unit}`;
    const current = aggregated.get(key);
    if (current) {
      current.quantity += line.quantity;
    } else {
      aggregated.set(key, { ...line });
    }
  }

  return Array.from(aggregated.values(), (line) => Object.freeze(line));
}
