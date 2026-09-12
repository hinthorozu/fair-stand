# A10 F-028 kapanışı

Bulgu: **F-028 — “Tüm Özellikleri Kaldır” `illuminated-foam` varken başarısız olabilir**

Durum: **CLOSED / POST-MERGE VERIFIED / USER VERIFIED**

## Kök neden

Küresel `Tüm Özellikleri Kaldır` akışı daha önce her sahne modülünü normal sıfırlama yolu üzerinden yeniden oluşturulması gereken bir modül olarak işliyordu. `illuminated-foam` özel bir runtime ailesidir; bu da işlemi, amaçlanan yıkıcı sıfırlama semantiğiyle örtüşmeyen davranışın başarısız olmasına veya kalmasına açık hale getiriyordu.

## Düzeltme

Uygulama PR **#81 — fix: remove illuminated foam during feature reset** amaçlanan davranışı açıkça tanımlar:

- `Tüm Özellikleri Kaldır` sırasında her `illuminated-foam` modülü sahneden kaldırılır,
- kalan tüm modüller mevcut kanonik inşa/sıfırlama yolu üzerinden sıfırlanır,
- kalan modüller için mevcut yerleşim korunur,
- bilinmeyen modül aileleri mevcut kapalı-düşme davranışını korur,
- onay metni Işıklı Strafor'un kaldırılacağını açıkça belirtir,
- seçili illuminated-foam UI durumu tutarlı biçimde temizlenir.

F-028 tarafından hiçbir katalog ölçüsü, modül varsayılan ölçüsü, yerleşim aritmetiği, proje şeması, IndexedDB şeması, BOM politikası veya içe/dışa aktarma formatı kasıtlı olarak değiştirilmedi.

## Regresyon kanıtı

Düzeltme için eklenen hedefli kapsam:

- `test/f028FeatureReset.test.js` — sıfırlama politikasının `illuminated-foam`'u kaldırdığını ve kalan modülleri sıfırladığını doğrular,
- `e2e/f028-reset-features.spec.mjs` — Chromium kapsamı, gerçek tarayıcı akışının illuminated foam'u kaldırdığını, kalan modül düzenini koruduğunu ve oluşan proje durumunu kalıcılaştırdığını doğrular.

Son uygulama PR'ı tam sözleşme gate'ini, tüm **492/492** birim/entegrasyon testini, üretim derlemesini ve Chromium E2E paketini geçti.

## CI ve birleştirme kanıtı

- uygulama PR: **#81 — fix: remove illuminated foam during feature reset**
- son uygulama head: `1f5d615a0c7c8f6bcdd827c5cb660fffc1667c7e`
- son PR CI: **run #340 / `34000562593` / completed / success**
  - change contract gate: success
  - full unit/integration test suite: 492/492 success
  - production build: success
  - Playwright runner + Chromium install: success
  - Chromium E2E: success
- `ROG`'a `5b6022172a188996b213d69dc9ebefd4d49cf99d` olarak birleştirildi
- birleştirme sonrası `ROG` CI: **run #341 / `34000668828` / completed / success**
  - full canonical CI chain: success
- birleştirme sonrası manuel ürün doğrulaması: **kullanıcı tarafından onaylandı**; `Tüm Özellikleri Kaldır` test edilen uygulama akışında amaçlandığı gibi davrandı.

## Sonuç

F-028 depo kapanış kuralını karşılar: uygulama, hedefli regresyon, tam paket, derleme, PR CI, birleştirme, birleştirme sonrası CI doğrulaması ve manuel kullanıcı doğrulaması tamamdır.

**F-028 is CLOSED.**

A10, F-025 ve F-026 açık UI bulguları olarak kaldığı için daha geniş bir `GAP` bölümü olarak kalır.
