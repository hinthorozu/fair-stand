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

export function duplicateModuleState(moduleState) {
  if (!moduleState) return null;
  const duplicate = JSON.parse(JSON.stringify(moduleState));
  duplicate.id = createId('module');
  if (Array.isArray(duplicate.strips)) {
    duplicate.strips = duplicate.strips.map((strip, stripIndex) => ({
      ...strip,
      id: createId('surface'),
      stripIndex,
      imageTransform: strip.imageTransform ? { ...strip.imageTransform } : createDefaultImageTransform(),
    }));
  }
  if (duplicate.surface) {
    duplicate.surface = {
      ...duplicate.surface,
      id: createId('surface'),
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
  return modules.reduce((sum, module) => sum + module.widthCm, 0);
}

export function moduleWidths(modules) {
  return modules.map((module) => module.widthCm);
}
