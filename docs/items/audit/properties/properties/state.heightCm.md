# `state.heightCm`

**Özellik ID:** `state.heightCm`
**İnsan tarafından anlaşılır adı:** Runtime module state: heightCm
**Kategori:** runtime-state
**Veri tipi:** number
**Birim:** cm
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `346.5` · `350` · `180` · `25` · `66` · `60` · `78` · `38` · `82` · `74` · `121` · `120` (+9)

## Ne işe yarar

create*ModuleState çıktısı. Persist: modules[] blob.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/items.js` `LEAF_ITEMS` :12 [define]
- `src/items.js` `COMMERCIAL_ITEMS` :122 [define]
- `src/items.js` `FURNITURE_ITEMS` :157 [write-or-literal]
- `src/items.js` (dosya düzeyi) :232 [write-or-literal]
- `src/items.js` `TOP_LIGHT_ITEMS` :261 [write-or-literal]
- `src/items.js` `NON_CATALOG_ITEMS` :279 [write-or-literal]
- `src/items.js` `INDOOR_PLANT_ITEMS` :384 [define]
- `src/items.js` `COMPOSITE_ITEMS` :513 [define]
- `src/items.js` (dosya düzeyi) :582 [define]
- `src/designState.js` `createCounterModuleState` :293 [write]
- `src/designState.js` `if` :313 [read]
- `src/designState.js` `createBaseWallModuleState` :337 [write]
- `src/designState.js` `createBaseWallModuleState` :345 [read]
- `src/designState.js` `createBaseModuleState` :377 [write]
- `src/designState.js` `createBaseModuleState` :385 [read]
- `src/designState.js` `createFurnitureModuleState` :403 [write-or-literal]
- `src/designState.js` `createUprightModuleState` :487 [write-or-literal]
- `src/designState.js` `createProfileModuleState` :503 [write-or-literal]
- `src/designState.js` `modelFile` :526 [write-or-literal]
- `src/designState.js` `createIndoorPlantModuleState` :544 [write]
- `src/designState.js` `createIndoorPlantModuleState` :560 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :576 [write]
- `src/designState.js` `createIlluminatedFoamModuleState` :583 [read]
- `src/designState.js` `createTvModuleState` :608 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :627 [write-or-literal]
- `src/designState.js` `if` :710 [write]
- `src/catalog.js` `COUNTER_DIMENSIONS` :17 [write-or-literal]
- `src/catalog.js` `BASE_DIMENSIONS` :27 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :79 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :93 [write-or-literal]
- `src/catalog.js` `createBaseWallCatalogItem` :105 [write-or-literal]
- `src/catalog.js` `createWallMediaCatalogItem` :180 [write-or-literal]
- `src/catalog.js` `TV_42_DIMENSIONS` :203 [write-or-literal]
- `src/catalog.js` `LED_FLOODLIGHT_DIMENSIONS` :211 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :222 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :239 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :255 [write-or-literal]
- `src/moduleBehavior.js` `getModuleCollisionHeightRangeCm` :275 [write]

## Okuyan yerler

- `src/designState.js` `if` :313 [read]
- `src/designState.js` `createBaseWallModuleState` :345 [read]
- `src/designState.js` `createBaseModuleState` :385 [read]
- `src/designState.js` `createIlluminatedFoamModuleState` :583 [read]
- `src/scene3d.js` `fixedElevationM` :1397 [read]
- `src/scene3d.js` `createMiniFridgeTopLabel` :4905 [read]
- `src/scene3d.js` `createPlasticTrashBinTopLabel` :4950 [read]
- `src/scene3d.js` `createMiniFridgeModule` :5010 [read]
- `src/scene3d.js` `if` :5094 [read]
- `src/scene3d.js` `createCoatRackModule` :5239 [read]
- `src/scene3d.js` `createUprightModule` :5310 [read]
- `src/scene3d.js` `createProfileModule` :5360 [read]
- `src/scene3d.js` `createKettleModule` :5404 [read]
- `src/scene3d.js` `createLedFloodlightModule` :5468 [read]
- `src/scene3d.js` `createBarStoolModule` :5680 [read]
- `src/scene3d.js` `createEamesChairModule` :5761 [read]
- `src/scene3d.js` `createGlassTableModule` :5873 [read]
- `src/scene3d.js` `createEamesTableChairSetModule` :5921 [read]
- `src/scene3d.js` `createBeigeSofaFurnitureProxy` :6230 [read]
- `src/scene3d.js` `createBeigeSofaSetModule` :6280 [read]
- `src/main.js` `finish` :1634 [read]
- `src/modulePlacement.js` `clampWallOverlayZCm` :162 [read]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :589 [read]
- `src/modulePlacement.js` `addCandidate` :897 [read]
- `src/selectionFeedback.js` `if` :117 [read]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :26 [read]
- `src/standStandardsCopy.js` `getHelpStandardsTableHtml` :71 [read]
- `test/barStool2.test.js` (dosya düzeyi) :13 [test]
- `test/baseItemsContract.test.js` (dosya düzeyi) :54 [test]
- `test/baseModule.test.js` (dosya düzeyi) :15 [test]
- `test/baseRenderStyle.test.js` (dosya düzeyi) :22 [test]
- `test/baseWallCatalog.test.js` `for` :18 [test]
- `test/baseWallRecipes.test.js` `for` :38 [test]
- `test/chairEamesContract.test.js` (dosya düzeyi) :18 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :17 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :42 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :16 [test]
- `test/counterModule.test.js` `for` :18 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :26 [test]
- `test/deskBankoItemsContract.test.js` `if` :99 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :17 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :26 [test]
- `test/furnitureItemsContract.test.js` `if` :164 [test]
- `test/glassTableContract.test.js` (dosya düzeyi) :19 [test]
- `test/illuminatedFoamInteraction.test.js` (dosya düzeyi) :16 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :25 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :14 [test]
- `test/kettle.test.js` (dosya düzeyi) :12 [test]
- `test/lCounter150Contract.test.js` (dosya düzeyi) :12 [test]
- `test/lCounter200Contract.test.js` (dosya düzeyi) :12 [test]
- `test/ledFloodlightModule.test.js` (dosya düzeyi) :22 [test]
- `test/lightingItemsContract.test.js` (dosya düzeyi) :26 [test]
- … test/e2e ek 30 eşleşme (src listesi tam).

## Yazan / değiştiren yerler

- `src/items.js` `LEAF_ITEMS` :12 [define]
- `src/items.js` `COMMERCIAL_ITEMS` :122 [define]
- `src/items.js` `FURNITURE_ITEMS` :157 [write-or-literal]
- `src/items.js` (dosya düzeyi) :232 [write-or-literal]
- `src/items.js` `TOP_LIGHT_ITEMS` :261 [write-or-literal]
- `src/items.js` `NON_CATALOG_ITEMS` :279 [write-or-literal]
- `src/items.js` `INDOOR_PLANT_ITEMS` :384 [define]
- `src/items.js` `COMPOSITE_ITEMS` :513 [define]
- `src/items.js` (dosya düzeyi) :582 [define]
- `src/designState.js` `createCounterModuleState` :293 [write]
- `src/designState.js` `createBaseWallModuleState` :337 [write]
- `src/designState.js` `createBaseModuleState` :377 [write]
- `src/designState.js` `createFurnitureModuleState` :403 [write-or-literal]
- `src/designState.js` `createUprightModuleState` :487 [write-or-literal]
- `src/designState.js` `createProfileModuleState` :503 [write-or-literal]
- `src/designState.js` `modelFile` :526 [write-or-literal]
- `src/designState.js` `createIndoorPlantModuleState` :544 [write]
- `src/designState.js` `createIndoorPlantModuleState` :560 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :576 [write]
- `src/designState.js` `createTvModuleState` :608 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :627 [write-or-literal]
- `src/designState.js` `if` :710 [write]
- `src/catalog.js` `COUNTER_DIMENSIONS` :17 [write-or-literal]
- `src/catalog.js` `BASE_DIMENSIONS` :27 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :79 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :93 [write-or-literal]
- `src/catalog.js` `createBaseWallCatalogItem` :105 [write-or-literal]
- `src/catalog.js` `createWallMediaCatalogItem` :180 [write-or-literal]
- `src/catalog.js` `TV_42_DIMENSIONS` :203 [write-or-literal]
- `src/catalog.js` `LED_FLOODLIGHT_DIMENSIONS` :211 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :222 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :239 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :255 [write-or-literal]
- `src/moduleBehavior.js` `getModuleCollisionHeightRangeCm` :275 [write]
- `src/scene3d.js` `ensureModuleSelectionFrame` :978 [write]
- `src/scene3d.js` `createBaseWallModule` :1423 [write-or-literal]
- `src/scene3d.js` `if` :1872 [write-or-literal]
- `src/scene3d.js` `rotateSelectedModule` :2266 [write-or-literal]
- `src/scene3d.js` `getWallOverlayDragPoint` :2346 [write]
- `src/scene3d.js` `rawOffsetCm` :2349 [write]
- `src/scene3d.js` `if` :2407 [write]
- `src/scene3d.js` `createIlluminatedFoamModule` :4706 [write]
- `src/scene3d.js` `createTvModule` :4847 [write]
- `src/scene3d.js` `createMiniFridgeModule` :4998 [write]
- `src/scene3d.js` `createIndoorPlantModule` :5068 [write]
- `src/scene3d.js` `createCoatRackModule` :5229 [write]
- `src/scene3d.js` `createUprightModule` :5295 [write]
- `src/scene3d.js` `createProfileModule` :5344 [write]
- `src/scene3d.js` `createKettleModule` :5394 [write]
- `src/scene3d.js` `createLedFloodlightModule` :5459 [write]
- `src/scene3d.js` `createBarStoolModule` :5671 [write]
- `src/scene3d.js` `createEamesChairModule` :5752 [write]
- `src/scene3d.js` `addProceduralGlassTable` :5832 [write]
- `src/scene3d.js` `createGlassTableModule` :5864 [write]
- `src/scene3d.js` `createEamesTableChairSetModule` :5912 [write]
- `src/scene3d.js` `addClassicCoffeeTable` :6140 [write]
- `src/scene3d.js` `createBeigeSofaFurnitureProxy` :6241 [write]
- `src/scene3d.js` `createBeigeSofaSetModule` :6270 [write]
- `src/main.js` `for` :680 [write-or-literal]
- `src/main.js` `resizeContextIlluminatedFoam` :876 [write]
- `src/main.js` `finish` :1632 [write]
- `src/main.js` `if` :1662 [write]
- `src/main.js` `onKeyDown` :1710 [write]
- `src/autoDepot.js` `if` :84 [write]
- `src/autoDepot.js` `if` :120 [write-or-literal]
- `src/moduleMove.js` `if` :185 [write-or-literal]
- `src/modulePlacement.js` `getWallOverlayZBoundsCm` :151 [write]
- `src/modulePlacement.js` `clampWallOverlayZCm` :166 [write]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :564 [write]
- `src/modulePlacement.js` `snapUprightToShortUpJoints` :770 [write-or-literal]
- `src/modulePlacement.js` `snapPlacementToModules` :809 [write]
- `src/modulePlacement.js` `if` :1581 [write-or-literal]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :15 [write]
- `src/standStandardsCopy.js` `getStandStandardsListItems` :43 [write-or-literal]
- `src/stripOccupancy.js` `getStandStripMetrics` :9 [write-or-literal]
- `src/stripOccupancy.js` `if` :53 [write-or-literal]

## Default değeri

Factory: Item dimensions kopyası. Foam: kullanıcı `resize-foam` ezer; `Math.max` alt sınır factory içinde.

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

koşullu

## Kullanıcı nereden değiştirir

Yalnız illuminated-foam `resize-foam`. Diğer type'larda factory kopyası, kullanıcı değiştirmez.

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

ITEM_EDITABLE

## CRUD gerekçesi

Factory default yazar; kullanıcı yüzey rengi/görsel/cam/kumaş, raf ışığı, strafor boyut/hale veya zemin rengi ile ezer. `saveProject` module/stand blob içinde kalır.

## Kanıt

- src dosya sayısı (unique): **12**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/moduleBehavior.js`, `src/scene3d.js`, `src/main.js`, `src/autoDepot.js`, `src/moduleMove.js`, `src/modulePlacement.js`, `src/selectionFeedback.js`, `src/standStandardsCopy.js`, `src/stripOccupancy.js`

- `src/items.js` `LEAF_ITEMS` :12 [define]
- `src/items.js` `COMMERCIAL_ITEMS` :122 [define]
- `src/items.js` `FURNITURE_ITEMS` :157 [write-or-literal]
- `src/items.js` (dosya düzeyi) :232 [write-or-literal]
- `src/items.js` `TOP_LIGHT_ITEMS` :261 [write-or-literal]
- `src/items.js` `NON_CATALOG_ITEMS` :279 [write-or-literal]
- `src/items.js` `INDOOR_PLANT_ITEMS` :384 [define]
- `src/items.js` `COMPOSITE_ITEMS` :513 [define]
- `src/items.js` (dosya düzeyi) :582 [define]
- `src/designState.js` `createCounterModuleState` :293 [write]
- `src/designState.js` `if` :313 [read]
- `src/designState.js` `createBaseWallModuleState` :337 [write]
- `src/designState.js` `createBaseWallModuleState` :345 [read]
- `src/designState.js` `createBaseModuleState` :377 [write]
- `src/designState.js` `createBaseModuleState` :385 [read]
- `src/designState.js` `createFurnitureModuleState` :403 [write-or-literal]
- `src/designState.js` `createUprightModuleState` :487 [write-or-literal]
- `src/designState.js` `createProfileModuleState` :503 [write-or-literal]
- `src/designState.js` `modelFile` :526 [write-or-literal]
- `src/designState.js` `createIndoorPlantModuleState` :544 [write]
- `src/designState.js` `createIndoorPlantModuleState` :560 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :576 [write]
- `src/designState.js` `createIlluminatedFoamModuleState` :583 [read]
- `src/designState.js` `createTvModuleState` :608 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :627 [write-or-literal]
- `src/designState.js` `if` :710 [write]
- `src/catalog.js` `COUNTER_DIMENSIONS` :17 [write-or-literal]
- `src/catalog.js` `BASE_DIMENSIONS` :27 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :79 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :93 [write-or-literal]
- `src/catalog.js` `createBaseWallCatalogItem` :105 [write-or-literal]
- `src/catalog.js` `createWallMediaCatalogItem` :180 [write-or-literal]
- `src/catalog.js` `TV_42_DIMENSIONS` :203 [write-or-literal]
- `src/catalog.js` `LED_FLOODLIGHT_DIMENSIONS` :211 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :222 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :239 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :255 [write-or-literal]
- `src/moduleBehavior.js` `getModuleCollisionHeightRangeCm` :275 [write]
- `src/scene3d.js` `ensureModuleSelectionFrame` :978 [write]
- `src/scene3d.js` `fixedElevationM` :1397 [read]
- `src/scene3d.js` `createBaseWallModule` :1423 [write-or-literal]
- `src/scene3d.js` `if` :1872 [write-or-literal]
- `src/scene3d.js` `rotateSelectedModule` :2266 [write-or-literal]
- `src/scene3d.js` `getWallOverlayDragPoint` :2346 [write]
- `src/scene3d.js` `rawOffsetCm` :2349 [write]
- `src/scene3d.js` `if` :2407 [write]
- `src/scene3d.js` `createIlluminatedFoamModule` :4706 [write]
- `src/scene3d.js` `createTvModule` :4847 [write]
- `src/scene3d.js` `createMiniFridgeTopLabel` :4905 [read]
- `src/scene3d.js` `createPlasticTrashBinTopLabel` :4950 [read]
- `src/scene3d.js` `createMiniFridgeModule` :4998 [write]
- `src/scene3d.js` `createMiniFridgeModule` :5010 [read]
- `src/scene3d.js` `createIndoorPlantModule` :5068 [write]
- `src/scene3d.js` `if` :5094 [read]
- `src/scene3d.js` `createCoatRackModule` :5229 [write]
- `src/scene3d.js` `createCoatRackModule` :5239 [read]
- `src/scene3d.js` `createUprightModule` :5295 [write]
- `src/scene3d.js` `createUprightModule` :5310 [read]
- `src/scene3d.js` `createProfileModule` :5344 [write]
- `src/scene3d.js` `createProfileModule` :5360 [read]
- `src/scene3d.js` `createKettleModule` :5394 [write]
- `src/scene3d.js` `createKettleModule` :5404 [read]
- `src/scene3d.js` `createLedFloodlightModule` :5459 [write]
- `src/scene3d.js` `createLedFloodlightModule` :5468 [read]
- `src/scene3d.js` `createBarStoolModule` :5671 [write]
- `src/scene3d.js` `createBarStoolModule` :5680 [read]
- `src/scene3d.js` `createEamesChairModule` :5752 [write]
- `src/scene3d.js` `createEamesChairModule` :5761 [read]
- `src/scene3d.js` `addProceduralGlassTable` :5832 [write]
- `src/scene3d.js` `createGlassTableModule` :5864 [write]
- `src/scene3d.js` `createGlassTableModule` :5873 [read]
- `src/scene3d.js` `createEamesTableChairSetModule` :5912 [write]
- `src/scene3d.js` `createEamesTableChairSetModule` :5921 [read]
- `src/scene3d.js` `addClassicCoffeeTable` :6140 [write]
- `src/scene3d.js` `createBeigeSofaFurnitureProxy` :6230 [read]
- `src/scene3d.js` `createBeigeSofaFurnitureProxy` :6241 [write]
- `src/scene3d.js` `createBeigeSofaSetModule` :6270 [write]
- `src/scene3d.js` `createBeigeSofaSetModule` :6280 [read]
- `src/main.js` `for` :680 [write-or-literal]
- `src/main.js` `resizeContextIlluminatedFoam` :876 [write]
- `src/main.js` `finish` :1632 [write]
- `src/main.js` `finish` :1634 [read]
- `src/main.js` `if` :1662 [write]
- `src/main.js` `onKeyDown` :1710 [write]
- `src/autoDepot.js` `if` :84 [write]
- `src/autoDepot.js` `if` :120 [write-or-literal]
- `src/moduleMove.js` `if` :185 [write-or-literal]
- `src/modulePlacement.js` `getWallOverlayZBoundsCm` :151 [write]
- `src/modulePlacement.js` `clampWallOverlayZCm` :162 [read]
- `src/modulePlacement.js` `clampWallOverlayZCm` :166 [write]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :564 [write]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :589 [read]
- `src/modulePlacement.js` `snapUprightToShortUpJoints` :770 [write-or-literal]
- `src/modulePlacement.js` `snapPlacementToModules` :809 [write]
- `src/modulePlacement.js` `addCandidate` :897 [read]
- `src/modulePlacement.js` `if` :1581 [write-or-literal]
- `src/selectionFeedback.js` `if` :117 [read]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :15 [write]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :26 [read]
- `src/standStandardsCopy.js` `getStandStandardsListItems` :43 [write-or-literal]
- `src/standStandardsCopy.js` `getHelpStandardsTableHtml` :71 [read]
- `src/stripOccupancy.js` `getStandStripMetrics` :9 [write-or-literal]
- `src/stripOccupancy.js` `if` :53 [write-or-literal]
- `test/barStool2.test.js` (dosya düzeyi) :13 [test]
- `test/baseItemsContract.test.js` (dosya düzeyi) :54 [test]
- `test/baseModule.test.js` (dosya düzeyi) :15 [test]
- `test/baseRenderStyle.test.js` (dosya düzeyi) :22 [test]
- `test/baseWallCatalog.test.js` `for` :18 [test]
- `test/baseWallRecipes.test.js` `for` :38 [test]
- `test/chairEamesContract.test.js` (dosya düzeyi) :18 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :17 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :42 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :16 [test]
- `test/counterModule.test.js` `for` :18 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :26 [test]
- `test/deskBankoItemsContract.test.js` `if` :99 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :17 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :26 [test]
- `test/furnitureItemsContract.test.js` `if` :164 [test]
- `test/glassTableContract.test.js` (dosya düzeyi) :19 [test]
- `test/illuminatedFoamInteraction.test.js` (dosya düzeyi) :16 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :25 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :14 [test]
- `test/kettle.test.js` (dosya düzeyi) :12 [test]
- `test/lCounter150Contract.test.js` (dosya düzeyi) :12 [test]
- `test/lCounter200Contract.test.js` (dosya düzeyi) :12 [test]
- `test/ledFloodlightModule.test.js` (dosya düzeyi) :22 [test]
- `test/lightingItemsContract.test.js` (dosya düzeyi) :26 [test]
- … test/e2e ek 30 eşleşme (src listesi tam).

- indeks: 123 / 188
