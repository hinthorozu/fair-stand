const PLACEABLE_ITEM_TYPES = new Set([
  'flat-panel',
  'base',
  'counter',
  'separator',
  'sofa-set-classic',
  'sofa-single-classic',
  'sofa-double-classic',
  'coffee-table-classic',
  'table-chair-set-eames',
  'chair',
  'table-glass',
  'bar-stool',
  'mini-fridge',
  'kettle',
  'coat-rack',
  'upright',
  'profile',
  'plastic-trash-bin',
  'indoor-plant-1',
  'tv',
  'shelf',
  'led-floodlight',
  'door',
  'showcase-2',
  'showcase-3',
  'illuminated-foam',
]);

const IMAGE_COLOR_TYPES = new Set([
  'door-leaf',
  'flat-panel',
  'base',
  'counter',
  'door',
  'showcase-2',
  'showcase-3',
]);

const PANEL_COVER_TYPES = new Set([
  'flat-panel',
  'showcase-2',
  'showcase-3',
  'door',
]);

const COLOR_ONLY_TYPES = new Set([
  'separator',
  'sofa-set-classic',
  'sofa-single-classic',
  'sofa-double-classic',
]);

const LEAF_COLOR_IMAGE_TYPES = new Set(['door-leaf']);

const ALL_FALSE = Object.freeze({
  isRender: false,
  acceptsColor: false,
  acceptsImage: false,
  acceptsLightbox: false,
  acceptsGlass: false,
  acceptsMesh: false,
});

export function surfaceFlagsForItem(itemKey, itemType) {
  void itemKey;
  if (LEAF_COLOR_IMAGE_TYPES.has(itemType)) {
    return {
      isRender: true,
      acceptsColor: true,
      acceptsImage: true,
      acceptsLightbox: false,
      acceptsGlass: false,
      acceptsMesh: false,
    };
  }
  if (!PLACEABLE_ITEM_TYPES.has(itemType)) return { ...ALL_FALSE };
  const cover = PANEL_COVER_TYPES.has(itemType);
  const imageColor = IMAGE_COLOR_TYPES.has(itemType);
  const colorOnly = COLOR_ONLY_TYPES.has(itemType);
  return {
    isRender: true,
    acceptsColor: imageColor || colorOnly,
    acceptsImage: imageColor,
    acceptsLightbox: cover,
    acceptsGlass: cover,
    acceptsMesh: cover,
  };
}

export function applyItemSurfaceFlags(item) {
  Object.assign(item, surfaceFlagsForItem(item.itemKey, item.type));
  return item;
}
