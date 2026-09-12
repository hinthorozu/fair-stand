# A02 — Evrensel change gate düzeltme kapanışı

Bölüm durumu: **CLOSED / AUDITED_OK / POST-MERGE VERIFIED**

Orijinal denetim kanıtı: `audit/evidence/A02_CHANGE_GATE.md`
Kapatılan bulgular: **F-005, F-006, F-007, F-008, F-009**

## Güncel yeniden doğrulama

- **A02.01 AUDITED_OK** — 17 etki alanı `src/systemChangeContract.js` içinde bir kez tanımlı kalır ve eksik-alan regresyon kapsamı aktiftir.
- **A02.02 AUDITED_OK** — desteklenen değişiklik türleri ve zorunlu alanları doğrulayıcı ile zorunlu kılınır; her değişiklik ayrıca `tests: affected` gerektirir.
- **A02.03 AUDITED_OK** — korumalı tespit runtime/ürün giriş noktalarını artı yönetişim ve test yüzeylerini kapsar.
- **A02.04 AUDITED_OK** — katalog ile ilgili kaynak sahipliği açıkça eşlenir; `catalog.js` ve `tvConfig.js` dahildir.
- **A02.05 AUDITED_OK** — davranış/yerleşim ile ilgili kaynaklar açıkça eşlenir; placement core, zemin/düzen/kapasite/kurulum/duvar yardımcıları ve orkestrasyon sorumlulukları dahildir.
- **A02.06 AUDITED_OK** — durum/kalıcılık/depolama ile ilgili kaynaklar açıkça eşlenir; store'lar, otomatik kayıt, proje geçişi ve bilinen orkestrasyon sorumlulukları dahildir.
- **A02.07 AUDITED_OK** — renderer ile ilgili kaynaklar açıkça eşlenir; sahne/görünüm, görüntü düzeni/sığdırma, tema ve TV yapılandırma sorumlulukları dahildir.
- **A02.08 AUDITED_OK** — UI/statik/dinamik controller kaynak yüzeyleri açıkça eşlenir; UI/erişilebilirlik sorumlulukları bilinen yerlerde makine tarafından zorunludur.
- **A02.09 AUDITED_OK** — BOM/üretim kaynak yolları BOM etkisi gerektirir.
- **A02.10 AUDITED_OK** — kompozisyon/otomasyon kaynak yolları composition etkisi gerektirir.
- **A02.11 AUDITED_OK** — her `public/**` yolu assets etkisi gerektirir.
- **A02.12 AUDITED_OK** — paket/kilit/script/workflow/vite yapılandırması architecture etkisi gerektirir.
- **A02.13 AUDITED_OK** — CI, PR base→HEAD ve push before→after farklarını türetmeye devam eder ve bildirim güncellemesi olmadan korumalı değişiklikleri reddeder.
- **A02.14 AUDITED_OK** — yol-zorunlu alanlar `not-applicable` olarak bildirilemez.
- **A02.15 AUDITED_OK** — risk, migration, rollback, fullSuite, build, `tests: affected` ve boş olmayan hedefli regresyon listesi doğrulayıcı ile zorunludur.
- **A02.16 AUDITED_OK** — gate kodu/script'leri/workflow'u, kanonik yönetişim Markdown'ı ve gate testleri architecture/tests etki kurallarıyla korunur.
- **A02.17 AUDITED_OK** — güncel 51 `src/` dosyasının tümünün açık, boş olmayan sahiplik-türevli alan eşlemesi vardır; regresyon gerçek dizini sayar ve eşlenmemiş gelecekteki bir kaynak dosyasında düşer.
- **A02.18 AUDITED_OK** — yerel doğrulayıcı artık fark zorunluluğunu atlamaz; commit'lenmiş merge-base farkını, staged, unstaged ve untracked değişiklikleri birleştirir, `CHANGE_GATE_BASE` destekler ve taban çözülemediğinde kapalı düşer.
- **A02.19 AUDITED_OK** — hem `test/**` hem `tests/**` korunur, tests etkisi gerektirir ve her değişiklik bildirimi hedefli regresyon kapsamını adlandırmalıdır.

## Regresyon kanıtı

- `test/systemChangeGate.test.js`
- `test/systemChangeGateCiContract.test.js`
- `test/systemChangeGateLocalDiff.test.js`

Yerel-fark regresyonu, kaynak-metin eşleştirmesi yerine gerçek bir geçici git deposu kullanır.

## CI kanıtı

- F-009 uygulama PR #44 CI çalıştırması #127: gate + install + full test + build passed.
- PR #44 son dal CI çalıştırması #131: gate + install + full test + build passed.
- PR #44, `14b4e5b83b2cefe48aaa8cefc761a73d8e0b82fe` olarak ROG'a birleştirildi.
- Birleştirme sonrası ROG CI çalıştırması #132 / id `33804101800`: **completed / success**; gate + install + full test + build passed.

## Sonuç

A02'de kalan açık bulgu yoktur ve bölüm birleştirme sonrası tam doğrulanmıştır. Düzeltme **A03 — Repository architecture / ownership** bölümüne, F-010 ile başlayarak ilerleyebilir.
