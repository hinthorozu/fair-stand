import { STAND_DIMENSIONS } from './standDimensions.js';
import { getItem } from './items.js';

export function getStandStripMetrics() {
  return Object.freeze({
    stripCount: Number(STAND_DIMENSIONS.stripCount),
    stripHeightM: Number(STAND_DIMENSIONS.stripHeight),
    stripHeightCm: Math.round(Number(STAND_DIMENSIONS.stripHeight) * 100),
    heightCm: Math.round(Number(STAND_DIMENSIONS.height) * 100),
  });
}

export function getStandInternalSeamHeightsCm() {
  const { stripCount, stripHeightCm } = getStandStripMetrics();
  const seams = [];
  for (let index = 1; index < stripCount; index += 1) {
    seams.push(index * stripHeightCm);
  }
  return Object.freeze(seams);
}

export function normalizeStripOccupancy(occupancy) {
  if (!occupancy || typeof occupancy !== 'object') return null;
  const stripCount = Number(occupancy.stripCount);
  if (!Number.isInteger(stripCount) || stripCount <= 0) return null;
  const align = occupancy.align === 'top' ? 'top' : 'bottom';
  return Object.freeze({ align, stripCount });
}

export function resolveModuleStripOccupancy(moduleOrItem) {
  if (!moduleOrItem || typeof moduleOrItem !== 'object') return null;
  const fromItem = normalizeStripOccupancy(getItem(moduleOrItem.itemKey)?.stripOccupancy);
  if (fromItem) return fromItem;
  return normalizeStripOccupancy(moduleOrItem.stripOccupancy);
}
