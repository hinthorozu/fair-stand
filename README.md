# Fair Stand

Fair Stand, gerçek Maxima fuar standı modüllerini temel alan **kural tabanlı 3D stand konfigüratörüdür**.

Amaç serbest çizim yapmak değil; katalogda tanımlı gerçek modülleri, placement/collision kurallarını ve üretim reçetelerini kullanarak geçerli stand tasarımları oluşturmaktır.

## Güncel durum

Repository artık ilk MVP taslağının ötesindedir. Mevcut uygulama aşağıdaki ana yetenekleri içerir:

- Gerçek zamanlı Three.js 3D stand sahnesi.
- Ortak placement, snap, connection ve collision altyapısı.
- Module type'a göre merkezi behavior registry: placement mode, hareket snap'i, dönüş adımı, başlangıç yönü, collision ve ghost davranışı.
- Otomatik duvar ve depo yerleşim yardımcıları.
- Panel, separatör, vitrin, raf, depo kapısı, panel bazalı duvar, banko ve baza modülleri.
- Koltuk takımı, Eames masa-sandalye takımı, bar taburesi, mini buzdolabı, kettle, askılık ve bitki/saksı modülleri.
- TV 42/55/65, 2×2 ve 3×3 video wall ve LED projektör katalog öğeleri.
- Renk, görsel ve editable surface state altyapısı.
- Recipe / production-parts tabanlı BOM ve üretim verisi altyapısı.
- Proje ve asset yönetimi için ayrı state/storage katmanları.
- Catalog → module behavior contract kontrolü; yeni katalog tipi explicit behavior tanımı olmadan CI'dan geçmez.
- Geniş regresyon test paketi ve canonical GitHub Actions CI.

> Modül bazlı kesin placement, snap, rotation ve collision değerleri README içinde tekrar tutulmaz. Bunların canonical kaynağı `src/moduleBehavior.js` ve ilgili testlerdir.

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
npm run dev      # local development server
npm test         # regression test suite
npm run build    # production build
npm run preview  # built application preview
```

PR ve `ROG` branch doğrulamasında canonical CI şu sırayı çalıştırır:

```bash
npm ci
npm test
npm run build
```

## Temel mimari

Sistem, tek bir dosyanın bütün ürün kurallarını taşıması yerine sorumlulukları ayırır.

### Catalog

`src/catalog.js`

Kullanıcıya sunulan katalog kimlikleri, nominal ölçüler ve catalog metadata burada tutulur.

Nominal katalog/placement ölçüsü ile gerçek üretim kesim ölçüsü aynı kavram değildir.

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

Katalogdaki her mevcut module type explicit behavior contract'a sahip olmak zorundadır. `test/moduleBehaviorContract.test.js` bu sözleşmeyi CI seviyesinde korur.

### Placement / connection

Placement core;

- stand sınırı,
- grid/snap,
- end-to-end bağlantı,
- corner/L bağlantı,
- tee/T bağlantı,
- segment ve footprint collision,
- reflow

gibi geometrik kuralları doğrular.

Behavior registry hangi stratejinin kullanılacağını seçebilir; gerçek geometrik hesap placement katmanında kalır.

### State

State factory dosyaları modüllerin kalıcı/editable durumunu taşır. Panel yüzeyleri, renkler, görseller ve module-specific editable alanlar renderer'dan bağımsız tutulmaya çalışılır.

### Renderer

`src/scene3d.js` Three.js sahnesini ve module rendering akışını yönetir.

Placement veya üretim kuralı renderer'ın tek sorumluluğu haline getirilmemelidir.

### Production / BOM

Recipe ve production-parts katmanı gerçek üretim parçası, adet ve kesim ölçülerinin kaynağıdır.

Bu katman nominal katalog ölçüsünden bilinçli olarak farklı değerler taşıyabilir.

## Koordinat standardı

- X/Y: zemin düzlemi
- Z: yükseklik
- Plan dönüşü: Z ekseni etrafında

Dönüş adımı ve movement snap global sabit değildir. Modül davranışı `src/moduleBehavior.js` üzerinden okunmalıdır.

## Yeni modül eklerken

Yeni bir katalog modülü eklenirken yalnız katalog satırı eklemek yeterli değildir. İlgili değişiklikte şu kontratlar kontrol edilmelidir:

1. Catalog descriptor.
2. State factory / runtime state.
3. Explicit module behavior.
4. Renderer veya renderer routing ihtiyacı.
5. Recipe/BOM gerekiyorsa üretim reçetesi.
6. Regression testleri.

Yeni bir katalog type'ı behavior registry'ye eklenmezse CI bunu yakalar.

## Repository belgeleri

- `PROJECT_RULES.md` — yalnız gerçekten global product invariant'ları.
- `ARCHITECTURE_RULES.md` — sistem katmanları ve source-of-truth sınırları.
- `MODULE_BEHAVIOR_STANDARD.md` — module behavior registry sözleşmesi.
- `SYSTEM_MODULE_CATALOG.md` — katalog/BOM görünümü; manuel doküman olduğu için kod ile birlikte doğrulanmalıdır.
- `ROADMAP.md` — aktif üst seviye ürün ve teknik geliştirme planı.
- `ROADMAP_PHASE_4.md` — FAZ 4 ayrıntılı planı.
- `ROADMAP_PHASE_5_6.md` — FAZ 5–6 ayrıntılı planı.
- `PRODUCT_FUTURE.md` — eski README dahil farklı belgelerden korunmuş, henüz aktif faza eksiksiz yerleştirilmemiş gelecek ürün gereksinimleri.
- `LEGACY_TRASH.md` — güncel sistemle uyumsuz/eski/doğrulanmamış içeriklerin silinmeden tutulduğu çöp kutusu.
- `MILESTONES.md` — tarihsel faz kapanış kayıtları; aktif roadmap için source-of-truth değildir.
- `REPOSITORY_CLEANUP_PROGRESS.md` — repository cleanup/refactor checkpoint'i.
- `FRESH_REPOSITORY_REVIEW.md` — fresh repository inceleme raporu.

### Dokümantasyon sınıflandırması

- **Bugün çalışan sistem:** `README.md` + runtime source-of-truth dosyaları.
- **Global invariant / architecture contract:** `PROJECT_RULES.md`, `ARCHITECTURE_RULES.md`, `MODULE_BEHAVIOR_STANDARD.md`.
- **Aktif gelecek planı:** `ROADMAP*.md`.
- **Kaybolmaması gereken fakat henüz fazlandırılmamış gelecek fikirleri:** `PRODUCT_FUTURE.md`.
- **Eski, uyumsuz veya doğrulanmamış bilgi:** `LEGACY_TRASH.md`.
- **Tarihsel kayıt:** `MILESTONES.md`, `Changelog.md` ve Git history.

İçerik yalnız eski olduğu için sessizce silinmez; uygun sınıfa taşınır.

## Geliştirme politikası

Core davranış değişikliklerinde önerilen akış:

```text
branch
→ kod / doküman değişikliği
→ regression test
→ PR
→ canonical CI
→ merge
```

Core placement, behavior, catalog veya recipe contract'ı değişiyorsa ilgili test aynı PR içinde eklenmeli veya güncellenmelidir.

## Product invariant'ları

Kısa özet:

- Kullanıcı açıkça istemedikçe silinen modülün oluşturduğu boşluk otomatik kapatılmaz.
- Auto-compaction varsayılan davranış değildir.
- `wallId` placement metadata'sıdır; ayrı ürün sınıfı değildir.
- Nominal placement ölçüsü, fiziksel footprint ve production/BOM ölçüsü birbirinden farklı olabilir.
- Module-specific davranışlar global 90°/50 cm varsayımlarına göre değil behavior registry üzerinden belirlenir.

Ayrıntılı ve canonical kurallar için `PROJECT_RULES.md`, `ARCHITECTURE_RULES.md` ve `MODULE_BEHAVIOR_STANDARD.md` dosyalarına bakın.
