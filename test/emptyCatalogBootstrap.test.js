import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCanonicalItemCatalog } from './registerCanonicalItemCatalog.mjs';
import {
  initializeCatalogCategories,
  initializeCatalogPreviews,
  listCatalogCategories,
  listCatalogGroups,
  listCatalogItems,
} from '../src/catalog.js';
import { initializeItemRegistry, listRegisteredItems } from '../src/items.js';

test('empty catalog arrays boot the editor; missing arrays still fail', () => {
  try {
    initializeCatalogCategories([]);
    initializeCatalogPreviews([]);
    initializeItemRegistry([]);

    assert.deepEqual(listCatalogCategories(), []);
    assert.deepEqual(listCatalogGroups(), []);
    assert.deepEqual(listCatalogItems(), []);
    assert.deepEqual(listRegisteredItems(), []);

    assert.throws(() => initializeCatalogCategories(null), TypeError);
    assert.throws(() => initializeCatalogPreviews(undefined), TypeError);
    assert.throws(() => initializeItemRegistry({}), TypeError);
  } finally {
    loadCanonicalItemCatalog();
  }
});
