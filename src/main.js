import './style.css';
import './colorEditor.css';
import './imageActions.css';
import JSZip from 'jszip';
import { createStandScene } from './scene3d.js';
import {
  composeAutomaticStandWall,
  getAutomaticWallCapacityCm,
} from './automaticWall.js';
import {
  createBarStoolModuleState,
  createLedFloodlightModuleState,
  createBaseModuleState,
  createCounterModuleState,
  createDoorModuleState,
  createFlatPanelModuleState,
  createSeparatorModuleState,
  createShelfModuleState,
  createSofaSetModuleState,
  createTableChairSetModuleState,
  createShowcaseModuleState,
  duplicateModuleState,
  totalWallWidthCm,
  moduleWidths,
} from './designState.js';
import { deleteProjectImageAssets, loadImageAssets, saveImageAsset, saveImportedImageAsset } from './assetStore.js';
import { createProjectId, deleteProject, listProjects, loadProject, saveProject } from './projectStore.js';
import { describeRectSelection } from './rectSelection.js';
import { createModuleContextMenu } from './moduleContextMenu.js';
import { createModuleDragSidebar } from './moduleDragSidebar.js';
import {
  colorValuesFromHex,
  cmykToRgb,
  rgbToHex,
} from './colorUtils.js';
import { STAND_TYPE_LABELS, validateStandSetup } from './standSetup.js';
import { validateStandAxisCapacity } from './standCapacity.js';
import {
  createModulePlacement,
  getWallAxis,
  getWallExtentCm,
  getWallUsedCm,
  planFreeSideInsertion,
  validatePlacementAgainstModules,
} from './modulePlacement.js';
import { planContinuousWallInsertion } from './wallReflow.js';

const viewport = document.querySelector('#viewport');
const viewportEmpty = document.querySelector('#viewport-empty');
const viewportToolbar = document.querySelector('#viewport-toolbar');
const renderCurrentViewButton = document.querySelector('#render-current-view');
const standTypeButtons = [...document.querySelectorAll('[data-stand-type]')];
const standSizeXInput = document.querySelector('#stand-size-x');
const standSizeYInput = document.querySelector('#stand-size-y');
const createStageButton = document.querySelector('#create-stage');
const floorTypeSelect = document.querySelector('#floor-type');
const stageResult = document.querySelector('#stage-result');
const openModuleCatalogButton = document.querySelector('#open-module-catalog');
const clearWallButton = document.querySelector('#clear-wall');
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
const projectNameInput = document.querySelector('#project-name');
const projectSelect = document.querySelector('#project-select');
const newProjectButton = document.querySelector('#new-project');
const saveProjectButton = document.querySelector('#save-project');
const openProjectButton = document.querySelector('#open-project');
const exportProjectButton = document.querySelector('#export-project');
const importProjectButton = document.querySelector('#import-project');
const importProjectFileInput = document.querySelector('#import-project-file');
const deleteProjectButton = document.querySelector('#delete-project');
const projectStatus = document.querySelector('#project-status');
const projectLoadingOverlay = document.querySelector('#project-loading-overlay');

const WALL_LABELS = Object.freeze({
  back: 'Sırt',
  left: 'Sol',
  right: 'Sağ',
  free: 'Serbest',
});

let currentModules = [];
let currentStand = null;
let selectedStandType = null;
let activeAssetId = null;
let pendingCatalogAdds = [];
let catalogAddFlushScheduled = false;
let moduleDragSidebar = null;
let activeProjectId = createProjectId();
let activeProjectCreatedAt = Date.now();
let autosaveEnabled = false;
let autosaveTimer = null;
let autosaveObservedSignature = null;
const AUTOSAVE_DELAY_MS = 5000;
const AUTOSAVE_WATCH_INTERVAL_MS = 1000;
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

      if (moduleType === 'counter') {
        const faceLabel = surface.userData.surfaceRole === 'front'
          ? 'ön'
          : (surface.userData.surfaceRole === 'left' ? 'sol yan' : 'sağ yan');
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Banko ' + widthCm + ' cm · ' + faceLabel + ' cephe · renk + görsel uygulanabilir.';
        return;
      }

      if (moduleType === 'base') {
        const faceLabel = surface.userData.surfaceRole === 'front'
          ? 'ön'
          : (surface.userData.surfaceRole === 'left' ? 'sol yan' : 'sağ yan');
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Baza ' + widthCm + ' cm · ' + faceLabel + ' panel · renk + görsel uygulanabilir.';
        return;
      }

      if (moduleType === 'separator') {
        selectionInfo.textContent = `Modül ${moduleIndex + 1} · Separatör ${widthCm} cm · yalnızca renk uygulanabilir.`;
        return;
      }

      if (moduleType === 'door') {
        selectionInfo.textContent = surface.userData.surfaceRole === 'door'
          ? `Modül ${moduleIndex + 1} · Kapı ${widthCm} cm · kapı yüzeyi · renk + görsel uygulanabilir.`
          : `Modül ${moduleIndex + 1} · Kapı ${widthCm} cm · üst ${stripNumber}. panel · renk + görsel uygulanabilir.`;
        return;
      }

      if (moduleType === 'showcase-3' || moduleType === 'showcase-2') {
        const eyeCount = moduleType === 'showcase-3' ? 3 : 2;
        selectionInfo.textContent = `Modül ${moduleIndex + 1} · ${eyeCount} Gözlü Vitrin ${widthCm} cm · alttan ${stripNumber}. panel · renk + görsel uygulanabilir.`;
        return;
      }

      if (moduleType === 'shelf') {
        const shelfCount = Number(surface.userData.shelfCount) || 2;
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Raf ' + widthCm + ' cm · ' + shelfCount + ' raflı · alttan ' + stripNumber + '. panel · renk + görsel uygulanabilir.';
        return;
      }

      if (moduleType === 'sofa-set') {
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Koltuk Takımı · koltuk döşeme rengi değiştirilebilir · cam sehpa sabittir.';
        return;
      }

      if (moduleType === 'led-floodlight') {
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · LED Projektör · 350 cm üst profile bağlı aydınlatma.';
        return;
      }

      selectionInfo.textContent = `Modül ${moduleIndex + 1} · ${widthCm} cm · alttan ${stripNumber}. panel · Ctrl/Cmd + tık ile blok seç.`;
      return;
    }

    const allCounterPanels = surfaces.every(
      (surface) => surface.userData.moduleType === 'counter',
    );
    if (allCounterPanels) {
      const widthCm = surfaces[0]?.userData.widthCm ?? '';
      selectionInfo.textContent = `Banko ${widthCm} cm · ${surfaces.length} panel seçili · renk + görsel toplu uygulanabilir.`;
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
  ({ selected, floorType, paintable }) => {
    if (!selected) return;
    const label = floorType === 'karolaj' ? 'Karolaj' : (floorType === 'hali' ? 'Halı' : 'Parke');
    selectionInfo.textContent = paintable
      ? label + ' zemini seçili · mevcut Aktif renk ile boyanabilir.'
      : label + ' zemini seçili · bu zemin tipi boyanamaz.';
  },
);

function renderStageResult(message, isError = false) {
  stageResult.textContent = message;
  stageResult.classList.toggle('error', isError);
}

function renderWallResult(message, isError = false) {
  if (isError) console.warn(message);
}

function setStandEditingEnabled(enabled) {
  openModuleCatalogButton.disabled = !enabled;
  clearWallButton.disabled = !enabled;
  moduleDragSidebar?.setEnabled(Boolean(enabled && currentStand));
}

function readStandSetup() {
  return validateStandSetup({
    standType: selectedStandType,
    xCm: standSizeXInput.value,
    yCm: standSizeYInput.value,
  });
}

function syncWallLengthFromSetup(setup) {
  if (!setup?.ok) return;

  const capacityCm = getAutomaticWallCapacityCm({
    standType: setup.standType,
    standXCm: setup.xCm,
    standYCm: setup.yCm,
  });
  if (!Number.isFinite(capacityCm)) return;

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
  const activeWalls = ['back', 'left', 'right', 'free']
    .map((wallId) => ({ wallId, usedCm: getWallUsedCm(currentModules, wallId) }))
    .filter((wall) => wall.usedCm > 0);

  if (!currentModules.length) {
    renderWallResult('Duvar boş.');
    return;
  }

  if (activeWalls.length <= 1 && (activeWalls[0]?.wallId ?? 'back') === 'back') {
    renderWallResult(`${total} cm = ${widths.join(' + ')} · ${currentModules.length} modül`);
    return;
  }

  const wallSummary = activeWalls
    .map(({ wallId, usedCm }) => `${WALL_LABELS[wallId] ?? wallId}: ${usedCm} cm`)
    .join(' · ');
  renderWallResult(`${currentModules.length} modül · ${wallSummary}`);
}

function formatCapacityPopup(result, title) {
  const axis = result.axis?.toUpperCase() ?? '';
  return `${title}\n\n`
    + `${axis} stand sınırı: ${result.limitCm} cm\n`
    + `Mevcut toplam: ${result.currentCm} cm\n`
    + `Eklenmek istenen: ${result.addedCm} cm\n`
    + `Oluşacak toplam: ${result.projectedCm} cm\n\n`
    + 'Aktif stand alanı aşılamaz.';
}

function defaultCurrentCapacityCm(axis) {
  if (axis === 'x') return getWallUsedCm(currentModules, 'back');
  return Math.max(
    getWallUsedCm(currentModules, 'left'),
    getWallUsedCm(currentModules, 'right'),
  );
}

function validateCurrentAxisCapacity(
  axis,
  addedCm,
  currentCm = defaultCurrentCapacityCm(axis),
  { popupTitle = null } = {},
) {
  const result = validateStandAxisCapacity({
    axis,
    currentCm,
    addedCm,
    xCm: currentStand?.xCm,
    yCm: currentStand?.yCm,
  });

  if (!result.ok) {
    renderWallResult(result.message, true);
    if (popupTitle && Number.isFinite(result.projectedCm)) {
      window.alert(formatCapacityPopup(result, popupTitle));
    }
  }
  return result;
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

window.addEventListener('fair-stand:delete-selected-module', (event) => {
  const detail = event?.detail;
  if (!detail?.moduleId && !Number.isInteger(detail?.moduleIndex)) return;
  deleteContextModule(detail);
});

function normalizeContinuousSide(context, side) {
  if (side !== 'left' && side !== 'right') return side;
  const wallId = context?.placement?.wallId ?? 'back';
  if (wallId !== 'left') return side;
  return side === 'left' ? 'right' : 'left';
}

function planContextContinuousInsertion(insertedModules, context, side) {
  if (!currentStand) return { ok: false, message: 'Önce stand alanını oluştur.' };
  const index = findContextModuleIndex(context);
  if (index < 0 || index >= currentModules.length) {
    return { ok: false, message: 'Hedef modül bulunamadı.' };
  }

  const sourceModule = currentModules[index];
  if (!sourceModule?.placement) {
    return { ok: false, message: 'Hedef modülün yerleşim bilgisi bulunamadı.' };
  }

  return planContinuousWallInsertion({
    modules: currentModules,
    insertedModules,
    targetModuleId: sourceModule.id,
    side: normalizeContinuousSide(context, side),
    standType: currentStand.standType,
    standXCm: currentStand.xCm,
    standYCm: currentStand.yCm,
  });
}

function planContextFreeInsertion(insertedModules, context, side) {
  if (!currentStand) return { ok: false, message: 'Önce stand alanını oluştur.' };
  const index = findContextModuleIndex(context);
  if (index < 0 || index >= currentModules.length) {
    return { ok: false, message: 'Hedef modül bulunamadı.' };
  }

  const sourceModule = currentModules[index];
  return planFreeSideInsertion({
    modules: currentModules,
    insertedModules,
    targetModuleId: sourceModule.id,
    side,
    standType: currentStand.standType,
    standXCm: currentStand.xCm,
    standYCm: currentStand.yCm,
  });
}

function applyFreeInsertionPlan(plan, insertedModules, context, side) {
  const index = findContextModuleIndex(context);
  if (index < 0 || index >= currentModules.length) return false;

  plan.placements?.forEach((nextPlacement, moduleId) => {
    const module = insertedModules.find((candidate) => candidate.id === moduleId);
    if (module) module.placement = { ...nextPlacement };
  });

  const insertIndex = side === 'left' ? index : index + 1;
  currentModules.splice(insertIndex, 0, ...insertedModules);
  return true;
}

function isFreeContextInsertion(context) {
  const index = findContextModuleIndex(context);
  return index >= 0 && currentModules[index]?.placement?.wallId === 'free';
}

function applyContinuousInsertionPlan(plan, insertedModules) {
  const moduleMap = new Map(
    [...currentModules, ...insertedModules].map((module) => [module.id, module]),
  );

  plan.placements?.forEach((placement, moduleId) => {
    const module = moduleMap.get(moduleId);
    if (module) module.placement = { ...placement };
  });

  currentModules = (plan.orderedModuleIds ?? [])
    .map((moduleId) => moduleMap.get(moduleId))
    .filter(Boolean);
}

function duplicateContextModule(context, side) {
  const index = findContextModuleIndex(context);
  if (index < 0 || index >= currentModules.length) return;

  const sourceModule = currentModules[index];
  const duplicate = duplicateModuleState(sourceModule);
  if (!duplicate) return;

  if (sourceModule.type === 'led-floodlight' && sourceModule.placement) {
    const sourcePlacement = sourceModule.placement;
    const placement = { ...sourcePlacement, zCm: 350 };
    const deltaCm = side === 'left' ? -20 : 20;
    const widthCm = Number(duplicate.widthCm) || 50;

    if (sourcePlacement.wallId === 'back') {
      placement.xCm = Math.min(
        Math.max(0, Number(currentStand?.xCm) - widthCm),
        Math.max(0, Number(sourcePlacement.xCm) + deltaCm),
      );
      placement.yCm = 0;
    } else if (sourcePlacement.wallId === 'left' || sourcePlacement.wallId === 'right') {
      placement.yCm = Math.min(
        Math.max(0, Number(currentStand?.yCm) - widthCm),
        Math.max(0, Number(sourcePlacement.yCm) + deltaCm),
      );
      placement.xCm = sourcePlacement.wallId === 'right' ? Number(currentStand?.xCm) : 0;
    }

    duplicate.placement = placement;
    currentModules.push(duplicate);
    rebuildWall({ resetView: false });
    return;
  }

  if (sourceModule.placement && sourceModule.placement.wallId !== 'free') {
    const plan = planContextContinuousInsertion([duplicate], context, side);
    if (!plan.ok) {
      renderWallResult(plan.message, true);
      window.alert(`Modül çoğaltılamadı\n\n${plan.message}`);
      return;
    }

    applyContinuousInsertionPlan(plan, [duplicate]);
    rebuildWall({ resetView: false });
    return;
  }

  const plan = planContextFreeInsertion([duplicate], context, side);
  if (!plan.ok) {
    renderWallResult(plan.message, true);
    window.alert(`Modül çoğaltılamadı\n\n${plan.message}`);
    return;
  }

  applyFreeInsertionPlan(plan, [duplicate], context, side);
  rebuildWall({ resetView: false });
}

function createCatalogModuleState(module, { preservePlacement = false } = {}) {
  if (!module) return null;

  let state = null;
  if (module.type === 'flat-panel') state = createFlatPanelModuleState(module.widthCm);
  else if (module.type === 'base') state = createBaseModuleState(module.widthCm);
  else if (module.type === 'counter') state = createCounterModuleState(module.widthCm);
  else if (module.type === 'separator') state = createSeparatorModuleState(module.widthCm);
  else if (module.type === 'shelf') state = createShelfModuleState(module.widthCm, module.shelfCount);
  else if (module.type === 'sofa-set') state = createSofaSetModuleState();
  else if (module.type === 'table-chair-set') state = createTableChairSetModuleState();
  else if (module.type === 'bar-stool') state = createBarStoolModuleState();
  else if (module.type === 'led-floodlight') state = createLedFloodlightModuleState();
  else if (module.type === 'door') state = createDoorModuleState(module.widthCm);
  else if (module.type === 'showcase-2' || module.type === 'showcase-3') {
    state = createShowcaseModuleState(module.type, module.widthCm);
  }

  if (state && preservePlacement && module.placement) {
    state.placement = { ...module.placement };
  }
  return state;
}

function getRequestWallId({ context = null } = {}) {
  return context?.placement?.wallId ?? 'back';
}

function validateCatalogAddBatch({
  entries = [],
  context = null,
  placement = 'append',
} = {}) {
  if (placement === 'append' || !context) {
    const addedCm = entries.reduce(
      (sum, entry) => sum + (Number(entry.module?.widthCm) || 0),
      0,
    );
    const wallId = getRequestWallId({ context });
    const axis = getWallAxis(wallId);
    if (!axis) return { ok: true };

    return validateCurrentAxisCapacity(
      axis,
      addedCm,
      getWallUsedCm(currentModules, wallId),
      { popupTitle: 'Modüller eklenemedi' },
    );
  }

  let moduleStates = entries.map((entry) => createCatalogModuleState(entry.module));
  if (moduleStates.some((moduleState) => !moduleState)) {
    return { ok: false, message: 'Seçilen modüller hazırlanamadı.' };
  }

  if ((placement === 'left' || placement === 'right') && isFreeContextInsertion(context)) {
    // Picker sağ eklemede gönderim sırasını ters çevirir; burada tekrar görsel
    // seçim sırasına döndürüp serbest komşu planına veriyoruz.
    const visualOrderedStates = placement === 'right'
      ? [...moduleStates].reverse()
      : moduleStates;
    const plan = planContextFreeInsertion(visualOrderedStates, context, placement);
    if (!plan.ok) {
      renderWallResult(plan.message, true);
      window.alert(`Modüller eklenemedi\n\n${plan.message}`);
    }
    return plan;
  }

  if (placement === 'left' || placement === 'right') {
    moduleStates = [...moduleStates].reverse();
  }

  const plan = planContextContinuousInsertion(moduleStates, context, placement);
  if (!plan.ok) {
    renderWallResult(plan.message, true);
    window.alert(`Modüller eklenemedi\n\n${plan.message}`);
  }
  return plan;
}

function assignPlannedPlacements(moduleStates, { placementMode = 'append', context = null } = {}) {
  if (!currentStand) return { ok: false, message: 'Önce stand alanını oluştur.' };
  if (placementMode !== 'append' || context) {
    return { ok: false, message: 'Bağlamsal ekleme sürekli duvar motoru üzerinden yapılmalı.' };
  }

  const planned = [];
  let cursorCm = getWallExtentCm(currentModules, 'back');

  for (const moduleState of moduleStates) {
    const placement = createModulePlacement({
      xCm: cursorCm,
      yCm: 0,
      zCm: 0,
      rotationZDeg: 0,
      wallId: 'back',
    });

    const validation = validatePlacementAgainstModules({
      placement,
      widthCm: moduleState.widthCm,
      moduleId: moduleState.id,
      modules: [...currentModules, ...planned],
      standType: currentStand.standType,
      standXCm: currentStand.xCm,
      standYCm: currentStand.yCm,
    });
    if (!validation.ok) return validation;

    moduleState.placement = placement;
    planned.push(moduleState);
    cursorCm += Number(moduleState.widthCm);
  }

  return { ok: true };
}

function flushCatalogModuleAdds() {
  catalogAddFlushScheduled = false;
  const requests = pendingCatalogAdds;
  pendingCatalogAdds = [];

  if (!currentStand || !requests.length) return;

  const firstRequest = requests[0];
  let moduleStates = requests.map((request) => createCatalogModuleState(request.module));
  if (moduleStates.some((moduleState) => !moduleState)) return;

  const placementMode = firstRequest.placement ?? 'append';
  const context = firstRequest.context ?? null;

  if ((placementMode === 'left' || placementMode === 'right') && context) {
    if (isFreeContextInsertion(context)) {
      const visualOrderedStates = placementMode === 'right'
        ? [...moduleStates].reverse()
        : moduleStates;
      const plan = planContextFreeInsertion(visualOrderedStates, context, placementMode);
      if (!plan.ok) {
        renderWallResult(plan.message, true);
        window.alert(`Modüller eklenemedi\n\n${plan.message}`);
        return;
      }

      applyFreeInsertionPlan(plan, visualOrderedStates, context, placementMode);
      rebuildWall({ resetView: false });
      return;
    }

    moduleStates = [...moduleStates].reverse();
    const plan = planContextContinuousInsertion(moduleStates, context, placementMode);
    if (!plan.ok) {
      renderWallResult(plan.message, true);
      window.alert(`Modüller eklenemedi\n\n${plan.message}`);
      return;
    }

    applyContinuousInsertionPlan(plan, moduleStates);
    rebuildWall({ resetView: false });
    return;
  }

  const placementPlan = assignPlannedPlacements(moduleStates, {
    placementMode,
    context,
  });
  if (!placementPlan.ok) {
    renderWallResult(placementPlan.message, true);
    window.alert(`Modüller eklenemedi\n\n${placementPlan.message}`);
    return;
  }

  currentModules.push(...moduleStates);
  rebuildWall({ resetView: false });
}

function addCatalogModule(request) {
  if (!currentStand || !request?.module) return;

  pendingCatalogAdds.push(request);
  if (catalogAddFlushScheduled) return;

  catalogAddFlushScheduled = true;
  queueMicrotask(flushCatalogModuleAdds);
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
  onValidateAddBatch: validateCatalogAddBatch,
  onGlassModeChange: changeContextPanelGlassMode,
});

moduleDragSidebar = createModuleDragSidebar({
  anchorButton: openModuleCatalogButton,
  viewport,
  canDrag: () => Boolean(currentStand),
  createModuleState: (module) => createCatalogModuleState(module),
  onPreview: (moduleState, clientX, clientY, rotationZDeg, rotationLocked) => (
    scene3d.previewCatalogModuleDrag(
      moduleState,
      clientX,
      clientY,
      rotationZDeg,
      rotationLocked,
    )
  ),
  onDrop: (moduleState, clientX, clientY, rotationZDeg, rotationLocked) => {
    const result = scene3d.dropCatalogModuleDrag(
      moduleState,
      clientX,
      clientY,
      rotationZDeg,
      rotationLocked,
    );
    if (!result.ok || !result.placement) {
      renderWallResult(result.message ?? 'Modül bu konuma bırakılamadı.', true);
      return;
    }

    if (result.plan?.placements instanceof Map && result.plan?.orderedModuleIds?.length) {
      applyContinuousInsertionPlan(result.plan, [moduleState]);
    } else {
      moduleState.placement = { ...result.placement };
      currentModules.push(moduleState);
    }
    rebuildWall({ resetView: false });
  },
  onCancel: () => scene3d.clearCatalogModuleDrag(),
});

renderCurrentViewButton?.addEventListener('click', async () => {
  if (!currentStand) {
    renderWallResult('Önce stand sahnesini oluştur.', true);
    return;
  }

  const previousText = renderCurrentViewButton.textContent;
  renderCurrentViewButton.disabled = true;
  renderCurrentViewButton.textContent = 'Render alınıyor…';
  try {
    const result = await scene3d.captureCurrentViewPng({ scale: 3 });
    if (!result.ok || !result.blob) {
      renderWallResult(result.message || 'Render alınamadı.', true);
      return;
    }
    const projectName = (projectNameInput.value.trim() || 'fair-stand')
      .replace(/[^a-zA-Z0-9ğüşöçıİĞÜŞÖÇ_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'fair-stand';
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = projectName + '-render.png';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    renderWallResult('Render hazır · ' + result.width + ' × ' + result.height + ' px PNG.');
  } catch (error) {
    console.warn('Render alınamadı:', error);
    renderWallResult('Render alınamadı.', true);
  } finally {
    renderCurrentViewButton.disabled = false;
    renderCurrentViewButton.textContent = previousText;
  }
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

  currentStand = { ...setup, floorType: floorTypeSelect.value };
  scene3d.setFloorType(floorTypeSelect.value);
  viewportEmpty.hidden = true;
  viewportToolbar.hidden = false;
  setStandEditingEnabled(true);

  const automaticWall = composeAutomaticStandWall({
    lengthCm: getAutomaticWallCapacityCm({
      standType: setup.standType,
      standXCm: setup.xCm,
      standYCm: setup.yCm,
    }),
    standType: setup.standType,
    standXCm: setup.xCm,
    standYCm: setup.yCm,
  });
  if (!automaticWall.ok) {
    renderStageResult(automaticWall.message, true);
    return;
  }
  currentModules = automaticWall.widths.map((widthCm, index) => {
    const moduleState = createFlatPanelModuleState(widthCm);
    moduleState.placement = { ...automaticWall.placements[index] };
    return moduleState;
  });
  rebuildWall({ resetView: true });

  const label = STAND_TYPE_LABELS[setup.standType];
  renderStageResult(
    `${label} · ${setup.xCm} × ${setup.yCm} cm aktif alan · ${setup.sceneWidthM} × ${setup.sceneDepthM} m toplam sahne`,
  );
});

floorTypeSelect.addEventListener('change', () => {
  if (!currentStand) return;
  currentStand = { ...currentStand, floorType: floorTypeSelect.value };
  scene3d.setFloorType(floorTypeSelect.value);
});

openModuleCatalogButton.addEventListener('click', () => {
  if (!currentStand) return;
  moduleContextMenu.openPicker({ placement: 'append' });
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
      + 'Modül türleri, genişlikleri, sıraları ve FAZ 2 yerleşimleri korunacaktır.',
  );
  if (!confirmed) return;

  const resetModules = currentModules.map((module) => createCatalogModuleState(
    module,
    { preservePlacement: true },
  ));
  if (resetModules.some((module) => !module)) {
    selectionInfo.textContent = 'Bazı modül türleri varsayılan ayarlarına döndürülemedi.';
    return;
  }

  currentModules = resetModules;
  moduleContextMenu.close();
  moduleContextMenu.closePicker();
  rebuildWall({ resetView: false });
  syncColorEditorFromHex('#ffffff');
  selectionInfo.textContent = 'Tüm modüller varsayılan ayarlarına döndürüldü. Modül dizilimi ve yerleşimi korundu.';
});

function applyActiveColorToSelection({ showMissingSelection = false } = {}) {
  if (scene3d.isFloorSelected()) {
    const floorType = scene3d.getSelectedFloorType();
    if (floorType === 'parke') {
      selectionInfo.textContent = 'Parke zemini boyanamaz; hazır parke seçeneklerinden biri kullanılacak.';
      return false;
    }
    const applied = scene3d.setFloorColor(colorInput.value);
    if (applied) {
      const label = floorType === 'hali' ? 'Halı' : 'Karolaj';
      if (currentStand) currentStand = { ...currentStand, floorColor: applied };
      selectionInfo.textContent = label + ' zemini · renk ' + applied.toUpperCase() + ' uygulandı.';
      return true;
    }
  }

  const selected = scene3d.getSelectedSurfaces();
  if (!selected.length) {
    if (showMissingSelection) {
      selectionInfo.textContent = 'Önce 3D sahnede boyamak istediğin panel, panel bloğu, modül veya zemini seç.';
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

function cloneProjectState(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function clearRegisteredAssets() {
  imageAssets.forEach((asset) => { if (asset.url) URL.revokeObjectURL(asset.url); });
  imageAssets.clear();
  activeAssetId = null;
  renderAssetLibrary();
  assetStatus.textContent = 'Görsel seçilmedi.';
}

function buildProjectSnapshot() {
  return {
    id: activeProjectId,
    name: projectNameInput.value.trim() || 'Adsız Proje',
    version: 1,
    createdAt: activeProjectCreatedAt,
    stand: cloneProjectState(currentStand),
    modules: cloneProjectState(currentModules),
  };
}

function getProjectStateSignature() {
  const snapshot = buildProjectSnapshot();
  return JSON.stringify({
    name: snapshot.name,
    stand: snapshot.stand,
    modules: snapshot.modules,
  });
}

function clearAutosaveTimer() {
  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveTimer = null;
}

function scheduleAutosave() {
  if (!autosaveEnabled) return;
  clearAutosaveTimer();
  projectStatus.textContent = 'Değişiklik var · 5 sn içinde otomatik kaydedilecek…';
  autosaveTimer = setTimeout(async () => {
    autosaveTimer = null;
    if (!autosaveEnabled) return;
    projectStatus.textContent = 'Kaydediliyor…';
    try {
      await persistActiveProject({ quiet: true });
      autosaveObservedSignature = getProjectStateSignature();
      projectStatus.textContent = 'Kaydedildi · Otomatik';
    } catch (error) {
      console.warn('Otomatik kayıt başarısız:', error);
      projectStatus.textContent = 'Otomatik kayıt başarısız.';
    }
  }, AUTOSAVE_DELAY_MS);
}

function enableAutosaveFromCurrentState() {
  clearAutosaveTimer();
  autosaveObservedSignature = getProjectStateSignature();
  autosaveEnabled = true;
}

function disableAutosave() {
  autosaveEnabled = false;
  clearAutosaveTimer();
  autosaveObservedSignature = null;
}

setInterval(() => {
  if (!autosaveEnabled) return;
  const signature = getProjectStateSignature();
  if (signature === autosaveObservedSignature) return;
  autosaveObservedSignature = signature;
  scheduleAutosave();
}, AUTOSAVE_WATCH_INTERVAL_MS);

async function refreshProjectList(selectedId = activeProjectId) {
  const projects = await listProjects();
  projectSelect.innerHTML = '';
  if (!projects.length) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Kayıtlı proje yok';
    projectSelect.appendChild(option);
    return projects;
  }
  projects.forEach((project) => {
    const option = document.createElement('option');
    option.value = project.id;
    option.textContent = project.name || 'Adsız Proje';
    projectSelect.appendChild(option);
  });
  if (projects.some((project) => project.id === selectedId)) projectSelect.value = selectedId;
  return projects;
}

async function loadAssetsForActiveProject() {
  clearRegisteredAssets();
  const assets = await loadImageAssets(activeProjectId);
  assets.forEach(registerAsset);
  if (assets.length) setActiveAsset(assets.at(-1).id);
  else renderAssetLibrary();
}

async function persistActiveProject({ quiet = false } = {}) {
  const stored = await saveProject(buildProjectSnapshot());
  activeProjectCreatedAt = stored.createdAt;
  await refreshProjectList(stored.id);
  if (!quiet) projectStatus.textContent = 'Kaydedildi: ' + stored.name;
  return stored;
}

async function restoreProject(project) {
  if (!project) return;
  disableAutosave();
  activeProjectId = project.id;
  activeProjectCreatedAt = Number(project.createdAt) || Date.now();
  projectNameInput.value = project.name || 'Adsız Proje';
  currentModules = cloneProjectState(project.modules) || [];
  currentStand = cloneProjectState(project.stand);
  moduleContextMenu.close();
  moduleContextMenu.closePicker();

  // Project image URLs must exist before the scene is rebuilt.
  // Otherwise stored imageAssetId values cannot resolve on the first open.
  await loadAssetsForActiveProject();

  if (currentStand) {
    selectedStandType = currentStand.standType;
    standTypeButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.standType === selectedStandType));
    });
    standSizeXInput.value = String(currentStand.xCm);
    standSizeYInput.value = String(currentStand.yCm);
    floorTypeSelect.value = currentStand.floorType || 'karolaj';
    const stage = scene3d.createStage({
      widthCm: currentStand.xCm,
      depthCm: currentStand.yCm,
      standType: currentStand.standType,
      resetView: true,
    });
    if (!stage.ok) throw new Error(stage.message || 'Proje sahnesi oluşturulamadı.');
    scene3d.setFloorType(currentStand.floorType || 'karolaj');
    if (currentStand.floorColor) scene3d.setFloorColor(currentStand.floorColor);
    viewportEmpty.hidden = true;
    viewportToolbar.hidden = false;
    setStandEditingEnabled(true);
    rebuildWall({ resetView: true });
    updateStageCreateState();
  } else {
    currentModules = [];
    selectedStandType = null;
    standTypeButtons.forEach((button) => button.setAttribute('aria-pressed', 'false'));
    standSizeXInput.value = '';
    standSizeYInput.value = '';
    setStandEditingEnabled(false);
    updateStageCreateState();
  }

  await refreshProjectList(activeProjectId);
  enableAutosaveFromCurrentState();
  projectStatus.textContent = 'Açıldı: ' + (project.name || 'Adsız Proje');
}

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
    const assets = await loadImageAssets(activeProjectId);
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

  const allCounterPanels = selected.every(
    (surface) => surface.userData.moduleType === 'counter',
  );
  if (allCounterPanels) {
    const panelsByFace = new Map();
    selected.forEach((surface) => {
      const face = surface.userData.surfaceRole ?? 'front';
      if (!panelsByFace.has(face)) panelsByFace.set(face, []);
      panelsByFace.get(face).push(surface);
    });

    let appliedPanelCount = 0;
    for (const panels of panelsByFace.values()) {
      const faceResult = scene3d.applyRectImageAsset(panels, activeAssetId, fit);
      if (!faceResult.ok) {
        selectionInfo.textContent = faceResult.message;
        return false;
      }
      appliedPanelCount += faceResult.panelCount ?? panels.length;
    }

    const fitLabel = fit === 'cover' ? 'Doldur' : 'Sığdır';
    selectionInfo.textContent = `${panelsByFace.size} banko cephesinde ${appliedPanelCount} panele tek parça görsel · ${fitLabel}.`;
    return true;
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
    const asset = await saveImageAsset(activeProjectId, file);
    registerAsset(asset);
    setActiveAsset(asset.id);

    const selected = scene3d.getSelectedSurfaces();
    if (selected.length) applyActiveImageToSelection('cover');
  } catch (error) {
    console.warn('Görsel kaydedilemedi:', error);
    assetStatus.textContent = 'Görsel arşive kaydedilemedi.';
  }
});

saveProjectButton.addEventListener('click', async () => {
  try {
    clearAutosaveTimer();
    await persistActiveProject();
    enableAutosaveFromCurrentState();
  }
  catch (error) { console.warn('Proje kaydedilemedi:', error); projectStatus.textContent = 'Proje kaydedilemedi.'; }
});

function safeArchiveName(name) {
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

openProjectButton.addEventListener('click', async () => {
  const projectId = projectSelect.value;
  if (!projectId) { projectStatus.textContent = 'Açılacak kayıtlı proje yok.'; return; }

  projectLoadingOverlay.hidden = false;
  openProjectButton.disabled = true;
  projectStatus.textContent = 'Proje yükleniyor…';
  try {
    const project = await loadProject(projectId);
    if (!project) { projectStatus.textContent = 'Proje bulunamadı.'; return; }
    await restoreProject(project);
  } catch (error) {
    console.warn('Proje açılamadı:', error);
    projectStatus.textContent = 'Proje açılamadı.';
  } finally {
    projectLoadingOverlay.hidden = true;
    openProjectButton.disabled = false;
  }
});

newProjectButton.addEventListener('click', () => {
  const confirmed = window.confirm('Yeni projeye geçilsin mi? Kaydedilmemiş değişiklikler kaybolabilir.');
  if (!confirmed) return;
  window.location.reload();
});

deleteProjectButton.addEventListener('click', async () => {
  const projectId = projectSelect.value;
  if (!projectId) return;
  const projects = await listProjects();
  const project = projects.find((item) => item.id === projectId);
  const confirmed = window.confirm((project?.name || 'Proje') + ' ve bu projeye ait tüm görseller silinecek. Devam edilsin mi?');
  if (!confirmed) return;
  try {
    await deleteProjectImageAssets(projectId);
    await deleteProject(projectId);
    if (projectId === activeProjectId) { window.location.reload(); return; }
    await refreshProjectList();
    projectStatus.textContent = 'Proje silindi.';
  } catch (error) { console.warn('Proje silinemedi:', error); projectStatus.textContent = 'Proje silinemedi.'; }
});

projectNameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') saveProjectButton.click();
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
  disableAutosave();
  imageAssets.forEach((asset) => {
    if (asset.url) URL.revokeObjectURL(asset.url);
  });
});

setStandEditingEnabled(false);
updateStageCreateState();
syncColorEditorFromHex(colorInput.value);
initializeAssetLibrary();
refreshProjectList().catch((error) => console.warn('Proje listesi açılamadı:', error));