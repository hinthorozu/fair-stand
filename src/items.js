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
});

export function getItem(itemKey) {
  return COMPOSITE_ITEMS[itemKey] ?? getProductionItem(itemKey);
}

export function listCompositeItems() {
  return Object.values(COMPOSITE_ITEMS);
}
