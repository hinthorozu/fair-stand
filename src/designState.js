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

export function createSeparatorModuleState(widthCm) {
  return {
    id: createId('module'),
    type: 'separator',
    widthCm,
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

export function createCounterModuleState(widthCm) {
  const width = Number(widthCm);
  if (![100, 150, 200].includes(width)) return null;

  return {
    id: createId('module'),
    type: 'counter',
    widthCm: width,
    depthCm: 50,
    heightCm: 100,
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

export function createSofaSetModuleState() {
  return {
    id: createId('module'),
    type: 'sofa-set',
    widthCm: 150,
    depthCm: 150,
    heightCm: 80,
    surface: {
      id: createId('surface'),
      color: DEFAULT_PANEL_COLOR,
    },
  };
}

export function createTableChairSetModuleState() {
  return {
    id: createId('module'),
    type: 'table-chair-set',
    widthCm: 150,
    depthCm: 150,
    heightCm: 90,
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
    widthCm: 50,
    depthCm: 50,
    heightCm: 80,
    surface: {
      id: createId('surface'),
      color: DEFAULT_PANEL_COLOR,
    },
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
