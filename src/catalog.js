import { getItem, resolveWallMediaMetrics } from './items.js';

export const STAND_DIMENSIONS = Object.freeze({
  height: 3.5,
  depth: 0.1,
  stripCount: 7,
  stripHeight: 0.5,
  frameWidth: 0.055,
  frameDepth: 0.1,
});

export const MODULE_WIDTHS_CM = Object.freeze([50, 100, 150, 200]);

export const COUNTER_DIMENSIONS = Object.freeze({
  depthCm: 50,
  heightCm: 100,
  widthsCm: Object.freeze([100, 150, 200]),
});

export const BASE_DIMENSIONS = Object.freeze({
  depthCm: getItem('BASE_100').dimensions.depthCm,
  heightCm: getItem('BASE_100').dimensions.heightCm,
  widthsCm: Object.freeze([
    getItem('BASE_100').dimensions.widthCm,
    getItem('BASE_150').dimensions.widthCm,
    getItem('BASE_200').dimensions.widthCm,
  ]),
});

function createBaseCatalogItem(itemKey) {
  const item = getItem(itemKey);
  return Object.freeze({
    itemKey: item.itemKey,
    type: item.type,
    ...item.dimensions,
    label: item.name,
  });
}

export const SHELF_DIMENSIONS = Object.freeze({
  widthsCm: Object.freeze([100, 150, 200]),
  heightsByCountCm: Object.freeze({
    2: Object.freeze([100, 150]),
    3: Object.freeze([100, 150, 200]),
  }),
});


export const furniture_sofa_set_classic_DIMENSIONS = Object.freeze({
  widthCm: 150,
  depthCm: 150,
  heightCm: 78,
  loveseatWidthCm: 150,
  chairWidthCm: 65,
  tableWidthCm: 60,
  tableDepthCm: 42,
  tableHeightCm: 38,
});

export const furniture_table_chair_set_eames_DIMENSIONS = Object.freeze({
  widthCm: 150,
  depthCm: 150,
  heightCm: 82,
  chairCount: 4,
  chairWidthCm: 46,
  chairDepthCm: 58,
  tableDiameterCm: 75,
  tableHeightCm: 74,
});


export const furniture_bar_stool_classic_DIMENSIONS = Object.freeze({
  widthCm: 60,
  depthCm: 55,
  heightCm: 121,
});

export const MINI_FRIDGE_DIMENSIONS = getItem('MINI_FRIDGE_AVANTI').dimensions;

export const COAT_RACK_DIMENSIONS = getItem('COAT_RACK').dimensions;

export const PLASTIC_TRASH_BIN_DIMENSIONS = getItem('PLASTIC_TRASH_BIN').dimensions;

const DOOR_ITEM = getItem('door_100');
const WALL_SHOWCASE_2_ITEM = getItem('wall_showcase_100_2');
const WALL_SHOWCASE_3_ITEM = getItem('wall_showcase_100_3');

// Wall-media catalog descriptors are projected from the canonical wall-media Item.
// TV cards keep their 350 cm mounting height; video-wall cards use the derived total
// screen height. No dimension is fabricated here; every value comes from the Item.
function createWallMediaCatalogItem(itemKey) {
  const metrics = resolveWallMediaMetrics(itemKey);
  const base = {
    itemKey: metrics.itemKey,
    type: metrics.type,
    widthCm: metrics.widthCm,
    depthCm: metrics.depthCm,
    heightCm: metrics.catalogHeightCm,
    screenWidthCm: metrics.screenWidthCm,
    screenHeightCm: metrics.screenHeightCm,
    sizeInch: metrics.sizeInch,
    label: metrics.label,
  };
  if (metrics.videoWallRows > 1 || metrics.videoWallCols > 1) {
    return Object.freeze({
      ...base,
      panelScreenWidthCm: metrics.panelScreenWidthCm,
      panelScreenHeightCm: metrics.panelScreenHeightCm,
      videoWallRows: metrics.videoWallRows,
      videoWallCols: metrics.videoWallCols,
    });
  }
  return Object.freeze(base);
}

const TV_42_METRICS = resolveWallMediaMetrics('TV_42');
export const TV_42_DIMENSIONS = Object.freeze({
  moduleWidthCm: TV_42_METRICS.widthCm,
  screenWidthCm: TV_42_METRICS.screenWidthCm,
  screenHeightCm: TV_42_METRICS.screenHeightCm,
  heightCm: TV_42_METRICS.catalogHeightCm,
});

export const LED_FLOODLIGHT_DIMENSIONS = Object.freeze({
  widthCm: 50,
  depthCm: 20,
  heightCm: 35,
  mountHeightCm: 350,
});

function createCommercialCatalogItem(itemKey) {
  const { name, dimensions, ...metadata } = getItem(itemKey);
  return Object.freeze({ ...metadata, ...dimensions, label: name });
}

export const MODULE_CATALOG = Object.freeze({
  wall_50: { type: 'flat-panel', widthCm: 50, label: 'Düz Panel 50' },
  wall_100: { type: 'flat-panel', widthCm: 100, label: 'Düz Panel 100' },
  wall_150: { type: 'flat-panel', widthCm: 150, label: 'Düz Panel 150' },
  wall_200: { type: 'flat-panel', widthCm: 200, label: 'Düz Panel 200' },

  wall_showcase_100_3: {
    itemKey: WALL_SHOWCASE_3_ITEM.itemKey,
    type: WALL_SHOWCASE_3_ITEM.type,
    widthCm: WALL_SHOWCASE_3_ITEM.dimensions.widthCm,
    eyeCount: WALL_SHOWCASE_3_ITEM.eyeCount,
    label: WALL_SHOWCASE_3_ITEM.name,
  },
  wall_showcase_100_2: {
    itemKey: WALL_SHOWCASE_2_ITEM.itemKey,
    type: WALL_SHOWCASE_2_ITEM.type,
    widthCm: WALL_SHOWCASE_2_ITEM.dimensions.widthCm,
    eyeCount: WALL_SHOWCASE_2_ITEM.eyeCount,
    label: WALL_SHOWCASE_2_ITEM.name,
  },
  wall_shelf_2_100: { type: 'shelf', widthCm: 100, shelfCount: 2, label: 'Raf 100 · 2 Raf' },
  wall_shelf_3_100: { type: 'shelf', widthCm: 100, shelfCount: 3, label: 'Raf 100 · 3 Raf' },
  wall_shelf_2_150: { type: 'shelf', widthCm: 150, shelfCount: 2, label: 'Raf 150 · 2 Raf' },
  wall_shelf_3_150: { type: 'shelf', widthCm: 150, shelfCount: 3, label: 'Raf 150 · 3 Raf' },
  wall_shelf_2_200: { type: 'shelf', widthCm: 200, shelfCount: 2, label: 'Raf 200 · 2 Raf' },
  wall_shelf_3_200: { type: 'shelf', widthCm: 200, shelfCount: 3, label: 'Raf 200 · 3 Raf' },
  furniture_sofa_set_classic: { type: 'sofa-set-classic', widthCm: 150, depthCm: 150, heightCm: 78, label: 'Koltuk Takımı' },
  furniture_table_chair_set_eames: { type: 'table-chair-set-eames', widthCm: 150, depthCm: 150, heightCm: 82, label: 'Eames Masa Sandalye Takımı' },
  furniture_bar_stool_classic: { type: 'bar-stool', widthCm: 60, depthCm: 55, heightCm: 121, label: 'Bar Taburesi' },
  MINI_FRIDGE_AVANTI: createCommercialCatalogItem('MINI_FRIDGE_AVANTI'),
  KETTLE: createCommercialCatalogItem('KETTLE'),
  COAT_RACK: createCommercialCatalogItem('COAT_RACK'),
  PLASTIC_TRASH_BIN: createCommercialCatalogItem('PLASTIC_TRASH_BIN'),
  EXTRA_INDOOR_PLANT_1: { type: 'indoor-plant-1', widthCm: 60, depthCm: 60, heightCm: 120, label: 'Yapay Çiçek 1' },
  EXTRA_LONG_PLANTER_100: {
    type: 'indoor-plant-1',
    widthCm: 100,
    depthCm: 30,
    heightCm: 30,
    modelFile: 'saksi_bitkili_100x30x30.glb',
    modelRotationYDeg: 90,
    preserveModelScale: true,
    label: 'Uzun Saksı 100',
  },
  EXTRA_LONG_PLANTER_150: {
    type: 'indoor-plant-1',
    widthCm: 150,
    depthCm: 30,
    heightCm: 30,
    modelFile: 'saksi_bitkili_150x30x30.glb',
    modelRotationYDeg: 90,
    preserveModelScale: true,
    label: 'Uzun Saksı 150',
  },
  EXTRA_LONG_PLANTER_200: {
    type: 'indoor-plant-1',
    widthCm: 200,
    depthCm: 30,
    heightCm: 30,
    modelFile: 'saksi_bitkili_200x30x30.glb',
    modelRotationYDeg: 90,
    preserveModelScale: true,
    label: 'Uzun Saksı 200',
  },
  TV_42: createWallMediaCatalogItem('TV_42'),
  TV_55: createWallMediaCatalogItem('TV_55'),
  VIDEO_WALL_2X2: createWallMediaCatalogItem('VIDEO_WALL_2X2'),
  VIDEO_WALL_3X3: createWallMediaCatalogItem('VIDEO_WALL_3X3'),
  TV_65: createWallMediaCatalogItem('TV_65'),
  LED_FLOODLIGHT: { type: 'led-floodlight', widthCm: 50, depthCm: 20, heightCm: 35, label: 'LED Projektör' },
  door_100: {
    itemKey: DOOR_ITEM.itemKey,
    type: DOOR_ITEM.type,
    widthCm: DOOR_ITEM.dimensions.widthCm,
    label: DOOR_ITEM.name,
  },

  desk_banko_100: { type: 'counter', widthCm: 100, depthCm: 50, heightCm: 100, label: 'Banko 100' },
  desk_banko_100_L: { type: 'counter', shape: 'L', widthCm: 100, depthCm: 100, heightCm: 100, label: 'Köşe Banko 100×100' },
  desk_banko_150: { type: 'counter', widthCm: 150, depthCm: 50, heightCm: 100, label: 'Banko 150' },
  desk_banko_150_L: { type: 'counter', shape: 'L', widthCm: 150, depthCm: 150, heightCm: 100, label: 'Köşe Banko 150×150' },
  desk_banko_200: { type: 'counter', widthCm: 200, depthCm: 50, heightCm: 100, label: 'Banko 200' },
  desk_banko_200_L: { type: 'counter', shape: 'L', widthCm: 200, depthCm: 200, heightCm: 100, label: 'Köşe Banko 200×200' },
  BASE_100: createBaseCatalogItem('BASE_100'),
  BASE_150: createBaseCatalogItem('BASE_150'),
  BASE_200: createBaseCatalogItem('BASE_200'),
  wall_base_100: { type: 'base-wall', widthCm: 100, depthCm: 50, heightCm: 350, label: 'Panel Bazalı 100' },
  wall_base_150: { type: 'base-wall', widthCm: 150, depthCm: 50, heightCm: 350, label: 'Panel Bazalı 150' },
  wall_base_200: { type: 'base-wall', widthCm: 200, depthCm: 50, heightCm: 350, label: 'Panel Bazalı 200' },
  wall_separator_100: { type: 'separator', widthCm: 100, label: 'Separatör 100' },
  wall_separator_50: { type: 'separator', widthCm: 50, label: 'Separatör 50' },
  wall_separator_100_sarmasik: { type: 'separator', widthCm: 100, modelFile: 'wall_separator_100_sarmasik.glb', label: 'Separatör 100 Sarmaşık' },
  wall_separator_50_sarmasik: { type: 'separator', widthCm: 50, modelFile: 'wall_separator_50_sarmasik.glb', label: 'Separatör 50 Sarmaşık' },
});

export const MODULE_CATALOG_KEYS = Object.freeze([
  'wall_200',
  'wall_150',
  'wall_100',
  'wall_50',

  'wall_separator_100',
  'wall_separator_50',
  'wall_separator_100_sarmasik',
  'wall_separator_50_sarmasik',

  'wall_showcase_100_3',
  'wall_showcase_100_2',

  'wall_shelf_3_200',
  'wall_shelf_3_150',
  'wall_shelf_3_100',

  'wall_shelf_2_200',
  'wall_shelf_2_150',
  'wall_shelf_2_100',

  'wall_base_200',
  'wall_base_150',
  'wall_base_100',

  'door_100',

  'desk_banko_200',
  'desk_banko_150',
  'desk_banko_100',

  'desk_banko_200_L',
  'desk_banko_150_L',
  'desk_banko_100_L',

  'BASE_200',
  'BASE_150',
  'BASE_100',
  'furniture_sofa_set_classic',
  'furniture_table_chair_set_eames',
  'furniture_bar_stool_classic',
  'MINI_FRIDGE_AVANTI',
  'KETTLE',
  'COAT_RACK',
  'PLASTIC_TRASH_BIN',
  'EXTRA_INDOOR_PLANT_1',
  'EXTRA_LONG_PLANTER_100',
  'EXTRA_LONG_PLANTER_150',
  'EXTRA_LONG_PLANTER_200',
  'TV_42',
  'TV_55',
  'VIDEO_WALL_2X2',
  'VIDEO_WALL_3X3',
  'TV_65',
  'LED_FLOODLIGHT',
]);

export const MODULE_CATALOG_GROUPS = Object.freeze([
  Object.freeze({
    label: 'Panel & Duvar',
    keys: Object.freeze(['wall_200', 'wall_150', 'wall_100', 'wall_50', 'wall_separator_100', 'wall_separator_50', 'wall_separator_100_sarmasik', 'wall_separator_50_sarmasik', 'wall_base_200', 'wall_base_150', 'wall_base_100', 'door_100']),
  }),
  Object.freeze({
    label: 'Raf & Vitrin',
    keys: Object.freeze(['wall_showcase_100_3', 'wall_showcase_100_2', 'wall_shelf_3_200', 'wall_shelf_3_150', 'wall_shelf_3_100', 'wall_shelf_2_200', 'wall_shelf_2_150', 'wall_shelf_2_100']),
  }),
  Object.freeze({
    label: 'Banko & Baza',
    keys: Object.freeze(['desk_banko_200', 'desk_banko_150', 'desk_banko_100', 'desk_banko_200_L', 'desk_banko_150_L', 'desk_banko_100_L', 'BASE_200', 'BASE_150', 'BASE_100']),
  }),
  Object.freeze({
    label: 'Extra',
    keys: Object.freeze(['furniture_sofa_set_classic', 'furniture_table_chair_set_eames', 'furniture_bar_stool_classic', 'MINI_FRIDGE_AVANTI', 'KETTLE', 'COAT_RACK', 'PLASTIC_TRASH_BIN', 'EXTRA_INDOOR_PLANT_1', 'EXTRA_LONG_PLANTER_100', 'EXTRA_LONG_PLANTER_150', 'EXTRA_LONG_PLANTER_200']),
  }),
  Object.freeze({
    label: 'Elektronik & Aydınlatma',
    keys: Object.freeze(['TV_42', 'TV_55', 'VIDEO_WALL_2X2', 'VIDEO_WALL_3X3', 'TV_65', 'LED_FLOODLIGHT']),
  }),
]);

function optionalNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeCatalogDescriptor(descriptor) {
  const nested = descriptor?.moduleState && typeof descriptor.moduleState === 'object'
    ? descriptor.moduleState
    : null;
  const source = nested ?? descriptor ?? {};
  return {
    catalogKey: source.catalogKey ?? descriptor?.catalogKey ?? null,
    type: source.type ?? source.moduleType ?? descriptor?.type ?? descriptor?.moduleType ?? null,
    widthCm: optionalNumber(source.widthCm ?? descriptor?.widthCm),
    depthCm: optionalNumber(source.depthCm ?? descriptor?.depthCm),
    shape: source.shape ?? source.counterShape ?? descriptor?.shape ?? descriptor?.counterShape ?? null,
    shelfCount: optionalNumber(source.shelfCount ?? descriptor?.shelfCount),
    modelFile: source.modelFile ?? descriptor?.modelFile ?? null,
    sizeInch: optionalNumber(source.sizeInch ?? descriptor?.sizeInch),
    screenWidthCm: optionalNumber(source.screenWidthCm ?? descriptor?.screenWidthCm),
  };
}

export function resolveModuleCatalogKey(descriptor) {
  const normalized = normalizeCatalogDescriptor(descriptor);
  if (normalized.catalogKey && MODULE_CATALOG[normalized.catalogKey]) return normalized.catalogKey;
  if (!normalized.type) return null;

  const candidates = MODULE_CATALOG_KEYS.filter(
    (moduleKey) => MODULE_CATALOG[moduleKey]?.type === normalized.type,
  );
  if (!candidates.length) return null;

  const matches = candidates.filter((moduleKey) => {
    const item = MODULE_CATALOG[moduleKey];
    if (normalized.widthCm !== null && optionalNumber(item.widthCm) !== null && optionalNumber(item.widthCm) !== normalized.widthCm) return false;
    if (normalized.depthCm !== null && optionalNumber(item.depthCm) !== null && optionalNumber(item.depthCm) !== normalized.depthCm) return false;
    if ((normalized.shape !== null || item.shape != null) && (item.shape ?? null) !== normalized.shape) return false;
    if ((normalized.shelfCount !== null || item.shelfCount != null) && optionalNumber(item.shelfCount) !== normalized.shelfCount) return false;
    if ((normalized.modelFile !== null || item.modelFile != null) && (item.modelFile ?? null) !== normalized.modelFile) return false;
    if (normalized.sizeInch !== null && optionalNumber(item.sizeInch) !== null && optionalNumber(item.sizeInch) !== normalized.sizeInch) return false;
    if (normalized.type === 'tv' && normalized.sizeInch === null && normalized.screenWidthCm !== null && optionalNumber(item.screenWidthCm) !== normalized.screenWidthCm) return false;
    return true;
  });

  if (matches.length === 1) return matches[0];
  if (candidates.length === 1) return candidates[0];
  return null;
}

export function getModuleCatalogItem(descriptor) {
  const moduleKey = resolveModuleCatalogKey(descriptor);
  return moduleKey ? MODULE_CATALOG[moduleKey] ?? null : null;
}

export function getModuleCatalogLabel(descriptor) {
  return getModuleCatalogItem(descriptor)?.label
    ?? (typeof descriptor?.label === 'string' ? descriptor.label : null)
    ?? 'Modül';
}

export function flatPanelKey(widthCm) {
  return `wall_${widthCm}`;
}
