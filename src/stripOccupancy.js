import { STAND_DIMENSIONS } from './standDimensions.js';
import { getItem } from './items.js';
import {
  WALL_PANEL_BAND_PITCH_CM,
  listInternalSeamHeightsCm,
} from './wallPanelBand.js';

export function getStandStripMetrics() {
  const heightCm = Math.round(Number(STAND_DIMENSIONS.heightCm));
  const stripHeightCm = WALL_PANEL_BAND_PITCH_CM;
  const stripCount = Math.max(1, Math.floor(heightCm / stripHeightCm));
  return Object.freeze({
    stripCount,
    stripHeightM: stripHeightCm / 100,
    stripHeightCm,
    heightCm,
  });
}

export function getStandInternalSeamHeightsCm() {
  const { heightCm, stripHeightCm, stripCount } = getStandStripMetrics();
  return listInternalSeamHeightsCm({
    stripCount,
    pitchCm: stripHeightCm,
    minCm: 0,
    maxCm: heightCm,
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
