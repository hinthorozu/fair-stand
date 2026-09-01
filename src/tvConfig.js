export const TV_42_BASE = Object.freeze({
  type: 'tv',
  widthCm: 100,
  depthCm: 5,
  catalogHeightCm: 350,
  sizeInch: 42,
  screenWidthCm: 93.0,
  screenHeightCm: 52.3,
});

const TV_SIZE_OVERRIDES = Object.freeze({
  42: Object.freeze({}),
  55: Object.freeze({
    sizeInch: 55,
    screenWidthCm: 121.8,
    screenHeightCm: 68.5,
  }),
  65: Object.freeze({
    sizeInch: 65,
    screenWidthCm: 143.9,
    screenHeightCm: 80.9,
  }),
});

export const TV_SIZE_INCHES = Object.freeze([42, 55, 65]);

export function getTvDefinition(sizeInch = 42) {
  const override = TV_SIZE_OVERRIDES[Number(sizeInch)];
  if (!override) return null;
  return Object.freeze({ ...TV_42_BASE, ...override });
}
