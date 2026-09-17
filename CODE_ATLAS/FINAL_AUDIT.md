# Final Audit

**Repo:** fair-stand (`C:\Users\hinthorozu\Kyrox\fair-stand\fair-stand-atlas`)  
**Dal:** `RefactorItem`  
**GitNexus:** 13263 sembol, 24484 ilişki, 542 process, indeks `2026-09-17T19:06:27.473Z`, commit `8e9950b`.  
**Kaynak kod değişikliği:** bu analiz yalnız `CODE_ATLAS/*.md` üretti.

Analiz tamamlandı. Knip tek başına hüküm değil.

## Döngüler

GitNexus `check`: `status: clean`, `cycleCount: 0`. `knip-cycles.json`: `issues: []`. **Circular dependency yok.**

## Knip öncelikli adaylar — hüküm

| Aday | Status | Tek cümle |
| --- | --- | --- |
| `STAND_AXES` | USED (iç); export dışarı ölü | `validateStandAxisCapacity` kullanır |
| `PROJECT_ARCHIVE_VERSION` | USED (iç) | import/manifest sürüm kontrolü |
| `validateImportedModuleState` | USED (iç) | `validateImportedProjectState` → zip import |
| `validateImportedStandState` | USED (iç) | aynı zincir + floor Item |
| `getRecipeInnerCornerPanelKey` | TEST_ONLY → src export silindi | production `expandRecipe` inline okur; test helper composition path’e hizalandı |
| `e2e/*.spec.mjs` + `playwright.config.mjs` | USED | Playwright `testDir: './e2e'` |
| patch-video-wall `*.cjs` | silindi | `CODE_ATLAS/CLEANUP_PHASE_1.md` |

---

## UNUSED / DEAD CODE

| Candidate | File | Symbol | Type | GitNexus Evidence | Knip Evidence | Runtime/Test Evidence | Status | Removal Risk |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Playwright config | `playwright.config.mjs` | — | file | config, process değil | unused file | `npm run e2e` / CI | USED | n/a — silinemez |
| E2E specs (26) | `e2e/*.spec.mjs` | — | file | E2e community | unused file each | Playwright testDir | USED | n/a |
| Video wall patch | `scripts/patch-video-wall-2x2.cjs` | — | file/script | silindi | unused file | `CLEANUP_PHASE_1.md` | silindi | n/a |
| Video wall patch 2 | `scripts/patch-video-wall-single-image.cjs` | — | file/script | silindi | unused file | aynı | silindi | n/a |
| Stand axes export | `src/standCapacity.js` | `STAND_AXES` | const export | context incoming empty; impact 0 UNKNOWN | unused export | iç `includes(axis)`; dış import 0 | USED (internal) | Export kaldırma düşük; sembol silme `validateStandAxisCapacity` kırar |
| Archive version export | `src/projectImportValidation.js` | `PROJECT_ARCHIVE_VERSION` | const export | accesses 2 iç fonksiyon | unused export | import/export zip | USED (internal) | Export kaldırma düşük |
| Import module validate export | `src/projectImportValidation.js` | `validateImportedModuleState` | function export | CALLS from `validateImportedProjectState`; impact → main | unused export | zip import iç zincir; test `validateImportedProjectState` | USED (internal) | Export kaldırma düşük; fonksiyon silme import kırar |
| Import stand validate export | `src/projectImportValidation.js` | `validateImportedStandState` | function export | CALLS same | unused export | floor+setup | USED (internal) | aynı |
| Inner-corner helper | `src/moduleRecipes.js` | `getRecipeInnerCornerPanelKey` | function export | incoming CALLS 0 | unused export | src export silindi; test helper composition path | silindi | n/a |
| Ground layout | `src/groundLayout.js` | `createGroundLayout` | file/function | callers: test only; process [] | Knip raporlamadı (test import) | scene3d bağlı değil | TEST_ONLY | Unit test + change-gate path |
| Feature contracts | `src/featureContracts.js` | `FEATURE_CONTRACTS`, `getFeatureContract` | file | callers: 1 test; process [] | yok | docs zorunlu; runtime planner okumaz | TEST_ONLY | Development contract testleri |
| Module contracts | `src/moduleContracts.js` | `resolveModuleContract` | file | 19 CALLS hepsi test; prod IMPORTS 0 | yok | contract test hub | TEST_ONLY | Çok test |
| Corner placement | `src/cornerPlacement.js` | `resolveAdjacentPlacement` | file | 2 test callers | yok | prod insert başka dosya | TEST_ONLY | 2 test + olası davranış sapması gizlenir |
| Change contract | `src/systemChangeContract.js` | — | file | scripts+test IMPORTS | yok | CI `contract:verify` | SCRIPT_ONLY | CI kırılır |
| Connector BOM API | `src/items.js` | `getConnectorItemKey`, `resolveConnectorBom` | function | — | yok | yalnız `connectorBom.test.js` | TEST_ONLY | Test; recipe hâlâ connector Item taşır |
| Item BOM | `src/itemBom.js` | `resolveItemBom` | file/function | process RenderItemBom; CALLS 10 | yok | DEV `?rawBom` + unit tests | TEST_ONLY+DEV | Kullanıcı UI yok; test/BOM debug |
| Save guard | `src/projectActionSaveGuard.js` | `bindProjectActionSaveGuard` | file | graph test; HTML script | yok | `index.html` ikinci entry | USED | n/a |
| Playwright binary | — | `playwright` | binary | — | unused binary | `e2e:deps` + CI | USED | n/a |
| Python TV/video scripts | `scripts/archive/add-tv-sizes.py` vb. | — | script | change-contract paths | Knip JS odaklı | docs legacy | SCRIPT_ONLY | Stale |
| Duplicate helper | `test/recipeParentItemKey.js` | `getRecipeInnerCornerPanelKey` | test helper | — | yok | test | TEST_ONLY | Test only duplicate |

**PROVEN_UNUSED (silmeye güçlü, hiçbir bağ yok):** bu taramada **0**. En yakınları TEST_ONLY/`SCRIPT_ONLY` stale scriptler; test veya change-contract bağı var.

---

## BROKEN / SUSPICIOUS

| Finding | File | Evidence | Severity | Explanation |
| --- | --- | --- | --- | --- |
| Ground layout sahneye bağlı değil | `src/groundLayout.js` | GitNexus test-only; scene3d 0 referans | MEDIUM | MD “renderer yardımcısı” der; runtime kopuk |
| Feature contract runtime’da okunmuyor | `src/featureContracts.js` | prod import 0 | LOW | Governance vs çalışan planner |
| Module contract ikinci SoT | `src/moduleContracts.js` | 19 test importer, 0 src importer | MEDIUM | BOM/behavior runtime başka dosyada |
| Corner helper prod insert’te yok | `src/cornerPlacement.js` | 2 test; wallReflow/modulePlacement live | MEDIUM | Duplicate planner riski |
| Patch script eski catalog API | `scripts/patch-video-wall-2x2.cjs` | dosya silindi | n/a | `CLEANUP_PHASE_1.md` |
| `shelfCount` docs stale | audit MD vs items.js | runtime 0 alan | LOW | 2026-09-16 kaldırma; MD kaldı |
| `static.*` JS path değil | docs/items/audit | src `static.` 0 | INFO | Doküman katmanı |
| BOM kullanıcıya kapalı | `itemBom.js` / `main.js` | DEV && `rawBom` | MEDIUM ürün | Recipe kodu var, UX yok |
| Connector resolver ölü API | `items.js` | grep yalnız test | LOW | Data yaşar, API test-only |
| `tvConfig.js` doc ghost | audit remediation MD | `src/` dosya yok | LOW | Stale doc |
| İki test kökü | `test/` + `tests/` | glob | LOW | Keşif karışıklığı |
| Unresolved import | — | Knip unresolved [] | — | Kanıtlanmadı |
| Circular import | — | GitNexus cycleCount 0 | — | Yok |

---

## HOTSPOTS

| Symbol/Module | Reason | Incoming Dependencies | Outgoing Dependencies | Risk |
| --- | --- | --- | --- | --- |
| `getItem` | Item hub | 60 direct / 79 process (impact, tests off); 128 CALLS w/ tests | `ITEMS` | CRITICAL |
| `getModuleBehavior` | Behavior hub | 21 direct / 44 process | items, stripOccupancy, standDimensions | CRITICAL |
| `createModuleStateFromDescriptor` | State factory giriş | 4 direct / 5 process | factories, `resolveItemKey` | CRITICAL |
| `src/items.js` | 96 Item tek tablo | 88 file importers | — | CRITICAL |
| `src/scene3d.js` | Renderer+input tek dosya | 1 (`createStandScene` ← main) | 20 src + Three.js | HIGH (impact LOW yanıltır) |
| `src/main.js` | Orkestrasyon | HTML | 28 src | HIGH |
| `src/modulePlacement.js` | Snap/collision | 21 importers | behavior, items, strip | HIGH |
| `src/designState.js` | Factories | 45 importers | items, capabilities | HIGH |
| `resolveItemKey` | Identity | 25 CALLS | getItem, dimensions, shape | HIGH |
| `getCatalogItem` | Katalog | 51 CALLS | getItem | HIGH |
| `openConfiguratorDb` | Persist | 10 CALLS | IndexedDB | HIGH |
| `resolveModuleContract` | Test hub | 19 CALLS, 0 prod | items, behavior | LOW runtime |

---

## Item sistemi (kısa)

96 Item. 58 katalog görünür. 30 composition. 9 modelFile. 5 paintable (zemin). 3 shape. 8 stripOccupancy. **0 shelfCount.** `static.*` runtime yok.

---

## Test özeti

Unit: `test/` 184 + `tests/` 2. E2E: 26 spec, hepsi Playwright entry.  
En büyük boşluk: `scene3d.js` dosya-seviye unit test yok (PARTIAL e2e/modül). BOM e2e yok (DEV UI).

---

## Source değişikliği doğrulaması

Bu oturumda yazılanlar yalnız `CODE_ATLAS/` altı Markdown. `src/`, `test/`, `e2e/`, `scripts/`, `package.json` analiz amacıyla okundu, değiştirilmedi.
