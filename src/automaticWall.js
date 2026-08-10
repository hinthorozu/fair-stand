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
