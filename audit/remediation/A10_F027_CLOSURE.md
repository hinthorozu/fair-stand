# A10 F-027 kapanışı

Bulgu: **F-027 — “Duvarı temizle” deletes all modules beyond label/confirmation scope**

Durum: **CLOSED / POST-MERGE VERIFIED**

## Kök neden

Eski `Duvarı temizle` eylemi yalnızca-duvar yıkıcı bir işlem olarak sunuluyordu, ancak uygulaması tüm `currentModules` sahne durumunu temizliyordu. Bu kapsam duvarın dışındaki modülleri de içerdiğinden, kullanıcıya görünen etiket ve eylem semantiği gerçek yıkıcı etkiyle örtüşmüyordu.

## Düzeltme

Uygulama PR **#77 — Fix F-027: reset scene from current setup controls** eski yalnızca-duvar ifadesini ve davranışını açık bir sahne sıfırlama akışıyla değiştirdi:

- denetim artık **`Sahneyi Sıfırla`** olarak etiketlenir,
- sıfırlama güncel görünen stand kurulum denetimlerini okur,
- Stand Tipi, X, Y, Zemin, Depo, Depo ölçüsü ve Depo içeriği yeniden inşa girdileri olarak kullanılır,
- sahne yeniden inşası `Sahneyi Oluştur` tarafından kullanılan aynı sahne-kurma yolunu kullanır,
- sıfırlama bir proje oluşturmaz veya yeniden açmaz,
- güncel proje kimliği ve görüntü kütüphanesi korunur,
- önceki belirsiz `currentModules = []` duvar-temizleme eylemi artık yalnızca-duvar işlemi olarak sunulmaz.

F-027 tarafından hiçbir katalog ölçüsü, kanonik modül varsayılanı, yerleşim aritmetiği, BOM politikası, proje şeması veya içe/dışa aktarma formatı kasıtlı olarak değiştirilmedi.

## Regresyon kanıtı

Düzeltme için eklenen hedefli kapsam:

- `test/f027SceneReset.test.js` — sıfırlama etiketi ve paylaşılan sahne-yeniden-kurma yolu için kaynak/entegrasyon sözleşmesi,
- `e2e/f027-scene-reset.spec.mjs` — Chromium kapsamı, görünen kurulum denetimlerinden sıfırlamayı ve oluşan kalıcı proje durumunu doğrular,
- `e2e/f010-module-construction.spec.mjs` kurulumu artık kaldırılmış eski duvar-temizleme semantiğine bağlı olmayacak şekilde güncellendi.

Tam test paketi, üretim derlemesi ve Chromium E2E paketi son PR head'de ve `ROG`'a birleştirmeden sonra yeniden geçti.

## CI ve birleştirme kanıtı

- uygulama PR: **#77 — Fix F-027: reset scene from current setup controls**
- son uygulama head: `d173e1ee63396aebc1f3f5ee0925bdb5ba76f328`
- son PR CI: **run #330 / `33999387201` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success
- `ROG`'a `3b4d85437be3af59c78ad5f11344a24d4caa3911` olarak birleştirildi
- birleştirme sonrası `ROG` CI: **run #331 / `33999469471` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: success
  - build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success

## Sonuç

F-027 depo kapanış kuralını karşılar: uygulama, hedefli regresyon, tam paket, derleme, PR CI, birleştirme ve birleştirme sonrası doğrulama tamamdır.

**F-027 is CLOSED.**

A10, F-025, F-026 ve F-028 açık UI bulguları olarak kaldığı için daha geniş bir `GAP` bölümü olarak kalır.
