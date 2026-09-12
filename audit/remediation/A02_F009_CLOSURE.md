# A02 F-009 kapanışı

Bulgu: **F-009 — Yerel `contract:verify` CI/env dışında diff denetimini atlayabilir**

Durum: **CLOSED, birleştirme sonrası ROG doğrulaması bekleniyor**

Düzeltme:
- CI dışındaki yalnızca-şema başarı yolu kaldırıldı.
- yerel doğrulama, commit'lenmiş değişiklikleri bir ROG/base merge-base'den çözer.
- yerel doğrulama staged, unstaged ve untracked dosyaları birleştirir.
- `CHANGE_GATE_BASE=<git-ref>` açık bir taban geçersiz kılması sağlar.
- yerel taban çözülemediğinde zorunluluk sessizce atlanmak yerine kapalı düşer.
- çıktı kullanılan gerçek fark kaynağını bildirir.

Hedefli regresyon:
- `test/systemChangeGateLocalDiff.test.js` gerçek bir geçici git deposu oluşturur ve şunları kanıtlar:
  - sözleşme güncellemesi olmadan untracked korumalı bir kaynak reddedilir,
  - staged kaynak + unstaged sözleşme değişiklikleri birleştirilir ve kabul edilir,
  - commit'lenmiş korumalı değişiklikler açık bir tabana karşı zorunlu kılınır.
- `test/systemChangeGateCiContract.test.js` kanonik CI gate sıralamasını korumaya devam eder.

Dokümantasyon:
- `SYSTEM_CHANGE_GATE.md` artık güncel F-005..F-009 yol kapsamını, zorunlu hedefli testleri ve yerel fark davranışını belgeler.

Doğrulama:
- uygulama PR #44 CI çalıştırması #127: Change contract gate, install, full test ve build passed.
- birleştirmeden önce bölüm-kapanışı defter işlemlerinden sonra son dal CI geçmelidir.
- A03 düzeltmesi başlamadan önce birleştirme sonrası ROG CI geçmelidir.
