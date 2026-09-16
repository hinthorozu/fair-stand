# `catalog.label`

**Özellik ID:** `catalog.label`
**İnsan tarafından anlaşılır adı:** Katalog kart etiketi
**Kategori:** katalog
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `Dikme 346,5 cm` · `Profil 41,5 cm` · `Profil 91 cm` · `Profil 140,5 cm` · `Profil 190 cm` · `Askılık` · `Kettle` · `Mini Buzdolabı` · `Çöp Kutusu` · `Koltuk Takımı` · `Tekli Koltuk` · `Çiftli Koltuk` (+52)

## Ne işe yarar

Katalog descriptor alanı. Kaynak Item + `create*CatalogItem` eşlemesi (profilde width remap). Sidebar/drag bu nesneyi taşır.

## Canonical owner

- katman: katalog descriptor (Item türevi)
- dosya: `src/catalog.js`
- sembol: `MODULE_CATALOG / create*CatalogItem`

## Tanımlandığı yerler

- `src/items.js` `getTopLightItemForType` :271 [read]
- `src/items.js` `resolveWallMediaMetrics` :460 [write-or-literal]
- `src/catalog.js` `createBaseCatalogItem` :41 [write-or-literal]
- `src/catalog.js` `createCounterCatalogItem` :51 [write-or-literal]
- `src/catalog.js` `createFlatPanelCatalogItem` :63 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :80 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :94 [write-or-literal]
- `src/catalog.js` `createBaseWallCatalogItem` :106 [write-or-literal]
- `src/catalog.js` `createSeparatorCatalogItem` :116 [write-or-literal]
- `src/catalog.js` `createShelfCatalogItem` :129 [write-or-literal]
- `src/catalog.js` `createWallMediaCatalogItem` :184 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :223 [write-or-literal]
- `src/catalog.js` `createCommercialCatalogItem` :229 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :240 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :256 [write-or-literal]
- `src/catalog.js` `MODULE_CATALOG` :260 [define]
- `src/catalog.js` `MODULE_CATALOG` :284 [write-or-literal]
- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :425 [write-or-literal]
- `src/catalog.js` `resolveItemKey` :500 [read]
- `src/catalog.js` `resolveItemKey` :503 [write]
- `src/catalog.js` `getModuleCatalogItem` :534 [read]
- `src/catalog.js` `getModuleCatalogLabel` :538 [read]
- `src/moduleContracts.js` (dosya düzeyi) :1 [read]
- `src/moduleContracts.js` `resolveModuleContract` :210 [read]
- `src/moduleContracts.js` `resolveModuleContract` :215 [write]

## Okuyan yerler

- `src/items.js` `getTopLightItemForType` :271 [read]
- `src/catalog.js` `resolveItemKey` :500 [read]
- `src/catalog.js` `getModuleCatalogItem` :534 [read]
- `src/catalog.js` `getModuleCatalogLabel` :538 [read]
- `src/moduleContracts.js` (dosya düzeyi) :1 [read]
- `src/moduleContracts.js` `resolveModuleContract` :210 [read]
- `src/scene3d.js` `getViewCubeFit` :272 [read]
- `src/scene3d.js` `if` :2079 [read]
- `src/scene3d.js` `createMiniFridgeTopLabel` :4942 [read]
- `src/scene3d.js` `createPlasticTrashBinTopLabel` :4988 [read]
- `src/main.js` (dosya düzeyi) :194 [read]
- `src/main.js` `if` :1117 [read]
- `src/main.js` `requestIlluminatedFoamDimensions` :1609 [read]
- `src/autoDepot.js` (dosya düzeyi) :1 [read]
- `src/helpGuide.js` `initHelpGuide` :251 [read]
- `src/moduleContextMenu.js` (dosya düzeyi) :1 [read]
- `src/moduleContextMenu.js` `createModuleContextMenu` :43 [read]
- `src/moduleContextMenu.js` `addModuleToSelection` :240 [read]
- `src/moduleDragSidebar.js` (dosya düzeyi) :1 [read]
- `src/moduleDragSidebar.js` `resetDragState` :445 [read]
- `src/projectNaming.js` `updatePreview` :77 [read]
- `src/rawBomDebug.js` `renderItemBom` :78 [read]
- `src/rawBomDebug.js` `if` :141 [read]
- `src/selectionFeedback.js` `if` :34 [read]
- `src/selectionFeedback.js` `describeFloorSelection` :177 [read]
- `src/sidebarController.js` `if` :13 [read]
- `src/viewCube.js` `createViewCube` :25 [read]
- `src/viewCube.js` `createFaceTexture` :327 [read]
- `test/barStool2.test.js` (dosya düzeyi) :3 [test]
- `test/baseItemsContract.test.js` (dosya düzeyi) :4 [test]
- `test/baseItemsContract.test.js` `for` :114 [test]
- `test/baseModule.test.js` (dosya düzeyi) :3 [test]
- `test/baseWallCatalog.test.js` (dosya düzeyi) :3 [test]
- `test/baseWallCatalog.test.js` `for` :9 [test]
- `test/baseWallRecipes.test.js` (dosya düzeyi) :4 [test]
- `test/baseWallRecipes.test.js` `for` :34 [test]
- `test/catalogSingleSource.test.js` (dosya düzeyi) :7 [test]
- `test/chairEamesContract.test.js` (dosya düzeyi) :4 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :4 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :5 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/deskBankoItemsContract.test.js` `if` :95 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/eamesTableChairSetContract.test.js` (dosya düzeyi) :4 [test]
- `test/floorItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/floorItemsContract.test.js` `for` :35 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/furnitureItemsContract.test.js` `if` :167 [test]
- `test/glassTableContract.test.js` (dosya düzeyi) :4 [test]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :4 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :4 [test]
- `test/kettle.test.js` (dosya düzeyi) :4 [test]
- … test/e2e ek 44 eşleşme (src listesi tam).

## Yazan / değiştiren yerler

- `src/items.js` `resolveWallMediaMetrics` :460 [write-or-literal]
- `src/catalog.js` `createBaseCatalogItem` :41 [write-or-literal]
- `src/catalog.js` `createCounterCatalogItem` :51 [write-or-literal]
- `src/catalog.js` `createFlatPanelCatalogItem` :63 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :80 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :94 [write-or-literal]
- `src/catalog.js` `createBaseWallCatalogItem` :106 [write-or-literal]
- `src/catalog.js` `createSeparatorCatalogItem` :116 [write-or-literal]
- `src/catalog.js` `createShelfCatalogItem` :129 [write-or-literal]
- `src/catalog.js` `createWallMediaCatalogItem` :184 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :223 [write-or-literal]
- `src/catalog.js` `createCommercialCatalogItem` :229 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :240 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :256 [write-or-literal]
- `src/catalog.js` `MODULE_CATALOG` :260 [define]
- `src/catalog.js` `MODULE_CATALOG` :284 [write-or-literal]
- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :425 [write-or-literal]
- `src/catalog.js` `resolveItemKey` :503 [write]
- `src/moduleContracts.js` `resolveModuleContract` :215 [write]
- `src/scene3d.js` (dosya düzeyi) :289 [write]
- `src/scene3d.js` `if` :2077 [write]
- `src/scene3d.js` `createMiniFridgeTopLabel` :4931 [write]
- `src/scene3d.js` `createPlasticTrashBinTopLabel` :4976 [write]
- `src/main.js` `if` :1115 [write]
- `src/main.js` `requestIlluminatedFoamDimensions` :1611 [write]
- `src/autoDepot.js` `AUTO_DEPOT_SIZES` :5 [write-or-literal]
- `src/autoDepot.js` `AUTO_DEPOT_SIZES` :12 [write]
- `src/autoDepot.js` `if` :76 [write]
- `src/helpGuide.js` `initHelpGuide` :259 [write]
- `src/moduleContextMenu.js` `createModuleContextMenu` :65 [write]
- `src/moduleContextMenu.js` `renderSelectionQueue` :144 [write]
- `src/moduleContextMenu.js` `submitPickerSelection` :249 [write]
- `src/moduleContextMenu.js` `createPickerCard` :290 [write]
- `src/moduleContextMenu.js` `renderPickerCatalog` :318 [write]
- `src/moduleDragSidebar.js` `createModuleDragSidebar` :394 [write]
- `src/moduleDragSidebar.js` `resetDragState` :431 [write]
- `src/projectNaming.js` `if` :57 [write]
- `src/rawBomDebug.js` `parseLCounterSelection` :21 [write-or-literal]
- `src/rawBomDebug.js` `renderRecipe` :55 [write]
- `src/rawBomDebug.js` `if` :65 [write]
- `src/rawBomDebug.js` `renderItemBom` :90 [write]
- `src/selectionFeedback.js` `describeFloorSelection` :175 [write]
- `src/viewCube.js` (dosya düzeyi) :14 [write-or-literal]
- `src/viewCube.js` `createViewCube` :57 [write]
- `index.html` (dosya düzeyi) :53 [write]

## Default değeri

Catalog default: `create*CatalogItem` Item alanından kopya. Profil `widthCm` `getStraightWallNominalWidthForProfileItem` ile remap. Kullanıcı ezemaz.

## Override zinciri

Item kaydı → create*CatalogItem eşlemesi → MODULE_CATALOG. Kullanıcı katalog alanını ezemaz.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **64** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `upright`, `profile`, `coat-rack`, `kettle`, `mini-fridge`, `plastic-trash-bin`, `sofa-set-classic`, `sofa-single-classic`, `sofa-double-classic`, `coffee-table-classic`, `table-chair-set-eames`, `chair`, `table-glass`, `bar-stool`, `indoor-plant-1`, `tv`, `led-floodlight`, `door`, `base`, `counter`, `flat-panel`, `base-wall`, `separator`, `shelf`, `showcase-2`, `showcase-3`
- itemKey: `upright_346_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`, `furniture_sofa_set_classic`, `furniture_sofa_single_classic`, `furniture_sofa_double_classic`, `furniture_coffee_table_classic`, `furniture_table_chair_set_eames`, `chair_eames`, `glass_table`, `furniture_bar_stool_classic`, `EXTRA_INDOOR_PLANT_1`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`, `TV_42`, `TV_55`, `TV_65`, `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`, `led_floodlight`, `door_100`, `BASE_100`, `BASE_150`, `BASE_200`, `desk_banko_100`, `desk_banko_150`, `desk_banko_200`, `desk_banko_100_L`, `desk_banko_150_L`, `desk_banko_200_L`, `wall_50`, `wall_100`, `wall_150`, `wall_200`, `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`, `wall_base_100`, `wall_base_150`, `wall_base_200`, `wall_separator_50`, `wall_separator_100`, `wall_separator_50_sarmasik`, `wall_separator_100_sarmasik`, `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`, `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **64**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Kod tablosu. Persist yok (her load'da type/itemKey ile yeniden çözülür).

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

validation yok (tablo/audit).

## Bağımlılıklar

- kök katman: `catalog`
- kaynak: eşdeğer `static.*` / Item dimensions (profil width remap).

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

DERIVED

## CRUD gerekçesi

`MODULE_CATALOG` satırı `src/catalog.js` create*CatalogItem ile Item kaydından kopyalanır; ayrı yazılmaz.

## Kanıt

- src dosya sayısı (unique): **15**
- src dosyaları: `src/items.js`, `src/catalog.js`, `src/moduleContracts.js`, `src/scene3d.js`, `src/main.js`, `src/autoDepot.js`, `src/helpGuide.js`, `src/moduleContextMenu.js`, `src/moduleDragSidebar.js`, `src/projectNaming.js`, `src/rawBomDebug.js`, `src/selectionFeedback.js`, `src/sidebarController.js`, `src/viewCube.js`, `index.html`

- `src/items.js` `getTopLightItemForType` :271 [read]
- `src/items.js` `resolveWallMediaMetrics` :460 [write-or-literal]
- `src/catalog.js` `createBaseCatalogItem` :41 [write-or-literal]
- `src/catalog.js` `createCounterCatalogItem` :51 [write-or-literal]
- `src/catalog.js` `createFlatPanelCatalogItem` :63 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :80 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :94 [write-or-literal]
- `src/catalog.js` `createBaseWallCatalogItem` :106 [write-or-literal]
- `src/catalog.js` `createSeparatorCatalogItem` :116 [write-or-literal]
- `src/catalog.js` `createShelfCatalogItem` :129 [write-or-literal]
- `src/catalog.js` `createWallMediaCatalogItem` :184 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :223 [write-or-literal]
- `src/catalog.js` `createCommercialCatalogItem` :229 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :240 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :256 [write-or-literal]
- `src/catalog.js` `MODULE_CATALOG` :260 [define]
- `src/catalog.js` `MODULE_CATALOG` :284 [write-or-literal]
- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :425 [write-or-literal]
- `src/catalog.js` `resolveItemKey` :500 [read]
- `src/catalog.js` `resolveItemKey` :503 [write]
- `src/catalog.js` `getModuleCatalogItem` :534 [read]
- `src/catalog.js` `getModuleCatalogLabel` :538 [read]
- `src/moduleContracts.js` (dosya düzeyi) :1 [read]
- `src/moduleContracts.js` `resolveModuleContract` :210 [read]
- `src/moduleContracts.js` `resolveModuleContract` :215 [write]
- `src/scene3d.js` `getViewCubeFit` :272 [read]
- `src/scene3d.js` (dosya düzeyi) :289 [write]
- `src/scene3d.js` `if` :2077 [write]
- `src/scene3d.js` `if` :2079 [read]
- `src/scene3d.js` `createMiniFridgeTopLabel` :4931 [write]
- `src/scene3d.js` `createMiniFridgeTopLabel` :4942 [read]
- `src/scene3d.js` `createPlasticTrashBinTopLabel` :4976 [write]
- `src/scene3d.js` `createPlasticTrashBinTopLabel` :4988 [read]
- `src/main.js` (dosya düzeyi) :194 [read]
- `src/main.js` `if` :1115 [write]
- `src/main.js` `if` :1117 [read]
- `src/main.js` `requestIlluminatedFoamDimensions` :1609 [read]
- `src/main.js` `requestIlluminatedFoamDimensions` :1611 [write]
- `src/autoDepot.js` (dosya düzeyi) :1 [read]
- `src/autoDepot.js` `AUTO_DEPOT_SIZES` :5 [write-or-literal]
- `src/autoDepot.js` `AUTO_DEPOT_SIZES` :12 [write]
- `src/autoDepot.js` `if` :76 [write]
- `src/helpGuide.js` `initHelpGuide` :251 [read]
- `src/helpGuide.js` `initHelpGuide` :259 [write]
- `src/moduleContextMenu.js` (dosya düzeyi) :1 [read]
- `src/moduleContextMenu.js` `createModuleContextMenu` :43 [read]
- `src/moduleContextMenu.js` `createModuleContextMenu` :65 [write]
- `src/moduleContextMenu.js` `renderSelectionQueue` :144 [write]
- `src/moduleContextMenu.js` `addModuleToSelection` :240 [read]
- `src/moduleContextMenu.js` `submitPickerSelection` :249 [write]
- `src/moduleContextMenu.js` `createPickerCard` :290 [write]
- `src/moduleContextMenu.js` `renderPickerCatalog` :318 [write]
- `src/moduleDragSidebar.js` (dosya düzeyi) :1 [read]
- `src/moduleDragSidebar.js` `createModuleDragSidebar` :394 [write]
- `src/moduleDragSidebar.js` `resetDragState` :431 [write]
- `src/moduleDragSidebar.js` `resetDragState` :445 [read]
- `src/projectNaming.js` `if` :57 [write]
- `src/projectNaming.js` `updatePreview` :77 [read]
- `src/rawBomDebug.js` `parseLCounterSelection` :21 [write-or-literal]
- `src/rawBomDebug.js` `renderRecipe` :55 [write]
- `src/rawBomDebug.js` `if` :65 [write]
- `src/rawBomDebug.js` `renderItemBom` :78 [read]
- `src/rawBomDebug.js` `renderItemBom` :90 [write]
- `src/rawBomDebug.js` `if` :141 [read]
- `src/selectionFeedback.js` `if` :34 [read]
- `src/selectionFeedback.js` `describeFloorSelection` :175 [write]
- `src/selectionFeedback.js` `describeFloorSelection` :177 [read]
- `src/sidebarController.js` `if` :13 [read]
- `src/viewCube.js` (dosya düzeyi) :14 [write-or-literal]
- `src/viewCube.js` `createViewCube` :25 [read]
- `src/viewCube.js` `createViewCube` :57 [write]
- `src/viewCube.js` `createFaceTexture` :327 [read]
- `index.html` (dosya düzeyi) :53 [write]
- `test/barStool2.test.js` (dosya düzeyi) :3 [test]
- `test/baseItemsContract.test.js` (dosya düzeyi) :4 [test]
- `test/baseItemsContract.test.js` `for` :114 [test]
- `test/baseModule.test.js` (dosya düzeyi) :3 [test]
- `test/baseWallCatalog.test.js` (dosya düzeyi) :3 [test]
- `test/baseWallCatalog.test.js` `for` :9 [test]
- `test/baseWallRecipes.test.js` (dosya düzeyi) :4 [test]
- `test/baseWallRecipes.test.js` `for` :34 [test]
- `test/catalogSingleSource.test.js` (dosya düzeyi) :7 [test]
- `test/chairEamesContract.test.js` (dosya düzeyi) :4 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :4 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :5 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/deskBankoItemsContract.test.js` `if` :95 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/eamesTableChairSetContract.test.js` (dosya düzeyi) :4 [test]
- `test/floorItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/floorItemsContract.test.js` `for` :35 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/furnitureItemsContract.test.js` `if` :167 [test]
- `test/glassTableContract.test.js` (dosya düzeyi) :4 [test]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :4 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :4 [test]
- `test/kettle.test.js` (dosya düzeyi) :4 [test]
- … test/e2e ek 44 eşleşme (src listesi tam).

- indeks: 54 / 188
