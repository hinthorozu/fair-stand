import { getItem } from './items.js';
import { createModulePlacement } from './modulePlacement.js';
import { MODULE_WIDTHS_CM } from './standDimensions.js';
import { composeStraightWall } from './wall.js';

export const AUTO_DEPOT_SIZES = Object.freeze({
  '100x100': Object.freeze({ widthCm: 100, depthCm: 100, label: '1 × 1 m' }),
  '150x100': Object.freeze({ widthCm: 150, depthCm: 100, label: '1,5 × 1 m' }),
  '200x100': Object.freeze({ widthCm: 200, depthCm: 100, label: '2 × 1 m' }),
  '200x200': Object.freeze({ widthCm: 200, depthCm: 200, label: '2 × 2 m' }),
});

/**
 * Depo kenarı panel dilimleri.
 * Sistemde o ölçüde tek panel varsa (50/100/150/200) tek parça.
 * Yoksa composeStraightWall (ör. 250 → 200+50).
 */
export function composeDepotAlignedWidths(lengthCm) {
  const length = Number(lengthCm);
  if (!Number.isFinite(length) || length <= 0) {
    return { ok: false, message: 'Depo duvar uzunluğu geçersiz.' };
  }
  if (length % 50 !== 0) {
    return { ok: false, message: 'Depo duvarı 50 cm katı olmalı.' };
  }

  if (MODULE_WIDTHS_CM.includes(length)) {
    return { ok: true, modules: [length] };
  }

  const composed = composeStraightWall(length);
  if (!composed.ok) {
    return { ok: false, message: composed.message || 'Depo duvarı mevcut panellerle dilimlenemedi.' };
  }
  return { ok: true, modules: composed.modules };
}

/**
 * Sırt / paylaşılan kenar: her yerde aynı kural (exact panel veya compose).
 */
export function composeDepotBackWidths(sizeKey) {
  const size = AUTO_DEPOT_SIZES[sizeKey];
  if (!size) return { ok: false, message: 'Depo ölçüsü geçersiz.' };
  return composeDepotAlignedWidths(size.widthCm);
}

function requireItem(itemKey) {
  const item = getItem(itemKey);
  if (!item?.dimensions) {
    throw new TypeError(`Missing Item master dimensions for ${itemKey}.`);
  }
  return item;
}

function wall(widthCm, xCm, yCm, rotationZDeg = 0) {
  return { kind: 'wall', widthCm, placement: createModulePlacement({ xCm, yCm, rotationZDeg, wallId: 'free' }) };
}
function door(xCm, yCm, rotationZDeg = 0) {
  return {
    kind: 'door',
    itemKey: 'wall_door_100_350',
    widthCm: 100,
    placement: createModulePlacement({ xCm, yCm, rotationZDeg, wallId: 'free' }),
  };
}
function fixture(kind, widthCm, depthCm, xCm, yCm, rotationZDeg = 0, descriptor = {}) {
  return {
    kind,
    widthCm,
    depthCm,
    ...descriptor,
    placement: createModulePlacement({
      xCm,
      yCm,
      rotationZDeg,
      wallId: 'free',
      itemKey: descriptor.itemKey ?? null,
    }),
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
  if (!useBackWall) {
    const back = composeDepotBackWidths(sizeKey);
    if (!back.ok) return back;
    let cursorX = xCm;
    for (const widthCm of back.modules) {
      specs.push(wall(widthCm, cursorX, yCm));
      cursorX += widthCm;
    }
  }
  // Depo sol yan duvarının panel yüzü deponun dışına (-X) bakmalı.
  if (!useLeftWall) {
    const side = composeDepotAlignedWidths(size.depthCm);
    if (!side.ok) return side;
    let cursorY = yCm;
    for (const widthCm of side.modules) {
      specs.push(wall(widthCm, xCm, cursorY, 270));
      cursorY += widthCm;
    }
  }
  // Sağ yan duvarın dış yüzü +X yönüne bakar.
  if (!useRightWall) {
    const side = composeDepotAlignedWidths(size.depthCm);
    if (!side.ok) return side;
    let cursorY = yCm;
    for (const widthCm of side.modules) {
      specs.push(wall(widthCm, xCm + size.widthCm, cursorY, 90));
      cursorY += widthCm;
    }
  }
  addFront(specs, xCm, yCm + size.depthCm, size.widthCm, standType);

  if (includeContents) {
    const MINI_FRIDGE_ITEM = requireItem('mini_fridge_avanti');
    const COAT_RACK_ITEM = requireItem('coat_rack');
    const KETTLE_ITEM = requireItem('kettle');
    const PLASTIC_TRASH_BIN_ITEM = requireItem('plastic_trash_bin');
    const fridgeWidth = Number(MINI_FRIDGE_ITEM.dimensions.widthCm);
    const fridgeDepth = Number(MINI_FRIDGE_ITEM.dimensions.depthCm);
    const rackWidth = Number(COAT_RACK_ITEM.dimensions.widthCm);
    const rackDepth = Number(COAT_RACK_ITEM.dimensions.depthCm);
    const kettleWidth = Number(KETTLE_ITEM.dimensions.widthCm);
    const kettleDepth = Number(KETTLE_ITEM.dimensions.depthCm);
    const trashBinWidth = Number(PLASTIC_TRASH_BIN_ITEM.dimensions.widthCm);
    const trashBinDepth = Number(PLASTIC_TRASH_BIN_ITEM.dimensions.depthCm);
    const trashBinHeight = Number(PLASTIC_TRASH_BIN_ITEM.dimensions.heightCm);
    const gapCm = 6;

    // xCm 0° serbest ürünlerde oturumun başlangıç kenarı; yCm oturum orta çizgisidir.
    // Buzdolabı + askılık ilk sırada, çöp kutusu ikinci sırada kalsın; 100x100
    // depoda bile içerik depo içinde kalsın ve zemin ürünleri üst üste binmesin.
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

    const kettleX = fridgeX + (fridgeWidth - kettleWidth) / 2;
    const kettleY = fridgeY + (fridgeDepth - kettleDepth) / 2;

    specs.push(fixture('mini-fridge', fridgeWidth, fridgeDepth, fridgeX, fridgeY, 0, {
      itemKey: MINI_FRIDGE_ITEM.itemKey,
    }));
    specs.push(fixture('kettle', kettleWidth, kettleDepth, kettleX, kettleY, 0, {
      itemKey: KETTLE_ITEM.itemKey,
    }));
    specs.push(fixture('coat-rack', rackWidth, rackDepth, rackX, rackY, 0, {
      itemKey: COAT_RACK_ITEM.itemKey,
    }));
    specs.push(fixture(
      PLASTIC_TRASH_BIN_ITEM.type,
      trashBinWidth,
      trashBinDepth,
      trashBinX,
      trashBinY,
      0,
      {
        itemKey: PLASTIC_TRASH_BIN_ITEM.itemKey,
        heightCm: trashBinHeight,
        modelFile: PLASTIC_TRASH_BIN_ITEM.modelFile,
        preserveModelScale: Boolean(PLASTIC_TRASH_BIN_ITEM.preserveModelScale),
      },
    ));
  }

  return { ok: true, sizeKey, widthCm: size.widthCm, depthCm: size.depthCm, originXCm: xCm, originYCm: yCm, specs };
}
