import { createModulePlacement } from './modulePlacement.js';

const EPSILON_CM = 0.001;

function getSegments(standType, standXCm, standYCm) {
  const x = Number(standXCm);
  const y = Number(standYCm);
  if (!Number.isFinite(x) || !Number.isFinite(y) || x <= 0 || y <= 0) return [];

  const definitions = {
    'back-wall': [['back', x]],
    'l-left': [['left', y], ['back', x]],
    'l-right': [['back', x], ['right', y]],
    'u-stand': [['left', y], ['back', x], ['right', y]],
  };

  let offsetCm = 0;
  return (definitions[standType] ?? []).map(([wallId, lengthCm]) => {
    const segment = { wallId, lengthCm, offsetCm };
    offsetCm += lengthCm;
    return segment;
  });
}

export function getContinuousWallSegments(standType, standXCm, standYCm) {
  return getSegments(standType, standXCm, standYCm).map((segment) => ({ ...segment }));
}

export function getContinuousWallCapacityCm(standType, standXCm, standYCm) {
  return getSegments(standType, standXCm, standYCm)
    .reduce((sum, segment) => sum + Number(segment.lengthCm), 0);
}

function placementToPathStart(module, segments, standYCm) {
  const placement = module?.placement;
  const widthCm = Number(module?.widthCm);
  if (!placement || !Number.isFinite(widthCm) || widthCm <= 0) return null;

  const segment = segments.find((candidate) => candidate.wallId === placement.wallId);
  if (!segment) return null;

  let localStartCm;
  if (placement.wallId === 'left') {
    localStartCm = Number(standYCm) - (Number(placement.yCm) + widthCm);
  } else if (placement.wallId === 'back') {
    localStartCm = Number(placement.xCm);
  } else if (placement.wallId === 'right') {
    localStartCm = Number(placement.yCm);
  } else {
    return null;
  }

  if (!Number.isFinite(localStartCm)) return null;
  if (
    localStartCm < -EPSILON_CM
    || localStartCm + widthCm > segment.lengthCm + EPSILON_CM
  ) {
    return null;
  }

  return segment.offsetCm + Math.max(0, localStartCm);
}

function createPlacement(segment, localStartCm, widthCm, standXCm, standYCm) {
  if (segment.wallId === 'left') {
    return createModulePlacement({
      xCm: 0,
      yCm: Number(standYCm) - localStartCm - widthCm,
      zCm: 0,
      rotationZDeg: 90,
      wallId: 'left',
    });
  }

  if (segment.wallId === 'right') {
    return createModulePlacement({
      xCm: Number(standXCm),
      yCm: localStartCm,
      zCm: 0,
      rotationZDeg: 90,
      wallId: 'right',
    });
  }

  return createModulePlacement({
    xCm: localStartCm,
    yCm: 0,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'back',
  });
}

function findNextPlacement(cursorCm, widthCm, segments, standXCm, standYCm) {
  for (const segment of segments) {
    const segmentStart = segment.offsetCm;
    const segmentEnd = segment.offsetCm + segment.lengthCm;
    if (cursorCm > segmentEnd + EPSILON_CM) continue;

    const localStartCm = Math.max(0, cursorCm - segmentStart);
    if (localStartCm + widthCm <= segment.lengthCm + EPSILON_CM) {
      const pathStartCm = segmentStart + localStartCm;
      return {
        placement: createPlacement(segment, localStartCm, widthCm, standXCm, standYCm),
        pathStartCm,
        nextCursorCm: pathStartCm + widthCm,
      };
    }
  }

  return null;
}

export function planContinuousWallLayout({
  modules = [],
  standType,
  standXCm,
  standYCm,
} = {}) {
  const segments = getSegments(standType, standXCm, standYCm);
  if (!segments.length) {
    return { ok: false, message: 'Bu stand tipinde sürekli duvar yerleşimi kullanılamaz.' };
  }

  const placements = new Map();
  let cursorCm = 0;

  for (const module of modules) {
    const widthCm = Number(module?.widthCm);
    if (!module?.id || !Number.isFinite(widthCm) || widthCm <= 0) {
      return { ok: false, message: 'Geçersiz modül genişliği bulundu.' };
    }

    const next = findNextPlacement(cursorCm, widthCm, segments, standXCm, standYCm);
    if (!next) {
      return {
        ok: false,
        message: 'Aktif duvar zincirinde modüllerin tamamı için yeterli alan yok.',
      };
    }

    placements.set(module.id, next.placement);
    cursorCm = next.nextCursorCm;
  }

  return {
    ok: true,
    placements,
    usedCm: cursorCm,
    capacityCm: segments.reduce((sum, segment) => sum + segment.lengthCm, 0),
  };
}

export function planContinuousWallInsertion({
  modules = [],
  insertedModules = [],
  targetModuleId,
  side,
  standType,
  standXCm,
  standYCm,
} = {}) {
  if (side !== 'left' && side !== 'right') {
    return { ok: false, message: 'Geçerli bir ekleme yönü gerekli.' };
  }

  const segments = getSegments(standType, standXCm, standYCm);
  if (!segments.length) {
    return { ok: false, message: 'Bu stand tipinde sürekli duvar yerleşimi kullanılamaz.' };
  }

  if (!insertedModules.length) {
    return { ok: false, message: 'Eklenecek modül bulunamadı.' };
  }

  const activeWallIds = new Set(segments.map((segment) => segment.wallId));
  const activeModules = modules
    .filter((module) => activeWallIds.has(module?.placement?.wallId))
    .map((module, originalIndex) => ({
      module,
      originalIndex,
      pathStartCm: placementToPathStart(module, segments, standYCm),
    }));

  if (activeModules.some((entry) => entry.pathStartCm === null)) {
    return { ok: false, message: 'Mevcut modüllerden birinin duvar yerleşimi okunamadı.' };
  }

  activeModules.sort((a, b) => (
    a.pathStartCm - b.pathStartCm || a.originalIndex - b.originalIndex
  ));

  const targetIndex = activeModules.findIndex((entry) => entry.module.id === targetModuleId);
  if (targetIndex < 0) {
    return { ok: false, message: 'Hedef modül aktif duvar zincirinde bulunamadı.' };
  }

  const targetEntry = activeModules[targetIndex];
  const targetWidthCm = Number(targetEntry.module.widthCm);
  const insertionIndex = side === 'left' ? targetIndex : targetIndex + 1;
  const chain = activeModules.map((entry) => entry.module);
  chain.splice(insertionIndex, 0, ...insertedModules);

  const placements = new Map();
  let cursorCm;
  let firstExistingIndex;

  if (side === 'right') {
    // Sağ tarafa ekleme hedefin bitiminden başlar. Sonraki modüller arasında
    // boşluk varsa yerleri korunur; yalnızca yeni modülle çakışanlar ileri itilir.
    cursorCm = targetEntry.pathStartCm + targetWidthCm;
    firstExistingIndex = targetIndex + 1;
  } else {
    // Sol tarafa ekleme listede hedefin önüne girer. Yeni modül hedefin mevcut
    // başlangıcını kullanır; hedef ve devamı sadece gerektiği kadar ileri itilir.
    cursorCm = targetEntry.pathStartCm;
    firstExistingIndex = targetIndex;
  }

  for (const module of insertedModules) {
    const widthCm = Number(module?.widthCm);
    if (!module?.id || !Number.isFinite(widthCm) || widthCm <= 0) {
      return { ok: false, message: 'Geçersiz modül genişliği bulundu.' };
    }

    const next = findNextPlacement(cursorCm, widthCm, segments, standXCm, standYCm);
    if (!next) {
      return {
        ok: false,
        message: 'Aktif duvar zincirinde modüllerin tamamı için yeterli alan yok.',
      };
    }

    placements.set(module.id, next.placement);
    cursorCm = next.nextCursorCm;
  }

  for (let index = firstExistingIndex; index < activeModules.length; index += 1) {
    const entry = activeModules[index];
    const widthCm = Number(entry.module.widthCm);

    // İlk dokunulmayan modülün başlangıcı cursor'un ilerisindeyse artık hiçbir
    // modülü oynatmaya gerek yok. Böylece sahnedeki bilinçli boşluklar korunur.
    if (entry.pathStartCm + EPSILON_CM >= cursorCm) break;

    const next = findNextPlacement(cursorCm, widthCm, segments, standXCm, standYCm);
    if (!next) {
      return {
        ok: false,
        message: 'Aktif duvar zincirinde modüllerin tamamı için yeterli alan yok.',
      };
    }

    placements.set(entry.module.id, next.placement);
    cursorCm = next.nextCursorCm;
  }

  const orderedModuleIds = chain.map((module) => module.id);
  const activeIdSet = new Set(orderedModuleIds);
  const inactiveModuleIds = modules
    .filter((module) => !activeIdSet.has(module.id))
    .map((module) => module.id);

  return {
    ok: true,
    orderedModuleIds: [...orderedModuleIds, ...inactiveModuleIds],
    placements,
  };
}
