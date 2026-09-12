# A02 F-007 kapanışı

Bulgu: **F-007 — `test/` ve `tests/` change-gate korumalı-dosya yönetiminin dışında**

Durum: **CLOSED, birleştirme sonrası ROG doğrulaması bekleniyor**

Düzeltme:
- `test/**` artık korumalı bir değişiklik yüzeyidir.
- eski `tests/**` artık korumalı bir değişiklik yüzeyidir.
- her iki yol da `tests` etki alanını gerektirir.
- regresyon kapsamı hem korumalı durumu hem zorunlu `tests` etkisini kanıtlar.

Hedefli regresyon:
- `test/systemChangeGate.test.js`

Doğrulama:
- uygulama PR CI çalıştırması #117: Change contract gate, install, full test ve build passed.
- birleştirmeden önce kapanış-defteri güncellemelerinden sonra son dal CI geçmelidir.
- F-008 başlamadan önce birleştirme sonrası ROG CI geçmelidir.
