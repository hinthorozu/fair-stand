import {
  createModulePlacement,
  getAllowedWallIds,
  getWallAxis,
} from './modulePlacement.js';

function createWallPlacement(wallId, startCm, standXCm) {
  if (wallId === 'back') {
    return createModulePlacement({
      xCm: startCm,
      yCm: 0,
      zCm: 0,
      rotationZDeg: 0,
      wallId,
    });
  }

  return createModulePlacement({
    xCm: wallId === 'right' ? standXCm : 0,
    yCm: startCm,
    zCm: 0,
    rotationZDeg: 90,
    wallId,
  });
}

function getWallLimitCm(wallId, standXCm, standYCm) {
  return getWallAxis(wallId) === 'y' ? standYCm : standXCm;
}

function getCornerTransition(wallId, side, addedWidthCm, standXCm) {
  if (wallId === 'back' && side === 'left') {
    return { wallId: 'left', startCm: 0, nextSide: 'right' };
  }
  if (wallId === 'back' && side === 'right') {
    return { wallId: 'right', startCm: 0, nextSide: 'right' };
  }
  if (wallId === 'left' && side === 'left') {
    return { wallId: 'back', startCm: 0, nextSide: 'right' };
  }
  if (wallId === 'right' && side === 'left') {
    return {
      wallId: 'back',
      startCm: standXCm - addedWidthCm,
      nextSide: 'left',
    };
  }
  return null;
}

export function resolveAdjacentPlacement({
  sourcePlacement,
  sourceWidthCm,
  addedWidthCm,
  side,
  standType,
  standXCm,
  standYCm,
} = {}) {
  if (!sourcePlacement) {
    return { ok: false, message: 'Hedef modülün yerleşim bilgisi bulunamadı.' };
  }

  const sourceWidth = Number(sourceWidthCm);
  const addedWidth = Number(addedWidthCm);
  const xLimit = Number(standXCm);
  const yLimit = Number(standYCm);
  if (
    ![sourceWidth, addedWidth, xLimit, yLimit].every(Number.isFinite)
    || sourceWidth <= 0
    || addedWidth <= 0
    || xLimit <= 0
    || yLimit <= 0
  ) {
    return { ok: false, message: 'Geçerli modül ve stand ölçüleri gerekli.' };
  }
  if (side !== 'left' && side !== 'right') {
    return { ok: false, message: 'Geçerli bir ekleme yönü gerekli.' };
  }

  const wallId = sourcePlacement.wallId ?? 'back';
  const axis = getWallAxis(wallId)
    ?? (sourcePlacement.rotationZDeg === 90 ? 'y' : 'x');
  if (axis !== 'x' && axis !== 'y') {
    return { ok: false, message: 'Bu yerleşimde köşe geçişi kullanılamaz.' };
  }

  const sourceStart = axis === 'y'
    ? Number(sourcePlacement.yCm)
    : Number(sourcePlacement.xCm);
  if (!Number.isFinite(sourceStart)) {
    return { ok: false, message: 'Hedef modül koordinatı geçersiz.' };
  }

  const wallLimit = getWallLimitCm(wallId, xLimit, yLimit);
  const nextStart = side === 'left'
    ? sourceStart - addedWidth
    : sourceStart + sourceWidth;
  const sameWallFits = nextStart >= 0 && nextStart + addedWidth <= wallLimit;

  if (sameWallFits) {
    return {
      ok: true,
      wrapped: false,
      placement: createWallPlacement(wallId, nextStart, xLimit),
      nextSide: side,
    };
  }

  const crossedExpectedEnd = side === 'left'
    ? nextStart < 0
    : nextStart + addedWidth > wallLimit;
  if (!crossedExpectedEnd) {
    return { ok: false, message: 'Modül aktif stand sınırını aşıyor.' };
  }

  const transition = getCornerTransition(wallId, side, addedWidth, xLimit);
  if (!transition) {
    return { ok: false, message: 'Bu yönde köşeden devam eden aktif bir duvar yok.' };
  }

  const allowedWalls = getAllowedWallIds(standType);
  if (!allowedWalls.includes(transition.wallId)) {
    return { ok: false, message: 'Bu stand tipinde köşenin devamında aktif bir duvar yok.' };
  }

  const targetLimit = getWallLimitCm(transition.wallId, xLimit, yLimit);
  if (transition.startCm < 0 || transition.startCm + addedWidth > targetLimit) {
    return { ok: false, message: 'Modül köşeden sonraki duvar sınırına sığmıyor.' };
  }

  return {
    ok: true,
    wrapped: true,
    fromWallId: wallId,
    toWallId: transition.wallId,
    nextSide: transition.nextSide,
    placement: createWallPlacement(transition.wallId, transition.startCm, xLimit),
  };
}
