const DEFAULT_GRID_SIZE_M = 30;
const GRID_PADDING_M = 5;
const GRID_GROWTH_STEP_M = 10;

export function createGroundLayout(
  totalWallWidthM,
  {
    defaultSizeM = DEFAULT_GRID_SIZE_M,
    paddingM = GRID_PADDING_M,
    growthStepM = GRID_GROWTH_STEP_M,
  } = {},
) {
  const safeWallWidth = Number.isFinite(Number(totalWallWidthM))
    ? Math.max(0, Number(totalWallWidthM))
    : 0;

  const requiredSize = Math.max(
    defaultSizeM,
    Math.ceil(safeWallWidth + paddingM * 2),
  );

  const sizeM = Math.ceil(requiredSize / growthStepM) * growthStepM;
  const leftX = -paddingM;
  const centerX = leftX + sizeM / 2;

  return {
    sizeM,
    divisions: sizeM,
    cellSizeM: 1,
    centerX,
    leftX,
    rightX: leftX + sizeM,
  };
}
