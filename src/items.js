import { getProductionItem } from './productionParts.js';

// Standalone commercial products own their verified product defaults.
export const COMMERCIAL_ITEMS = Object.freeze({
  COAT_RACK: Object.freeze({
    itemKey: 'COAT_RACK', name: 'Askılık', type: 'coat-rack',
    dimensions: Object.freeze({ widthCm: 43, depthCm: 43, heightCm: 180 }),
    modelFile: 'coat_rack.glb',
  }),
  KETTLE: Object.freeze({
    itemKey: 'KETTLE', name: 'Kettle', type: 'kettle',
    dimensions: Object.freeze({ widthCm: 24, depthCm: 19, heightCm: 25 }),
    modelFile: 'kettle.glb',
  }),
  MINI_FRIDGE_AVANTI: Object.freeze({
    itemKey: 'MINI_FRIDGE_AVANTI', name: 'Mini Buzdolabı', type: 'mini-fridge',
    dimensions: Object.freeze({ widthCm: 50, depthCm: 50, heightCm: 66 }),
    modelFile: '80s_avanti_mini_fridge.glb',
  }),
  PLASTIC_TRASH_BIN: Object.freeze({
    itemKey: 'PLASTIC_TRASH_BIN', name: 'Çöp Kutusu', type: 'plastic-trash-bin',
    dimensions: Object.freeze({ widthCm: 40, depthCm: 40, heightCm: 60 }),
    modelFile: 'plastic_trash_bin.glb', preserveModelScale: false,
    modelRotationYDeg: 0, visualRotationYDeg: -90,
  }),
});

export function getCommercialItemForType(type) {
  return Object.values(COMMERCIAL_ITEMS).find((item) => item.type === type) ?? null;
}

// Wall-mounted media products share the single `tv` behavior family. Ordinary TVs are
// parametric by verified screen size; widthCm is that same screen width so placement
// bounds match the rendered box. Video walls derive totals from panel size x grid.
export const WALL_MEDIA_ITEMS = Object.freeze({
  TV_42: Object.freeze({
    itemKey: 'TV_42', name: 'TV 42"', type: 'tv', sizeInch: 42,
    dimensions: Object.freeze({
      widthCm: 93.0, depthCm: 5, catalogHeightCm: 350, screenWidthCm: 93.0, screenHeightCm: 52.3,
    }),
  }),
  TV_55: Object.freeze({
    itemKey: 'TV_55', name: 'TV 55"', type: 'tv', sizeInch: 55,
    dimensions: Object.freeze({
      widthCm: 121.8, depthCm: 5, catalogHeightCm: 350, screenWidthCm: 121.8, screenHeightCm: 68.5,
    }),
  }),
  TV_65: Object.freeze({
    itemKey: 'TV_65', name: 'TV 65"', type: 'tv', sizeInch: 65,
    dimensions: Object.freeze({
      widthCm: 143.9, depthCm: 5, catalogHeightCm: 350, screenWidthCm: 143.9, screenHeightCm: 80.9,
    }),
  }),
  VIDEO_WALL_2X2: Object.freeze({
    itemKey: 'VIDEO_WALL_2X2', name: 'Video Wall 2×2', type: 'tv', sizeInch: 55,
    dimensions: Object.freeze({ depthCm: 5 }),
    videoWall: Object.freeze({ rows: 2, cols: 2, panelScreenWidthCm: 108.5, panelScreenHeightCm: 61 }),
  }),
  VIDEO_WALL_3X3: Object.freeze({
    itemKey: 'VIDEO_WALL_3X3', name: 'Video Wall 3×3', type: 'tv', sizeInch: 55,
    dimensions: Object.freeze({ depthCm: 5 }),
    videoWall: Object.freeze({ rows: 3, cols: 3, panelScreenWidthCm: 108.5, panelScreenHeightCm: 61 }),
  }),
});

// Canonical resolver for wall-media metrics consumed by catalog, state factory and
// selection feedback. Video-wall totals are derived from panel size x grid; ordinary
// TV totals are the verified screen dimensions.
export function resolveWallMediaMetrics(itemOrKey) {
  const item = typeof itemOrKey === 'string' ? WALL_MEDIA_ITEMS[itemOrKey] : itemOrKey;
  if (!item || item.type !== 'tv') return null;
  const depthCm = Number(item.dimensions?.depthCm);
  const base = {
    itemKey: item.itemKey, type: item.type, label: item.name, sizeInch: item.sizeInch, depthCm,
  };
  if (item.videoWall) {
    const { rows, cols, panelScreenWidthCm, panelScreenHeightCm } = item.videoWall;
    const screenWidthCm = panelScreenWidthCm * cols;
    const screenHeightCm = panelScreenHeightCm * rows;
    return Object.freeze({
      ...base,
      widthCm: screenWidthCm,
      catalogHeightCm: screenHeightCm,
      screenWidthCm,
      screenHeightCm,
      videoWallRows: rows,
      videoWallCols: cols,
      panelScreenWidthCm,
      panelScreenHeightCm,
    });
  }
  // Placement footprint must match the rendered screen — same rule as video walls.
  const { catalogHeightCm, screenWidthCm, screenHeightCm } = item.dimensions;
  return Object.freeze({
    ...base,
    widthCm: screenWidthCm,
    catalogHeightCm,
    screenWidthCm,
    screenHeightCm,
    videoWallRows: 1,
    videoWallCols: 1,
    panelScreenWidthCm: screenWidthCm,
    panelScreenHeightCm: screenHeightCm,
  });
}

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
  // Free-standing baza parents share type `base` and resolve BOM via moduleRecipes
  // `base:100|150|200`. Child Item quantities stay in the recipe; wall_base_* parents
  // are a separate type/recipe family that happens to reuse the same base_top_* keys.
  BASE_100: Object.freeze({
    itemKey: 'BASE_100',
    name: 'Baza 100',
    type: 'base',
    dimensions: Object.freeze({ widthCm: 100, depthCm: 50, heightCm: 50 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'base',
      nominalWidthCm: 100,
    }),
  }),
  BASE_150: Object.freeze({
    itemKey: 'BASE_150',
    name: 'Baza 150',
    type: 'base',
    dimensions: Object.freeze({ widthCm: 150, depthCm: 50, heightCm: 50 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'base',
      nominalWidthCm: 150,
    }),
  }),
  BASE_200: Object.freeze({
    itemKey: 'BASE_200',
    name: 'Baza 200',
    type: 'base',
    dimensions: Object.freeze({ widthCm: 200, depthCm: 50, heightCm: 50 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'base',
      nominalWidthCm: 200,
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
  return COMMERCIAL_ITEMS[itemKey]
    ?? WALL_MEDIA_ITEMS[itemKey]
    ?? COMPOSITE_ITEMS[itemKey]
    ?? getProductionItem(itemKey);
}

export function listCompositeItems() {
  return Object.values(COMPOSITE_ITEMS);
}
