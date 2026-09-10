import { getProductionItem } from './productionParts.js';

export const COMPOSITE_ITEMS = Object.freeze({
  door_100: Object.freeze({
    itemKey: 'door_100',
    name: 'Depo Kapısı 100',
    type: 'door',
    unit: 'adet',
    dimensions: Object.freeze({ widthCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'door',
      nominalWidthCm: 100,
    }),
  }),
  wall_showcase_100_2: Object.freeze({
    itemKey: 'wall_showcase_100_2',
    name: '2 Gözlü Vitrin 100',
    type: 'showcase-2',
    unit: 'adet',
    dimensions: Object.freeze({ widthCm: 100 }),
    eyeCount: 2,
    bodyItems: Object.freeze({
      sideItemKey: 'showcase_side_94_6_30',
      horizontalItemKey: 'showcase_horizontal_87_4_30',
      glassShelfItemKey: 'glass_shelf',
    }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'showcase-2',
      nominalWidthCm: 100,
    }),
  }),
  wall_showcase_100_3: Object.freeze({
    itemKey: 'wall_showcase_100_3',
    name: '3 Gözlü Vitrin 100',
    type: 'showcase-3',
    unit: 'adet',
    dimensions: Object.freeze({ widthCm: 100 }),
    eyeCount: 3,
    bodyItems: Object.freeze({
      sideItemKey: 'showcase_side_143_5_30',
      horizontalItemKey: 'showcase_horizontal_87_4_30',
      glassShelfItemKey: 'glass_shelf',
    }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'showcase-3',
      nominalWidthCm: 100,
    }),
  }),
});

const SHOWCASE_ITEM_KEYS_BY_TYPE = Object.freeze({
  'showcase-2': 'wall_showcase_100_2',
  'showcase-3': 'wall_showcase_100_3',
});

export function getShowcaseItemKeyForType(type) {
  return SHOWCASE_ITEM_KEYS_BY_TYPE[type] ?? null;
}

export function getShowcaseBodyDefinition(itemOrKey) {
  const item = typeof itemOrKey === 'string' ? getItem(itemOrKey) : itemOrKey;
  const expectedItemKey = getShowcaseItemKeyForType(item?.type);
  if (!item || !expectedItemKey || item.itemKey !== expectedItemKey) return null;

  const sideItem = getProductionItem(item.bodyItems?.sideItemKey);
  const horizontalItem = getProductionItem(item.bodyItems?.horizontalItemKey);
  const glassShelfItem = getProductionItem(item.bodyItems?.glassShelfItemKey);
  if (!sideItem?.dimensions || !horizontalItem?.dimensions || !glassShelfItem?.dimensions) {
    throw new TypeError(`Canonical showcase body Items are incomplete for ${item.itemKey}.`);
  }
  if (sideItem.material !== 'sunta' || horizontalItem.material !== 'sunta') {
    throw new TypeError(`Canonical showcase body boards must be sunta for ${item.itemKey}.`);
  }
  if (Number(sideItem.dimensions.depthCm) !== Number(horizontalItem.dimensions.depthCm)
      || Number(sideItem.dimensions.thicknessCm) !== Number(horizontalItem.dimensions.thicknessCm)) {
    throw new TypeError(`Canonical showcase body board depth/thickness mismatch for ${item.itemKey}.`);
  }
  if (!Number.isInteger(sideItem.defaultColor)
      || sideItem.defaultColor !== horizontalItem.defaultColor) {
    throw new TypeError(`Canonical showcase body default color mismatch for ${item.itemKey}.`);
  }
  return Object.freeze({
    item, sideItem, horizontalItem, glassShelfItem, defaultColor: sideItem.defaultColor,
  });
}

export function getItem(itemKey) {
  return COMPOSITE_ITEMS[itemKey] ?? getProductionItem(itemKey);
}

export function listCompositeItems() {
  return Object.values(COMPOSITE_ITEMS);
}
