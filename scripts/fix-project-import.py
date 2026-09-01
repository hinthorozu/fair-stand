from pathlib import Path

p = Path('src/main.js')
s = p.read_text(encoding='utf-8')
start_marker = "importProjectFileInput.addEventListener('change', async () => {"
end_marker = "\n});\n\nopenProjectButton.addEventListener('click', async () => {"
start = s.find(start_marker)
if start < 0:
    raise SystemExit('import handler start not found')
end = s.find(end_marker, start)
if end < 0:
    raise SystemExit('import handler end not found')

new_block = r'''importProjectFileInput.addEventListener('change', async () => {
  const file = importProjectFileInput.files?.[0];
  importProjectFileInput.value = '';
  if (!file) return;
  setButtonBusy(importProjectButton, true, 'Aktarılıyor');
  showProjectLoading('Proje içe aktarılıyor…', 'ZIP paketi ve görseller hazırlanıyor.');
  projectStatus.textContent = 'Proje içe aktarılıyor…';

  let importedProjectId = null;
  let importStorageTouched = false;

  try {
    const JSZip = await loadJSZip();
    const zip = await JSZip.loadAsync(file);
    const manifestEntry = zip.file('project.json');
    if (!manifestEntry) throw new Error('ZIP içinde project.json bulunamadı.');

    const manifest = JSON.parse(await manifestEntry.async('text'));
    if (manifest?.archiveVersion !== 1 || !manifest?.project || typeof manifest.project !== 'object') {
      throw new Error('Desteklenmeyen proje paketi.');
    }
    if (typeof manifest.project.id !== 'string' || !manifest.project.id.trim()) {
      throw new Error('Proje kimliği geçersiz.');
    }
    if (manifest.assets != null && !Array.isArray(manifest.assets)) {
      throw new Error('Proje görsel listesi geçersiz.');
    }

    const manifestAssets = manifest.assets || [];
    const existing = await listProjects();
    const existingIds = new Set(existing.map((item) => item.id));
    importedProjectId = existingIds.has(manifest.project.id) ? createProjectId() : manifest.project.id;

    const idMap = new Map();
    const preparedAssets = [];
    for (const asset of manifestAssets) {
      if (!asset || typeof asset.id !== 'string' || !asset.id || typeof asset.path !== 'string' || !asset.path) {
        throw new Error('Proje görsel kaydı geçersiz.');
      }
      if (idMap.has(asset.id)) throw new Error(`Tekrarlanan asset kimliği: ${asset.id}`);

      const entry = zip.file(asset.path);
      if (!entry || entry.dir) throw new Error(`Eksik asset: ${asset.path}`);
      const blob = await entry.async('blob');
      const newAssetId = globalThis.crypto?.randomUUID?.()
        ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      idMap.set(asset.id, newAssetId);
      preparedAssets.push({
        id: newAssetId,
        name: asset.name,
        type: asset.type,
        createdAt: asset.createdAt,
        blob: new Blob([blob], { type: asset.type || blob.type }),
      });
    }

    // Storage'a dokunmadan önce ZIP'in tamamı ve bütün asset'ler doğrulanmış olur.
    const importedProject = remapAssetIdsInValue({
      ...manifest.project,
      id: importedProjectId,
      name: manifest.project.name || 'İçe Aktarılan Proje',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }, idMap);

    await saveProject(importedProject);
    importStorageTouched = true;

    for (const asset of preparedAssets) {
      await saveImportedImageAsset(importedProjectId, asset);
    }

    await refreshProjectList(importedProjectId);
    const project = await loadProject(importedProjectId);
    if (!project) throw new Error('İçe aktarılan proje tekrar okunamadı.');
    await restoreProject(project);
    projectStatus.textContent = `İçe aktarıldı · ${preparedAssets.length} görsel`;
  } catch (error) {
    if (importStorageTouched && importedProjectId) {
      try {
        await deleteProjectImageAssets(importedProjectId);
        await deleteProject(importedProjectId);
        await refreshProjectList();
      } catch (cleanupError) {
        console.warn('Başarısız içe aktarma temizlenemedi:', cleanupError);
      }
    }
    console.warn('Proje içe aktarılamadı:', error);
    projectStatus.textContent = `Proje ZIP içe aktarılamadı: ${error?.message || 'Bilinmeyen hata.'}`;
  } finally {
    hideProjectLoading();
    setButtonBusy(importProjectButton, false);
  }
});'''

s = s[:start] + new_block + s[end + len("\n});"):]
p.write_text(s, encoding='utf-8')

Path('test/projectImportFlow.test.js').write_text(r'''import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

test('project import validates and prepares archive before saving', () => {
  const handlerStart = source.indexOf("importProjectFileInput.addEventListener('change'");
  const handlerEnd = source.indexOf("openProjectButton.addEventListener('click'", handlerStart);
  assert.ok(handlerStart >= 0 && handlerEnd > handlerStart);
  const handler = source.slice(handlerStart, handlerEnd);

  assert.match(handler, /manifest\.project\.id/);
  assert.match(handler, /Array\.isArray\(manifest\.assets\)/);
  assert.match(handler, /const preparedAssets = \[\]/);
  assert.match(handler, /entry\.async\('blob'\)/);
  assert.ok(handler.indexOf("entry.async('blob')") < handler.indexOf('await saveProject(importedProject)'));
});

test('failed import rolls back project and assets', () => {
  const handlerStart = source.indexOf("importProjectFileInput.addEventListener('change'");
  const handlerEnd = source.indexOf("openProjectButton.addEventListener('click'", handlerStart);
  const handler = source.slice(handlerStart, handlerEnd);

  assert.match(handler, /importStorageTouched/);
  assert.match(handler, /await deleteProjectImageAssets\(importedProjectId\)/);
  assert.match(handler, /await deleteProject\(importedProjectId\)/);
  assert.match(handler, /error\?\.message/);
});
''', encoding='utf-8')
