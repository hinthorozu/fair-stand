# Fair Stand — Global Product Invariants

Bu dosya yalnızca **ürün genelinde geçerli, modül tipinden bağımsız invariant'ları** tanımlar.

Modül tipine göre değişen rotation, move snap, placement, collision, side-insert ve ghost davranışları burada tekrar edilmez. Bu davranışların canonical runtime kaynağı `src/moduleBehavior.js`, sözleşme dokümanı ise `MODULE_BEHAVIOR_STANDARD.md` dosyasıdır.

## 1. Koordinat sistemi

- Proje mantığında **X/Y zemin düzlemi, Z yükseklik** olarak kabul edilir.
- Plan dönüşü logical Z ekseni etrafında yapılır.
- Modüller dikey eksenlerini korur.

## 2. Tek placement altyapısı

- Perimeter, iç alan, depo, bölücü, L/T/U bağlantıları için gereksiz ayrı placement motorları oluşturulmaz.
- `wallId` yerleşim metadata'sıdır; ürün seviyesinde ayrı bir “iç modül / dış modül” sınıfı yaratmaz.
- Stand tipi başlangıç duvar düzenini, aktif kenarları ve izin verilen bölgeleri belirler; placement doğrulaması ortak core altyapı üzerinden yürür.
- Module-specific farklar dağınık type check'ler yerine davranış registry'si ve ilgili core contract'lar üzerinden tanımlanmalıdır.

## 3. Silme davranışı

- Bir modül silindiğinde oluşan boşluk **korunur**.
- Silme sonrasında komşu modüller otomatik olarak sıkıştırılmaz veya yeniden dizilmez.
- Kullanıcı açıkça istemedikçe auto-compaction yapılmaz.

## 4. Nominal ölçü ile üretim ölçüsü ayrımı

- Katalogdaki nominal ölçüler placement ve ürün kimliği içindir.
- 3D geometri ölçüsü, placement footprint'i ve üretim/BOM kesim ölçüsü aynı kavram olmak zorunda değildir.
- Üretim ölçüleri ve adetleri recipe / production-parts tarafının sorumluluğundadır.
- Bir modülün fiziksel çıkıntısı ile connect/snap omurgası gerektiğinde bilinçli olarak farklı olabilir.

## 5. Source of truth sınırları

- Module-type editor davranışları: `src/moduleBehavior.js`
- Placement, snap, collision ve bağlantı algoritmaları: ilgili placement/core dosyaları ve regresyon testleri
- Katalog kimliği ve nominal ölçüler: `src/catalog.js`
- Runtime state construction: `src/designState.js`
- BOM / üretim verileri: recipe ve production-parts katmanı
- Mimari sınırlar: `ARCHITECTURE_RULES.md`
- Universal impact domain registry: `src/systemChangeContract.js > SYSTEM_IMPACT_DOMAINS`
- Browser E2E trigger registry: `src/systemChangeContract.js > SYSTEM_BROWSER_E2E_DOMAINS`
- Full-system change dependency/test/finding taraması: `SYSTEM_IMPACT_SWEEP.md`
- Real-browser regression: `e2e/` + `playwright.config.mjs`

Aynı runtime davranışı birden fazla Markdown dosyasında sabit değer olarak tekrar edilmemelidir.

## 6. Değişiklik politikası

Core veya browser-visible davranış değişikliği yapılırken:

1. Değişiklik `SYSTEM_CHANGE_GATE.md` üzerinden sınıflandırılır ve `SYSTEM_IMPACT_DOMAINS` registry'sindeki bütün domainler değerlendirilir.
2. `SYSTEM_IMPACT_SWEEP.md` uyarınca değişen dosya/symbol/UI/asset yüzeyinin callers, reverse/transitive dependents, existing unit/integration/E2E tests, docs/contracts ve candidate findings etkisi çıkarılır.
3. Gerçek source-of-truth dosyası değiştirilir.
4. Discovery tarafından bulunan mevcut testler yeni canonical davranış/ownership açısından gözden geçirilir; eski implementation detail'e kilitli assertion bırakılmaz.
5. İlgili targeted unit/integration regression testi eklenir veya güncellenir.
6. `SYSTEM_BROWSER_E2E_DOMAINS` registry'sindeki bir domain etkileniyorsa değişikliğe özel targeted Playwright E2E aynı PR içinde eklenir/güncellenir.
7. Davranışı açıklayan canonical doküman etkileniyorsa güncellenir.
8. `npm run contract:verify` full-system impact acknowledgement ve E2E declaration dahil başarılı olmalıdır.
9. `npm test`, `npm run build` ve canonical `npm run e2e` başarılı olmadan değişiklik tamamlanmış sayılmaz.
10. PR CI ve post-merge ROG CI tamamen yeşil olmadan finding/iş kapatılmaz.

Yeni bir modül eklemek mevcut global kuralları veya core placement sözleşmesini otomatik olarak değiştirme gerekçesi değildir.
