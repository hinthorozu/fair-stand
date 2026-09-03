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

Branch:

- `docs/update-readme`

PR:

- #6 — `Refresh README for current Fair Stand architecture`

Yapılanlar:

- Eski ilk-MVP/gelecek-zaman anlatımı kaldırıldı.
- README mevcut ürün ve repository yapısını anlatacak şekilde yeniden yazıldı.
- Güncel katalog/modül aileleri, behavior registry, placement, state, renderer ve BOM katmanları özetlendi.
- Gerçek package scripts ve canonical CI akışı dokümante edildi.
- `npm ci`, `npm run dev`, `npm test`, `npm run build`, `npm run preview` komutları güncel şekilde yazıldı.
- Global 90° / 50 cm gibi artık doğru olmayan varsayımlar README'ye taşınmadı; canonical `moduleBehavior.js` kaynağına yönlendirme yapıldı.
- Yeni module checklist'i ve canonical repository dokümanları eklendi.
- Uygulama runtime koduna dokunulmadı.
- Canonical CI'da install, test ve build adımları başarılı geçti.

## Sıradaki İş

Sonraki P1: **`ROADMAP.md` ve ilgili phase roadmap'lerini gerçek implementasyon durumuyla karşılaştırıp güncelle.**
