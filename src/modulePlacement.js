import { STAND_DIMENSIONS } from './catalog.js';
import { getModuleMoveSnapCm } from './moduleBehavior.js';

export const MODULE_PLACEMENT_SNAP_CM = 50;
export const MODULE_PLACEMENT_ROTATIONS = Object.freeze([0, 45, 90, 135, 180, 225, 270, 315]);
export const MODULE_WALL_SNAP_DISTANCE_CM = 50;
export const MODULE_NEIGHBOR_SNAP_DISTANCE_CM = 30;
export const MODULE_COLLISION_DEPTH_CM = Math.max(
  0,
  Number(STAND_DIMENSIONS.depth) * 100 || 0,
);

const EPSILON_CM = 0.001;

const WALL_AXIS = Object.freeze({
  back: 'x',
  left: 'y',
  right: 'y',
  free: null,
});

const STAND_WALLS = Object.freeze({
  'back-wall': Object.freeze(['back', 'free']),
  'l-left': Object.freeze(['back', 'left', 'free']),
  'l-right': Object.freeze(['back', 'right', 'free']),
  'u-stand': Object.freeze(['back', 'left', 'right', 'free']),
  island: Object.freeze(['free']),
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function nearlyEqual(a, b) {
  return Math.abs(Number(a) - Number(b)) <= EPSILON_CM;
}

function hasStrictDepthBounds(depthCm) {
  const depth = Number(depthCm);
  return Number.isFinite(depth) && depth > MODULE_COLLISION_DEPTH_CM + EPSILON_CM;
}

function usesLogicalFixtureEndpoint(moduleType) {
  return moduleType === 'counter' || moduleType === 'base';
}

function isTopFixtureType(moduleType) {
  return moduleType === 'led-floodlight';
}

function snapDepthCenterCm(value, depthCm, stepCm = MODULE_PLACEMENT_SNAP_CM) {
  const depth = Number(depthCm);
  const halfDepth = depth / 2;
  return halfDepth + snapCm(Number(value) - halfDepth, stepCm);
}

export function normalizeModuleRotationZDeg(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  const eighthTurns = Math.round(number / 45);
  return ((eighthTurns * 45) % 360 + 360) % 360;
}

export function rotateModuleRotationZDeg(value, deltaDeg = 90) {
  return normalizeModuleRotationZDeg(
    normalizeModuleRotationZDeg(value) + Number(deltaDeg || 0),
  );
}

export function rotateModulePlacementAroundCenter(placement, widthCm, deltaDeg = 90, depthCm = null) {
  if (!placement) return null;
  const width = Number(widthCm);
  if (!Number.isFinite(width) || width <= 0) return null;
  const center = getPlacementCenterCm(placement, width);
  if (!center) return null;

  const nextRotation = rotateModuleRotationZDeg(placement.rotationZDeg, deltaDeg);
  return placementFromCenterCm({
    centerXCm: center.xCm,
    centerYCm: center.yCm,
    widthCm: width,
    rotationZDeg: nextRotation,
    template: placement,
  });
}

export function isVerticalModuleRotation(rotationZDeg) {
  const rotation = normalizeModuleRotationZDeg(rotationZDeg);
  return rotation === 90 || rotation === 270;
}

function isCardinalModuleRotation(rotationZDeg) {
  return normalizeModuleRotationZDeg(rotationZDeg) % 90 === 0;
}

function getPlacementCenterCm(placement, widthCm) {
  if (!placement) return null;
  const width = Number(widthCm);
  const x = Number(placement.xCm);
  const y = Number(placement.yCm);
  if (![width, x, y].every(Number.isFinite) || width <= 0) return null;
  const vertical = isVerticalModuleRotation(placement.rotationZDeg);
  return {
    xCm: x + (vertical ? 0 : width / 2),
    yCm: y + (vertical ? width / 2 : 0),
  };
}

function placementFromCenterCm({ centerXCm, centerYCm, widthCm, rotationZDeg, template = {} }) {
  const width = Number(widthCm);
  const vertical = isVerticalModuleRotation(rotationZDeg);
  return createModulePlacement({
    ...template,
    xCm: vertical ? centerXCm : centerXCm - width / 2,
    yCm: vertical ? centerYCm - width / 2 : centerYCm,
    rotationZDeg,
    wallId: template.wallId ?? 'free',
  });
}

function getRotatedHalfExtentsCm(widthCm, depthCm, rotationZDeg) {
  const width = Number(widthCm);
  const depth = Number(depthCm);
  const radians = normalizeModuleRotationZDeg(rotationZDeg) * Math.PI / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  return {
    halfX: (cos * width + sin * depth) / 2,
    halfY: (sin * width + cos * depth) / 2,
  };
}

export function snapCm(value, stepCm = MODULE_PLACEMENT_SNAP_CM) {
  const number = Number(value);
  const step = Number(stepCm);
  if (!Number.isFinite(number) || !Number.isFinite(step) || step <= 0) return null;
  return Math.round(number / step) * step;
}

export function getModulePlacementSnapCm(moduleType) {
  return getModuleMoveSnapCm(moduleType);
}

export function getAllowedWallIds(standType) {
  return [...(STAND_WALLS[standType] ?? [])];
}

export function getWallAxis(wallId) {
  return WALL_AXIS[wallId] ?? null;
}

export function createModulePlacement({
  xCm = 0,
  yCm = 0,
  zCm = 0,
  rotationZDeg = 0,
  wallId = 'back',
} = {}) {
  return {
    xCm: Number(xCm) || 0,
    yCm: Number(yCm) || 0,
    zCm: Number(zCm) || 0,
    rotationZDeg: normalizeModuleRotationZDeg(rotationZDeg),
    wallId,
  };
}

export function getPlacementInterval(placement, widthCm) {
  if (!placement || !Number.isFinite(Number(widthCm))) return null;
  const axis = getWallAxis(placement.wallId)
    ?? (isVerticalModuleRotation(placement.rotationZDeg) ? 'y' : 'x');
  const startCm = axis === 'y' ? Number(placement.yCm) : Number(placement.xCm);
  return {
    axis,
    startCm,
    endCm: startCm + Number(widthCm),
  };
}

function getGroundSegment(module) {
  const placement = module?.placement;
  const widthCm = Number(module?.widthCm);
  if (!placement || !Number.isFinite(widthCm) || widthCm <= 0) return null;

  const rotation = normalizeModuleRotationZDeg(placement.rotationZDeg);
  const x = Number(placement.xCm);
  const y = Number(placement.yCm);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

  if (isVerticalModuleRotation(rotation)) {
    return {
      axis: 'y',
      fixedCm: x,
      startCm: y,
      endCm: y + widthCm,
    };
  }

  return {
    axis: 'x',
    fixedCm: y,
    startCm: x,
    endCm: x + widthCm,
  };
}

function isLCounterModule(module) {
  return module?.type === 'counter' && module?.shape === 'L';
}

function createGroundSegmentFromWorldPoints(startPoint, endPoint) {
  const dx = Number(endPoint.xCm) - Number(startPoint.xCm);
  const dy = Number(endPoint.yCm) - Number(startPoint.yCm);
  if (![dx, dy].every(Number.isFinite)) return null;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return {
      axis: 'x',
      fixedCm: (Number(startPoint.yCm) + Number(endPoint.yCm)) / 2,
      startCm: Math.min(Number(startPoint.xCm), Number(endPoint.xCm)),
      endCm: Math.max(Number(startPoint.xCm), Number(endPoint.xCm)),
    };
  }

  return {
    axis: 'y',
    fixedCm: (Number(startPoint.xCm) + Number(endPoint.xCm)) / 2,
    startCm: Math.min(Number(startPoint.yCm), Number(endPoint.yCm)),
    endCm: Math.max(Number(startPoint.yCm), Number(endPoint.yCm)),
  };
}

function getLCounterCollisionSegments(module) {
  if (!isLCounterModule(module)) return [];
  const placement = module?.placement;
  const widthCm = Number(module?.widthCm);
  const depthCm = Number(module?.depthCm);
  if (!placement || !Number.isFinite(widthCm) || !Number.isFinite(depthCm) || widthCm <= 0 || depthCm <= 0) {
    return [];
  }

  const armCm = 50;
  const rotationDeg = normalizeModuleRotationZDeg(placement.rotationZDeg);
  const vertical = isVerticalModuleRotation(rotationDeg);
  const placementX = Number(placement.xCm);
  const placementY = Number(placement.yCm);
  if (!Number.isFinite(placementX) || !Number.isFinite(placementY)) return [];

  const centerX = placementX + (vertical ? 0 : widthCm / 2);
  const centerY = placementY + (vertical ? widthCm / 2 : 0);
  const radians = rotationDeg * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const toWorld = (localX, localY) => ({
    xCm: centerX + localX * cos + localY * sin,
    yCm: centerY - localX * sin + localY * cos,
  });
  const createLocalSegment = (x1, y1, x2, y2) => createGroundSegmentFromWorldPoints(
    toWorld(x1, y1),
    toWorld(x2, y2),
  );

  const armModule = { ...module, depthCm: armCm, shape: null };
  return [
    createLocalSegment(
      -widthCm / 2,
      -depthCm / 2 + armCm / 2,
      widthCm / 2,
      -depthCm / 2 + armCm / 2,
    ),
    createLocalSegment(
      widthCm / 2 - armCm / 2,
      -depthCm / 2,
      widthCm / 2 - armCm / 2,
      depthCm / 2,
    ),
  ].filter(Boolean).map((segment) => ({ segment, module: armModule }));
}

function getModuleCollisionSegments(module) {
  const lSegments = getLCounterCollisionSegments(module);
  if (lSegments.length) return lSegments;
  const segment = getGroundSegment(module);
  return segment ? [{ segment, module }] : [];
}

function pointIsSegmentEndpoint(segment, coordinateCm) {
  return nearlyEqual(coordinateCm, segment.startCm)
    || nearlyEqual(coordinateCm, segment.endCm);
}

export function getWallUsedCm(modules = [], wallId = 'back') {
  return modules.reduce((sum, module) => (
    module?.placement?.wallId === wallId && !isTopFixtureType(module?.type)
      ? sum + (Number(module.widthCm) || 0)
      : sum
  ), 0);
}

export function getWallExtentCm(modules = [], wallId = 'back') {
  return modules.reduce((max, module) => {
    if (module?.placement?.wallId !== wallId || isTopFixtureType(module?.type)) return max;
    const interval = getPlacementInterval(module.placement, module.widthCm);
    return interval ? Math.max(max, interval.endCm) : max;
  }, 0);
}

export function validateModulePlacement({
  placement,
  widthCm,
  depthCm = null,
  standType,
  standXCm,
  standYCm,
} = {}) {
  if (!placement) return { ok: false, message: 'Modül yerleşimi eksik.' };

  const width = Number(widthCm);
  const xLimit = Number(standXCm);
  const yLimit = Number(standYCm);
  if (![width, xLimit, yLimit].every(Number.isFinite) || width <= 0 || xLimit <= 0 || yLimit <= 0) {
    return { ok: false, message: 'Geçerli modül ve stand ölçüleri gerekli.' };
  }

  const allowedWalls = getAllowedWallIds(standType);
  if (!allowedWalls.includes(placement.wallId)) {
    return { ok: false, message: 'Bu stand tipinde bu konuma modül yerleştirilemez.' };
  }

  const rotation = normalizeModuleRotationZDeg(placement.rotationZDeg);
  const vertical = isVerticalModuleRotation(rotation);
  const x = Number(placement.xCm);
  const y = Number(placement.yCm);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return { ok: false, message: 'Modül koordinatları geçersiz.' };
  }

  if (placement.wallId === 'back') {
    if (vertical || y !== 0) return { ok: false, message: 'Sırt duvar modülü X yönünde olmalı.' };
    if (x < 0 || x + width > xLimit) return { ok: false, message: 'Modül X stand sınırını aşıyor.' };
  } else if (placement.wallId === 'left') {
    if (!vertical || x !== 0) return { ok: false, message: 'Sol duvar modülü Y yönünde olmalı.' };
    if (y < 0 || y + width > yLimit) return { ok: false, message: 'Modül Y stand sınırını aşıyor.' };
  } else if (placement.wallId === 'right') {
    if (!vertical || x !== xLimit) return { ok: false, message: 'Sağ duvar modülü Y yönünde olmalı.' };
    if (y < 0 || y + width > yLimit) return { ok: false, message: 'Modül Y stand sınırını aşıyor.' };
  } else {
    const strictDepth = hasStrictDepthBounds(depthCm);
    if (strictDepth) {
      const center = getPlacementCenterCm(placement, width);
      const extents = getRotatedHalfExtentsCm(width, depthCm, rotation);
      if (
        !center
        || center.xCm - extents.halfX < -EPSILON_CM
        || center.xCm + extents.halfX > xLimit + EPSILON_CM
        || center.yCm - extents.halfY < -EPSILON_CM
        || center.yCm + extents.halfY > yLimit + EPSILON_CM
      ) {
        return { ok: false, message: 'Modül aktif stand alanını aşıyor.' };
      }
    } else {
      const endX = x + (!vertical ? width : 0);
      const endY = y + (vertical ? width : 0);
      if (x < 0 || y < 0 || endX > xLimit || endY > yLimit) {
        return { ok: false, message: 'Modül aktif stand alanını aşıyor.' };
      }
    }
  }

  return { ok: true };
}

function getModuleCollisionDepthCm(module) {
  // Panel Bazalı fiziksel olarak 50 cm baza taşır ama bağlantı omurgası Düz Panel'dir.
  // Corner/T/snap hesabında baza çıkıntısını değil 10 cm Maxima duvar hattını kullan.
  if (module?.type === 'base-wall') return MODULE_COLLISION_DEPTH_CM;
  const explicitDepthCm = Number(module?.depthCm);
  if (Number.isFinite(explicitDepthCm) && explicitDepthCm > 0) return explicitDepthCm;
  return MODULE_COLLISION_DEPTH_CM;
}

function collisionSegmentsOverlap(a, moduleA, b, moduleB) {
  const depthA = getModuleCollisionDepthCm(moduleA);
  const depthB = getModuleCollisionDepthCm(moduleB);

  if (a.axis === b.axis) {
    const longitudinalOverlap = a.startCm < b.endCm - EPSILON_CM
      && b.startCm < a.endCm - EPSILON_CM;
    if (!longitudinalOverlap) return false;

    const centerLineGapCm = Math.abs(a.fixedCm - b.fixedCm);
    const requiredGapCm = (depthA + depthB) / 2;
    return centerLineGapCm < requiredGapCm - EPSILON_CM;
  }

  const horizontal = a.axis === 'x' ? a : b;
  const vertical = a.axis === 'y' ? a : b;
  const horizontalModule = a.axis === 'x' ? moduleA : moduleB;
  const verticalModule = a.axis === 'y' ? moduleA : moduleB;
  const horizontalDepth = getModuleCollisionDepthCm(horizontalModule);
  const verticalDepth = getModuleCollisionDepthCm(verticalModule);
  const intersectionX = vertical.fixedCm;
  const intersectionY = horizontal.fixedCm;
  const onHorizontal = intersectionX >= horizontal.startCm - EPSILON_CM
    && intersectionX <= horizontal.endCm + EPSILON_CM;
  const onVertical = intersectionY >= vertical.startCm - EPSILON_CM
    && intersectionY <= vertical.endCm + EPSILON_CM;

  if (onHorizontal && onVertical) {
    const horizontalEndpoint = pointIsSegmentEndpoint(horizontal, intersectionX);
    const verticalEndpoint = pointIsSegmentEndpoint(vertical, intersectionY);

    const counterModule = usesLogicalFixtureEndpoint(horizontalModule?.type)
      ? horizontalModule
      : (usesLogicalFixtureEndpoint(verticalModule?.type) ? verticalModule : null);
    if (counterModule) {
      const counterIsHorizontal = counterModule === horizontalModule;
      const counterSegment = counterIsHorizontal ? horizontal : vertical;
      const thinModule = counterIsHorizontal ? verticalModule : horizontalModule;
      const counterIntersectionCm = counterIsHorizontal ? intersectionX : intersectionY;
      const thinDepthCm = getModuleCollisionDepthCm(thinModule);
      const logicalCounterEndpointJoin = thinDepthCm <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM
        && pointIsSegmentEndpoint(counterSegment, counterIntersectionCm);
      if (logicalCounterEndpointJoin) return false;
    }

    const thinEndpointJoin = horizontalDepth <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM
      && verticalDepth <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM;
    if (!thinEndpointJoin) return true;
    return !horizontalEndpoint && !verticalEndpoint;
  }

  const verticalHalfDepth = verticalDepth / 2;
  const horizontalHalfDepth = horizontalDepth / 2;
  const physicalXOverlap = intersectionX > horizontal.startCm - verticalHalfDepth + EPSILON_CM
    && intersectionX < horizontal.endCm + verticalHalfDepth - EPSILON_CM;
  const physicalYOverlap = intersectionY > vertical.startCm - horizontalHalfDepth + EPSILON_CM
    && intersectionY < vertical.endCm + horizontalHalfDepth - EPSILON_CM;
  return physicalXOverlap && physicalYOverlap;
}

function getOrientedFootprint(module) {
  const placement = module?.placement;
  const width = Number(module?.widthCm);
  const depth = getModuleCollisionDepthCm(module);
  if (!placement || !Number.isFinite(width) || width <= 0 || !Number.isFinite(depth) || depth <= 0) return null;
  const center = getPlacementCenterCm(placement, width);
  if (!center) return null;
  const radians = normalizeModuleRotationZDeg(placement.rotationZDeg) * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return {
    center,
    axes: [
      { x: cos, y: -sin },
      { x: sin, y: cos },
    ],
    half: [width / 2, depth / 2],
  };
}

function orientedFootprintsOverlap(moduleA, moduleB) {
  const a = getOrientedFootprint(moduleA);
  const b = getOrientedFootprint(moduleB);
  if (!a || !b) return false;
  const delta = {
    x: b.center.xCm - a.center.xCm,
    y: b.center.yCm - a.center.yCm,
  };
  const axes = [...a.axes, ...b.axes];
  return axes.every((axis) => {
    const centerDistance = Math.abs(delta.x * axis.x + delta.y * axis.y);
    const radiusA = a.half[0] * Math.abs(a.axes[0].x * axis.x + a.axes[0].y * axis.y)
      + a.half[1] * Math.abs(a.axes[1].x * axis.x + a.axes[1].y * axis.y);
    const radiusB = b.half[0] * Math.abs(b.axes[0].x * axis.x + b.axes[0].y * axis.y)
      + b.half[1] * Math.abs(b.axes[1].x * axis.x + b.axes[1].y * axis.y);
    return centerDistance < radiusA + radiusB - EPSILON_CM;
  });
}

export function placementsOverlap(moduleA, moduleB) {
  if (isTopFixtureType(moduleA?.type) || isTopFixtureType(moduleB?.type)) return false;
  const angleA = normalizeModuleRotationZDeg(moduleA?.placement?.rotationZDeg);
  const angleB = normalizeModuleRotationZDeg(moduleB?.placement?.rotationZDeg);
  if (!isLCounterModule(moduleA) && !isLCounterModule(moduleB) && (!isCardinalModuleRotation(angleA) || !isCardinalModuleRotation(angleB))) {
    return orientedFootprintsOverlap(moduleA, moduleB);
  }
  const segmentsA = getModuleCollisionSegments(moduleA);
  const segmentsB = getModuleCollisionSegments(moduleB);
  if (!segmentsA.length || !segmentsB.length) return false;

  return segmentsA.some((entryA) => segmentsB.some((entryB) => collisionSegmentsOverlap(
    entryA.segment,
    entryA.module,
    entryB.segment,
    entryB.module,
  )));
}

export function validatePlacementAgainstModules({
  placement,
  widthCm,
  depthCm = null,
  moduleId = null,
  moduleType = null,
  shape = null,
  modules = [],
  standType,
  standXCm,
  standYCm,
} = {}) {
  const effectiveDepthCm = moduleType === 'base-wall'
    ? MODULE_COLLISION_DEPTH_CM
    : depthCm;
  const boundary = validateModulePlacement({
    placement,
    widthCm,
    depthCm: effectiveDepthCm,
    standType,
    standXCm,
    standYCm,
  });
  if (!boundary.ok) return boundary;

  const candidate = {
    id: moduleId,
    type: moduleType,
    shape,
    widthCm,
    depthCm: effectiveDepthCm,
    placement,
  };
  const collision = modules.find((module) => (
    module?.id !== moduleId && placementsOverlap(candidate, module)
  ));

  if (collision) {
    return {
      ok: false,
      message: 'Başka bir modülle çakışıyor.',
      collisionModuleId: collision.id,
    };
  }

  return { ok: true };
}

function getPlacementCenter(placement, widthCm) {
  const width = Number(widthCm);
  const x = Number(placement?.xCm);
  const y = Number(placement?.yCm);
  if (![width, x, y].every(Number.isFinite) || width <= 0) return null;
  const vertical = isVerticalModuleRotation(placement.rotationZDeg);
  return {
    xCm: x + (vertical ? 0 : width / 2),
    yCm: y + (vertical ? width / 2 : 0),
  };
}

function inferPlacementWallId({ placement, standType, standXCm } = {}) {
  if (!placement) return 'free';
  const allowedWalls = getAllowedWallIds(standType);
  const vertical = isVerticalModuleRotation(placement.rotationZDeg);
  const xCm = Number(placement.xCm);
  const yCm = Number(placement.yCm);
  const xLimit = Number(standXCm);

  if (!vertical && nearlyEqual(yCm, 0) && allowedWalls.includes('back')) return 'back';
  if (vertical && nearlyEqual(xCm, 0) && allowedWalls.includes('left')) return 'left';
  if (vertical && nearlyEqual(xCm, xLimit) && allowedWalls.includes('right')) return 'right';
  return 'free';
}

function getSegmentSnapCoordinates(segment) {
  const coordinates = [];
  for (
    let coordinate = segment.startCm;
    coordinate <= segment.endCm + EPSILON_CM;
    coordinate += MODULE_PLACEMENT_SNAP_CM
  ) {
    coordinates.push(Math.min(coordinate, segment.endCm));
  }
  if (!coordinates.some((coordinate) => nearlyEqual(coordinate, segment.endCm))) {
    coordinates.push(segment.endCm);
  }
  return coordinates;
}

function createEndpointConnectionPlacement({
  axis,
  pointXCm,
  pointYCm,
  widthCm,
  rotationZDeg,
  movingEndpoint,
  standType,
  standXCm,
}) {
  const width = Number(widthCm);
  const placement = createModulePlacement({
    xCm: axis === 'x'
      ? pointXCm - (movingEndpoint === 'end' ? width : 0)
      : pointXCm,
    yCm: axis === 'y'
      ? pointYCm - (movingEndpoint === 'end' ? width : 0)
      : pointYCm,
    zCm: 0,
    rotationZDeg,
    wallId: 'free',
  });
  placement.wallId = inferPlacementWallId({ placement, standType, standXCm });
  return placement;
}

export function snapPlacementToModules({
  moduleId = null,
  moduleType = null,
  shape = null,
  widthCm,
  depthCm = null,
  pointerXCm,
  pointerYCm,
  rotationZDeg = 0,
  modules = [],
  standType,
  standXCm,
  standYCm,
  snapDistanceCm = MODULE_NEIGHBOR_SNAP_DISTANCE_CM,
} = {}) {
  const width = Number(widthCm);
  const pointerX = Number(pointerXCm);
  const pointerY = Number(pointerYCm);
  const threshold = Number(snapDistanceCm);
  if (
    ![width, pointerX, pointerY, threshold].every(Number.isFinite)
    || width <= 0
    || threshold < 0
  ) return null;

  const resolvedRotation = normalizeModuleRotationZDeg(rotationZDeg);
  if (!isCardinalModuleRotation(resolvedRotation)) return null;
  const movingAxis = isVerticalModuleRotation(resolvedRotation) ? 'y' : 'x';
  const effectiveMovingDepthCm = moduleType === 'base-wall'
    ? MODULE_COLLISION_DEPTH_CM
    : depthCm;
  const strictMovingDepth = hasStrictDepthBounds(effectiveMovingDepthCm);
  const movingDepthCm = strictMovingDepth
    ? Number(effectiveMovingDepthCm)
    : MODULE_COLLISION_DEPTH_CM;
  const freePlacement = strictMovingDepth ? createFreePlacement({
    moduleType,
    widthCm: width,
    depthCm,
    pointerXCm: pointerX,
    pointerYCm: pointerY,
    standXCm,
    standYCm,
    standType,
    rotationZDeg: resolvedRotation,
  }) : null;
  const candidates = [];
  const counterCornerFaces = [];
  const isCounter = usesLogicalFixtureEndpoint(moduleType);

  const addCandidate = (
    placement,
    targetModuleId,
    snapKind,
    priority = 0,
    distanceOverrideCm = null,
  ) => {
    const center = getPlacementCenter(placement, width);
    if (!center) return;
    const hasDistanceOverride = distanceOverrideCm !== null && distanceOverrideCm !== undefined;
    const overrideDistance = hasDistanceOverride ? Number(distanceOverrideCm) : Number.NaN;
    const distanceCm = Number.isFinite(overrideDistance)
      ? overrideDistance
      : Math.hypot(center.xCm - pointerX, center.yCm - pointerY);
    if (distanceCm > threshold + EPSILON_CM) return;

    const validation = validatePlacementAgainstModules({
      placement,
      widthCm: width,
      depthCm,
      moduleId,
      moduleType,
      shape,
      modules,
      standType,
      standXCm,
      standYCm,
    });
    if (!validation.ok) return;

    candidates.push({
      placement,
      targetModuleId,
      snapKind,
      priority,
      distanceCm,
    });
  };

  const rememberCounterFace = (placement, targetModule, constrainedAxis) => {
    if (!isCounter || !placement || !targetModule) return;
    counterCornerFaces.push({
      placement: { ...placement },
      targetModule,
      constrainedAxis,
    });
  };

  const addThinTargetCandidates = (target, targetModuleForDepth, targetModuleId) => {
    if (!target) return;

    if (target.axis === movingAxis) {
      if (movingAxis === 'x') {
        addCandidate(createEndpointConnectionPlacement({
          axis: 'x', pointXCm: target.endCm, pointYCm: target.fixedCm,
          widthCm: width, rotationZDeg: resolvedRotation, movingEndpoint: 'start',
          standType, standXCm,
        }), targetModuleId, 'end-to-end', 0);
        addCandidate(createEndpointConnectionPlacement({
          axis: 'x', pointXCm: target.startCm, pointYCm: target.fixedCm,
          widthCm: width, rotationZDeg: resolvedRotation, movingEndpoint: 'end',
          standType, standXCm,
        }), targetModuleId, 'end-to-end', 0);
      } else {
        addCandidate(createEndpointConnectionPlacement({
          axis: 'y', pointXCm: target.fixedCm, pointYCm: target.endCm,
          widthCm: width, rotationZDeg: resolvedRotation, movingEndpoint: 'start',
          standType, standXCm,
        }), targetModuleId, 'end-to-end', 0);
        addCandidate(createEndpointConnectionPlacement({
          axis: 'y', pointXCm: target.fixedCm, pointYCm: target.startCm,
          widthCm: width, rotationZDeg: resolvedRotation, movingEndpoint: 'end',
          standType, standXCm,
        }), targetModuleId, 'end-to-end', 0);
      }
      return;
    }

    const targetDepthCm = getModuleCollisionDepthCm(targetModuleForDepth);
    const thinMovingModule = movingDepthCm <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM;
    const matchesFixtureSide = thinMovingModule
      && usesLogicalFixtureEndpoint(targetModuleForDepth?.type)
      && targetDepthCm > MODULE_COLLISION_DEPTH_CM + EPSILON_CM
      && nearlyEqual(width, targetDepthCm);

    if (matchesFixtureSide) {
      [target.startCm, target.endCm].forEach((endpointCm) => {
        const placement = createModulePlacement({
          xCm: movingAxis === 'y' ? endpointCm : target.fixedCm - width / 2,
          yCm: movingAxis === 'y' ? target.fixedCm - width / 2 : endpointCm,
          zCm: 0,
          rotationZDeg: resolvedRotation,
          wallId: 'free',
        });
        placement.wallId = inferPlacementWallId({ placement, standType, standXCm });
        addCandidate(placement, targetModuleId, 'fixture-side', -2);
      });
    }

    getSegmentSnapCoordinates(target).forEach((coordinateCm) => {
      const pointXCm = target.axis === 'x' ? coordinateCm : target.fixedCm;
      const pointYCm = target.axis === 'y' ? coordinateCm : target.fixedCm;
      const targetEndpoint = nearlyEqual(coordinateCm, target.startCm)
        || nearlyEqual(coordinateCm, target.endCm);
      const snapKind = targetEndpoint ? 'corner' : 'tee';
      const priority = targetEndpoint ? 1 : 2;

      addCandidate(createEndpointConnectionPlacement({
        axis: movingAxis,
        pointXCm,
        pointYCm,
        widthCm: width,
        rotationZDeg: resolvedRotation,
        movingEndpoint: 'start',
        standType,
        standXCm,
      }), targetModuleId, snapKind, priority);

      addCandidate(createEndpointConnectionPlacement({
        axis: movingAxis,
        pointXCm,
        pointYCm,
        widthCm: width,
        rotationZDeg: resolvedRotation,
        movingEndpoint: 'end',
        standType,
        standXCm,
      }), targetModuleId, snapKind, priority);
    });
  };

  modules.forEach((targetModule) => {
    if (!targetModule?.placement || targetModule.id === moduleId) return;
    if (!strictMovingDepth && isLCounterModule(targetModule)) {
      getLCounterCollisionSegments(targetModule).forEach(({ segment, module: armModule }) => {
        addThinTargetCandidates(segment, armModule, targetModule.id);
      });
      return;
    }
    const target = getGroundSegment(targetModule);
    if (!target) return;

    if (strictMovingDepth) {
      if (!freePlacement) return;

      const targetDepthCm = getModuleCollisionDepthCm(targetModule);

      if (target.axis !== movingAxis) {
        const targetHalfDepthCm = targetDepthCm / 2;
        const logicalEndpointContact = isCounter
          && targetDepthCm <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM;
        const endpointOffsetCm = logicalEndpointContact ? 0 : targetHalfDepthCm;
        const crossCenterCm = movingAxis === 'x'
          ? Number(freePlacement.yCm)
          : Number(freePlacement.xCm);
        const sideMinCm = crossCenterCm - movingDepthCm / 2;
        const sideMaxCm = crossCenterCm + movingDepthCm / 2;
        const crossOverlap = sideMinCm < target.endCm - EPSILON_CM
          && target.startCm < sideMaxCm - EPSILON_CM;
        if (!crossOverlap) return;

        [
          target.fixedCm + endpointOffsetCm,
          target.fixedCm - endpointOffsetCm - width,
        ].forEach((startCm) => {
          const placement = createModulePlacement({
            ...freePlacement,
            xCm: movingAxis === 'x' ? startCm : freePlacement.xCm,
            yCm: movingAxis === 'y' ? startCm : freePlacement.yCm,
            rotationZDeg: resolvedRotation,
            wallId: 'free',
          });
          const center = getPlacementCenter(placement, width);
          if (!center) return;
          const alongAxisDistanceCm = movingAxis === 'x'
            ? Math.abs(center.xCm - pointerX)
            : Math.abs(center.yCm - pointerY);
          rememberCounterFace(placement, targetModule, movingAxis);
          addCandidate(placement, targetModule.id, 'face', -1, alongAxisDistanceCm);
        });
        return;
      }
      const faceGapCm = (movingDepthCm + targetDepthCm) / 2;

      [-1, 1].forEach((direction) => {
        const placement = createModulePlacement({
          ...freePlacement,
          xCm: movingAxis === 'y'
            ? target.fixedCm + (direction * faceGapCm)
            : freePlacement.xCm,
          yCm: movingAxis === 'x'
            ? target.fixedCm + (direction * faceGapCm)
            : freePlacement.yCm,
          rotationZDeg: resolvedRotation,
          wallId: 'free',
        });

        const movingSegment = getGroundSegment({ widthCm: width, depthCm, placement });
        if (!movingSegment) return;
        const longitudinalOverlap = movingSegment.startCm < target.endCm - EPSILON_CM
          && target.startCm < movingSegment.endCm - EPSILON_CM;
        if (!longitudinalOverlap) return;

        const perpendicularDistanceCm = movingAxis === 'x'
          ? Math.abs(Number(placement.yCm) - pointerY)
          : Math.abs(Number(placement.xCm) - pointerX);
        rememberCounterFace(
          placement,
          targetModule,
          movingAxis === 'x' ? 'y' : 'x',
        );
        addCandidate(placement, targetModule.id, 'face', -1, perpendicularDistanceCm);
      });
      return;
    }

    if (target.axis === movingAxis) {
      // Aynı doğrultuda yalnızca gerçek uç-uca bağlantı üret.
      if (movingAxis === 'x') {
        addCandidate(createEndpointConnectionPlacement({
          axis: 'x', pointXCm: target.endCm, pointYCm: target.fixedCm,
          widthCm: width, rotationZDeg: resolvedRotation, movingEndpoint: 'start',
          standType, standXCm,
        }), targetModule.id, 'end-to-end', 0);
        addCandidate(createEndpointConnectionPlacement({
          axis: 'x', pointXCm: target.startCm, pointYCm: target.fixedCm,
          widthCm: width, rotationZDeg: resolvedRotation, movingEndpoint: 'end',
          standType, standXCm,
        }), targetModule.id, 'end-to-end', 0);
      } else {
        addCandidate(createEndpointConnectionPlacement({
          axis: 'y', pointXCm: target.fixedCm, pointYCm: target.endCm,
          widthCm: width, rotationZDeg: resolvedRotation, movingEndpoint: 'start',
          standType, standXCm,
        }), targetModule.id, 'end-to-end', 0);
        addCandidate(createEndpointConnectionPlacement({
          axis: 'y', pointXCm: target.fixedCm, pointYCm: target.startCm,
          widthCm: width, rotationZDeg: resolvedRotation, movingEndpoint: 'end',
          standType, standXCm,
        }), targetModule.id, 'end-to-end', 0);
      }
      return;
    }

    // İnce 50 cm panel, Banko/Baza gibi 50 cm derinlikli bir fixture'ın
    // kısa yan yüzüne geldiğinde merkez çizgisinden başlatma. Paneli fiziksel
    // yan yüzün tamamına ortala; böylece 150x50 Banko + 50 panel gerçek flush
    // köşe bağlantısı oluşturur ve collision motoru bunu yanlışlıkla reddetmez.
    const targetDepthCm = getModuleCollisionDepthCm(targetModule);
    const thinMovingModule = movingDepthCm <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM;
    const matchesFixtureSide = thinMovingModule
      && usesLogicalFixtureEndpoint(targetModule?.type)
      && targetDepthCm > MODULE_COLLISION_DEPTH_CM + EPSILON_CM
      && nearlyEqual(width, targetDepthCm);

    if (matchesFixtureSide) {
      [target.startCm, target.endCm].forEach((endpointCm) => {
        const placement = createModulePlacement({
          xCm: movingAxis === 'y' ? endpointCm : target.fixedCm - width / 2,
          yCm: movingAxis === 'y' ? target.fixedCm - width / 2 : endpointCm,
          zCm: 0,
          rotationZDeg: resolvedRotation,
          wallId: 'free',
        });
        placement.wallId = inferPlacementWallId({ placement, standType, standXCm });
        addCandidate(placement, targetModule.id, 'fixture-side', -2);
      });
    }

    // Dik modül: hedef modül boyunca her 50 cm bağlantı noktasını aday yap.
    // Hedefin ucundaki bağlantı L, gövde üzerindeki bağlantı T olur.
    getSegmentSnapCoordinates(target).forEach((coordinateCm) => {
      const pointXCm = target.axis === 'x' ? coordinateCm : target.fixedCm;
      const pointYCm = target.axis === 'y' ? coordinateCm : target.fixedCm;
      const targetEndpoint = nearlyEqual(coordinateCm, target.startCm)
        || nearlyEqual(coordinateCm, target.endCm);
      const snapKind = targetEndpoint ? 'corner' : 'tee';
      const priority = targetEndpoint ? 1 : 2;

      addCandidate(createEndpointConnectionPlacement({
        axis: movingAxis,
        pointXCm,
        pointYCm,
        widthCm: width,
        rotationZDeg: resolvedRotation,
        movingEndpoint: 'start',
        standType,
        standXCm,
      }), targetModule.id, snapKind, priority);

      addCandidate(createEndpointConnectionPlacement({
        axis: movingAxis,
        pointXCm,
        pointYCm,
        widthCm: width,
        rotationZDeg: resolvedRotation,
        movingEndpoint: 'end',
        standType,
        standXCm,
      }), targetModule.id, snapKind, priority);
    });
  });

  if (isCounter && counterCornerFaces.length > 1) {
    const touchesTargetFace = (placement, targetModule) => {
      const moving = getGroundSegment({ widthCm: width, depthCm, placement });
      const target = getGroundSegment(targetModule);
      if (!moving || !target) return false;

      const targetDepthCm = getModuleCollisionDepthCm(targetModule);
      if (moving.axis === target.axis) {
        const longitudinalOverlap = moving.startCm < target.endCm - EPSILON_CM
          && target.startCm < moving.endCm - EPSILON_CM;
        const centerLineGapCm = Math.abs(moving.fixedCm - target.fixedCm);
        return longitudinalOverlap
          && nearlyEqual(centerLineGapCm, (movingDepthCm + targetDepthCm) / 2);
      }

      const crossMinCm = moving.fixedCm - movingDepthCm / 2;
      const crossMaxCm = moving.fixedCm + movingDepthCm / 2;
      const crossOverlap = crossMinCm < target.endCm - EPSILON_CM
        && target.startCm < crossMaxCm - EPSILON_CM;
      const targetHalfDepthCm = targetDepthCm / 2;
      const logicalEndpointContact = isCounter
        && targetDepthCm <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM;
      const targetFaces = logicalEndpointContact
        ? [target.fixedCm]
        : [target.fixedCm - targetHalfDepthCm, target.fixedCm + targetHalfDepthCm];
      const endpointContact = targetFaces.some((faceCm) => (
        nearlyEqual(moving.startCm, faceCm) || nearlyEqual(moving.endCm, faceCm)
      ));
      return crossOverlap && endpointContact;
    };

    const xFaces = counterCornerFaces.filter((entry) => entry.constrainedAxis === 'x');
    const yFaces = counterCornerFaces.filter((entry) => entry.constrainedAxis === 'y');

    xFaces.forEach((xFace) => {
      yFaces.forEach((yFace) => {
        if (xFace.targetModule.id === yFace.targetModule.id) return;
        const placement = createModulePlacement({
          ...freePlacement,
          xCm: xFace.placement.xCm,
          yCm: yFace.placement.yCm,
          rotationZDeg: resolvedRotation,
          wallId: 'free',
        });
        if (!touchesTargetFace(placement, xFace.targetModule)) return;
        if (!touchesTargetFace(placement, yFace.targetModule)) return;

        const center = getPlacementCenter(placement, width);
        if (!center) return;
        const cornerDistanceCm = Math.max(
          Math.abs(center.xCm - pointerX),
          Math.abs(center.yCm - pointerY),
        );
        addCandidate(placement, xFace.targetModule.id, 'corner-face', -2, cornerDistanceCm);
      });
    });
  }

  if (!candidates.length) return null;
  candidates.sort((a, b) => (
    a.distanceCm - b.distanceCm
    || a.priority - b.priority
    || String(a.targetModuleId).localeCompare(String(b.targetModuleId))
  ));

  const best = candidates[0];
  return {
    ok: true,
    mode: 'module-snap',
    placement: { ...best.placement },
    targetModuleId: best.targetModuleId,
    snapKind: best.snapKind,
    distanceCm: best.distanceCm,
  };
}

function createFreePlacement({
  moduleType = null,
  widthCm,
  depthCm = null,
  pointerXCm,
  pointerYCm,
  standXCm,
  standYCm,
  standType = null,
  rotationZDeg,
}) {
  const width = Number(widthCm);
  const placementSnapCm = getModulePlacementSnapCm(moduleType);
  const xLimit = Number(standXCm);
  const yLimit = Number(standYCm);
  const rotation = normalizeModuleRotationZDeg(rotationZDeg);
  const vertical = isVerticalModuleRotation(rotation);
  const strictDepth = hasStrictDepthBounds(depthCm);
  const halfDepth = strictDepth ? Number(depthCm) / 2 : 0;

  if (strictDepth && !isCardinalModuleRotation(rotation)) {
    const extents = getRotatedHalfExtentsCm(width, depthCm, rotation);
    if (xLimit < extents.halfX * 2 || yLimit < extents.halfY * 2) return null;
    const centerXCm = clamp(snapCm(pointerXCm, placementSnapCm), extents.halfX, xLimit - extents.halfX);
    const centerYCm = clamp(snapCm(pointerYCm, placementSnapCm), extents.halfY, yLimit - extents.halfY);
    return placementFromCenterCm({
      centerXCm,
      centerYCm,
      widthCm: width,
      rotationZDeg: rotation,
      template: { wallId: 'free' },
    });
  }

  const minX = vertical && strictDepth ? halfDepth : 0;
  const maxX = !vertical ? xLimit - width : (strictDepth ? xLimit - halfDepth : xLimit);
  const minY = !vertical && strictDepth ? halfDepth : 0;
  const maxY = vertical ? yLimit - width : (strictDepth ? yLimit - halfDepth : yLimit);
  if (maxX < minX || maxY < minY) return null;

  let xCm = !vertical
    ? clamp(snapCm(Number(pointerXCm) - width / 2, placementSnapCm), 0, maxX)
    : clamp(
        strictDepth ? snapDepthCenterCm(pointerXCm, depthCm, placementSnapCm) : snapCm(pointerXCm, placementSnapCm),
        minX,
        maxX,
      );
  let yCm = vertical
    ? clamp(snapCm(Number(pointerYCm) - width / 2, placementSnapCm), 0, maxY)
    : clamp(
        strictDepth ? snapDepthCenterCm(pointerYCm, depthCm, placementSnapCm) : snapCm(pointerYCm, placementSnapCm),
        minY,
        maxY,
      );

  if (strictDepth) {
    const edgeSnap = MODULE_PLACEMENT_SNAP_CM;
    const useWallInnerFaces = moduleType === 'sofa-set-classic' || moduleType === 'table-chair-set-eames';
    const wallFaceOffsetCm = MODULE_COLLISION_DEPTH_CM / 2;
    const activeWalls = useWallInnerFaces ? getAllowedWallIds(standType) : [];
    const leftEdgeCm = activeWalls.includes('left') ? wallFaceOffsetCm : 0;
    const rightEdgeCm = activeWalls.includes('right') ? xLimit - wallFaceOffsetCm : xLimit;
    const backEdgeCm = activeWalls.includes('back') ? wallFaceOffsetCm : 0;

    if (!vertical) {
      if (xCm - leftEdgeCm <= edgeSnap + EPSILON_CM) xCm = leftEdgeCm;
      if (rightEdgeCm - (xCm + width) <= edgeSnap + EPSILON_CM) xCm = rightEdgeCm - width;
      if ((yCm - halfDepth) - backEdgeCm <= edgeSnap + EPSILON_CM) yCm = backEdgeCm + halfDepth;
      if (yLimit - (yCm + halfDepth) <= edgeSnap + EPSILON_CM) yCm = yLimit - halfDepth;
    } else {
      if ((xCm - halfDepth) - leftEdgeCm <= edgeSnap + EPSILON_CM) xCm = leftEdgeCm + halfDepth;
      if (rightEdgeCm - (xCm + halfDepth) <= edgeSnap + EPSILON_CM) xCm = rightEdgeCm - halfDepth;
      if (yCm - backEdgeCm <= edgeSnap + EPSILON_CM) yCm = backEdgeCm;
      if (yLimit - (yCm + width) <= edgeSnap + EPSILON_CM) yCm = yLimit - width;
    }
  }

  return createModulePlacement({
    xCm,
    yCm,
    rotationZDeg: rotation,
    wallId: 'free',
  });
}

export function snapPlacementToStand({
  standType,
  moduleType = null,
  widthCm,
  depthCm = null,
  forceFree = false,
  pointerXCm,
  pointerYCm,
  standXCm,
  standYCm,
  preferredRotationZDeg = 0,
  rotationLocked = false,
} = {}) {
  const width = Number(widthCm);
  const xLimit = Number(standXCm);
  const yLimit = Number(standYCm);
  const pointerX = Number(pointerXCm);
  const pointerY = Number(pointerYCm);
  const walls = getAllowedWallIds(standType);

  if (
    !walls.length
    || ![width, xLimit, yLimit, pointerX, pointerY].every(Number.isFinite)
    || width <= 0
  ) {
    return { ok: false, message: 'Yerleşim için geçerli stand ve modül ölçüleri gerekli.' };
  }

  const preferredRotation = normalizeModuleRotationZDeg(preferredRotationZDeg);
  const freePlacement = createFreePlacement({
    moduleType,
    widthCm: width,
    depthCm,
    pointerXCm: pointerX,
    pointerYCm: pointerY,
    standXCm: xLimit,
    standYCm: yLimit,
    standType,
    rotationZDeg: preferredRotation,
  });

  const activeBoundaryWalls = walls.filter((wallId) => wallId !== 'free');
  const boundaryCandidates = activeBoundaryWalls.map((wallId) => {
    const wallRotation = wallId === 'back' ? 0 : (wallId === 'left' ? 90 : 270);
    const wallIsVertical = wallId !== 'back';
    if (rotationLocked && wallIsVertical !== isVerticalModuleRotation(preferredRotation)) return null;
    const resolvedRotation = rotationLocked ? preferredRotation : wallRotation;

    if (wallId === 'back') {
      if (width > xLimit) return null;
      return {
        distanceCm: Math.abs(pointerY),
        placement: createModulePlacement({
          xCm: clamp(snapCm(pointerX - width / 2), 0, xLimit - width),
          yCm: 0,
          rotationZDeg: resolvedRotation,
          wallId,
        }),
      };
    }

    if (width > yLimit) return null;
    const wallX = wallId === 'left' ? 0 : xLimit;
    return {
      distanceCm: Math.abs(pointerX - wallX),
      placement: createModulePlacement({
        xCm: wallX,
        yCm: clamp(snapCm(pointerY - width / 2), 0, yLimit - width),
        rotationZDeg: resolvedRotation,
        wallId,
      }),
    };
  }).filter(Boolean).sort((a, b) => a.distanceCm - b.distanceCm);

  const nearestBoundary = boundaryCandidates[0];
  if (!forceFree && nearestBoundary?.distanceCm <= MODULE_WALL_SNAP_DISTANCE_CM) {
    return { ok: true, placement: nearestBoundary.placement, mode: 'wall' };
  }

  if (!freePlacement) return { ok: false, message: 'Modül aktif stand alanına sığmıyor.' };
  return { ok: true, placement: freePlacement, mode: 'free' };
}


function getVisualRightVector(rotationZDeg) {
  const radians = normalizeModuleRotationZDeg(rotationZDeg) * Math.PI / 180;
  return { x: Math.cos(radians), y: -Math.sin(radians) };
}

export function createFreeSidePlacement({
  sourcePlacement,
  sourceWidthCm,
  insertedWidthCm,
  side = 'right',
} = {}) {
  if (!sourcePlacement || (side !== 'left' && side !== 'right')) return null;
  const sourceWidth = Number(sourceWidthCm);
  const insertedWidth = Number(insertedWidthCm);
  if (![sourceWidth, insertedWidth].every(Number.isFinite) || sourceWidth <= 0 || insertedWidth <= 0) return null;

  const rotationZDeg = normalizeModuleRotationZDeg(sourcePlacement.rotationZDeg);
  const sourceCenter = getPlacementCenterCm(sourcePlacement, sourceWidth);
  if (!sourceCenter) return null;
  const right = getVisualRightVector(rotationZDeg);
  const direction = side === 'right' ? 1 : -1;
  const centerDistance = (sourceWidth + insertedWidth) / 2;

  return placementFromCenterCm({
    centerXCm: sourceCenter.xCm + right.x * centerDistance * direction,
    centerYCm: sourceCenter.yCm + right.y * centerDistance * direction,
    widthCm: insertedWidth,
    rotationZDeg,
    template: {
      zCm: sourcePlacement.zCm ?? 0,
      wallId: 'free',
    },
  });
}

function createFreeSideFixturePlacement({
  sourceModule,
  insertedModule,
  side,
  standXCm,
  standYCm,
} = {}) {
  if (!sourceModule?.placement || !insertedModule) return null;
  const sourceWidth = Number(sourceModule.widthCm);
  const sourceDepth = Number(sourceModule.depthCm);
  const insertedWidth = Number(insertedModule.widthCm);
  const insertedDepth = Number(insertedModule.depthCm);
  if (![sourceWidth, insertedWidth, insertedDepth].every(Number.isFinite)) return null;

  const sourceRotation = normalizeModuleRotationZDeg(sourceModule.placement.rotationZDeg);
  const insertedRotation = normalizeModuleRotationZDeg(
    insertedModule.type === 'bar-stool' ? 270 : sourceRotation,
  );
  const right = getVisualRightVector(sourceRotation);
  const direction = side === 'right' ? 1 : -1;
  const sourceCenter = getPlacementCenterCm(sourceModule.placement, sourceWidth);
  if (!sourceCenter) return null;

  const sourcePhysicalDepth = Number.isFinite(sourceDepth) && sourceDepth > 0
    ? sourceDepth
    : MODULE_COLLISION_DEPTH_CM;
  const sourceExtents = getRotatedHalfExtentsCm(sourceWidth, sourcePhysicalDepth, sourceRotation);
  const insertedExtents = getRotatedHalfExtentsCm(insertedWidth, insertedDepth, insertedRotation);
  const centerDistance = Math.abs(right.x) * (sourceExtents.halfX + insertedExtents.halfX)
    + Math.abs(right.y) * (sourceExtents.halfY + insertedExtents.halfY);

  let centerXCm = sourceCenter.xCm + right.x * centerDistance * direction;
  let centerYCm = sourceCenter.yCm + right.y * centerDistance * direction;
  const xLimit = Number(standXCm);
  const yLimit = Number(standYCm);
  if (![centerXCm, centerYCm, xLimit, yLimit].every(Number.isFinite)) return null;

  // Keep the side contact, but clamp the perpendicular axis so deeper fixtures remain inside the stand.
  const perpendicular = { x: -right.y, y: right.x };
  const minCenterX = insertedExtents.halfX;
  const maxCenterX = xLimit - insertedExtents.halfX;
  const minCenterY = insertedExtents.halfY;
  const maxCenterY = yLimit - insertedExtents.halfY;
  if (maxCenterX < minCenterX || maxCenterY < minCenterY) return null;

  if (Math.abs(perpendicular.x) > Math.abs(perpendicular.y)) {
    centerXCm = clamp(centerXCm, minCenterX, maxCenterX);
  } else {
    centerYCm = clamp(centerYCm, minCenterY, maxCenterY);
  }

  return placementFromCenterCm({
    centerXCm,
    centerYCm,
    widthCm: insertedWidth,
    rotationZDeg: insertedRotation,
    template: {
      zCm: insertedModule.placement?.zCm ?? sourceModule.placement.zCm ?? 0,
      wallId: 'free',
    },
  });
}

export function planFreeSideInsertion({
  modules = [],
  insertedModules = [],
  targetModuleId,
  side = 'right',
  standType,
  standXCm,
  standYCm,
} = {}) {
  if (side !== 'left' && side !== 'right') {
    return { ok: false, message: 'Ekleme yönü geçersiz.' };
  }
  const sourceModule = modules.find((module) => module?.id === targetModuleId);
  if (!sourceModule?.placement || sourceModule.placement.wallId !== 'free') {
    return { ok: false, message: 'Hedef modül serbest yerleşimde değil.' };
  }
  if (!insertedModules.length) {
    return { ok: false, message: 'Eklenecek modül bulunamadı.' };
  }

  // insertedModules görsel soldan sağa seçim sırasıdır. Sol tarafa eklerken
  // hedefe en yakın modül listenin sonundaki olacağı için fiziksel planı tersten kurarız.
  const physicalOrder = side === 'left'
    ? [...insertedModules].reverse()
    : [...insertedModules];
  const placements = new Map();
  const plannedModules = [];
  let anchorPlacement = sourceModule.placement;
  let anchorWidthCm = Number(sourceModule.widthCm);

  for (const module of physicalOrder) {
    const anchorModule = plannedModules.length
      ? plannedModules[plannedModules.length - 1]
      : sourceModule;
    const nextPlacement = hasStrictDepthBounds(module.depthCm)
      ? createFreeSideFixturePlacement({
          sourceModule: { ...anchorModule, placement: anchorPlacement, widthCm: anchorWidthCm },
          insertedModule: module,
          side,
          standXCm,
          standYCm,
        })
      : createFreeSidePlacement({
          sourcePlacement: anchorPlacement,
          sourceWidthCm: anchorWidthCm,
          insertedWidthCm: module.widthCm,
          side,
        });
    if (!nextPlacement) {
      return { ok: false, message: 'Serbest komşu yerleşimi hesaplanamadı.' };
    }

    const validation = validatePlacementAgainstModules({
      placement: nextPlacement,
      widthCm: module.widthCm,
      depthCm: module.depthCm,
      moduleId: module.id,
      moduleType: module.type,
      shape: module.shape,
      modules: [...modules, ...plannedModules],
      standType,
      standXCm,
      standYCm,
    });
    if (!validation.ok) return validation;

    placements.set(module.id, nextPlacement);
    plannedModules.push({ ...module, placement: nextPlacement });
    anchorPlacement = nextPlacement;
    anchorWidthCm = Number(module.widthCm);
  }

  return {
    ok: true,
    placements,
    insertedModuleIds: insertedModules.map((module) => module.id),
  };
}
