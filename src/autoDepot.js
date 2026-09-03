import { createModulePlacement } from './modulePlacement.js';

export const AUTO_DEPOT_SIZES = Object.freeze({
  '100x100': Object.freeze({ widthCm: 100, depthCm: 100, label: '1 × 1 m' }),
  '150x100': Object.freeze({ widthCm: 150, depthCm: 100, label: '1,5 × 1 m' }),
  '200x100': Object.freeze({ widthCm: 200, depthCm: 100, label: '2 × 1 m' }),
  '200x200': Object.freeze({ widthCm: 200, depthCm: 200, label: '2 × 2 m' }),
});

function wall(widthCm, xCm, yCm, rotationZDeg = 0) {
  return { kind: 'wall', widthCm, placement: createModulePlacement({ xCm, yCm, rotationZDeg, wallId: 'free' }) };
}
function door(xCm, yCm, rotationZDeg = 0) {
  return { kind: 'door', widthCm: 100, placement: createModulePlacement({ xCm, yCm, rotationZDeg, wallId: 'free' }) };
}
function fixture(kind, widthCm, depthCm, xCm, yCm, rotationZDeg = 0) {
  return { kind, widthCm, depthCm, placement: createModulePlacement({ xCm, yCm, rotationZDeg, wallId: 'free' }) };
}

function addFront(specs, xCm, yCm, widthCm) {
  if (widthCm === 100) { specs.push(door(xCm, yCm)); return; }
  if (widthCm === 150) { specs.push(wall(50, xCm, yCm), door(xCm + 50, yCm)); return; }
  specs.push(wall(50, xCm, yCm), door(xCm + 50, yCm), wall(50, xCm + 150, yCm));
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
  else if (standType === 'back-wall' || standType === 'u-stand') { xCm = (standX - size.widthCm) / 2; yCm = 0; }
  else if (standType === 'island') { xCm = (standX - size.widthCm) / 2; yCm = (standY - size.depthCm) / 2; useBackWall = false; }
  else return { ok: false, message: 'Bu stand tipi için otomatik depo yerleşimi desteklenmiyor.' };

  const specs = [];
  if (!useBackWall) specs.push(wall(size.widthCm, xCm, yCm));
  // Depo sol yan duvarının panel yüzü deponun dışına (-X) bakmalı.
  if (!useLeftWall) specs.push(wall(size.depthCm, xCm, yCm, 270));
  // Sağ yan duvarın dış yüzü +X yönüne bakar.
  if (!useRightWall) specs.push(wall(size.depthCm, xCm + size.widthCm, yCm, 90));
  addFront(specs, xCm, yCm + size.depthCm, size.widthCm);

  if (includeContents) {
    const fridgeWidth = 45;
    const fridgeDepth = 43;
    const rackWidth = 43;
    const rackDepth = 43;
    const kettleWidth = 24;
    const kettleDepth = 19;
    const gapCm = 6;

    // Buzdolabı + askılık grubunu depo tabanında ortala.
    const groupWidth = fridgeWidth + gapCm + rackWidth;
    const groupDepth = Math.max(fridgeDepth, rackDepth);
    const groupX = xCm + (size.widthCm - groupWidth) / 2;
    const groupY = yCm + (size.depthCm - groupDepth) / 2;

    const fridgeX = groupX;
    const fridgeY = groupY;
    const rackX = groupX + fridgeWidth + gapCm;
    const rackY = groupY;

    // Kettle buzdolabının üstünde render edilir; plan düzleminde buzdolabının tam merkezine oturt.
    const kettleX = fridgeX + (fridgeWidth - kettleWidth) / 2;
    const kettleY = fridgeY + (fridgeDepth - kettleDepth) / 2;

    specs.push(fixture('mini-fridge', fridgeWidth, fridgeDepth, fridgeX, fridgeY));
    specs.push(fixture('kettle', kettleWidth, kettleDepth, kettleX, kettleY));
    specs.push(fixture('coat-rack', rackWidth, rackDepth, rackX, rackY));
  }

  return { ok: true, sizeKey, widthCm: size.widthCm, depthCm: size.depthCm, originXCm: xCm, originYCm: yCm, specs };
}
