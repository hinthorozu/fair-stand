import { composeStraightWall } from './wall.js';
import { composeDepotAlignedWidths, composeDepotBackWidths } from './autoDepot.js';
import {
  getContinuousWallCapacityCm,
  getContinuousWallSegments,
  planContinuousWallLayout,
} from './wallReflow.js';

export function getAutomaticWallCapacityCm({ standType, standXCm, standYCm } = {}) {
  return getContinuousWallCapacityCm(standType, standXCm, standYCm);
}

export function composeAutomaticStandWall({
  wallWidthCm,
  standType,
  standXCm,
  standYCm,
} = {}) {
  const validation = composeStraightWall(Number(wallWidthCm));
  if (!validation.ok) return validation;

  const requestedCm = Number(wallWidthCm);
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
    const fillCm = Math.min(remainingCm, Number(segment.edgeWidthCm));
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

export function composeAutomaticBackWallWithDepot({
  standXCm,
  depotOriginXCm,
  depotWidthCm,
  sizeKey,
} = {}) {
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
  const addChunk = (wallWidthCm, startXCm, depotBack = false) => {
    if (wallWidthCm <= 0) return true;
    if (depotBack) {
      const aligned = sizeKey
        ? composeDepotBackWidths(sizeKey)
        : composeDepotAlignedWidths(wallWidthCm);
      if (!aligned.ok) return false;
      const total = aligned.modules.reduce((sum, width) => sum + width, 0);
      if (total !== depotWidth) return false;
      let cursor = startXCm;
      for (const widthCm of aligned.modules) {
        modules.push({
          widthCm,
          placement: { xCm: cursor, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back' },
          depotBack: true,
        });
        cursor += widthCm;
      }
      return true;
    }
    const composed = composeStraightWall(wallWidthCm);
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

/**
 * L-stand paylaşılan yan duvar: depo derinliği kadar dilim, kalan composeStraightWall.
 * wallId 'left' (rot 90) veya 'right' (rot 270). Depo köşede originY=0 varsayımı.
 */
export function composeAutomaticSideWallWithDepot({
  standType,
  standXCm,
  standYCm,
  depotDepthCm,
} = {}) {
  const standX = Number(standXCm);
  const standY = Number(standYCm);
  const depotDepth = Number(depotDepthCm);
  const wallId = standType === 'l-left' ? 'left' : standType === 'l-right' ? 'right' : null;
  if (!wallId) return { ok: false, message: 'Yan depo duvarı yalnız L stand için.' };
  if (![standX, standY, depotDepth].every(Number.isFinite) || standY <= 0 || depotDepth <= 0) {
    return { ok: false, message: 'Depo yan duvarı ölçüleri geçersiz.' };
  }
  if (depotDepth > standY) {
    return { ok: false, message: 'Depo derinliği yan duvarı aşıyor.' };
  }

  const aligned = composeDepotAlignedWidths(depotDepth);
  if (!aligned.ok) return { ok: false, message: 'Depo yan paneli oluşturulamadı.' };

  const modules = [];
  let yCursor = 0;
  for (const widthCm of aligned.modules) {
    modules.push({
      widthCm,
      placement: {
        xCm: wallId === 'left' ? 0 : standX,
        yCm: yCursor,
        zCm: 0,
        rotationZDeg: wallId === 'left' ? 90 : 270,
        wallId,
      },
      depotSide: true,
    });
    yCursor += widthCm;
  }

  const afterCm = standY - yCursor;
  if (afterCm > 0) {
    const composed = composeStraightWall(afterCm);
    if (!composed.ok) return { ok: false, message: 'Depo sonrası yan duvar oluşturulamadı.' };
    for (const widthCm of composed.modules) {
      modules.push({
        widthCm,
        placement: {
          xCm: wallId === 'left' ? 0 : standX,
          yCm: yCursor,
          zCm: 0,
          rotationZDeg: wallId === 'left' ? 90 : 270,
          wallId,
        },
        depotSide: false,
      });
      yCursor += widthCm;
    }
  }

  return { ok: true, modules, wallId };
}
