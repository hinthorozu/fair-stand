# 01 — Applied work packages

## WP-01 CHANGE GATE — APPLIED

**Finding:** MA-015, MA-031

**Doğrulama:** `changedFilesFromEnvironment` GitHub `push` `before..after` penceresi `CHANGE_GATE_BASE` varken birikmiş Version2 yüzeyini gizliyordu. `src/main.js` / `src/scene3d.js` / `src/helpGuide.js` path-zorunlu domain’leri contract’ta `not-applicable` idi. Silinen `patch-video-wall-*.cjs` `affectedFiles`’te stale kaldı.

**GitNexus:** `changedFilesFromEnvironment` upstream LOW (1). Verify tasarımı değişmedi; base seçimi ve beyan hizası.

**Patch:**
- `scripts/verify-change-contract.mjs`: `CHANGE_GATE_BASE` set ise GitHub event penceresi kullanılmaz.
- `.github/workflows/ci.yml`: `RefactorItem` + `Version2`; `git fetch origin Version2`; `CHANGE_GATE_BASE=refs/remotes/origin/Version2`.
- `.github/change-contract.json`: path-zorunlu domain’ler `affected`; stale cjs çıkarıldı; discovery boşlukları kapatıldı.
- `SYSTEM_CHANGE_GATE.md` CI metni.
- Test: `systemChangeGateCiContract`, `systemChangeGateLocalDiff` (GitHub event override).

**Validation:** targeted gate testleri + `npm run contract:verify` (Version2) geçti.

## WP-05 INNER CORNER NAMING — APPLIED

**Finding:** MA-005, MA-014, MA-025

**Karar:** Runtime path `composition.innerCorner.panelItemKey` canonical kaldı. `expandRecipe` dokunulmadı. Serialized-project alanı yok.

**GitNexus:** `getModuleRecipe` CRITICAL 31 test caller. `recipeView` additive: `composition.innerCorner` eklendi; `variants` TEST_PROJECTION kopyası duruyor.

**Patch:** test helper + contract assert’leri canonical path; property MD STALE; `ITEM_CAPABILITY_INVENTORY` path. current-system dump’ları toplu rename edilmedi.

## WP-08 HOTSPOT PROTECTION — APPLIED

**Finding:** MA-010 (MA-008/035/036/037 bağlam; refactor yok)

**Patch:** `test/scene3dPublicContract.test.js` — `createStandScene` public façade method listesi + `main.js` çağrıları. WebGL yok. `scene3d.js` değiştirilmedi.

## WP-06 — PARTIALLY_APPLIED

**Uygulanan (docs STALE, ACTION_REQUIRED kesin):** MA-021, MA-022, MA-023  
**Skip:** MA-006 / MA-013 (DECISION-06 / DECISION-08). SCHEMA_ONLY alan ve connector API kaldırılmadı.

## WP-07 — PARTIALLY_APPLIED

**Uygulanan:** MA-012, MA-030 — `tests/autoDepot.test.js` → `test/autoDepot.test.js`; `tests/moduleBehavior.test.js` → `test/moduleBehavior.test.js`; `FEATURE_CONTRACTS.automaticDepot.tests.regressionFiles` güncellendi.  
**Skip:** MA-004, MA-009 (DECISION-05, DECISION-04). `groundLayout.js` / `cornerPlacement.js` silinmedi.

## WP-09 — PARTIALLY_APPLIED

**Uygulanan:** MA-024, MA-033 (tvConfig ghost); MA-028 (SCRIPT_ONLY_STALE belgelendi, silinmedi).  
**Skip:** MA-019 / MA-020 (DECISION-07) Python yama betikleri silinmedi.
