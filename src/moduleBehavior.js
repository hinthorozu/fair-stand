const DEFAULT_GHOST_BEHAVIOR = Object.freeze({
  kind: 'proxy',
  renderer: 'proxy',
  opacity: 0.30,
});

const DEFAULT_BEHAVIOR = Object.freeze({
  placement: 'wall',
  moveSnapCm: 50,
  rotationStepDeg: 90,
  defaultRotationDeg: 0,
  allowSideInsert: true,
  collision: 'segment',
  ghost: DEFAULT_GHOST_BEHAVIOR,
});

const TYPE_BEHAVIORS = Object.freeze({
  counter: Object.freeze({
    placement: 'free',
    moveSnapCm: 50,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
  }),
  base: Object.freeze({
    placement: 'free',
    moveSnapCm: 50,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
  }),
  'sofa-set-classic': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
    ghost: Object.freeze({ kind: 'custom', renderer: 'sofa-set-classic', opacity: 0.38 }),
  }),
  'table-chair-set-eames': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
    ghost: Object.freeze({ kind: 'custom', renderer: 'table-chair-set-eames', opacity: 0.38 }),
  }),
  'bar-stool': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 45,
    defaultRotationDeg: 270,
    allowSideInsert: true,
    collision: 'footprint',
    ghost: Object.freeze({ kind: 'real-model', renderer: 'bar-stool', opacity: 0.38 }),
  }),
  tv: Object.freeze({
    placement: 'wall-overlay',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: false,
    collision: 'none',
    ghost: Object.freeze({ kind: 'real-model', renderer: 'tv', opacity: 0.38 }),
  }),
  'led-floodlight': Object.freeze({
    placement: 'top',
    moveSnapCm: 20,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'none',
  }),
});

const STRAIGHT_COUNTER_WIDTHS_CM = new Set([100, 150, 200]);

function normalizeDescriptor(moduleOrType) {
  if (typeof moduleOrType === 'string') return { type: moduleOrType };
  return moduleOrType ?? {};
}

export function getModuleBehavior(moduleOrType) {
  const module = normalizeDescriptor(moduleOrType);
  const type = module.type ?? null;
  const declared = TYPE_BEHAVIORS[type] ?? DEFAULT_BEHAVIOR;
  const base = declared.ghost
    ? declared
    : { ...declared, ghost: DEFAULT_GHOST_BEHAVIOR };

  // Corner Bankos all enter the scene with the verified customer-facing L orientation.
  // Keep their geometry and 90-degree rotation behavior unchanged.
  if (type === 'counter' && module.shape === 'L') {
    return { ...base, defaultRotationDeg: 180 };
  }

  // Only the verified straight Banko family (100/150/200) gets 45-degree turns.
  if (
    type === 'counter'
    && module.shape !== 'L'
    && STRAIGHT_COUNTER_WIDTHS_CM.has(Number(module.widthCm))
  ) {
    return { ...base, rotationStepDeg: 45 };
  }

  return base;
}

export function getModuleRotationStepDeg(moduleOrType) {
  return Number(getModuleBehavior(moduleOrType).rotationStepDeg) || 90;
}

export function getModuleDefaultRotationDeg(moduleOrType) {
  return Number(getModuleBehavior(moduleOrType).defaultRotationDeg) || 0;
}

export function getModuleMoveSnapCm(moduleOrType) {
  return Number(getModuleBehavior(moduleOrType).moveSnapCm) || 50;
}

export function getModuleGhostBehavior(moduleOrType) {
  return getModuleBehavior(moduleOrType).ghost ?? DEFAULT_GHOST_BEHAVIOR;
}

export function isFreePlacementModule(moduleOrType) {
  return getModuleBehavior(moduleOrType).placement === 'free';
}

export function isTopPlacementModule(moduleOrType) {
  return getModuleBehavior(moduleOrType).placement === 'top';
}

export function isWallOverlayModule(moduleOrType) {
  return getModuleBehavior(moduleOrType).placement === 'wall-overlay';
}
