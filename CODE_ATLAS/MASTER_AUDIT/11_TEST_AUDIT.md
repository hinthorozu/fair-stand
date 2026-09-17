# 11 — Test audit

Unit: `test/` + `tests/` (2 dosya). E2E: 26 spec. `npm test` son yeşil: 777 (önceki cleanup turu).

## Kritik production flow

| Flow | Unit | E2E | Not |
| --- | --- | --- | --- |
| Katalog list/drag | COVERED | smoke + item contracts | |
| State factory | COVERED `moduleStateConstructionRegistry` | f010 | |
| Placement/snap/collision | COVERED | f011, ghost, free-props | |
| Context menu | PARTIAL | PARTIAL | |
| Save/load/delete | PARTIAL integration | f020, f023 | |
| Import zip | COVERED validation | project-import-validation | |
| Renderer scene3d.js | **NO_COVERAGE dosya unit** | PARTIAL smoke/item | hotspot |
| BOM expandRecipe | COVERED | **NO_COVERAGE** (DEV UI) | |
| Floor | COVERED | floor-items-contract | |
| Auto wall/depot | COVERED unit | PARTIAL | featureContracts runtime yok |
| Inner-corner BOM | COVERED | yok | helper Item path |
| Save guard | COVERED | f020 | HTML entry |

## Test production semantiği

| Test yüzeyi | Production ile aynı mı? |
| --- | --- |
| `getRecipeInnerCornerPanelKey` helper | cleanup sonrası composition path — evet (Item verilirse) |
| `recipeView.variants` | production’da yok; test projeksiyonu — **helper’ın kendisi değil**, view API |
| `recipeParentItemKey(type,width)` | string birleştirme; production `ITEMS` — **yaklaşık**; yanlış key test fail eder |
| `resolveModuleContract` | production BOM/behavior okumaz — **kendi sözleşmesini** test eder |
| `createGroundLayout` | production sahne yok — TEST_ONLY |
| `resolveAdjacentPlacement` | production insert değil; reflow ile karşılaştırma | PARTIAL sapma koruması |
| connectorBom | production API çağırmaz | TEST_ONLY |

## TEST_ONLY production path yok

groundLayout, cornerPlacement, moduleContracts, featureContracts, connector BOM API, recipeView.variants, `tests/` (2 dosya; FEATURE_CONTRACTS path `tests/autoDepot.test.js`).

## Gap özeti

1. `scene3d.js` unit yok — HIGH bakım / MEDIUM regression.
2. BOM e2e yok.
3. Governance dosyaları runtime’ı doğrulamaz.
4. İki test kökü `test/` + `tests/`.
