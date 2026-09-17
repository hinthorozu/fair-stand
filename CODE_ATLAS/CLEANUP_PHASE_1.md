# Cleanup phase 1

**Tarih:** 2026-09-17  
**Kaynak:** `CODE_ATLAS/AUDIT_VERIFICATION.md`  
**Commit/push:** yok

Bu tur yalnız doğrulanmış cleanup. Genel refactor yok. `src/groundLayout.js`, `src/cornerPlacement.js`, `src/featureContracts.js`, `src/moduleContracts.js` dokunulmadı.

GitNexus (pre-edit): repo `fair-stand`, indeks `8e9950b` / `2026-09-17T19:06:27.473Z`. `impact({target: "getRecipeInnerCornerPanelKey", direction: "upstream", includeTests: true})` → `impactedCount: 0`, `risk: UNKNOWN`. UNKNOWN grep ile kapatıldı: `src/` caller/import 0; `itemBom.js` yalnız `expandRecipe`, `getRecipeItemKey`; testler src export’u import etmiyor.

---

## Silinen dosyalar

- `scripts/patch-video-wall-2x2.cjs`
- `scripts/patch-video-wall-single-image.cjs`

Sınıf (doğrulama): `SCRIPT_ONLY_STALE`.

## Kaldırılan symbol/export

- `src/moduleRecipes.js` `export function getRecipeInnerCornerPanelKey`
- `expandRecipe` / `resolveRecipeItemsForPanelVariant` içindeki `item.composition.innerCorner?.panelItemKey` **değişmedi**

## Düzeltilen stale path referansları

Silinen script path’i artık canlı envanter olarak durmuyor:

- `RELEASE_HARDENING_ROADMAP.md` §8 listesi
- `audit/evidence/A21_REPOSITORY_HYGIENE_GOVERNANCE.md` F-045 örneği (`add-video-wall-2x2.py` / `add-tv-sizes.py`)
- `docs/items/audit/items/TV_42.md`, `TV_55.md`, `TV_65.md`, `VIDEO_WALL_2X2.md`
- `docs/items/audit/report/ITEM_SYSTEM_AUDIT.md`
- `docs/items/audit/report/ITEM_SYSTEM_AUDIT.html`
- `docs/items/audit/report/audit-data.json`
- `CODE_ATLAS/01_ENTRY_POINTS.md`, `08_UNUSED_CANDIDATES.md`, `09_BROKEN_SUSPICIOUS.md`, `10_DUPLICATES_LEGACY.md`, `FINAL_AUDIT.md` ve ilgili atlas satırları

Kasıtlı kalan path:

- `.github/change-contract.json` `impactAnalysis.affectedFiles` — silinen guarded dosyalar diff’te durduğu için listede kaldı
- `CODE_ATLAS/AUDIT_VERIFICATION.md` — audit anı kaydı; üstte cleanup pointer

F-045 OPEN kaldı: diğer tek-seferlik betikler (`add-tv-sizes.py` vb.) duruyor.

## Test helper

`test/recipeParentItemKey.js` `getRecipeInnerCornerPanelKey` `variants.innerCornerPanelItemKey` fallback’i kaldırıldı.

**Neden:** Production yalnız `item.composition.innerCorner?.panelItemKey` okur. Fallback bağımsız bir production contract değildi.

**Kanıt (kaldırılmayan parça):** `recipeView.variants.innerCornerPanelItemKey` duruyor. `test/showcaseRecipes.test.js`, `test/panel197ItemContract.test.js`, `test/straightPanelsItemContract.test.js` ve contract testleri bu view alanını doğrudan assert eder. Bu test-view projeksiyonu; helper’ın ikinci path’i değil.

Testler helper’a artık parent Item verir (`getItem(...)` / `recipeParentItem(...)`), recipe view değil.

## Source/runtime davranış

Değişmedi.

- Catalog/runtime Item kayıtları aynı
- `expandRecipe` inner-corner swap aynı
- `itemBom.resolveItemBom` import yüzeyi aynı (`expandRecipe`, `getRecipeItemKey`)
- Renderer/state/placement dokunulmadı
- Dokunulmayan dosyalar: `src/groundLayout.js`, `src/cornerPlacement.js`, `src/featureContracts.js`, `src/moduleContracts.js`

GitNexus `detect_changes({scope: "all"})`: `risk_level: low`, `affected_processes: []`. İndeks silinen src export’u henüz yeniden analiz etmedi; pre-edit impact + grep geçerli.

## Validation

| Komut | Sonuç |
| --- | --- |
| `npm run syntax:check` | geçti |
| `node --test test/moduleRecipes.test.js test/cornerPanelsItemContract.test.js test/panelCorner192ItemContract.test.js test/showcaseRecipes.test.js test/panel197ItemContract.test.js test/straightPanelsItemContract.test.js test/recipeCompositionItemsContract.test.js` | 43/43 geçti |
| `npm test` | 777/777 geçti |
| `npm run build` | geçti (`vite build`, 65 module) |
| `CHANGE_GATE_BASE=HEAD npm run contract:verify` | kabul: `item-composition-inner-corner`; guarded 8 dosya; domain `architecture, bom, tests` |
| Varsayılan `npm run contract:verify` (base `origin/Version2`) | bu cleanup’tan önce de dal `src/main.js` / `src/scene3d.js` vb. içeriyor; mevcut contract o domain’leri `not-applicable` tutuyor. Bu turda o beyanlar şişirilmedi. |
| Targeted E2E `e2e/smoke.spec.mjs` | çalıştırılmadı: Playwright bu checkout’ta yüklü değil (`e2e:deps` paket ekler). Runtime BOM/UI değişmedi. |

## Diff notu

Bu cleanup’ın HEAD diff’i: silinen iki script, `src/moduleRecipes.js` export kaldırma, test helper + 3 test, docs/roadmap/A21/audit report path düzeltmeleri, change-contract discovery güncellemesi, `CODE_ATLAS/*` notları.

`AGENTS.md` GitNexus footer’ı bu turda üretilmedi; önceki kirli working tree. `src/groundLayout.js` / `cornerPlacement.js` / `featureContracts.js` / `moduleContracts.js` diff’te yok.

Commit/push yok.
