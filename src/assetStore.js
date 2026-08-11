const DB_NAME = 'fair-stand-configurator';
const DB_VERSION = 2;
const STORE_NAME = 'image-assets';
const PROJECT_STORE_NAME = 'projects';
const PROJECT_INDEX = 'projectId';

function createId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function openDb() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in globalThis)) {
      reject(new Error('IndexedDB desteklenmiyor.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      let assetStore;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        assetStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      } else {
        assetStore = request.transaction.objectStore(STORE_NAME);
      }
      if (!assetStore.indexNames.contains(PROJECT_INDEX)) {
        assetStore.createIndex(PROJECT_INDEX, PROJECT_INDEX, { unique: false });
      }
      if (!db.objectStoreNames.contains(PROJECT_STORE_NAME)) {
        db.createObjectStore(PROJECT_STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveImageAsset(projectId, file) {
  if (!projectId) throw new Error('Görsel kaydı için projectId gerekli.');
  const db = await openDb();
  const asset = {
    id: createId(),
    projectId,
    name: file.name,
    type: file.type,
    blob: file,
    createdAt: Date.now(),
  };

  await new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(asset);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });

  db.close();
  return asset;
}

export async function loadImageAssets(projectId) {
  if (!projectId) return [];
  const db = await openDb();
  const assets = await new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.index(PROJECT_INDEX).getAll(projectId);
    request.onsuccess = () => resolve(request.result ?? []);
    request.onerror = () => reject(request.error);
  });

  db.close();
  return assets.sort((a, b) => a.createdAt - b.createdAt);
}

export async function deleteProjectImageAssets(projectId) {
  if (!projectId) return;
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const index = transaction.objectStore(STORE_NAME).index(PROJECT_INDEX);
    const request = index.openCursor(IDBKeyRange.only(projectId));
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      cursor.delete();
      cursor.continue();
    };
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}
