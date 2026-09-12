# A16 — Erişilebilirlik / klavye / odak denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Bulgular

### F-039 — P2 — dinamik modal/bağlam odak semantiği eksik ve tutarsızdır

UI yerli düğme/girdileri geniş kullanır ve modül seçici `role="dialog"` + `aria-modal="true"` bildirir, ancak dinamik katmanlar tam bir odak sözleşmesi paylaşmaz:

- modül seçici, odağı açıkça iletişim kutusuna taşımadan, odağı tuzağa düşürmeden veya odağı çağırana döndürmeden açılır;
- modül bağlam menüsü, menü/iletişim semantiği veya klavye dolaşma davranışı olmayan, düğmeli konumlandırılmış bir `div`'tir;
- proje adlandırma katmanı metin girdisine odaklanır, ancak dialog rolü/aria-modal, odak tuzağı, açık Escape işleyici veya odak geri yükleme yoktur;
- illuminated-foam boyut katmanı benzer biçimde bir girdiye odaklanır ancak ortak bir modal erişilebilirlik/odak yaşam döngüsü yoktur.

Bu bir ürün erişilebilirlik/klavye tutarlılık boşluğudur; fare iş akışlarının bozuk olduğunun kanıtı değildir.

## Olumlu kontroller

- birincil statik kontroller yerli `button`, `input`, `select`, `details/summary` semantiği kullanır.
- çoğu birincil alan için statik etiketler/aria-etiketleri vardır.
- görünüm kısayolları `isEditableKeyboardTarget()` üzerinden geçer ve odak input/textarea/select/contenteditable içindeyken kasıtlı ateşlenmez.
- modül seçici Escape kapatmayı destekler.
- proje yükleme katmanı `aria-live`/`aria-busy` durumu açığa çıkarır.
- geri bildirim genellikle rengin yanı sıra metinseldir.

## Kontrol listesi sonuçları

- A16.01 erişilebilir adlar/etiketler: birincil statik kontroller için `AUDITED_OK`; dinamik semantik boşluk F-039.
- A16.02 düğme semantiği: birincil eylemler için `AUDITED_OK`.
- A16.03 düzenleme sırasında kısayol bastırma: çözümleyici/entegrasyon düzeyinde `AUDITED_OK`.
- A16.04 modal/bağlam odak yaşam döngüsü: `GAP` — F-039.
- A16.05 Escape/kapat tutarlılığı: `GAP` — F-039.
- A16.06 gizli/devre dışı odak: incelenen yerli kontrollerde `AUDITED_OK`.
- A16.07 yalnızca-renk-olmayan geri bildirim: incelenen durum/seçim akışları için `AUDITED_OK`.
- A16.08 kritik iş akışları klavye-işletilebilir: `GAP/DECISION_REQUIRED` — 3B işaretçi yerleştirme ve dinamik iletişim kutularının tam bir klavye-eşdeğer sözleşmesi yoktur.

Bölüm denetim durumu: **GAP**.
