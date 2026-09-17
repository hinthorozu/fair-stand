# Master Audit — Yönetici özeti

**Repo:** fair-stand  
**Dal:** `RefactorItem`  
**Tarih:** 2026-09-17  
**GitNexus:** `fair-stand`, commit `8e9950b`, indeks `2026-09-17T20:06:24.591Z`, 906 dosya, 13482 sembol, 24665 ilişki, 543 process, 166 community. `incomplete_reasons: []`.  
**Döngü:** GitNexus `check({cycles:true})` `status: clean`, `cycleCount: 0`. `knip-cycles.json` `issues: []`.  
**Kaynak kod:** bu turda değiştirilmedi. Yalnız `CODE_ATLAS/MASTER_AUDIT/*.md` yazıldı.

Kanıt = graph (`impact`/`context`/`cypher`/`query`) + `src/` okuma + `knip-report.json` + `package.json`/CI. Knip ve GitNexus sıfır caller tek başına unused sayılmaz.

## Sistem (tek cümle)

Vite + Three.js tarayıcı stand konfigüratörü. Kanonik ürün `src/items.js` `ITEMS` (96 kayıt). Orkestrasyon `src/main.js` + `index.html`. Sahne `src/scene3d.js` `createStandScene`. Persist IndexedDB.

## En önemli hükümler

1. **CONFIRMED runtime bug (veri kaybı) bu taramada yok.** Hub riski (`getItem` CRITICAL) bug değildir.
2. **HIGH:** BOM/recipe kodu var; kullanıcıya açık maliyet UI yok (`DEV && ?rawBom`). `moduleContracts` / `featureContracts` runtime grafına girmez. `cornerPlacement` production insert’e bağlı değil.
3. **Item:** 27 top-level alan. `shelfCount` ve `sizeInch` runtime Item’da 0. `static.*` JS path değil.
4. **Cleanup (önceki tur):** `patch-video-wall-*.cjs` silindi; src `getRecipeInnerCornerPanelKey` kaldırıldı. Kalan stale: Python yama betikleri, `tvConfig.js` doc ghost.
5. **Knip:** `e2e/*.spec.mjs` + `playwright.config.mjs` unused file diye işaretli → **USED** (Playwright `testDir`).

## Severity sayımı

`14_FULL_FINDINGS_TABLE.md` içindeki satırlar: CRITICAL 0, HIGH 8, MEDIUM 12, LOW 14, INFO 6.

## Rapor dosyaları

`01`–`14` + `FINAL_MASTER_AUDIT.md`. Bu özet.
