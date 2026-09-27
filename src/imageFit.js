function finitePositive(value) {
  return Number.isFinite(value) && value > 0;
}

export function computeImageFit(
  imageWidth,
  imageHeight,
  targetWidth,
  targetHeight,
  fit = 'contain',
) {
  if (
    !finitePositive(imageWidth)
    || !finitePositive(imageHeight)
    || !finitePositive(targetWidth)
    || !finitePositive(targetHeight)
  ) {
    return null;
  }

  const mode = fit === 'cover' ? 'cover' : 'contain';
  const scaleX = targetWidth / imageWidth;
  const scaleY = targetHeight / imageHeight;
  const scale = mode === 'cover'
    ? Math.max(scaleX, scaleY)
    : Math.min(scaleX, scaleY);

  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;

  return {
    fit: mode,
    drawWidth,
    drawHeight,
    drawX: (targetWidth - drawWidth) / 2,
    drawY: (targetHeight - drawHeight) / 2,
  };
}

/**
 * Real-size tile. Repeat is panel ÷ tile.
 * Horizontal offset centers the tile so the extra copy comes from both sides.
 * Vertical offset keeps the tile on the bottom so the extra copy comes from the top.
 */
export function computeImageSizeTile(panelWidthCm, panelHeightCm, tileWidthCm, tileHeightCm) {
  if (
    !finitePositive(panelWidthCm)
    || !finitePositive(panelHeightCm)
    || !finitePositive(tileWidthCm)
    || !finitePositive(tileHeightCm)
  ) {
    return null;
  }

  const repeatX = panelWidthCm / tileWidthCm;
  const repeatY = panelHeightCm / tileHeightCm;
  return {
    repeatX,
    repeatY,
    offsetX: (1 - repeatX) / 2,
    offsetY: 0,
  };
}

/**
 * One cell of a shared area. region is the panel's share of that area, in 0..1,
 * with Y growing upward from the bottom.
 */
export function computeGroupSizeSlice(region, tile) {
  const startX = Number(region?.startX);
  const startY = Number(region?.startY);
  const width = Number(region?.width);
  const height = Number(region?.height);
  if (
    !tile
    || ![startX, startY, width, height, tile.repeatX, tile.repeatY, tile.offsetX, tile.offsetY]
      .every((value) => Number.isFinite(value))
    || !(width > 0)
    || !(height > 0)
  ) {
    return null;
  }

  return {
    repeatX: width * tile.repeatX,
    repeatY: height * tile.repeatY,
    offsetX: startX * tile.repeatX + tile.offsetX,
    offsetY: startY * tile.repeatY + tile.offsetY,
  };
}

/** Empty height keeps the image aspect. A set height is the tile height, even if it stretches. */
export function resolveImageTileHeightCm(widthCm, heightCm, imageWidth, imageHeight) {
  if (!finitePositive(widthCm)) return null;
  if (finitePositive(heightCm)) return heightCm;
  if (!finitePositive(imageWidth) || !finitePositive(imageHeight)) return null;
  return widthCm * (imageHeight / imageWidth);
}
