export function inferStatusTone(element) {
  if (element.classList.contains('error')) return 'error';
  const text = element.textContent.toLocaleLowerCase('tr-TR');
  if (/hata|başarısız|geçersiz|aşılamaz|bulunamadı|yüklenemedi|kaydedilemedi/.test(text)) return 'error';
  if (/uyarı|dikkat|seçilmedi|henüz|bekliyor/.test(text)) return 'warning';
  if (/kaydedildi|yüklendi|oluşturuldu|hazır|tamamlandı|eklendi|aktarıldı|silindi/.test(text)) return 'success';
  return 'info';
}

export function syncStatusTone(element) {
  element.classList.remove('status-info', 'status-success', 'status-warning', 'status-error');
  element.classList.add('status-' + inferStatusTone(element));
}

export function syncSelectionFeedback(element, defaultHint) {
  const message = element.textContent.trim();
  element.classList.toggle('has-selection', Boolean(message) && message !== defaultHint);
}

export function observeSelectionFeedback({ element, defaultHint, MutationObserverClass = MutationObserver }) {
  const sync = () => syncSelectionFeedback(element, defaultHint);
  const observer = new MutationObserverClass(sync);
  observer.observe(element, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  sync();
  return observer;
}

export function observeStatusTones({ elements, MutationObserverClass = MutationObserver }) {
  return elements.filter(Boolean).map((element) => {
    const observer = new MutationObserverClass(() => syncStatusTone(element));
    observer.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    syncStatusTone(element);
    return observer;
  });
}
