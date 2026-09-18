import { getItem, listRegisteredItems, resolveItemKey } from './items.js';

let catalogCategories = Object.freeze([]);

export function initializeCatalogCategories(categories) {
  if (!Array.isArray(categories) || categories.length === 0) {
    throw new TypeError('Fair Stand Category catalog bootstrap returned no categories.');
  }
  catalogCategories = Object.freeze(
    categories.map((category) => Object.freeze({
      catalogKey: category.catalogKey,
      catalogName: category.catalogName,
      catalogIndex: category.catalogIndex,
    })),
  );
}

export function resetCatalogCategories() {
  catalogCategories = Object.freeze([]);
}

export function listCatalogCategories() {
  return Object.freeze(
    [...catalogCategories].sort((left, right) => left.catalogIndex - right.catalogIndex),
  );
}

export function getCatalogCategory(catalogKey) {
  return catalogCategories.find((category) => category.catalogKey === catalogKey) ?? null;
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
        const leftCategory = getCatalogCategory(left.catalogCategory);
        const rightCategory = getCatalogCategory(right.catalogCategory);
        const categoryDelta = (leftCategory?.catalogIndex ?? 0) - (rightCategory?.catalogIndex ?? 0);
        if (categoryDelta !== 0) return categoryDelta;
        return Number(left.catalogItemIndex) - Number(right.catalogItemIndex);
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
