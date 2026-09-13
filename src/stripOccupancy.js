import { STAND_DIMENSIONS } from './catalog.js';
import { getItem } from './items.js';

export function getStandStripMetrics() {
  return Object.freeze({
    stripCount: Number(STAND_DIMENSIONS.stripCount),
    stripHeightM: Number(STAND_DIMENSIONS.stripHeight),
    stripHeightCm: Math.round(Number(STAND_DIMENSIONS.stripHeight) * 100),
    heightCm: Math.round(Number(STAND_DIMENSIONS.height) * 100),
  });
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

export function getOccupiedStripLayout(occupancy, {
  stripCount = STAND_DIMENSIONS.stripCount,
  stripHeight = STAND_DIMENSIONS.stripHeight,
} = {}) {
  const standStripCount = Number(stripCount);
  const standStripHeight = Number(stripHeight);
  const normalized = normalizeStripOccupancy(occupancy);
  if (!normalized || !Number.isFinite(standStripCount) || !Number.isFinite(standStripHeight)) return null;
  if (normalized.stripCount >= standStripCount) return null;

  const skipCount = standStripCount - normalized.stripCount;
  const bottomSkip = normalized.align === 'top' ? skipCount : 0;
  return Object.freeze({
    visibleCount: normalized.stripCount,
    skipCount: bottomSkip,
    startIndex: 0,
    frameBottomY: bottomSkip * standStripHeight,
    frameHeight: normalized.stripCount * standStripHeight,
  });
}

export function getStripOccupancyHeightRangeCm(occupancy) {
  const stand = getStandStripMetrics();
  const normalized = normalizeStripOccupancy(occupancy);
  if (!normalized) {
    return Object.freeze({ minCm: 0, maxCm: stand.heightCm });
  }

  const occupiedHeightCm = normalized.stripCount * stand.stripHeightCm;
  if (normalized.align === 'top') {
    return Object.freeze({
      minCm: Math.max(0, stand.heightCm - occupiedHeightCm),
      maxCm: stand.heightCm,
    });
  }

  return Object.freeze({
    minCm: 0,
    maxCm: Math.min(stand.heightCm, occupiedHeightCm),
  });
}
