# 02 — Item field health

Kaynak: `listRegisteredItems` 96 Item (MASTER_AUDIT 04) + bu tur `src/` grep + GitNexus ACCESSES/CALLS teyidi.  
Sınıflar: ACTIVE_RUNTIME | SERIALIZATION_ONLY | TEST_ONLY | GOVERNANCE_ONLY | SCHEMA_ONLY | STALE | UNKNOWN.

Proje blob’u Item master’ı taşımaz; factory Item’dan state üretir. SERIALIZATION_ONLY = yalnız persist edilen, runtime Item’da olmayan alan — bu listede yok.

| Field | Sınıf | Kanıt |
| --- | --- | --- |
| `itemKey` | ACTIVE_RUNTIME | `getItem`, catalog, persist, BOM |
| `name` | ACTIVE_RUNTIME | catalog label, selection, BOM UI |
| `type` | ACTIVE_RUNTIME | factories, behavior, import |
| `catalogVisible` / `catalogCategory` / `catalogItemIndex` / `catalogPreview` | ACTIVE_RUNTIME | catalog + preview map |
| `dimensions.*` | ACTIVE_RUNTIME | `resolveSceneDimensions` fallback, LED mount, wallGap |
| `sceneDimensions.*` | ACTIVE_RUNTIME | `sceneDimensions ?? dimensions` |
| `unit` | ACTIVE_RUNTIME | `resolveItemBom` leaf throw; composite/catalog’da yok kasıtlı |
| `material` / `defaultColor` | ACTIVE_RUNTIME | theme / surface default |
| `composition.mode` | ACTIVE_RUNTIME | `itemBom` `mode !== 'recipe' → null` |
| `composition.items` | ACTIVE_RUNTIME | `expandRecipe` |
| `composition.innerCorner.panelItemKey` | ACTIVE_RUNTIME | `resolveRecipeItemsForPanelVariant` |
| `composition.innerCorner.itemReplacements` | ACTIVE_RUNTIME | `applyVariantItemReplacements` |
| `composition.moduleType` | SCHEMA_ONLY | ITEMS ~28 recipe parent yazar; `src/` okuma 0; test okur |
| `composition.options.shape` | SCHEMA_ONLY | 3 L-banko `{ shape: 'L' }`; production `item.shape` |
| `composition.options.shelfCount` | STALE | Item’da yok; docs `static.composition.options.shelfCount` |
| `nominalModuleWidthCm` | ACTIVE_RUNTIME | inner-corner panel eşlemesi |
| `panelRole` | ACTIVE_RUNTIME | 8 panel; expandRecipe straight/inner-corner |
| `modelFile` | ACTIVE_RUNTIME | scene3d GLB |
| `modelRotationYDeg` | ACTIVE_RUNTIME | GLB rotation; designState kopya |
| `preserveModelScale` | ACTIVE_RUNTIME | 5 Item; designState + scene3d / autoDepot |
| `visualRotationYDeg` | ACTIVE_RUNTIME | görsel grup; `modelRotationYDeg` ile aynı anlam değil |
| `paintable` | ACTIVE_RUNTIME | floor |
| `shape` | ACTIVE_RUNTIME | 3 L-banko; `resolveItemKey`, counter factory, `createLCounterModule` |
| `stripOccupancy.align` | ACTIVE_RUNTIME | 8 short-up; `resolveModuleStripOccupancy` |
| `stripOccupancy.stripCount` | ACTIVE_RUNTIME | Item 1\|2; stand `STAND_DIMENSIONS.stripCount=7` ayrı kavram |
| `connectorType` | ACTIVE_RUNTIME (data) | 4 connector Item. Lookup API TEST_ONLY |
| `variant` | ACTIVE_RUNTIME | `resolveItemKey` |
| `eyeCount` | ACTIVE_RUNTIME | 2 showcase; factory + rawBomDebug parse |
| `bodyItems.sideItemKey` / `horizontalItemKey` / `glassShelfItemKey` | ACTIVE_RUNTIME | `getShowcaseBodyDefinition` |
| `videoWall.rows/cols/panelItemKey` | ACTIVE_RUNTIME | designState + scene3d |
| `shelfCount` | STALE | Item 0; test “yok”; docs static/catalog |
| `sizeInch` | STALE | src 0; TV `dimensions` |
| `item.static.*` | STALE | JS path yok; docs notation |
| Surface `capabilities.*` map | SCHEMA_ONLY (dar) | yalnız door-leaf color/image; glass/lightbox/mesh hiç true değil |
| `userData.acceptsImage` | ACTIVE_RUNTIME | scene3d hardcoded; capability map değil |
| `recipeView.variants.innerCornerPanelItemKey` | TEST_ONLY | production view yok |
| `moduleContracts.bom.*` | GOVERNANCE_ONLY | 19 test; src import 0 |
| `FEATURE_CONTRACTS` | GOVERNANCE_ONLY | 1 test |

## İstenen alanlar — runtime consumer

| Field | Consumer | Sonuç |
| --- | --- | --- |
| `shelfCount` | yok | STALE |
| `sizeInch` | yok | STALE |
| `composition.moduleType` | yok (P); test var | SCHEMA_ONLY |
| `composition.options.*` | yok (P); `shape` ayrı | SCHEMA_ONLY |
| Surface capabilities | door-leaf leaf state | color/image ACTIVE; glass/lightbox/mesh SCHEMA_ONLY unused |
| `panelRole` | expandRecipe | ACTIVE_RUNTIME |
| `shape` | identity + L factory + scene3d | ACTIVE_RUNTIME |
| `nominalModuleWidthCm` | inner-corner match | ACTIVE_RUNTIME |
| `modelRotationYDeg` | GLB | ACTIVE_RUNTIME |
| `preserveModelScale` | GLB/state | ACTIVE_RUNTIME |
| `eyeCount` | showcase factory | ACTIVE_RUNTIME |
| `connectorType` | data live; `getConnectorItemKey` test | data ACTIVE, API TEST_ONLY |
| `stripOccupancy.*` | overlay | ACTIVE_RUNTIME |
| `bodyItems.*` | showcase body | ACTIVE_RUNTIME |
| `dimensions.*` | scene/placement/BOM leaf ölçü | ACTIVE_RUNTIME |

UNKNOWN: 0 (bu listedeki alanlar için).
