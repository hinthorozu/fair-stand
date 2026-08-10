const DEFAULT_PANEL_COLOR = '#ffffff';
const STRIP_COUNT = 7;

function createId(prefix) {
  const suffix = globalThis.crypto?.randomUUID?.()
    ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${suffix}`;
}

export function createFlatPanelModuleState(widthCm) {
  return {
    id: createId('module'),
    type: 'flat-panel',
    widthCm,
    strips: Array.from({ length: STRIP_COUNT }, (_, stripIndex) => ({
      id: createId('surface'),
      stripIndex,
      color: DEFAULT_PANEL_COLOR,
      imageAssetId: null,
      imageTransform: {
        offsetX: 0,
        offsetY: 0,
        repeatX: 1,
        repeatY: 1,
        rotation: 0,
      },
    })),
  };
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
