import { MODULE_CATALOG } from './catalog.js';
import { createModulePlacement } from './modulePlacement.js';

export const AUTO_DEPOT_SIZES = Object.freeze({
  '100x100': Object.freeze({ widthCm: 100, depthCm: 100, label: '1 × 1 m' }),
  '150x100': Object.freeze({ widthCm: 150, depthCm: 100, label: '1,5 × 1 m' }),
  '200x100': Object.freeze({ widthCm: 200, depthCm: 100, label: '2 × 1 m' }),
  '200x200': Object.freeze({ widthCm: 200, depthCm: 200, label: '2 × 2 m' }),
});

const PLASTIC_TRASH_BIN_CATALOG_KEY = 'DEPOT_PLASTIC_TRASH_BIN';
const PLASTIC_TRASH_BIN_DESCRIPTOR = MODULE_CATALOG[PLASTIC_TRASH_BIN_CATALOG_KEY];

function wall(widthCm, xCm, yCm, rotationZDeg = 0) {
  return { kind: 'wall', widthCm, placement: createModulePlacement({ xCm, yCm, rotationZDeg, wallId: 'free' }) };
}
function door(xCm, yCm, rotationZDeg = 0) {
  return { kind: 'door', widthCm: 100, placement: createModulePlacement({ xCm, yCm, rotationZDeg, wallId: 'free' }) };
}
function fixture(kind, widthCm, depthCm, xCm, yCm, rotationZDeg = 0, descriptor = {}) {
  return {
    kind,
    widthCm,
    depthCm,
    ...descriptor,
    placement: createModulePlacement({ xCm, yCm, rotationZDeg, wallId: 'free' }),
  };
}

function addFront(specs, xCm, yCm, widthCm, standType) {
  if (widthCm === 100) { specs.push(door(xCm, yCm)); return; }
  if (widthCm === 150) {
    // 1,5 m depo önü: 100 cm kapı + 50 cm panel.
    // Sırt duvar / ada (ve U) standda kapı solda. L standlarda kapı dış duvarın tersinde, stand içine doğru kalır.
    if (standType === 'l-left') specs.push(wall(50, xCm, yCm), door(xCm + 50, yCm));
    else specs.push(door(xCm, yCm), wall(50, xCm + 100, yCm));
    return;
  }
  if (widthCm === 200) {
    // 2 m depo önü: 100 cm kapı + 100 cm panel.
    // Sırt duvar / ada (ve U) standda kapı solda. L standlarda kapı dış duvarın tersinde, stand içine doğru kalır.
    if (standType === 'l-left') specs.push(wall(100, xCm, yCm), door(xCm + 100, yCm));
    else specs.push(door(xCm, yCm), wall(100, xCm + 100, yCm));
    return;
  }
  specs.push(door(xCm, yCm), wall(widthCm - 100, xCm + 100, yCm));
}

export function planAutomaticDepot({ standType, standXCm, standYCm, sizeKey = '100x100', includeContents = false } = {}) {
  const size = AUTO_DEPOT_SIZES[sizeKey];
  const standX = Number(standXCm); const standY = Number(standYCm);
  if (!size) return { ok: false, message: 'Depo ölçüsü geçersiz.' };
  if (!Number.isFinite(standX) || !Number.isFinite(standY) || standX <= 0 || standY <= 0) return { ok: false, message: 'Stand ölçüsü geçersiz.' };
  if (size.widthCm > standX || size.depthCm > standY) return { ok: false, message: 'Seçilen depo ölçüsü stand alanına sığmıyor.' };

  let xCm = 0; let yCm = 0; let useBackWall = true; let useLeftWall = false; let useRightWall = false;
  if (standType === 'l-left') { xCm = 0; yCm = 0; useLeftWall = true; }
  else if (standType === 'l-right') { xCm = standX - size.widthCm; yCm = 0; useRightWall = true; }
  else if (standType === 'back-wall' || standType === 'u-stand') {
    // Sırt duvarı üretim reçetesi 50 cm gridde kalmalı; 150 cm depo için merkezi en yakın 50 cm noktasına al.
    xCm = Math.round(((standX - size.widthCm) / 2) / 50) * 50;
    yCm = 0;
  }
  else if (standType === 'island') { xCm = (standX - size.widthCm) / 2; yCm = (standY - size.depthCm) / 2; useBackWall = false; }
  else return { ok: false, message: 'Bu stand tipi için otomatik depo yerleşimi desteklenmiyor.' };

  const specs = [];
  if (!useBackWall) specs.push(wall(size.widthCm, xCm, yCm));
  // Depo sol yan duvarının panel yüzü deponun dışına (-X) bakmalı.
  if (!useLeftWall) specs.push(wall(size.depthCm, xCm, yCm, 270));
  // Sağ yan duvarın dış yüzü +X yönüne bakar.
  if (!useRightWall) specs.push(wall(size.depthCm, xCm + size.widthCm, yCm, 90));
  addFront(specs, xCm, yCm + size.depthCm, size.widthCm, standType);

  if (includeContents) {
    const fridgeWidth = 50;
    const fridgeDepth = 50;
    const rackWidth = 43;
    const rackDepth = 43;
    const kettleWidth = 24;
    const kettleDepth = 19;
    const trashBinWidth = Number(PLASTIC_TRASH_BIN_DESCRIPTOR.widthCm);
    const trashBinDepth = Number(PLASTIC_TRASH_BIN_DESCRIPTOR.depthCm);
    const trashBinHeight = Number(PLASTIC_TRASH_BIN_DESCRIPTOR.heightCm);
    const gapCm = 6;

    // xCm is the footprint start edge; yCm is the footprint centerline for 0° free fixtures.
    // Keep fridge + rack in the first row and the trash bin in a second row so even 100x100
    // depot contents remain inside the depot and floor fixtures never overlap each other.
    const upperRowWidth = fridgeWidth + gapCm + rackWidth;
    const upperRowDepth = Math.max(fridgeDepth, rackDepth);
    const packedDepth = upperRowDepth + gapCm + trashBinDepth;
    const upperRowX = xCm + (size.widthCm - upperRowWidth) / 2;
    const packStartY = yCm + (size.depthCm - packedDepth) / 2;
    const upperRowY = packStartY + upperRowDepth / 2;

    const fridgeX = upperRowX;
    const fridgeY = upperRowY;
    const rackX = upperRowX + fridgeWidth + gapCm;
    const rackY = upperRowY;
    const trashBinX = xCm + (size.widthCm - trashBinWidth) / 2;
    const trashBinY = packStartY + upperRowDepth + gapCm + trashBinDepth / 2;

    // Kettle buzdolabının üstünde render edilir; mevcut yerleşim davranışını koru.
    const kettleX = fridgeX + (fridgeWidth - kettleWidth) / 2;
    const kettleY = fridgeY + (fridgeDepth - kettleDepth) / 2;

    specs.push(fixture('mini-fridge', fridgeWidth, fridgeDepth, fridgeX, fridgeY));
    specs.push(fixture('kettle', kettleWidth, kettleDepth, kettleX, kettleY));
    specs.push(fixture('coat-rack', rackWidth, rackDepth, rackX, rackY));
    specs.push(fixture(
      PLASTIC_TRASH_BIN_DESCRIPTOR.type,
      trashBinWidth,
      trashBinDepth,
      trashBinX,
      trashBinY,
      0,
      {
        catalogKey: PLASTIC_TRASH_BIN_CATALOG_KEY,
        heightCm: trashBinHeight,
        modelFile: PLASTIC_TRASH_BIN_DESCRIPTOR.modelFile,
        preserveModelScale: Boolean(PLASTIC_TRASH_BIN_DESCRIPTOR.preserveModelScale),
      },
    ));
  }

  return { ok: true, sizeKey, widthCm: size.widthCm, depthCm: size.depthCm, originXCm: xCm, originYCm: yCm, specs };
}
