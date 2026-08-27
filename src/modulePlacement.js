import { STAND_DIMENSIONS } from './catalog.js';

export const MODULE_PLACEMENT_SNAP_CM = 50;
export const MODULE_PLACEMENT_ROTATIONS = Object.freeze([0, 90, 180, 270]);
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

function snapDepthCenterCm(value, depthCm) {
  const depth = Number(depthCm);
  const halfDepth = depth / 2;
  return halfDepth + snapCm(Number(value) - halfDepth);
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

export function rotateModulePlacementAroundCenter(placement, widthCm, deltaDeg = 90, depthCm = null) {
  if (!placement) return null;
  const width = Number(widthCm);
  const x = Number(placement.xCm);
  const y = Number(placement.yCm);
  if (![width, x, y].every(Number.isFinite) || width <= 0) return null;

  const currentRotation = normalizeModuleRotationZDeg(placement.rotationZDeg);
  const nextRotation = rotateModuleRotationZDeg(currentRotation, deltaDeg);
  const currentVertical = isVerticalModuleRotation(currentRotation);
  const nextVertical = isVerticalModuleRotation(nextRotation);

  // R ile dönüşte modülün dünya merkezini sabit tut. Grid snap yalnız sürükleme/yerleştirmede uygulanır.
  const centerX = x + (currentVertical ? 0 : width / 2);
  const centerY = y + (currentVertical ? width / 2 : 0);

  return createModulePlacement({
    ...placement,
    xCm: nextVertical ? centerX : centerX - width / 2,
    yCm: nextVertical ? centerY - width / 2 : centerY,
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
      const halfDepth = Number(depthCm) / 2;
      if (vertical) {
        if (x - halfDepth < 0 || x + halfDepth > xLimit || y < 0 || y + width > yLimit) {
          return { ok: false, message: 'Modül aktif stand alanını aşıyor.' };
        }
      } else if (x < 0 || x + width > xLimit || y - halfDepth < 0 || y + halfDepth > yLimit) {
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

export function placementsOverlap(moduleA, moduleB) {
  if (isTopFixtureType(moduleA?.type) || isTopFixtureType(moduleB?.type)) return false;
  const a = getGroundSegment(moduleA);
  const b = getGroundSegment(moduleB);
  if (!a || !b) return false;

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
    // Gerçek L/T bağlantılarında merkez çizgileri birleşebilir; en az bir
    // modülün ucu bağlantı noktasındaysa bu birleşim kasıtlıdır.
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

  // Merkez çizgileri kesişmese bile 10 cm kasalar fiziksel olarak birbirine
  // girebilir. Dik modülün yarı derinliğini X, yatay modülün yarı derinliğini
  // Y doğrultusunda genişleterek gerçek footprint çakışmasını yakala.
  const verticalHalfDepth = verticalDepth / 2;
  const horizontalHalfDepth = horizontalDepth / 2;
  const physicalXOverlap = intersectionX > horizontal.startCm - verticalHalfDepth + EPSILON_CM
    && intersectionX < horizontal.endCm + verticalHalfDepth - EPSILON_CM;
  const physicalYOverlap = intersectionY > vertical.startCm - horizontalHalfDepth + EPSILON_CM
    && intersectionY < vertical.endCm + horizontalHalfDepth - EPSILON_CM;
  return physicalXOverlap && physicalYOverlap;
}

export function validatePlacementAgainstModules({
  placement,
  widthCm,
  depthCm = null,
  moduleId = null,
  moduleType = null,
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

  modules.forEach((targetModule) => {
    if (!targetModule?.placement || targetModule.id === moduleId) return;
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
  const xLimit = Number(standXCm);
  const yLimit = Number(standYCm);
  const rotation = normalizeModuleRotationZDeg(rotationZDeg);
  const vertical = isVerticalModuleRotation(rotation);
  const strictDepth = hasStrictDepthBounds(depthCm);
  const halfDepth = strictDepth ? Number(depthCm) / 2 : 0;
  const minX = vertical && strictDepth ? halfDepth : 0;
  const maxX = !vertical ? xLimit - width : (strictDepth ? xLimit - halfDepth : xLimit);
  const minY = !vertical && strictDepth ? halfDepth : 0;
  const maxY = vertical ? yLimit - width : (strictDepth ? yLimit - halfDepth : yLimit);
  if (maxX < minX || maxY < minY) return null;

  let xCm = !vertical
    ? clamp(snapCm(Number(pointerXCm) - width / 2), 0, maxX)
    : clamp(
        strictDepth ? snapDepthCenterCm(pointerXCm, depthCm) : snapCm(pointerXCm),
        minX,
        maxX,
      );
  let yCm = vertical
    ? clamp(snapCm(Number(pointerYCm) - width / 2), 0, maxY)
    : clamp(
        strictDepth ? snapDepthCenterCm(pointerYCm, depthCm) : snapCm(pointerYCm),
        minY,
        maxY,
      );

  if (strictDepth) {
    const edgeSnap = MODULE_PLACEMENT_SNAP_CM;
    const useWallInnerFaces = moduleType === 'sofa-set' || moduleType === 'table-chair-set' || moduleType === 'bar-stool';
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


function getVisualRightAxisDirection(rotationZDeg) {
  const rotation = normalizeModuleRotationZDeg(rotationZDeg);
  if (rotation === 0) return { axis: 'x', sign: 1 };
  if (rotation === 90) return { axis: 'y', sign: -1 };
  if (rotation === 180) return { axis: 'x', sign: -1 };
  return { axis: 'y', sign: 1 };
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
  const sourceX = Number(sourcePlacement.xCm);
  const sourceY = Number(sourcePlacement.yCm);
  if (
    ![sourceWidth, insertedWidth, sourceX, sourceY].every(Number.isFinite)
    || sourceWidth <= 0
    || insertedWidth <= 0
  ) return null;

  const rotationZDeg = normalizeModuleRotationZDeg(sourcePlacement.rotationZDeg);
  const rightDirection = getVisualRightAxisDirection(rotationZDeg);
  const direction = rightDirection.sign * (side === 'right' ? 1 : -1);
  let xCm = sourceX;
  let yCm = sourceY;

  if (rightDirection.axis === 'x') {
    xCm = direction > 0 ? sourceX + sourceWidth : sourceX - insertedWidth;
  } else {
    yCm = direction > 0 ? sourceY + sourceWidth : sourceY - insertedWidth;
  }

  return createModulePlacement({
    xCm,
    yCm,
    zCm: sourcePlacement.zCm ?? 0,
    rotationZDeg,
    wallId: 'free',
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
    const nextPlacement = createFreeSidePlacement({
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
