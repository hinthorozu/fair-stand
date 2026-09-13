/**
 * Tek IndexedDB şema sahibi. projectStore ve assetStore buradan açar.
 * Ad/sürüm/depo şekli değişmez: fair-stand-configurator v2, projects + image-assets.
 */

export const CONFIGURATOR_DB_NAME = 'fair-stand-configurator';
export const CONFIGURATOR_DB_VERSION = 2;
export const PROJECT_STORE_NAME = 'projects';
export const ASSET_STORE_NAME = 'image-assets';
export const ASSET_PROJECT_INDEX = 'projectId';

export function openConfiguratorDb() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in globalThis)) {
      reject(new Error('IndexedDB desteklenmiyor.'));
      return;
    }
    const request = indexedDB.open(CONFIGURATOR_DB_NAME, CONFIGURATOR_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PROJECT_STORE_NAME)) {
        db.createObjectStore(PROJECT_STORE_NAME, { keyPath: 'id' });
      }
      let assetStore;
      if (!db.objectStoreNames.contains(ASSET_STORE_NAME)) {
        assetStore = db.createObjectStore(ASSET_STORE_NAME, { keyPath: 'id' });
      } else {
        assetStore = request.transaction.objectStore(ASSET_STORE_NAME);
      }
      if (!assetStore.indexNames.contains(ASSET_PROJECT_INDEX)) {
        assetStore.createIndex(ASSET_PROJECT_INDEX, ASSET_PROJECT_INDEX, { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
