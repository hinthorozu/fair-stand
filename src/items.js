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
  showcase_2_100: Object.freeze({
    itemKey: 'showcase_2_100',
    name: '2 Gözlü Vitrin 100 cm',
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
  showcase_3_100: Object.freeze({
    itemKey: 'showcase_3_100',
    name: '3 Gözlü Vitrin 100 cm',
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

export function getItem(itemKey) {
  return COMPOSITE_ITEMS[itemKey] ?? getProductionItem(itemKey);
}

export function listCompositeItems() {
  return Object.values(COMPOSITE_ITEMS);
}
