import { getItem, listRegisteredItems, resolveItemKey, resolveSceneDimensions } from './items.js';

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

  assignCatalogFootprint(descriptor, item);
  if (item.videoWall) {
    descriptor.videoWallRows = item.videoWall.rows;
    descriptor.videoWallCols = item.videoWall.cols;
  }

  if (item.variant) descriptor.variant = item.variant;
  if (item.stripOccupancy) descriptor.stripOccupancy = item.stripOccupancy;
  if (item.eyeCount != null) descriptor.eyeCount = item.eyeCount;
  if (item.shape === 'L') descriptor.shape = 'L';
  if (item.modelFile) descriptor.modelFile = item.modelFile;
  if (item.modelRotationYDeg != null) descriptor.modelRotationYDeg = item.modelRotationYDeg;
  if (item.preserveModelScale != null) descriptor.preserveModelScale = item.preserveModelScale;
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
