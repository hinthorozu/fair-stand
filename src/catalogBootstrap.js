import { initializeCatalogCategories } from './catalog.js';
import { initializeItemRegistry } from './items.js';

function catalogBootstrapUrl() {
  return import.meta.env.VITE_FAIR_STAND_CATALOG_URL || '/api/v1/fair-stand/catalog/bootstrap';
}

function catalogBootstrapHeaders() {
  const headers = globalThis.__FAIR_STAND_CATALOG_HEADERS__;
  return headers && typeof headers === 'object' ? headers : {};
}

export async function bootstrapFairStandCatalog() {
  const response = await fetch(catalogBootstrapUrl(), {
    headers: catalogBootstrapHeaders(),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(`Fair Stand Item catalog bootstrap failed (${response.status}).`);
  }
  const payload = await response.json();
  if (!payload || !Array.isArray(payload.items) || !Array.isArray(payload.categories)) {
    throw new TypeError('Fair Stand Item catalog bootstrap payload is invalid.');
  }
  initializeCatalogCategories(payload.categories);
  initializeItemRegistry(payload.items);
  return payload.revision ?? null;
}
