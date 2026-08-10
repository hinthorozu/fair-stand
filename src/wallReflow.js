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

function findPreviousPlacement(cursorEndCm, widthCm, segments, standXCm, standYCm) {
  for (let index = segments.length - 1; index >= 0; index -= 1) {
    const segment = segments[index];
    const segmentStart = segment.offsetCm;
    const segmentEnd = segment.offsetCm + segment.lengthCm;
    if (cursorEndCm < segmentStart - EPSILON_CM) continue;

    const pathEndCm = Math.min(cursorEndCm, segmentEnd);
    const localEndCm = pathEndCm - segmentStart;
    if (localEndCm + EPSILON_CM < widthCm) continue;

    const localStartCm = localEndCm - widthCm;
    const pathStartCm = segmentStart + localStartCm;
    return {
      placement: createPlacement(segment, localStartCm, widthCm, standXCm, standYCm),
      pathStartCm,
      previousCursorCm: pathStartCm,
    };
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

  if (side === 'right') {
    let cursorCm = targetEntry.pathStartCm + targetWidthCm;

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

    for (let index = targetIndex + 1; index < activeModules.length; index += 1) {
      const entry = activeModules[index];
      const widthCm = Number(entry.module.widthCm);

      // Boşluk varsa mevcut modülü yerinden oynatma. Yalnızca yeni eklenen
      // modül gerçekten üzerine geliyorsa bu ve devamındaki modülleri ileri it.
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
  } else {
    let cursorEndCm = targetEntry.pathStartCm;

    // Sol tarafa birden fazla modül eklenirse seçim sırası duvar üzerindeki
    // soldan-sağa sırasını korur; hedefe en yakın modül sondaki modüldür.
    for (let index = insertedModules.length - 1; index >= 0; index -= 1) {
      const module = insertedModules[index];
      const widthCm = Number(module?.widthCm);
      if (!module?.id || !Number.isFinite(widthCm) || widthCm <= 0) {
        return { ok: false, message: 'Geçersiz modül genişliği bulundu.' };
      }

      const previous = findPreviousPlacement(
        cursorEndCm,
        widthCm,
        segments,
        standXCm,
        standYCm,
      );
      if (!previous) {
        return {
          ok: false,
          message: 'Aktif duvar zincirinde modüllerin tamamı için yeterli alan yok.',
        };
      }

      placements.set(module.id, previous.placement);
      cursorEndCm = previous.previousCursorCm;
    }

    for (let index = targetIndex - 1; index >= 0; index -= 1) {
      const entry = activeModules[index];
      const widthCm = Number(entry.module.widthCm);
      const originalEndCm = entry.pathStartCm + widthCm;

      // Boşluk yeterliyse önceki modülleri de yerinde bırak. Sadece çakışan
      // modülleri zincirin başlangıcına doğru it.
      if (originalEndCm <= cursorEndCm + EPSILON_CM) break;

      const previous = findPreviousPlacement(
        cursorEndCm,
        widthCm,
        segments,
        standXCm,
        standYCm,
      );
      if (!previous) {
        return {
          ok: false,
          message: 'Aktif duvar zincirinde modüllerin tamamı için yeterli alan yok.',
        };
      }

      placements.set(entry.module.id, previous.placement);
      cursorEndCm = previous.previousCursorCm;
    }
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
