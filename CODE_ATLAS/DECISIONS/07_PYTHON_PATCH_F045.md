# DECISION-07 — Python patch / F-045

**KONU:** `scripts/archive/add-tv-sizes.py`, `add-video-wall-2x2.py`, `fix-tv-screen-face.py` ve `audit/FINDINGS.md` F-045 OPEN.

## MEVCUT GERÇEK DURUM

Üç script `src/*.js` ve test dosyalarında **dize replace** ile kanonik kaynak yeniden yazar. `package.json` script yok. CI yok. Change-contract `affectedFiles` listeler (keşif/hijyen), çalıştırmaz.

`audit/evidence/A21_REPOSITORY_HYGIENE_GOVERNANCE.md`: F-045 P2 OPEN. 2 `patch-video-wall-*.cjs` CLEANUP_PHASE_1’de silindi; py kaldı.

Güncel `src/catalog.js`: `TV_42_DIMENSIONS`, `createTvCatalogItem`, `TV_55_DEFINITION` **yok**. TV SoT `src/items.js` WALL_MEDIA. Script’ler bu eski string’leri arar; yoksa `SystemExit`.

`scripts/video-wall-build-trigger.txt` ayrı (MA-028 belgelendi; SAFE_TO_REMOVE=0). Bu kararın py üçlüsü.

## NEDEN KARAR GEREKİYOR

Elle çalıştırma modern kaynağı bozabilir veya (bugün) fail eder. F-045 kapanışı silme/arşiv/waiver ister. MA-019 ACTION_REQUIRED.

---

## Script kartları

### `scripts/archive/add-tv-sizes.py`

| | |
| --- | --- |
| Ne yapardı | `catalog.js` TV_DIMENSIONS, `designState.createTvModuleState`, `scene3d` ghost, `tv42Module.test.js` |
| Bugün çalışır mı | Hayır — hedef bloklar yok (`SystemExit` / replace miss) |
| API mevcut mu | Hayır (`createTvCatalogItem` 0) |
| package/CI | Yok |
| Workflow | Historical one-shot |
| Tekrar ihtiyaç | TV varyantı `items.js` + factory ile ekleniyor; bu script formatı değil |

### `scripts/archive/add-video-wall-2x2.py`

| | |
| --- | --- |
| Ne yapardı | Catalog VIDEO_WALL_2X2, `createTvModuleState` descriptor, `createTvModule` video-wall mesh |
| Bugün çalışır mı | Hayır — `createTvCatalogItem(TV_55_DEFINITION)` yok |
| Consumer | Docs/audit path; runtime 0 |
| Tekrar ihtiyaç | Video wall Item `items.js`’te var; script stale |

### `scripts/archive/fix-tv-screen-face.py`

| | |
| --- | --- |
| Ne yapardı | `createTvModule` material dizisinde screen’i iki Z yüzeye kopyala + test rename |
| Bugün çalışır mı | Eski material literal yoksa `SystemExit` |
| Maintenance | Hayır; renderer `items.js`/scene3d |

Kova seçenekleri (üçü birlikte veya ayrı; F-045 üçüne bağlı):

## OPTION KEEP

Dosyalar `scripts/` kalır. Docs “çalıştırmayın / stale”. F-045 OPEN veya waived.

**Etki:** Hijyen residual. Elle çalıştırma: fail veya (kısmi match) zarar.

## OPTION ARCHIVE

Git history’de durur; tree’den `docs/archive/` veya silinmiş commit. F-045 kapanabilir (artifact arşiv).

**Etki:** Tree temiz. History korur. Change-contract path güncellemesi.

## OPTION REMOVE

Working tree sil. F-045 CLOSED (cjs gibi).

**Etki:** History durur. Docs path kırılır (TV audit “ui/other” satırları). SAFE_TO_REMOVE listesi 0 idi; bu **karar sonrası** silme.

**Runtime:** 0. **Test:** 0 (script test edilmiyor). **Migration:** yok.

## OPTION REWRITE

Güncel `items.js` API’sine npm/node script. F-045 “yama” olmaktan çıkar; maintenance aracı olur.

**Etki:** Yeni ürün kararı (TV ekleme workflow). High cost; mevcut Item zaten kodda.

## DO NOTHING

KEEP ile aynı kod. F-045 OPEN. MA-019 açık. Residual: yanlış “bu script ile TV ekle”.

## Eksenler (seçim değil)

| Eksen | Seçenek |
| --- | --- |
| Mevcut davranışla en uyumlu | KEEP / DO NOTHING (çalışmıyorlar) |
| En az migration | KEEP |
| En az regression | KEEP / REMOVE / ARCHIVE (runtime 0); REWRITE en riskli |
| En temiz uzun vadeli model | REMOVE veya ARCHIVE (stale rewriter yok); REWRITE yalnız bilinçli araç kararı |

Blok: MA-019, MA-020, F-045. WP-09.
