# `type`

**Özellik ID:** `type`
**İnsan tarafından anlaşılır adı:** Davranış / kayıt type anahtarı
**Kategori:** kimlik
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `upright` · `profile` · `panel` · `separator-panel` · `connector` · `door-leaf` · `shelf` · `shelf-accessory` · `showcase-board` · `showcase-accessory` · `counter-top` · `base-top` (+25)

## Ne işe yarar

`MODULE_STATE_FACTORIES`, `TYPE_BEHAVIORS`, `createRenderableModule` dalı ve `resolveItemKey` aday süzgeci.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `if` :100 [read]
- `src/items.js` `getCommercialItemForType` :144 [read]
- `src/items.js` `getFurnitureItemForType` :249 [read]
- `src/items.js` `getTopLightItemForType` :268 [read]
- `src/items.js` `resolveWallMediaMetrics` :457 [read]
- `src/items.js` `resolveWallMediaMetrics` :460 [write-or-literal]
- `src/designState.js` `createFlatPanelModuleState` :97 [read]
- `src/designState.js` `createFlatPanelModuleState` :105 [write-or-literal]
- `src/designState.js` `createSeparatorModuleState` :151 [read]
- `src/designState.js` `createSeparatorModuleState` :157 [write-or-literal]
- `src/designState.js` `createShelfModuleState` :231 [write-or-literal]
- `src/designState.js` `createCounterModuleState` :291 [read]
- `src/designState.js` `if` :309 [write-or-literal]
- `src/designState.js` `createBaseWallModuleState` :336 [read]
- `src/designState.js` `createBaseWallModuleState` :342 [write-or-literal]
- `src/designState.js` `createBaseModuleState` :376 [read]
- `src/designState.js` `createBaseModuleState` :382 [write-or-literal]
- `src/designState.js` `createFurnitureModuleState` :400 [write-or-literal]
- `src/designState.js` `createCommercialModuleState` :455 [write-or-literal]
- `src/designState.js` `createUprightModuleState` :484 [write-or-literal]
- `src/designState.js` `createProfileModuleState` :494 [read]
- `src/designState.js` `createProfileModuleState` :500 [write-or-literal]
- `src/designState.js` `createIndoorPlantModuleState` :557 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :580 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :624 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :635 [define]
- `src/designState.js` `createLedFloodlightModuleState` :660 [write]
- `src/designState.js` `MODULE_STATE_TYPES` :668 [define]
- `src/designState.js` `createModuleStateFromDescriptor` :675 [write]
- `src/designState.js` `if` :701 [read]
- `src/designState.js` `if` :840 [write]
- `src/catalog.js` `createBaseCatalogItem` :39 [write-or-literal]
- `src/catalog.js` `createCounterCatalogItem` :49 [write-or-literal]
- `src/catalog.js` `createFlatPanelCatalogItem` :61 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :76 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :90 [write-or-literal]
- `src/catalog.js` `createBaseWallCatalogItem` :102 [write-or-literal]
- `src/catalog.js` `createSeparatorCatalogItem` :114 [write-or-literal]
- `src/catalog.js` `createShelfCatalogItem` :126 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :219 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :236 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :252 [write-or-literal]
- `src/moduleBehavior.js` `overlayBehavior` :87 [define]
- `src/moduleBehavior.js` `hasExplicitModuleBehavior` :214 [read]
- `src/moduleBehavior.js` `getModuleBehavior` :220 [write]
- `src/moduleContracts.js` `resolveModuleContract` :225 [write-or-literal]

## Okuyan yerler

- `src/items.js` `if` :100 [read]
- `src/items.js` `getCommercialItemForType` :144 [read]
- `src/items.js` `getFurnitureItemForType` :249 [read]
- `src/items.js` `getTopLightItemForType` :268 [read]
- `src/items.js` `resolveWallMediaMetrics` :457 [read]
- `src/designState.js` `createFlatPanelModuleState` :97 [read]
- `src/designState.js` `createSeparatorModuleState` :151 [read]
- `src/designState.js` `createCounterModuleState` :291 [read]
- `src/designState.js` `createBaseWallModuleState` :336 [read]
- `src/designState.js` `createBaseModuleState` :376 [read]
- `src/designState.js` `createProfileModuleState` :494 [read]
- `src/designState.js` `if` :701 [read]
- `src/moduleBehavior.js` `hasExplicitModuleBehavior` :214 [read]
- `src/scene3d.js` `if` :1453 [read]
- `src/scene3d.js` `previewCatalogModuleDrag` :2422 [read]
- `src/scene3d.js` `updatePlacementDrag` :2701 [read]
- `src/scene3d.js` `createIndoorPlantModule` :5063 [read]
- `src/main.js` `onKeyDown` :1705 [read]
- `src/projectImportValidation.js` `validateImportedModuleState` :34 [read]
- `test/barStool2.test.js` (dosya düzeyi) :9 [test]
- `test/baseItemsContract.test.js` (dosya düzeyi) :46 [test]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :36 [test]
- `test/baseWallRecipes.test.js` `for` :35 [test]
- `test/chairEamesContract.test.js` (dosya düzeyi) :12 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :40 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :63 [test]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :30 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :77 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :37 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :15 [test]
- `test/floorItemsContract.test.js` `for` :32 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :153 [test]
- `test/glassShelfItemContract.test.js` (dosya düzeyi) :20 [test]
- `test/glassTableContract.test.js` (dosya düzeyi) :12 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :75 [test]
- `test/lCounter100Contract.test.js` (dosya düzeyi) :8 [test]
- `test/moduleRecipes.test.js` (dosya düzeyi) :28 [test]
- `test/moduleStateConstructionRegistry.test.js` `for` :15 [test]
- `test/panel197ItemContract.test.js` (dosya düzeyi) :23 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :25 [test]
- `test/plasticTrashBinModule.test.js` `overlaps` :45 [test]
- `test/profile190ItemContract.test.js` (dosya düzeyi) :29 [test]
- `test/profile190ItemContract.test.js` `for` :67 [test]
- `test/profileIntrinsicProperties.test.js` `for` :18 [test]
- … test/e2e ek 33 eşleşme (src listesi tam).

## Yazan / değiştiren yerler

- `src/items.js` `resolveWallMediaMetrics` :460 [write-or-literal]
- `src/designState.js` `createFlatPanelModuleState` :105 [write-or-literal]
- `src/designState.js` `createSeparatorModuleState` :157 [write-or-literal]
- `src/designState.js` `createShelfModuleState` :231 [write-or-literal]
- `src/designState.js` `if` :309 [write-or-literal]
- `src/designState.js` `createBaseWallModuleState` :342 [write-or-literal]
- `src/designState.js` `createBaseModuleState` :382 [write-or-literal]
- `src/designState.js` `createFurnitureModuleState` :400 [write-or-literal]
- `src/designState.js` `createCommercialModuleState` :455 [write-or-literal]
- `src/designState.js` `createUprightModuleState` :484 [write-or-literal]
- `src/designState.js` `createProfileModuleState` :500 [write-or-literal]
- `src/designState.js` `createIndoorPlantModuleState` :557 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :580 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :624 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :635 [define]
- `src/designState.js` `createLedFloodlightModuleState` :660 [write]
- `src/designState.js` `MODULE_STATE_TYPES` :668 [define]
- `src/designState.js` `createModuleStateFromDescriptor` :675 [write]
- `src/designState.js` `if` :840 [write]
- `src/catalog.js` `createBaseCatalogItem` :39 [write-or-literal]
- `src/catalog.js` `createCounterCatalogItem` :49 [write-or-literal]
- `src/catalog.js` `createFlatPanelCatalogItem` :61 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :76 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :90 [write-or-literal]
- `src/catalog.js` `createBaseWallCatalogItem` :102 [write-or-literal]
- `src/catalog.js` `createSeparatorCatalogItem` :114 [write-or-literal]
- `src/catalog.js` `createShelfCatalogItem` :126 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :219 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :236 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :252 [write-or-literal]
- `src/moduleBehavior.js` `overlayBehavior` :87 [define]
- `src/moduleBehavior.js` `getModuleBehavior` :220 [write]
- `src/moduleContracts.js` `resolveModuleContract` :225 [write-or-literal]
- `src/scene3d.js` `pickModuleContext` :1807 [write-or-literal]
- `src/scene3d.js` `rotateSelectedModule` :2252 [write]
- `src/scene3d.js` `rotateSelectedModule` :2264 [write-or-literal]
- `src/scene3d.js` `getFreeTvPlacement` :2299 [write-or-literal]
- `src/scene3d.js` `if` :2458 [write-or-literal]
- `src/scene3d.js` `if` :4313 [write]
- `src/scene3d.js` `createLedFloodlightModule` :5465 [write-or-literal]
- `src/scene3d.js` `createSofaPieceClassicModule` :6354 [write-or-literal]
- `src/scene3d.js` `createBaseModule` :6463 [write-or-literal]
- `src/scene3d.js` `createCounterModule` :6627 [write-or-literal]
- `src/scene3d.js` `createFlatPanelModule` :7002 [write-or-literal]
- `src/scene3d.js` `createDoorModule` :7135 [write-or-literal]
- `src/scene3d.js` `createSeparatorModule` :7319 [write-or-literal]
- `src/scene3d.js` `for` :7529 [write-or-literal]
- `src/main.js` `for` :678 [write-or-literal]

## Default değeri

Item default: `src/items.js` `type`. Factory `modules[].type` kopyası. `MODULE_STATE_FACTORIES[descriptor.type]` lookup; type yoksa factory null.

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **104** / 104
- seçim kuralı: `listRegisteredItems()` içindeki her kayıt (104). TSV hücresi boş değil.
- type'lar: `upright`, `profile`, `panel`, `separator-panel`, `connector`, `door-leaf`, `shelf`, `shelf-accessory`, `showcase-board`, `showcase-accessory`, `counter-top`, `base-top`, `coat-rack`, `kettle`, `mini-fridge`, `plastic-trash-bin`, `sofa-set-classic`, `sofa-single-classic`, `sofa-double-classic`, `coffee-table-classic`, `table-chair-set-eames`, `chair`, `table-glass`, `bar-stool`, `indoor-plant-1`, `tv`, `led-floodlight`, `illuminated-foam`, `floor`, `door`, `base`, `counter`, `flat-panel`, `base-wall`, `separator`, `showcase-2`, `showcase-3`
- itemKey: `upright_346_5`, `upright_99`, `upright_49_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `connector_start`, `connector_single`, `connector_double`, `connector_corner`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `shelf_leg`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`, `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`, `furniture_sofa_set_classic`, `furniture_sofa_single_classic`, `furniture_sofa_double_classic`, `furniture_coffee_table_classic`, `furniture_table_chair_set_eames`, `chair_eames`, `glass_table`, `furniture_bar_stool_classic`, `EXTRA_INDOOR_PLANT_1`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`, `TV_42`, `TV_55`, `TV_65`, `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`, `led_floodlight`, `illuminated-foam`, `karolaj`, `hali`, `parke-acik`, `parke-sari`, `parke-beton`, `door_100`, `BASE_100`, `BASE_150`, `BASE_200`, `desk_banko_100`, `desk_banko_150`, `desk_banko_200`, `desk_banko_100_L`, `desk_banko_150_L`, `desk_banko_200_L`, `wall_50`, `wall_100`, `wall_150`, `wall_200`, `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`, `wall_base_100`, `wall_base_150`, `wall_base_200`, `wall_separator_50`, `wall_separator_100`, `wall_separator_50_sarmasik`, `wall_separator_100_sarmasik`, `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`, `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **70**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **34**
- tanımlı ama sahneye çıkmayan: `upright_99`, `upright_49_5`, `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `connector_start`, `connector_single`, `connector_double`, `connector_corner`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `shelf_leg`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Kod kaydı + `modules[].type` factory kopyası persist blob'da vardır (`buildProjectSnapshot` modules).

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `type`

## Değiştirmenin yan etkileri

Kanonik kayıt değişirse catalog, factory, BOM, davranış çözümü ve test kilitleri birlikte etkilenir. Bu turda değiştirilmedi.

## CRUD sınıflandırması

ITEM_READONLY

## CRUD gerekçesi

Kanonik `src/items.js` kaydı. Runtime kullanıcı bu alanları item tanımı olarak değiştirmez; kopyalar factory/catalog/BOM tarafında okunur.

## Kanıt

- src dosya sayısı (unique): **8**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/moduleBehavior.js`, `src/moduleContracts.js`, `src/scene3d.js`, `src/main.js`, `src/projectImportValidation.js`

- `src/items.js` `if` :100 [read]
- `src/items.js` `getCommercialItemForType` :144 [read]
- `src/items.js` `getFurnitureItemForType` :249 [read]
- `src/items.js` `getTopLightItemForType` :268 [read]
- `src/items.js` `resolveWallMediaMetrics` :457 [read]
- `src/items.js` `resolveWallMediaMetrics` :460 [write-or-literal]
- `src/designState.js` `createFlatPanelModuleState` :97 [read]
- `src/designState.js` `createFlatPanelModuleState` :105 [write-or-literal]
- `src/designState.js` `createSeparatorModuleState` :151 [read]
- `src/designState.js` `createSeparatorModuleState` :157 [write-or-literal]
- `src/designState.js` `createShelfModuleState` :231 [write-or-literal]
- `src/designState.js` `createCounterModuleState` :291 [read]
- `src/designState.js` `if` :309 [write-or-literal]
- `src/designState.js` `createBaseWallModuleState` :336 [read]
- `src/designState.js` `createBaseWallModuleState` :342 [write-or-literal]
- `src/designState.js` `createBaseModuleState` :376 [read]
- `src/designState.js` `createBaseModuleState` :382 [write-or-literal]
- `src/designState.js` `createFurnitureModuleState` :400 [write-or-literal]
- `src/designState.js` `createCommercialModuleState` :455 [write-or-literal]
- `src/designState.js` `createUprightModuleState` :484 [write-or-literal]
- `src/designState.js` `createProfileModuleState` :494 [read]
- `src/designState.js` `createProfileModuleState` :500 [write-or-literal]
- `src/designState.js` `createIndoorPlantModuleState` :557 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :580 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :624 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :635 [define]
- `src/designState.js` `createLedFloodlightModuleState` :660 [write]
- `src/designState.js` `MODULE_STATE_TYPES` :668 [define]
- `src/designState.js` `createModuleStateFromDescriptor` :675 [write]
- `src/designState.js` `if` :701 [read]
- `src/designState.js` `if` :840 [write]
- `src/catalog.js` `createBaseCatalogItem` :39 [write-or-literal]
- `src/catalog.js` `createCounterCatalogItem` :49 [write-or-literal]
- `src/catalog.js` `createFlatPanelCatalogItem` :61 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :76 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :90 [write-or-literal]
- `src/catalog.js` `createBaseWallCatalogItem` :102 [write-or-literal]
- `src/catalog.js` `createSeparatorCatalogItem` :114 [write-or-literal]
- `src/catalog.js` `createShelfCatalogItem` :126 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :219 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :236 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :252 [write-or-literal]
- `src/moduleBehavior.js` `overlayBehavior` :87 [define]
- `src/moduleBehavior.js` `hasExplicitModuleBehavior` :214 [read]
- `src/moduleBehavior.js` `getModuleBehavior` :220 [write]
- `src/moduleContracts.js` `resolveModuleContract` :225 [write-or-literal]
- `src/scene3d.js` `if` :1453 [read]
- `src/scene3d.js` `pickModuleContext` :1807 [write-or-literal]
- `src/scene3d.js` `rotateSelectedModule` :2252 [write]
- `src/scene3d.js` `rotateSelectedModule` :2264 [write-or-literal]
- `src/scene3d.js` `getFreeTvPlacement` :2299 [write-or-literal]
- `src/scene3d.js` `previewCatalogModuleDrag` :2422 [read]
- `src/scene3d.js` `if` :2458 [write-or-literal]
- `src/scene3d.js` `updatePlacementDrag` :2701 [read]
- `src/scene3d.js` `if` :4313 [write]
- `src/scene3d.js` `createIndoorPlantModule` :5063 [read]
- `src/scene3d.js` `createLedFloodlightModule` :5465 [write-or-literal]
- `src/scene3d.js` `createSofaPieceClassicModule` :6354 [write-or-literal]
- `src/scene3d.js` `createBaseModule` :6463 [write-or-literal]
- `src/scene3d.js` `createCounterModule` :6627 [write-or-literal]
- `src/scene3d.js` `createFlatPanelModule` :7002 [write-or-literal]
- `src/scene3d.js` `createDoorModule` :7135 [write-or-literal]
- `src/scene3d.js` `createSeparatorModule` :7319 [write-or-literal]
- `src/scene3d.js` `for` :7529 [write-or-literal]
- `src/main.js` `for` :678 [write-or-literal]
- `src/main.js` `onKeyDown` :1705 [read]
- `src/projectImportValidation.js` `validateImportedModuleState` :34 [read]
- `test/barStool2.test.js` (dosya düzeyi) :9 [test]
- `test/baseItemsContract.test.js` (dosya düzeyi) :46 [test]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :36 [test]
- `test/baseWallRecipes.test.js` `for` :35 [test]
- `test/chairEamesContract.test.js` (dosya düzeyi) :12 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :40 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :63 [test]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :30 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :77 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :37 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :15 [test]
- `test/floorItemsContract.test.js` `for` :32 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :153 [test]
- `test/glassShelfItemContract.test.js` (dosya düzeyi) :20 [test]
- `test/glassTableContract.test.js` (dosya düzeyi) :12 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :75 [test]
- `test/lCounter100Contract.test.js` (dosya düzeyi) :8 [test]
- `test/moduleRecipes.test.js` (dosya düzeyi) :28 [test]
- `test/moduleStateConstructionRegistry.test.js` `for` :15 [test]
- `test/panel197ItemContract.test.js` (dosya düzeyi) :23 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :25 [test]
- `test/plasticTrashBinModule.test.js` `overlaps` :45 [test]
- `test/profile190ItemContract.test.js` (dosya düzeyi) :29 [test]
- `test/profile190ItemContract.test.js` `for` :67 [test]
- `test/profileIntrinsicProperties.test.js` `for` :18 [test]
- … test/e2e ek 33 eşleşme (src listesi tam).

- **Hardcoded / sapma:** Hardcoded: `createRenderableModule` `plastic-trash-bin` dalını `createIndoorPlantModule` ile paylaşır (`src/scene3d.js`).

- indeks: 3 / 188
