import { composeStraightWall } from './wall.js';
import {
  getContinuousWallCapacityCm,
  getContinuousWallSegments,
  planContinuousWallLayout,
} from './wallReflow.js';

export function getAutomaticWallCapacityCm({ standType, standXCm, standYCm } = {}) {
  return getContinuousWallCapacityCm(standType, standXCm, standYCm);
}

export function composeAutomaticStandWall({
  lengthCm,
  standType,
  standXCm,
  standYCm,
} = {}) {
  const validation = composeStraightWall(Number(lengthCm));
  if (!validation.ok) return validation;

  const requestedCm = Number(lengthCm);
  const capacityCm = getContinuousWallCapacityCm(standType, standXCm, standYCm);
  const segments = getContinuousWallSegments(standType, standXCm, standYCm);

  if (!segments.length || capacityCm <= 0) {
    return {
      ok: false,
      capacityCm,
      requestedCm,
      message: 'Bu stand tipinde otomatik duvar oluşturulacak aktif kenar yok.',
    };
  }

  if (requestedCm > capacityCm) {
    return {
      ok: false,
      capacityCm,
      requestedCm,
      message: `Toplam aktif duvar sınırı ${capacityCm} cm; ${requestedCm} cm oluşturulamaz.`,
    };
  }

  const widths = [];
  let remainingCm = requestedCm;

  for (const segment of segments) {
    if (remainingCm <= 0) break;
    const fillCm = Math.min(remainingCm, Number(segment.lengthCm));
    if (fillCm <= 0) continue;

    const segmentWall = composeStraightWall(fillCm);
    if (!segmentWall.ok) return segmentWall;
    widths.push(...segmentWall.modules);
    remainingCm -= fillCm;
  }

  if (remainingCm > 0) {
    return {
      ok: false,
      capacityCm,
      requestedCm,
      message: 'İstenen duvar uzunluğu aktif stand kenarlarına yerleştirilemedi.',
    };
  }

  const planningModules = widths.map((widthCm, index) => ({
    id: `automatic-wall-${index}`,
    widthCm,
  }));
  const layout = planContinuousWallLayout({
    modules: planningModules,
    standType,
    standXCm,
    standYCm,
  });
  if (!layout.ok) return { ...layout, capacityCm, requestedCm };

  return {
    ok: true,
    capacityCm,
    requestedCm,
    widths,
    placements: planningModules.map((module) => ({ ...layout.placements.get(module.id) })),
  };
}

export function composeAutomaticBackWallWithDepot({ standXCm, depotOriginXCm, depotWidthCm } = {}) {
  const standX = Number(standXCm);
  const depotX = Number(depotOriginXCm);
  const depotWidth = Number(depotWidthCm);
  if (![standX, depotX, depotWidth].every(Number.isFinite) || standX <= 0 || depotWidth <= 0) {
    return { ok: false, message: 'Depo sırt duvarı ölçüleri geçersiz.' };
  }
  if (depotX < 0 || depotX + depotWidth > standX) {
    return { ok: false, message: 'Depo sırt duvarı stand sınırını aşıyor.' };
  }

  const modules = [];
  const addChunk = (lengthCm, startXCm, exact = false) => {
    if (lengthCm <= 0) return true;
    if (exact) {
      modules.push({ widthCm: lengthCm, placement: { xCm: startXCm, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' }, depotBack: true });
      return true;
    }
    const composed = composeStraightWall(lengthCm);
    if (!composed.ok) return false;
    let cursor = startXCm;
    for (const widthCm of composed.modules) {
      modules.push({ widthCm, placement: { xCm: cursor, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' }, depotBack: false });
      cursor += widthCm;
    }
    return true;
  };

  const beforeCm = depotX;
  const afterStartCm = depotX + depotWidth;
  const afterCm = standX - afterStartCm;
  if (!addChunk(beforeCm, 0)) return { ok: false, message: 'Depo öncesi sırt duvarı oluşturulamadı.' };
  if (!addChunk(depotWidth, depotX, true)) return { ok: false, message: 'Depo sırt paneli oluşturulamadı.' };
  if (!addChunk(afterCm, afterStartCm)) return { ok: false, message: 'Depo sonrası sırt duvarı oluşturulamadı.' };

  return { ok: true, modules };
}
