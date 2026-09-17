# 04 — Item field matrix

**Kaynak:** `listRegisteredItems()` 2026-09-17 (96 Item). Nested walk `composition.items` array içeriği hariç.  
**Yazma:** `ITEMS` `Object.freeze` — runtime master yazılmaz. State kopyası `designState.js`.  
**`static.*`:** `src/**/*.js` içinde `item.static` yok. Audit MD katman adı.

Okuma sınıfları: **P** production `src/` (main grafı veya DEV BOM), **T** test, **D** docs-only.

| Field (JS path) | Şekil | #Item | DEFINED | READ P | READ T | Runtime flow | Test | Unread? | Başka SoT | Docs uyumu |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `itemKey` | string | 96 | ITEMS key+alan | getItem, catalog, BOM, persist | contract | tüm | COVERED | hayır | yok | evet |
| `name` | string | 96 | ITEMS | catalog `label`, selection | contract | UI | PARTIAL | hayır | yok | evet |
| `type` | string | 96 | ITEMS | factories, behavior, import types | COVERED | factory seçimi | COVERED | hayır | moduleContracts type (test) | evet |
| `catalogVisible` | bool | 96 | ITEMS | catalog filter | catalog tests | sidebar | COVERED | hayır | yok | evet |
| `catalogCategory` | string | 96 | ITEMS | catalog groups | COVERED | kategori | COVERED | hayır | CATALOG_CATEGORIES | evet |
| `catalogItemIndex` | number | 96 | ITEMS | catalog sort | COVERED | sıra | COVERED | hayır | yok | evet |
| `catalogPreview` | string | 58 | ITEMS | sidebar renderer map | COVERED | preview | COVERED | false olanlarda yok (kasıtlı) | CATALOG_PREVIEWS | evet |
| `dimensions.*` | {widthCm,depthCm,heightCm,lengthCm,thicknessCm,mountHeightCm,wallGapCm} | 90 | ITEMS | resolveSceneDimensions, LED mount, wallGap | COVERED | ghost/placement | COVERED | 6 Item dimensions yok (video wall depth-only vb.) | sceneDimensions override | evet |
| `sceneDimensions.*` | {widthCm,depthCm,heightCm} | 32 | ITEMS | `sceneDimensions ?? dimensions` | itemSceneDimensions | sahne zarfı | COVERED | yoksa fallback | dimensions | evet |
| `unit` | string | 46 | ITEMS | resolveItemBom leaf throw | BOM tests | DEV BOM | COVERED | 50 Item’da yok (composite/catalog) | yok | furniture cluster BOM kapalı — kasıtlı |
| `material` | string | 34 | ITEMS | theme / appearance | PARTIAL | default görünüm | PARTIAL | 62’de yok | surface.color override | evet |
| `defaultColor` | string | 30 | ITEMS | designState surface default | PARTIAL | renk | PARTIAL | 66’de yok | surface | evet |
| `composition.mode` | `'recipe'` / cluster | 30 | ITEMS | itemBom `mode !== 'recipe' → null` | COVERED | BOM expand | COVERED | hayır | moduleContracts.bom.mode (test) | **farklı SoT** |
| `composition.items` | [{itemKey,quantity}] | 30 | ITEMS | expandRecipe | COVERED | BOM | COVERED | hayır | test recipeView.items | evet |
| `composition.innerCorner.panelItemKey` | string | inner set | ITEMS | expandRecipe inline | helper + contracts | inner-corner BOM | COVERED | hayır | test `recipeView.variants.innerCornerPanelItemKey` | path farklı, değer kopya |
| `composition.innerCorner.itemReplacements` | array | inner set | ITEMS | applyVariantItemReplacements | COVERED | BOM | COVERED | hayır | test variants.innerCornerItemReplacements | aynı |
| `composition.moduleType` | string | composition set | ITEMS | **src okuma 0** | test helper recipeParentItemKey | yok | PARTIAL (view) | **P unread** | test recipeId | docs recipe.moduleType |
| `composition.options.shape` | `'L'` | L-counter parents | ITEMS | **src composition.options okuma 0** | getModuleRecipe options | identity `item.shape` | COVERED shape | options P unread; `shape` okunur | item.shape | docs static.composition.options |
| `nominalModuleWidthCm` | number | 23 | ITEMS | expandRecipe panel eşlemesi | COVERED | inner-corner swap | COVERED | hayır | type+width test helper | evet |
| `panelRole` | `'straight'`/`'inner-corner'` | 8 | ITEMS | expandRecipe | COVERED | BOM variant | COVERED | hayır | yok | evet |
| `modelFile` | string | 9 | ITEMS | scene3d GLB | PARTIAL e2e | loadGltf | PARTIAL | 87 yok | yok | evet |
| `modelRotationYDeg` | number | 5 | ITEMS | scene3d / resolveItemKey | PARTIAL | GLB | PARTIAL | hayır | yok | evet |
| `preserveModelScale` | bool | 5 | ITEMS | scene3d | PARTIAL | GLB | PARTIAL | hayır | yok | evet |
| `visualRotationYDeg` | number | 3 | ITEMS | scene3d/catalog preview | PARTIAL | görsel | PARTIAL | hayır | modelRotationYDeg | iki rotation alanı |
| `paintable` | bool | 5 | ITEMS | floor renderer + floor helpers | COVERED | zemin | COVERED | yalnız floor | yok | evet |
| `shape` | `'L'` | 3 | ITEMS | resolveItemKey, counter factory, scene3d | COVERED | L banko | COVERED | düz bankoda yok | composition.options.shape (unread) | evet |
| `stripOccupancy.align` | `'top'` | 8 | ITEMS | resolveModuleStripOccupancy | COVERED | overlay | COVERED | hayır | moduleState kopyası | evet |
| `stripOccupancy.stripCount` | 1\|2 | 8 | ITEMS | aynı | COVERED | overlay | COVERED | hayır | STAND_DIMENSIONS.stripCount=7 (stand, item değil) | evet |
| `connectorType` | string | 4 | ITEMS | getConnectorItemKey **yalnız test + kendi dosya** | connectorBom.test.js | recipe items hâlâ connector Item taşır | TEST_ONLY API | P: data USED, API TEST_ONLY | composition.items itemKey | evet data |
| `variant` | string | 8 | ITEMS | resolveItemKey identity | COVERED | kimlik | COVERED | hayır | yok | evet |
| `eyeCount` | number | 2 | ITEMS | showcase factory/catalog | COVERED | vitrin | COVERED | hayır | yok | evet |
| `bodyItems.{side,horizontal,glassShelf}ItemKey` | string | 2 | ITEMS | getShowcaseBodyDefinition | COVERED | showcase renderer | COVERED | hayır | yok | evet |
| `videoWall.rows/cols` | number | 2 | ITEMS | designState + scene3d createTvModule | COVERED | video wall mesh | COVERED | hayır | state videoWallRows/Cols | evet |
| `videoWall.panelItemKey` | string | 2 | ITEMS | resolveWallMediaMetrics + scene3d getItem | COVERED | panel ölçü | COVERED | hayır | VIDEO_WALL_PANEL Item | evet |
| `shelfCount` | — | **0** | yok | yok (yorum satırı) | descriptor verilince null | yok | shelfCatalogPanelSeam | N/A | **docs static.shelfCount stale** | **docs ≠ runtime** |
| `sizeInch` | — | **0** | yok | `src/` 0 eşleşme | docs catalog.sizeInch | TV ölçü `dimensions` | docs | N/A | **docs catalog.sizeInch stale** | **docs ≠ runtime** |
| `item.static.*` | — | 0 | yok | 0 | audit MD | yok | property audit | N/A | docs notation | docs only |

## Type dağılımı (kanıt)

bar-stool 1, base 3, base-top 3, chair 1, coat-rack 1, coffee-table-classic 1, connector 4, counter 6, counter-top 6, door 1, door-leaf 1, flat-panel 12, floor 5, illuminated-foam 1, indoor-plant-1 4, kettle 1, led-floodlight 1, mini-fridge 1, panel 8, plastic-trash-bin 1, profile 4, separator 4, separator-panel 2, shelf 3, shelf-accessory 1, showcase-2 1, showcase-3 1, showcase-accessory 1, showcase-board 3, sofa-* 3, table-chair-set-eames 1, table-glass 1, tv 5, upright 3, video-wall-panel 1.

## Registry yazma

Yok. Yeni Item yalnız kaynak değişikliği.

## Consumer yok / producer yok

- **Consumer yok (P):** `composition.moduleType`, `composition.options` (shape Item `shape` üzerinden gider).
- **Producer yok (runtime Item):** `shelfCount`, `sizeInch`, `static.*`.
- **Docs producer / runtime consumer yok:** `catalog.sizeInch`, `static.shelfCount`, `recipe.innerCornerPanelItemKey` (docs adı; runtime `composition.innerCorner.panelItemKey`).
