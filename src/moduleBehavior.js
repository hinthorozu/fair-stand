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
  magneticSnap: 'standard',
  connectionEndpoint: 'segment',
  collisionDepth: 'physical',
  endpointContact: 'standard',
  boundarySnap: 'stand-edge',
  sideInsertRotation: 'inherit',
  supportsWallOverlayMount: true,
  wallCapacity: 'include',
  ghost: DEFAULT_GHOST_BEHAVIOR,
});

const DEFAULT_BEHAVIOR = WALL_BEHAVIOR;

function freeBehavior(overrides = {}) {
  return Object.freeze({
    placement: 'free',
    moveSnapCm: 50,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
    magneticSnap: 'standard',
    connectionEndpoint: 'segment',
    collisionDepth: 'physical',
    endpointContact: 'standard',
    boundarySnap: 'stand-edge',
    sideInsertRotation: 'inherit',
    supportsWallOverlayMount: false,
    wallCapacity: 'include',
    ghost: DEFAULT_GHOST_BEHAVIOR,
    ...overrides,
  });
}

function overlayBehavior(overrides = {}) {
  return Object.freeze({
    placement: 'wall-overlay',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: false,
    collision: 'none',
    magneticSnap: 'none',
    connectionEndpoint: 'segment',
    collisionDepth: 'physical',
    endpointContact: 'standard',
    boundarySnap: 'stand-edge',
    sideInsertRotation: 'inherit',
    supportsWallOverlayMount: false,
    wallCapacity: 'include',
    ghost: DEFAULT_GHOST_BEHAVIOR,
    ...overrides,
  });
}

const TYPE_BEHAVIORS = Object.freeze({
  'flat-panel': WALL_BEHAVIOR,
  'showcase-3': WALL_BEHAVIOR,
  'showcase-2': WALL_BEHAVIOR,
  shelf: WALL_BEHAVIOR,
  door: WALL_BEHAVIOR,
  'base-wall': Object.freeze({
    ...WALL_BEHAVIOR,
    collisionDepth: 'wall-backbone',
  }),
  separator: WALL_BEHAVIOR,
  counter: freeBehavior({
    connectionEndpoint: 'logical-fixture',
  }),
  base: freeBehavior({
    connectionEndpoint: 'logical-fixture',
  }),
  'sofa-set-classic': freeBehavior({
    moveSnapCm: 10,
    boundarySnap: 'wall-inner-face',
  }),
  'table-chair-set-eames': freeBehavior({
    moveSnapCm: 10,
    boundarySnap: 'wall-inner-face',
  }),
  'bar-stool': freeBehavior({
    moveSnapCm: 10,
    rotationStepDeg: 45,
    defaultRotationDeg: 270,
    sideInsertRotation: 'default',
  }),
  'mini-fridge': freeBehavior({
    moveSnapCm: 10,
    magneticSnap: 'none',
  }),
  kettle: freeBehavior({
    moveSnapCm: 10,
    magneticSnap: 'none',
    collision: 'none',
  }),
  'coat-rack': freeBehavior({
    moveSnapCm: 10,
    magneticSnap: 'none',
  }),
  'indoor-plant-1': freeBehavior({
    moveSnapCm: 10,
    endpointContact: 'thin-wall-endpoint',
  }),
  'illuminated-foam': overlayBehavior(),
  tv: overlayBehavior(),
  'led-floodlight': Object.freeze({
    placement: 'top',
    moveSnapCm: 20,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'none',
    magneticSnap: 'none',
    connectionEndpoint: 'segment',
    collisionDepth: 'physical',
    endpointContact: 'standard',
    boundarySnap: 'stand-edge',
    sideInsertRotation: 'inherit',
    supportsWallOverlayMount: false,
    wallCapacity: 'exclude',
    ghost: DEFAULT_GHOST_BEHAVIOR,
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

export function getModuleCollisionStrategy(moduleOrType) {
  return getModuleBehavior(moduleOrType).collision ?? 'segment';
}

export function getModuleMagneticSnapStrategy(moduleOrType) {
  return getModuleBehavior(moduleOrType).magneticSnap ?? 'standard';
}

export function usesLogicalFixtureEndpoint(moduleOrType) {
  return getModuleBehavior(moduleOrType).connectionEndpoint === 'logical-fixture';
}

export function usesWallBackboneCollisionDepth(moduleOrType) {
  return getModuleBehavior(moduleOrType).collisionDepth === 'wall-backbone';
}

export function allowsThinWallEndpointContact(moduleOrType) {
  return getModuleBehavior(moduleOrType).endpointContact === 'thin-wall-endpoint';
}

export function usesWallInnerFaceBoundary(moduleOrType) {
  return getModuleBehavior(moduleOrType).boundarySnap === 'wall-inner-face';
}

export function resolveSideInsertRotationDeg(moduleOrType, inheritedRotationDeg = 0) {
  const behavior = getModuleBehavior(moduleOrType);
  return behavior.sideInsertRotation === 'default'
    ? getModuleDefaultRotationDeg(moduleOrType)
    : Number(inheritedRotationDeg) || 0;
}

export function supportsWallOverlayMount(moduleOrType) {
  return getModuleBehavior(moduleOrType).supportsWallOverlayMount === true;
}

export function countsTowardWallCapacity(moduleOrType) {
  return getModuleBehavior(moduleOrType).wallCapacity !== 'exclude';
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
