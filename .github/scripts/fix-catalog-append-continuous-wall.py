from pathlib import Path

p = Path('src/main.js')
s = p.read_text()

old = "import { planContinuousWallInsertion } from './wallReflow.js';"
new = "import { getContinuousWallSegments, planContinuousWallInsertion } from './wallReflow.js';"
if old not in s:
    raise SystemExit('wallReflow import not found')
s = s.replace(old, new, 1)

anchor = """function getRequestWallId({ context = null } = {}) {
  return context?.placement?.wallId ?? 'back';
}
"""
insert = """function getRequestWallId({ context = null } = {}) {
  return context?.placement?.wallId ?? 'back';
}

function getContinuousModulePathStartCm(module, segments) {
  const placement = module?.placement;
  const widthCm = Number(module?.widthCm);
  if (!placement || !Number.isFinite(widthCm) || widthCm <= 0) return null;

  const segment = segments.find((candidate) => candidate.wallId === placement.wallId);
  if (!segment) return null;

  let localStartCm = null;
  if (placement.wallId === 'left') {
    localStartCm = Number(currentStand?.yCm) - (Number(placement.yCm) + widthCm);
  } else if (placement.wallId === 'back') {
    localStartCm = Number(placement.xCm);
  } else if (placement.wallId === 'right') {
    localStartCm = Number(placement.yCm);
  }

  if (!Number.isFinite(localStartCm)) return null;
  return Number(segment.offsetCm) + localStartCm;
}

function getContinuousAppendTargetModule() {
  if (!currentStand) return null;
  const segments = getContinuousWallSegments(
    currentStand.standType,
    currentStand.xCm,
    currentStand.yCm,
  );
  if (!segments.length) return null;

  return currentModules
    .map((module) => ({
      module,
      pathStartCm: getContinuousModulePathStartCm(module, segments),
    }))
    .filter((entry) => Number.isFinite(entry.pathStartCm))
    .sort((a, b) => a.pathStartCm - b.pathStartCm)
    .at(-1)?.module ?? null;
}

function planCatalogAppendInsertion(moduleStates) {
  const targetModule = getContinuousAppendTargetModule();
  if (!targetModule) {
    const initialPlan = assignPlannedPlacements(moduleStates, {
      placementMode: 'append',
      context: null,
    });
    return { ...initialPlan, appendMode: 'initial' };
  }

  // wallReflow yan duvar çağrı yönünü zincir yönüne normalize ediyor.
  // Fiziksel zincir sonuna eklemek için yan duvarda caller side ters gönderilir.
  const targetWallId = targetModule.placement?.wallId;
  const side = targetWallId === 'left' || targetWallId === 'right' ? 'left' : 'right';
  const plan = planContinuousWallInsertion({
    modules: currentModules,
    insertedModules: moduleStates,
    targetModuleId: targetModule.id,
    side,
    standType: currentStand.standType,
    standXCm: currentStand.xCm,
    standYCm: currentStand.yCm,
  });
  return { ...plan, appendMode: 'continuous' };
}
"""
if anchor not in s:
    raise SystemExit('getRequestWallId anchor not found')
s = s.replace(anchor, insert, 1)

old_validate = """  if (placement === 'append' || !context) {
    const addedCm = entries.reduce(
      (sum, entry) => sum + (Number(entry.module?.widthCm) || 0),
      0,
    );
    const wallId = getRequestWallId({ context });
    const axis = getWallAxis(wallId);
    if (!axis) return { ok: true };

    return validateCurrentAxisCapacity(
      axis,
      addedCm,
      getWallUsedCm(currentModules, wallId),
      { popupTitle: 'Modüller eklenemedi' },
    );
  }
"""
new_validate = """  if (placement === 'append' || !context) {
    const moduleStates = entries.map((entry) => createCatalogModuleState(entry.module));
    if (moduleStates.some((moduleState) => !moduleState)) {
      return { ok: false, message: 'Seçilen modüller hazırlanamadı.' };
    }

    const plan = planCatalogAppendInsertion(moduleStates);
    if (!plan.ok) {
      renderWallResult(plan.message, true);
      window.alert(`Modüller eklenemedi\\n\\n${plan.message}`);
    }
    return plan;
  }
"""
if old_validate not in s:
    raise SystemExit('append validation block not found')
s = s.replace(old_validate, new_validate, 1)

old_flush = """  if ((placementMode === 'left' || placementMode === 'right') && context) {
"""
new_flush = """  if (placementMode === 'append' && !context) {
    const plan = planCatalogAppendInsertion(moduleStates);
    if (!plan.ok) {
      renderWallResult(plan.message, true);
      window.alert(`Modüller eklenemedi\\n\\n${plan.message}`);
      return;
    }

    if (plan.appendMode === 'continuous') {
      applyContinuousInsertionPlan(plan, moduleStates);
    } else {
      currentModules.push(...moduleStates);
    }
    rebuildWall({ resetView: false });
    return;
  }

  if ((placementMode === 'left' || placementMode === 'right') && context) {
"""
if old_flush not in s:
    raise SystemExit('flush contextual branch anchor not found')
s = s.replace(old_flush, new_flush, 1)

p.write_text(s)
