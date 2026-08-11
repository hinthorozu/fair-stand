const DB_NAME = 'fair-stand-configurator';
const DB_VERSION = 2;
const PROJECT_STORE_NAME = 'projects';
const ASSET_STORE_NAME = 'image-assets';
const ASSET_PROJECT_INDEX = 'projectId';

function openDb() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in globalThis)) {
      reject(new Error('IndexedDB desteklenmiyor.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
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

export function createProjectId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `project-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export async function saveProject(project) {
  if (!project?.id) throw new Error('Proje id gerekli.');
  const now = Date.now();
  const stored = {
    ...project,
    version: Number(project.version) || 1,
    createdAt: Number(project.createdAt) || now,
    updatedAt: now,
  };
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(PROJECT_STORE_NAME, 'readwrite');
    tx.objectStore(PROJECT_STORE_NAME).put(stored);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return stored;
}

export async function loadProject(projectId) {
  const db = await openDb();
  const project = await new Promise((resolve, reject) => {
    const tx = db.transaction(PROJECT_STORE_NAME, 'readonly');
    const request = tx.objectStore(PROJECT_STORE_NAME).get(projectId);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return project;
}

export async function listProjects() {
  const db = await openDb();
  const projects = await new Promise((resolve, reject) => {
    const tx = db.transaction(PROJECT_STORE_NAME, 'readonly');
    const request = tx.objectStore(PROJECT_STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result ?? []);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return projects.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));
}

export async function deleteProject(projectId) {
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(PROJECT_STORE_NAME, 'readwrite');
    tx.objectStore(PROJECT_STORE_NAME).delete(projectId);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}
