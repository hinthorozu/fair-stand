export const MODULE_PLACEMENT_SNAP_CM = 50;
export const MODULE_PLACEMENT_ROTATIONS = Object.freeze([0, 90]);

const WALL_AXIS = Object.freeze({
  back: 'x',
  left: 'y',
  right: 'y',
  free: null,
});

const STAND_WALLS = Object.freeze({
  'back-wall': Object.freeze(['back']),
  'l-left': Object.freeze(['back', 'left']),
  'l-right': Object.freeze(['back', 'right']),
  'u-stand': Object.freeze(['back', 'left', 'right']),
  island: Object.freeze(['free']),
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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
    return { ok: false, message: 'Bu stand tipinde bu kenara modül yerleştirilemez.' };
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
    const occupiedX = rotation === 90 ? 0 : width;
    const occupiedY = rotation === 90 ? width : 0;
    if (x < 0 || y < 0 || x + occupiedX > xLimit || y + occupiedY > yLimit) {
      return { ok: false, message: 'Modül aktif stand alanını aşıyor.' };
    }
  }

  return { ok: true };
}

export function placementsOverlap(moduleA, moduleB) {
  if (!moduleA?.placement || !moduleB?.placement) return false;
  if (moduleA.placement.wallId !== moduleB.placement.wallId) return false;

  const a = getPlacementInterval(moduleA.placement, moduleA.widthCm);
  const b = getPlacementInterval(moduleB.placement, moduleB.widthCm);
  if (!a || !b || a.axis !== b.axis) return false;

  return a.startCm < b.endCm && b.startCm < a.endCm;
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

export function snapPlacementToStand({
  standType,
  widthCm,
  pointerXCm,
  pointerYCm,
  standXCm,
  standYCm,
  preferredRotationZDeg = 0,
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

  if (walls.length === 1 && walls[0] === 'free') {
    const rotationZDeg = preferredRotationZDeg === 90 ? 90 : 0;
    const maxX = rotationZDeg === 0 ? xLimit - width : xLimit;
    const maxY = rotationZDeg === 90 ? yLimit - width : yLimit;
    if (maxX < 0 || maxY < 0) return { ok: false, message: 'Modül stand alanına sığmıyor.' };

    const placement = createModulePlacement({
      xCm: clamp(snapCm(pointerX - (rotationZDeg === 0 ? width / 2 : 0)), 0, maxX),
      yCm: clamp(snapCm(pointerY - (rotationZDeg === 90 ? width / 2 : 0)), 0, maxY),
      rotationZDeg,
      wallId: 'free',
    });
    return { ok: true, placement };
  }

  const candidates = walls.map((wallId) => {
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

  if (!candidates.length) return { ok: false, message: 'Modül seçili stand kenarlarına sığmıyor.' };
  return { ok: true, placement: candidates[0].placement };
}
