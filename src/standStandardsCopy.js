import { MODULE_WIDTHS_CM, STAND_DIMENSIONS } from './catalog.js';
import { getFloorItem } from './items.js';
import { SCENE_SURROUND_M } from './sceneDimensions.js';
import {
  MAX_STAND_DIMENSION_CM,
  MIN_STAND_DIMENSION_CM,
  STAND_DIMENSION_STEP_CM,
} from './standSetup.js';

function cmFromMeters(meters) {
  return Math.round(Number(meters) * 100);
}

export function getStandStandardsFacts() {
  const heightCm = cmFromMeters(STAND_DIMENSIONS.height);
  const depthCm = cmFromMeters(STAND_DIMENSIONS.depth);
  const stripCount = STAND_DIMENSIONS.stripCount;
  const stripHeightCm = cmFromMeters(STAND_DIMENSIONS.stripHeight);
  const surroundCm = cmFromMeters(SCENE_SURROUND_M);
  const karolaj = getFloorItem('karolaj');
  const gridWidthCm = karolaj?.dimensions?.widthCm;
  const gridDepthCm = karolaj?.dimensions?.depthCm;
  const widths = MODULE_WIDTHS_CM.join(' / ');

  return Object.freeze({
    heightCm,
    depthCm,
    stripCount,
    stripHeightCm,
    widths,
    gridWidthCm,
    gridDepthCm,
    surroundCm,
    minStandCm: MIN_STAND_DIMENSION_CM,
    stepStandCm: STAND_DIMENSION_STEP_CM,
    maxStandCm: MAX_STAND_DIMENSION_CM,
  });
}

export function getStandStandardsListItems() {
  const facts = getStandStandardsFacts();
  return Object.freeze([
    `Yükseklik: ${facts.heightCm} cm`,
    `Derinlik: ${facts.depthCm} cm`,
    `Düz panel: ${facts.stripCount} × ${facts.stripHeightCm} cm yatay bölüm`,
    `Genişlikler: ${facts.widths} cm`,
    `Zemin grid: ${facts.gridWidthCm} × ${facts.gridDepthCm} cm`,
    `Stand alanı ölçüleri: ${facts.stepStandCm} cm ve katları`,
    `Stand alanı çevresi: ${facts.surroundCm} cm pasif gri alan`,
    `Maksimum stand alanı: ${facts.maxStandCm} × ${facts.maxStandCm} cm`,
    'Çoklu seçim: yalnızca tam dikdörtgen blok',
  ]);
}

export function renderStandStandardsList(listElement) {
  if (!listElement) return;
  listElement.replaceChildren(
    ...getStandStandardsListItems().map((text) => {
      const item = document.createElement('li');
      item.textContent = text;
      return item;
    }),
  );
}

export function getHelpStandardsTableHtml() {
  const facts = getStandStandardsFacts();
  const maxM = facts.maxStandCm / 100;
  return `
      <table><tbody>
        <tr><th>Sistem yüksekliği</th><td>${facts.heightCm} cm</td></tr>
        <tr><th>Sistem derinliği</th><td>${facts.depthCm} cm</td></tr>
        <tr><th>Düz panel</th><td>${facts.stripCount} × ${facts.stripHeightCm} cm yatay bölüm</td></tr>
        <tr><th>Standart genişlikler</th><td>${facts.widths} cm</td></tr>
        <tr><th>Zemin grid</th><td>${facts.gridWidthCm} × ${facts.gridDepthCm} cm</td></tr>
        <tr><th>Stand ölçü adımı</th><td>${facts.stepStandCm} cm ve katları</td></tr>
        <tr><th>Pasif çevre alanı</th><td>${facts.surroundCm} cm gri alan</td></tr>
        <tr><th>Maksimum stand alanı</th><td>${facts.maxStandCm} × ${facts.maxStandCm} cm (${maxM} × ${maxM} m)</td></tr>
      </tbody></table>
      <p>Stand tipleri: Sırt Duvar, U Stand, L Stand Sol, L Stand Sağ ve Ada Stand.</p>
    `;
}
