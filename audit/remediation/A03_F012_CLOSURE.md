# A03 F-012 kapanışı

Bulgu: **F-012 — Stand sahne-çevre kuralı kurulum ile renderer arasında kopyalanmış**

Durum: **CLOSED / POST-MERGE VERIFIED**

## Düzeltme

- `src/sceneDimensions.js` artık fiziksel sahne çevre kuralının `SCENE_SURROUND_M = 1` olarak kanonik sahibidir.
- `src/standSetup.js` `STAND_SURROUND_M` sahiplenmek yerine `SCENE_SURROUND_M` tüketir.
- `src/scene3d.js` `STAGE_SURROUND_M` sahiplenmek yerine aynı `SCENE_SURROUND_M` değerini tüketir.
- Tüm kurulum ve renderer çevre hesapları bu nedenle tek kaynaktan tek adlandırılmış değeri okur.
- Fiziksel değer tam olarak **1 metre** kalır. Hiçbir sahne ölçüsü, ızgara kapsamı, kamera çerçeveleme formülü, yerleşim aritmetiği veya ürün geometrisi kasıtlı olarak değiştirilmedi.
- `src/sceneDimensions.js` change-gate sahiplik haritasında sınıflandırılır; böylece gelecekteki değişiklikler etki incelemesinde kalır.

## Regresyon kanıtı

Hedefli kapsam şunları içerir:

- `test/sceneSurroundSingleSource.test.js` — tek kanonik çevre sabitini doğrular ve bağımsız kurulum/renderer sahipliğinin yeniden eklenmesine karşı korur.
- `test/standSetup.test.js` — değişmeyen 1 metre çevre ile stand kurulum sahne ölçü aritmetiğini korur.
- `e2e/smoke.spec.mjs` — Chromium sahne-oluşturma smoke'u, renderer import yolunun ve gerçek uygulama sahne kurulumunun yüklenip çalışmaya devam ettiğini doğrular.

Tam birim/entegrasyon paketi ve üretim derlemesi birleştirmeden önce ve sonra da geçti.

## Tam-sistem etki incelemesi

Kabul edilen F-012 change contract, schemaVersion 2 tam-sistem etki keşfi altında çalıştı. `scene3d.js`, kurulum, renderer ve mimari yüzeylerin geniş bağımlıları açıkça incelendi.

- F-010 ve F-011 kapalı kalır ve gerilemedi.
- F-013 ve tüm A04+ bulgular bağımsız kalır; bu düzeltme onları kapatmaz.
- Yeni kanonik dosya yalnızca sahipliği değiştirir. 1 metre fiziksel kuralı değiştirmez.

## CI ve birleştirme kanıtı

- uygulama PR: **#52 — Close F-012: centralize scene surround constant**
- son uygulama head: `5e4a29b414f5c6b46fa17cc36e2875bdd93b819f`
- PR CI: **#216 / run `33973111841` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success
- `ROG`'a `1ca9f6e386a6cbdb7377ce35bf22a26b75e4ba80` olarak birleştirildi
- birleştirme sonrası `ROG` CI: **#221 / run `33974468120` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success

## Sonuç

F-012 depo kapanış kuralını karşılar: uygulama, hedefli regresyon, tam paket, derleme, PR CI, birleştirme ve birleştirme sonrası doğrulama tamamdır.

**F-012 is CLOSED.** Son A03-sahipli bulguydu.
