import { getFurnitureClusterQuantity, getItem, listRegisteredItems, resolveItemKey, resolveSceneDimensions, resolveWallMediaMetrics } from './items.js';

export { resolveItemKey };

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

// Canonical Catalog kategorileri. catalogKey Item.catalogCategory ile eşleşir.
// catalogName UI label'dır. catalogIndex 1 tabanlı kategori sırasıdır.
export const CATALOG_CATEGORIES = Object.freeze([
  Object.freeze({ catalogKey: 'panel-wall', catalogName: 'Panel & Duvar', catalogIndex: 1 }),
  Object.freeze({ catalogKey: 'panel-addon', catalogName: 'Panel Ek Modül', catalogIndex: 2 }),
  Object.freeze({ catalogKey: 'shelf-showcase', catalogName: 'Raf & Vitrin', catalogIndex: 3 }),
  Object.freeze({ catalogKey: 'counter-base', catalogName: 'Banko & Baza', catalogIndex: 4 }),
  Object.freeze({ catalogKey: 'extra', catalogName: 'Extra', catalogIndex: 5 }),
  Object.freeze({ catalogKey: 'electronics-lighting', catalogName: 'Elektronik & Aydınlatma', catalogIndex: 6 }),
]);

export function listCatalogCategories() {
  return Object.freeze(
    [...CATALOG_CATEGORIES].sort((left, right) => left.catalogIndex - right.catalogIndex),
  );
}

export function getCatalogCategory(catalogKey) {
  return CATALOG_CATEGORIES.find((category) => category.catalogKey === catalogKey) ?? null;
}

export const CATALOG_PREVIEWS = Object.freeze([
  'bar-stool',
  'base',
  'base-wall',
  'chair',
  'coat-rack',
  'coffee-table',
  'counter',
  'door',
  'flat-panel',
  'floodlight',
  'glass-table',
  'indoor-plant',
  'kettle',
  'long-planter',
  'mini-fridge',
  'plastic-trash-bin',
  'profile',
  'separator',
  'separator-vine',
  'shelf',
  'showcase',
  'sofa-double',
  'sofa-set',
  'sofa-single',
  'table-chair-set',
  'tv',
  'upright',
  'video-wall',
]);

function assignCatalogFootprint(descriptor, item) {
  const scene = resolveSceneDimensions(item);
  if (scene.widthCm != null) descriptor.widthCm = scene.widthCm;
  if (scene.depthCm != null) descriptor.depthCm = scene.depthCm;
  if (scene.heightCm != null) descriptor.heightCm = scene.heightCm;
}

function projectCatalogItem(item) {
  if (typeof item.catalogPreview !== 'string' || item.catalogPreview === '') {
    throw new TypeError(`Item ${item.itemKey} is catalogVisible without catalogPreview.`);
  }
  if (!CATALOG_PREVIEWS.includes(item.catalogPreview)) {
    throw new TypeError(`Item ${item.itemKey} has unknown catalogPreview: ${item.catalogPreview}.`);
  }

  const descriptor = {
    itemKey: item.itemKey,
    // type Catalog UI preview seçmez; createModuleStateFromDescriptor factory uyumu için kalır.
    type: item.type,
    label: item.name,
    catalogPreview: item.catalogPreview,
  };

  // Duvar-medya ölçüleri Item üzerindeki screen/catalogHeight/videoWall alanlarından türetilir.
  const media = resolveWallMediaMetrics(item);
  if (media) {
    descriptor.widthCm = media.widthCm;
    descriptor.depthCm = media.depthCm;
    descriptor.heightCm = media.catalogHeightCm;
    descriptor.screenWidthCm = media.screenWidthCm;
    descriptor.screenHeightCm = media.screenHeightCm;
    descriptor.sizeInch = media.sizeInch;
    if (media.videoWallRows > 1 || media.videoWallCols > 1) {
      descriptor.panelScreenWidthCm = media.panelScreenWidthCm;
      descriptor.panelScreenHeightCm = media.panelScreenHeightCm;
      descriptor.videoWallRows = media.videoWallRows;
      descriptor.videoWallCols = media.videoWallCols;
    }
  } else {
    assignCatalogFootprint(descriptor, item);
  }

  if (item.variant) descriptor.variant = item.variant;
  if (item.stripOccupancy) descriptor.stripOccupancy = item.stripOccupancy;
  if (item.shelfCount != null) descriptor.shelfCount = item.shelfCount;
  if (item.eyeCount != null) descriptor.eyeCount = item.eyeCount;
  if (item.shape === 'L') descriptor.shape = 'L';
  if (item.modelFile) descriptor.modelFile = item.modelFile;
  if (item.modelRotationYDeg != null) descriptor.modelRotationYDeg = item.modelRotationYDeg;
  if (item.preserveModelScale != null) descriptor.preserveModelScale = item.preserveModelScale;
  if (item.sizeInch != null && descriptor.sizeInch == null) descriptor.sizeInch = item.sizeInch;
  // unit / visualRotationYDeg yalnız modelFile taşıyan Item'da eski commercial projection'da vardı.
  if (item.modelFile) {
    if (item.unit != null) descriptor.unit = item.unit;
    if (item.visualRotationYDeg != null) descriptor.visualRotationYDeg = item.visualRotationYDeg;
  }

  return Object.freeze(descriptor);
}

export function getCatalogItem(itemKey) {
  const item = getItem(itemKey);
  if (!item || item.catalogVisible !== true) return null;
  return projectCatalogItem(item);
}

export function listCatalogItems() {
  return Object.freeze(
    listRegisteredItems()
      .filter((item) => item.catalogVisible === true)
      .sort((left, right) => {
        const leftIndex = getCatalogCategory(left.catalogCategory)?.catalogIndex ?? Number.POSITIVE_INFINITY;
        const rightIndex = getCatalogCategory(right.catalogCategory)?.catalogIndex ?? Number.POSITIVE_INFINITY;
        if (leftIndex !== rightIndex) return leftIndex - rightIndex;
        return left.catalogItemIndex - right.catalogItemIndex;
      })
      .map(projectCatalogItem),
  );
}

export function listCatalogGroups() {
  const categories = listCatalogCategories();
  const membersByKey = new Map(categories.map((category) => [category.catalogKey, []]));

  for (const item of listRegisteredItems()) {
    if (item.catalogVisible !== true) continue;
    const bucket = membersByKey.get(item.catalogCategory);
    if (!bucket) {
      throw new TypeError(
        `Item ${item.itemKey} catalogCategory is not a catalogKey: ${item.catalogCategory}.`,
      );
    }
    bucket.push(item);
  }

  return Object.freeze(categories.map((category) => {
    const members = [...membersByKey.get(category.catalogKey)]
      .sort((left, right) => left.catalogItemIndex - right.catalogItemIndex);
    return Object.freeze({
      catalogKey: category.catalogKey,
      catalogName: category.catalogName,
      catalogIndex: category.catalogIndex,
      label: category.catalogName,
      keys: Object.freeze(members.map((item) => item.itemKey)),
    });
  }));
}

// Derived compatibility: hardcoded Item key listesi yoktur; listCatalogItems'tan üretilir.
export const MODULE_CATALOG_GROUPS = listCatalogGroups();
export const MODULE_CATALOG_KEYS = Object.freeze(
  MODULE_CATALOG_GROUPS.flatMap((group) => group.keys),
);
export const MODULE_CATALOG = Object.freeze(
  Object.fromEntries(listCatalogItems().map((item) => [item.itemKey, item])),
);

export function getModuleCatalogItem(descriptor) {
  const moduleKey = resolveItemKey(descriptor);
  return moduleKey ? getCatalogItem(moduleKey) : null;
}

export function getModuleCatalogLabel(descriptor) {
  return getModuleCatalogItem(descriptor)?.label
    ?? (typeof descriptor?.label === 'string' ? descriptor.label : null)
    ?? 'Modül';
}

export function flatPanelKey(widthCm) {
  return `wall_${widthCm}`;
}
