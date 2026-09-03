# Fair Stand — Repository Cleanup Progress

Bu dosya, fresh repository incelemesi sonrasında nerede kalındığını ve sıradaki işleri takip etmek için tutulur.

Ayrıntılı ilk teknik rapor:

- `FRESH_REPOSITORY_REVIEW.md`

## Öncelik sırası

### P0

1. GitHub Actions/workflow temizliği.
2. Tek canonical CI ve deterministik `npm ci` akışı.
3. `PROJECT_RULES.md`, `ARCHITECTURE_RULES.md`, `MODULE_BEHAVIOR_STANDARD.md` contract drift temizliği.

### P1

1. README'yi mevcut ürün seviyesine göre yeniden yaz.
2. ROADMAP'i gerçek implementasyon durumuyla eşleştir.
3. Catalog → module behavior coverage testi ekle.
4. `main.js` içine yeni sorumluluk eklememeye başla; yeni controller'ları ayrı dosyalara çıkar.

### P2 / P3

- `scene3d.js` renderer sorumluluklarını kademeli böl.
- `SYSTEM_MODULE_CATALOG.md` dokümanını koddan generate etmeyi değerlendir.
- ESLint / Prettier / JSDoc contract desteği ekle.
- `src/` ve `test/` yapısını domain bazlı düzenle.

---

## P0 — GitHub Actions temizliği

Durum: **TAMAMLANDI**

Yapılanlar:

- Eski tek-seferlik `add-*`, `fix-*`, `inspect-*`, `rename-*` ve video-wall patch workflow'ları kaldırıldı.
- `.github/scripts` altındaki geçmiş patch scriptleri kaldırıldı.
- Eski `build.yml` kaldırıldı.
- Tek kalıcı workflow olarak `.github/workflows/ci.yml` bırakıldı.
- Canonical CI Node 22 + `npm ci` + `npm test` + `npm run build` kullanıyor.
- Temizlik doğrulamasında 349 test geçti ve production build başarılı oldu.
- Uygulama kaynak koduna dokunulmadı.

Merge: PR #3

---

## P0 — Documentation / contract cleanup

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Branch:

- `cleanup/documentation-contracts`

PR:

- #4 — `Align documentation contracts with runtime behavior`

Yapılanlar:

### `PROJECT_RULES.md`

- Module-specific 90° / 50 cm gibi artık global olmayan varsayımlar kaldırıldı.
- Banko, Baza, Raf ve Koltuk gibi module-specific ürün detayları global rules dokümanından çıkarıldı.
- Dosya yalnız gerçek global product invariant'larına indirildi.
- X/Y zemin + Z yükseklik koordinat modeli korundu.
- Silme sonrası boşluğun korunması ve auto-compaction yapılmaması korundu.
- Nominal placement ölçüsü / fiziksel geometri / BOM ölçüsü ayrımı açıklaştırıldı.
- Canonical source sınırları tanımlandı.

### `ARCHITECTURE_RULES.md`

- Runtime sabitlerinin ikinci kopyası olmaktan çıkarıldı.
- Sistem katmanları ve source-of-truth sınırlarına odaklandı.
- Rotation ve movement grid'in global sabit olmadığı açıklandı.
- Placement, behavior registry, connection/collision, state/renderer ve BOM sorumlulukları ayrıştırıldı.

### `MODULE_BEHAVIOR_STANDARD.md`

- `wall-overlay` placement contract'a eklendi.
- Eski `proxy / 0.30` ghost dokümantasyonu gerçek runtime ile hizalandı: central silhouette ghost.
- Tüm modüllerin 90° / 50 cm kullanmadığı açıkça belirtildi.
- Behavior helper fonksiyonlarının kullanılması dokümante edildi.
- Descriptor-aware override'ların `moduleBehavior.js` içinde merkezi kalması gerektiği belirtildi.
- Yeni module checklist'i netleştirildi.

### Doğrulama

- Canonical CI çalıştı.
- `npm ci` başarılı.
- `npm test` başarılı.
- `npm run build` başarılı.
- Uygulama runtime koduna dokunulmadı.

## Sıradaki P1

Önerilen ilk P1 işi: **Catalog → module behavior coverage testi**.

Amaç: katalogda yeni bir module type tanımlandığında gerekli explicit behavior contract unutulursa CI'ın bunu yakalaması. Bu küçük ve düşük riskli değişiklik, ardından yapılacak README/ROADMAP temizliği ve daha büyük refactor'lar için güvenliği artırır.
