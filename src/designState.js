import { resolveModuleCatalogKey } from './catalog.js';
import { getTvDefinition } from './tvConfig.js';

const DEFAULT_PANEL_COLOR = '#ffffff';
const DEFAULT_SEPARATOR_COLOR = '#c79b63';
const STRIP_COUNT = 7;

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

function createEditablePanelState(stripIndex, color) {
  return {
    id: createId('surface'),
    stripIndex,
    color,
    imageAssetId: null,
    imageTransform: createDefaultImageTransform(),
  };
}

export function createFlatPanelModuleState(widthCm) {
  return {
    id: createId('module'),
    type: 'flat-panel',
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
      color: DEFAULT_SEPARATOR_COLOR,
    },
  };
}

export function createShowcaseModuleState(type, widthCm = 100) {
  if (type !== 'showcase-2' && type !== 'showcase-3') return null;

  return {
    id: createId('module'),
    type,
    widthCm,
    strips: Array.from(
      { length: STRIP_COUNT },
      (_, stripIndex) => createEditablePanelState(stripIndex, DEFAULT_PANEL_COLOR),
    ),
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
  if (Number(widthCm) !== 100) return null;

  return {
    id: createId('module'),
    type: 'door',
    widthCm: 100,
    // Kapı 2 m yüksekliğinde (alt 4 x 50 cm), üstte 3 x 50 cm panel kalır.
    strips: Array.from(
      { length: 3 },
      (_, index) => createEditablePanelState(index + 4, DEFAULT_PANEL_COLOR),
    ),
    // Kapı kanadı tek başına renk ve görsel alabilen bağımsız bir yüzeydir.
    surface: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
  };
}

export function createCounterModuleState(widthCm, options = {}) {
  const width = Number(widthCm);
  if (![100, 150, 200].includes(width)) return null;
  const shape = options.shape === 'L' ? 'L' : 'straight';
  const depthCm = shape === 'L' ? (Number(options.depthCm) || width) : (Number(options.depthCm) || 50);
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
  return { id: createId('module'), type: 'counter', shape, widthCm: width, depthCm, heightCm: 100, faces };
}

export function createBaseWallModuleState(widthCm) {
  const width = Number(widthCm);
  if (![100, 150, 200].includes(width)) return null;

  return {
    id: createId('module'),
    type: 'base-wall',
    widthCm: width,
    depthCm: 50,
    heightCm: 350,
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

export function createBaseModuleState(widthCm) {
  const width = Number(widthCm);
  if (![100, 150, 200].includes(width)) return null;

  return {
    id: createId('module'),
    type: 'base',
    widthCm: width,
    depthCm: 50,
    heightCm: 50,
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

export function createMiniFridgeModuleState() {
  return {
    id: createId('module'),
    type: 'mini-fridge',
    widthCm: 50,
    depthCm: 50,
    heightCm: 66,
  };
}

export function createKettleModuleState() {
  return {
    id: createId('module'),
    type: 'kettle',
    widthCm: 24,
    depthCm: 19,
    heightCm: 25,
  };
}

export function createCoatRackModuleState() {
  return {
    id: createId('module'),
    type: 'coat-rack',
    widthCm: 43,
    depthCm: 43,
    heightCm: 180,
  };
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

export function createTvModuleState(sizeInch = 42, descriptor = {}) {

  const definition = getTvDefinition(sizeInch);
  if (!definition) return null;
  return {
    id: createId('module'),
    type: definition.type,
    widthCm: definition.widthCm,
    depthCm: definition.depthCm,
    heightCm: definition.screenHeightCm,
    sizeInch: definition.sizeInch,
    screenWidthCm: Number(descriptor.screenWidthCm) || definition.screenWidthCm,
    screenHeightCm: Number(descriptor.screenHeightCm) || definition.screenHeightCm,
    videoWallRows: Math.max(1, Number(descriptor.videoWallRows) || 1),
    videoWallCols: Math.max(1, Number(descriptor.videoWallCols) || 1),
    panelScreenWidthCm: Number(descriptor.panelScreenWidthCm) || definition.screenWidthCm,
    panelScreenHeightCm: Number(descriptor.panelScreenHeightCm) || definition.screenHeightCm,
    widthCm: Number(descriptor.widthCm) || definition.widthCm,
    heightCm: Number(descriptor.screenHeightCm) || definition.screenHeightCm,
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
  'flat-panel': (descriptor) => createFlatPanelModuleState(descriptor.widthCm),
  base: (descriptor) => createBaseModuleState(descriptor.widthCm),
  'base-wall': (descriptor) => createBaseWallModuleState(descriptor.widthCm),
  counter: (descriptor) => createCounterModuleState(descriptor.widthCm, {
    shape: descriptor.shape,
    depthCm: descriptor.depthCm,
  }),
  separator: (descriptor) => createSeparatorModuleState(descriptor.widthCm, descriptor),
  shelf: (descriptor) => createShelfModuleState(descriptor.widthCm, descriptor.shelfCount),
  'sofa-set-classic': () => createBeigeSofaSetModuleState(),
  'table-chair-set-eames': () => createEamesTableChairSetModuleState(),
  'bar-stool': () => createBarStoolModuleState(),
  'mini-fridge': () => createMiniFridgeModuleState(),
  kettle: () => createKettleModuleState(),
  'coat-rack': () => createCoatRackModuleState(),
  'plastic-trash-bin': (descriptor) => createIndoorPlantModuleState(descriptor),
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