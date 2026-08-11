export function formatPlacementFeedbackMessage(message) {
  const text = String(message ?? '').trim();
  if (!text) return '';

  if (/başka (bir )?modülle çakışıyor|bu konumda başka bir modül var/i.test(text)) {
    return 'Başka modülle çakışıyor.';
  }
  if (/stand sınırını aşıyor|aktif stand alanını aşıyor|hedef duvar sınırına sığmıyor/i.test(text)) {
    return 'Stand sınırı dışında.';
  }
  if (/aktif duvar zincirinde.*yeterli alan yok/i.test(text)) {
    return 'Yeterli boşluk yok.';
  }
  if (/duvar modülü .* yönünde olmalı|bu stand tipinde bu konuma modül yerleştirilemez/i.test(text)) {
    return 'Bu konuma bu yönde yerleştirilemez.';
  }

  return text;
}

export function hasPlacementFeedbackPointer(clientX, clientY) {
  return clientX !== null
    && clientX !== undefined
    && clientY !== null
    && clientY !== undefined
    && Number.isFinite(Number(clientX))
    && Number.isFinite(Number(clientY));
}
