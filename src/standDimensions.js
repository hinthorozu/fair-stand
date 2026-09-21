// Stand zarfı runtime kaydı. Kaynak fair_stand_dimensions (catalog bootstrap).
// Catalog / Item satırı değildir. MODULE_WIDTHS_CM bu tabloda değildir.

let standDimensions = null;

const REQUIRED_METER_FIELDS = Object.freeze([
  'height',
  'depth',
  'stripHeight',
  'frameWidth',
  'frameDepth',
]);

function requirePositiveNumber(value, field) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new TypeError(`Fair Stand dimensions.${field} must be a positive number.`);
  }
  return number;
}

export function initializeStandDimensions(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new TypeError('Fair Stand dimensions bootstrap payload is invalid.');
  }
  const stripCount = Number(raw.stripCount);
  if (!Number.isInteger(stripCount) || stripCount <= 0) {
    throw new TypeError('Fair Stand dimensions.stripCount must be a positive integer.');
  }
  const next = { stripCount };
  for (const field of REQUIRED_METER_FIELDS) {
    next[field] = requirePositiveNumber(raw[field], field);
  }
  const expectedHeight = next.stripCount * next.stripHeight;
  if (Math.abs(next.height - expectedHeight) > 0.0001) {
    throw new TypeError('Fair Stand dimensions.height must equal stripCount × stripHeight.');
  }
  standDimensions = Object.freeze(next);
}

export function resetStandDimensions() {
  standDimensions = null;
}

export function getStandDimensions() {
  if (!standDimensions) {
    throw new Error('Fair Stand dimensions are not bootstrapped.');
  }
  return standDimensions;
}

export const STAND_DIMENSIONS = Object.freeze({
  get height() {
    return getStandDimensions().height;
  },
  get depth() {
    return getStandDimensions().depth;
  },
  get stripCount() {
    return getStandDimensions().stripCount;
  },
  get stripHeight() {
    return getStandDimensions().stripHeight;
  },
  get frameWidth() {
    return getStandDimensions().frameWidth;
  },
  get frameDepth() {
    return getStandDimensions().frameDepth;
  },
});

export const MODULE_WIDTHS_CM = Object.freeze([50, 100, 150, 200]);
