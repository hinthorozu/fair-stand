# Fair Stand — System Development Contract

> **Bu belge geliştirmeye başlamadan önce okunması gereken canonical iş sözleşmesidir.**
>
> Amaç: İnsan veya AI tarafından sisteme yeni modül, modül varyantı, otomasyon veya davranış eklenirken eksik sorumluluk bırakılmasını engellemek.
>
> Kod yazmaya başlamadan önce değişikliğin contract'ı tanımlanır. Contract tanımlanmadan uygulama tamamlanmış sayılmaz.

---

# 1. Bu contract neden var?

Fair Stand'da bir modül yalnızca 3D obje değildir. Bir modül veya feature aynı anda şu alanları etkileyebilir:

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

---

# 2. Canonical source-of-truth dağılımı

Bu belge runtime değerlerinin ikinci kopyası değildir. Hangi kararın nerede tutulacağı aşağıdaki gibidir:

| Konu | Canonical kaynak |
|---|---|
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

Kod yazmadan önce iş aşağıdaki sınıflardan birine konur.

## A. Yeni katalog modülü

Örnek:

- çöp kovası,
- yeni TV,
- yeni saksı,
- yeni mobilya.

Bu iş için `MODULE_CATALOG` + module contract zorunludur.

## B. Mevcut modül varyantı

Örnek:

- aynı saksının 100 / 150 / 200 cm varyantı,
- aynı modül ailesinin farklı ölçüsü.

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
- değişen davranışın regression testi,
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

> Sisteme çöp kovası ekle. Çöp kovası yalnız 0° ile 210° arasında saat yönüne dönebilsin.

Uygulama sırası:

1. Yeni katalog kimliği belirlenir.
2. Module contract profile seçilir.
3. State / appearance / renderer / persistence / BOM policy belirlenir.
4. Mevcut `moduleBehavior.js` bounded + clockwise-only rotation contract'ını destekliyor mu kontrol edilir.
5. Desteklemiyorsa önce behavior modeli genişletilir.
6. Rotation kuralı yalnız renderer veya keydown handler içinde özel `if` olarak yazılmaz.
7. 0° altına ve 210° üstüne çıkılmadığını doğrulayan regression testi eklenir.
8. BOM politikası karar verilmeden production-ready sayılmaz.

Örnek hedef policy:

```text
catalogKey: ACCESSORY_TRASH_BIN
profile: free-model-fixed
behavior: free + bounded-clockwise rotation 0..210
appearance: fixed veya kararlaştırılan editable policy
persistence: project-state
bom: commercial-item / recipe / excluded -> karar zorunlu
runtime: static
composition: standalone
```

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

**Kural:** "Şu an saat 14:32" proje state'ine kaydedilmez. O değer runtime'da yeniden hesaplanır.

---

# 9. Örnek — Otomatik depo

Kullanıcı:

> Sahne oluşturulurken depo ekle, içine depo malzemelerini koy.

Bu tek bir module contract değildir; scene-composition contract'tır.

Bugünkü canonical depo içeriği `automatic-depot` contract'ında:

- mini-fridge,
- kettle,
- coat-rack.

İleride "çöp kovası da koy" denirse yalnız renderer içine obje eklenmez.

Gerekli sıra:

1. `automatic-depot` feature contract güncellenir.
2. `autoDepot.js` planner güncellenir.
3. Contract/regression testleri güncellenir.
4. Full test + build yapılır.

---

# 10. Yeni iş için zorunlu çalışma sırası

İnsan veya AI aşağıdaki sırayı izler:

1. `SYSTEM_DEVELOPMENT_CONTRACT.md` oku.
2. İşin module / variant / runtime-module / feature-composition / core-change sınıfını belirle.
3. Etkilenen mevcut canonical kaynakları kontrol et.
4. Contract/profile/policy kararlarını ver.
5. Contract registry'yi ekle veya güncelle.
6. Gerekliyse behavior/core contract'ı genişlet.
7. State'i uygula.
8. Renderer'ı uygula.
9. Persistence etkisini uygula.
10. BOM politikasını uygula veya açık policy kararını kaydet.
11. Feature/composition varsa ilgili feature contract'ı güncelle.
12. Contract testlerini yaz/güncelle.
13. Davranış regression testlerini yaz/güncelle.
14. `npm test`.
15. `npm run build`.
16. CI yeşil olmadan tamamlandı deme.

---

# 11. Yasaklanan geliştirme kalıpları

Aşağıdakiler contract ihlalidir:

- Catalog'a yeni modül ekleyip module contract eklememek.
- Yeni modülü varsayılan behavior'a sessizce bırakmak.
- Rotation / collision / snap gibi core davranışları yalnız `main.js` veya `scene3d.js` içinde type-specific `if` ile çözmek.
- Renk/görsel kabiliyetini state contract'ından bağımsız renderer hilesiyle eklemek.
- BOM kararını sessizce atlamak.
- Runtime-derived değeri gereksiz yere project state'e kaydetmek.
- Multi-module automation kuralını yalnız UI callback içine gömmek.
- Contract/regression testi olmadan core davranış değişikliği tamamlamak.

---

# 12. Bu yapının sonraki genişleme noktaları

Bu ilk sürüm bilinçli olarak mevcut mimarinin üzerine minimum riskle kurulmuştur.

Sonraki kontrollü genişlemeler:

- bounded / directional rotation gibi richer behavior schema,
- commercial-item BOM contract'ının production part / CRM kimliğiyle bağlanması,
- renderer capability registry,
- persistence schema/version contract,
- feature contract coverage'ının diğer scene automation'lara genişletilmesi,
- contract'lardan otomatik sistem kataloğu/dokümantasyon üretimi.

Bu genişlemeler yapılırken mevcut source-of-truth sahipliği korunur; contract registry runtime davranışının ikinci implementasyonu haline getirilmez.
