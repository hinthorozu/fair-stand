from pathlib import Path

# index.html
p = Path('index.html')
t = p.read_text(encoding='utf-8')
old = '''            <button id="open-project" type="button">Aç</button>\n            <button id="delete-project" type="button" class="danger ghost">Sil</button>'''
new = '''            <button id="open-project" type="button">Aç</button>\n            <button id="export-project" type="button">Dışarı Aktar</button>\n            <button id="import-project" type="button">İçe Aktar</button>\n            <input id="import-project-file" type="file" accept=".zip,application/zip" hidden />\n            <button id="delete-project" type="button" class="danger ghost">Sil</button>'''
if old not in t:
    raise SystemExit('index project buttons anchor not found')
t = t.replace(old, new, 1)
p.write_text(t, encoding='utf-8')

# assetStore.js: preserve imported asset IDs
p = Path('src/assetStore.js')
t = p.read_text(encoding='utf-8')
append = '''\nexport async function saveImportedImageAsset(projectId, asset) {\n  if (!projectId) throw new Error('İçe aktarılan görsel için projectId gerekli.');\n  if (!asset?.id || !asset?.blob) throw new Error('İçe aktarılan görsel geçersiz.');\n  const db = await openDb();\n  const stored = {\n    id: asset.id,\n    projectId,\n    name: asset.name || 'asset',\n    type: asset.type || asset.blob.type || 'application/octet-stream',\n    blob: asset.blob,\n    createdAt: Number(asset.createdAt) || Date.now(),\n  };\n  await new Promise((resolve, reject) => {\n    const transaction = db.transaction(STORE_NAME, 'readwrite');\n    transaction.objectStore(STORE_NAME).put(stored);\n    transaction.oncomplete = resolve;\n    transaction.onerror = () => reject(transaction.error);\n  });\n  db.close();\n  return stored;\n}\n'''
if 'export async function saveImportedImageAsset' not in t:
    t += append
p.write_text(t, encoding='utf-8')

# main.js
p = Path('src/main.js')
t = p.read_text(encoding='utf-8')
t = t.replace("import './imageActions.css';", "import './imageActions.css';\nimport JSZip from 'jszip';", 1)
t = t.replace(
    "import { deleteProjectImageAssets, loadImageAssets, saveImageAsset } from './assetStore.js';",
    "import { deleteProjectImageAssets, loadImageAssets, saveImageAsset, saveImportedImageAsset } from './assetStore.js';",
    1,
)
old = '''const openProjectButton = document.querySelector('#open-project');\nconst deleteProjectButton = document.querySelector('#delete-project');'''
new = '''const openProjectButton = document.querySelector('#open-project');\nconst exportProjectButton = document.querySelector('#export-project');\nconst importProjectButton = document.querySelector('#import-project');\nconst importProjectFileInput = document.querySelector('#import-project-file');\nconst deleteProjectButton = document.querySelector('#delete-project');'''
if old not in t:
    raise SystemExit('main button constants anchor not found')
t = t.replace(old, new, 1)

anchor = '''openProjectButton.addEventListener('click', async () => {\n'''
idx = t.find(anchor)
if idx < 0:
    raise SystemExit('open project listener anchor not found')
block = r'''function safeArchiveName(name) {
  return (name || 'fair-stand-project')
    .replace(/[^a-zA-Z0-9ğüşöçıİĞÜŞÖÇ._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'fair-stand-project';
}

function remapAssetIdsInValue(value, idMap) {
  if (Array.isArray(value)) return value.map((item) => remapAssetIdsInValue(item, idMap));
  if (!value || typeof value !== 'object') return value;
  const output = {};
  Object.entries(value).forEach(([key, item]) => {
    if (key === 'imageAssetId' && typeof item === 'string' && idMap.has(item)) {
      output[key] = idMap.get(item);
    } else {
      output[key] = remapAssetIdsInValue(item, idMap);
    }
  });
  return output;
}

exportProjectButton.addEventListener('click', async () => {
  const projectId = projectSelect.value || activeProjectId;
  if (!projectId) return;
  exportProjectButton.disabled = true;
  projectStatus.textContent = 'Proje ZIP hazırlanıyor…';
  try {
    if (projectId === activeProjectId) await persistActiveProject({ quiet: true });
    const project = await loadProject(projectId);
    if (!project) throw new Error('Dışarı aktarılacak proje bulunamadı.');
    const assets = await loadImageAssets(projectId);
    const zip = new JSZip();
    const manifestAssets = [];
    for (const asset of assets) {
      const ext = (asset.name?.match(/\.[a-zA-Z0-9]+$/)?.[0] || '') || '';
      const path = `assets/${asset.id}${ext}`;
      zip.file(path, asset.blob);
      manifestAssets.push({
        id: asset.id,
        name: asset.name,
        type: asset.type,
        createdAt: asset.createdAt,
        path,
      });
    }
    zip.file('project.json', JSON.stringify({
      archiveVersion: 1,
      exportedAt: Date.now(),
      project,
      assets: manifestAssets,
    }, null, 2));
    const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeArchiveName(project.name)}.zip`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    projectStatus.textContent = `Dışarı aktarıldı · ${assets.length} görsel`;
  } catch (error) {
    console.warn('Proje dışarı aktarılamadı:', error);
    projectStatus.textContent = 'Proje dışarı aktarılamadı.';
  } finally {
    exportProjectButton.disabled = false;
  }
});

importProjectButton.addEventListener('click', () => importProjectFileInput.click());

importProjectFileInput.addEventListener('change', async () => {
  const file = importProjectFileInput.files?.[0];
  importProjectFileInput.value = '';
  if (!file) return;
  importProjectButton.disabled = true;
  projectLoadingOverlay.hidden = false;
  projectStatus.textContent = 'Proje içe aktarılıyor…';
  try {
    const zip = await JSZip.loadAsync(file);
    const manifestEntry = zip.file('project.json');
    if (!manifestEntry) throw new Error('ZIP içinde project.json bulunamadı.');
    const manifest = JSON.parse(await manifestEntry.async('text'));
    if (manifest.archiveVersion !== 1 || !manifest.project) throw new Error('Desteklenmeyen proje paketi.');

    const existing = await listProjects();
    const existingIds = new Set(existing.map((item) => item.id));
    const importedProjectId = existingIds.has(manifest.project.id) ? createProjectId() : manifest.project.id;
    const idMap = new Map();
    for (const asset of manifest.assets || []) {
      const newAssetId = crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      idMap.set(asset.id, newAssetId);
    }

    const importedProject = remapAssetIdsInValue({
      ...manifest.project,
      id: importedProjectId,
      name: manifest.project.name || 'İçe Aktarılan Proje',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }, idMap);
    await saveProject(importedProject);

    for (const asset of manifest.assets || []) {
      const entry = zip.file(asset.path);
      if (!entry) throw new Error(`Eksik asset: ${asset.path}`);
      const blob = await entry.async('blob');
      await saveImportedImageAsset(importedProjectId, {
        id: idMap.get(asset.id),
        name: asset.name,
        type: asset.type,
        createdAt: asset.createdAt,
        blob: new Blob([blob], { type: asset.type || blob.type }),
      });
    }

    await refreshProjectList(importedProjectId);
    const project = await loadProject(importedProjectId);
    await restoreProject(project);
    projectStatus.textContent = `İçe aktarıldı · ${(manifest.assets || []).length} görsel`;
  } catch (error) {
    console.warn('Proje içe aktarılamadı:', error);
    projectStatus.textContent = 'Proje ZIP içe aktarılamadı.';
  } finally {
    projectLoadingOverlay.hidden = true;
    importProjectButton.disabled = false;
  }
});

'''
t = t[:idx] + block + t[idx:]
p.write_text(t, encoding='utf-8')
