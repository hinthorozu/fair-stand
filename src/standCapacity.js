export const STAND_AXES = Object.freeze(['x', 'y']);

export function validateStandAxisCapacity({
  axis,
  currentCm = 0,
  addedCm = 0,
  xCm,
  yCm,
} = {}) {
  if (!STAND_AXES.includes(axis)) {
    return { ok: false, message: 'Geçersiz stand ekseni.' };
  }

  const limitCm = Number(axis === 'x' ? xCm : yCm);
  const normalizedCurrentCm = Number(currentCm);
  const normalizedAddedCm = Number(addedCm);

  if (!Number.isFinite(limitCm) || limitCm <= 0) {
    return { ok: false, message: `${axis.toUpperCase()} stand sınırı geçersiz.` };
  }

  if (
    !Number.isFinite(normalizedCurrentCm)
    || !Number.isFinite(normalizedAddedCm)
    || normalizedCurrentCm < 0
    || normalizedAddedCm < 0
  ) {
    return { ok: false, message: 'Modül toplam ölçüsü geçersiz.' };
  }

  const projectedCm = normalizedCurrentCm + normalizedAddedCm;
  if (projectedCm > limitCm) {
    return {
      ok: false,
      axis,
      limitCm,
      currentCm: normalizedCurrentCm,
      addedCm: normalizedAddedCm,
      projectedCm,
      message: `${axis.toUpperCase()} yönünde toplam ${projectedCm} cm olur; aktif stand sınırı ${limitCm} cm. Modüller eklenmedi.`,
    };
  }

  return {
    ok: true,
    axis,
    limitCm,
    currentCm: normalizedCurrentCm,
    addedCm: normalizedAddedCm,
    projectedCm,
    remainingCm: limitCm - projectedCm,
  };
}
