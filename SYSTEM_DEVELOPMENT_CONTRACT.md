# Fair Stand — System Development Contract

> **Bu belge module / feature / core implementasyon sözleşmesidir.**
>
> Her değişiklik bundan **önce** `SYSTEM_CHANGE_GATE.md` üzerinden universal impact classification alır, `SYSTEM_IMPACT_SWEEP.md` ile dependency/test/finding taramasından geçer ve `.github/change-contract.json` içinde machine-readable olarak beyan edilir.

Amaç, insan veya AI tarafından sisteme yeni modül, feature, otomasyon veya davranış eklenirken yalnız değiştirilen dosyaya bakıp başka sorumlulukların geride bırakılmasını engellemektir.

---

# 1. Bu contract neden var?

Fair Stand'da bir değişiklik yalnızca tek bir dosya veya 3D obje değildir. Aynı değişiklik katalog, state, placement, behavior, renderer, persistence, BOM, composition, UI, asset, storage, import/export, accessibility ve test yüzeylerini birlikte etkileyebilir.

Bu nedenle "modeli sahneye ekledim", "butonu bağladım" veya "fonksiyonu refactor ettim" tek başına tamamlanmış iş değildir.

Universal gate gerçek etki alanını ve bağımlılıkları bulur; bu belge module/feature/core katmanında bu etkilerin nasıl uygulanacağını tanımlar.

---

# 2. Canonical source-of-truth dağılımı

| Konu | Canonical kaynak |
|---|---|
| Universal impact domain registry | `src/systemChangeContract.js > SYSTEM_IMPACT_DOMAINS` |
| Browser E2E trigger registry | `src/systemChangeContract.js > SYSTEM_BROWSER_E2E_DOMAINS` |
| Universal değişiklik kabul kapısı | `SYSTEM_CHANGE_GATE.md` + `.github/change-contract.json` |
| Full dependency/test/finding discovery | `SYSTEM_IMPACT_SWEEP.md` + `scripts/change-impact-analysis.mjs` |
| Global ürün invariantları | `PROJECT_RULES.md` |
| Mimari sınırlar | `ARCHITECTURE_RULES.md` |
| Katalog kimliği / nominal descriptor | `src/catalog.js` |
| Modül contract profile ve politika ataması | `src/moduleContracts.js` |
| Feature / composition contract | `src/featureContracts.js` |
| Placement / move snap / rotation / collision / ghost | `src/moduleBehavior.js` + placement core |
| Runtime module state construction | `src/designState.js` |
| Üretim reçetesi | `src/moduleRecipes.js` |
| Üretim parçası | `src/productionParts.js` |
| Otomatik depo planı | `src/autoDepot.js` |
| Unit/integration regression | `test/` ve mevcut legacy `tests/` |
| Real-browser regression | `e2e/` + `playwright.config.mjs` |

**Kural:** Bir runtime değeri canonical kod kaynağında varsa Markdown içine ikinci sabit kaynak olarak kopyalanmaz.

---

# 3. Değişiklik önce sınıflandırılır

İki aşama zorunludur:

1. **Universal:** `SYSTEM_IMPACT_DOMAINS` registry'sinde o anda tanımlı bütün domainler için `affected` / `not-applicable` kararı verilir. Domain sayısı sabit değildir.
2. **Domain:** İş module / variant / runtime-module / feature-composition / core-change sınıflarından uygun olanıyla uygulanır.

Browser-visible etki varsa `SYSTEM_BROWSER_E2E_DOMAINS` registry'si E2E'yi otomatik zorunlu kılar.

## A. Yeni katalog modülü

`MODULE_CATALOG` + explicit module contract + behavior + state construction + renderer + persistence + BOM policy + targeted regression + targeted E2E gerekir.

## B. Mevcut modül varyantı

Mevcut profile gerçekten uyuyorsa inheritance kullanılabilir. Uymuyorsa override veya yeni profile tanımlanır. Varyantın browser akışı değişiyorsa E2E aynı PR'da güncellenir.

## C. Katalog dışı runtime modülü

Katalogda görünmese bile explicit module contract ve canonical state construction zorunludur. Mevcut örnek `illuminated-foam` ailesidir.

## D. Feature / scene composition

Birden fazla modülü/domaini koordine eden işler `src/featureContracts.js` içinde feature contract taşır. UI callback veya renderer içine gizlenmiş composition kuralı kabul edilmez.

## E. Core davranış değişikliği

Rotation, collision, placement, state construction veya benzeri core değişiklikte önce mevcut core contract'ın ihtiyacı ifade edip edemediği kontrol edilir. Edemiyorsa canonical contract genişletilir; type-specific dağınık `if` ile başlanmaz.

---

# 4. Her modül/feature için cevaplanması gereken alanlar

## 4.1 Identity

- Catalog key nedir?
- Runtime `type` nedir?
- Mevcut bir ailenin varyantı mı?

## 4.2 Profile / inheritance

- Hangi profile kullanılıyor?
- Hangi davranışlar miras alınıyor?
- Hangi alanlar neden override ediliyor?

## 4.3 State

- State construction canonical olarak nerede?
- Hangi alanlar persisted?
- Hangi alanlar runtime-derived?
- Save/load round-trip sonrası anlam korunuyor mu?

## 4.4 Placement / movement / rotation / collision

- placement mode nedir?
- move snap nedir?
- rotation step/default/limit nedir?
- collision strategy nedir?
- side insert var mı?
- ghost nasıl davranır?

Module-specific farklar `src/moduleBehavior.js` ve placement core üzerinden ifade edilir.

## 4.5 Appearance

- renk editable mı?
- görsel editable mı?
- fixed mi?
- birden fazla editable surface var mı?
- renderer hangi state'i okuyor?

## 4.6 Renderer / assets

- procedural mı, GLB/model mi?
- asset path'i nedir?
- specialized renderer var mı?
- asset değişikliği hangi JS/CSS/HTML/browser akışını etkiliyor?

Renderer ürün kuralının tek sahibi haline getirilmez.

## 4.7 Persistence / storage

- Proje kaydına giriyor mu?
- Save/load/autosave/project switch etkileniyor mu?
- Runtime-derived alan yanlışlıkla persist ediliyor mu?

## 4.8 BOM policy

Her modül açıkça şu politikalardan birine sahip olmalıdır:

- `recipe`
- `commercial-item`
- `excluded`

`decision-required` production-ready yeni iş için kabul edilen son durum değildir.

## 4.9 Runtime behavior

- static mi?
- timer/clock/animation var mı?
- runtime dış kaynağı var mı?
- persisted state ile runtime-derived değer ayrılmış mı?

## 4.10 Composition / dependencies

- başka modül oluşturuyor mu?
- parent/child ilişkisi var mı?
- hangi wrapper/orchestrator çağırıyor?
- reverse dependents neler?

Bu liste tahminle yazılmaz; `SYSTEM_IMPACT_SWEEP.md` discovery sonucu ile karşılaştırılır.

## 4.11 Tests + browser E2E

Her değişiklik için:

- mevcut etkilenen test inventory'si,
- değişen davranışın targeted regression testi,
- full `npm test`,
- `npm run build`,
- canonical Playwright E2E suite

zorunludur.

`SYSTEM_BROWSER_E2E_DOMAINS` içindeki herhangi bir domain `affected` ise ayrıca **değişikliğe özel targeted `e2e/**` spec** zorunludur. Baseline smoke tek başına yeni browser davranışının kanıtı sayılmaz.

Save/load etkileniyorsa persistence round-trip; BOM etkileniyorsa recipe/BOM contract; UI/renderer/placement etkileniyorsa gerçek kullanıcı akışı ayrıca doğrulanır.

---

# 5. Enforced module gate

`src/moduleContracts.js` iki katman kullanır:

1. `MODULE_CONTRACT_PROFILES`
2. `MODULE_CONTRACT_ASSIGNMENTS`

`test/systemDevelopmentContract.test.js` katalog öğelerinin explicit contract ataması taşımasını, gerekli policy bölümlerini resolve etmesini, recipe-backed modüllerin gerçek recipe çözmesini ve katalog dışı runtime modüllerinin explicit contract taşımasını zorlar.

Bu module gate universal change gate'in yerine geçmez; onun altında domain-specific enforcement katmanıdır.

---

# 6. Feature / composition gate

Bir işlem tek modül davranışından fazlasını yönetiyorsa `src/featureContracts.js` kullanılır.

Mevcut `automatic-depot` feature contract'ı structural output ve içerik ailelerini açıkça tanımlar. Planner ile contract drift ederse regression kırılmalıdır.

Feature browser-visible ise Playwright E2E gerçek kullanıcı akışını da doğrular.

---

# 7. Örnek — yeni modül

Yeni bir çöp kovası eklendiğinde yalnız catalog + GLB yeterli değildir.

Zorunlu zincir:

`impact sweep → module contract → behavior → state construction → renderer/asset → persistence → BOM → affected existing tests → targeted regression → targeted E2E → full CI`

---

# 8. Örnek — canlı duvar saati

Canlı saat için runtime time değeri persisted state'e yazılmaz. Config persist edilir; anlık zaman runtime'da hesaplanır. Browser interaction/render değiştiği için targeted E2E zorunludur.

---

# 9. Örnek — otomatik depo

Depo içeriği değişirse yalnız renderer içine obje eklenmez.

1. Universal impact + full-system discovery yapılır.
2. `automatic-depot` feature contract güncellenir.
3. Planner ve canonical state construction yolu güncellenir.
4. Existing dependent tests review edilir.
5. Targeted unit/integration regression yazılır.
6. Gerçek UI akışını doğrulayan targeted E2E yazılır.
7. Full test + build + E2E çalışır.

---

# 10. Yeni iş için zorunlu çalışma sırası

1. Fresh `ROG` üzerinden branch oluştur.
2. `SYSTEM_CHANGE_GATE.md` ve `SYSTEM_IMPACT_SWEEP.md` oku.
3. `SYSTEM_IMPACT_DOMAINS` registry'sindeki bütün domainleri sınıflandır.
4. İlk reverse dependency/test/doc/finding taramasını çıkar.
5. `.github/change-contract.json` içinde impact + acknowledgement yaz.
6. Browser-impact varsa `tests.e2e.required=true` ve targeted E2E path belirle.
7. İlgili module/feature/core contract kararlarını ver.
8. Implementation yap.
9. `npm run contract:verify` ile gerçek diff üzerinden impact sweep'i yeniden hesapla.
10. Yeni bulunan caller/test/doc/finding yüzeylerini review edip contract'ı güncelle.
11. Targeted regressionları çalıştır.
12. `npm test` çalıştır.
13. `npm run build` çalıştır.
14. Playwright/Chromium hazır değilse local runner/browser dependency'lerini kur.
15. `npm run e2e` çalıştır.
16. PR aç; canonical CI'nın `contract:verify → npm ci → npm test → npm run build → Chromium → npm run e2e` zinciri yeşil olmalı.
17. Merge sonrası post-merge ROG CI yeşil olmadan finding/iş tamamlandı sayılmaz.

---

# 11. Yasaklanan geliştirme kalıpları

- Universal impact declaration veya full-system sweep olmadan guarded değişiklik tamamlamak.
- Registry'deki bir domaini gerçeğe aykırı `not-applicable` işaretlemek.
- Caller/dependent/test discovery sonucunu görmezden gelmek.
- Yeni canonical API ekleyip eski source-shape testlerini sessizce bırakmak.
- Catalog'a yeni modül ekleyip module contract eklememek.
- Yeni modülü varsayılan behavior'a sessizce bırakmak.
- Rotation/collision/snap/state construction gibi core davranışı dağınık type-specific `if` ile çözmek.
- BOM kararını atlamak.
- Runtime-derived değeri gereksiz yere project state'e kaydetmek.
- Multi-module automation kuralını yalnız UI callback içine gömmek.
- Targeted regression olmadan davranış değişikliği tamamlamak.
- Browser-impact değişiklikte targeted E2E olmadan işi tamamlamak.
- Full test/build/E2E veya PR/post-merge CI doğrulanmadan işi kapalı saymak.

---

# 12. Genişleme ilkesi

Bu contract sabit domain sayısına veya bugünkü modül listesine bağlı değildir. Yeni domain, browser capability, contract türü veya test katmanı eklendiğinde canonical registry/schema genişletilir; validator ve regression suite yeni sözleşmeyi otomatik zorlar.

Contract registry runtime davranışının ikinci implementasyonu haline getirilmez; canonical source-of-truth sahipliği korunur.
