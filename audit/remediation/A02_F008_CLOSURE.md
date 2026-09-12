# A02 F-008 kapanışı

Bulgu: **F-008 — Hedefli regresyon bildirimi boş kalabilir; test etkisi makine zorunlu değil**

Durum: **CLOSED, birleştirme sonrası ROG doğrulaması bekleniyor**

Düzeltme:
- her change contract `impact.tests` alanını `affected` olarak işaretlemelidir.
- `tests.targeted` en az bir boş olmayan hedefli regresyon yolu içermelidir.
- mevcut `tests.fullSuite = true` ve `tests.build = true` gereksinimleri zorunlu kalır.
- negatif regresyonlar `tests: not-applicable`, boş hedefli liste ve boş hedefli girişleri reddeder.

Hedefli regresyon:
- `test/systemChangeGate.test.js`

Doğrulama:
- uygulama PR CI çalıştırması #122: Change contract gate, install, full test ve build passed.
- birleştirmeden önce kapanış-defteri güncellemelerinden sonra son dal CI geçmelidir.
- F-009 başlamadan önce birleştirme sonrası ROG CI geçmelidir.
