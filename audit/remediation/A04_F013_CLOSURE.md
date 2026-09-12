> **Dipnot (2026-09-12):** F-013 kapalı durur. Runtime kimliği artık `itemKey`; `src/` `catalogKey` yazmaz. Kapanış anındaki “45 katalog / zorunlu catalogKey” cümleleri tarihîdir. Güncel katalog 51.

# A04 F-013 kapanışı

Bulgu: **F-013 — `catalogKey` yokken düz vs sarmaşık separatör katalog kimliği belirsiz**

Durum: **CLOSED / POST-MERGE VERIFIED**

## Düzeltme

- `src/catalog.js` artık normalize edilmiş katalog kimliği eşlemesine `modelFile` ekler.
- Eski/anahtarsız ayırıcı tanımlayıcıları bu nedenle şunları ayırt edebilir:
  - `wall_separator_100` ile `wall_separator_100_sarmasik`,
  - `wall_separator_50` ile `wall_separator_50_sarmasik`.
- `src/designState.js` kanonik inşası, katalog kimliğini girdi tanımlayıcısından çözer ve runtime modül bir katalog ürününe karşılık geldiğinde geçerli bir kanonik `catalogKey` ekler.
- Kanonik inşa, null/undefined kimliği kalıcılaştırmak yerine gerçek katalog dışı runtime nesneleri için `catalogKey` atlar.
- `src/main.js` geri yükleme normalizasyonu, çözülebildiğinde eksik/geçersiz katalog kimliğini onarır ve çözülemeyen kimlik alanlarını siler.
- `illuminated-foam` açık katalog dışı runtime nesnesi olarak kalır ve bu nedenle anahtarsız kalır.
- F-013 tarafından hiçbir katalog ölçüsü, modül fabrika geometrisi, yerleşim aritmetiği, renderer görünümü veya BOM sınıflandırması kasıtlı olarak değiştirilmedi.

## Regresyon kanıtı

Hedefli kapsam şunları içerir:

- `test/catalogSingleSource.test.js` — `modelFile` üzerinden tam normal ile sarmaşık ayırıcı çözümlemesini doğrular.
- `test/moduleStateConstructionRegistry.test.js` — 45 katalog tanımlayıcısının tümünün, çağıranlar key'i açıkça vermeden kanonik `catalogKey` aldığını doğrular; katalog dışı illuminated foam'un `catalogKey` özelliği yoktur; otomatik-eşdeğer tanımlayıcılar kanonik kimliği çözer.
- `e2e/f010-module-construction.spec.mjs` — Chromium, kalıcı otomatik-duvar modüllerinin ve gerçek katalog-seçici oluşturmanın kanonik katalog kimliği taşıdığını doğrular.

Tam birim/entegrasyon paketi ve üretim derlemesi son PR head'de ve birleştirmeden sonra yeniden geçti.

## Güncel ROG ile entegrasyon

PR #53 ilk olarak A03/F-012 kapanışından önce hazırlandı. Birleştirmeden önce o sıradaki güncel `ROG` (`d6f9b32e50948b257226e5414074cc95be7246e0`) ile senkronize edildi. Örtüşen tek değişen dosya `.github/change-contract.json` idi; A03 runtime değişiklikleri olduğu gibi korundu.

Senkronizasyondan sonra change gate, yeni erişilebilir iki A03 inceleme yüzeyinin (`test/sceneSurroundSingleSource.test.js` ve `audit/remediation/A03_CLOSURE.md`) bildirilmesini istedi. Bildirim güncellendi ve son PR CI tamamen geçti. Bu yönetişim üst veri hizalamasıydı, bir ürün regresyonu değil.

## CI ve birleştirme kanıtı

- uygulama PR: **#53 — Enforce canonical catalogKey identity**
- son uygulama head: `0f6b95f5163bc30377862882a7e5bf6724b65463`
- son PR CI: **#225 / run `33976413653` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success
- `ROG`'a `238c2946d9e09451f22d040dd04a340cde7991a9` olarak birleştirildi
- birleştirme sonrası `ROG` CI: **#226 / run `33976491702` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success

## Sonuç

F-013 depo kapanış kuralını karşılar: uygulama, hedefli regresyon, tam paket, derleme, PR CI, birleştirme ve birleştirme sonrası doğrulama tamamdır.

**F-013 is CLOSED.**

A04 açık kalır çünkü **F-014 — 17 active module contracts require final BOM classification** hâlâ `OPEN / DECISION_REQUIRED`'dır.
