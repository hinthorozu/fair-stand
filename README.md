# Fair Stand

Fair Stand, gerçek Maxima fuar standı modüllerini temel alan **kural tabanlı 3D stand konfigüratörüdür**.

Amaç serbest çizim yapmak değil; katalogda tanımlı gerçek modülleri, placement/collision kurallarını ve üretim reçetelerini kullanarak geçerli stand tasarımları oluşturmaktır.

## Güncel durum

Repository ilk MVP taslağının ötesindedir. Mevcut uygulama aşağıdaki ana yetenekleri içerir:

- Gerçek zamanlı Three.js 3D stand sahnesi.
- Ortak placement, snap, connection ve collision altyapısı.
- Module type'a göre merkezi behavior registry.
- Otomatik duvar ve depo yerleşim yardımcıları.
- Panel, separatör, vitrin, raf, depo kapısı, panel bazalı duvar, banko ve baza modülleri.
- Mobilya, depo ekipmanı, bitki/saksı, TV/video-wall ve LED projektör katalog öğeleri.
- Renk, görsel ve editable surface state altyapısı.
- Recipe / production-parts tabanlı BOM ve üretim verisi altyapısı.
- Proje ve asset yönetimi için ayrı state/storage katmanları.
- Module/feature contract altyapısı ve universal system change gate.
- Geniş regresyon test paketi ve canonical GitHub Actions CI.

> Modül bazlı kesin placement, snap, rotation, collision, production ölçüsü veya recipe adetleri README içinde tekrar tutulmaz. Bunların canonical kaynakları ilgili runtime/contract dosyalarıdır.

## Teknoloji

- JavaScript ES Modules
- Three.js
- Vite
- Node.js built-in test runner (`node --test`)
- JSZip
- GitHub Actions

## Kurulum

CI Node 22 kullanır.

```bash
npm ci
npm run dev
```

Vite geliştirme sunucusunun verdiği local adresi tarayıcıda açın.

## Komutlar

```bash
npm run dev              # local development server
npm run contract:verify  # system change contract schema/diff verification
npm test                 # regression test suite
npm run build            # production build
npm run preview          # built application preview
```

## Zorunlu değişiklik akışı

İnsan veya AI bir değişiklik yapmadan önce **iki katmanlı sözleşmeyi** izler:

1. `SYSTEM_CHANGE_GATE.md` — değişikliğin sistemde hangi domainleri etkilediğini belirler.
2. `.github/change-contract.json` — bu impact kararlarının machine-readable deklarasyonudur.
3. `SYSTEM_DEVELOPMENT_CONTRACT.md` — module / feature / core değişikliğinin kendi domain contract'larını tanımlar.
4. İlgili canonical owner dosyaları güncellenir.
5. Değişen davranış için targeted regression eklenir/güncellenir.
6. Full test + build çalıştırılır.
7. PR canonical CI'dan yeşil geçmeden merge edilmez.

Canonical CI şu sırayı çalıştırır:

```text
checkout (full git history)
→ npm run contract:verify
→ npm ci
→ npm test
→ npm run build
```

`npm run contract:verify` local ortamda diff bilgisinin mevcut olmadığı koşullarda yalnız schema doğrulayabilir; gerçek PR/push diff enforcement canonical CI'da yapılır. Bu local-enforcement açığı audit finding `F-009` olarak ayrıca takip edilir.

## Temel mimari

Sistem, tek bir dosyanın bütün ürün kurallarını taşıması yerine sorumlulukları ayırır.

### Catalog

`src/catalog.js`

Kullanıcıya sunulan katalog kimlikleri, nominal ölçüler ve catalog metadata burada tutulur. Nominal katalog/placement ölçüsü ile gerçek üretim kesim ölçüsü aynı kavram değildir.

### Module contract

`src/moduleContracts.js`

Her katalog anahtarının profile, state/appearance/renderer/runtime/composition ve BOM policy sözleşmesini açıklar. Katalog dışı explicit runtime modülleri de burada ayrı registry üzerinden contract taşır.

### Feature contract

`src/featureContracts.js`

Birden fazla modülü/domaini koordine eden scene-composition özelliklerinin contract sahibidir.

### Module behavior

`src/moduleBehavior.js`

Module type'a göre değişen editor davranışlarının canonical kaynağıdır:

- placement mode,
- move snap,
- rotation step,
- default rotation,
- side insertion,
- collision strategy,
- ghost strategy.

Katalogdaki her mevcut runtime type explicit behavior coverage taşımak zorundadır.

### Placement / connection

Placement core stand sınırı, snap, bağlantı geometrisi, collision ve reflow gibi geometrik kuralları doğrular. Behavior registry hangi stratejinin kullanılacağını seçebilir; gerçek geometrik hesap placement katmanında kalır.

### State

State factory dosyaları modüllerin kalıcı/editable durumunu taşır. Runtime-derived veya renderer-only değerler gereksiz yere persisted state'e dönüştürülmemelidir.

### Renderer

`src/scene3d.js` Three.js sahnesini ve module rendering akışını yönetir. Placement veya üretim kuralı renderer'ın tek sorumluluğu haline getirilmemelidir.

### Production / BOM

- `src/productionParts.js` — production part kimliği ve fiziksel metadata.
- `src/moduleRecipes.js` — module recipe/part miktarı ilişkileri.
- `src/moduleContracts.js` — modülün BOM policy'si.

Roadmap veya README bu verilerin ikinci sabit kopyası değildir.

### Persistence / storage

Project state ve asset blob storage ayrı katmanlarda tutulur. Project switch/save/load/import-export gibi cross-domain akışlar ilgili persistence/storage contract ve regression testleriyle korunur.

## Koordinat standardı

- X/Y: zemin düzlemi
- Z: yükseklik
- Plan dönüşü: Z ekseni etrafında

Dönüş adımı ve movement snap global sabit değildir. Modül davranışı `src/moduleBehavior.js` üzerinden okunmalıdır.

## Yeni modül / feature eklerken

Yeni iş yalnız katalog satırı veya UI butonu eklemek değildir.

Önce universal change declaration hazırlanır:

1. `SYSTEM_CHANGE_GATE.md` okunur.
2. Etkilenen 17 domain için `affected` / `not-applicable` kararı verilir.
3. `.github/change-contract.json` değişiklikle birlikte güncellenir.
4. Sonra `SYSTEM_DEVELOPMENT_CONTRACT.md` içindeki module/feature/core contract akışı uygulanır.

Bir katalog modülü için en az şu alanlar kontrol edilir:

- catalog identity / descriptor,
- module contract/profile,
- state factory,
- explicit behavior,
- placement/collision etkisi,
- renderer/routing,
- persistence,
- BOM policy / recipe,
- composition/dependency,
- targeted regression.

Bir feature birden fazla modülü/domaini koordine ediyorsa `src/featureContracts.js` contract'ı ayrıca kontrol edilir.

## Repository belgeleri

### Canonical bugün

- `PROJECT_RULES.md` — global product invariant'ları.
- `ARCHITECTURE_RULES.md` — sistem katmanları ve source-of-truth sınırları.
- `SYSTEM_CHANGE_GATE.md` — universal system-change impact sözleşmesi.
- `SYSTEM_DEVELOPMENT_CONTRACT.md` — module/feature/core geliştirme sözleşmesi.
- `MODULE_BEHAVIOR_STANDARD.md` — module behavior registry sözleşmesi.
- `SYSTEM_MODULE_CATALOG.md` — runtime catalog/contracts ile test edilen okunabilir katalog indeksi; runtime source-of-truth değildir.
- `SYSTEM_AUDIT_CHECKLIST.md` — A00–A24 audit metodolojisi/checklist'i.
- `audit/FINDINGS.md` — full-system audit finding ledger'ı.
- `audit/FULL_SWEEP_STATE.md` — audit/remediation resume state'i.

### Plan / gelecek

- `ROADMAP.md` — aktif üst seviye ürün/teknik plan.
- `ROADMAP_PHASE_4.md` — FAZ 4 ayrıntılı planı.
- `ROADMAP_PHASE_5_6.md` — FAZ 5–6 ayrıntılı planı.
- `PRODUCT_FUTURE.md` — henüz aktif faza eksiksiz yerleştirilmemiş gelecek gereksinimleri.
- `RENDER_FUTURE_BACKLOG.md` — future render/HDRI/PBR backlog'u.

### Historical / legacy

- `MILESTONES.md`, `Changelog.md` — tarihsel kayıtlar.
- `FRESH_REPOSITORY_REVIEW.md` — explicit historical repository-review snapshot.
- `REPOSITORY_CLEANUP_PROGRESS.md` — explicit historical cleanup-progress snapshot.
- `LEGACY_TRASH.md` — güncel sistemle uyumsuz/eski/doğrulanmamış içeriklerin korunduğu legacy alan.

Historical dosyalardaki “mevcut / sıradaki iş” ifadeleri current ROG truth'u olarak kullanılmaz.

## Geliştirme politikası

Standart akış:

```text
fresh ROG
→ branch
→ SYSTEM_CHANGE_GATE impact declaration
→ module/feature/core contract kararı
→ implementation
→ targeted regression
→ npm test
→ npm run build
→ PR
→ canonical CI
→ merge
→ post-merge ROG CI
```

Core placement, behavior, catalog, persistence, renderer, BOM veya başka bir domain değişiyorsa ilgili regression aynı PR içinde eklenmeli/güncellenmelidir.

## Product invariant'ları

Kısa özet:

- Kullanıcı açıkça istemedikçe silinen modülün oluşturduğu boşluk otomatik kapatılmaz.
- Auto-compaction varsayılan davranış değildir.
- `wallId` placement metadata'sıdır; ayrı ürün sınıfı değildir.
- Nominal placement ölçüsü, fiziksel footprint ve production/BOM ölçüsü birbirinden farklı olabilir.
- Module-specific davranışlar global varsayımlara göre değil behavior registry üzerinden belirlenir.

Ayrıntılı canonical kurallar için `PROJECT_RULES.md`, `ARCHITECTURE_RULES.md`, `SYSTEM_CHANGE_GATE.md`, `SYSTEM_DEVELOPMENT_CONTRACT.md` ve `MODULE_BEHAVIOR_STANDARD.md` dosyalarına bakın.
