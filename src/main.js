import './style.css';
import './colorEditor.css';
import './imageActions.css';
import './helpGuide.css';
import { createStandScene } from './scene3d.js';
import { initHelpGuide } from './helpGuide.js';
import { resolveModuleCatalogKey } from './catalog.js';
import { planAutomaticDepot } from './autoDepot.js';
import {
  composeAutomaticStandWall,
  composeAutomaticBackWallWithDepot,
  getAutomaticWallCapacityCm,
} from './automaticWall.js';
import {
  createModuleStateFromDescriptor,
  duplicateModuleState,
  totalWallWidthCm,
  moduleWidths,
} from './designState.js';
import { deleteImageAsset, deleteProjectImageAssets, loadImageAssets, saveImageAsset, saveImportedImageAsset } from './assetStore.js';
import { clearImageAssetReferences, countImageAssetReferences } from './imageAssetReferences.js';
import { createProjectId, deleteProject, listProjects, loadProject, saveProject } from './projectStore.js';
import { describeRectSelection } from './rectSelection.js';
import { createModuleContextMenu } from './moduleContextMenu.js';
import { createModuleDragSidebar } from './moduleDragSidebar.js';
import { createColorEditorController } from './colorEditorController.js';
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
import { getContinuousWallSegments, planContinuousWallInsertion } from './wallReflow.js';
import { getModuleDefaultRotationDeg, isTopPlacementModule } from './moduleBehavior.js';
import {
  buildAutomaticProjectNameSuffix,
  createProjectNamingController,
  getEditableProjectName,
} from './projectNaming.js';
import { createAutosaveController } from './autosaveController.js';
import { createProjectLoadingController, setButtonBusy } from './projectUi.js';
import { formatProjectSwitchMessage, shouldConfirmProjectSwitch } from './projectSwitch.js';
import { observeSelectionFeedback, observeStatusTones } from './uiFeedback.js';
import { DEFAULT_SELECTION_HINT, describeFloorSelection, describeSurfaceSelection } from './selectionFeedback.js';
import { createSidebarController } from './sidebarController.js';
import { formatCapacityPopup, renderStageResult as renderStageResultInto, renderWallResult } from './stageFeedback.js';

let jsZipModulePromise = null;

async function loadJSZip() {
  if (!jsZipModulePromise) {
    jsZipModulePromise = import('jszip').then((module) => module.default);
  }
  return jsZipModulePromise;
}

const appElement = document.querySelector('#app');
const sidebarToggleButton = document.querySelector('#sidebar-toggle');
const viewport = document.querySelector('#viewport');
const viewportEmpty = document.querySelector('#viewport-empty');
const viewportToolbar = document.querySelector('#viewport-toolbar');
const renderCurrentViewButton = document.querySelector('#render-current-view');
const standTypeButtons = [...document.querySelectorAll('[data-stand-type]')];
const standSizeXInput = document.querySelector('#stand-size-x');
const standSizeYInput = document.querySelector('#stand-size-y');
const createStageButton = document.querySelector('#create-stage');
const floorTypeSelect = document.querySelector('#floor-type');
const autoDepotEnabledInput = document.querySelector('#auto-depot-enabled');
const autoDepotSizeSelect = document.querySelector('#auto-depot-size');
const autoDepotContentsInput = document.querySelector('#auto-depot-contents');
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
const foamLightControls=document.querySelector('#foam-light-controls');
const foamLightColorInput=document.querySelector('#foam-light-color');
const imageInput = document.querySelector('#surface-image');
const fillImageButton = document.querySelector('#fit-image-cover');
const fitImageButton = document.querySelector('#fit-image-contain');
const clearTextureButton = document.querySelector('#clear-texture');
const resetModuleFeaturesButton = document.querySelector('#reset-module-features');
const assetLibraryElement = document.querySelector('#asset-library');
const assetStatus = document.querySelector('#asset-status');
const projectNameInput = document.querySelector('#project-name');
const projectNameDisplay = document.querySelector('#project-name-display');
const renameProjectButton = document.querySelector('#rename-project');
const projectSelect = document.querySelector('#project-select');
const saveProjectButton = document.querySelector('#save-project');
const openProjectButton = document.querySelector('#open-project');
const exportProjectButton = document.querySelector('#export-project');
const importProjectButton = document.querySelector('#import-project');
const importProjectFileInput = document.querySelector('#import-project-file');
const deleteProjectButton = document.querySelector('#delete-project');
const projectStatus = document.querySelector('#project-status');
const projectLoadingOverlay = document.querySelector('#project-loading-overlay');
const projectLoadingTitle = document.querySelector('#project-loading-title');
const projectLoadingDetail = document.querySelector('#project-loading-detail');

const projectLoading = createProjectLoadingController({
  overlay: projectLoadingOverlay,
  titleElement: projectLoadingTitle,
  detailElement: projectLoadingDetail,
});

const { setProjectName, requestProjectName } = createProjectNamingController({
  documentRef: document,
  projectNameInput,
  projectNameDisplay,
});

createSidebarController({
  appElement,
  toggleButton: sidebarToggleButton,
}).bind();


observeSelectionFeedback({
  element: selectionInfo,
  defaultHint: DEFAULT_SELECTION_HINT,
});

observeStatusTones({ elements: [stageResult, projectStatus, assetStatus] });

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
const imageAssets = new Map();
let assetContextAssetId = null;
let selectedFoamModuleId = null;

const assetContextMenu = document.createElement('div');
assetContextMenu.className = 'module-context-menu asset-context-menu';
assetContextMenu.hidden = true;
assetContextMenu.innerHTML = `
  <div class="module-context-title">Görsel</div>
  <button type="button" data-asset-action="illuminated-foam">Işıklı Strafora Dönüştür</button>
  <button type="button" data-asset-action="delete" class="danger">Sil</button>
`;
document.body.appendChild(assetContextMenu);

function getAssetUrl(assetId) {
  return imageAssets.get(assetId)?.url ?? null;
}

const scene3d = createStandScene(
  viewport,
  (surfaces) => {
    const feedback = describeSurfaceSelection(surfaces, currentModules);
    selectedFoamModuleId = feedback.foamModuleId;
    if (foamLightControls) foamLightControls.hidden = !feedback.foamControlsVisible;
    if (feedback.foamControlsVisible && foamLightColorInput) {
      foamLightColorInput.value = feedback.foamColor;
    }
    selectionInfo.textContent = feedback.message;
  },
  getAssetUrl,
  (context) => moduleContextMenu.open(context),
  (floorSelection) => {
    const message = describeFloorSelection(floorSelection);
    if (message) selectionInfo.textContent = message;
  },
);

function renderStageResult(message, isError = false) {
  renderStageResultInto(stageResult, message, isError);
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

  if (isTopPlacementModule(sourceModule) && sourceModule.placement) {
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

function createCatalogModuleState(module, { preservePlacement = false, catalogKey = null } = {}) {
  if (!module) return null;
  return createModuleStateFromDescriptor(module, {
    catalogKey: catalogKey ?? resolveModuleCatalogKey(module),
    preservePlacement,
  });
}

function getRequestWallId({ context = null } = {}) {
  return context?.placement?.wallId ?? 'back';
}

function getContinuousModulePathStartCm(module, segments) {
  const placement = module?.placement;
  const widthCm = Number(module?.widthCm);
  if (!placement || !Number.isFinite(widthCm) || widthCm <= 0) return null;

  const segment = segments.find((candidate) => candidate.wallId === placement.wallId);
  if (!segment) return null;

  let localStartCm = null;
  if (placement.wallId === 'left') {
    localStartCm = Number(currentStand?.yCm) - (Number(placement.yCm) + widthCm);
  } else if (placement.wallId === 'back') {
    localStartCm = Number(placement.xCm);
  } else if (placement.wallId === 'right') {
    localStartCm = Number(placement.yCm);
  }

  if (!Number.isFinite(localStartCm)) return null;
  return Number(segment.offsetCm) + localStartCm;
}

function getContinuousAppendTargetModule() {
  if (!currentStand) return null;
  const segments = getContinuousWallSegments(
    currentStand.standType,
    currentStand.xCm,
    currentStand.yCm,
  );
  if (!segments.length) return null;

  return currentModules
    .map((module) => ({
      module,
      pathStartCm: getContinuousModulePathStartCm(module, segments),
    }))
    .filter((entry) => Number.isFinite(entry.pathStartCm))
    .sort((a, b) => a.pathStartCm - b.pathStartCm)
    .at(-1)?.module ?? null;
}

function planCatalogAppendInsertion(moduleStates) {
  const targetModule = getContinuousAppendTargetModule();
  if (!targetModule) {
    const initialPlan = assignPlannedPlacements(moduleStates, {
      placementMode: 'append',
      context: null,
    });
    return { ...initialPlan, appendMode: 'initial' };
  }

  // wallReflow yan duvar çağrı yönünü zincir yönüne normalize ediyor.
  // Fiziksel zincir sonuna eklemek için yan duvarda caller side ters gönderilir.
  const targetWallId = targetModule.placement?.wallId;
  const side = targetWallId === 'left' || targetWallId === 'right' ? 'left' : 'right';
  const plan = planContinuousWallInsertion({
    modules: currentModules,
    insertedModules: moduleStates,
    targetModuleId: targetModule.id,
    side,
    standType: currentStand.standType,
    standXCm: currentStand.xCm,
    standYCm: currentStand.yCm,
  });
  return { ...plan, appendMode: 'continuous' };
}

function validateCatalogAddBatch({
  entries = [],
  context = null,
  placement = 'append',
} = {}) {
  if (placement === 'append' || !context) {
    const moduleStates = entries.map((entry) => createCatalogModuleState(entry.module));
    if (moduleStates.some((moduleState) => !moduleState)) {
      return { ok: false, message: 'Seçilen modüller hazırlanamadı.' };
    }

    const plan = planCatalogAppendInsertion(moduleStates);
    if (!plan.ok) {
      renderWallResult(plan.message, true);
      window.alert(`Modüller eklenemedi\n\n${plan.message}`);
    }
    return plan;
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
      rotationZDeg: getModuleDefaultRotationDeg(moduleState),
      wallId: 'back',
    });

    const validation = validatePlacementAgainstModules({
      placement,
      widthCm: moduleState.widthCm,
      depthCm: moduleState.depthCm,
      moduleId: moduleState.id,
      moduleType: moduleState.type,
      shape: moduleState.shape,
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

  if (placementMode === 'append' && !context) {
    const plan = planCatalogAppendInsertion(moduleStates);
    if (!plan.ok) {
      renderWallResult(plan.message, true);
      window.alert(`Modüller eklenemedi\n\n${plan.message}`);
      return;
    }

    if (plan.appendMode === 'continuous') {
      applyContinuousInsertionPlan(plan, moduleStates);
    } else {
      currentModules.push(...moduleStates);
    }
    rebuildWall({ resetView: false });
    return;
  }

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

function getContextShelfLightingState(context) {
  const index = findContextModuleIndex(context);
  const moduleState = index >= 0 ? currentModules[index] : null;
  return moduleState?.type === 'shelf' && Boolean(moduleState.shelfLightingOn);
}

function changeContextShelfLighting(context, enabled) {
  const index = findContextModuleIndex(context);
  if (index < 0 || currentModules[index]?.type !== 'shelf') return;

  const nextEnabled = Boolean(enabled);
  currentModules[index].shelfLightingOn = nextEnabled;
  if (!scene3d.setShelfLightingVisible(index, nextEnabled)) {
    rebuildWall({ resetView: false });
  }
  selectionInfo.textContent = nextEnabled
    ? 'Raf altı aydınlatma açıldı.'
    : 'Raf altı aydınlatma kapatıldı.';
}

function changeContextFabricMode(context, enabled) {
  if (!context?.supportsFabric) return;

  const selectedPanels = scene3d.getSelectedSurfaces().filter(
    (surface) => surface.userData.selectionMode === 'panel',
  );
  const result = scene3d.applyFabricMode(selectedPanels, enabled);
  if (!result?.ok) {
    selectionInfo.textContent = result?.message || 'Lightbox Kumaş işlemi uygulanamadı.';
    return;
  }

  selectionInfo.textContent = result.enabled
    ? `${result.panelCount} panel tek parça Lightbox Kumaşa çevrildi.`
    : 'Lightbox Kumaş kaldırıldı; paneller normal görünüme döndü.';
}

function changeContextMeshMode(context, enabled) {
  if (!context?.supportsFabric) return;

  const selectedPanels = scene3d.getSelectedSurfaces().filter(
    (surface) => surface.userData.selectionMode === 'panel',
  );
  const result = scene3d.applyMeshMode(selectedPanels, enabled);
  if (!result?.ok) {
    selectionInfo.textContent = result?.message || 'Mesh Branda işlemi uygulanamadı.';
    return;
  }

  selectionInfo.textContent = result.enabled
    ? `${result.panelCount} panel tek parça Mesh (Delikli) Brandaya çevrildi.`
    : 'Mesh Branda kaldırıldı; paneller normal görünüme döndü.';
}

function changeContextFabricLighting(context, enabled) {
  if (!context?.isLightboxFabric) return;

  const selectedPanels = scene3d.getSelectedSurfaces().filter(
    (surface) => surface.userData.selectionMode === 'panel',
  );
  const result = scene3d.setFabricLighting(selectedPanels, enabled);
  if (!result?.ok) {
    selectionInfo.textContent = result?.message || 'Lightbox aydınlatması değiştirilemedi.';
    return;
  }

  selectionInfo.textContent = result.enabled
    ? 'Lightbox aydınlatması açıldı · yalnızca bez/görsel parlıyor.'
    : 'Lightbox aydınlatması kapatıldı.';
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

async function resizeContextIlluminatedFoam(context) {
  const index = findContextModuleIndex(context);
  if (index < 0 || currentModules[index]?.type !== 'illuminated-foam') return;
  const moduleState = currentModules[index];
  const dimensions = await requestIlluminatedFoamDimensions(moduleState.widthCm, moduleState.heightCm);
  if (!dimensions) return;
  moduleState.widthCm = dimensions.widthCm;
  moduleState.heightCm = dimensions.heightCm;
  rebuildWall({ resetView: false });
  selectionInfo.textContent = `Modül ${index + 1} · Işıklı Strafor · ${moduleState.widthCm} × ${moduleState.heightCm} cm · ${moduleState.depthCm || 3.5} cm kalınlık · ışık ${moduleState.haloColor || '#ffffff'}.`;
}
const moduleContextMenu = createModuleContextMenu({
  onDelete: deleteContextModule,
  onDuplicate: duplicateContextModule,
  onResize: resizeContextIlluminatedFoam,
  onAdd: addCatalogModule,
  onValidateAddBatch: validateCatalogAddBatch,
  onGlassModeChange: changeContextPanelGlassMode,
  onFabricModeChange: changeContextFabricMode,
  onMeshModeChange: changeContextMeshMode,
  onFabricLightingChange: changeContextFabricLighting,
  getShelfLightingState: getContextShelfLightingState,
  onShelfLightingChange: changeContextShelfLighting,
});

moduleDragSidebar = createModuleDragSidebar({
  anchorButton: openModuleCatalogButton,
  viewport,
  canDrag: () => Boolean(currentStand),
  createModuleState: (module, moduleKey) => createCatalogModuleState(module, { catalogKey: moduleKey }),
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
autoDepotEnabledInput?.addEventListener('change', syncAutoDepotControls);
syncAutoDepotControls();

function syncAutoDepotControls() {
  const enabled = Boolean(autoDepotEnabledInput?.checked);
  if (autoDepotSizeSelect) autoDepotSizeSelect.disabled = !enabled;
  if (autoDepotContentsInput) {
    autoDepotContentsInput.disabled = !enabled;
    if (!enabled) autoDepotContentsInput.checked = false;
  }
}

function createAutomaticDepotStates(plan) {
  if (!plan?.ok) return [];
  return plan.specs.map((spec) => {
    const descriptor = {
      ...spec,
      type: spec.kind === 'wall' ? 'flat-panel' : spec.kind,
    };
    const state = createModuleStateFromDescriptor(descriptor);
    if (!state) return null;
    state.placement = { ...spec.placement };
    state.autoDepot = true;
    return state;
  }).filter(Boolean);
}

createStageButton.addEventListener('click', async () => {
  const setup = readStandSetup();
  if (!setup.ok) {
    renderStageResult(setup.message, true);
    return;
  }

  if (currentStand || currentModules.length || autosaveController.isEnabled()) {
    const currentProjectName = projectNameInput.value.trim() || 'Adsız Proje';
    const confirmed = window.confirm(
      'Yeni proje oluşturulacak.\n\n'
        + (autosaveController.isEnabled()
          ? '• Açık kayıtlı proje: "' + currentProjectName + '" korunacak.\n'
          : '• Mevcut kaydedilmemiş sahne ve düzenlemeler temizlenecek.\n')
        + '• Mevcut modüller, renkler ve görseller yeni projeye taşınmayacak.\n\n'
        + 'Devam edilsin mi?',
    );
    if (!confirmed) return;
  }

  const depotConfig = autoDepotEnabledInput?.checked ? {
    enabled: true,
    sizeKey: autoDepotSizeSelect?.value || '100x100',
    includeContents: Boolean(autoDepotContentsInput?.checked),
  } : { enabled: false, sizeKey: null, includeContents: false };
  const depotPlan = depotConfig.enabled ? planAutomaticDepot({
    standType: setup.standType, standXCm: setup.xCm, standYCm: setup.yCm,
    sizeKey: depotConfig.sizeKey, includeContents: depotConfig.includeContents,
  }) : null;
  if (depotPlan && !depotPlan.ok) { renderStageResult(depotPlan.message, true); return; }

  const projectNameSuffix = buildAutomaticProjectNameSuffix(setup.standType, setup.xCm, setup.yCm);
  const projectName = await requestProjectName({ mode: 'create', suffix: projectNameSuffix });
  if (!projectName) return;

  autosaveController.disable();
  activeProjectId = createProjectId();
  activeProjectCreatedAt = Date.now();
  setProjectName(projectName);
  projectSelect.selectedIndex = -1;
  clearRegisteredAssets();
  projectStatus.textContent = 'Yeni proje hazırlanıyor: ' + projectName + '…';

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

  currentStand = { ...setup, floorType: floorTypeSelect.value, depot: depotConfig };
  scene3d.setFloorType(floorTypeSelect.value);
  viewportEmpty.hidden = true;
  viewportToolbar.hidden = false;
  setStandEditingEnabled(true);

  if (setup.standType === 'island') {
    currentModules = [];
  } else {
    const automaticWall = composeAutomaticStandWall({
      lengthCm: getAutomaticWallCapacityCm({ standType: setup.standType, standXCm: setup.xCm, standYCm: setup.yCm }),
      standType: setup.standType, standXCm: setup.xCm, standYCm: setup.yCm,
    });
    if (!automaticWall.ok) { renderStageResult(automaticWall.message, true); return; }
    currentModules = automaticWall.widths.map((widthCm, index) => {
      const moduleState = createModuleStateFromDescriptor({ type: 'flat-panel', widthCm });
      moduleState.placement = { ...automaticWall.placements[index] };
      return moduleState;
    });

    if (depotPlan?.ok) {
      const customBack = composeAutomaticBackWallWithDepot({
        standXCm: setup.xCm,
        depotOriginXCm: depotPlan.originXCm,
        depotWidthCm: depotPlan.widthCm,
      });
      if (!customBack.ok) { renderStageResult(customBack.message, true); return; }

      currentModules = currentModules.filter((moduleState) => moduleState.placement?.wallId !== 'back');
      const backStates = customBack.modules.map((entry) => {
        const moduleState = createModuleStateFromDescriptor({ type: 'flat-panel', widthCm: entry.widthCm });
        moduleState.placement = { ...entry.placement };
        if (entry.depotBack) moduleState.autoDepotBack = true;
        return moduleState;
      });
      currentModules.push(...backStates);
    }
  }
  if (depotPlan?.ok) currentModules.push(...createAutomaticDepotStates(depotPlan));
  rebuildWall({ resetView: true });

  const label = STAND_TYPE_LABELS[setup.standType];
  renderStageResult(
    `${label} · ${setup.xCm} × ${setup.yCm} cm aktif alan · ${setup.sceneWidthM} × ${setup.sceneDepthM} m toplam sahne`,
  );

  try {
    await persistActiveProject({ quiet: true });
    autosaveController.enableFromCurrentState();
    projectStatus.textContent = 'Oluşturuldu ve kaydedildi: ' + projectName;
  } catch (error) {
    console.warn('Yeni proje ilk kayıt sırasında kaydedilemedi:', error);
    autosaveController.disable();
    projectStatus.textContent = 'Proje oluşturuldu ancak kaydedilemedi.';
  }
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

const {
  syncFromHex: syncColorEditorFromHex,
  syncFromRgbInputs,
  syncFromCmykInputs,
} = createColorEditorController({
  colorInput,
  colorHexInput,
  colorRgbInputs,
  colorCmykInputs,
  onApply: () => applyActiveColorToSelection(),
});

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
  closeAssetContextMenu();
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

const autosaveController = createAutosaveController({
  getSignature: getProjectStateSignature,
  persist: persistActiveProject,
  setStatus: (message) => { projectStatus.textContent = message; },
  onError: (error) => console.warn('Otomatik kayıt başarısız:', error),
});

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
  autosaveController.disable();
  activeProjectId = project.id;
  activeProjectCreatedAt = Number(project.createdAt) || Date.now();
  setProjectName(project.name || 'Adsız Proje');
  currentModules = cloneProjectState(project.modules) || [];
  currentModules.forEach((moduleState) => {
    if (!moduleState.catalogKey) moduleState.catalogKey = resolveModuleCatalogKey(moduleState);
  });
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
    if (autoDepotEnabledInput) autoDepotEnabledInput.checked = Boolean(currentStand.depot?.enabled);
    if (autoDepotSizeSelect && currentStand.depot?.sizeKey) autoDepotSizeSelect.value = currentStand.depot.sizeKey;
    if (autoDepotContentsInput) autoDepotContentsInput.checked = Boolean(currentStand.depot?.includeContents);
    syncAutoDepotControls();
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
  autosaveController.enableFromCurrentState();
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

function closeAssetContextMenu() {
  assetContextMenu.hidden = true;
  assetContextAssetId = null;
}

function openAssetContextMenu(assetId, clientX, clientY) {
  const asset = imageAssets.get(assetId);
  if (!asset) return;

  assetContextAssetId = assetId;
  assetContextMenu.querySelector('.module-context-title').textContent = `Görsel · ${asset.name}`;
  const foamAction = assetContextMenu.querySelector('[data-asset-action="illuminated-foam"]');
  const isSvg = asset.type === 'image/svg+xml' || /\.svg$/i.test(asset.name || '');
  if (foamAction) foamAction.hidden = !isSvg;
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
    // Canlı sahneyi önce Kaldır davranışıyla temizle; blob silme/persist beklenmez.
    scene3d.clearImageAssetById(assetId);
    clearImageAssetReferences(currentModules, assetId);
    clearImageAssetReferences(currentStand, assetId);
  }

  try {
    // Kayıtlı projede önce referansları kalıcılaştır; ardından blob'u sil.
    // Böylece proje hiçbir zaman silinmiş bir asset'e bilinçli olarak bağlı bırakılmaz.
    if (usageCount > 0 && autosaveController.isEnabled()) {
      autosaveController.clearPending();
      await persistActiveProject({ quiet: true });
      autosaveController.markSavedState();
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

function setActiveAsset(assetId, { focus = false } = {}) {
  activeAssetId = assetId;
  renderAssetLibrary();
  if (focus && assetId) {
    const activeTile = [...assetLibraryElement.querySelectorAll('.asset-tile')]
      .find((tile) => tile.dataset.assetId === assetId);
    activeTile?.focus({ preventScroll: true });
  }
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
      button.dataset.assetId = asset.id;
      button.title = asset.name;

      const image = document.createElement('img');
      image.src = asset.url;
      image.alt = asset.name;

      const label = document.createElement('span');
      label.textContent = asset.name;

      button.append(image, label);
      button.addEventListener('click', () => {
        closeAssetContextMenu();
        setActiveAsset(asset.id, { focus: true });
      });
      button.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        event.stopPropagation();
        setActiveAsset(asset.id, { focus: true });
        openAssetContextMenu(asset.id, event.clientX, event.clientY);
      });
      assetLibraryElement.appendChild(button);
    });
}

let illuminatedFoamAssetDragCleanup = null;

function getSvgAspectRatioFromText(svgText) {
  const documentNode = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  if (documentNode.querySelector('parsererror')) return 4;
  const svg = documentNode.documentElement;
  const viewBox = (svg.getAttribute('viewBox') || '').trim().split(/[\s,]+/).map(Number);
  if (viewBox.length === 4 && viewBox.every(Number.isFinite) && viewBox[2] > 0 && viewBox[3] > 0) {
    return viewBox[2] / viewBox[3];
  }
  const width = Number.parseFloat(svg.getAttribute('width'));
  const height = Number.parseFloat(svg.getAttribute('height'));
  return width > 0 && height > 0 ? width / height : 4;
}

function requestIlluminatedFoamDimensions(defaultWidthCm, defaultHeightCm) {
  return new Promise((resolve) => {
    const overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;inset:0;z-index:12000;background:rgba(15,23,42,.48);display:grid;place-items:center;padding:20px';
    const form=document.createElement('form');
    form.style.cssText='width:min(360px,100%);background:#fff;border-radius:14px;padding:18px;box-shadow:0 20px 60px rgba(15,23,42,.28);display:grid;gap:12px;font:500 13px/1.35 system-ui,sans-serif;color:#111827';
    form.innerHTML='<strong style="font-size:16px">Işıklı Strafor Ölçüsü</strong><span style="color:#64748b">Gerçek dış ölçüyü cm olarak gir.</span><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><label style="display:grid;gap:5px">X · Genişlik (cm)<input name="width" type="number" min="10" max="5000" step="1" value="'+Math.round(defaultWidthCm)+'" required style="height:38px;padding:0 9px;border:1px solid #cbd5e1;border-radius:8px"></label><label style="display:grid;gap:5px">Y · Yükseklik (cm)<input name="height" type="number" min="5" max="350" step="1" value="'+Math.round(defaultHeightCm)+'" required style="height:38px;padding:0 9px;border:1px solid #cbd5e1;border-radius:8px"></label></div><span style="color:#64748b">Gövde: 3,5 cm · Duvar boşluğu: 1,5 cm</span><div style="display:flex;justify-content:flex-end;gap:8px"><button type="button" data-cancel>İptal</button><button type="submit" class="primary">Yerleştir</button></div>';
    overlay.appendChild(form); document.body.appendChild(overlay);
    const finish=(value)=>{ overlay.remove(); resolve(value); };
    form.querySelector('[data-cancel]').addEventListener('click',()=>finish(null));
    overlay.addEventListener('pointerdown',(event)=>{ if(event.target===overlay) finish(null); });
    form.addEventListener('submit',(event)=>{ event.preventDefault(); const data=new FormData(form); const widthCm=Number(data.get('width')); const heightCm=Number(data.get('height')); if(!(widthCm>=10&&widthCm<=5000&&heightCm>=5&&heightCm<=350)) return; finish({widthCm,heightCm}); });
    form.querySelector('input[name="width"]')?.focus();
  });
}

async function beginIlluminatedFoamAssetDrag(assetId) {
  const asset = imageAssets.get(assetId);
  if (!asset) return false;
  const isSvg = asset.type === 'image/svg+xml' || /\.svg$/i.test(asset.name || '');
  if (!isSvg) {
    assetStatus.textContent = 'Işıklı Strafor için SVG görsel kullan.';
    return false;
  }
  if (!currentStand) {
    assetStatus.textContent = 'Önce stand sahnesini oluştur.';
    return false;
  }

  if (illuminatedFoamAssetDragCleanup) illuminatedFoamAssetDragCleanup();

  const svgText = await asset.blob.text();
  const aspect=Math.max(0.1,getSvgAspectRatioFromText(svgText));
  const defaultWidthCm=200;
  const defaultHeightCm=Math.max(10,defaultWidthCm/aspect);
  const dimensions=await requestIlluminatedFoamDimensions(defaultWidthCm,defaultHeightCm);
  if(!dimensions){ assetStatus.textContent='Işıklı Strafor oluşturma iptal edildi.'; return false; }
  const moduleState=createModuleStateFromDescriptor({type:'illuminated-foam',widthCm:dimensions.widthCm,heightCm:dimensions.heightCm,haloColor:'#ffffff'},{imageAssetId:asset.id});
  let lastPreview = null;

  const onPointerMove = (event) => {
    lastPreview = scene3d.previewCatalogModuleDrag(moduleState, event.clientX, event.clientY, 0, false);
  };
  const cleanup = () => {
    document.removeEventListener('pointermove', onPointerMove, true);
    document.removeEventListener('pointerup', onPointerUp, true);
    document.removeEventListener('keydown', onKeyDown, true);
    scene3d.clearCatalogModuleDrag();
    illuminatedFoamAssetDragCleanup = null;
  };
  const onPointerUp = (event) => {
    const result = scene3d.dropCatalogModuleDrag(moduleState, event.clientX, event.clientY, 0, false);
    if (!result.ok || !result.placement) {
      assetStatus.textContent = result.message || 'Işıklı Strafor bu konuma bırakılamadı.';
      return;
    }
    moduleState.placement = { ...result.placement };
    currentModules.push(moduleState);
    cleanup();
    rebuildWall({ resetView: false });
    assetStatus.textContent=`Işıklı Strafor sahneye eklendi · ${moduleState.widthCm} × ${moduleState.heightCm} cm · 3,5 cm kalınlık · 1,5 cm ışık boşluğu.`;
  };
  const onKeyDown = (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    cleanup();
    assetStatus.textContent = 'Işıklı Strafor yerleştirme iptal edildi.';
  };

  document.addEventListener('pointermove', onPointerMove, true);
  document.addEventListener('pointerup', onPointerUp, true);
  document.addEventListener('keydown', onKeyDown, true);
  illuminatedFoamAssetDragCleanup = cleanup;
  assetStatus.textContent = 'Işıklı Strafor hazır · mouse ile duvara götür ve tıkla.';
  return Boolean(lastPreview) || true;
}

foamLightColorInput?.addEventListener('input',()=>{
  if(!selectedFoamModuleId) return;
  const moduleState=currentModules.find((module)=>module.id===selectedFoamModuleId);
  if(!moduleState||moduleState.type!=='illuminated-foam') return;
  const color=String(foamLightColorInput.value||'#ffffff').toLowerCase();
  moduleState.haloColor=color;
  scene3d.setIlluminatedFoamHaloColor?.(moduleState.id,color);
  const moduleIndex=currentModules.indexOf(moduleState);
  selectionInfo.textContent=`Modül ${moduleIndex+1} · Işıklı Strafor · ${moduleState.widthCm} × ${moduleState.heightCm} cm · ${moduleState.depthCm||3.5} cm kalınlık · ışık ${color}.`;
});

assetContextMenu.querySelector('[data-asset-action="illuminated-foam"]').addEventListener('click', () => {
  const assetId = assetContextAssetId;
  closeAssetContextMenu();
  if (assetId) void beginIlluminatedFoamAssetDrag(assetId);
});

assetContextMenu.querySelector('[data-asset-action="delete"]').addEventListener('click', () => {
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
  if (result.mode === 'fabric-group') {
    selectionInfo.textContent = result.fabricType === 'mesh'
      ? `Tek parça Mesh (Delikli) Brandaya görsel uygulandı · ${fitLabel}.`
      : `Tek parça Lightbox Kumaşa görsel uygulandı · ${fitLabel}.`;
  } else if (result.mode === 'rect-group') {
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

renameProjectButton?.addEventListener('click', async () => {
  const currentName = projectNameInput.value.trim() || 'Adsız Proje';
  const projectNameSuffix = currentStand
    ? buildAutomaticProjectNameSuffix(currentStand.standType, currentStand.xCm, currentStand.yCm)
    : '';
  const editableName = getEditableProjectName(currentName, projectNameSuffix);
  const nextName = await requestProjectName({ defaultName: editableName, mode: 'rename', suffix: projectNameSuffix });
  if (!nextName || nextName === currentName) return;
  setProjectName(nextName);
  if (currentStand || autosaveController.isEnabled()) {
    try {
      autosaveController.clearPending();
      await persistActiveProject({ quiet: true });
      autosaveController.enableFromCurrentState();
      projectStatus.textContent = 'Proje adı değiştirildi ve kaydedildi: ' + nextName;
    } catch (error) {
      console.warn('Proje adı değiştirilemedi:', error);
      projectStatus.textContent = 'Proje adı değiştirildi ancak kaydedilemedi.';
    }
  } else {
    projectStatus.textContent = 'Proje adı hazır: ' + nextName;
  }
});

saveProjectButton.addEventListener('click', async () => {
  setButtonBusy(saveProjectButton, true, 'Kaydediliyor');
  projectStatus.textContent = 'Proje kaydediliyor…';
  try {
    autosaveController.clearPending();
    await persistActiveProject();
    autosaveController.enableFromCurrentState();
  } catch (error) {
    console.warn('Proje kaydedilemedi:', error);
    projectStatus.textContent = 'Proje kaydedilemedi.';
  } finally {
    setButtonBusy(saveProjectButton, false);
  }
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
  setButtonBusy(exportProjectButton, true, 'Hazırlanıyor');
  projectStatus.textContent = 'Proje ZIP hazırlanıyor…';
  try {
    if (projectId === activeProjectId) await persistActiveProject({ quiet: true });
    const project = await loadProject(projectId);
    if (!project) throw new Error('Dışarı aktarılacak proje bulunamadı.');
    const assets = await loadImageAssets(projectId);
    const JSZip = await loadJSZip();
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
    setButtonBusy(exportProjectButton, false);
  }
});

importProjectButton.addEventListener('click', () => importProjectFileInput.click());

importProjectFileInput.addEventListener('change', async () => {
  const file = importProjectFileInput.files?.[0];
  importProjectFileInput.value = '';
  if (!file) return;
  setButtonBusy(importProjectButton, true, 'Aktarılıyor');
  projectLoading.show('Proje içe aktarılıyor…', 'ZIP paketi ve görseller hazırlanıyor.');
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
    projectLoading.hide();
    setButtonBusy(importProjectButton, false);
  }
});

async function openStoredProject(projectId) {
  if (!projectId) {
    projectStatus.textContent = 'Açılacak kayıtlı proje yok.';
    return false;
  }

  projectLoading.show('Proje yükleniyor…', 'Görseller ve sahne hazırlanıyor.');
  setButtonBusy(openProjectButton, true, 'Açılıyor');
  projectStatus.textContent = 'Proje yükleniyor…';
  try {
    const project = await loadProject(projectId);
    if (!project) {
      projectStatus.textContent = 'Proje bulunamadı.';
      return false;
    }
    await restoreProject(project);
    return true;
  } catch (error) {
    console.warn('Proje açılamadı:', error);
    projectStatus.textContent = 'Proje açılamadı.';
    return false;
  } finally {
    projectLoading.hide();
    setButtonBusy(openProjectButton, false);
  }
}

function restoreProjectSelectToActiveProject() {
  const hasActiveOption = [...projectSelect.options]
    .some((option) => option.value === activeProjectId);
  if (hasActiveOption) projectSelect.value = activeProjectId;
  else projectSelect.selectedIndex = -1;
}

projectSelect.addEventListener('change', async () => {
  const projectId = projectSelect.value;
  if (!shouldConfirmProjectSwitch(activeProjectId, projectId)) return;

  const currentProjectName = projectNameInput.value.trim() || 'Adsız Proje';
  const targetProjectName = projectSelect.selectedOptions?.[0]?.textContent?.trim() || 'Adsız Proje';
  const confirmed = window.confirm(
    formatProjectSwitchMessage(currentProjectName, targetProjectName),
  );
  if (!confirmed) {
    restoreProjectSelectToActiveProject();
    projectStatus.textContent = 'Proje değişikliği iptal edildi.';
    return;
  }

  const opened = await openStoredProject(projectId);
  if (!opened) restoreProjectSelectToActiveProject();
});

openProjectButton.addEventListener('click', async () => {
  await openStoredProject(projectSelect.value);
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
  autosaveController.disable();
  imageAssets.forEach((asset) => {
    if (asset.url) URL.revokeObjectURL(asset.url);
  });
});

setStandEditingEnabled(false);
updateStageCreateState();
syncColorEditorFromHex(colorInput.value);
initializeAssetLibrary();
initHelpGuide();
refreshProjectList().catch((error) => console.warn('Proje listesi açılamadı:', error));