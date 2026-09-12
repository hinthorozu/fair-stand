# A03 F-010 kapanışı

Bulgu: **F-010 — `main.js` paralel/gizli runtime modül-state oluşturma kaydı içeriyor**

Durum: **CLOSED / POST-MERGE VERIFIED**

## Düzeltme

- `src/designState.js` artık kanonik runtime modül-durumu inşa kaydının ve `createModuleStateFromDescriptor(...)` giriş noktasının sahibidir.
- `src/main.js` bir modül-tipi → fabrika dağıtıcısı veya doğrudan modül fabrika import'ları sahiplenmek yerine katalog inşasını o kanonik kurucuya devreder.
- otomatik duvar, otomatik depo ve illuminated-foam inşa yolları, mevcut runtime durum şekillerini ve yerleşim semantiğini koruyarak kanonik kurucuyu kullanır.
- katalog kimliği kapanış anında `catalogKey` diye yazıldı. **Sonraki Item cutover:** runtime kimliği `itemKey`; `src/` içinde `catalogKey` yok. Katalog anahtar sayısı kapanışta 45, güncel 51 (`SYSTEM_MODULE_CATALOG.md`).

## Regresyon kanıtı

Hedefli birim/entegrasyon kapsamı şunları içerir:

- `test/moduleStateConstructionRegistry.test.js` — 45 katalog key'inin tümünün kanonik kayıt üzerinden inşa edildiğini kanıtlar, tip/katalog kimliğini korur, yerleşim korumasını ve katalog dışı illuminated foam'u kapsar ve `main.js` sahiplik sınırını korur.
- `test/coatRackModule.test.js` ve `test/indoorPlants.test.js` — eski uygulama-konumu iddiaları, `main.js` içinde doğrudan fabrikalar istemek yerine güncel sahiplik mimarisini doğrulayacak şekilde düzeltildi.
- `test/illuminatedFoamModule.test.js`, `test/automaticWall.test.js` ve `tests/autoDepot.test.js` — sahiplik taşınmasından etkilenen katalog dışı ve otomatik inşa yollarını korur.
- `test/systemChangeGateLocalDiff.test.js` — tam-sistem etki taramasının onu etkilenen bir gate testi olarak işaretlemesinden sonra hedefli yönetişim regresyon kümesinin parçası kalır.
- `e2e/f010-module-construction.spec.mjs` — Chromium regresyonu hem otomatik-duvar inşasını hem gerçek UI üzerinden katalog inşasını kanıtlar, ardından oluşan modül durumunun IndexedDB'de kalıcı olduğunu doğrular.

E2E katalog akışı geçerli gerçek-duvar yolunu kullanır: Sırt Duvar → Duvarı temizle → katalogdan `wall_100` ekle → picker kapanışı → kaydet → persisted state verification. Daha önceki geçersiz Ada Stand ekleme varsayımları, üretim doğrulamasını zayıflatmak yerine kaldırıldı.

## Tam-sistem etki incelemesi

Kabul edilen F-010 change contract, schemaVersion 2 tam-sistem etki gate'i altında runtime/kod bağımlılarını, etkilenen testleri, dokümantasyon/sözleşmeleri ve bağlı bulgu adaylarını inceledi.

- **F-028 OPEN kalır.** Kanonik kurucu artık tüm-özellikleri-sıfırla tarafından kullanılan illuminated-foam yolunu destekler, ancak F-028 bağımsız, kullanıcıya görünür bir bulgudur ve kendi kabul/regresyon/kapanış kanıtını gerektirir.
- **F-011 ve F-012 OPEN kalır.** Bunlar kalan A03 mimari bulgularıdır ve F-010'a sessizce katılmamıştır.
- Hiçbir bağımsız A04+ bulgusu bu düzeltmeyle kapatılmaz.

## CI ve birleştirme kanıtı

- uygulama PR: **#46 — Close F-010: centralize module state construction**
- son uygulama head: `3a9a289b478f6a9fc1e610c9f73c4c99d634ac37`
- PR CI: **#176 / run `33850183969` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success
- `ROG`'a `f45cbe55030e8bc4361d4e2ce2a4d6a6d86e0a89` olarak birleştirildi
- birleştirme sonrası `ROG` CI: **#177 / run `33852027783` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success

## Sonuç

F-010 depo kapanış kuralını karşılar: uygulama, hedefli regresyon, tam paket, derleme, PR CI, birleştirme ve birleştirme sonrası doğrulama tamamdır.

**F-010 is CLOSED.** A03, sıradaki **F-011** ve ardından **F-012** ile devam etmektedir.
