# Fair Stand — System Development Contract

> **Bu belge module / feature / core implementasyon sözleşmesidir.**
>
> Her değişiklik bundan **önce** `SYSTEM_CHANGE_GATE.md` üzerinden universal impact classification alır ve `.github/change-contract.json` içinde machine-readable olarak beyan edilir.
>
> Amaç: İnsan veya AI tarafından sisteme yeni modül, modül varyantı, otomasyon veya davranış eklenirken eksik sorumluluk bırakılmasını engellemek.
>
> Kod yazmaya başlamadan önce universal impact declaration ve ilgili domain contract kararları tanımlanır. Bunlar tanımlanmadan uygulama tamamlanmış sayılmaz.

---

# 1. Bu contract neden var?

Fair Stand'da bir değişiklik yalnızca tek bir dosya veya 3D obje değildir. Bir modül veya feature aynı anda şu alanları etkileyebilir:

- katalog kimliği,
- state,
- placement,
- hareket,
- rotation,
- collision,
- seçim / interaction,
- renk ve görsel yetenekleri,
- renderer / GLB / procedural geometri,
- save / load,
- runtime davranışı,
- BOM / üretim / ticari liste,
- başka modülleri otomatik oluşturma,
- testler.

Bu nedenle "modeli sahneye ekledim" bir feature'ın tamamlandığı anlamına gelmez.

Universal `SYSTEM_CHANGE_GATE.md` bu değişikliğin hangi sistem domainlerini etkilediğini sorar; bu belge ise module/feature/core katmanında o etkilerin nasıl uygulanacağını tanımlar.

---

# 2. Canonical source-of-truth dağılımı

Bu belge runtime değerlerinin ikinci kopyası değildir. Hangi kararın nerede tutulacağı aşağıdaki gibidir:

| Konu | Canonical kaynak |
|---|---|
| Universal değişiklik impact sınıflandırması | `SYSTEM_CHANGE_GATE.md` + `.github/change-contract.json` |
| Global ürün invariantları | `PROJECT_RULES.md` |
| Mimari sınırlar | `ARCHITECTURE_RULES.md` |
| Katalog kimliği / nominal descriptor | `src/catalog.js` |
| Modül contract profile ve politika ataması | `src/moduleContracts.js` |
| Feature / composition contract | `src/featureContracts.js` |
| Placement / move snap / rotation step / collision / ghost | `src/moduleBehavior.js` + placement core |
| Runtime module state | `src/designState.js` ve ilgili state factory |
| Üretim reçetesi | `src/moduleRecipes.js` |
| Üretim parçası | `src/productionParts.js` |
| Otomatik depo planı | `src/autoDepot.js` |
| Regresyon doğrulaması | `test/` ve mevcut legacy `tests/` |

**Kural:** Bir runtime değeri canonical kod kaynağında varsa Markdown içine ikinci sabit kaynak olarak kopyalanmaz.

---

# 3. Değişiklik önce sınıflandırılır

İki aşamalı sınıflandırma zorunludur:

1. **Universal:** `SYSTEM_CHANGE_GATE.md` içindeki 17 domain için `affected` / `not-applicable` kararı verilir ve `.github/change-contract.json` güncellenir.
2. **Domain:** Aşağıdaki module / variant / runtime-module / feature-composition / core-change sınıflarından uygun olanı seçilir.

## A. Yeni katalog modülü

Örnek:

- çöp kovası,
- yeni TV,
- yeni saksı,
- yeni mobilya.

Bu iş için `MODULE_CATALOG` + module contract zorunludur.

## B. Mevcut modül varyantı

Örnek:

- aynı modül ailesinin yeni varyantı,
- aynı modül ailesinin farklı nominal ölçüsü.

Mevcut profile gerçekten uyuyorsa inheritance kullanılabilir. Uymuyorsa override veya yeni profile tanımlanır.

## C. Katalog dışı runtime modülü

Örnek: mevcut `illuminated-foam`.

Katalogda görünmese bile module contract zorunludur. Bu tür contract'lar `NON_CATALOG_MODULE_CONTRACTS` içinde açıkça tanımlanır.

## D. Feature / scene composition

Örnek:

- sahne oluşturulurken otomatik depo oluşturmak,
- deponun içine belirli ekipmanları otomatik yerleştirmek,
- tek komutla birden fazla modül üretmek.

Bu işler `src/featureContracts.js` içinde feature contract taşır.

## E. Core davranış değişikliği

Örnek:

- yeni rotation modeli,
- yeni collision stratejisi,
- yeni placement modu.

Önce mevcut core contract'ın bunu ifade edip edemediği kontrol edilir. Edemiyorsa core contract genişletilir; tek bir modüle özel dağınık `if` ile başlanmaz.

---

# 4. Her modül contract'ında cevaplanması gereken sorular

Bir modül için aşağıdaki başlıkların hiçbiri sessizce atlanamaz.

## 4.1 Identity

- Catalog key nedir?
- Runtime `type` nedir?
- Mevcut bir modül ailesinin varyantı mı?

## 4.2 Profile / inheritance

- Hangi module contract profile'ını kullanıyor?
- Hangi davranışları profile'dan alıyor?
- Hangi alanları neden override ediyor?

Inheritance gizli değildir. `src/moduleContracts.js` içinde profile ataması açık olmak zorundadır.

## 4.3 State

- State factory nerede?
- Kalıcı hangi alanlar tutulur?
- Derived/runtime-only hangi alanlar tutulmaz?

## 4.4 Placement / movement / rotation / collision

Bu sayısal ve geometrik davranışların canonical sahibi `src/moduleBehavior.js` ve placement core'dur.

Contract çözülürken gerçek behavior buradan okunur.

Sorular:

- wall / free / wall-overlay / top?
- move snap nedir?
- rotation step nedir?
- default rotation nedir?
- rotation sınırlı mı?
- yalnız saat yönü gibi özel bir kural var mı?
- collision stratejisi nedir?
- side insert var mı?
- ghost nasıl davranır?

Mevcut behavior modeli ihtiyacı ifade edemiyorsa önce behavior contract genişletilir.

## 4.5 Appearance

Açıkça belirtilir:

- renk editable mı?
- görsel editable mı?
- fixed mi?
- renderer tarafından mı yönetiliyor?
- birden fazla editable surface var mı?

Yeni modül mevcut bir profile'dan appearance miras alıyorsa bunun doğru olduğu doğrulanmalıdır.

## 4.6 Renderer

- procedural mı?
- GLB/model mi?
- specialized renderer mı?
- asset dosyası nedir?
- renderer state'ten hangi bilgiyi okur?

Renderer ürün kuralının tek sahibi haline getirilmez.

## 4.7 Persistence

- Proje kaydına girer mi?
- Save/load round-trip sonrası aynı davranış devam eder mi?
- Runtime-derived alanlar yanlışlıkla kalıcılaştırılıyor mu?

## 4.8 BOM policy

Her modül açıkça şu politikalardan birine sahip olmalıdır:

- `recipe` — `moduleRecipes.js` üzerinden üretim reçetesi vardır.
- `commercial-item` — Final BOM'a tek/alınan ticari ürün olarak girecektir; canonical ürün/parça kimliği tanımlanmalıdır.
- `excluded` — BOM'a bilinçli olarak girmez; neden açıkça yazılmalıdır.

Mevcut eski modüllerde görülen `decision-required`, **bilinen bir policy boşluğunu görünür kılmak içindir**. Yeni production-ready modül bu durumla tamamlanamaz.

`decision-required` = "BOM'u yok say" anlamına gelmez.

## 4.9 Runtime behavior

- static mi?
- zamana bağlı mı?
- timer / clock / animation var mı?
- update interval nedir?
- browser/local time gibi dış runtime kaynağı kullanıyor mu?

Runtime-derived değer ile persisted state ayrılmalıdır.

## 4.10 Composition / dependencies

- Tek başına mı oluşturulur?
- Başka modülleri otomatik oluşturur mu?
- Başka modüle bağımlı mı?
- Parent/child ilişkisi var mı?

Birden fazla modülün birlikte oluşturulma kuralı renderer içine gömülmez; feature/composition contract ile tanımlanır.

## 4.11 Tests

Her modül/feature için en az:

- contract coverage,
- değişen davranışın targeted regression testi,
- full `npm test`,
- `npm run build`

zorunludur.

Save/load etkileniyorsa persistence round-trip; BOM etkileniyorsa recipe/BOM contract testi ayrıca zorunludur.

---

# 5. Mevcut enforced module gate

`src/moduleContracts.js` şu anda iki katman kullanır:

1. `MODULE_CONTRACT_PROFILES` — ortak policy/inheritance profilleri.
2. `MODULE_CONTRACT_ASSIGNMENTS` — **her katalog anahtarının** hangi profile ve BOM politikasına bağlı olduğunu açıkça yazar.

`test/systemDevelopmentContract.test.js` şunları zorlar:

- `MODULE_CATALOG_KEYS` içindeki her katalog öğesinin explicit contract ataması olmalı.
- Silinmiş katalog anahtarına bağlı stale contract kalmamalı.
- State, appearance, renderer, runtime, composition, BOM, tests ve behavior bölümleri resolve olmalı.
- `bom.mode = recipe` diyen her katalog modülü için gerçek `moduleRecipes.js` reçetesi resolve olmalı.
- Katalog dışı mevcut runtime modülü `illuminated-foam` explicit contract taşımalı.

Böylece yeni bir katalog anahtarı eklenip contract unutulursa CI kırılır.

Bu module gate, universal system change gate'in yerine geçmez; onun altında domain-specific enforcement katmanıdır.

---

# 6. Feature / composition gate

Bir işlem tek bir modül davranışından fazlasını yönetiyorsa `src/featureContracts.js` kullanılır.

İlk canonical feature contract:

`automatic-depot`

Bu contract şu bilgileri açıkça tanımlar:

- owner: `src/autoDepot.js`
- feature türü: `scene-composition`
- içerik toggle'ı: `includeContents`
- structural outputs: wall + door
- depo içerikleri:
  - mini-fridge
  - kettle
  - coat-rack
- regression kaynağı: `tests/autoDepot.test.js`

Contract testi, `autoDepot.js` tarafından gerçekten üretilen içeriklerle bu listeyi karşılaştırır. Kod ile iş kuralı drift ederse test kırılır.

---

# 7. Örnek — Çöp kovası

Kullanıcı:

> Sisteme çöp kovası ekle. Çöp kovası yalnız belirli bir açı aralığında tek yönde dönebilsin.

Uygulama sırası:

1. Önce universal change impact declaration hazırlanır.
2. Yeni katalog kimliği belirlenir.
3. Module contract profile seçilir.
4. State / appearance / renderer / persistence / BOM policy belirlenir.
5. Mevcut `moduleBehavior.js` gerekli bounded/directional rotation contract'ını destekliyor mu kontrol edilir.
6. Desteklemiyorsa önce behavior modeli genişletilir.
7. Rotation kuralı yalnız renderer veya keydown handler içinde özel `if` olarak yazılmaz.
8. Sınırları doğrulayan targeted regression testi eklenir.
9. BOM politikası karar verilmeden production-ready sayılmaz.

---

# 8. Örnek — Canlı duvar saati

Kullanıcı:

> Duvar saati ekle, gerçek saati canlı göstersin.

Bu yalnız model ekleme işi değildir.

Contract kararları:

- placement: wall-overlay,
- runtime: dynamic clock,
- source: local/browser time,
- update interval: açıkça tanımlı,
- persisted state: saat config'i,
- persisted olmayan değer: o anki saat/dakika/saniye,
- renderer: specialized clock renderer,
- BOM: explicit policy.

**Kural:** Anlık saat değeri proje state'ine kaydedilmez. O değer runtime'da yeniden hesaplanır.

---

# 9. Örnek — Otomatik depo

Kullanıcı:

> Sahne oluşturulurken depo ekle, içine depo malzemelerini koy.

Bu tek bir module contract değildir; scene-composition contract'tır.

Bugünkü canonical depo içeriği `automatic-depot` contract'ında tanımlıdır.

İleride içerik değişirse yalnız renderer içine obje eklenmez.

Gerekli sıra:

1. Universal change declaration'da composition ve etkilenen diğer domainler beyan edilir.
2. `automatic-depot` feature contract güncellenir.
3. `autoDepot.js` planner güncellenir.
4. Contract/regression testleri güncellenir.
5. Full test + build yapılır.

---

# 10. Yeni iş için zorunlu çalışma sırası

İnsan veya AI aşağıdaki sırayı izler:

1. Fresh `ROG` üzerinden branch oluştur.
2. `SYSTEM_CHANGE_GATE.md` oku.
3. Değişikliğin tüm 17 impact domainini `affected` / `not-applicable` olarak sınıflandır.
4. `.github/change-contract.json` deklarasyonunu değişiklikle birlikte güncelle.
5. Bu `SYSTEM_DEVELOPMENT_CONTRACT.md` belgesini oku ve işin module / variant / runtime-module / feature-composition / core-change sınıfını belirle.
6. Etkilenen canonical kaynakları kontrol et.
7. Contract/profile/policy kararlarını ver.
8. Contract registry'yi ekle veya güncelle.
9. Gerekliyse behavior/core contract'ı genişlet.
10. State / renderer / persistence / BOM / composition uygulamalarından etkilenenleri uygula.
11. Contract testlerini ve değişen davranışın targeted regression testlerini yaz/güncelle.
12. `npm run contract:verify` çalıştır; local diff enforcement koşullarının F-009 kapsamında ayrıca takip edildiğini unutma.
13. `npm test` çalıştır.
14. `npm run build` çalıştır.
15. PR aç; canonical CI'nın `contract:verify → npm ci → npm test → npm run build` zinciri yeşil olmalı.
16. Merge sonrası ROG push CI yeşil olmadan finding/iş tamamlandı sayılmaz.

---

# 11. Yasaklanan geliştirme kalıpları

Aşağıdakiler contract ihlalidir:

- Universal change impact declaration yapmadan guarded sistem değişikliği tamamlamak.
- Etkilenen domaini gerçeğe aykırı `not-applicable` işaretlemek.
- Catalog'a yeni modül ekleyip module contract eklememek.
- Yeni modülü varsayılan behavior'a sessizce bırakmak.
- Rotation / collision / snap gibi core davranışları yalnız `main.js` veya `scene3d.js` içinde type-specific `if` ile çözmek.
- Renk/görsel kabiliyetini state contract'ından bağımsız renderer hilesiyle eklemek.
- BOM kararını sessizce atlamak.
- Runtime-derived değeri gereksiz yere project state'e kaydetmek.
- Multi-module automation kuralını yalnız UI callback içine gömmek.
- Targeted regression olmadan core davranış değişikliği tamamlamak.
- PR CI ve post-merge ROG CI doğrulanmadan işi kapalı saymak.

---

# 12. Bu yapının sonraki genişleme noktaları

Bu contract mevcut mimarinin üzerine kontrollü genişleme için tasarlanmıştır.

Sonraki genişlemeler ilgili finding/roadmap kararlarıyla yapılır:

- richer behavior schema,
- commercial-item BOM contract'ının production part / CRM kimliğiyle bağlanması,
- renderer capability registry,
- persistence schema/version contract,
- feature contract coverage'ının diğer scene automation'lara genişletilmesi,
- contract'lardan otomatik sistem kataloğu/dokümantasyon üretimi.

Bu genişlemeler yapılırken mevcut source-of-truth sahipliği korunur; contract registry runtime davranışının ikinci implementasyonu haline getirilmez.
