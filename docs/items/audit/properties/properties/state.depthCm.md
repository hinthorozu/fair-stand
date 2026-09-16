# `state.depthCm`

**Özellik ID:** `state.depthCm`
**İnsan tarafından anlaşılır adı:** Runtime module state: depthCm
**Kategori:** runtime-state
**Veri tipi:** number
**Birim:** cm
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `8` · `43` · `19` · `50` · `40` · `150` · `45` · `42` · `58` · `75` · `55` · `60` (+6)

## Ne işe yarar

create*ModuleState çıktısı. Persist: modules[] blob.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/items.js` `LEAF_ITEMS` :32 [define]
- `src/items.js` `COMMERCIAL_ITEMS` :122 [define]
- `src/items.js` `FURNITURE_ITEMS` :156 [write-or-literal]
- `src/items.js` (dosya düzeyi) :231 [write-or-literal]
- `src/items.js` `TOP_LIGHT_ITEMS` :260 [write-or-literal]
- `src/items.js` `NON_CATALOG_ITEMS` :280 [write-or-literal]
- `src/items.js` `FLOOR_ITEMS` :292 [define]
- `src/items.js` `getFloorSelectLabel` :340 [write]
- `src/items.js` `getFloorSelectLabel` :341 [read]
- `src/items.js` `isGridTileFloorItem` :355 [read]
- `src/items.js` `INDOOR_PLANT_ITEMS` :384 [define]
- `src/items.js` `WALL_MEDIA_ITEMS` :426 [write-or-literal]
- `src/items.js` `WALL_MEDIA_ITEMS` :443 [define]
- `src/items.js` `resolveWallMediaMetrics` :458 [write]
- `src/items.js` `resolveWallMediaMetrics` :460 [write-or-literal]
- `src/items.js` `COMPOSITE_ITEMS` :513 [define]
- `src/items.js` (dosya düzeyi) :582 [define]
- `src/items.js` `if` :990 [read]
- `src/designState.js` `createCounterModuleState` :293 [write]
- `src/designState.js` `if` :312 [read]
- `src/designState.js` `createBaseWallModuleState` :337 [write]
- `src/designState.js` `createBaseWallModuleState` :344 [read]
- `src/designState.js` `createBaseModuleState` :377 [write]
- `src/designState.js` `createBaseModuleState` :384 [read]
- `src/designState.js` `createFurnitureModuleState` :402 [write-or-literal]
- `src/designState.js` `createUprightModuleState` :486 [write-or-literal]
- `src/designState.js` `createProfileModuleState` :502 [write-or-literal]
- `src/designState.js` `modelFile` :525 [write-or-literal]
- `src/designState.js` `createIndoorPlantModuleState` :543 [write]
- `src/designState.js` `createIndoorPlantModuleState` :559 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :584 [write-or-literal]
- `src/designState.js` `createTvModuleState` :607 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :626 [write-or-literal]
- `src/designState.js` `if` :711 [write]
- `src/catalog.js` `COUNTER_DIMENSIONS` :16 [write-or-literal]
- `src/catalog.js` `BASE_DIMENSIONS` :26 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :78 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :92 [write-or-literal]
- `src/catalog.js` `createBaseWallCatalogItem` :104 [write-or-literal]
- `src/catalog.js` `createWallMediaCatalogItem` :179 [write-or-literal]
- `src/catalog.js` `LED_FLOODLIGHT_DIMENSIONS` :210 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :221 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :238 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :254 [write-or-literal]
- `src/catalog.js` `normalizeCatalogDescriptor` :488 [write-or-literal]
- `src/catalog.js` `if` :515 [read]

## Okuyan yerler

- `src/items.js` `getFloorSelectLabel` :341 [read]
- `src/items.js` `isGridTileFloorItem` :355 [read]
- `src/items.js` `if` :990 [read]
- `src/designState.js` `if` :312 [read]
- `src/designState.js` `createBaseWallModuleState` :344 [read]
- `src/designState.js` `createBaseModuleState` :384 [read]
- `src/catalog.js` `if` :515 [read]
- `src/scene3d.js` `matchesConcreteParquetVisual` :554 [read]
- `src/scene3d.js` `if` :2143 [read]
- `src/scene3d.js` `rotateSelectedModule` :2249 [read]
- `src/scene3d.js` `createMiniFridgeModule` :5009 [read]
- `src/scene3d.js` `createCoatRackModule` :5238 [read]
- `src/scene3d.js` `createUprightModule` :5309 [read]
- `src/scene3d.js` `createKettleModule` :5403 [read]
- `src/scene3d.js` `createLedFloodlightModule` :5467 [read]
- `src/scene3d.js` `createBarStoolModule` :5679 [read]
- `src/scene3d.js` `createEamesChairModule` :5760 [read]
- `src/scene3d.js` `createGlassTableModule` :5872 [read]
- `src/scene3d.js` `createEamesTableChairSetModule` :5920 [read]
- `src/scene3d.js` `createBeigeSofaFurnitureProxy` :6229 [read]
- `src/autoDepot.js` `fixture` :24 [read]
- `src/autoDepot.js` `if` :64 [read]
- `src/modulePlacement.js` `hasStrictDepthBounds` :52 [read]
- `src/modulePlacement.js` `getRotatedHalfExtentsCm` :127 [read]
- `src/modulePlacement.js` `createLocalSegment` :299 [read]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :574 [read]
- `src/modulePlacement.js` `snapUprightToShortUpJoints` :766 [read]
- `src/modulePlacement.js` `snapPlacementToModules` :828 [read]
- `src/modulePlacement.js` `addCandidate` :893 [read]
- `src/modulePlacement.js` `createFreePlacement` :1298 [read]
- `src/modulePlacement.js` `snapPlacementToStand` :1372 [read]
- `src/rawBomDebug.js` `parseLCounterSelection` :16 [read]
- `src/selectionFeedback.js` `if` :27 [read]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :27 [read]
- `src/standStandardsCopy.js` `getHelpStandardsTableHtml` :72 [read]
- `test/barStool2.test.js` (dosya düzeyi) :12 [test]
- `test/baseItemsContract.test.js` (dosya düzeyi) :53 [test]
- `test/baseModule.test.js` (dosya düzeyi) :14 [test]
- `test/baseModule.test.js` `for` :49 [test]
- `test/baseRecipes.test.js` (dosya düzeyi) :9 [test]
- `test/baseRenderStyle.test.js` (dosya düzeyi) :21 [test]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :14 [test]
- `test/baseWallCatalog.test.js` `for` :17 [test]
- `test/baseWallRecipes.test.js` `for` :37 [test]
- `test/chairEamesContract.test.js` (dosya düzeyi) :17 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :16 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :42 [test]
- `test/counterModule.test.js` `for` :17 [test]
- `test/counterRecipes.test.js` (dosya düzeyi) :9 [test]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :8 [test]
- `test/depotFreeDragSnap.test.js` `for` :10 [test]
- `test/depotFrontRecipe.test.js` `front` :6 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :26 [test]
- `test/deskBankoItemsContract.test.js` `if` :98 [test]
- `test/eamesTableChairSetContract.test.js` (dosya düzeyi) :13 [test]
- `test/floorItemsContract.test.js` `for` :40 [test]
- `test/freePropsCollisionNone.test.js` `for` :36 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :25 [test]
- `test/furnitureItemsContract.test.js` `if` :163 [test]
- `test/glassShelfItemContract.test.js` (dosya düzeyi) :11 [test]
- … test/e2e ek 50 eşleşme (src listesi tam).

## Yazan / değiştiren yerler

- `src/items.js` `LEAF_ITEMS` :32 [define]
- `src/items.js` `COMMERCIAL_ITEMS` :122 [define]
- `src/items.js` `FURNITURE_ITEMS` :156 [write-or-literal]
- `src/items.js` (dosya düzeyi) :231 [write-or-literal]
- `src/items.js` `TOP_LIGHT_ITEMS` :260 [write-or-literal]
- `src/items.js` `NON_CATALOG_ITEMS` :280 [write-or-literal]
- `src/items.js` `FLOOR_ITEMS` :292 [define]
- `src/items.js` `getFloorSelectLabel` :340 [write]
- `src/items.js` `INDOOR_PLANT_ITEMS` :384 [define]
- `src/items.js` `WALL_MEDIA_ITEMS` :426 [write-or-literal]
- `src/items.js` `WALL_MEDIA_ITEMS` :443 [define]
- `src/items.js` `resolveWallMediaMetrics` :458 [write]
- `src/items.js` `resolveWallMediaMetrics` :460 [write-or-literal]
- `src/items.js` `COMPOSITE_ITEMS` :513 [define]
- `src/items.js` (dosya düzeyi) :582 [define]
- `src/designState.js` `createCounterModuleState` :293 [write]
- `src/designState.js` `createBaseWallModuleState` :337 [write]
- `src/designState.js` `createBaseModuleState` :377 [write]
- `src/designState.js` `createFurnitureModuleState` :402 [write-or-literal]
- `src/designState.js` `createUprightModuleState` :486 [write-or-literal]
- `src/designState.js` `createProfileModuleState` :502 [write-or-literal]
- `src/designState.js` `modelFile` :525 [write-or-literal]
- `src/designState.js` `createIndoorPlantModuleState` :543 [write]
- `src/designState.js` `createIndoorPlantModuleState` :559 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :584 [write-or-literal]
- `src/designState.js` `createTvModuleState` :607 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :626 [write-or-literal]
- `src/designState.js` `if` :711 [write]
- `src/catalog.js` `COUNTER_DIMENSIONS` :16 [write-or-literal]
- `src/catalog.js` `BASE_DIMENSIONS` :26 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :78 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :92 [write-or-literal]
- `src/catalog.js` `createBaseWallCatalogItem` :104 [write-or-literal]
- `src/catalog.js` `createWallMediaCatalogItem` :179 [write-or-literal]
- `src/catalog.js` `LED_FLOODLIGHT_DIMENSIONS` :210 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :221 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :238 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :254 [write-or-literal]
- `src/catalog.js` `normalizeCatalogDescriptor` :488 [write-or-literal]
- `src/scene3d.js` `createFloorPattern` :572 [write]
- `src/scene3d.js` `createStage` :770 [write]
- `src/scene3d.js` `createStage` :810 [write-or-literal]
- `src/scene3d.js` `ensureModuleSelectionFrame` :977 [write]
- `src/scene3d.js` `createBaseWallModule` :1422 [write-or-literal]
- `src/scene3d.js` `if` :1723 [write]
- `src/scene3d.js` `pickModuleContext` :1809 [write-or-literal]
- `src/scene3d.js` `if` :1871 [write-or-literal]
- `src/scene3d.js` `rotateSelectedModule` :2262 [write-or-literal]
- `src/scene3d.js` `getFreeTvPlacement` :2302 [write-or-literal]
- `src/scene3d.js` `snap20` :2814 [write]
- `src/scene3d.js` `createIlluminatedFoamModule` :4707 [write]
- `src/scene3d.js` `createTvModule` :4833 [write]
- `src/scene3d.js` `createMiniFridgeModule` :4997 [write]
- `src/scene3d.js` `createIndoorPlantModule` :5067 [write]
- `src/scene3d.js` `createCoatRackModule` :5228 [write]
- `src/scene3d.js` `createUprightModule` :5294 [write]
- `src/scene3d.js` `createProfileModule` :5343 [write]
- `src/scene3d.js` `createProfileModule` :5359 [write-or-literal]
- `src/scene3d.js` `createKettleModule` :5393 [write]
- `src/scene3d.js` `createLedFloodlightModule` :5458 [write]
- `src/scene3d.js` `createBarStoolModule` :5670 [write]
- `src/scene3d.js` `createEamesChairModule` :5751 [write]
- `src/scene3d.js` `createGlassTableModule` :5863 [write]
- `src/scene3d.js` `createEamesTableChairSetModule` :5911 [write]
- `src/scene3d.js` `addClassicCoffeeTable` :6139 [write]
- `src/scene3d.js` `createBeigeSofaSetModule` :6269 [write]
- `src/main.js` `for` :676 [write-or-literal]
- `src/main.js` `resizeContextIlluminatedFoam` :881 [write]
- `src/main.js` `rebuildSceneFromSetup` :1046 [write-or-literal]
- `src/main.js` `if` :1410 [write-or-literal]
- `src/main.js` `onKeyDown` :1710 [write]
- `src/autoDepot.js` `AUTO_DEPOT_SIZES` :5 [write-or-literal]
- `src/autoDepot.js` `fixture` :20 [write]
- `src/autoDepot.js` `planAutomaticDepot` :54 [write-or-literal]
- `src/autoDepot.js` `if` :77 [write]
- `src/autoDepot.js` `if` :127 [write-or-literal]
- `src/moduleMove.js` `if` :187 [write-or-literal]
- `src/modulePlacement.js` `hasStrictDepthBounds` :53 [write]
- `src/modulePlacement.js` `snapDepthCenterCm` :57 [write]
- `src/modulePlacement.js` `rotateModulePlacementAroundCenter` :76 [write]
- `src/modulePlacement.js` `getRotatedHalfExtentsCm` :129 [write]
- `src/modulePlacement.js` `getLCounterCollisionSegments` :270 [write]
- `src/modulePlacement.js` `createLocalSegment` :295 [write]
- `src/modulePlacement.js` `validateModulePlacement` :343 [write]
- `src/modulePlacement.js` `if` :380 [write]
- `src/modulePlacement.js` `getModuleCollisionDepthCm` :409 [write]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :560 [write]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :578 [write-or-literal]
- `src/modulePlacement.js` `snapUprightToShortUpJoints` :711 [write]
- `src/modulePlacement.js` `snapPlacementToModules` :812 [write]
- `src/modulePlacement.js` `faceGapCm` :1073 [write]
- `src/modulePlacement.js` `touchesTargetFace` :1181 [write]
- `src/modulePlacement.js` `createFreePlacement` :1258 [write]
- `src/modulePlacement.js` `snapPlacementToStand` :1344 [write]
- `src/modulePlacement.js` `createFreeSideFixturePlacement` :1468 [write]
- `src/modulePlacement.js` `for` :1556 [write]
- `src/modulePlacement.js` `if` :1577 [write-or-literal]
- `src/rawBomDebug.js` `parseLCounterSelection` :15 [write]
- `src/rawBomDebug.js` `parseLCounterSelection` :21 [write-or-literal]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :16 [write]
- `src/standStandardsCopy.js` `getStandStandardsListItems` :44 [write-or-literal]

## Default değeri

Factory default: ilgili `create*ModuleState` Item/catalog ölçü veya media türevini kopyalar. Global state default yok.

## Override zinciri

Item/catalog ölçü → factory kopya → (nadiren) kullanıcı foam resize width/height → persist. normalizeModuleItemState tv/base/counter/flat-panel itemKey ve bazı ölçüleri yeniden yazar.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **40** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `upright`, `profile`, `coat-rack`, `kettle`, `mini-fridge`, `plastic-trash-bin`, `sofa-set-classic`, `sofa-single-classic`, `sofa-double-classic`, `coffee-table-classic`, `table-chair-set-eames`, `chair`, `table-glass`, `bar-stool`, `indoor-plant-1`, `tv`, `led-floodlight`, `illuminated-foam`, `base`, `counter`, `base-wall`
- itemKey: `upright_346_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`, `furniture_sofa_set_classic`, `furniture_sofa_single_classic`, `furniture_sofa_double_classic`, `furniture_coffee_table_classic`, `furniture_table_chair_set_eames`, `chair_eames`, `glass_table`, `furniture_bar_stool_classic`, `EXTRA_INDOOR_PLANT_1`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`, `TV_42`, `TV_55`, `TV_65`, `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`, `led_floodlight`, `illuminated-foam`, `BASE_100`, `BASE_150`, `BASE_200`, `desk_banko_100`, `desk_banko_150`, `desk_banko_200`, `desk_banko_100_L`, `desk_banko_150_L`, `desk_banko_200_L`, `wall_base_100`, `wall_base_150`, `wall_base_200`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **40**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Evet — `modules[]` nesnesinin parçası. `saveProject` şemasız put. Load `cloneProjectState`.

## Renderer etkisi

Mesh ölçeği / proxy kutu boyutu (type renderer).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `state`
- kaynak: Item + factory; TV için `resolveWallMediaMetrics`.

## Değiştirmenin yan etkileri

Yüzey/ışık/foam state değişince renderer ve persist blob güncellenir; BOM değişmez.

## CRUD sınıflandırması

SYSTEM_INTERNAL

## CRUD gerekçesi

Factory `modules[]` state kopyası. Kullanıcı bu id'yi ayrı formda değiştirmez (ölçü/itemKey type kimliği). Placement ayrı `placement` alanındadır ve bu 188 sütunda yoktur.

## Kanıt

- src dosya sayısı (unique): **11**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/scene3d.js`, `src/main.js`, `src/autoDepot.js`, `src/moduleMove.js`, `src/modulePlacement.js`, `src/rawBomDebug.js`, `src/selectionFeedback.js`, `src/standStandardsCopy.js`

- `src/items.js` `LEAF_ITEMS` :32 [define]
- `src/items.js` `COMMERCIAL_ITEMS` :122 [define]
- `src/items.js` `FURNITURE_ITEMS` :156 [write-or-literal]
- `src/items.js` (dosya düzeyi) :231 [write-or-literal]
- `src/items.js` `TOP_LIGHT_ITEMS` :260 [write-or-literal]
- `src/items.js` `NON_CATALOG_ITEMS` :280 [write-or-literal]
- `src/items.js` `FLOOR_ITEMS` :292 [define]
- `src/items.js` `getFloorSelectLabel` :340 [write]
- `src/items.js` `getFloorSelectLabel` :341 [read]
- `src/items.js` `isGridTileFloorItem` :355 [read]
- `src/items.js` `INDOOR_PLANT_ITEMS` :384 [define]
- `src/items.js` `WALL_MEDIA_ITEMS` :426 [write-or-literal]
- `src/items.js` `WALL_MEDIA_ITEMS` :443 [define]
- `src/items.js` `resolveWallMediaMetrics` :458 [write]
- `src/items.js` `resolveWallMediaMetrics` :460 [write-or-literal]
- `src/items.js` `COMPOSITE_ITEMS` :513 [define]
- `src/items.js` (dosya düzeyi) :582 [define]
- `src/items.js` `if` :990 [read]
- `src/designState.js` `createCounterModuleState` :293 [write]
- `src/designState.js` `if` :312 [read]
- `src/designState.js` `createBaseWallModuleState` :337 [write]
- `src/designState.js` `createBaseWallModuleState` :344 [read]
- `src/designState.js` `createBaseModuleState` :377 [write]
- `src/designState.js` `createBaseModuleState` :384 [read]
- `src/designState.js` `createFurnitureModuleState` :402 [write-or-literal]
- `src/designState.js` `createUprightModuleState` :486 [write-or-literal]
- `src/designState.js` `createProfileModuleState` :502 [write-or-literal]
- `src/designState.js` `modelFile` :525 [write-or-literal]
- `src/designState.js` `createIndoorPlantModuleState` :543 [write]
- `src/designState.js` `createIndoorPlantModuleState` :559 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :584 [write-or-literal]
- `src/designState.js` `createTvModuleState` :607 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :626 [write-or-literal]
- `src/designState.js` `if` :711 [write]
- `src/catalog.js` `COUNTER_DIMENSIONS` :16 [write-or-literal]
- `src/catalog.js` `BASE_DIMENSIONS` :26 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :78 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :92 [write-or-literal]
- `src/catalog.js` `createBaseWallCatalogItem` :104 [write-or-literal]
- `src/catalog.js` `createWallMediaCatalogItem` :179 [write-or-literal]
- `src/catalog.js` `LED_FLOODLIGHT_DIMENSIONS` :210 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :221 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :238 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :254 [write-or-literal]
- `src/catalog.js` `normalizeCatalogDescriptor` :488 [write-or-literal]
- `src/catalog.js` `if` :515 [read]
- `src/scene3d.js` `matchesConcreteParquetVisual` :554 [read]
- `src/scene3d.js` `createFloorPattern` :572 [write]
- `src/scene3d.js` `createStage` :770 [write]
- `src/scene3d.js` `createStage` :810 [write-or-literal]
- `src/scene3d.js` `ensureModuleSelectionFrame` :977 [write]
- `src/scene3d.js` `createBaseWallModule` :1422 [write-or-literal]
- `src/scene3d.js` `if` :1723 [write]
- `src/scene3d.js` `pickModuleContext` :1809 [write-or-literal]
- `src/scene3d.js` `if` :1871 [write-or-literal]
- `src/scene3d.js` `if` :2143 [read]
- `src/scene3d.js` `rotateSelectedModule` :2249 [read]
- `src/scene3d.js` `rotateSelectedModule` :2262 [write-or-literal]
- `src/scene3d.js` `getFreeTvPlacement` :2302 [write-or-literal]
- `src/scene3d.js` `snap20` :2814 [write]
- `src/scene3d.js` `createIlluminatedFoamModule` :4707 [write]
- `src/scene3d.js` `createTvModule` :4833 [write]
- `src/scene3d.js` `createMiniFridgeModule` :4997 [write]
- `src/scene3d.js` `createMiniFridgeModule` :5009 [read]
- `src/scene3d.js` `createIndoorPlantModule` :5067 [write]
- `src/scene3d.js` `createCoatRackModule` :5228 [write]
- `src/scene3d.js` `createCoatRackModule` :5238 [read]
- `src/scene3d.js` `createUprightModule` :5294 [write]
- `src/scene3d.js` `createUprightModule` :5309 [read]
- `src/scene3d.js` `createProfileModule` :5343 [write]
- `src/scene3d.js` `createProfileModule` :5359 [write-or-literal]
- `src/scene3d.js` `createKettleModule` :5393 [write]
- `src/scene3d.js` `createKettleModule` :5403 [read]
- `src/scene3d.js` `createLedFloodlightModule` :5458 [write]
- `src/scene3d.js` `createLedFloodlightModule` :5467 [read]
- `src/scene3d.js` `createBarStoolModule` :5670 [write]
- `src/scene3d.js` `createBarStoolModule` :5679 [read]
- `src/scene3d.js` `createEamesChairModule` :5751 [write]
- `src/scene3d.js` `createEamesChairModule` :5760 [read]
- `src/scene3d.js` `createGlassTableModule` :5863 [write]
- `src/scene3d.js` `createGlassTableModule` :5872 [read]
- `src/scene3d.js` `createEamesTableChairSetModule` :5911 [write]
- `src/scene3d.js` `createEamesTableChairSetModule` :5920 [read]
- `src/scene3d.js` `addClassicCoffeeTable` :6139 [write]
- `src/scene3d.js` `createBeigeSofaFurnitureProxy` :6229 [read]
- `src/scene3d.js` `createBeigeSofaSetModule` :6269 [write]
- `src/main.js` `for` :676 [write-or-literal]
- `src/main.js` `resizeContextIlluminatedFoam` :881 [write]
- `src/main.js` `rebuildSceneFromSetup` :1046 [write-or-literal]
- `src/main.js` `if` :1410 [write-or-literal]
- `src/main.js` `onKeyDown` :1710 [write]
- `src/autoDepot.js` `AUTO_DEPOT_SIZES` :5 [write-or-literal]
- `src/autoDepot.js` `fixture` :20 [write]
- `src/autoDepot.js` `fixture` :24 [read]
- `src/autoDepot.js` `planAutomaticDepot` :54 [write-or-literal]
- `src/autoDepot.js` `if` :64 [read]
- `src/autoDepot.js` `if` :77 [write]
- `src/autoDepot.js` `if` :127 [write-or-literal]
- `src/moduleMove.js` `if` :187 [write-or-literal]
- `src/modulePlacement.js` `hasStrictDepthBounds` :52 [read]
- `src/modulePlacement.js` `hasStrictDepthBounds` :53 [write]
- `src/modulePlacement.js` `snapDepthCenterCm` :57 [write]
- `src/modulePlacement.js` `rotateModulePlacementAroundCenter` :76 [write]
- `src/modulePlacement.js` `getRotatedHalfExtentsCm` :127 [read]
- `src/modulePlacement.js` `getRotatedHalfExtentsCm` :129 [write]
- `src/modulePlacement.js` `getLCounterCollisionSegments` :270 [write]
- `src/modulePlacement.js` `createLocalSegment` :295 [write]
- `src/modulePlacement.js` `createLocalSegment` :299 [read]
- `src/modulePlacement.js` `validateModulePlacement` :343 [write]
- `src/modulePlacement.js` `if` :380 [write]
- `src/modulePlacement.js` `getModuleCollisionDepthCm` :409 [write]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :560 [write]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :574 [read]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :578 [write-or-literal]
- `src/modulePlacement.js` `snapUprightToShortUpJoints` :711 [write]
- `src/modulePlacement.js` `snapUprightToShortUpJoints` :766 [read]
- `src/modulePlacement.js` `snapPlacementToModules` :812 [write]
- `src/modulePlacement.js` `snapPlacementToModules` :828 [read]
- `src/modulePlacement.js` `addCandidate` :893 [read]
- `src/modulePlacement.js` `faceGapCm` :1073 [write]
- `src/modulePlacement.js` `touchesTargetFace` :1181 [write]
- `src/modulePlacement.js` `createFreePlacement` :1258 [write]
- `src/modulePlacement.js` `createFreePlacement` :1298 [read]
- `src/modulePlacement.js` `snapPlacementToStand` :1344 [write]
- `src/modulePlacement.js` `snapPlacementToStand` :1372 [read]
- `src/modulePlacement.js` `createFreeSideFixturePlacement` :1468 [write]
- `src/modulePlacement.js` `for` :1556 [write]
- `src/modulePlacement.js` `if` :1577 [write-or-literal]
- `src/rawBomDebug.js` `parseLCounterSelection` :15 [write]
- `src/rawBomDebug.js` `parseLCounterSelection` :16 [read]
- `src/rawBomDebug.js` `parseLCounterSelection` :21 [write-or-literal]
- `src/selectionFeedback.js` `if` :27 [read]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :16 [write]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :27 [read]
- `src/standStandardsCopy.js` `getStandStandardsListItems` :44 [write-or-literal]
- `src/standStandardsCopy.js` `getHelpStandardsTableHtml` :72 [read]
- `test/barStool2.test.js` (dosya düzeyi) :12 [test]
- `test/baseItemsContract.test.js` (dosya düzeyi) :53 [test]
- `test/baseModule.test.js` (dosya düzeyi) :14 [test]
- `test/baseModule.test.js` `for` :49 [test]
- `test/baseRecipes.test.js` (dosya düzeyi) :9 [test]
- `test/baseRenderStyle.test.js` (dosya düzeyi) :21 [test]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :14 [test]
- `test/baseWallCatalog.test.js` `for` :17 [test]
- `test/baseWallRecipes.test.js` `for` :37 [test]
- `test/chairEamesContract.test.js` (dosya düzeyi) :17 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :16 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :42 [test]
- `test/counterModule.test.js` `for` :17 [test]
- `test/counterRecipes.test.js` (dosya düzeyi) :9 [test]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :8 [test]
- `test/depotFreeDragSnap.test.js` `for` :10 [test]
- `test/depotFrontRecipe.test.js` `front` :6 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :26 [test]
- `test/deskBankoItemsContract.test.js` `if` :98 [test]
- `test/eamesTableChairSetContract.test.js` (dosya düzeyi) :13 [test]
- `test/floorItemsContract.test.js` `for` :40 [test]
- `test/freePropsCollisionNone.test.js` `for` :36 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :25 [test]
- `test/furnitureItemsContract.test.js` `if` :163 [test]
- `test/glassShelfItemContract.test.js` (dosya düzeyi) :11 [test]
- … test/e2e ek 50 eşleşme (src listesi tam).

- indeks: 119 / 188
