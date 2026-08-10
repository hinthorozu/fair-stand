import { validatePlacementAgainstModules } from './modulePlacement.js';
import {
  getContinuousWallSegments,
  planContinuousWallInsertion,
} from './wallReflow.js';

const EPSILON_CM = 0.001;

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
    || localStartCm + widthCm > Number(segment.lengthCm) + EPSILON_CM
  ) {
    return null;
  }

  return Number(segment.offsetCm) + Math.max(0, localStartCm);
}

function chainSideToCallerSide(chainSide, targetWallId) {
  if (targetWallId === 'left' || targetWallId === 'right') {
    return chainSide === 'left' ? 'right' : 'left';
  }
  return chainSide;
}

function buildOrderedIds(modules, placements, segments, standYCm) {
  const activeWallIds = new Set(segments.map((segment) => segment.wallId));
  const active = [];
  const inactive = [];

  modules.forEach((module, originalIndex) => {
    const placement = placements.get(module.id) ?? module.placement;
    if (!activeWallIds.has(placement?.wallId)) {
      inactive.push({ module, originalIndex });
      return;
    }

    const pathStartCm = placementToPathStart(
      { ...module, placement },
      segments,
      standYCm,
    );
    if (pathStartCm === null) {
      inactive.push({ module, originalIndex });
      return;
    }

    active.push({ module, originalIndex, pathStartCm });
  });

  active.sort((a, b) => (
    a.pathStartCm - b.pathStartCm || a.originalIndex - b.originalIndex
  ));

  return [
    ...active.map((entry) => entry.module.id),
    ...inactive.map((entry) => entry.module.id),
  ];
}

function getActiveEntries(modules, segments, standYCm) {
  const activeWallIds = new Set(segments.map((segment) => segment.wallId));
  const entries = modules
    .filter((module) => activeWallIds.has(module?.placement?.wallId))
    .map((module, originalIndex) => ({
      module,
      originalIndex,
      pathStartCm: placementToPathStart(module, segments, standYCm),
    }));

  if (entries.some((entry) => entry.pathStartCm === null)) return null;
  entries.sort((a, b) => (
    a.pathStartCm - b.pathStartCm || a.originalIndex - b.originalIndex
  ));
  return entries;
}

function findInsertionTarget({
  activeEntries,
  desiredPathStartCm,
  insertedWidthCm,
  collisionModuleId,
}) {
  const desiredCenterCm = desiredPathStartCm + insertedWidthCm / 2;
  const overlappingEntries = activeEntries.filter((entry) => {
    const start = entry.pathStartCm;
    const end = start + Number(entry.module.widthCm);
    return desiredPathStartCm < end - EPSILON_CM
      && start < desiredPathStartCm + insertedWidthCm - EPSILON_CM;
  });

  const targetEntry = overlappingEntries
    .map((entry) => ({
      ...entry,
      centerDistanceCm: Math.abs(
        (entry.pathStartCm + Number(entry.module.widthCm) / 2) - desiredCenterCm,
      ),
    }))
    .sort((a, b) => a.centerDistanceCm - b.centerDistanceCm)[0]
    ?? activeEntries.find((entry) => entry.module.id === collisionModuleId);

  if (!targetEntry) return null;

  const targetCenterCm = targetEntry.pathStartCm + Number(targetEntry.module.widthCm) / 2;
  return {
    targetEntry,
    chainSide: desiredCenterCm <= targetCenterCm ? 'left' : 'right',
  };
}

export function planContinuousModuleInsert({
  modules = [],
  insertedModule,
  desiredPlacement,
  standType,
  standXCm,
  standYCm,
} = {}) {
  if (!insertedModule?.id) return { ok: false, message: 'Eklenecek modül bulunamadı.' };
  if (modules.some((module) => module?.id === insertedModule.id)) {
    return { ok: false, message: 'Eklenecek modül kimliği zaten kullanılıyor.' };
  }
  if (!desiredPlacement) return { ok: false, message: 'Hedef yerleşim bulunamadı.' };

  const segments = getContinuousWallSegments(standType, standXCm, standYCm);
  if (!segments.length) {
    return { ok: false, message: 'Bu stand tipinde sürekli duvar eklemesi kullanılamaz.' };
  }

  const insertedWidthCm = Number(insertedModule.widthCm);
  const desiredPathStartCm = placementToPathStart(
    { ...insertedModule, placement: { ...desiredPlacement } },
    segments,
    standYCm,
  );
  if (desiredPathStartCm === null) {
    return { ok: false, message: 'Modül hedef duvar sınırına sığmıyor.' };
  }

  const directValidation = validatePlacementAgainstModules({
    placement: desiredPlacement,
    widthCm: insertedWidthCm,
    moduleId: insertedModule.id,
    modules,
    standType,
    standXCm,
    standYCm,
  });

  if (directValidation.ok) {
    const placements = new Map([[insertedModule.id, { ...desiredPlacement }]]);
    return {
      ok: true,
      mode: 'direct',
      movingPlacement: { ...desiredPlacement },
      placements,
      orderedModuleIds: buildOrderedIds(
        [...modules, insertedModule],
        placements,
        segments,
        standYCm,
      ),
    };
  }

  if (!directValidation.collisionModuleId) return directValidation;

  const activeEntries = getActiveEntries(modules, segments, standYCm);
  if (!activeEntries) {
    return { ok: false, message: 'Mevcut modüllerden birinin duvar yerleşimi okunamadı.' };
  }

  const target = findInsertionTarget({
    activeEntries,
    desiredPathStartCm,
    insertedWidthCm,
    collisionModuleId: directValidation.collisionModuleId,
  });
  if (!target) return directValidation;

  const plan = planContinuousWallInsertion({
    modules,
    insertedModules: [insertedModule],
    targetModuleId: target.targetEntry.module.id,
    side: chainSideToCallerSide(
      target.chainSide,
      target.targetEntry.module?.placement?.wallId,
    ),
    standType,
    standXCm,
    standYCm,
  });
  if (!plan.ok) return plan;

  const movingPlacement = plan.placements?.get(insertedModule.id);
  if (!movingPlacement) {
    return { ok: false, message: 'Eklenen modül için yeni yerleşim üretilemedi.' };
  }

  return {
    ...plan,
    ok: true,
    mode: 'reflow',
    movingPlacement: { ...movingPlacement },
    targetModuleId: target.targetEntry.module.id,
    chainSide: target.chainSide,
  };
}

export function planContinuousModuleMove({
  modules = [],
  movingModuleId,
  desiredPlacement,
  standType,
  standXCm,
  standYCm,
} = {}) {
  const movingModule = modules.find((module) => module?.id === movingModuleId);
  if (!movingModule) return { ok: false, message: 'Taşınacak modül bulunamadı.' };
  if (!desiredPlacement) return { ok: false, message: 'Hedef yerleşim bulunamadı.' };

  const segments = getContinuousWallSegments(standType, standXCm, standYCm);
  if (!segments.length) {
    return { ok: false, message: 'Bu stand tipinde sürekli duvar taşıması kullanılamaz.' };
  }

  const movingWidthCm = Number(movingModule.widthCm);
  const remainingModules = modules.filter((module) => module?.id !== movingModuleId);
  const desiredPathStartCm = placementToPathStart(
    { ...movingModule, placement: { ...desiredPlacement } },
    segments,
    standYCm,
  );
  if (desiredPathStartCm === null) {
    return { ok: false, message: 'Modül hedef duvar sınırına sığmıyor.' };
  }

  const directValidation = validatePlacementAgainstModules({
    placement: desiredPlacement,
    widthCm: movingWidthCm,
    moduleId: movingModuleId,
    modules: remainingModules,
    standType,
    standXCm,
    standYCm,
  });

  if (directValidation.ok) {
    const placements = new Map([[movingModuleId, { ...desiredPlacement }]]);
    return {
      ok: true,
      mode: 'direct',
      movingPlacement: { ...desiredPlacement },
      placements,
      orderedModuleIds: buildOrderedIds(modules, placements, segments, standYCm),
    };
  }

  if (!directValidation.collisionModuleId) return directValidation;

  const activeEntries = getActiveEntries(remainingModules, segments, standYCm);
  if (!activeEntries) {
    return { ok: false, message: 'Mevcut modüllerden birinin duvar yerleşimi okunamadı.' };
  }

  const target = findInsertionTarget({
    activeEntries,
    desiredPathStartCm,
    insertedWidthCm: movingWidthCm,
    collisionModuleId: directValidation.collisionModuleId,
  });
  if (!target) return directValidation;

  const plan = planContinuousWallInsertion({
    modules: remainingModules,
    insertedModules: [movingModule],
    targetModuleId: target.targetEntry.module.id,
    side: chainSideToCallerSide(
      target.chainSide,
      target.targetEntry.module?.placement?.wallId,
    ),
    standType,
    standXCm,
    standYCm,
  });
  if (!plan.ok) return plan;

  const movingPlacement = plan.placements?.get(movingModuleId);
  if (!movingPlacement) {
    return { ok: false, message: 'Taşınan modül için yeni yerleşim üretilemedi.' };
  }

  return {
    ...plan,
    ok: true,
    mode: 'reflow',
    movingPlacement: { ...movingPlacement },
    targetModuleId: target.targetEntry.module.id,
    chainSide: target.chainSide,
  };
}
