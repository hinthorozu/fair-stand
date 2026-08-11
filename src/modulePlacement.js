export const MODULE_PLACEMENT_SNAP_CM = 50;
export const MODULE_PLACEMENT_ROTATIONS = Object.freeze([0, 90, 180, 270]);
export const MODULE_WALL_SNAP_DISTANCE_CM = 50;
export const MODULE_NEIGHBOR_SNAP_DISTANCE_CM = 30;

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

export function normalizeModuleRotationZDeg(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  const quarterTurns = Math.round(number / 90);
  return ((quarterTurns * 90) % 360 + 360) % 360;
}

export function rotateModuleRotationZDeg(value, deltaDeg = 90) {
  return normalizeModuleRotationZDeg(
    normalizeModuleRotationZDeg(value) + Number(deltaDeg || 0),
  );
}

export function rotateModulePlacementAroundCenter(placement, widthCm, deltaDeg = 90) {
  if (!placement) return null;
  const width = Number(widthCm);
  const x = Number(placement.xCm);
  const y = Number(placement.yCm);
  if (![width, x, y].every(Number.isFinite) || width <= 0) return null;

  const currentRotation = normalizeModuleRotationZDeg(placement.rotationZDeg);
  const nextRotation = rotateModuleRotationZDeg(currentRotation, deltaDeg);
  const currentVertical = isVerticalModuleRotation(currentRotation);
  const nextVertical = isVerticalModuleRotation(nextRotation);

  const centerX = x + (currentVertical ? 0 : width / 2);
  const centerY = y + (currentVertical ? width / 2 : 0);

  return createModulePlacement({
    ...placement,
    xCm: snapCm(nextVertical ? centerX : centerX - width / 2),
    yCm: snapCm(nextVertical ? centerY - width / 2 : centerY),
    rotationZDeg: nextRotation,
  });
}

export function isVerticalModuleRotation(rotationZDeg) {
  const rotation = normalizeModuleRotationZDeg(rotationZDeg);
  return rotation === 90 || rotation === 270;
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
    const endX = x + (!vertical ? width : 0);
    const endY = y + (vertical ? width : 0);
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
  widthCm,
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
  const movingAxis = isVerticalModuleRotation(resolvedRotation) ? 'y' : 'x';
  const candidates = [];

  const addCandidate = (placement, targetModuleId, snapKind, priority = 0) => {
    const center = getPlacementCenter(placement, width);
    if (!center) return;
    const distanceCm = Math.hypot(center.xCm - pointerX, center.yCm - pointerY);
    if (distanceCm > threshold + EPSILON_CM) return;

    const validation = validatePlacementAgainstModules({
      placement,
      widthCm: width,
      moduleId,
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

  modules.forEach((targetModule) => {
    if (!targetModule?.placement || targetModule.id === moduleId) return;
    const target = getGroundSegment(targetModule);
    if (!target) return;

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
  const rotation = normalizeModuleRotationZDeg(rotationZDeg);
  const vertical = isVerticalModuleRotation(rotation);
  const maxX = !vertical ? xLimit - width : xLimit;
  const maxY = vertical ? yLimit - width : yLimit;
  if (maxX < 0 || maxY < 0) return null;

  return createModulePlacement({
    xCm: !vertical
      ? clamp(snapCm(Number(pointerXCm) - width / 2), 0, maxX)
      : clamp(snapCm(pointerXCm), 0, maxX),
    yCm: vertical
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

  const preferredRotation = normalizeModuleRotationZDeg(preferredRotationZDeg);
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
  if (nearestBoundary?.distanceCm <= MODULE_WALL_SNAP_DISTANCE_CM) {
    return { ok: true, placement: nearestBoundary.placement, mode: 'wall' };
  }

  if (!freePlacement) return { ok: false, message: 'Modül aktif stand alanına sığmıyor.' };
  return { ok: true, placement: freePlacement, mode: 'free' };
}
