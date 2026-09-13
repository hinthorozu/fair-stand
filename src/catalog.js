import { getFurnitureClusterQuantity, getItem, resolveWallMediaMetrics } from './items.js';

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
  depthCm: getItem('desk_banko_100').dimensions.depthCm,
  heightCm: getItem('desk_banko_100').dimensions.heightCm,
  widthsCm: Object.freeze([
    getItem('desk_banko_100').dimensions.widthCm,
    getItem('desk_banko_150').dimensions.widthCm,
    getItem('desk_banko_200').dimensions.widthCm,
  ]),
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

function createCounterCatalogItem(itemKey) {
  const item = getItem(itemKey);
  const descriptor = {
    itemKey: item.itemKey,
    type: item.type,
    ...item.dimensions,
    label: item.name,
  };
  if (item.shape === 'L') descriptor.shape = 'L';
  return Object.freeze(descriptor);
}

function createFlatPanelCatalogItem(itemKey) {
  const item = getItem(itemKey);
  const descriptor = {
    itemKey: item.itemKey,
    type: item.type,
    widthCm: item.dimensions.widthCm,
    label: item.name,
  };
  if (item.variant) descriptor.variant = item.variant;
  if (item.stripOccupancy) descriptor.stripOccupancy = item.stripOccupancy;
  return Object.freeze(descriptor);
}

function createUprightCatalogItem(itemKey) {
  const item = getItem(itemKey);
  const thicknessCm = Number(item.dimensions.thicknessCm);
  const lengthCm = Number(item.dimensions.lengthCm);
  return Object.freeze({
    itemKey: item.itemKey,
    type: item.type,
    widthCm: thicknessCm,
    depthCm: thicknessCm,
    heightCm: lengthCm,
    label: item.name,
  });
}

function createBaseWallCatalogItem(itemKey) {
  const item = getItem(itemKey);
  return Object.freeze({
    itemKey: item.itemKey,
    type: item.type,
    widthCm: item.dimensions.widthCm,
    depthCm: item.dimensions.depthCm,
    heightCm: item.dimensions.heightCm,
    label: item.name,
  });
}

function createSeparatorCatalogItem(itemKey) {
  const item = getItem(itemKey);
  const descriptor = {
    itemKey: item.itemKey,
    type: item.type,
    widthCm: item.dimensions.widthCm,
    label: item.name,
  };
  if (item.modelFile) descriptor.modelFile = item.modelFile;
  return Object.freeze(descriptor);
}

function createShelfCatalogItem(itemKey) {
  const item = getItem(itemKey);
  return Object.freeze({
    itemKey: item.itemKey,
    type: item.type,
    widthCm: item.dimensions.widthCm,
    shelfCount: item.shelfCount,
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


export const furniture_sofa_set_classic_DIMENSIONS = getItem('furniture_sofa_set_classic').dimensions;

export const furniture_sofa_single_classic_DIMENSIONS = getItem('furniture_sofa_single_classic').dimensions;

export const furniture_sofa_double_classic_DIMENSIONS = getItem('furniture_sofa_double_classic').dimensions;

export const furniture_coffee_table_classic_DIMENSIONS = getItem('furniture_coffee_table_classic').dimensions;

export const furniture_table_chair_set_eames_DIMENSIONS = Object.freeze({
  ...getItem('furniture_table_chair_set_eames').dimensions,
  chairCount: getFurnitureClusterQuantity(getItem('furniture_table_chair_set_eames'), 'chair_eames'),
});

export const chair_eames_DIMENSIONS = getItem('chair_eames').dimensions;

export const glass_table_DIMENSIONS = getItem('glass_table').dimensions;

export const furniture_bar_stool_classic_DIMENSIONS = getItem('furniture_bar_stool_classic').dimensions;
export const MINI_FRIDGE_DIMENSIONS = getItem('MINI_FRIDGE_AVANTI').dimensions;

export const COAT_RACK_DIMENSIONS = getItem('COAT_RACK').dimensions;

export const PLASTIC_TRASH_BIN_DIMENSIONS = getItem('PLASTIC_TRASH_BIN').dimensions;

const DOOR_ITEM = getItem('door_100');
const WALL_SHOWCASE_2_ITEM = getItem('wall_showcase_100_2');
const WALL_SHOWCASE_3_ITEM = getItem('wall_showcase_100_3');

// Duvar-medya katalog tanımları kanonik duvar-medya Item'ından yansıtılır.
// TV kartları 350 cm asma yüksekliğini korur; video-wall kartları türetilmiş toplam
// ekran yüksekliğini kullanır. Burada ölçü uydurulmaz; her değer Item'dan gelir.
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

const LED_FLOODLIGHT_ITEM = getItem('led_floodlight');

export const LED_FLOODLIGHT_DIMENSIONS = Object.freeze({
  widthCm: LED_FLOODLIGHT_ITEM.dimensions.widthCm,
  depthCm: LED_FLOODLIGHT_ITEM.dimensions.depthCm,
  heightCm: LED_FLOODLIGHT_ITEM.dimensions.heightCm,
  mountHeightCm: LED_FLOODLIGHT_ITEM.dimensions.mountHeightCm,
});

function createTopLightCatalogItem(itemKey) {
  const item = getItem(itemKey);
  return Object.freeze({
    itemKey: item.itemKey,
    type: item.type,
    widthCm: item.dimensions.widthCm,
    depthCm: item.dimensions.depthCm,
    heightCm: item.dimensions.heightCm,
    label: item.name,
  });
}

function createCommercialCatalogItem(itemKey) {
  const { name, dimensions, ...metadata } = getItem(itemKey);
  return Object.freeze({ ...metadata, ...dimensions, label: name });
}

function createIndoorPlantCatalogItem(itemKey) {
  const item = getItem(itemKey);
  const descriptor = {
    itemKey: item.itemKey,
    type: item.type,
    widthCm: item.dimensions.widthCm,
    depthCm: item.dimensions.depthCm,
    heightCm: item.dimensions.heightCm,
    label: item.name,
    modelRotationYDeg: item.modelRotationYDeg,
    preserveModelScale: item.preserveModelScale,
  };
  if (item.modelFile) descriptor.modelFile = item.modelFile;
  return Object.freeze(descriptor);
}

function createFurnitureCatalogItem(itemKey) {
  const item = getItem(itemKey);
  return Object.freeze({
    itemKey: item.itemKey,
    type: item.type,
    widthCm: item.dimensions.widthCm,
    depthCm: item.dimensions.depthCm,
    heightCm: item.dimensions.heightCm,
    label: item.name,
  });
}

export const MODULE_CATALOG = Object.freeze({
  wall_50: createFlatPanelCatalogItem('wall_50'),
  wall_100: createFlatPanelCatalogItem('wall_100'),
  wall_150: createFlatPanelCatalogItem('wall_150'),
  wall_200: createFlatPanelCatalogItem('wall_200'),
  wall_200_short_up_2: createFlatPanelCatalogItem('wall_200_short_up_2'),
  wall_150_short_up_2: createFlatPanelCatalogItem('wall_150_short_up_2'),
  wall_100_short_up_2: createFlatPanelCatalogItem('wall_100_short_up_2'),
  wall_50_short_up_2: createFlatPanelCatalogItem('wall_50_short_up_2'),
  wall_200_short_up_1: createFlatPanelCatalogItem('wall_200_short_up_1'),
  wall_150_short_up_1: createFlatPanelCatalogItem('wall_150_short_up_1'),
  wall_100_short_up_1: createFlatPanelCatalogItem('wall_100_short_up_1'),
  wall_50_short_up_1: createFlatPanelCatalogItem('wall_50_short_up_1'),
  upright_346_5: createUprightCatalogItem('upright_346_5'),

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
  wall_shelf_2_100: createShelfCatalogItem('wall_shelf_2_100'),
  wall_shelf_3_100: createShelfCatalogItem('wall_shelf_3_100'),
  wall_shelf_2_150: createShelfCatalogItem('wall_shelf_2_150'),
  wall_shelf_3_150: createShelfCatalogItem('wall_shelf_3_150'),
  wall_shelf_2_200: createShelfCatalogItem('wall_shelf_2_200'),
  wall_shelf_3_200: createShelfCatalogItem('wall_shelf_3_200'),
  furniture_sofa_set_classic: createFurnitureCatalogItem('furniture_sofa_set_classic'),
  furniture_sofa_single_classic: createFurnitureCatalogItem('furniture_sofa_single_classic'),
  furniture_sofa_double_classic: createFurnitureCatalogItem('furniture_sofa_double_classic'),
  furniture_coffee_table_classic: createFurnitureCatalogItem('furniture_coffee_table_classic'),
  furniture_table_chair_set_eames: createFurnitureCatalogItem('furniture_table_chair_set_eames'),
  chair_eames: createFurnitureCatalogItem('chair_eames'),
  glass_table: createFurnitureCatalogItem('glass_table'),
  furniture_bar_stool_classic: createFurnitureCatalogItem('furniture_bar_stool_classic'),
  MINI_FRIDGE_AVANTI: createCommercialCatalogItem('MINI_FRIDGE_AVANTI'),
  KETTLE: createCommercialCatalogItem('KETTLE'),
  COAT_RACK: createCommercialCatalogItem('COAT_RACK'),
  PLASTIC_TRASH_BIN: createCommercialCatalogItem('PLASTIC_TRASH_BIN'),
  EXTRA_INDOOR_PLANT_1: createIndoorPlantCatalogItem('EXTRA_INDOOR_PLANT_1'),
  EXTRA_LONG_PLANTER_100: createIndoorPlantCatalogItem('EXTRA_LONG_PLANTER_100'),
  EXTRA_LONG_PLANTER_150: createIndoorPlantCatalogItem('EXTRA_LONG_PLANTER_150'),
  EXTRA_LONG_PLANTER_200: createIndoorPlantCatalogItem('EXTRA_LONG_PLANTER_200'),
  TV_42: createWallMediaCatalogItem('TV_42'),
  TV_55: createWallMediaCatalogItem('TV_55'),
  VIDEO_WALL_2X2: createWallMediaCatalogItem('VIDEO_WALL_2X2'),
  VIDEO_WALL_3X3: createWallMediaCatalogItem('VIDEO_WALL_3X3'),
  TV_65: createWallMediaCatalogItem('TV_65'),
  led_floodlight: createTopLightCatalogItem('led_floodlight'),
  door_100: {
    itemKey: DOOR_ITEM.itemKey,
    type: DOOR_ITEM.type,
    widthCm: DOOR_ITEM.dimensions.widthCm,
    label: DOOR_ITEM.name,
  },

  desk_banko_100: createCounterCatalogItem('desk_banko_100'),
  desk_banko_100_L: createCounterCatalogItem('desk_banko_100_L'),
  desk_banko_150: createCounterCatalogItem('desk_banko_150'),
  desk_banko_150_L: createCounterCatalogItem('desk_banko_150_L'),
  desk_banko_200: createCounterCatalogItem('desk_banko_200'),
  desk_banko_200_L: createCounterCatalogItem('desk_banko_200_L'),
  BASE_100: createBaseCatalogItem('BASE_100'),
  BASE_150: createBaseCatalogItem('BASE_150'),
  BASE_200: createBaseCatalogItem('BASE_200'),
  wall_base_100: createBaseWallCatalogItem('wall_base_100'),
  wall_base_150: createBaseWallCatalogItem('wall_base_150'),
  wall_base_200: createBaseWallCatalogItem('wall_base_200'),
  wall_separator_100: createSeparatorCatalogItem('wall_separator_100'),
  wall_separator_50: createSeparatorCatalogItem('wall_separator_50'),
  wall_separator_100_sarmasik: createSeparatorCatalogItem('wall_separator_100_sarmasik'),
  wall_separator_50_sarmasik: createSeparatorCatalogItem('wall_separator_50_sarmasik'),
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

  'wall_200_short_up_2',
  'wall_150_short_up_2',
  'wall_100_short_up_2',
  'wall_50_short_up_2',
  'wall_200_short_up_1',
  'wall_150_short_up_1',
  'wall_100_short_up_1',
  'wall_50_short_up_1',
  'upright_346_5',

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
  'furniture_sofa_single_classic',
  'furniture_sofa_double_classic',
  'furniture_coffee_table_classic',
  'furniture_table_chair_set_eames',
  'chair_eames',
  'glass_table',
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
  'led_floodlight',
]);

export const MODULE_CATALOG_GROUPS = Object.freeze([
  Object.freeze({
    label: 'Panel & Duvar',
    keys: Object.freeze(['wall_200', 'wall_150', 'wall_100', 'wall_50', 'wall_separator_100', 'wall_separator_50', 'wall_separator_100_sarmasik', 'wall_separator_50_sarmasik', 'wall_base_200', 'wall_base_150', 'wall_base_100', 'door_100']),
  }),
  Object.freeze({
    label: 'Panel Ek Modül',
    keys: Object.freeze([
      'wall_200_short_up_2',
      'wall_150_short_up_2',
      'wall_100_short_up_2',
      'wall_50_short_up_2',
      'wall_200_short_up_1',
      'wall_150_short_up_1',
      'wall_100_short_up_1',
      'wall_50_short_up_1',
      'upright_346_5',
    ]),
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
    keys: Object.freeze(['furniture_sofa_set_classic', 'furniture_sofa_single_classic', 'furniture_sofa_double_classic', 'furniture_coffee_table_classic', 'furniture_table_chair_set_eames', 'chair_eames', 'glass_table', 'furniture_bar_stool_classic', 'MINI_FRIDGE_AVANTI', 'KETTLE', 'COAT_RACK', 'PLASTIC_TRASH_BIN', 'EXTRA_INDOOR_PLANT_1', 'EXTRA_LONG_PLANTER_100', 'EXTRA_LONG_PLANTER_150', 'EXTRA_LONG_PLANTER_200']),
  }),
  Object.freeze({
    label: 'Elektronik & Aydınlatma',
    keys: Object.freeze(['TV_42', 'TV_55', 'VIDEO_WALL_2X2', 'VIDEO_WALL_3X3', 'TV_65', 'led_floodlight']),
  }),
]);

function optionalNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

// Katalogdaki düz bankolarda `shape` yoktur; runtime state `shape: 'straight'` kullanır.
function shapesMatch(want, have) {
  const normalizedWant = want === 'L' ? 'L' : (want == null ? null : 'straight');
  const normalizedHave = have === 'L' ? 'L' : (have == null ? null : 'straight');
  if (normalizedWant === null) return true;
  if (normalizedHave === null && normalizedWant === 'straight') return true;
  return normalizedWant === normalizedHave;
}

function normalizeCatalogDescriptor(descriptor) {
  const nested = descriptor?.moduleState && typeof descriptor.moduleState === 'object'
    ? descriptor.moduleState
    : null;
  const source = nested ?? descriptor ?? {};
  return {
    itemKey: source.itemKey ?? descriptor?.itemKey ?? null,
    type: source.type ?? source.moduleType ?? descriptor?.type ?? descriptor?.moduleType ?? null,
    widthCm: optionalNumber(source.widthCm ?? descriptor?.widthCm),
    depthCm: optionalNumber(source.depthCm ?? descriptor?.depthCm),
    shape: source.shape ?? source.counterShape ?? descriptor?.shape ?? descriptor?.counterShape ?? null,
    shelfCount: optionalNumber(source.shelfCount ?? descriptor?.shelfCount),
    modelFile: source.modelFile ?? descriptor?.modelFile ?? null,
    sizeInch: optionalNumber(source.sizeInch ?? descriptor?.sizeInch),
    screenWidthCm: optionalNumber(source.screenWidthCm ?? descriptor?.screenWidthCm),
    variant: source.variant ?? descriptor?.variant ?? null,
  };
}

export function resolveItemKey(descriptor) {
  const normalized = normalizeCatalogDescriptor(descriptor);
  if (normalized.itemKey && MODULE_CATALOG[normalized.itemKey]) return normalized.itemKey;
  if (!normalized.type) return null;

  const candidates = MODULE_CATALOG_KEYS.filter(
    (moduleKey) => MODULE_CATALOG[moduleKey]?.type === normalized.type,
  );
  if (!candidates.length) return null;

  const matches = candidates.filter((moduleKey) => {
    const item = MODULE_CATALOG[moduleKey];
    // Sıradan TV'ler eskiden sahte 100 cm oturum yazardı; yerleşim genişliği artık
    // ekran genişliğidir. tv katalog anahtarlarını ayırmak için widthCm kullanma.
    if (normalized.type !== 'tv') {
      if (normalized.widthCm !== null && optionalNumber(item.widthCm) !== null && optionalNumber(item.widthCm) !== normalized.widthCm) return false;
    }
    if (normalized.depthCm !== null && optionalNumber(item.depthCm) !== null && optionalNumber(item.depthCm) !== normalized.depthCm) return false;
    if ((normalized.shape !== null || item.shape != null)
      && !shapesMatch(normalized.shape, item.shape)) return false;
    if ((normalized.shelfCount !== null || item.shelfCount != null) && optionalNumber(item.shelfCount) !== normalized.shelfCount) return false;
    if ((normalized.modelFile !== null || item.modelFile != null) && (item.modelFile ?? null) !== normalized.modelFile) return false;
    if (normalized.sizeInch !== null && optionalNumber(item.sizeInch) !== null && optionalNumber(item.sizeInch) !== normalized.sizeInch) return false;
    if (normalized.type === 'tv' && normalized.screenWidthCm !== null && optionalNumber(item.screenWidthCm) !== null
      && optionalNumber(item.screenWidthCm) !== normalized.screenWidthCm) return false;
    if ((normalized.variant != null || item.variant != null) && (item.variant ?? null) !== (normalized.variant ?? null)) return false;
    return true;
  });

  if (matches.length === 1) return matches[0];
  if (candidates.length === 1) return candidates[0];
  return null;
}

export function getModuleCatalogItem(descriptor) {
  const moduleKey = resolveItemKey(descriptor);
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
