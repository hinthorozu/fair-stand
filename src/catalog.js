import { getItem, listRegisteredItems, resolveItemKey } from './items.js';

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

function projectCatalogItem(item) {
  if (typeof item.catalogPreview !== 'string' || item.catalogPreview === '') {
    throw new TypeError(`Item ${item.itemKey} is catalogVisible without catalogPreview.`);
  }
  if (!CATALOG_PREVIEWS.includes(item.catalogPreview)) {
    throw new TypeError(`Item ${item.itemKey} has unknown catalogPreview: ${item.catalogPreview}.`);
  }

  return Object.freeze({
    itemKey: item.itemKey,
    label: item.name,
    catalogPreview: item.catalogPreview,
  });
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

export function getModuleCatalogItem(descriptor) {
  const moduleKey = resolveItemKey(descriptor);
  return moduleKey ? getCatalogItem(moduleKey) : null;
}

export function getModuleCatalogLabel(descriptor) {
  return getModuleCatalogItem(descriptor)?.label
    ?? (typeof descriptor?.label === 'string' ? descriptor.label : null)
    ?? 'Modül';
}
