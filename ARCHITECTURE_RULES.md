# Fair Stand — Architecture Contracts

Bu doküman sistemin **mimari sınırlarını ve source-of-truth dağılımını** açıklar. Module type'a göre değişen sayısal runtime davranışlarını kopyalamaz; bunlar ilgili kod ve testlerden okunur.

## 1. Canonical kaynaklar

- `src/moduleBehavior.js` — module-type editor davranışları: placement mode, move snap, rotation step, default rotation, side insert, collision strategy ve ghost behavior.
- Placement/core dosyaları — koordinat doğrulaması, duvar snap'i, komşu snap'i, collision, connection ve reflow algoritmaları.
- `src/catalog.js` — katalog kimliği, kullanıcıya sunulan nominal ölçüler ve katalog metadata'sı.
- State factory dosyaları — runtime module state yapıları ve editable surface state'leri.
- Recipe / production-parts katmanı — BOM, üretim adetleri ve gerçek kesim/parça ölçüleri.
- Regresyon testleri — bu contract'ların uygulanmaya devam ettiğini doğrular.

Bir davranış için canonical kaynak mevcutsa aynı sabit değeri birden fazla Markdown dokümanında tekrar etmekten kaçınılır.

---

## 2. Koordinat modeli

- X/Y zemin düzlemidir.
- Z yüksekliktir.
- Modül plan dönüşü Z ekseni etrafında yapılır.
- Stand sınırları ve placement doğrulaması aynı koordinat modelini kullanır.

Dönüş adımı ve hareket grid'i global sabit değildir; module behavior contract'ından gelir.

---

## 3. Placement katmanı

Placement sistemi tek bir ortak core üzerine kuruludur. Stand tipi yalnız izin verilen başlangıç duvarlarını ve sınırları belirler; module type farkları behavior contract'ı üzerinden ifade edilir.

Desteklenen placement kavramları arasında duvar, serbest zemin, duvar üstü overlay ve üst aksesuar davranışları bulunabilir. Hangi module type'ın hangisini kullandığı `src/moduleBehavior.js` tarafından belirlenir.

`wallId` bir placement metadata'sıdır; ayrı ürün sınıfı değildir.

---

## 4. Behavior registry contract'ı

Module-specific editor davranışları dağınık `if (module.type === ...)` kontrolleri halinde çoğaltılmamalıdır.

Aşağıdaki kararlar mümkün olduğunca behavior registry üzerinden verilmelidir:

- placement mode,
- movement snap,
- rotation step,
- default rotation,
- side insertion capability,
- collision strategy,
- ghost strategy.

Detaylı sözleşme `MODULE_BEHAVIOR_STANDARD.md` dosyasındadır.

---

## 5. Placement ölçüsü, fiziksel geometri ve BOM ayrımı

Aynı modül için üç farklı ölçü katmanı bulunabilir:

1. **Nominal catalog/placement ölçüsü** — kullanıcıya sunulan ürün ölçüsü ve placement kimliği.
2. **Fiziksel geometri / footprint** — collision ve 3D gövde için gereken gerçek fiziksel alan.
3. **Production/BOM ölçüsü** — üretilecek panel, profil, tabla ve diğer parçaların gerçek ölçüleri.

Bu üç kavram bilinçli olarak farklı olabilir. Birinin değiştirilmesi diğerlerini otomatik olarak değiştirmemelidir.

Panel Bazalı gibi modüllerde fiziksel çıkıntı ile connect/snap omurgasının farklı olması bu ayrımın geçerli bir örneğidir.

---

## 6. Connection ve collision katmanı

Connection ve collision algoritmaları placement core'un sorumluluğundadır.

Sistem gerektiğinde:

- end-to-end,
- corner/L,
- tee/T,
- footprint collision,
- segment collision,
- collision bypass

gibi farklı stratejiler kullanabilir.

Hangi modülün hangi collision stratejisini kullandığı behavior contract'ından gelir; geometrik doğrulama ise placement core tarafından yapılır.

---

## 7. State ve renderer sınırı

State, ürünün kalıcı/editable durumunu taşır. Renderer state'i görselleştirir; kalıcı ürün kuralının tek sahibi olmamalıdır.

Yeni bir module type eklenirken mümkün olduğunca şu sorumluluklar ayrık tutulur:

- catalog descriptor,
- state factory,
- module behavior,
- renderer,
- recipe/BOM,
- regression tests.

Renderer içinde yalnız görselleştirme için gerekli module-specific routing bulunmalıdır; placement kuralı renderer'a taşınmamalıdır.

---

## 8. Test contract'ı

Core davranış değişiklikleri regresyon testi olmadan tamamlanmış sayılmaz.

Özellikle şu sınıflar testlerle korunmalıdır:

- placement sınırları,
- rotation behavior,
- movement snap,
- connection davranışı,
- collision stratejileri,
- catalog/state uyumu,
- recipe/BOM sözleşmeleri,
- module-specific behavior overrides.

Yeni module type eklenirken behavior contract'ının da aynı değişiklik içinde doğrulanması gerekir.

---

## 9. Değişiklik politikası

Core davranış değiştirileceğinde sıra:

1. İlgili canonical kod kaynağı değiştirilir.
2. Regresyon testi eklenir veya güncellenir.
3. Bu değişiklik mimari sınırı etkiliyorsa ilgili canonical doküman güncellenir.
4. `npm test` ve `npm run build` başarılı olmalıdır.

Dokümanlar runtime davranışının bağımsız ikinci implementasyonu haline gelmemelidir.
