import './style.css';
import { createStandScene } from './scene3d.js';
import { composeStraightWall } from './wall.js';
import {
  createFlatPanelModuleState,
  reconcileWallModules,
  totalWallWidthCm,
  moduleWidths,
} from './designState.js';
import { loadImageAssets, saveImageAsset } from './assetStore.js';

const viewport = document.querySelector('#viewport');
const wallLengthInput = document.querySelector('#wall-length');
const buildWallButton = document.querySelector('#build-wall');
const clearWallButton = document.querySelector('#clear-wall');
const wallResult = document.querySelector('#wall-result');
const selectionInfo = document.querySelector('#selection-info');
const colorInput = document.querySelector('#surface-color');
const applyColorButton = document.querySelector('#apply-color');
const imageInput = document.querySelector('#surface-image');
const applyImageButton = document.querySelector('#apply-image');
const clearTextureButton = document.querySelector('#clear-texture');
const assetLibraryElement = document.querySelector('#asset-library');
const assetStatus = document.querySelector('#asset-status');

let currentModules = [];
let activeAssetId = null;
const imageAssets = new Map();

function getAssetUrl(assetId) {
  return imageAssets.get(assetId)?.url ?? null;
}

const scene3d = createStandScene(
  viewport,
  (surfaces) => {
    if (!surfaces?.length) {
      selectionInfo.textContent = '3D sahnede bir yatay panele tıkla. Ctrl + tık ile çoklu seçebilirsin.';
      return;
    }

    if (surfaces.length === 1) {
      const surface = surfaces[0];
      const { moduleIndex, widthCm, stripNumber } = surface.userData;
      selectionInfo.textContent = `Modül ${moduleIndex + 1} · ${widthCm} cm · alttan ${stripNumber}. panel`;
      return;
    }

    selectionInfo.textContent = `${surfaces.length} panel seçili · Aynı sıradaki bitişik panellere tek görsel yatay yayılır.`;
  },
  getAssetUrl,
);

function renderWallResult(message, isError = false) {
  wallResult.textContent = message;
  wallResult.classList.toggle('error', isError);
}

function renderCurrentWallResult() {
  const total = totalWallWidthCm(currentModules);
  const widths = moduleWidths(currentModules);
  renderWallResult(
    currentModules.length
      ? `${total} cm = ${widths.join(' + ')} · ${currentModules.length} modül`
      : 'Duvar boş.',
  );
}

function rebuildWall() {
  scene3d.buildWall(currentModules);
  renderCurrentWallResult();
}

function buildAutomaticWall() {
  const lengthCm = Number(wallLengthInput.value);
  const result = composeStraightWall(lengthCm);

  if (!result.ok) {
    renderWallResult(result.message, true);
    return;
  }

  currentModules = reconcileWallModules(currentModules, result.modules);
  rebuildWall();
}

buildWallButton.addEventListener('click', buildAutomaticWall);
wallLengthInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') buildAutomaticWall();
});

document.querySelectorAll('[data-add-module]').forEach((button) => {
  button.addEventListener('click', () => {
    currentModules.push(createFlatPanelModuleState(Number(button.dataset.addModule)));
    rebuildWall();
  });
});

clearWallButton.addEventListener('click', () => {
  currentModules = [];
  scene3d.clearWall();
  renderWallResult('Duvar boş.');
});

applyColorButton.addEventListener('click', () => {
  const selected = scene3d.getSelectedSurfaces();
  if (!selected.length) {
    selectionInfo.textContent = 'Önce 3D sahnede boyamak istediğin panel veya panelleri seç.';
    return;
  }
  scene3d.applyColor(selected, colorInput.value);
});

// Renk seçici panel seçimine göre değişmez; kullanıcının son kullandığı renk araçta kalır.
colorInput.addEventListener('input', () => {
  const selected = scene3d.getSelectedSurfaces();
  if (selected.length) scene3d.applyColor(selected, colorInput.value);
});

function registerAsset(asset) {
  const previous = imageAssets.get(asset.id);
  if (previous?.url) URL.revokeObjectURL(previous.url);

  imageAssets.set(asset.id, {
    ...asset,
    url: URL.createObjectURL(asset.blob),
  });
}

function setActiveAsset(assetId) {
  activeAssetId = assetId;
  renderAssetLibrary();
  const asset = imageAssets.get(assetId);
  assetStatus.textContent = asset
    ? `Aktif görsel: ${asset.name}`
    : 'Görsel seçilmedi.';
}

function renderAssetLibrary() {
  assetLibraryElement.innerHTML = '';

  if (!imageAssets.size) {
    const empty = document.createElement('p');
    empty.className = 'asset-empty';
    empty.textContent = 'Henüz görsel yok. Bir kez yüklediğinde burada kalır.';
    assetLibraryElement.appendChild(empty);
    return;
  }

  [...imageAssets.values()]
    .sort((a, b) => a.createdAt - b.createdAt)
    .forEach((asset) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'asset-tile';
      button.classList.toggle('active', asset.id === activeAssetId);
      button.title = asset.name;

      const image = document.createElement('img');
      image.src = asset.url;
      image.alt = asset.name;

      const label = document.createElement('span');
      label.textContent = asset.name;

      button.append(image, label);
      button.addEventListener('click', () => setActiveAsset(asset.id));
      assetLibraryElement.appendChild(button);
    });
}

async function initializeAssetLibrary() {
  try {
    const assets = await loadImageAssets();
    assets.forEach(registerAsset);
    if (assets.length) activeAssetId = assets.at(-1).id;
    renderAssetLibrary();
    if (activeAssetId) setActiveAsset(activeAssetId);
  } catch (error) {
    console.warn('Görsel arşivi açılamadı:', error);
    assetStatus.textContent = 'Tarayıcı görsel arşivini açamadı.';
  }
}

function applyActiveImageToSelection() {
  const selected = scene3d.getSelectedSurfaces();
  if (!selected.length) {
    selectionInfo.textContent = 'Görsel uygulamak için önce bir panel veya panel grubu seç.';
    return false;
  }
  if (!activeAssetId) {
    assetStatus.textContent = 'Önce arşivden bir görsel seç veya yeni görsel yükle.';
    return false;
  }

  const result = scene3d.applyHorizontalImageAsset(selected, activeAssetId);
  if (!result.ok) {
    selectionInfo.textContent = result.message;
    return false;
  }

  if (result.mode === 'horizontal-group') {
    selectionInfo.textContent = `${result.panelCount} bitişik panele tek görsel yatay olarak ortalandı.`;
  }
  return true;
}

imageInput.addEventListener('change', async () => {
  const file = imageInput.files?.[0];
  imageInput.value = '';
  if (!file) return;

  try {
    const asset = await saveImageAsset(file);
    registerAsset(asset);
    setActiveAsset(asset.id);

    const selected = scene3d.getSelectedSurfaces();
    if (selected.length) applyActiveImageToSelection();
  } catch (error) {
    console.warn('Görsel kaydedilemedi:', error);
    assetStatus.textContent = 'Görsel arşive kaydedilemedi.';
  }
});

applyImageButton.addEventListener('click', applyActiveImageToSelection);

clearTextureButton.addEventListener('click', () => {
  const selected = scene3d.getSelectedSurfaces();
  if (!selected.length) {
    selectionInfo.textContent = 'Önce bir panel veya panel grubu seç.';
    return;
  }
  scene3d.clearImage(selected);
});

window.addEventListener('beforeunload', () => {
  imageAssets.forEach((asset) => {
    if (asset.url) URL.revokeObjectURL(asset.url);
  });
});

initializeAssetLibrary();
buildAutomaticWall();
