export function renderStageResult(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle('error', isError);
}

export function renderWallResult(message, isError = false, warn = console.warn) {
  if (isError) warn(message);
}

export function formatCapacityPopup(result, title) {
  const axis = result.axis?.toUpperCase() ?? '';
  return `${title}\n\n`
    + `${axis} stand sınırı: ${result.limitCm} cm\n`
    + `Mevcut toplam: ${result.currentCm} cm\n`
    + `Eklenmek istenen: ${result.addedCm} cm\n`
    + `Oluşacak toplam: ${result.projectedCm} cm\n\n`
    + 'Aktif stand alanı aşılamaz.';
}
