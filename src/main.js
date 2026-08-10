import './style.css';
import './colorEditor.css';
import './imageActions.css';
import { createStandScene } from './scene3d.js';
import { composeStraightWall } from './wall.js';
import {
  createFlatPanelModuleState,
  createSeparatorModuleState,
  createShowcaseModuleState,
  duplicateModuleState,
  totalWallWidthCm,
  moduleWidths,
} from './designState.js';
import { loadImageAssets, saveImageAsset } from './assetStore.js';
import { describeRectSelection } from './rectSelection.js';
import { createModuleContextMenu } from './moduleContextMenu.js';
import {
  colorValuesFromHex,
  cmykToRgb,
  rgbToHex,
} from './colorUtils.js';
import { STAND_TYPE_LABELS, validateStandSetup } from './standSetup.js';

const viewport = document.querySelector('#viewport');
const viewportEmpty = document.querySelector('#viewport-empty');
const viewportToolbar = document.querySelector('#viewport-toolbar');
const standTypeButtons = [...document.querySelectorAll('[data-stand-type]')];
const standSizeXInput = document.querySelector('#stand-size-x');
const standSizeYInput = document.querySelector('#stand-size-y');
const createStageButton = document.querySelector('#create-stage');
const stageResult = document.querySelector('#stage-result');
const wallLengthInput = document.querySelector('#wall-length');
const buildWallButton = document.querySelector('#build-wall');
const openModuleCatalogButton = document.querySelector('#open-module-catalog');
const clearWallButton = document.querySelector('#clear-wall');
const wallResult = document.querySelector('#wall-result');
const selectionInfo = document.querySelector('#selection-info');
const colorInput = document.querySelector('#surface-color');
const applyColorButton = document.querySelector('#apply-color');
const colorHexInput = document.querySelector('#color-hex');
const colorRgbInputs = {
  r: document.querySelector('#color-r'),
  g: document.querySelector('#color-g'),
  b: document.querySelector('#color-b'),
};
const colorCmykInputs = {
  c: document.querySelector('#color-c'),
  m: document.querySelector('#color-m'),
  y: document.querySelector('#color-y'),
  k: document.querySelector('#color-k'),
};
const imageInput = document.querySelector('#surface-image');
const fillImageButton = document.querySelector('#fit-image-cover');
const fitImageButton = document.querySelector('#fit-image-contain');
const clearTextureButton = document.querySelector('#clear-texture');
const resetModuleFeaturesButton = document.querySelector('#reset-module-features');
const assetLibraryElement = document.querySelector('#asset-library');
const assetStatus = document.querySelector('#asset-status');

let currentModules = [];
let currentStand = null;
let selectedStandType = null;
let activeAssetId = null;
const imageAssets = new Map();

function getAssetUrl(assetId) {
  return imageAssets.get(assetId)?.url ?? null;
}

const scene3d = createStandScene(
  viewport,
  (surfaces) => {
    if (!surfaces?.length) {
      selectionInfo.textContent = 'Bir panel seç; Ctrl/Cmd + tık ile karşı köşeyi seçip dikdörtgen blok oluştur.';
      return;
    }

    if (surfaces.length === 1) {
      const surface = surfaces[0];
      const { moduleIndex, widthCm, stripNumber, moduleType } = surface.userData;

      if (moduleType === 'separator') {
        selectionInfo.textContent = `Modül ${moduleIndex + 1} · Separatör ${widthCm} cm · yalnızca renk uygulanabilir.`;
        return;
      }

      if (moduleType === 'showcase-3' || moduleType === 'showcase-2') {
        const eyeCount = moduleType === 'showcase-3' ? 3 : 2;
        selectionInfo.textContent = `Modül ${moduleIndex + 1} · ${eyeCount} Gözlü Vitrin ${widthCm} cm · alttan ${stripNumber}. panel · renk + görsel uygulanabilir.`;
        return;
      }

      selectionInfo.textContent = `Modül ${moduleIndex + 1} · ${widthCm} cm · alttan ${stripNumber}. panel · Ctrl/Cmd + tık ile blok seç.`;
      return;
    }

    const shape = describeRectSelection(
      surfaces.map((surface) => ({
        moduleIndex: surface.userData.moduleIndex,
        stripIndex: surface.userData.stripIndex,
      })),
    );

    selectionInfo.textContent = `${shape.columnCount} × ${shape.rowCount} blok · ${shape.panelCount} panel seçili.`;
  },
  getAssetUrl,
  (context) => moduleContextMenu.open(context),
);

function renderStageResult(message, isError = false) {
  stageResult.textContent = message;
  stageResult.classList.toggle('error', isError);
}

function renderWallResult(message, isError = false) {
  wallResult.textContent = message;
  wallResult.classList.toggle('error', isError);
}

function setStandEditingEnabled(enabled) {
  wallLengthInput.disabled = !enabled;
  buildWallButton.disabled = !enabled;
  openModuleCatalogButton.disabled = !enabled;
  clearWallButton.disabled = !enabled;
}

function readStandSetup() {
  return validateStandSetup({
    standType: selectedStandType,
    xCm: standSizeXInput.value,
    yCm: standSizeYInput.value,
  });
}

function updateStageCreateState() {
  const result = readStandSetup();
  createStageButton.disabled = !result.ok;

  if (result.ok) {
    if (!currentStand) renderStageResult('Stand alanı hazır. Sahneyi oluşturabilirsin.');
    return;
  }

  const xHasValue = standSizeXInput.value.trim() !== '';
  const yHasValue = standSizeYInput.value.trim() !== '';
  if (selectedStandType && xHasValue && yHasValue) {
    renderStageResult(result.message, true);
  } else if (!currentStand) {
    renderStageResult('Stand tipi ile X ve Y ölçülerinin üçü de tamamlanmadan sahne oluşmaz.');
  }
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

function rebuildWall({ resetView = true } = {}) {
  if (!currentStand) {
    renderWallResult('Önce stand alanını oluştur.', true);
    return;
  }
  scene3d.buildWall(currentModules, { resetView });
  renderCurrentWallResult();
}

function findContextModuleIndex(context) {
  if (!context) return -1;
  const byId = currentModules.findIndex((module) => module.id === context.moduleId);
  if (byId >= 0) return byId;
  return Number.isInteger(context.moduleIndex) ? context.moduleIndex : -1;
}

function deleteContextModule(context) {
  const index = findContextModuleIndex(context);
  if (index < 0 || index >= currentModules.length) return;

  const module = currentModules[index];
  const confirmed = window.confirm(
    `Modül ${index + 1} · ${module.widthCm} cm silinecek. Bu modüldeki renk ve görsel düzenlemeleri de kaybolacak. Devam edilsin mi?`,
  );
  if (!confirmed) return;

  currentModules.splice(index, 1);
  rebuildWall({ resetView: false });
}

function duplicateContextModule(context, side) {
  const index = findContextModuleIndex(context);
  if (index < 0 || index >= currentModules.length) return;

  const duplicate = duplicateModuleState(currentModules[index]);
  if (!duplicate) return;

  const insertIndex = side === 'left' ? index : index + 1;
  currentModules.splice(insertIndex, 0, duplicate);
  rebuildWall({ resetView: false });
}

function createCatalogModuleState(module) {
  if (!module) return null;
  if (module.type === 'flat-panel') return createFlatPanelModuleState(module.widthCm);
  if (module.type === 'separator') return createSeparatorModuleState(module.widthCm);
  if (module.type === 'showcase-2' || module.type === 'showcase-3') {
    return createShowcaseModuleState(module.type, module.widthCm);
  }
  return null;
}

function addCatalogModule({ module, placement = 'append', context = null }) {
  if (!currentStand) return;
  const moduleState = createCatalogModuleState(module);
  if (!moduleState) return;

  let insertIndex = currentModules.length;
  if (placement === 'left' || placement === 'right') {
    const contextIndex = findContextModuleIndex(context);
    if (contextIndex < 0 || contextIndex >= currentModules.length) return;
    insertIndex = placement === 'left' ? contextIndex : contextIndex + 1;
  }

  currentModules.splice(insertIndex, 0, moduleState);
  rebuildWall({ resetView: false });
}

function changeContextPanelGlassMode(context, isGlass) {
  if (!context?.supportsGlass) return;

  const selectedPanels = scene3d.getSelectedSurfaces().filter(
    (surface) => surface.userData.selectionMode === 'panel',
  );
  if (!selectedPanels.length) return;

  scene3d.applyGlassMode(selectedPanels, isGlass);
  const panelCount = selectedPanels.length;
  selectionInfo.textContent = isGlass
    ? `${panelCount} panel cam panele çevrildi.`
    : `${panelCount} panel normal panele çevrildi.`;
}

const moduleContextMenu = createModuleContextMenu({
  onDelete: deleteContextModule,
  onDuplicate: duplicateContextModule,
  onAdd: addCatalogModule,
  onGlassModeChange: changeContextPanelGlassMode,
});

standTypeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedStandType = button.dataset.standType;
    standTypeButtons.forEach((candidate) => {
      candidate.setAttribute('aria-pressed', String(candidate === button));
    });
    updateStageCreateState();
  });
});

[standSizeXInput, standSizeYInput].forEach((input) => {
  input.addEventListener('input', updateStageCreateState);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !createStageButton.disabled) createStageButton.click();
  });
});

createStageButton.addEventListener('click', () => {
  const setup = readStandSetup();
  if (!setup.ok) {
    renderStageResult(setup.message, true);
    return;
  }

  if (currentModules.length) {
    const confirmed = window.confirm(
      'Stand alanı yeniden oluşturulursa mevcut duvar, panel renkleri, görselleri ve düzenlemeleri silinecek. Devam edilsin mi?',
    );
    if (!confirmed) return;
  }

  currentModules = [];
  moduleContextMenu.close();
  moduleContextMenu.closePicker();

  const stage = scene3d.createStage({
    widthCm: setup.xCm,
    depthCm: setup.yCm,
    standType: setup.standType,
    resetView: true,
  });
  if (!stage.ok) {
    renderStageResult(stage.message, true);
    return;
  }

  currentStand = setup;
  viewportEmpty.hidden = true;
  viewportToolbar.hidden = false;
  setStandEditingEnabled(true);
  renderWallResult('Duvar boş.');

  const label = STAND_TYPE_LABELS[setup.standType];
  renderStageResult(
    `${label} · ${setup.xCm} × ${setup.yCm} cm aktif alan · ${setup.sceneWidthM} × ${setup.sceneDepthM} m toplam sahne`,
  );
});

openModuleCatalogButton.addEventListener('click', () => {
  if (!currentStand) return;
  moduleContextMenu.openPicker({ placement: 'append' });
});

function confirmExistingScene(message) {
  if (!currentModules.length) return true;
  return window.confirm(message);
}

function buildAutomaticWall() {
  if (!currentStand) {
    renderWallResult('Önce stand tipini ve X / Y ölçülerini girerek sahneyi oluştur.', true);
    return;
  }

  const lengthCm = Number(wallLengthInput.value);
  const result = composeStraightWall(lengthCm);

  if (!result.ok) {
    renderWallResult(result.message, true);
    return;
  }

  const confirmed = confirmExistingScene(
    'Sahnede mevcut bir duvar var. Yeni duvar oluşturulursa mevcut panel renkleri, görselleri ve düzenlemeleri silinecek. Devam edilsin mi?',
  );
  if (!confirmed) return;

  currentModules = result.modules.map((widthCm) => createFlatPanelModuleState(widthCm));
  moduleContextMenu.close();
  moduleContextMenu.closePicker();
  rebuildWall({ resetView: true });
}

buildWallButton.addEventListener('click', buildAutomaticWall);
wallLengthInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') buildAutomaticWall();
});

clearWallButton.addEventListener('click', () => {
  if (!currentStand) {
    renderWallResult('Önce stand alanını oluştur.', true);
    return;
  }

  if (!currentModules.length) {
    renderWallResult('Duvar zaten boş.');
    return;
  }

  const confirmed = window.confirm(
    'Sahnedeki mevcut duvar, panel renkleri ve görseller silinecek. Duvar temizlensin mi?',
  );
  if (!confirmed) return;

  currentModules = [];
  moduleContextMenu.close();
  moduleContextMenu.closePicker();
  scene3d.clearWall({ resetView: true });
  renderWallResult('Duvar boş.');
});

resetModuleFeaturesButton.addEventListener('click', () => {
  if (!currentModules.length) {
    renderWallResult('Sıfırlanacak modül yok.');
    return;
  }

  const confirmed = window.confirm(
    'Tüm modüller varsayılan ayarlarına dönecektir. Onaylıyor musunuz?\n\n'
      + 'Kaldırılacak özellikler:\n'
      + '• Atanan resimler\n'
      + '• Atanan cam özellikleri\n'
      + '• Atanan renkler\n'
      + '• Diğer panel özelleştirmeleri\n\n'
      + 'Modül türleri, genişlikleri ve sıraları korunacaktır.',
  );
  if (!confirmed) return;

  const resetModules = currentModules.map((module) => createCatalogModuleState(module));
  if (resetModules.some((module) => !module)) {
    selectionInfo.textContent = 'Bazı modül türleri varsayılan ayarlarına döndürülemedi.';
    return;
  }

  currentModules = resetModules;
  moduleContextMenu.close();
  moduleContextMenu.closePicker();
  rebuildWall({ resetView: false });
  syncColorEditorFromHex('#ffffff');
  selectionInfo.textContent = 'Tüm modüller varsayılan ayarlarına döndürüldü. Modül dizilimi korundu.';
});

function applyActiveColorToSelection({ showMissingSelection = false } = {}) {
  const selected = scene3d.getSelectedSurfaces();
  if (!selected.length) {
    if (showMissingSelection) {
      selectionInfo.textContent = 'Önce 3D sahnede boyamak istediğin panel, panel bloğu veya modülü seç.';
    }
    return false;
  }

  scene3d.applyColor(selected, colorInput.value);
  return true;
}

function syncColorEditorFromHex(hex, { apply = false } = {}) {
  const values = colorValuesFromHex(hex);
  if (!values) return false;

  colorInput.value = values.hex;
  colorHexInput.value = values.hex;
  colorRgbInputs.r.value = String(values.rgb.r);
  colorRgbInputs.g.value = String(values.rgb.g);
  colorRgbInputs.b.value = String(values.rgb.b);
  colorCmykInputs.c.value = String(values.cmyk.c);
  colorCmykInputs.m.value = String(values.cmyk.m);
  colorCmykInputs.y.value = String(values.cmyk.y);
  colorCmykInputs.k.value = String(values.cmyk.k);

  if (apply) applyActiveColorToSelection();
  return true;
}

function readNumberGroup(inputs) {
  const values = {};
  for (const [key, input] of Object.entries(inputs)) {
    if (input.value.trim() === '') return null;
    const value = Number(input.value);
    if (!Number.isFinite(value)) return null;
    values[key] = value;
  }
  return values;
}

function syncFromRgbInputs() {
  const rgb = readNumberGroup(colorRgbInputs);
  if (!rgb) return;
  syncColorEditorFromHex(rgbToHex(rgb.r, rgb.g, rgb.b), { apply: true });
}

function syncFromCmykInputs() {
  const cmyk = readNumberGroup(colorCmykInputs);
  if (!cmyk) return;

  const normalizedCmyk = Object.fromEntries(
    Object.entries(cmyk).map(([key, value]) => [
      key,
      Math.min(100, Math.max(0, Math.round(value))),
    ]),
  );
  Object.entries(normalizedCmyk).forEach(([key, value]) => {
    colorCmykInputs[key].value = String(value);
  });

  const rgb = cmykToRgb(
    normalizedCmyk.c,
    normalizedCmyk.m,
    normalizedCmyk.y,
    normalizedCmyk.k,
  );
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  colorInput.value = hex;
  colorHexInput.value = hex;
  colorRgbInputs.r.value = String(rgb.r);
  colorRgbInputs.g.value = String(rgb.g);
  colorRgbInputs.b.value = String(rgb.b);
  applyActiveColorToSelection();
}

applyColorButton.addEventListener('click', () => {
  applyActiveColorToSelection({ showMissingSelection: true });
});

colorInput.addEventListener('input', () => {
  syncColorEditorFromHex(colorInput.value, { apply: true });
});

colorHexInput.addEventListener('input', () => {
  const raw = colorHexInput.value.trim();
  if (!/^#?[0-9a-fA-F]{6}$/.test(raw)) return;
  syncColorEditorFromHex(raw, { apply: true });
});

colorHexInput.addEventListener('change', () => {
  if (!syncColorEditorFromHex(colorHexInput.value, { apply: true })) {
    syncColorEditorFromHex(colorInput.value);
  }
});

Object.values(colorRgbInputs).forEach((input) => {
  input.addEventListener('input', syncFromRgbInputs);
});

Object.values(colorCmykInputs).forEach((input) => {
  input.addEventListener('input', syncFromCmykInputs);
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

function applyActiveImageToSelection(fit = 'cover') {
  const selected = scene3d.getSelectedSurfaces();
  if (!selected.length) {
    selectionInfo.textContent = 'Görsel uygulamak için önce bir panel veya panel bloğu seç.';
    return false;
  }
  if (!activeAssetId) {
    assetStatus.textContent = 'Önce arşivden bir görsel seç veya yeni görsel yükle.';
    return false;
  }

  const result = scene3d.applyRectImageAsset(selected, activeAssetId, fit);
  if (!result.ok) {
    selectionInfo.textContent = result.message;
    return false;
  }

  const fitLabel = fit === 'cover' ? 'Doldur' : 'Sığdır';
  if (result.mode === 'rect-group') {
    selectionInfo.textContent = `${result.columnCount} × ${result.rowCount} blokta ${result.panelCount} panele görsel · ${fitLabel}.`;
  } else {
    selectionInfo.textContent = `Görsel seçili panele uygulandı · ${fitLabel}.`;
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
    if (selected.length) applyActiveImageToSelection('cover');
  } catch (error) {
    console.warn('Görsel kaydedilemedi:', error);
    assetStatus.textContent = 'Görsel arşive kaydedilemedi.';
  }
});

fillImageButton.addEventListener('click', () => {
  applyActiveImageToSelection('cover');
});

fitImageButton.addEventListener('click', () => {
  applyActiveImageToSelection('contain');
});

clearTextureButton.addEventListener('click', () => {
  const selected = scene3d.getSelectedSurfaces();
  if (!selected.length) {
    selectionInfo.textContent = 'Önce bir panel veya panel bloğu seç.';
    return;
  }
  scene3d.clearImage(selected);
  selectionInfo.textContent = 'Seçili panel veya panel bloğundaki görsel kaldırıldı.';
});

window.addEventListener('beforeunload', () => {
  imageAssets.forEach((asset) => {
    if (asset.url) URL.revokeObjectURL(asset.url);
  });
});

setStandEditingEnabled(false);
updateStageCreateState();
syncColorEditorFromHex(colorInput.value);
initializeAssetLibrary();
