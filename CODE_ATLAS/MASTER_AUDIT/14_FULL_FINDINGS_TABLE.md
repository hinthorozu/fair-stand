# 14 — Full findings table

Confidence: CONFIRMED = graph+source. HIGH = güçlü tarama, dinamik boşluk mümkün. MEDIUM/UNCERTAIN = belirtilir.

| ID | Severity | Category | File | Symbol/Field | Evidence | Runtime Impact | Confidence | Recommended Action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MA-001 | HIGH | data-flow | src/itemBom.js | resolveItemBom | impact 1 caller rawBomDebug; main DEV ?rawBom | Kullanıcı BOM görmez | CONFIRMED | Ürün kararı: BOM UI veya bilinçli DEV-only |
| MA-002 | HIGH | contract | src/moduleContracts.js | resolveModuleContract | impact 19 test, 0 process, 0 src import | Runtime BOM/behavior bu SoT’u okumaz | CONFIRMED | Ya runtime bağla ya SoT tablosunu netleştir |
| MA-003 | HIGH | orphan | src/featureContracts.js | getFeatureContract | context incoming 1 test; process [] | Planners contracts’suz | CONFIRMED | Aynı |
| MA-004 | HIGH | duplicate | src/cornerPlacement.js | resolveAdjacentPlacement | 2 test; prod wallReflow | Yanlış köşe yerleşimi gizlenebilir | HIGH | Tek planner veya test=prod bağ |
| MA-005 | HIGH | mismatch | src/moduleRecipes.js | composition.innerCorner.panelItemKey | docs recipe.innerCornerPanelItemKey; test variants | Ad karışıklığı; değer kopya | CONFIRMED | Docs JS path’e çek |
| MA-006 | HIGH | unread | src/items.js | composition.moduleType / composition.options | nested walk var; src grep 0 (itemBom yalnız mode) | Ölü master alan | CONFIRMED | Oku veya kaldır (ürün kararı) |
| MA-007 | HIGH | mismatch | src/itemCapabilities.js | getItemSurfaceCapabilities | yalnız door-leaf true | Docs capabilities geniş | HIGH | Map’i gerçek yüzeylerle hizala |
| MA-008 | HIGH | hotspot | src/scene3d.js | createStandScene | impact LOW 1 caller; dosya 154–4834 | Renderer regression | CONFIRMED | Unit/seçilmiş renderer test; impact LOW’a aldanma |
| MA-009 | MEDIUM | orphan | src/groundLayout.js | createGroundLayout | IMPORTS 1 test; scene3d 0 | Sahne grid yok | CONFIRMED | Sahneye bağla veya TEST_SUPPORT diye belge |
| MA-010 | MEDIUM | test | src/scene3d.js | — | dosya-seviye unit yok | Renderer boşluğu | CONFIRMED | Targeted unit/e2e |
| MA-011 | MEDIUM | test | src/itemBom.js | resolveItemBom | e2e BOM yok | DEV-only | CONFIRMED | Browser BOM veya bilinçli skip |
| MA-012 | MEDIUM | test | test/ + tests/ | iki kök | glob + FEATURE_CONTRACTS path | keşif karışıklığı | CONFIRMED | Tek kök |
| MA-013 | MEDIUM | unused | src/items.js | getConnectorItemKey | yalnız connectorBom.test.js | Data live, API test | CONFIRMED | API sil veya BOM’a bağla |
| MA-014 | MEDIUM | data-flow | test/recipeParentItemKey.js | recipeView.variants | composition yok | Test view ≠ Item | CONFIRMED | View’i belgele; production sanma |
| MA-015 | MEDIUM | gate | .github/change-contract.json | impact domains | Version2 diff main/scene3d; behavior not-applicable | Local gate vs Version2 | HIGH | Dal contract’ını gerçek diff ile hizala |
| MA-016 | MEDIUM | data-flow | src/standDimensions.js vs stripOccupancy | stripCount 7 vs Item 1–2 | iki kavram | Karışırsa overlay | MEDIUM | İsimlendir/belgele |
| MA-017 | MEDIUM | duplicate | src/items.js | visualRotationYDeg vs modelRotationYDeg | ikisi ITEMS | çift rotation | HIGH | Tek kural |
| MA-018 | MEDIUM | unused | src/standCapacity.js | STAND_AXES export | context incoming {}; iç includes | Dış import 0 | CONFIRMED | Export’u daralt (opsiyonel) |
| MA-019 | MEDIUM | hygiene | scripts/*.py | add-tv-sizes vb. | package.json/CI yok | Elle çalışırsa zarar | HIGH | Sınıflandır/sil (F-045) |
| MA-020 | MEDIUM | docs | audit A21 F-045 | OPEN | py kaldı | hijyen | CONFIRMED | Finding kapatma kararı |
| MA-021 | LOW | docs | docs/items/audit | static.shelfCount | Item shelfCount 0 | docs yalan | CONFIRMED | MD güncelle |
| MA-022 | LOW | docs | docs catalog.sizeInch | src sizeInch 0 | TV dimensions | CONFIRMED | MD güncelle |
| MA-023 | LOW | docs | static.* | src item.static 0 | notation | CONFIRMED | “docs katmanı” diye işaretle |
| MA-024 | LOW | docs | src/tvConfig.js | dosya yok | A02/TV MD | CONFIRMED | Path sil |
| MA-025 | LOW | docs | getRecipeInnerCornerPanelKey src | export silindi | property MD | HIGH | Audit MD |
| MA-026 | LOW | knip | e2e/*.spec.mjs | unused file | Playwright testDir | CONFIRMED | Knip ignore |
| MA-027 | LOW | knip | playwright.config.mjs | unused file | npm run e2e | CONFIRMED | ignore |
| MA-028 | LOW | script | video-wall-build-trigger.txt | roadmap | tetik | CONFIRMED | sil veya belgele |
| MA-029 | LOW | export | PROJECT_ARCHIVE_VERSION | knip unused | iç ACCESS | CONFIRMED | export bırakılabilir |
| MA-030 | LOW | layout | tests/*.js | 2 dosya | FEATURE_CONTRACTS | CONFIRMED | taşı |
| MA-031 | LOW | stale | change-contract affectedFiles | silinen cjs path | diff silme | CONFIRMED | commit sonrası doğal |
| MA-032 | LOW | unused | validateImported* export | knip | iç CALLS | CONFIRMED | dokunma |
| MA-033 | LOW | docs | SYSTEM_AUDIT_CHECKLIST A02.04 | tvConfig GAP | dosya yok | CONFIRMED | checklist |
| MA-034 | LOW | cleanup | patch-video-wall cjs | silindi | CLEANUP_PHASE_1 | CONFIRMED | commit |
| MA-035 | INFO | hotspot | src/items.js | getItem | impact CRITICAL 60/79 | hub | CONFIRMED | değişiklik kapısı |
| MA-036 | INFO | hotspot | src/moduleBehavior.js | getModuleBehavior | CRITICAL 21/45 | hub | CONFIRMED | kapı |
| MA-037 | INFO | hotspot | createModuleStateFromDescriptor | CRITICAL 4/5 | state | CONFIRMED | kapı |
| MA-038 | INFO | graph | cycles | 0 | yok | CONFIRMED | — |
| MA-039 | INFO | runtime | new Worker | 0 | yok | CONFIRMED | — |
| MA-040 | INFO | catalog | CATALOG_PREVIEW_RENDERERS | string key | USED whitelist | HIGH | graph CALLS eksik olabilir |
