const DEFAULT_GHOST_BEHAVIOR = Object.freeze({
  kind: 'silhouette',
  renderer: 'module-silhouette',
  opacity: 0.38,
});

const WALL_BEHAVIOR = Object.freeze({
  placement: 'wall',
  moveSnapCm: 50,
  rotationStepDeg: 90,
  defaultRotationDeg: 0,
  allowSideInsert: true,
  collision: 'segment',
  ghost: DEFAULT_GHOST_BEHAVIOR,
});

const DEFAULT_BEHAVIOR = WALL_BEHAVIOR;

const TYPE_BEHAVIORS = Object.freeze({
  'flat-panel': WALL_BEHAVIOR,
  'showcase-3': WALL_BEHAVIOR,
  'showcase-2': WALL_BEHAVIOR,
  shelf: WALL_BEHAVIOR,
  door: WALL_BEHAVIOR,
  'base-wall': WALL_BEHAVIOR,
  separator: WALL_BEHAVIOR,
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
  }),
  'table-chair-set-eames': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
  }),
  'bar-stool': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 45,
    defaultRotationDeg: 270,
    allowSideInsert: true,
    collision: 'footprint',
  }),
  'mini-fridge': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
  }),
  kettle: Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    // Kettle lives at the mini-fridge top elevation, so its 2D footprint may overlap the fridge.
    collision: 'none',
  }),
  'coat-rack': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
  }),
  'indoor-plant-1': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
  }),
  'illuminated-foam': Object.freeze({
    placement: 'wall-overlay',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: false,
    collision: 'none',
  }),
  tv: Object.freeze({
    placement: 'wall-overlay',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: false,
    collision: 'none',
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

export function hasExplicitModuleBehavior(moduleOrType) {
  const module = normalizeDescriptor(moduleOrType);
  const type = module.type ?? null;
  return type !== null && Object.hasOwn(TYPE_BEHAVIORS, type);
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
    return { ...base, defaultRotationDeg: 270 };
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

export function resolveModuleRotationDeltaDeg(moduleOrType, requestedDeltaDeg) {
  const requested = Number(requestedDeltaDeg) || 0;
  if (requested === 0) return 0;
  const stepDeg = getModuleRotationStepDeg(moduleOrType);
  return requested < 0 ? -stepDeg : stepDeg;
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
