# A03 F-011 kapanışı

Bulgu: **F-011 — Module-specific placement/interaction policy fragmented outside behavior contract**

Durum: **CLOSED / POST-MERGE VERIFIED**

## Düzeltme

- `src/moduleBehavior.js` artık modüle özel yerleşim/etkileşim politika seçiminin kanonik bildirimsel sahibidir.
- `src/modulePlacement.js` manyetik snap, mantıksal armatür uç noktaları, taban-duvar çarpışma derinliği, ince-duvar uç nokta teması, duvar-iç-yüz sınır davranışı, ilişkiye özel örtüşme, yan-ekleme dönüş stratejisi, duvar kapasitesi ve ilgili yerleşim politikası için davranış seçicilerini tüketir; özel modül-tipi kayıtları/seçicileri tutmaz.
- `src/scene3d.js` artık `freePanelSupportTypes` kaydının sahibi değildir; duvar-örtü destek seçimi `supportsWallOverlayMount(...)` üzerinden yönlenir, mevcut renderer/destek geometrisi değişmez.
- `src/main.js` artık üst-armatür çoğaltma yolunu `sourceModule.type === 'led-floodlight'` ile seçmez; mevcut 20 cm yan ofset, `zCm: 350`, clamp mantığı ve duvar-eksen geometrisini koruyarak `isTopPlacementModule(...)` üzerinden yönlendirir.
- F-011 öncesi kettle bildirimi `collision: 'none'` olarak kalır. Düzeltme, kettle/mini-fridge istifleme ilişkisini davranış politikası üzerinden bildirimsel ifade ederken önceden var olan runtime yerleşim çarpışma semantiğini korur.
- Geometrik algoritmalar yerleşim/render çekirdeğinde kalır; bu bulgu politika sahipliğini değiştirdi, ürün geometrisini veya amaçlanan etkileşim semantiğini değil.

## Regresyon kanıtı

Hedefli birim/entegrasyon kapsamı şunları içerir:

- `test/moduleBehaviorContract.test.js` — genişletilmiş kanonik davranış sözleşmesini korur.
- `test/moduleBehaviorPolicy.test.js` — F-011 politika seçicilerini, kettle uyumluluk sözleşmesini, özel yerleşim kayıtlarının kaldırılmasını, duvar-örtü yeteneğini ve `main.js` üst-armatür yönlendirme sınırını doğrular.
- `test/modulePlacement.test.js` ve `test/depotFreeDragSnap.test.js` — yerleşim/snap davranışını kanonik seçiciler üzerinden korur.
- `test/kettle.test.js` ve `test/miniFridge.test.js` — kettle bildirimini değiştirmeden mevcut kettle/fridge yerleşim ilişkisini korur.
- `test/baseModule.test.js`, `test/lCounterPlacement.test.js`, `test/indoorPlants.test.js`, `test/ledFloodlightModule.test.js` ve `test/tv42Module.test.js` — temsili özel-politika modül ailelerini korur.
- `test/illuminatedFoamModule.test.js` — duvar-örtü davranışını eski uygulama-konumu bağından değil kanonik politika API'si üzerinden doğrular.
- `e2e/f011-module-behavior.spec.mjs` — Chromium regresyonu temsili gerçek katalog serbest-yerleşim davranışını kapsar. Mini-fridge ızgara iddiası, birleştirilmiş 50×50×66 mini-fridge sözleşmesine uyan fiziksel taban izi kenarlarını doğrular.

## Tam-sistem etki incelemesi

Kabul edilen F-011 change contract, schemaVersion 2 tam-sistem etki keşfi altında çalıştı ve keşfedilen runtime/kod bağımlılarını, testleri, belgeler/sözleşmeler ve bağlı bulguları inceledi.

- **F-015 OPEN kalır.** Yan-ekleme zorunluluğu bağımsız bir bulgudur; F-011 yalnızca dokunduğu politika seçim yüzeylerini merkezileştirdi.
- **F-016 OPEN kalır.** Sağ-duvar 90°/270° yönelim çatışması bağımsız bir bulgu olarak kalır ve F-011 tarafından kapatılmadı.
- **F-012 OPEN kalır.** Kalan A03 mimari bulgusudur ve bölüm sırasındaki sonrakidir.
- Hiçbir A04+ bulgusu bu düzeltmeyle kapatılmaz.

## CI ve birleştirme kanıtı

- uygulama PR: **#49 — Close F-011: centralize module placement policy**
- son uygulama head: `c2bfcd4e1a173bcf463cff8e1e0c1e43378acf5b`
- PR CI: **#211 / run `33952651314` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success
- `ROG`'a `934ca39a19453e8660f9cdbae81ce000e91edae1` olarak birleştirildi
- birleştirme sonrası `ROG` CI: **#212 / run `33953247234` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success

## Sonuç

F-011 depo kapanış kuralını karşılar: uygulama, hedefli regresyon, tam paket, derleme, PR CI, birleştirme ve birleştirme sonrası doğrulama tamamdır.

**F-011 is CLOSED.** A03, sıradaki **F-012** ile devam etmektedir.
