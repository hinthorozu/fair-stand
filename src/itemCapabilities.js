import { getItem } from './items.js';

const COLOR_AND_IMAGE_SURFACE = Object.freeze({
  color: true,
  image: true,
  glass: false,
  lightbox: false,
  mesh: false,
});

// Compatibility mapping (MA-007 / DECISION C): production mesh `acceptsImage`
// true olan Item type’ları. Renderer kuralı kopyalanmaz; scene3d yalnız okur.
const ITEM_SURFACE_CAPABILITIES_BY_TYPE = Object.freeze({
  'door-leaf': COLOR_AND_IMAGE_SURFACE,
  'flat-panel': COLOR_AND_IMAGE_SURFACE,
  base: COLOR_AND_IMAGE_SURFACE,
  counter: COLOR_AND_IMAGE_SURFACE,
  door: COLOR_AND_IMAGE_SURFACE,
  'showcase-2': COLOR_AND_IMAGE_SURFACE,
  'showcase-3': COLOR_AND_IMAGE_SURFACE,
});

const NO_SURFACE_CAPABILITIES = Object.freeze({
  color: false,
  image: false,
  glass: false,
  lightbox: false,
  mesh: false,
});

export function getItemSurfaceCapabilities(itemOrKey) {
  const item = typeof itemOrKey === 'string' ? getItem(itemOrKey) : itemOrKey;
  return ITEM_SURFACE_CAPABILITIES_BY_TYPE[item?.type] ?? NO_SURFACE_CAPABILITIES;
}

export function itemSurfaceAcceptsImage(itemOrKey) {
  return getItemSurfaceCapabilities(itemOrKey).image === true;
}
