from pathlib import Path


def read_text(path):
    p = Path(path)
    with p.open('r', encoding='utf-8', newline='') as handle:
        raw = handle.read()
    newline = '\r\n' if '\r\n' in raw else '\n'
    return p, raw.replace('\r\n', '\n'), newline


def write_text(path, text, newline):
    with path.open('w', encoding='utf-8', newline='') as handle:
        handle.write(text.replace('\n', newline))


# 1) IndexedDB: tek görseli güvenli biçimde sil.
asset_path, asset_store, asset_nl = read_text('src/assetStore.js')
anchor = """export async function deleteProjectImageAssets(projectId) {\n"""
insert = """export async function deleteImageAsset(projectId, assetId) {\n  if (!projectId || !assetId) return false;\n  const db = await openDb();\n  const deleted = await new Promise((resolve, reject) => {\n    const transaction = db.transaction(STORE_NAME, 'readwrite');\n    const store = transaction.objectStore(STORE_NAME);\n    let removed = false;\n    const request = store.get(assetId);\n\n    request.onsuccess = () => {\n      const asset = request.result;\n      if (!asset || asset.projectId !== projectId) return;\n      store.delete(assetId);\n      removed = true;\n    };\n    request.onerror = () => reject(request.error);\n    transaction.oncomplete = () => resolve(removed);\n    transaction.onerror = () => reject(transaction.error);\n    transaction.onabort = () => reject(transaction.error);\n  });\n\n  db.close();\n  return deleted;\n}\n\n"""
if 'export async function deleteImageAsset(' not in asset_store:
    if asset_store.count(anchor) != 1:
        raise SystemExit('assetStore deleteProjectImageAssets anchor not found exactly once')
    asset_store = asset_store.replace(anchor, insert + anchor, 1)
write_text(asset_path, asset_store, asset_nl)


# 2) Saf pure helpers: kullanım kontrolü ve bütün atamaları temizleme.
ref_helper = """const IMAGE_ASSET_REFERENCE_KEYS = new Set(['imageAssetId', 'fabricImageAssetId']);\n\nfunction walkImageAssetReferences(value, assetId, visitor) {\n  if (!assetId || value == null || typeof value !== 'object') return;\n\n  if (Array.isArray(value)) {\n    value.forEach((item) => walkImageAssetReferences(item, assetId, visitor));\n    return;\n  }\n\n  Object.entries(value).forEach(([key, item]) => {\n    if (IMAGE_ASSET_REFERENCE_KEYS.has(key) && item === assetId) {\n      visitor(value, key);\n      return;\n    }\n    walkImageAssetReferences(item, assetId, visitor);\n  });\n}\n\nexport function countImageAssetReferences(value, assetId) {\n  let count = 0;\n  walkImageAssetReferences(value, assetId, () => { count += 1; });\n  return count;\n}\n\nexport function clearImageAssetReferences(value, assetId) {\n  let count = 0;\n  walkImageAssetReferences(value, assetId, (owner, key) => {\n    owner[key] = null;\n    if (key === 'fabricImageAssetId') owner.fabricImageFit = 'cover';\n    count += 1;\n  });\n  return count;\n}\n"""
Path('src/imageAssetReferences.js').write_text(ref_helper, encoding='utf-8')


# 3) Ana UI: sağ tık menüsü + Delete tuşu + atama uyarısı + ortak silme fonksiyonu.
main_path, main, main_nl = read_text('src/main.js')
old_import = "import { deleteProjectImageAssets, loadImageAssets, saveImageAsset, saveImportedImageAsset } from './assetStore.js';"
new_import = "import { deleteImageAsset, deleteProjectImageAssets, loadImageAssets, saveImageAsset, saveImportedImageAsset } from './assetStore.js';\nimport { clearImageAssetReferences, countImageAssetReferences } from './imageAssetReferences.js';"
if main.count(old_import) != 1:
    raise SystemExit('main assetStore import anchor not found exactly once')
main = main.replace(old_import, new_import, 1)

old_asset_map = """const imageAssets = new Map();\n\nfunction getAssetUrl(assetId) {\n"""
new_asset_map = """const imageAssets = new Map();\nlet assetContextAssetId = null;\n\nconst assetContextMenu = document.createElement('div');\nassetContextMenu.className = 'module-context-menu asset-context-menu';\nassetContextMenu.hidden = true;\nassetContextMenu.innerHTML = `\n  <div class=\"module-context-title\">Görsel</div>\n  <button type=\"button\" data-asset-action=\"delete\" class=\"danger\">Sil</button>\n`;\ndocument.body.appendChild(assetContextMenu);\n\nfunction getAssetUrl(assetId) {\n"""
if main.count(old_asset_map) != 1:
    raise SystemExit('main imageAssets anchor not found exactly once')
main = main.replace(old_asset_map, new_asset_map, 1)

old_clear_registered = """  imageAssets.clear();\n  activeAssetId = null;\n  renderAssetLibrary();\n"""
new_clear_registered = """  imageAssets.clear();\n  activeAssetId = null;\n  closeAssetContextMenu();\n  renderAssetLibrary();\n"""
if main.count(old_clear_registered) != 1:
    raise SystemExit('clearRegisteredAssets anchor not found exactly once')
main = main.replace(old_clear_registered, new_clear_registered, 1)

register_anchor = """function setActiveAsset(assetId) {\n"""
asset_delete_functions = r"""function closeAssetContextMenu() {
  assetContextMenu.hidden = true;
  assetContextAssetId = null;
}

function openAssetContextMenu(assetId, clientX, clientY) {
  const asset = imageAssets.get(assetId);
  if (!asset) return;

  assetContextAssetId = assetId;
  assetContextMenu.querySelector('.module-context-title').textContent = `Görsel · ${asset.name}`;
  assetContextMenu.hidden = false;

  const margin = 8;
  const rect = assetContextMenu.getBoundingClientRect();
  const left = Math.max(margin, Math.min(clientX, window.innerWidth - rect.width - margin));
  const top = Math.max(margin, Math.min(clientY, window.innerHeight - rect.height - margin));
  assetContextMenu.style.left = `${left}px`;
  assetContextMenu.style.top = `${top}px`;
}

function getImageAssetUsageCount(assetId) {
  return countImageAssetReferences(currentModules, assetId)
    + countImageAssetReferences(currentStand, assetId);
}

async function requestDeleteImageAsset(assetId) {
  const asset = imageAssets.get(assetId);
  if (!asset) return false;

  const usageCount = getImageAssetUsageCount(assetId);
  const confirmed = window.confirm(
    usageCount > 0
      ? `"${asset.name}" şu anda sahnede bir veya daha fazla yere atanmış.\n\nBu görseli silersen atandığı panel/bezlerden de kaldırılacak.\n\nYine de silinsin mi?`
      : `"${asset.name}" görseli görsel kütüphanesinden kalıcı olarak silinecek.\n\nDevam edilsin mi?`,
  );
  if (!confirmed) return false;

  closeAssetContextMenu();

  if (usageCount > 0) {
    clearImageAssetReferences(currentModules, assetId);
    clearImageAssetReferences(currentStand, assetId);
    if (currentStand) rebuildWall({ resetView: false });
  }

  try {
    // Kayıtlı projede önce referansları kalıcılaştır; ardından blob'u sil.
    // Böylece proje hiçbir zaman silinmiş bir asset'e bilinçli olarak bağlı bırakılmaz.
    if (usageCount > 0 && autosaveEnabled) {
      clearAutosaveTimer();
      await persistActiveProject({ quiet: true });
      autosaveObservedSignature = getProjectStateSignature();
    }

    const deleted = await deleteImageAsset(activeProjectId, assetId);
    if (!deleted) throw new Error('Görsel kaydı bulunamadı veya bu projeye ait değil.');

    if (asset.url) URL.revokeObjectURL(asset.url);
    imageAssets.delete(assetId);

    if (activeAssetId === assetId) {
      activeAssetId = [...imageAssets.values()]
        .sort((a, b) => a.createdAt - b.createdAt)
        .at(-1)?.id ?? null;
    }
    renderAssetLibrary();
    assetStatus.textContent = usageCount > 0
      ? 'Görsel silindi · atandığı yerlerden de kaldırıldı.'
      : 'Görsel silindi.';
    return true;
  } catch (error) {
    console.warn('Görsel silinemedi:', error);
    assetStatus.textContent = `Görsel silinemedi: ${error?.message || 'Bilinmeyen hata.'}`;
    return false;
  }
}

"""
if main.count(register_anchor) != 1:
    raise SystemExit('setActiveAsset anchor not found exactly once')
main = main.replace(register_anchor, asset_delete_functions + register_anchor, 1)

old_tile = """      button.className = 'asset-tile';\n      button.classList.toggle('active', asset.id === activeAssetId);\n      button.title = asset.name;\n\n      const image = document.createElement('img');\n"""
new_tile = """      button.className = 'asset-tile';\n      button.classList.toggle('active', asset.id === activeAssetId);\n      button.dataset.assetId = asset.id;\n      button.title = asset.name;\n\n      const image = document.createElement('img');\n"""
if main.count(old_tile) != 1:
    raise SystemExit('asset tile creation anchor not found exactly once')
main = main.replace(old_tile, new_tile, 1)

old_tile_events = """      button.append(image, label);\n      button.addEventListener('click', () => setActiveAsset(asset.id));\n      assetLibraryElement.appendChild(button);\n"""
new_tile_events = """      button.append(image, label);\n      button.addEventListener('click', () => {\n        closeAssetContextMenu();\n        setActiveAsset(asset.id);\n      });\n      button.addEventListener('contextmenu', (event) => {\n        event.preventDefault();\n        event.stopPropagation();\n        setActiveAsset(asset.id);\n        button.focus({ preventScroll: true });\n        openAssetContextMenu(asset.id, event.clientX, event.clientY);\n      });\n      assetLibraryElement.appendChild(button);\n"""
if main.count(old_tile_events) != 1:
    raise SystemExit('asset tile event anchor not found exactly once')
main = main.replace(old_tile_events, new_tile_events, 1)

listener_anchor = """async function initializeAssetLibrary() {\n"""
listeners = r"""assetContextMenu.querySelector('[data-asset-action="delete"]').addEventListener('click', () => {
  const assetId = assetContextAssetId;
  closeAssetContextMenu();
  if (assetId) void requestDeleteImageAsset(assetId);
});

document.addEventListener('pointerdown', (event) => {
  if (!assetContextMenu.contains(event.target)) closeAssetContextMenu();

  if (!assetLibraryElement.contains(event.target)) {
    const focused = document.activeElement;
    if (focused?.classList?.contains('asset-tile')) focused.blur();
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !assetContextMenu.hidden) {
    closeAssetContextMenu();
    return;
  }
  if (event.key !== 'Delete') return;

  const focused = document.activeElement;
  if (!focused?.classList?.contains('asset-tile')) return;
  const assetId = focused.dataset.assetId;
  if (!assetId || assetId !== activeAssetId) return;

  // Sahnenin mevcut Delete-modül kısayolundan önce görsel silme niyetini tüket.
  event.preventDefault();
  event.stopImmediatePropagation();
  void requestDeleteImageAsset(assetId);
}, { capture: true });

"""
if main.count(listener_anchor) != 1:
    raise SystemExit('initializeAssetLibrary anchor not found exactly once')
main = main.replace(listener_anchor, listeners + listener_anchor, 1)
write_text(main_path, main, main_nl)


# 4) Regression tests.
test_source = r"""import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { clearImageAssetReferences, countImageAssetReferences } from '../src/imageAssetReferences.js';

test('image asset reference helper finds normal panel and fabric assignments', () => {
  const state = {
    modules: [
      { strips: [{ imageAssetId: 'asset-a' }, { imageAssetId: 'asset-b' }] },
      { strips: [{ fabricImageAssetId: 'asset-a', fabricImageFit: 'contain' }] },
    ],
  };
  assert.equal(countImageAssetReferences(state, 'asset-a'), 2);
  assert.equal(countImageAssetReferences(state, 'asset-b'), 1);
});

test('clearing one image asset removes only that asset assignments', () => {
  const state = {
    modules: [
      { strips: [{ imageAssetId: 'asset-a', imageTransform: { fit: 'cover' } }] },
      { strips: [{ imageAssetId: 'asset-b' }, { fabricImageAssetId: 'asset-a', fabricImageFit: 'contain' }] },
    ],
  };
  assert.equal(clearImageAssetReferences(state, 'asset-a'), 2);
  assert.equal(state.modules[0].strips[0].imageAssetId, null);
  assert.equal(state.modules[1].strips[0].imageAssetId, 'asset-b');
  assert.equal(state.modules[1].strips[1].fabricImageAssetId, null);
  assert.equal(state.modules[1].strips[1].fabricImageFit, 'cover');
});

test('image library exposes right-click and focused Delete through one safe delete path', () => {
  const main = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const store = fs.readFileSync(new URL('../src/assetStore.js', import.meta.url), 'utf8');

  assert.match(main, /button\.addEventListener\('contextmenu'/);
  assert.match(main, /openAssetContextMenu\(asset\.id, event\.clientX, event\.clientY\)/);
  assert.match(main, /if \(event\.key !== 'Delete'\) return;/);
  assert.match(main, /event\.stopImmediatePropagation\(\)/);
  assert.match(main, /void requestDeleteImageAsset\(assetId\)/);
  assert.match(main, /şu anda sahnede bir veya daha fazla yere atanmış/);
  assert.match(main, /silersen atandığı panel\/bezlerden de kaldırılacak/);
  assert.match(store, /export async function deleteImageAsset\(projectId, assetId\)/);
});
"""
Path('test/imageAssetDeletion.test.js').write_text(test_source, encoding='utf-8')

print('image library safe delete patch applied')
