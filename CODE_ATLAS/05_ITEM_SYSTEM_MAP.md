# Item System Map

**Kanıt:** `src/items.js` runtime import (`listRegisteredItems()`), accessor fonksiyonlar, GitNexus `getItem` impact, tüketen `src/` dosyaları.

**Yorum:** `docs/items/audit` içindeki `static.*` / `catalog.*` / `state.*` **dokümantasyon katman adlarıdır**. Runtime’da `item.static` diye bir nesne yoktur (`src/**/*.js` içinde `static.` 0 eşleşme).

Kayıt sayısı (node import, 2026-09-17):

| Ölçü | Sayı |
| --- | --- |
| Kayıtlı Item | 96 |
| `catalogVisible === true` | 58 |
| `composition` var | 30 |
| `modelFile` var | 9 |
| `paintable` alanı var | 5 (zemin) |
| `shape` var | 3 (L banko) |
| `stripOccupancy` var | 8 |
| `shelfCount` alanı var | **0** |

Type dağılımı (kanıt): upright 3, profile 4, panel 8, separator-panel 2, connector 4, door-leaf 1, shelf 3, shelf-accessory 1, showcase-board 3, showcase-accessory 1, counter-top 6, base-top 3, commercial GLB 4, furniture 8, led-floodlight 1, illuminated-foam 1, video-wall-panel 1, floor 5, indoor-plant-1 4, tv 5, door 1, base 3, counter 6, flat-panel 12, separator 4, showcase-2 1, showcase-3 1.

---

## Registry

| | |
| --- | --- |
| **DEFINED** | `export const ITEMS = Object.freeze({ ... })` `src/items.js` |
| **READ BY** | `getItem(itemKey)` → `ITEMS[itemKey]`; `listRegisteredItems()` → `Object.values(ITEMS)` |
| **WRITTEN BY** | yok (freeze). Yeni Item yalnız kaynak değişikliği ile |
| **RUNTIME USE** | kimlik, ölçü, catalog projection, recipe, BOM, renderer, placement |
| **TEST COVERAGE** | onlarca `*ItemContract.test.js`, `itemCatalogFields.test.js`, `itemSceneDimensions.test.js`, `itemDocsRuntimeAlignment.test.js` |

`itemKey` hem map key hem satır alanı. Accessor `getItem` GitNexus: **CRITICAL**, 60 doğrudan, 79 process.

---

## Alan: `itemKey`

| | |
| --- | --- |
| **DEFINED** | her ITEMS satırı |
| **READ BY** | `getItem`, `resolveItemKey`, catalog, BOM, import validation (stand floor), scene3d `userData` |
| **WRITTEN BY** | factory’ler `designState.js` (`state.itemKey = item.itemKey`) |
| **RUNTIME USE** | persist, catalog kart `data-module-key`, BOM satırı |
| **ITEMS USING** | 96/96 |
| **TEST COVERAGE** | COVERED (contract + resolveItemKey testleri) |

---

## Alan: `type`

| | |
| --- | --- |
| **DEFINED** | ITEMS satırı |
| **READ BY** | `MODULE_STATE_FACTORIES[type]`; `getModuleBehavior`; `getCommercialItemForType` / furniture / floor filter; import `MODULE_STATE_TYPES.includes` |
| **WRITTEN BY** | factory `type: item.type` |
| **RUNTIME USE** | behavior family + state factory seçimi |
| **TEST COVERAGE** | COVERED (`moduleBehavior*.test.js`, construction registry) |

---

## Alan: catalog (`catalogVisible`, `catalogCategory`, `catalogItemIndex`, `catalogPreview`)

| | |
| --- | --- |
| **DEFINED** | ITEMS |
| **READ BY** | `catalog.js` `listCatalogItems` / `projectCatalogItem` (`catalogPreview` CATALOG_PREVIEWS whitelist) |
| **WRITTEN BY** | yok (master) |
| **RUNTIME USE** | sidebar/picker kartları. `catalogVisible: false` Item silinmez |
| **TEST COVERAGE** | COVERED (`catalogSingleSource`, `catalogCategories`, `catalogItemProjection`) |

---

## Alan: `name` / `unit`

| | |
| --- | --- |
| **DEFINED** | ITEMS |
| **READ BY** | catalog `label: item.name`; BOM `unit` zorunlu leaf; selection metinleri |
| **WRITTEN BY** | yok |
| **RUNTIME USE** | UI label; BOM birimi |
| **TEST COVERAGE** | PARTIAL (BOM testleri unit’i assert eder; her Item ayrı değil) |

`resolveItemBom` leaf’te `item.unit` yoksa throw. Furniture cluster yorumu: “BOM decision-required — unit uydurulmaz”; test `recipeCompositionItemsContract.test.js` furniture cluster’ı BOM’un açmamasını bekler.

---

## Alan: `dimensions` / `sceneDimensions`

| | |
| --- | --- |
| **DEFINED** | ITEMS. `dimensions` fiziksel; `sceneDimensions` aynı field adları için runtime override (`items.js` dosya başı yorum) |
| **READ BY** | `resolveSceneDimensions` (`sceneDimensions ?? dimensions`); `requireSceneDimension`; catalog identity; renderer |
| **WRITTEN BY** | yok (master). State `widthCm` factory `applySceneFootprint` ile kopyalanır |
| **RUNTIME USE** | ghost zarfı, placement, BOM değil |
| **TEST COVERAGE** | COVERED (`itemSceneDimensions.test.js`) |

`SCENE_DIMENSION_FIELDS`: widthCm, depthCm, heightCm, lengthCm, thicknessCm.

---

## Alan: `composition` (recipe / innerCorner / items)

| | |
| --- | --- |
| **DEFINED** | 30 Item |
| **READ BY** | `expandRecipe` / `resolveRecipeItemsForPanelVariant`; `itemBom.resolveRecipe` (`composition.mode === 'recipe'`); `getFurnitureClusterQuantity`; test helper `getRecipeInnerCornerPanelKey` |
| **WRITTEN BY** | yok |
| **RUNTIME USE** | BOM genişletme; inner-corner panel swap. Sahne mesh’i composition’dan türetilmez (ITEM_CONTRACT yasağı ile uyumlu mevcut kod) |
| **ITEMS USING** | wall/door/base/counter/separator/showcase recipe parent’ları + furniture cluster |
| **TEST COVERAGE** | COVERED (`moduleRecipes.test.js`, `*Recipes.test.js`, `recipeCompositionItemsContract.test.js`) |

Inner-corner: production `item.composition.innerCorner?.panelItemKey` inline okunur. `src/moduleRecipes.js` export’u silindi; test helper aynı path’i okur.

---

## Alan: `material` / `defaultColor`

| | |
| --- | --- |
| **DEFINED** | birçok satır |
| **READ BY** | `theme.js` `getMaterialAppearance`; showcase body color eşleşme (`getShowcaseBodyDefinition`); designState surface default |
| **WRITTEN BY** | yok (master). Kullanıcı rengi `surface.color` |
| **RUNTIME USE** | varsayılan görünüm |
| **TEST COVERAGE** | PARTIAL (`materialAppearance.test.js`, showcase appearance) |

---

## Alan: `modelFile` (+ rotation/scale metadata)

| | |
| --- | --- |
| **DEFINED** | 9 Item (coat rack, kettle, mini fridge, trash bin, indoor plants, …) |
| **READ BY** | `scene3d.js` `loadGltfScene(.../models/ + modelFile)`; `resolveItemKey` identity |
| **WRITTEN BY** | state `modelFile` plant için kopyalanabilir |
| **RUNTIME USE** | GLB yükleme. `import.meta.env.BASE_URL + 'models/'` |
| **TEST COVERAGE** | PARTIAL (e2e plastic-trash-bin-asset, indoor plant contract; GLB dosya varlığı bu taramada glob’lanmadı — `public/models` attribution txt görüldü) |

---

## Alan: `paintable`

| | |
| --- | --- |
| **DEFINED** | 5 floor Item |
| **READ BY** | `scene3d` floor color; `getFloorSelectLabel`; `isGridTileFloorItem` / `isCarpetFloorItem` |
| **WRITTEN BY** | yok |
| **RUNTIME USE** | zemin boyanabilir mi |
| **ITEMS USING** | floor ailesi |
| **TEST COVERAGE** | COVERED (`floorItemsContract.test.js`, e2e `floor-items-contract.spec.mjs`) |

---

## Alan: `shape`

| | |
| --- | --- |
| **DEFINED** | 3 L-counter Item (`shape: 'L'`) |
| **READ BY** | `resolveItemKey` `shapesMatch`; designState counter factory; scene3d `userData.shape` |
| **WRITTEN BY** | state `shape: 'straight'` düz bankoda (yorum: katalog düz bankoda shape yok) |
| **RUNTIME USE** | L vs düz kimlik ve renderer |
| **TEST COVERAGE** | COVERED (`lCounter*Contract.test.js`) |

---

## Alan: `stripOccupancy`

| | |
| --- | --- |
| **DEFINED** | 8 Item (`align: 'top'`, `stripCount` 1 veya 2) |
| **READ BY** | `resolveModuleStripOccupancy` → Item master önce, sonra moduleState; `designState` factory kopyası; `moduleBehavior` height range |
| **WRITTEN BY** | factory state’e kopyalar |
| **RUNTIME USE** | kısa-up / overlay şerit; seam snap |
| **TEST COVERAGE** | COVERED (`stripOccupancy.test.js`, shelf seam testleri) |

Stand şeritleri `STAND_DIMENSIONS.stripCount = 7`, `stripHeight = 0.5` m (`standDimensions.js`). Item occupancy bundan ayrı.

---

## Alan: `shelfCount`

| | |
| --- | --- |
| **DEFINED** | runtime Item’da **yok** (0 kayıt) |
| **READ BY** | yok (yalnız `resolveItemKey` yorumu: shelf identity shelfCount tahmini yok) |
| **WRITTEN BY** | yok |
| **RUNTIME USE** | yok |
| **TEST COVERAGE** | `shelfCatalogPanelSeam.test.js` descriptor’da `shelfCount` verilince `createModuleStateFromDescriptor`/`resolveItemKey` null bekler |
| **Yorum** | `docs/refactor/REFACTOR.md` 2026-09-16 kaydı: wall_shelf `shelfCount` kaldırıldı. Audit MD `static.shelfCount` **stale doküman** |

---

## Alan: `static.*`

| | |
| --- | --- |
| **DEFINED** | JS’te yok. Audit `docs/items/audit/properties/properties/static.*.md` |
| **READ BY** | yok |
| **Yorum** | Dokümantasyon Item master alanlarını `static.` öneki ile adlandırır |

---

## Resolver / accessor fonksiyonları

| Sembol | DEFINED | Prod callers (özet) | Test | Durum |
| --- | --- | --- | --- | --- |
| `getItem` | items.js | hub (catalog, designState, scene3d, recipes, BOM, …) | evet | USED |
| `listRegisteredItems` | items.js | catalog, resolveItemKey | evet | USED |
| `resolveItemKey` | items.js | catalog, designState, main | evet | USED |
| `resolveSceneDimensions` / `requireSceneDimension` | items.js | designState, scene3d, wall media | evet | USED |
| `getFloorItem` / `listFloorItems` / `resolveStandFloorItemKey` | items.js | main, scene3d, import validation | evet | USED |
| `getCommercialItemForType` | items.js | designState/autoDepot ailesi | evet | USED |
| `getFurnitureItemForType` | items.js | furniture factory | evet | USED |
| `getFurnitureClusterQuantity` | items.js | scene3d process `Scene3d → GetFurnitureClusterQuantity` | PARTIAL | USED |
| `getTopLightItemForType` | items.js | `createLedFloodlightModuleState` | evet | USED |
| `resolveWallMediaMetrics` | items.js | catalog/selection/tv | evet | USED |
| `getShowcaseItemKeyForType` / `getShowcaseBodyDefinition` | items.js | designState, scene3d | evet | USED |
| `isShortUpFamilyDescriptor` | items.js | moduleBehavior | evet | USED |
| `getConnectorItemKey` / `resolveConnectorBom` | items.js | **yalnız** `test/connectorBom.test.js` | TEST_ONLY | TEST_ONLY |
| `getRecipeItemKey` | moduleRecipes.js | itemBom + test | USED (BOM path) | USED |
| `getRecipeInnerCornerPanelKey` | test/recipeParentItemKey.js | test helper (composition path) | TEST_ONLY | TEST_ONLY |
| `expandRecipe` | moduleRecipes.js | itemBom | USED (BOM path) | USED |
| `resolveItemBom` | itemBom.js | rawBomDebug DEV + tests | TEST_ONLY + DEV | DEV/TEST |
| `getItemSurfaceCapabilities` | itemCapabilities.js | scene3d, designState | PARTIAL | USED |

---

## Module/item creation

`designState.js` `MODULE_STATE_FACTORIES` type → factory. `createModuleStateFromDescriptor` önce `resolveItemKey`, Item ile descriptor birleştirir, factory çağırır.

Impact `createModuleStateFromDescriptor`: CRITICAL (process), 4 doğrudan prod (main flush/validate, foam drag, rebuild, sidebar).

---

## Rendering

`scene3d.js` type/itemKey’e göre `create*Module` fonksiyonları. GLB: `getItem(...).modelFile`. Procedural paneller STAND_DIMENSIONS + Item ölçü. Showcase gövde `getShowcaseBodyDefinition`.

`moduleDragSidebar.js` `CATALOG_PREVIEW_RENDERERS` `catalogPreview` string-key lookup — **UNCERTAIN_DYNAMIC** sınıfı değil; sabit object key, GitNexus CALLS kaçırabilir.

---

## BOM / recipe bağlantısı

```
Item.composition.mode === 'recipe'
  → expandRecipe (inner-corner variant)
  → resolveItemBom satırları (unit + quantity)
  → rawBomDebug UI (DEV) / unit test
```

`moduleContracts.js` `bom.mode` (`recipe`/`self`/`decision-required`) **yalnız test sözleşmesi**. Runtime BOM `itemBom.js` + `composition.mode`.
