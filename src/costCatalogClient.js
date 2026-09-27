import { getFairStandHostWindow } from './hostDocument.js';

function catalogUrl() {
  return import.meta.env.VITE_FAIR_CRM_COST_CATALOG_URL || '/api/v1/cost-catalog/products';
}

function apiHeaders() {
  const hostWindow = getFairStandHostWindow();
  const headers = hostWindow?.__FAIR_STAND_CATALOG_HEADERS__ || globalThis.__FAIR_STAND_CATALOG_HEADERS__;
  return headers && typeof headers === 'object' ? { ...headers } : {};
}

export function costCatalogRemoteEnabled() {
  const headers = apiHeaders();
  return Boolean(headers.Authorization || headers.authorization);
}

/**
 * Organizasyon maliyet kataloğu. Giriş yoksa boş liste; fiyat uydurulmaz.
 */
export async function listCostProducts() {
  if (!costCatalogRemoteEnabled()) return [];
  const response = await fetch(catalogUrl(), { headers: apiHeaders() });
  if (!response.ok) {
    const error = new Error(`Cost catalog ${response.status}`);
    error.status = response.status;
    throw error;
  }
  const body = await response.json();
  return Array.isArray(body?.items) ? body.items : [];
}
