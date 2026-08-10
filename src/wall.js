import { MODULE_WIDTHS_CM } from './catalog.js';

export function validateWallLength(lengthCm) {
  if (!Number.isFinite(lengthCm) || lengthCm < 50) {
    return { ok: false, message: 'Duvar genişliği en az 50 cm olmalı.' };
  }

  if (lengthCm % 50 !== 0) {
    return { ok: false, message: 'Şimdilik genişlik 50 cm katlarıyla oluşturulabilir.' };
  }

  return { ok: true };
}

/**
 * İlk prototipte en az parça sayısını hedefliyoruz.
 * Modüller 50 cm katları olduğu için büyükten küçüğe seçim optimum sonucu verir.
 * Örnek: 350 => [200, 150], 600 => [200, 200, 200].
 */
export function composeStraightWall(lengthCm) {
  const validation = validateWallLength(lengthCm);
  if (!validation.ok) return validation;

  const widths = [...MODULE_WIDTHS_CM].sort((a, b) => b - a);
  const modules = [];
  let remaining = lengthCm;

  for (const width of widths) {
    while (remaining >= width) {
      modules.push(width);
      remaining -= width;
    }
  }

  if (remaining !== 0) {
    return { ok: false, message: 'Bu ölçü mevcut modüllerle oluşturulamadı.' };
  }

  return {
    ok: true,
    lengthCm,
    modules,
    moduleCount: modules.length,
  };
}
