# `static.dimensions.lengthCm`

**Özellik ID:** `static.dimensions.lengthCm`
**İnsan tarafından anlaşılır adı:** Kanonik ölçü: lengthCm
**Kategori:** kanonik-kayit
**Veri tipi:** number
**Birim:** cm
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `346.5` · `99` · `49.5` · `41.5` · `91` · `140.5` · `190` · `100` · `150` · `200` · `94.6` · `143.5` (+4)

## Ne işe yarar

Kanonik lengthCm. Catalog/factory/collision/BOM ilgili katmanlar bu ölçüyü veya ondan türetilmiş kopyayı okur.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `LEAF_ITEMS` :3 [define]
- `src/items.js` `COMMERCIAL_ITEMS` :122 [define]
- `src/items.js` `FURNITURE_ITEMS` :154 [define]
- `src/items.js` (dosya düzeyi) :240 [define]
- `src/items.js` `TOP_LIGHT_ITEMS` :258 [define]
- `src/items.js` `NON_CATALOG_ITEMS` :277 [define]
- `src/items.js` `FLOOR_ITEMS` :292 [define]
- `src/items.js` `getFloorSelectLabel` :339 [write]
- `src/items.js` `isParquetFloorItem` :348 [read]
- `src/items.js` `isGridTileFloorItem` :354 [read]
- `src/items.js` `isCarpetFloorItem` :362 [read]
- `src/items.js` `INDOOR_PLANT_ITEMS` :384 [define]
- `src/items.js` `WALL_MEDIA_ITEMS` :425 [define]
- `src/items.js` `resolveWallMediaMetrics` :458 [write]
- `src/items.js` `if` :479 [write]
- `src/items.js` `COMPOSITE_ITEMS` :499 [define]
- `src/items.js` `if` :984 [read]
- `src/designState.js` `createFlatPanelModuleState` :98 [write]
- `src/designState.js` `createSeparatorModuleState` :152 [write]
- `src/designState.js` `createShowcaseModuleState` :171 [write]
- `src/designState.js` `createShelfModuleState` :225 [write]
- `src/designState.js` `createDoorModuleState` :244 [write]
- `src/designState.js` `createCounterModuleState` :293 [write]
- `src/designState.js` `createBaseWallModuleState` :337 [write]
- `src/designState.js` `createBaseModuleState` :377 [write]
- `src/designState.js` `createFurnitureModuleState` :401 [write-or-literal]
- `src/designState.js` `createCommercialModuleState` :455 [write-or-literal]
- `src/designState.js` `createUprightModuleState` :480 [write]
- `src/designState.js` `createUprightModuleState` :487 [write-or-literal]
- `src/designState.js` `createProfileModuleState` :496 [write]
- `src/designState.js` `createIndoorPlantModuleState` :558 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :575 [write]
- `src/designState.js` `createIlluminatedFoamModuleState` :584 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :625 [write-or-literal]
- `src/designState.js` `if` :816 [write]
- `src/designState.js` `if` :824 [read]
- `src/catalog.js` `COUNTER_DIMENSIONS` :16 [write-or-literal]
- `src/catalog.js` `COUNTER_DIMENSIONS` :19 [read]
- `src/catalog.js` `BASE_DIMENSIONS` :26 [write-or-literal]
- `src/catalog.js` `BASE_DIMENSIONS` :29 [read]
- `src/catalog.js` `createBaseCatalogItem` :40 [read]
- `src/catalog.js` `createCounterCatalogItem` :50 [read]
- `src/catalog.js` `createFlatPanelCatalogItem` :62 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :72 [write]
- `src/catalog.js` `createUprightCatalogItem` :79 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :86 [write]
- `src/catalog.js` `createBaseWallCatalogItem` :103 [write-or-literal]
- `src/catalog.js` `createSeparatorCatalogItem` :115 [write-or-literal]
- `src/catalog.js` `createShelfCatalogItem` :127 [write-or-literal]
- `src/catalog.js` `furniture_sofa_set_classic_DIMENSIONS` :142 [write]
- `src/catalog.js` `furniture_sofa_single_classic_DIMENSIONS` :144 [write]
- `src/catalog.js` `furniture_sofa_double_classic_DIMENSIONS` :146 [write]
- `src/catalog.js` `furniture_coffee_table_classic_DIMENSIONS` :148 [write]
- `src/catalog.js` `furniture_table_chair_set_eames_DIMENSIONS` :151 [read]
- `src/catalog.js` `chair_eames_DIMENSIONS` :155 [write]
- `src/catalog.js` `glass_table_DIMENSIONS` :157 [write]
- `src/catalog.js` `furniture_bar_stool_classic_DIMENSIONS` :159 [write]
- `src/catalog.js` `MINI_FRIDGE_DIMENSIONS` :160 [write]
- `src/catalog.js` `COAT_RACK_DIMENSIONS` :162 [write]
- `src/catalog.js` `PLASTIC_TRASH_BIN_DIMENSIONS` :164 [write]
- `src/catalog.js` `LED_FLOODLIGHT_DIMENSIONS` :209 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :220 [write-or-literal]
- `src/catalog.js` `createCommercialCatalogItem` :228 [write]
- `src/catalog.js` `createCommercialCatalogItem` :229 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :237 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :253 [write-or-literal]
- `src/catalog.js` `MODULE_CATALOG` :282 [write-or-literal]
- `src/moduleBehavior.js` `getModuleCollisionHeightRangeCm` :280 [write]
- `src/featureContracts.js` `FEATURE_CONTRACTS` :49 [read]

## Okuyan yerler

- `src/items.js` `isParquetFloorItem` :348 [read]
- `src/items.js` `isGridTileFloorItem` :354 [read]
- `src/items.js` `isCarpetFloorItem` :362 [read]
- `src/items.js` `if` :984 [read]
- `src/designState.js` `if` :824 [read]
- `src/catalog.js` `COUNTER_DIMENSIONS` :19 [read]
- `src/catalog.js` `BASE_DIMENSIONS` :29 [read]
- `src/catalog.js` `createBaseCatalogItem` :40 [read]
- `src/catalog.js` `createCounterCatalogItem` :50 [read]
- `src/catalog.js` `furniture_table_chair_set_eames_DIMENSIONS` :151 [read]
- `src/scene3d.js` `matchesConcreteParquetVisual` :553 [read]
- `src/scene3d.js` `fixedElevationM` :1397 [read]
- `src/scene3d.js` `getPlacementGhostKey` :1882 [read]
- `src/scene3d.js` `if` :1884 [read]
- `src/scene3d.js` `createFallbackPlacementGhost` :1967 [read]
- `src/scene3d.js` `createPlacementGhost` :1994 [read]
- `src/scene3d.js` `addProfile` :6483 [read]
- `src/scene3d.js` `for` :7591 [read]
- `src/main.js` `resizeContextIlluminatedFoam` :877 [read]
- `src/automaticWall.js` `composeAutomaticStandWall` :13 [read]
- `src/featureContracts.js` `FEATURE_CONTRACTS` :49 [read]
- `src/moduleMove.js` `if` :31 [read]
- `src/selectionFeedback.js` `if` :143 [read]
- `src/wall.js` `validateWallLength` :3 [read]
- `src/wall.js` `if` :8 [read]
- `src/wall.js` `composeStraightWall` :20 [read]
- `src/wallReflow.js` `if` :57 [read]
- `test/automaticWall.test.js` (dosya düzeyi) :16 [test]
- `test/baseItemsContract.test.js` (dosya düzeyi) :51 [test]
- `test/baseRecipes.test.js` (dosya düzeyi) :8 [test]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :14 [test]
- `test/baseTopsItemContract.test.js` `for` :74 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :20 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :16 [test]
- `test/counterRecipes.test.js` (dosya düzeyi) :8 [test]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :32 [test]
- `test/counterTopsItemContract.test.js` `for` :62 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :82 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :39 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :17 [test]
- `test/floorItemsContract.test.js` `for` :39 [test]
- `test/furnitureItemsContract.test.js` `if` :162 [test]
- `test/glassShelfItemContract.test.js` (dosya düzeyi) :10 [test]
- `test/glassShelfItemContract.test.js` `for` :46 [test]
- `test/glassTableContract.test.js` (dosya düzeyi) :14 [test]
- `test/illuminatedFoamModule.test.js` (dosya düzeyi) :16 [test]
- `test/imageFit.test.js` (dosya düzeyi) :30 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :78 [test]
- `test/lCounter150Contract.test.js` (dosya düzeyi) :42 [test]
- `test/lCounter200Contract.test.js` (dosya düzeyi) :42 [test]
- `test/lightingItemsContract.test.js` (dosya düzeyi) :78 [test]
- `test/miniFridge.test.js` (dosya düzeyi) :8 [test]
- … test/e2e ek 35 eşleşme (src listesi tam).

## Yazan / değiştiren yerler

- `src/items.js` `LEAF_ITEMS` :3 [define]
- `src/items.js` `COMMERCIAL_ITEMS` :122 [define]
- `src/items.js` `FURNITURE_ITEMS` :154 [define]
- `src/items.js` (dosya düzeyi) :240 [define]
- `src/items.js` `TOP_LIGHT_ITEMS` :258 [define]
- `src/items.js` `NON_CATALOG_ITEMS` :277 [define]
- `src/items.js` `FLOOR_ITEMS` :292 [define]
- `src/items.js` `getFloorSelectLabel` :339 [write]
- `src/items.js` `INDOOR_PLANT_ITEMS` :384 [define]
- `src/items.js` `WALL_MEDIA_ITEMS` :425 [define]
- `src/items.js` `resolveWallMediaMetrics` :458 [write]
- `src/items.js` `if` :479 [write]
- `src/items.js` `COMPOSITE_ITEMS` :499 [define]
- `src/designState.js` `createFlatPanelModuleState` :98 [write]
- `src/designState.js` `createSeparatorModuleState` :152 [write]
- `src/designState.js` `createShowcaseModuleState` :171 [write]
- `src/designState.js` `createShelfModuleState` :225 [write]
- `src/designState.js` `createDoorModuleState` :244 [write]
- `src/designState.js` `createCounterModuleState` :293 [write]
- `src/designState.js` `createBaseWallModuleState` :337 [write]
- `src/designState.js` `createBaseModuleState` :377 [write]
- `src/designState.js` `createFurnitureModuleState` :401 [write-or-literal]
- `src/designState.js` `createCommercialModuleState` :455 [write-or-literal]
- `src/designState.js` `createUprightModuleState` :480 [write]
- `src/designState.js` `createUprightModuleState` :487 [write-or-literal]
- `src/designState.js` `createProfileModuleState` :496 [write]
- `src/designState.js` `createIndoorPlantModuleState` :558 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :575 [write]
- `src/designState.js` `createIlluminatedFoamModuleState` :584 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :625 [write-or-literal]
- `src/designState.js` `if` :816 [write]
- `src/catalog.js` `COUNTER_DIMENSIONS` :16 [write-or-literal]
- `src/catalog.js` `BASE_DIMENSIONS` :26 [write-or-literal]
- `src/catalog.js` `createFlatPanelCatalogItem` :62 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :72 [write]
- `src/catalog.js` `createUprightCatalogItem` :79 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :86 [write]
- `src/catalog.js` `createBaseWallCatalogItem` :103 [write-or-literal]
- `src/catalog.js` `createSeparatorCatalogItem` :115 [write-or-literal]
- `src/catalog.js` `createShelfCatalogItem` :127 [write-or-literal]
- `src/catalog.js` `furniture_sofa_set_classic_DIMENSIONS` :142 [write]
- `src/catalog.js` `furniture_sofa_single_classic_DIMENSIONS` :144 [write]
- `src/catalog.js` `furniture_sofa_double_classic_DIMENSIONS` :146 [write]
- `src/catalog.js` `furniture_coffee_table_classic_DIMENSIONS` :148 [write]
- `src/catalog.js` `chair_eames_DIMENSIONS` :155 [write]
- `src/catalog.js` `glass_table_DIMENSIONS` :157 [write]
- `src/catalog.js` `furniture_bar_stool_classic_DIMENSIONS` :159 [write]
- `src/catalog.js` `MINI_FRIDGE_DIMENSIONS` :160 [write]
- `src/catalog.js` `COAT_RACK_DIMENSIONS` :162 [write]
- `src/catalog.js` `PLASTIC_TRASH_BIN_DIMENSIONS` :164 [write]
- `src/catalog.js` `LED_FLOODLIGHT_DIMENSIONS` :209 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :220 [write-or-literal]
- `src/catalog.js` `createCommercialCatalogItem` :228 [write]
- `src/catalog.js` `createCommercialCatalogItem` :229 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :237 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :253 [write-or-literal]
- `src/catalog.js` `MODULE_CATALOG` :282 [write-or-literal]
- `src/moduleBehavior.js` `getModuleCollisionHeightRangeCm` :280 [write]
- `src/scene3d.js` `createFloorPattern` :563 [write]
- `src/scene3d.js` `createFallbackPlacementGhost` :1978 [write]
- `src/scene3d.js` `createFallbackPlacementGhost` :1988 [write-or-literal]
- `src/scene3d.js` `if` :2019 [write-or-literal]
- `src/scene3d.js` `ensurePlacementGhost` :2027 [write]
- `src/scene3d.js` `createMiniFridgeModule` :4995 [write]
- `src/scene3d.js` `createIndoorPlantModule` :5066 [write]
- `src/scene3d.js` `createCoatRackModule` :5226 [write]
- `src/scene3d.js` `createUprightModule` :5293 [write]
- `src/scene3d.js` `createProfileModule` :5342 [write]
- `src/scene3d.js` `createProfileModule` :5358 [write-or-literal]
- `src/scene3d.js` `createKettleModule` :5391 [write]
- `src/scene3d.js` `createLedFloodlightModule` :5457 [write]
- `src/scene3d.js` `createEamesChairModule` :5750 [write]
- `src/scene3d.js` `addProceduralGlassTable` :5831 [write]
- `src/scene3d.js` `createGlassTableModule` :5862 [write]
- `src/scene3d.js` `addClassicCoffeeTable` :6138 [write]
- `src/scene3d.js` `createBeigeSofaSetModule` :6268 [write]
- `src/scene3d.js` `createSofaPieceClassicModule` :6346 [write]
- `src/scene3d.js` `createCoffeeTableClassicModule` :6411 [write]
- `src/scene3d.js` `if` :6871 [write]
- `src/scene3d.js` `for` :7592 [write]
- `src/main.js` `resizeContextIlluminatedFoam` :876 [write]
- `src/main.js` `if` :1065 [write-or-literal]
- `src/main.js` `if` :1660 [write]
- `src/automaticWall.js` `composeAutomaticStandWall` :18 [write]
- `src/automaticWall.js` `for` :48 [write]
- `src/automaticWall.js` `addChunk` :99 [write]
- `src/automaticWall.js` `if` :102 [write-or-literal]
- `src/automaticWall.js` `if` :105 [write]
- `src/moduleMove.js` `if` :166 [write]
- `src/modulePlacement.js` `snapUprightToShortUpJoints` :770 [write-or-literal]
- `src/selectionFeedback.js` `if` :116 [write]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :21 [write]
- `src/wall.js` `composeStraightWall` :21 [write]
- `src/wallReflow.js` `getSegments` :19 [write]
- `src/wallReflow.js` `getContinuousWallCapacityCm` :32 [write]
- `src/wallReflow.js` `for` :98 [write]
- `src/wallReflow.js` `if` :102 [write]

## Default değeri

Item default: yalnız `src/items.js` dondurulmuş kayıt. Type default yok. Factory bu alanı kopyalamaz (eşdeğer `state.*` ayrı sütun).

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **17** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `upright`, `profile`, `shelf`, `showcase-board`, `showcase-accessory`, `floor`
- itemKey: `upright_346_5`, `upright_99`, `upright_49_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `shelf_100`, `shelf_150`, `shelf_200`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`, `parke-acik`, `parke-sari`, `parke-beton`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **8**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **9**
- tanımlı ama sahneye çıkmayan: `upright_99`, `upright_49_5`, `shelf_100`, `shelf_150`, `shelf_200`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Kod kaydı. Project DB'ye yazılmaz.

## Renderer etkisi

Mesh ölçeği / proxy kutu boyutu (type renderer).

## Placement / collision etkisi

Etkiler: snap, collision, side insert, short-up joint, L rotasyon, overlay mount. Ayrıntı `src/modulePlacement.js` + `getModuleBehavior`.

## BOM / composition etkisi

yok.

## Validation

Factory `Number(...)`; NaN durumları type'a göre null return veya yanlış ölçü. Genel şema yok.

## Bağımlılıklar

- kök katman: `static`

## Değiştirmenin yan etkileri

Kanonik kayıt değişirse catalog, factory, BOM, davranış çözümü ve test kilitleri birlikte etkilenir. Bu turda değiştirilmedi.

## CRUD sınıflandırması

ITEM_READONLY

## CRUD gerekçesi

Kanonik `src/items.js` kaydı. Runtime kullanıcı bu alanları item tanımı olarak değiştirmez; kopyalar factory/catalog/BOM tarafında okunur.

## Kanıt

- src dosya sayısı (unique): **14**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/moduleBehavior.js`, `src/scene3d.js`, `src/main.js`, `src/automaticWall.js`, `src/featureContracts.js`, `src/moduleMove.js`, `src/modulePlacement.js`, `src/selectionFeedback.js`, `src/standStandardsCopy.js`, `src/wall.js`, `src/wallReflow.js`

- `src/items.js` `LEAF_ITEMS` :3 [define]
- `src/items.js` `COMMERCIAL_ITEMS` :122 [define]
- `src/items.js` `FURNITURE_ITEMS` :154 [define]
- `src/items.js` (dosya düzeyi) :240 [define]
- `src/items.js` `TOP_LIGHT_ITEMS` :258 [define]
- `src/items.js` `NON_CATALOG_ITEMS` :277 [define]
- `src/items.js` `FLOOR_ITEMS` :292 [define]
- `src/items.js` `getFloorSelectLabel` :339 [write]
- `src/items.js` `isParquetFloorItem` :348 [read]
- `src/items.js` `isGridTileFloorItem` :354 [read]
- `src/items.js` `isCarpetFloorItem` :362 [read]
- `src/items.js` `INDOOR_PLANT_ITEMS` :384 [define]
- `src/items.js` `WALL_MEDIA_ITEMS` :425 [define]
- `src/items.js` `resolveWallMediaMetrics` :458 [write]
- `src/items.js` `if` :479 [write]
- `src/items.js` `COMPOSITE_ITEMS` :499 [define]
- `src/items.js` `if` :984 [read]
- `src/designState.js` `createFlatPanelModuleState` :98 [write]
- `src/designState.js` `createSeparatorModuleState` :152 [write]
- `src/designState.js` `createShowcaseModuleState` :171 [write]
- `src/designState.js` `createShelfModuleState` :225 [write]
- `src/designState.js` `createDoorModuleState` :244 [write]
- `src/designState.js` `createCounterModuleState` :293 [write]
- `src/designState.js` `createBaseWallModuleState` :337 [write]
- `src/designState.js` `createBaseModuleState` :377 [write]
- `src/designState.js` `createFurnitureModuleState` :401 [write-or-literal]
- `src/designState.js` `createCommercialModuleState` :455 [write-or-literal]
- `src/designState.js` `createUprightModuleState` :480 [write]
- `src/designState.js` `createUprightModuleState` :487 [write-or-literal]
- `src/designState.js` `createProfileModuleState` :496 [write]
- `src/designState.js` `createIndoorPlantModuleState` :558 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :575 [write]
- `src/designState.js` `createIlluminatedFoamModuleState` :584 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :625 [write-or-literal]
- `src/designState.js` `if` :816 [write]
- `src/designState.js` `if` :824 [read]
- `src/catalog.js` `COUNTER_DIMENSIONS` :16 [write-or-literal]
- `src/catalog.js` `COUNTER_DIMENSIONS` :19 [read]
- `src/catalog.js` `BASE_DIMENSIONS` :26 [write-or-literal]
- `src/catalog.js` `BASE_DIMENSIONS` :29 [read]
- `src/catalog.js` `createBaseCatalogItem` :40 [read]
- `src/catalog.js` `createCounterCatalogItem` :50 [read]
- `src/catalog.js` `createFlatPanelCatalogItem` :62 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :72 [write]
- `src/catalog.js` `createUprightCatalogItem` :79 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :86 [write]
- `src/catalog.js` `createBaseWallCatalogItem` :103 [write-or-literal]
- `src/catalog.js` `createSeparatorCatalogItem` :115 [write-or-literal]
- `src/catalog.js` `createShelfCatalogItem` :127 [write-or-literal]
- `src/catalog.js` `furniture_sofa_set_classic_DIMENSIONS` :142 [write]
- `src/catalog.js` `furniture_sofa_single_classic_DIMENSIONS` :144 [write]
- `src/catalog.js` `furniture_sofa_double_classic_DIMENSIONS` :146 [write]
- `src/catalog.js` `furniture_coffee_table_classic_DIMENSIONS` :148 [write]
- `src/catalog.js` `furniture_table_chair_set_eames_DIMENSIONS` :151 [read]
- `src/catalog.js` `chair_eames_DIMENSIONS` :155 [write]
- `src/catalog.js` `glass_table_DIMENSIONS` :157 [write]
- `src/catalog.js` `furniture_bar_stool_classic_DIMENSIONS` :159 [write]
- `src/catalog.js` `MINI_FRIDGE_DIMENSIONS` :160 [write]
- `src/catalog.js` `COAT_RACK_DIMENSIONS` :162 [write]
- `src/catalog.js` `PLASTIC_TRASH_BIN_DIMENSIONS` :164 [write]
- `src/catalog.js` `LED_FLOODLIGHT_DIMENSIONS` :209 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :220 [write-or-literal]
- `src/catalog.js` `createCommercialCatalogItem` :228 [write]
- `src/catalog.js` `createCommercialCatalogItem` :229 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :237 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :253 [write-or-literal]
- `src/catalog.js` `MODULE_CATALOG` :282 [write-or-literal]
- `src/moduleBehavior.js` `getModuleCollisionHeightRangeCm` :280 [write]
- `src/scene3d.js` `matchesConcreteParquetVisual` :553 [read]
- `src/scene3d.js` `createFloorPattern` :563 [write]
- `src/scene3d.js` `fixedElevationM` :1397 [read]
- `src/scene3d.js` `getPlacementGhostKey` :1882 [read]
- `src/scene3d.js` `if` :1884 [read]
- `src/scene3d.js` `createFallbackPlacementGhost` :1967 [read]
- `src/scene3d.js` `createFallbackPlacementGhost` :1978 [write]
- `src/scene3d.js` `createFallbackPlacementGhost` :1988 [write-or-literal]
- `src/scene3d.js` `createPlacementGhost` :1994 [read]
- `src/scene3d.js` `if` :2019 [write-or-literal]
- `src/scene3d.js` `ensurePlacementGhost` :2027 [write]
- `src/scene3d.js` `createMiniFridgeModule` :4995 [write]
- `src/scene3d.js` `createIndoorPlantModule` :5066 [write]
- `src/scene3d.js` `createCoatRackModule` :5226 [write]
- `src/scene3d.js` `createUprightModule` :5293 [write]
- `src/scene3d.js` `createProfileModule` :5342 [write]
- `src/scene3d.js` `createProfileModule` :5358 [write-or-literal]
- `src/scene3d.js` `createKettleModule` :5391 [write]
- `src/scene3d.js` `createLedFloodlightModule` :5457 [write]
- `src/scene3d.js` `createEamesChairModule` :5750 [write]
- `src/scene3d.js` `addProceduralGlassTable` :5831 [write]
- `src/scene3d.js` `createGlassTableModule` :5862 [write]
- `src/scene3d.js` `addClassicCoffeeTable` :6138 [write]
- `src/scene3d.js` `createBeigeSofaSetModule` :6268 [write]
- `src/scene3d.js` `createSofaPieceClassicModule` :6346 [write]
- `src/scene3d.js` `createCoffeeTableClassicModule` :6411 [write]
- `src/scene3d.js` `addProfile` :6483 [read]
- `src/scene3d.js` `if` :6871 [write]
- `src/scene3d.js` `for` :7591 [read]
- `src/scene3d.js` `for` :7592 [write]
- `src/main.js` `resizeContextIlluminatedFoam` :876 [write]
- `src/main.js` `resizeContextIlluminatedFoam` :877 [read]
- `src/main.js` `if` :1065 [write-or-literal]
- `src/main.js` `if` :1660 [write]
- `src/automaticWall.js` `composeAutomaticStandWall` :13 [read]
- `src/automaticWall.js` `composeAutomaticStandWall` :18 [write]
- `src/automaticWall.js` `for` :48 [write]
- `src/automaticWall.js` `addChunk` :99 [write]
- `src/automaticWall.js` `if` :102 [write-or-literal]
- `src/automaticWall.js` `if` :105 [write]
- `src/featureContracts.js` `FEATURE_CONTRACTS` :49 [read]
- `src/moduleMove.js` `if` :31 [read]
- `src/moduleMove.js` `if` :166 [write]
- `src/modulePlacement.js` `snapUprightToShortUpJoints` :770 [write-or-literal]
- `src/selectionFeedback.js` `if` :116 [write]
- `src/selectionFeedback.js` `if` :143 [read]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :21 [write]
- `src/wall.js` `validateWallLength` :3 [read]
- `src/wall.js` `if` :8 [read]
- `src/wall.js` `composeStraightWall` :20 [read]
- `src/wall.js` `composeStraightWall` :21 [write]
- `src/wallReflow.js` `getSegments` :19 [write]
- `src/wallReflow.js` `getContinuousWallCapacityCm` :32 [write]
- `src/wallReflow.js` `if` :57 [read]
- `src/wallReflow.js` `for` :98 [write]
- `src/wallReflow.js` `if` :102 [write]
- `test/automaticWall.test.js` (dosya düzeyi) :16 [test]
- `test/baseItemsContract.test.js` (dosya düzeyi) :51 [test]
- `test/baseRecipes.test.js` (dosya düzeyi) :8 [test]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :14 [test]
- `test/baseTopsItemContract.test.js` `for` :74 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :20 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :16 [test]
- `test/counterRecipes.test.js` (dosya düzeyi) :8 [test]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :32 [test]
- `test/counterTopsItemContract.test.js` `for` :62 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :82 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :39 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :17 [test]
- `test/floorItemsContract.test.js` `for` :39 [test]
- `test/furnitureItemsContract.test.js` `if` :162 [test]
- `test/glassShelfItemContract.test.js` (dosya düzeyi) :10 [test]
- `test/glassShelfItemContract.test.js` `for` :46 [test]
- `test/glassTableContract.test.js` (dosya düzeyi) :14 [test]
- `test/illuminatedFoamModule.test.js` (dosya düzeyi) :16 [test]
- `test/imageFit.test.js` (dosya düzeyi) :30 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :78 [test]
- `test/lCounter150Contract.test.js` (dosya düzeyi) :42 [test]
- `test/lCounter200Contract.test.js` (dosya düzeyi) :42 [test]
- `test/lightingItemsContract.test.js` (dosya düzeyi) :78 [test]
- `test/miniFridge.test.js` (dosya düzeyi) :8 [test]
- … test/e2e ek 35 eşleşme (src listesi tam).

- indeks: 19 / 188
