# 13 — Legacy / stale

| Tür | Kanıt | Sınıf |
| --- | --- | --- |
| patch-video-wall-2x2/single-image.cjs | cleanup silindi; change-contract affectedFiles’te silinen path | SCRIPT_ONLY_STALE (kapanmış) |
| add-tv-sizes.py, add-video-wall-2x2.py, fix-tv-screen-face.py | package.json/CI yok; docs/roadmap | SCRIPT_ONLY_STALE |
| video-wall-build-trigger.txt | roadmap listesi | SCRIPT_ONLY_STALE |
| tvConfig.js | src yok; current-system TV MD, A02 | stale docs |
| static.shelfCount / catalog.sizeInch | runtime 0 | stale docs |
| getRecipeInnerCornerPanelKey src | silindi; property audit “src read” kalabilir | stale docs |
| recipeView.variants | eski recipe.variants tablosu izi | test projection |
| getConnectorItemKey | eski BOM API | TEST_ONLY |
| F-045 OPEN | kalan py yamalar | hygiene |
| change-contract id `item-composition-inner-corner` | dal-seviye; silinen patch path’leri listede | obsolete rows + güncel cleanup notu |
| SYSTEM_AUDIT_CHECKLIST A02.04 GAP tvConfig | checklist | stale |
| test/ + tests/ | iki kök | legacy layout |
| Knip raporu patch cjs | indeks/knip anı | rapor stale olabilir |

Compatibility branch (kod): `resolveSceneDimensions` sceneDimensions ?? dimensions — kasıtlı, legacy remap yok.

Eski API: `createTvCatalogItem` src 0.
