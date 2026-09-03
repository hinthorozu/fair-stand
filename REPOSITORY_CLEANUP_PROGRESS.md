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

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Merge: PR #7

Merge commit: `0f99b8cfa58fd14cf6bb5a992e52e2d0f2b89eb5`

- PR #6 öncesi eski README snapshot'ı tekrar incelendi.
- `PRODUCT_FUTURE.md` oluşturuldu.
- `LEGACY_TRASH.md` oluşturuldu.
- `RENDER_FUTURE_BACKLOG.md` oluşturuldu.
- `MILESTONES.md` tarihsel kayıt olarak netleştirildi.
- README içine dokümantasyon sınıflandırma haritası eklendi.
- Canonical CI install/test/build başarılı geçti.

Doküman sınıfları:

- Current/runtime: `README.md` + source code/contracts.
- Global rules/contracts: `PROJECT_RULES.md`, `ARCHITECTURE_RULES.md`, `MODULE_BEHAVIOR_STANDARD.md`.
- Active plan: `ROADMAP*.md`.
- Unscheduled preserved future: `PRODUCT_FUTURE.md`, `RENDER_FUTURE_BACKLOG.md`.
- Legacy/incompatible/unverified: `LEGACY_TRASH.md`.
- History: `MILESTONES.md`, `Changelog.md`, Git history.

---

## P1 — Roadmap implementation reconciliation

Durum: **TAMAMLANDI / CI DOĞRULANDI**

Merge: PR #8

Merge commit: `537622c6bdf5384be7e12456866a20ab58014ef3`

- `ROADMAP.md` gerçek source/test durumuyla karşılaştırıldı.
- Production parts temelinin ve 50/100/150/200 düz duvar recipe'lerinin mevcut olduğu açıkça işaretlendi.
- Recipe registry ile gerçek scene-instance Raw BOM pipeline'ı birbirinden ayrıldı; olmayan katman tamamlanmış gösterilmedi.
- `ROADMAP_PHASE_4.md` checkbox'ları yalnız source + regression testiyle doğrulanan maddelerde kapatıldı.
- Fiziksel ölçü metadata'sı, Three.js'ten bağımsız production-part identity, dört connector tanımı, recipe definition eşdeğeri ve standart duvar recipe testleri tamamlanmış olarak işaretlendi.
- `materialId`, tüm hedef birimler/kategoriler, `catalogRef`, instance Raw BOM, parametrik core, custom library/wizard ve connection graph açık bırakıldı.
- Hiçbir gelecek plan maddesi silinmedi.

---

## P1 — `main.js` sorumluluk azaltma / ilk controller extraction

Durum: **TAMAMLANDI / CI DOĞRULANDI — MERGE BEKLİYOR**

Branch: `refactor/extract-project-naming`

PR: #9 — `Extract project naming controller from main.js`

İlk düşük riskli extraction olarak proje adlandırma alanı seçildi.

Yapılanlar:

- `src/projectNaming.js` oluşturuldu.
- Otomatik proje suffix üretimi `main.js` dışına taşındı.
- Rename sırasında otomatik suffix'i ayıran helper `main.js` dışına taşındı.
- Proje adı normalize/sync davranışı controller'a taşındı.
- Yeni proje / rename modal üretimi controller'a taşındı.
- `main.js` yalnız DOM dependency'lerini controller'a bağlar hale getirildi; proje state/storage davranışı değiştirilmedi.
- `test/projectNaming.test.js` eklendi.
- Suffix contract'ı, Adsız Proje fallback'i, editable-name davranışı ve input/display sync test edildi.
- Extraction patch'i sırasında `npm test` ve `npm run build` başarılı geçti.
- PR #9 canonical CI'da `npm ci`, `npm test`, `npm run build` başarılı geçti.
- Geçici patch workflow final branch tree'sinden kaldırıldı; repository'de canonical `.github/workflows/ci.yml` dışında yeni kalıcı workflow bırakılmadı.

Branch diff özeti:

- `src/main.js`: +10 / -94
- `src/projectNaming.js`: yeni, 111 satır
- `test/projectNaming.test.js`: yeni, 46 satır

## Sıradaki İş

1. PR #9'u latest-head CI tekrar başarılı olduktan sonra ROG'a merge et.
2. Sonraki düşük riskli `main.js` extraction adayı olarak autosave controller ile project UI helper grubunu karşılaştır; davranış sınırı daha net ve test edilebilir olanı seç.
