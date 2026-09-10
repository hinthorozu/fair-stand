import { getItem } from './items.js';
import { getProductionItem } from './productionParts.js';

const SHOWCASE_ITEM_KEYS_BY_TYPE = Object.freeze({
  'showcase-2': 'showcase_2_100',
  'showcase-3': 'showcase_3_100',
});

export function getShowcaseItemKeyForType(type) {
  return SHOWCASE_ITEM_KEYS_BY_TYPE[type] ?? null;
}

export function getShowcaseBodyDefinition(itemOrKey) {
  const item = typeof itemOrKey === 'string' ? getItem(itemOrKey) : itemOrKey;
  if (!item || !getShowcaseItemKeyForType(item.type)) return null;

  const sideItem = getProductionItem(item.bodyItems?.sideItemKey);
  const horizontalItem = getProductionItem(item.bodyItems?.horizontalItemKey);
  const glassShelfItem = getProductionItem(item.bodyItems?.glassShelfItemKey);
  if (!sideItem || !horizontalItem || !glassShelfItem) {
    throw new TypeError(`Missing canonical showcase body child Item for ${item.itemKey}.`);
  }
  if (sideItem.type !== 'showcase-board' || horizontalItem.type !== 'showcase-board') {
    throw new TypeError(`Invalid showcase board Item relationship for ${item.itemKey}.`);
  }
  if (glassShelfItem.type !== 'showcase-accessory') {
    throw new TypeError(`Invalid showcase glass shelf Item relationship for ${item.itemKey}.`);
  }

  const sideDimensions = sideItem.dimensions ?? {};
  const horizontalDimensions = horizontalItem.dimensions ?? {};
  const requiredSideDimensions = [sideDimensions.lengthCm, sideDimensions.depthCm, sideDimensions.thicknessCm];
  const requiredHorizontalDimensions = [horizontalDimensions.lengthCm, horizontalDimensions.depthCm, horizontalDimensions.thicknessCm];
  if (![...requiredSideDimensions, ...requiredHorizontalDimensions].every((value) => Number(value) > 0)) {
    throw new TypeError(`Missing canonical showcase board dimensions for ${item.itemKey}.`);
  }
  if (Number(sideDimensions.depthCm) !== Number(horizontalDimensions.depthCm)) {
    throw new TypeError(`Showcase board depth mismatch for ${item.itemKey}.`);
  }
  if (Number(sideDimensions.thicknessCm) !== Number(horizontalDimensions.thicknessCm)) {
    throw new TypeError(`Showcase board thickness mismatch for ${item.itemKey}.`);
  }
  if (sideItem.material !== horizontalItem.material) {
    throw new TypeError(`Showcase board material mismatch for ${item.itemKey}.`);
  }
  if (!Number.isInteger(sideItem.defaultColor) || sideItem.defaultColor !== horizontalItem.defaultColor) {
    throw new TypeError(`Showcase board defaultColor mismatch for ${item.itemKey}.`);
  }

  return Object.freeze({
    item,
    sideItem,
    horizontalItem,
    glassShelfItem,
    defaultColor: sideItem.defaultColor,
  });
}
