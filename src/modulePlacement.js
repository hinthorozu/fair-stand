export const MODULE_PLACEMENT_SNAP_CM = 50;
export const MODULE_PLACEMENT_ROTATIONS = Object.freeze([0, 90]);
export const MODULE_WALL_SNAP_DISTANCE_CM = 50;

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

export function snapCm(value, stepCm = MODULE_PLACEMENT_SNAP_CM) {
  const number = Number(value);
  const step = Number(stepCm);
  if (!Number.isFinite(number) || !Number.isFinite(step) || step <= 0) return null;
  return Math.round(number / step) * step;
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
    rotationZDeg: rotationZDeg === 90 ? 90 : 0,
    wallId,
  };
}

export function getPlacementInterval(placement, widthCm) {
  if (!placement || !Number.isFinite(Number(widthCm))) return null;
  const axis = getWallAxis(placement.wallId)
    ?? (placement.rotationZDeg === 90 ? 'y' : 'x');
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

  const rotation = placement.rotationZDeg === 90 ? 90 : 0;
  const x = Number(placement.xCm);
  const y = Number(placement.yCm);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

  if (rotation === 90) {
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

function pointIsSegmentEndpoint(segment, coordinateCm) {
  return nearlyEqual(coordinateCm, segment.startCm)
    || nearlyEqual(coordinateCm, segment.endCm);
}

export function getWallUsedCm(modules = [], wallId = 'back') {
  return modules.reduce((sum, module) => (
    module?.placement?.wallId === wallId ? sum + (Number(module.widthCm) || 0) : sum
  ), 0);
}

export function getWallExtentCm(modules = [], wallId = 'back') {
  return modules.reduce((max, module) => {
    if (module?.placement?.wallId !== wallId) return max;
    const interval = getPlacementInterval(module.placement, module.widthCm);
    return interval ? Math.max(max, interval.endCm) : max;
  }, 0);
}

export function validateModulePlacement({
  placement,
  widthCm,
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

  const rotation = placement.rotationZDeg === 90 ? 90 : 0;
  const x = Number(placement.xCm);
  const y = Number(placement.yCm);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return { ok: false, message: 'Modül koordinatları geçersiz.' };
  }

  if (placement.wallId === 'back') {
    if (rotation !== 0 || y !== 0) return { ok: false, message: 'Sırt duvar modülü X yönünde olmalı.' };
    if (x < 0 || x + width > xLimit) return { ok: false, message: 'Modül X stand sınırını aşıyor.' };
  } else if (placement.wallId === 'left') {
    if (rotation !== 90 || x !== 0) return { ok: false, message: 'Sol duvar modülü Y yönünde olmalı.' };
    if (y < 0 || y + width > yLimit) return { ok: false, message: 'Modül Y stand sınırını aşıyor.' };
  } else if (placement.wallId === 'right') {
    if (rotation !== 90 || x !== xLimit) return { ok: false, message: 'Sağ duvar modülü Y yönünde olmalı.' };
    if (y < 0 || y + width > yLimit) return { ok: false, message: 'Modül Y stand sınırını aşıyor.' };
  } else {
    const endX = x + (rotation === 0 ? width : 0);
    const endY = y + (rotation === 90 ? width : 0);
    if (x < 0 || y < 0 || endX > xLimit || endY > yLimit) {
      return { ok: false, message: 'Modül aktif stand alanını aşıyor.' };
    }
  }

  return { ok: true };
}

export function placementsOverlap(moduleA, moduleB) {
  const a = getGroundSegment(moduleA);
  const b = getGroundSegment(moduleB);
  if (!a || !b) return false;

  if (a.axis === b.axis) {
    if (!nearlyEqual(a.fixedCm, b.fixedCm)) return false;
    return a.startCm < b.endCm - EPSILON_CM
      && b.startCm < a.endCm - EPSILON_CM;
  }

  const horizontal = a.axis === 'x' ? a : b;
  const vertical = a.axis === 'y' ? a : b;
  const intersectionX = vertical.fixedCm;
  const intersectionY = horizontal.fixedCm;
  const onHorizontal = intersectionX >= horizontal.startCm - EPSILON_CM
    && intersectionX <= horizontal.endCm + EPSILON_CM;
  const onVertical = intersectionY >= vertical.startCm - EPSILON_CM
    && intersectionY <= vertical.endCm + EPSILON_CM;
  if (!onHorizontal || !onVertical) return false;

  // L ve T bağlantıları fiziksel olarak geçerlidir: kesişim en az bir modülün
  // ucundaysa birleşmeye izin verilir. İki modülün de gövdesinin ortasından
  // geçen '+' tipi gerçek çakışma ise reddedilir.
  const horizontalEndpoint = pointIsSegmentEndpoint(horizontal, intersectionX);
  const verticalEndpoint = pointIsSegmentEndpoint(vertical, intersectionY);
  return !horizontalEndpoint && !verticalEndpoint;
}

export function validatePlacementAgainstModules({
  placement,
  widthCm,
  moduleId = null,
  modules = [],
  standType,
  standXCm,
  standYCm,
} = {}) {
  const boundary = validateModulePlacement({
    placement,
    widthCm,
    standType,
    standXCm,
    standYCm,
  });
  if (!boundary.ok) return boundary;

  const candidate = { id: moduleId, widthCm, placement };
  const collision = modules.find((module) => (
    module?.id !== moduleId && placementsOverlap(candidate, module)
  ));

  if (collision) {
    return {
      ok: false,
      message: 'Bu konumda başka bir modül var.',
      collisionModuleId: collision.id,
    };
  }

  return { ok: true };
}

function createFreePlacement({
  widthCm,
  pointerXCm,
  pointerYCm,
  standXCm,
  standYCm,
  rotationZDeg,
}) {
  const width = Number(widthCm);
  const xLimit = Number(standXCm);
  const yLimit = Number(standYCm);
  const rotation = rotationZDeg === 90 ? 90 : 0;
  const maxX = rotation === 0 ? xLimit - width : xLimit;
  const maxY = rotation === 90 ? yLimit - width : yLimit;
  if (maxX < 0 || maxY < 0) return null;

  return createModulePlacement({
    xCm: rotation === 0
      ? clamp(snapCm(Number(pointerXCm) - width / 2), 0, maxX)
      : clamp(snapCm(pointerXCm), 0, maxX),
    yCm: rotation === 90
      ? clamp(snapCm(Number(pointerYCm) - width / 2), 0, maxY)
      : clamp(snapCm(pointerYCm), 0, maxY),
    rotationZDeg: rotation,
    wallId: 'free',
  });
}

export function snapPlacementToStand({
  standType,
  widthCm,
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

  const preferredRotation = preferredRotationZDeg === 90 ? 90 : 0;
  const freePlacement = createFreePlacement({
    widthCm: width,
    pointerXCm: pointerX,
    pointerYCm: pointerY,
    standXCm: xLimit,
    standYCm: yLimit,
    rotationZDeg: preferredRotation,
  });

  const activeBoundaryWalls = walls.filter((wallId) => wallId !== 'free');
  const boundaryCandidates = activeBoundaryWalls.map((wallId) => {
    const wallRotation = wallId === 'back' ? 0 : 90;
    if (rotationLocked && wallRotation !== preferredRotation) return null;

    if (wallId === 'back') {
      if (width > xLimit) return null;
      return {
        distanceCm: Math.abs(pointerY),
        placement: createModulePlacement({
          xCm: clamp(snapCm(pointerX - width / 2), 0, xLimit - width),
          yCm: 0,
          rotationZDeg: 0,
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
        rotationZDeg: 90,
        wallId,
      }),
    };
  }).filter(Boolean).sort((a, b) => a.distanceCm - b.distanceCm);

  const nearestBoundary = boundaryCandidates[0];
  if (nearestBoundary?.distanceCm <= MODULE_WALL_SNAP_DISTANCE_CM) {
    return { ok: true, placement: nearestBoundary.placement, mode: 'wall' };
  }

  if (!freePlacement) return { ok: false, message: 'Modül aktif stand alanına sığmıyor.' };
  return { ok: true, placement: freePlacement, mode: 'free' };
}
