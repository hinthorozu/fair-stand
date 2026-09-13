import {
  ASSET_PROJECT_INDEX,
  ASSET_STORE_NAME,
  PROJECT_STORE_NAME,
  openConfiguratorDb,
} from './configuratorDb.js';

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
  const db = await openConfiguratorDb();
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
  const db = await openConfiguratorDb();
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
  const db = await openConfiguratorDb();
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
  const db = await openConfiguratorDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(PROJECT_STORE_NAME, 'readwrite');
    tx.objectStore(PROJECT_STORE_NAME).delete(projectId);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function deleteProjectWithAssets(projectId) {
  if (!projectId) return false;

  const db = await openConfiguratorDb();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(
        [PROJECT_STORE_NAME, ASSET_STORE_NAME],
        'readwrite',
      );
      const projectStore = tx.objectStore(PROJECT_STORE_NAME);
      const assetStore = tx.objectStore(ASSET_STORE_NAME);
      const assetIndex = assetStore.index(ASSET_PROJECT_INDEX);

      projectStore.delete(projectId);

      const request = assetIndex.openCursor(projectId);
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) return;
        cursor.delete();
        cursor.continue();
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error('Proje silme işlemi iptal edildi.'));
    });
  } finally {
    db.close();
  }

  return true;
}
