# `catalog.panelScreenHeightCm`

**Özellik ID:** `catalog.panelScreenHeightCm`
**İnsan tarafından anlaşılır adı:** Katalog descriptor: panelScreenHeightCm
**Kategori:** katalog
**Veri tipi:** number
**Birim:** cm
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `61`

## Ne işe yarar

Katalog descriptor alanı. Kaynak Item + `create*CatalogItem` eşlemesi (profilde width remap). Sidebar/drag bu nesneyi taşır.

## Canonical owner

- katman: katalog descriptor (Item türevi)
- dosya: `src/catalog.js`
- sembol: `MODULE_CATALOG / create*CatalogItem`

## Tanımlandığı yerler

- `src/items.js` `getTopLightItemForType` :271 [read]
- `src/items.js` `WALL_MEDIA_ITEMS` :444 [define]
- `src/items.js` `if` :463 [write]
- `src/items.js` `if` :475 [read]
- `src/items.js` `if` :489 [write-or-literal]
- `src/designState.js` `createTvModuleState` :615 [write-or-literal]
- `src/catalog.js` `if` :190 [write-or-literal]
- `src/catalog.js` `MODULE_CATALOG` :260 [define]
- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/catalog.js` `resolveItemKey` :500 [read]
- `src/catalog.js` `resolveItemKey` :503 [write]
- `src/catalog.js` `getModuleCatalogItem` :534 [read]
- `src/moduleContracts.js` (dosya düzeyi) :1 [read]
- `src/moduleContracts.js` `resolveModuleContract` :210 [read]
- `src/moduleContracts.js` `resolveModuleContract` :215 [write]

## Okuyan yerler

- `src/items.js` `getTopLightItemForType` :271 [read]
- `src/items.js` `if` :475 [read]
- `src/catalog.js` `resolveItemKey` :500 [read]
- `src/catalog.js` `getModuleCatalogItem` :534 [read]
- `src/moduleContracts.js` (dosya düzeyi) :1 [read]
- `src/moduleContracts.js` `resolveModuleContract` :210 [read]
- `src/autoDepot.js` (dosya düzeyi) :1 [read]
- `src/moduleContextMenu.js` (dosya düzeyi) :1 [read]
- `src/moduleContextMenu.js` `addModuleToSelection` :240 [read]
- `src/moduleDragSidebar.js` (dosya düzeyi) :1 [read]
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
- … test/e2e ek 30 eşleşme (src listesi tam).

## Yazan / değiştiren yerler

- `src/items.js` `WALL_MEDIA_ITEMS` :444 [define]
- `src/items.js` `if` :463 [write]
- `src/items.js` `if` :489 [write-or-literal]
- `src/designState.js` `createTvModuleState` :615 [write-or-literal]
- `src/catalog.js` `if` :190 [write-or-literal]
- `src/catalog.js` `MODULE_CATALOG` :260 [define]
- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/catalog.js` `resolveItemKey` :503 [write]
- `src/moduleContracts.js` `resolveModuleContract` :215 [write]
- `src/scene3d.js` `createTvModule` :4832 [write]
- `src/autoDepot.js` `AUTO_DEPOT_SIZES` :12 [write]
- `src/autoDepot.js` `if` :76 [write]
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

- dolu TSV satırı: **2** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `tv`
- itemKey: `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **2**
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

- `src/items.js` `getTopLightItemForType` :271 [read]
- `src/items.js` `WALL_MEDIA_ITEMS` :444 [define]
- `src/items.js` `if` :463 [write]
- `src/items.js` `if` :475 [read]
- `src/items.js` `if` :489 [write-or-literal]
- `src/designState.js` `createTvModuleState` :615 [write-or-literal]
- `src/catalog.js` `if` :190 [write-or-literal]
- `src/catalog.js` `MODULE_CATALOG` :260 [define]
- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/catalog.js` `resolveItemKey` :500 [read]
- `src/catalog.js` `resolveItemKey` :503 [write]
- `src/catalog.js` `getModuleCatalogItem` :534 [read]
- `src/moduleContracts.js` (dosya düzeyi) :1 [read]
- `src/moduleContracts.js` `resolveModuleContract` :210 [read]
- `src/moduleContracts.js` `resolveModuleContract` :215 [write]
- `src/scene3d.js` `createTvModule` :4832 [write]
- `src/autoDepot.js` (dosya düzeyi) :1 [read]
- `src/autoDepot.js` `AUTO_DEPOT_SIZES` :12 [write]
- `src/autoDepot.js` `if` :76 [write]
- `src/moduleContextMenu.js` (dosya düzeyi) :1 [read]
- `src/moduleContextMenu.js` `renderSelectionQueue` :144 [write]
- `src/moduleContextMenu.js` `addModuleToSelection` :240 [read]
- `src/moduleContextMenu.js` `submitPickerSelection` :249 [write]
- `src/moduleContextMenu.js` `renderPickerCatalog` :318 [write]
- `src/moduleDragSidebar.js` (dosya düzeyi) :1 [read]
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
- … test/e2e ek 30 eşleşme (src listesi tam).

- indeks: 57 / 188
