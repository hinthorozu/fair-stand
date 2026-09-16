# `catalog.modelFile`

**Özellik ID:** `catalog.modelFile`
**İnsan tarafından anlaşılır adı:** Katalog descriptor: modelFile
**Kategori:** katalog
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `coat_rack.glb` · `kettle.glb` · `80s_avanti_mini_fridge.glb` · `plastic_trash_bin.glb` · `saksi_bitkili_100x30x30.glb` · `saksi_bitkili_150x30x30.glb` · `saksi_bitkili_200x30x30.glb` · `wall_separator_50_sarmasik.glb` · `wall_separator_100_sarmasik.glb`

## Ne işe yarar

Katalog descriptor alanı. Kaynak Item + `create*CatalogItem` eşlemesi (profilde width remap). Sidebar/drag bu nesneyi taşır.

## Canonical owner

- katman: katalog descriptor (Item türevi)
- dosya: `src/catalog.js`
- sembol: `MODULE_CATALOG / create*CatalogItem`

## Tanımlandığı yerler

- `src/items.js` `COMMERCIAL_ITEMS` :123 [write-or-literal]
- `src/items.js` `getTopLightItemForType` :271 [read]
- `src/items.js` `getFurnitureClusterQuantity` :377 [read]
- `src/items.js` `INDOOR_PLANT_ITEMS` :385 [read]
- `src/items.js` `INDOOR_PLANT_ITEMS` :395 [write-or-literal]
- `src/items.js` (dosya düzeyi) :829 [write-or-literal]
- `src/designState.js` `resolveSeparatorItemKey` :127 [write-or-literal]
- `src/designState.js` `resolveSeparatorItemKey` :134 [write]
- `src/designState.js` `if` :135 [read]
- `src/designState.js` `createSeparatorModuleState` :159 [write-or-literal]
- `src/designState.js` `createCommercialModuleState` :458 [write]
- `src/designState.js` `resolveIndoorPlantItemKey` :519 [read]
- `src/designState.js` `resolveIndoorPlantItemKey` :520 [write]
- `src/designState.js` `modelFile` :521 [read]
- `src/designState.js` `createIndoorPlantModuleState` :541 [read]
- `src/designState.js` `createIndoorPlantModuleState` :552 [write]
- `src/catalog.js` `createSeparatorCatalogItem` :118 [write]
- `src/catalog.js` `createIndoorPlantCatalogItem` :244 [write]
- `src/catalog.js` `MODULE_CATALOG` :260 [define]
- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/catalog.js` `normalizeCatalogDescriptor` :491 [write-or-literal]
- `src/catalog.js` `resolveItemKey` :500 [read]
- `src/catalog.js` `resolveItemKey` :503 [write]
- `src/catalog.js` `if` :519 [read]
- `src/catalog.js` `getModuleCatalogItem` :534 [read]
- `src/moduleContracts.js` (dosya düzeyi) :1 [read]
- `src/moduleContracts.js` `resolveModuleContract` :210 [read]
- `src/moduleContracts.js` `resolveModuleContract` :215 [write]

## Okuyan yerler

- `src/items.js` `getTopLightItemForType` :271 [read]
- `src/items.js` `getFurnitureClusterQuantity` :377 [read]
- `src/items.js` `INDOOR_PLANT_ITEMS` :385 [read]
- `src/designState.js` `if` :135 [read]
- `src/designState.js` `resolveIndoorPlantItemKey` :519 [read]
- `src/designState.js` `modelFile` :521 [read]
- `src/designState.js` `createIndoorPlantModuleState` :541 [read]
- `src/catalog.js` `resolveItemKey` :500 [read]
- `src/catalog.js` `if` :519 [read]
- `src/catalog.js` `getModuleCatalogItem` :534 [read]
- `src/moduleContracts.js` (dosya düzeyi) :1 [read]
- `src/moduleContracts.js` `resolveModuleContract` :210 [read]
- `src/scene3d.js` `loadMiniFridgeModel` :124 [read]
- `src/scene3d.js` `loadCoatRackModel` :128 [read]
- `src/scene3d.js` `loadKettleModel` :132 [read]
- `src/scene3d.js` `loadIndoorPlantModel` :135 [read]
- `src/scene3d.js` `if` :5219 [read]
- `src/autoDepot.js` (dosya düzeyi) :1 [read]
- `src/moduleContextMenu.js` (dosya düzeyi) :1 [read]
- `src/moduleContextMenu.js` `addModuleToSelection` :240 [read]
- `src/moduleDragSidebar.js` (dosya düzeyi) :1 [read]
- `src/moduleDragSidebar.js` `if` :224 [read]
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
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/eamesTableChairSetContract.test.js` (dosya düzeyi) :4 [test]
- `test/floorItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/floorItemsContract.test.js` `for` :35 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/glassTableContract.test.js` (dosya düzeyi) :4 [test]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :4 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :4 [test]
- `test/kettle.test.js` (dosya düzeyi) :4 [test]
- `test/lCounter100Contract.test.js` (dosya düzeyi) :4 [test]
- `test/lCounter150Contract.test.js` (dosya düzeyi) :4 [test]
- … test/e2e ek 35 eşleşme (src listesi tam).

## Yazan / değiştiren yerler

- `src/items.js` `COMMERCIAL_ITEMS` :123 [write-or-literal]
- `src/items.js` `INDOOR_PLANT_ITEMS` :395 [write-or-literal]
- `src/items.js` (dosya düzeyi) :829 [write-or-literal]
- `src/designState.js` `resolveSeparatorItemKey` :127 [write-or-literal]
- `src/designState.js` `resolveSeparatorItemKey` :134 [write]
- `src/designState.js` `createSeparatorModuleState` :159 [write-or-literal]
- `src/designState.js` `createCommercialModuleState` :458 [write]
- `src/designState.js` `resolveIndoorPlantItemKey` :520 [write]
- `src/designState.js` `createIndoorPlantModuleState` :552 [write]
- `src/catalog.js` `createSeparatorCatalogItem` :118 [write]
- `src/catalog.js` `createIndoorPlantCatalogItem` :244 [write]
- `src/catalog.js` `MODULE_CATALOG` :260 [define]
- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/catalog.js` `normalizeCatalogDescriptor` :491 [write-or-literal]
- `src/catalog.js` `resolveItemKey` :503 [write]
- `src/moduleContracts.js` `resolveModuleContract` :215 [write]
- `src/scene3d.js` `createIndoorPlantModule` :5065 [write]
- `src/scene3d.js` `if` :5125 [write]
- `src/scene3d.js` `if` :5216 [write-or-literal]
- `src/autoDepot.js` `AUTO_DEPOT_SIZES` :12 [write]
- `src/autoDepot.js` `if` :76 [write]
- `src/autoDepot.js` `if` :121 [write-or-literal]
- `src/moduleContextMenu.js` `renderSelectionQueue` :144 [write]
- `src/moduleContextMenu.js` `submitPickerSelection` :249 [write]
- `src/moduleContextMenu.js` `renderPickerCatalog` :318 [write]
- `src/moduleDragSidebar.js` `createModuleDragSidebar` :394 [write]
- `src/moduleDragSidebar.js` `resetDragState` :431 [write]

## Default değeri

Catalog default: `create*CatalogItem` Item alanından kopya. Profil `widthCm` `getStraightWallNominalWidthForProfileItem` ile remap. Kullanıcı ezemaz.

## Override zinciri

Item kaydı → create*CatalogItem eşlemesi → MODULE_CATALOG. Kullanıcı katalog alanını ezemaz.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **9** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `coat-rack`, `kettle`, `mini-fridge`, `plastic-trash-bin`, `indoor-plant-1`, `separator`
- itemKey: `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`, `wall_separator_50_sarmasik`, `wall_separator_100_sarmasik`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **9**
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

- src dosya sayısı (unique): **8**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/moduleContracts.js`, `src/scene3d.js`, `src/autoDepot.js`, `src/moduleContextMenu.js`, `src/moduleDragSidebar.js`

- `src/items.js` `COMMERCIAL_ITEMS` :123 [write-or-literal]
- `src/items.js` `getTopLightItemForType` :271 [read]
- `src/items.js` `getFurnitureClusterQuantity` :377 [read]
- `src/items.js` `INDOOR_PLANT_ITEMS` :385 [read]
- `src/items.js` `INDOOR_PLANT_ITEMS` :395 [write-or-literal]
- `src/items.js` (dosya düzeyi) :829 [write-or-literal]
- `src/designState.js` `resolveSeparatorItemKey` :127 [write-or-literal]
- `src/designState.js` `resolveSeparatorItemKey` :134 [write]
- `src/designState.js` `if` :135 [read]
- `src/designState.js` `createSeparatorModuleState` :159 [write-or-literal]
- `src/designState.js` `createCommercialModuleState` :458 [write]
- `src/designState.js` `resolveIndoorPlantItemKey` :519 [read]
- `src/designState.js` `resolveIndoorPlantItemKey` :520 [write]
- `src/designState.js` `modelFile` :521 [read]
- `src/designState.js` `createIndoorPlantModuleState` :541 [read]
- `src/designState.js` `createIndoorPlantModuleState` :552 [write]
- `src/catalog.js` `createSeparatorCatalogItem` :118 [write]
- `src/catalog.js` `createIndoorPlantCatalogItem` :244 [write]
- `src/catalog.js` `MODULE_CATALOG` :260 [define]
- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/catalog.js` `normalizeCatalogDescriptor` :491 [write-or-literal]
- `src/catalog.js` `resolveItemKey` :500 [read]
- `src/catalog.js` `resolveItemKey` :503 [write]
- `src/catalog.js` `if` :519 [read]
- `src/catalog.js` `getModuleCatalogItem` :534 [read]
- `src/moduleContracts.js` (dosya düzeyi) :1 [read]
- `src/moduleContracts.js` `resolveModuleContract` :210 [read]
- `src/moduleContracts.js` `resolveModuleContract` :215 [write]
- `src/scene3d.js` `loadMiniFridgeModel` :124 [read]
- `src/scene3d.js` `loadCoatRackModel` :128 [read]
- `src/scene3d.js` `loadKettleModel` :132 [read]
- `src/scene3d.js` `loadIndoorPlantModel` :135 [read]
- `src/scene3d.js` `createIndoorPlantModule` :5065 [write]
- `src/scene3d.js` `if` :5125 [write]
- `src/scene3d.js` `if` :5216 [write-or-literal]
- `src/scene3d.js` `if` :5219 [read]
- `src/autoDepot.js` (dosya düzeyi) :1 [read]
- `src/autoDepot.js` `AUTO_DEPOT_SIZES` :12 [write]
- `src/autoDepot.js` `if` :76 [write]
- `src/autoDepot.js` `if` :121 [write-or-literal]
- `src/moduleContextMenu.js` (dosya düzeyi) :1 [read]
- `src/moduleContextMenu.js` `renderSelectionQueue` :144 [write]
- `src/moduleContextMenu.js` `addModuleToSelection` :240 [read]
- `src/moduleContextMenu.js` `submitPickerSelection` :249 [write]
- `src/moduleContextMenu.js` `renderPickerCatalog` :318 [write]
- `src/moduleDragSidebar.js` (dosya düzeyi) :1 [read]
- `src/moduleDragSidebar.js` `if` :224 [read]
- `src/moduleDragSidebar.js` `createModuleDragSidebar` :394 [write]
- `src/moduleDragSidebar.js` `resetDragState` :431 [write]
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
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/eamesTableChairSetContract.test.js` (dosya düzeyi) :4 [test]
- `test/floorItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/floorItemsContract.test.js` `for` :35 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/glassTableContract.test.js` (dosya düzeyi) :4 [test]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :4 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :4 [test]
- `test/kettle.test.js` (dosya düzeyi) :4 [test]
- `test/lCounter100Contract.test.js` (dosya düzeyi) :4 [test]
- `test/lCounter150Contract.test.js` (dosya düzeyi) :4 [test]
- … test/e2e ek 35 eşleşme (src listesi tam).

- indeks: 55 / 188
