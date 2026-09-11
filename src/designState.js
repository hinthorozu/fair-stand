import { resolveModuleCatalogKey } from './catalog.js';
import { getCommercialItemForType, getItem, getShowcaseBodyDefinition, getShowcaseItemKeyForType, resolveWallMediaMetrics } from './items.js';
import { getDoorLeafProductionItem, getProductionItem } from './productionParts.js';
import { getItemSurfaceCapabilities } from './itemCapabilities.js';

const DEFAULT_PANEL_COLOR = '#ffffff';
const STRIP_COUNT = 7;

function separatorDefaultColor(widthCm) {
  const itemKey = Number(widthCm) === 50 ? 'separator_panel_48_5' : 'separator_panel_98';
  const defaultColor = getProductionItem(itemKey)?.defaultColor;
  if (!Number.isInteger(defaultColor)) {
    throw new TypeError(`Missing canonical separator defaultColor for ${itemKey}.`);
  }
  return `#${defaultColor.toString(16).padStart(6, '0')}`;
}

function createId(prefix) {
  const suffix = globalThis.crypto?.randomUUID?.()
    ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${suffix}`;
}

export function createDefaultImageTransform() {
  return {
    mode: 'single',
    offsetX: 0,
    offsetY: 0,
    repeatX: 1,
    repeatY: 1,
    rotation: 0,
  };
}

function itemDefaultColorHex(item) {
  const defaultColor = item?.defaultColor;
  if (!Number.isInteger(defaultColor)) {
    throw new TypeError(`Missing canonical defaultColor for ${item?.itemKey ?? 'unknown Item'}.`);
  }
  return `#${defaultColor.toString(16).padStart(6, '0')}`;
}

function createEditableItemSurfaceState(item, stripIndex = null) {
  const capabilities = getItemSurfaceCapabilities(item);
  if (!capabilities.color && !capabilities.image) {
    throw new TypeError(`Editable surface capability is required for ${item?.itemKey ?? 'unknown Item'}.`);
  }
  return {
    id: createId('surface'),
    itemKey: item.itemKey,
    stripIndex,
    ...(capabilities.color ? { color: itemDefaultColorHex(item) } : {}),
    ...(capabilities.image ? { imageAssetId: null, imageTransform: createDefaultImageTransform() } : {}),
  };
}

function createEditablePanelState(stripIndex, color) {
  return {
    id: createId('surface'),
    stripIndex,
    color,
    imageAssetId: null,
    imageTransform: createDefaultImageTransform(),
  };
}

const WALL_WIDTH_TO_ITEM_KEY = Object.freeze({
  50: 'wall_50',
  100: 'wall_100',
  150: 'wall_150',
  200: 'wall_200',
});

function resolveFlatPanelItemKey(widthCmOrDescriptor) {
  if (widthCmOrDescriptor && typeof widthCmOrDescriptor === 'object' && !Array.isArray(widthCmOrDescriptor)) {
    const explicitKey = widthCmOrDescriptor.itemKey ?? widthCmOrDescriptor.catalogKey ?? null;
    if (explicitKey && getItem(explicitKey)?.type === 'flat-panel') return explicitKey;
    return WALL_WIDTH_TO_ITEM_KEY[Number(widthCmOrDescriptor.widthCm)] ?? null;
  }
  return WALL_WIDTH_TO_ITEM_KEY[Number(widthCmOrDescriptor)] ?? null;
}

export function createFlatPanelModuleState(widthCmOrDescriptor) {
  const itemKey = resolveFlatPanelItemKey(widthCmOrDescriptor);
  const item = itemKey ? getItem(itemKey) : null;
  if (!item || item.type !== 'flat-panel') return null;
  const widthCm = Number(item.dimensions.widthCm);

  return {
    id: createId('module'),
    itemKey: item.itemKey,
    catalogKey: item.itemKey,
    type: item.type,
    widthCm,
    strips: Array.from(
      { length: STRIP_COUNT },
      (_, stripIndex) => createEditablePanelState(stripIndex, DEFAULT_PANEL_COLOR),
    ),
  };
}

export function createSeparatorModuleState(widthCm, descriptor = {}) {
  return {
    id: createId('module'),
    type: 'separator',
    widthCm,
    modelFile: descriptor.modelFile ?? null,
    surface: {
      id: createId('surface'),
      color: separatorDefaultColor(widthCm),
    },
  };
}

export function createShowcaseModuleState(type, widthCm = 100) {
  const itemKey = getShowcaseItemKeyForType(type);
  if (!itemKey) return null;
  const showcaseItem = getItem(itemKey);
  const canonicalWidthCm = Number(showcaseItem?.dimensions?.widthCm);
  if (!showcaseItem || Number(widthCm) !== canonicalWidthCm) return null;
  const bodyDefinition = getShowcaseBodyDefinition(showcaseItem);

  return {
    id: createId('module'),
    itemKey: showcaseItem.itemKey,
    type: showcaseItem.type,
    widthCm: canonicalWidthCm,
    eyeCount: Number(showcaseItem.eyeCount),
    strips: Array.from(
      { length: STRIP_COUNT },
      (_, stripIndex) => createEditablePanelState(stripIndex, DEFAULT_PANEL_COLOR),
    ),
    bodySurface: {
      id: createId('surface'),
      color: itemDefaultColorHex(bodyDefinition.sideItem),
    },
  };
}

export function createShelfModuleState(widthCm, shelfCount = 2) {
  const width = Number(widthCm);
  const count = Number(shelfCount);
  if (![100, 150, 200].includes(width) || ![2, 3].includes(count)) return null;

  return {
    id: createId('module'),
    type: 'shelf',
    widthCm: width,
    shelfCount: count,
    shelfLightingOn: false,
    strips: Array.from(
      { length: STRIP_COUNT },
      (_, stripIndex) => createEditablePanelState(stripIndex, DEFAULT_PANEL_COLOR),
    ),
  };
}

export function createDoorModuleState(widthCm = 100) {
  const doorItem = getItem('door_100');
  const canonicalWidthCm = Number(doorItem?.dimensions?.widthCm);
  if (!doorItem || Number(widthCm) !== canonicalWidthCm) return null;
  const doorLeafItem = getDoorLeafProductionItem(canonicalWidthCm);
  if (!doorLeafItem) throw new TypeError(`Missing canonical door leaf Item for ${canonicalWidthCm} cm door module.`);

  return {
    id: createId('module'),
    itemKey: doorItem.itemKey,
    type: doorItem.type,
    widthCm: canonicalWidthCm,
    // Üstte kalan üç duvar paneli parent kapı modülünün ayrı editable surface'leridir.
    strips: Array.from(
      { length: 3 },
      (_, index) => createEditablePanelState(index + 4, DEFAULT_PANEL_COLOR),
    ),
    // Fiziksel ahşap kapı kanadı canonical door_leaf Item kimliği/default'u ile başlar.
    surface: createEditableItemSurfaceState(doorLeafItem),
  };
}

const COUNTER_WIDTH_SHAPE_TO_ITEM_KEY = Object.freeze({
  '100': 'desk_banko_100',
  '150': 'desk_banko_150',
  '200': 'desk_banko_200',
  '100_L': 'desk_banko_100_L',
  '150_L': 'desk_banko_150_L',
  '200_L': 'desk_banko_200_L',
});

function resolveCounterItemKey(widthCmOrDescriptor, options = {}) {
  if (widthCmOrDescriptor && typeof widthCmOrDescriptor === 'object' && !Array.isArray(widthCmOrDescriptor)) {
    const explicitKey = widthCmOrDescriptor.itemKey ?? widthCmOrDescriptor.catalogKey ?? null;
    if (explicitKey && getItem(explicitKey)?.type === 'counter') return explicitKey;
    const width = Number(widthCmOrDescriptor.widthCm);
    const shape = widthCmOrDescriptor.shape === 'L' || options.shape === 'L' ? 'L' : 'straight';
    const mapKey = shape === 'L' ? `${width}_L` : String(width);
    return COUNTER_WIDTH_SHAPE_TO_ITEM_KEY[mapKey] ?? null;
  }
  const width = Number(widthCmOrDescriptor);
  const shape = options.shape === 'L' ? 'L' : 'straight';
  const mapKey = shape === 'L' ? `${width}_L` : String(width);
  return COUNTER_WIDTH_SHAPE_TO_ITEM_KEY[mapKey] ?? null;
}

export function createCounterModuleState(widthCmOrDescriptor, options = {}) {
  const itemKey = resolveCounterItemKey(widthCmOrDescriptor, options);
  const item = itemKey ? getItem(itemKey) : null;
  if (!item || item.type !== 'counter') return null;
  const shape = item.shape === 'L' ? 'L' : 'straight';
  const { widthCm, depthCm, heightCm } = item.dimensions;
  const faces = {
    frontLower: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
    frontUpper: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
    leftLower: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
    leftUpper: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
    rightLower: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
    rightUpper: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
  };
  if (shape === 'L') {
    faces.returnLower = createEditablePanelState(null, DEFAULT_PANEL_COLOR);
    faces.returnUpper = createEditablePanelState(null, DEFAULT_PANEL_COLOR);
  }
  return {
    id: createId('module'),
    itemKey: item.itemKey,
    catalogKey: item.itemKey,
    type: item.type,
    shape,
    widthCm,
    depthCm,
    heightCm,
    faces,
  };
}

const WALL_BASE_WIDTH_TO_ITEM_KEY = Object.freeze({
  100: 'wall_base_100',
  150: 'wall_base_150',
  200: 'wall_base_200',
});

function resolveBaseWallItemKey(widthCmOrDescriptor) {
  if (widthCmOrDescriptor && typeof widthCmOrDescriptor === 'object' && !Array.isArray(widthCmOrDescriptor)) {
    const explicitKey = widthCmOrDescriptor.itemKey ?? widthCmOrDescriptor.catalogKey ?? null;
    if (explicitKey && getItem(explicitKey)?.type === 'base-wall') return explicitKey;
    return WALL_BASE_WIDTH_TO_ITEM_KEY[Number(widthCmOrDescriptor.widthCm)] ?? null;
  }
  return WALL_BASE_WIDTH_TO_ITEM_KEY[Number(widthCmOrDescriptor)] ?? null;
}

export function createBaseWallModuleState(widthCmOrDescriptor) {
  const itemKey = resolveBaseWallItemKey(widthCmOrDescriptor);
  const item = itemKey ? getItem(itemKey) : null;
  if (!item || item.type !== 'base-wall') return null;
  const { widthCm, depthCm, heightCm } = item.dimensions;

  return {
    id: createId('module'),
    itemKey: item.itemKey,
    catalogKey: item.itemKey,
    type: item.type,
    widthCm,
    depthCm,
    heightCm,
    strips: Array.from(
      { length: STRIP_COUNT },
      (_, stripIndex) => createEditablePanelState(stripIndex, DEFAULT_PANEL_COLOR),
    ),
    faces: {
      front: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
      left: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
      right: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
    },
  };
}

const BASE_WIDTH_TO_ITEM_KEY = Object.freeze({
  100: 'BASE_100',
  150: 'BASE_150',
  200: 'BASE_200',
});

function resolveBaseItemKey(widthCmOrDescriptor) {
  if (widthCmOrDescriptor && typeof widthCmOrDescriptor === 'object' && !Array.isArray(widthCmOrDescriptor)) {
    const explicitKey = widthCmOrDescriptor.itemKey ?? widthCmOrDescriptor.catalogKey ?? null;
    if (explicitKey && getItem(explicitKey)?.type === 'base') return explicitKey;
    return BASE_WIDTH_TO_ITEM_KEY[Number(widthCmOrDescriptor.widthCm)] ?? null;
  }
  return BASE_WIDTH_TO_ITEM_KEY[Number(widthCmOrDescriptor)] ?? null;
}

export function createBaseModuleState(widthCmOrDescriptor) {
  const itemKey = resolveBaseItemKey(widthCmOrDescriptor);
  const item = itemKey ? getItem(itemKey) : null;
  if (!item || item.type !== 'base') return null;
  const { widthCm, depthCm, heightCm } = item.dimensions;

  return {
    id: createId('module'),
    itemKey: item.itemKey,
    catalogKey: item.itemKey,
    type: item.type,
    widthCm,
    depthCm,
    heightCm,
    faces: {
      front: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
      left: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
      right: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
    },
  };
}

export function createBeigeSofaSetModuleState() {
  return {
    id: createId('module'),
    type: 'sofa-set-classic',
    widthCm: 150,
    depthCm: 150,
    heightCm: 78,
    surface: {
      id: createId('surface'),
      color: '#ffffff',
    },
  };
}

export function createEamesTableChairSetModuleState() {
  return {
    id: createId('module'),
    type: 'table-chair-set-eames',
    widthCm: 150,
    depthCm: 150,
    heightCm: 82,
    chairCount: 4,
    surface: {
      id: createId('surface'),
      color: DEFAULT_PANEL_COLOR,
    },
  };
}


export function createBarStoolModuleState() {
  return {
    id: createId('module'),
    type: 'bar-stool',
    widthCm: 60,
    depthCm: 55,
    heightCm: 121,
    surface: {
      id: createId('surface'),
      color: DEFAULT_PANEL_COLOR,
    },
  };
}

function createCommercialModuleState(type) {
  const item = getCommercialItemForType(type);
  const state = {
    id: createId('module'), itemKey: item.itemKey, catalogKey: item.itemKey,
    type: item.type, ...item.dimensions,
  };
  if (Object.hasOwn(item, 'preserveModelScale')) {
    state.modelFile = item.modelFile;
    state.modelRotationYDeg = item.modelRotationYDeg;
    state.visualRotationYDeg = item.visualRotationYDeg;
    state.preserveModelScale = item.preserveModelScale;
  }
  return state;
}

export function createMiniFridgeModuleState() {
  return createCommercialModuleState('mini-fridge');
}

export function createKettleModuleState() {
  return createCommercialModuleState('kettle');
}

export function createCoatRackModuleState() {
  return createCommercialModuleState('coat-rack');
}

export function createPlasticTrashBinModuleState() {
  return createCommercialModuleState('plastic-trash-bin');
}

export function createIndoorPlantModuleState(descriptor = {}) {
  const modelFile = descriptor.modelFile ?? 'indoor_plants.glb';
  const isLongPlanter = /^saksi_bitkili_/i.test(modelFile);
  return {
    id: createId('module'),
    type: 'indoor-plant-1',
    widthCm: Number(descriptor.widthCm) || 60,
    depthCm: Number(descriptor.depthCm) || 60,
    heightCm: Number(descriptor.heightCm) || 120,
    modelFile,
    modelRotationYDeg: Number(descriptor.modelRotationYDeg) || 0,
    preserveModelScale: Boolean(descriptor.preserveModelScale),
    ...(isLongPlanter ? {
      surface: {
        id: createId('surface'),
        color: DEFAULT_PANEL_COLOR,
      },
    } : {}),
  };
}

export function createIlluminatedFoamModuleState(imageAssetId, descriptor = {}) {
  const widthCm = Math.max(10, Number(descriptor.widthCm) || 200);
  const heightCm = Math.max(5, Number(descriptor.heightCm) || 50);
  return {
    id: createId('module'),
    type: 'illuminated-foam',
    imageAssetId,
    widthCm,
    heightCm,
    depthCm: 3.5,
    wallGapCm: 1.5,
    haloColor: /^#[0-9a-fA-F]{6}$/.test(String(descriptor.haloColor ?? '')) ? String(descriptor.haloColor).toLowerCase() : '#ffffff',
  };
}

const TV_SIZE_INCH_TO_ITEM_KEY = Object.freeze({ 42: 'TV_42', 55: 'TV_55', 65: 'TV_65' });

function resolveWallMediaItemKey(sizeInch, descriptor) {
  const explicitKey = descriptor.itemKey ?? descriptor.catalogKey ?? null;
  if (explicitKey && getItem(explicitKey)?.type === 'tv') return explicitKey;
  return TV_SIZE_INCH_TO_ITEM_KEY[Number(sizeInch)] ?? null;
}

export function createTvModuleState(sizeInch = 42, descriptor = {}) {
  const itemKey = resolveWallMediaItemKey(sizeInch, descriptor);
  const metrics = itemKey ? resolveWallMediaMetrics(itemKey) : null;
  if (!metrics) return null;
  return {
    id: createId('module'),
    itemKey: metrics.itemKey,
    catalogKey: metrics.itemKey,
    type: metrics.type,
    widthCm: metrics.widthCm,
    depthCm: metrics.depthCm,
    heightCm: metrics.screenHeightCm,
    sizeInch: metrics.sizeInch,
    screenWidthCm: metrics.screenWidthCm,
    screenHeightCm: metrics.screenHeightCm,
    videoWallRows: metrics.videoWallRows,
    videoWallCols: metrics.videoWallCols,
    panelScreenWidthCm: metrics.panelScreenWidthCm,
    panelScreenHeightCm: metrics.panelScreenHeightCm,
  };
}

export function createLedFloodlightModuleState() {
  return {
    id: createId('module'),
    type: 'led-floodlight',
    widthCm: 50,
    depthCm: 20,
    heightCm: 35,
    surface: {
      id: createId('surface'),
      color: '#17191c',
    },
  };
}

const MODULE_STATE_FACTORIES = Object.freeze({
  'flat-panel': (descriptor) => createFlatPanelModuleState(descriptor),
  base: (descriptor) => createBaseModuleState(descriptor),
  'base-wall': (descriptor) => createBaseWallModuleState(descriptor),
  counter: (descriptor) => createCounterModuleState(descriptor),
  separator: (descriptor) => createSeparatorModuleState(descriptor.widthCm, descriptor),
  shelf: (descriptor) => createShelfModuleState(descriptor.widthCm, descriptor.shelfCount),
  'sofa-set-classic': () => createBeigeSofaSetModuleState(),
  'table-chair-set-eames': () => createEamesTableChairSetModuleState(),
  'bar-stool': () => createBarStoolModuleState(),
  'mini-fridge': () => createMiniFridgeModuleState(),
  kettle: () => createKettleModuleState(),
  'coat-rack': () => createCoatRackModuleState(),
  'plastic-trash-bin': () => createPlasticTrashBinModuleState(),
  'indoor-plant-1': (descriptor) => createIndoorPlantModuleState(descriptor),
  tv: (descriptor) => createTvModuleState(descriptor.sizeInch ?? 42, descriptor),
  'led-floodlight': () => createLedFloodlightModuleState(),
  door: (descriptor) => createDoorModuleState(descriptor.widthCm),
  'showcase-2': (descriptor) => createShowcaseModuleState(descriptor.type, descriptor.widthCm),
  'showcase-3': (descriptor) => createShowcaseModuleState(descriptor.type, descriptor.widthCm),
  'illuminated-foam': (descriptor, options) => createIlluminatedFoamModuleState(
    options.imageAssetId ?? descriptor.imageAssetId ?? null,
    descriptor,
  ),
});

export function createModuleStateFromDescriptor(
  descriptor,
  { catalogKey = null, preservePlacement = false, imageAssetId = null } = {},
) {
  if (!descriptor || typeof descriptor !== 'object' || Array.isArray(descriptor)) return null;
  const factory = MODULE_STATE_FACTORIES[descriptor.type];
  if (!factory) return null;

  const state = factory(descriptor, { imageAssetId });
  if (!state) return null;

  const resolvedCatalogKey = resolveModuleCatalogKey({
    ...descriptor,
    catalogKey: catalogKey ?? descriptor.catalogKey ?? null,
  });
  if (resolvedCatalogKey) state.catalogKey = resolvedCatalogKey;
  else delete state.catalogKey;

  if (preservePlacement && descriptor.placement) {
    state.placement = { ...descriptor.placement };
  }
  return state;
}


/**
 * Normalizes persisted child Item identity without replacing user overrides.
 * Legacy door projects did not store the physical leaf itemKey on surface state.
 */
export function normalizeModuleItemState(moduleState) {
  if (!moduleState) return moduleState;

  if (moduleState.type === 'tv') {
    const resolvedKey = resolveModuleCatalogKey(moduleState);
    if (resolvedKey && getItem(resolvedKey)?.type === 'tv') {
      moduleState.itemKey = resolvedKey;
      const metrics = resolveWallMediaMetrics(resolvedKey);
      if (metrics) {
        moduleState.widthCm = metrics.widthCm;
        moduleState.screenWidthCm = metrics.screenWidthCm;
        moduleState.screenHeightCm = metrics.screenHeightCm;
        moduleState.heightCm = metrics.screenHeightCm;
        moduleState.depthCm = metrics.depthCm;
      }
    }
    return moduleState;
  }

  if (moduleState.type === 'base') {
    const resolvedKey = resolveModuleCatalogKey(moduleState);
    if (resolvedKey && getItem(resolvedKey)?.type === 'base') {
      moduleState.itemKey = resolvedKey;
    }
    return moduleState;
  }

  if (moduleState.type === 'counter') {
    const resolvedKey = resolveModuleCatalogKey(moduleState);
    if (resolvedKey && getItem(resolvedKey)?.type === 'counter') {
      moduleState.itemKey = resolvedKey;
    }
    return moduleState;
  }

  if (moduleState.type === 'flat-panel') {
    const resolvedKey = resolveModuleCatalogKey(moduleState);
    if (resolvedKey && getItem(resolvedKey)?.type === 'flat-panel') {
      moduleState.itemKey = resolvedKey;
    }
    return moduleState;
  }

  if (moduleState.type === 'base-wall') {
    const resolvedKey = resolveModuleCatalogKey(moduleState);
    if (resolvedKey && getItem(resolvedKey)?.type === 'base-wall') {
      moduleState.itemKey = resolvedKey;
    }
    return moduleState;
  }

  if (moduleState.type === 'door') {
    const doorItem = getItem('door_100');
    if (!doorItem || Number(moduleState.widthCm) !== Number(doorItem.dimensions?.widthCm)) return moduleState;
    moduleState.itemKey = doorItem.itemKey;
    const doorLeafItem = getDoorLeafProductionItem(moduleState.widthCm);
    if (!doorLeafItem) return moduleState;
    if (!moduleState.surface) {
      moduleState.surface = createEditableItemSurfaceState(doorLeafItem);
      return moduleState;
    }
    const surface = moduleState.surface;
    surface.itemKey = doorLeafItem.itemKey;
    if (!surface.color) surface.color = itemDefaultColorHex(doorLeafItem);
    if (!Object.hasOwn(surface, 'imageAssetId')) surface.imageAssetId = null;
    if (!surface.imageTransform) surface.imageTransform = createDefaultImageTransform();
    return moduleState;
  }

  const showcaseItemKey = getShowcaseItemKeyForType(moduleState.type);
  if (!showcaseItemKey) return moduleState;
  const showcaseItem = getItem(showcaseItemKey);
  if (!showcaseItem || Number(moduleState.widthCm) !== Number(showcaseItem.dimensions?.widthCm)) return moduleState;
  const bodyDefinition = getShowcaseBodyDefinition(showcaseItem);
  moduleState.itemKey = showcaseItem.itemKey;
  moduleState.eyeCount = Number(showcaseItem.eyeCount);
  if (!moduleState.bodySurface) {
    moduleState.bodySurface = {
      id: createId('surface'),
      color: itemDefaultColorHex(bodyDefinition.sideItem),
    };
  } else {
    if (!moduleState.bodySurface.id) moduleState.bodySurface.id = createId('surface');
    if (!moduleState.bodySurface.color) moduleState.bodySurface.color = itemDefaultColorHex(bodyDefinition.sideItem);
    delete moduleState.bodySurface.imageAssetId;
    delete moduleState.bodySurface.imageTransform;
  }
  return moduleState;
}

export function duplicateModuleState(moduleState) {
  if (!moduleState) return null;
  const duplicate = JSON.parse(JSON.stringify(moduleState));
  duplicate.id = createId('module');
  if (Array.isArray(duplicate.strips)) {
    duplicate.strips = duplicate.strips.map((strip, stripIndex) => ({
      ...strip,
      id: createId('surface'),
      stripIndex: Number.isInteger(strip.stripIndex) ? strip.stripIndex : stripIndex,
      imageTransform: strip.imageTransform ? { ...strip.imageTransform } : createDefaultImageTransform(),
    }));
  }
  if (duplicate.faces) {
    duplicate.faces = Object.fromEntries(
      Object.entries(duplicate.faces).map(([faceKey, face]) => [
        faceKey,
        {
          ...face,
          id: createId('surface'),
          imageTransform: face.imageTransform
            ? { ...face.imageTransform }
            : createDefaultImageTransform(),
        },
      ]),
    );
  }
  if (duplicate.bodySurface) {
    duplicate.bodySurface = {
      ...duplicate.bodySurface,
      id: createId('surface'),
    };
  }
  if (duplicate.surface) {
    duplicate.surface = {
      ...duplicate.surface,
      id: createId('surface'),
      ...(
        'imageAssetId' in duplicate.surface
          ? {
              imageTransform: duplicate.surface.imageTransform
                ? { ...duplicate.surface.imageTransform }
                : createDefaultImageTransform(),
            }
          : {}
      ),
    };
  }
  return duplicate;
}

/**
 * Bir panele renk uygulamak, o hücrede atanmış görselin yerini alır.
 * Renk-only modüllerde (ör. separatör) görsel state'i oluşturulmaz.
 */
export function applyColorOverride(surfaceState, color) {
  if (!surfaceState) return null;
  surfaceState.color = color;
  if ('imageAssetId' in surfaceState) {
    surfaceState.imageAssetId = null;
    surfaceState.imageTransform = createDefaultImageTransform();
  }
  return surfaceState;
}

/**
 * Otomatik duvar yeniden oluşturulurken aynı sıradaki aynı genişlikteki
 * modülleri tekrar kullanır. Böylece mevcut renk/görsel state'i korunur.
 */
export function reconcileWallModules(previousModules, widthsCm) {
  return widthsCm.map((widthCm, index) => {
    const previous = previousModules[index];
    if (previous?.type === 'flat-panel' && previous.widthCm === widthCm) {
      return previous;
    }
    return createFlatPanelModuleState(widthCm);
  });
}

export function totalWallWidthCm(modules) {
  return modules.reduce(
    (sum, module) => sum + (module?.type === 'led-floodlight' ? 0 : Number(module?.widthCm) || 0),
    0,
  );
}

export function moduleWidths(modules) {
  return modules
    .filter((module) => module?.type !== 'led-floodlight')
    .map((module) => module.widthCm);
}
