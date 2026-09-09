import { getProductionItem } from './productionParts.js';

const ITEM_SURFACE_CAPABILITIES_BY_TYPE = Object.freeze({
  'door-leaf': Object.freeze({
    color: true,
    image: true,
    glass: false,
    lightbox: false,
    mesh: false,
  }),
});

const NO_SURFACE_CAPABILITIES = Object.freeze({
  color: false,
  image: false,
  glass: false,
  lightbox: false,
  mesh: false,
});

export function getItemSurfaceCapabilities(itemOrKey) {
  const item = typeof itemOrKey === 'string' ? getProductionItem(itemOrKey) : itemOrKey;
  return ITEM_SURFACE_CAPABILITIES_BY_TYPE[item?.type] ?? NO_SURFACE_CAPABILITIES;
}
