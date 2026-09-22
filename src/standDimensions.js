// Stand zarfı runtime kaydı. Kaynak fair_stand_dimensions (catalog bootstrap), birim: cm.
// Three.js sahnesi metre kullanır; STAND_DIMENSIONS.height / depth / … getter'ları m döner.

let standDimensions = null;

const REQUIRED_CM_FIELDS = Object.freeze([
  'heightCm',
  'depthCm',
  'stripHeightCm',
  'frameWidthCm',
  'frameDepthCm',
]);

function requirePositiveNumber(value, field) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new TypeError(`Fair Stand dimensions.${field} must be a positive number.`);
  }
  return number;
}

function cmToMeters(cm) {
  return Number(cm) / 100;
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
  for (const field of REQUIRED_CM_FIELDS) {
    next[field] = requirePositiveNumber(raw[field], field);
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
  get heightCm() {
    return getStandDimensions().heightCm;
  },
  get depthCm() {
    return getStandDimensions().depthCm;
  },
  get stripCount() {
    return getStandDimensions().stripCount;
  },
  get stripHeightCm() {
    return getStandDimensions().stripHeightCm;
  },
  get frameWidthCm() {
    return getStandDimensions().frameWidthCm;
  },
  get frameDepthCm() {
    return getStandDimensions().frameDepthCm;
  },
  /** Three.js / sahne zarfı (metre). */
  get height() {
    return cmToMeters(getStandDimensions().heightCm);
  },
  get depth() {
    return cmToMeters(getStandDimensions().depthCm);
  },
  get stripHeight() {
    return cmToMeters(getStandDimensions().stripHeightCm);
  },
  get frameWidth() {
    return cmToMeters(getStandDimensions().frameWidthCm);
  },
  get frameDepth() {
    return cmToMeters(getStandDimensions().frameDepthCm);
  },
});

export const MODULE_WIDTHS_CM = Object.freeze([50, 100, 150, 200]);
