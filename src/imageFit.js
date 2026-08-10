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
