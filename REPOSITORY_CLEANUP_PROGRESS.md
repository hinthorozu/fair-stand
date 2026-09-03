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
2. Dokümantasyonu kayıpsız sınıflandır; eski/uyumsuz bilgiyi sessizce silme.
3. ROADMAP'i gerçek implementasyon durumuyla eşleştir.
4. Catalog → module behavior coverage testi ekle.
5. `main.js` içine yeni sorumluluk eklememeye başla; yeni controller'ları ayrı dosyalara çıkar.

### P2 / P3

- `scene3d.js` renderer sorumluluklarını kademeli böl.
- `SYSTEM_MODULE_CATALOG.md` dokümanını koddan generate etmeyi değerlendir.
- ESLint / Prettier / JSDoc contract desteği ekle.
- `src/` ve `test/` yapısını domain bazlı düzenle.

---

## P0 — GitHub Actions temizliği

Durum: **TAMAMLANDI**

- Eski tek-seferlik workflow/scriptler kaldırıldı.
- Tek canonical `.github/workflows/ci.yml` bırakıldı.
- CI Node 22 + `npm ci` + `npm test` + `npm run build` kullanıyor.

Merge: PR #3

---

## P0 — Documentation / contract cleanup

Durum: **TAMAMLANDI / CI DOĞRULANDI**

- `PROJECT_RULES.md` global invariant'lara indirildi.
- `ARCHITECTURE_RULES.md` source-of-truth ve sistem katmanı sınırlarına odaklandı.
- `MODULE_BEHAVIOR_STANDARD.md` runtime behavior contract ile hizalandı.

Merge: PR #4

---

## P1 — Catalog → module behavior contract coverage

Durum: **TAMAMLANDI / CI DOĞRULANDI**

- Katalogdaki her module type explicit behavior contract'a bağlandı.
- `hasExplicitModuleBehavior()` eklendi.
- `test/moduleBehaviorContract.test.js` eklendi.
- Yeni catalog type behavior kaydı olmadan eklenirse CI kırılır.
- Unknown/non-catalog fallback davranışı korunur.

Merge: PR #5

---

## P1 — README güncellemesi

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Merge: PR #6

- README mevcut ürün ve repository yapısını anlatacak şekilde yeniden yazıldı.
- Güncel katalog/modül aileleri, behavior registry, placement, state, renderer ve BOM katmanları özetlendi.
- Gerçek package scripts ve canonical CI akışı dokümante edildi.
- Global 90° / 50 cm gibi artık doğru olmayan varsayımlar README'ye taşınmadı.

### Sonradan tespit edilen koruma ihtiyacı

README sadeleştirmesinde eski gelecek/tarihsel içeriğin tamamının ayrı bir dosyaya taşınmadığı fark edildi. İçerik Git history'de kaybolmamış olsa da aktif dokümantasyonda görünürlüğü azalmıştı.

Bu nedenle yeni kural: **doküman sadeleştirmesinde içerik sessizce silinmez; canonical / future / legacy / history sınıflarından birine taşınır.**

---

## P1 — Kayıpsız dokümantasyon sınıflandırması

Durum: **UYGULANDI — PR/CI BEKLİYOR**

Branch: `docs/preserve-and-classify`

Yapılanlar:

- PR #6 öncesi eski README snapshot'ı tekrar incelendi.
- `PRODUCT_FUTURE.md` oluşturuldu: PDF teklif, montaj sırası, depo toplama, paketleme, stok, baskı dosyaları, montaj şeması, proje paylaşma/onaylama ve teknik/ticari veri ihtiyaçları burada korunuyor.
- `LEGACY_TRASH.md` oluşturuldu: güncel sistemle uyuşmayan eski MVP varsayımları, eski klasör önerisi, eski uygulama sırası ve doğrulanmamış saha tahminleri kayıpsız tutuluyor.
- `RENDER_FUTURE_BACKLOG.md` oluşturuldu: geçmişte FAZ 4 adıyla yazılmış HDRI/PBR/AO/ileri render hedefleri yeni FAZ 4 ile çakışmadan korunuyor.
- `MILESTONES.md` tarihsel kayıt olarak işaretlendi; aktif roadmap source-of-truth olmadığı açıklandı.
- README içine dokümantasyon sınıflandırma haritası eklendi.
- Uygulama runtime koduna dokunulmadı.

Doküman sınıfları:

- Current/runtime: `README.md` + source code/contracts.
- Global rules/contracts: `PROJECT_RULES.md`, `ARCHITECTURE_RULES.md`, `MODULE_BEHAVIOR_STANDARD.md`.
- Active plan: `ROADMAP*.md`.
- Unscheduled preserved future: `PRODUCT_FUTURE.md`, `RENDER_FUTURE_BACKLOG.md`.
- Legacy/incompatible/unverified: `LEGACY_TRASH.md`.
- History: `MILESTONES.md`, `Changelog.md`, Git history.

## Sıradaki İş

1. Bu dokümantasyon sınıflandırma branch'ini PR + canonical CI ile doğrula ve merge et.
2. Ardından `ROADMAP.md` / `ROADMAP_PHASE_4.md` checkbox ve durumlarını gerçek implementasyonla eşleştir. Özellikle production parts ve standard recipe altyapısının kod/testte mevcut olduğu halde roadmap'te `[ ]` görünmesi incelenecek.
