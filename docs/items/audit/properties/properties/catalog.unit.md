# `catalog.unit`

**Özellik ID:** `catalog.unit`
**İnsan tarafından anlaşılır adı:** Katalog descriptor: unit
**Kategori:** katalog
**Veri tipi:** string
**Birim:** BOM unit etiketi (kodda `adet`)
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `adet`

## Ne işe yarar

Katalog descriptor alanı. Kaynak Item + `create*CatalogItem` eşlemesi (profilde width remap). Sidebar/drag bu nesneyi taşır.

## Canonical owner

- katman: katalog descriptor (Item türevi)
- dosya: `src/catalog.js`
- sembol: `MODULE_CATALOG / create*CatalogItem`

## Tanımlandığı yerler

- `src/items.js` `LEAF_ITEMS` :3 [define]
- `src/items.js` `if` :114 [define]
- `src/items.js` `COMMERCIAL_ITEMS` :121 [write-or-literal]
- `src/items.js` `getCommercialItemForType` :148 [read]
- `src/items.js` `getFurnitureItemForType` :252 [read]
- `src/items.js` `getTopLightItemForType` :271 [read]
- `src/items.js` `COMPOSITE_ITEMS` :498 [write-or-literal]
- `src/items.js` (dosya düzeyi) :933 [write-or-literal]
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

- `src/items.js` `getCommercialItemForType` :148 [read]
- `src/items.js` `getFurnitureItemForType` :252 [read]
- `src/items.js` `getTopLightItemForType` :271 [read]
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
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :37 [test]
- `test/baseTopsItemContract.test.js` `for` :73 [test]
- `test/baseWallCatalog.test.js` (dosya düzeyi) :3 [test]
- `test/baseWallCatalog.test.js` `for` :9 [test]
- `test/baseWallRecipes.test.js` (dosya düzeyi) :4 [test]
- `test/baseWallRecipes.test.js` `for` :34 [test]
- `test/catalogSingleSource.test.js` (dosya düzeyi) :7 [test]
- `test/chairEamesContract.test.js` (dosya düzeyi) :4 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :4 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :5 [test]
- `test/connectorBom.test.js` (dosya düzeyi) :14 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :64 [test]
- `test/cornerPanelsItemContract.test.js` `for` :111 [test]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :31 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :16 [test]
- `test/eamesTableChairSetContract.test.js` (dosya düzeyi) :4 [test]
- `test/floorItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/floorItemsContract.test.js` `for` :34 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :3 [test]
- … test/e2e ek 63 eşleşme (src listesi tam).

## Yazan / değiştiren yerler

- `src/items.js` `LEAF_ITEMS` :3 [define]
- `src/items.js` `if` :114 [define]
- `src/items.js` `COMMERCIAL_ITEMS` :121 [write-or-literal]
- `src/items.js` `COMPOSITE_ITEMS` :498 [write-or-literal]
- `src/items.js` (dosya düzeyi) :933 [write-or-literal]
- `src/catalog.js` `MODULE_CATALOG` :260 [define]
- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/catalog.js` `resolveItemKey` :503 [write]
- `src/moduleContracts.js` `resolveModuleContract` :215 [write]
- `src/itemBom.js` `if` :39 [write-or-literal]
- `src/itemBom.js` `for` :66 [write]
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

- dolu TSV satırı: **4** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `coat-rack`, `kettle`, `mini-fridge`, `plastic-trash-bin`
- itemKey: `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **4**
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

- src dosya sayısı (unique): **7**
- src dosyaları: `src/items.js`, `src/catalog.js`, `src/moduleContracts.js`, `src/itemBom.js`, `src/autoDepot.js`, `src/moduleContextMenu.js`, `src/moduleDragSidebar.js`

- `src/items.js` `LEAF_ITEMS` :3 [define]
- `src/items.js` `if` :114 [define]
- `src/items.js` `COMMERCIAL_ITEMS` :121 [write-or-literal]
- `src/items.js` `getCommercialItemForType` :148 [read]
- `src/items.js` `getFurnitureItemForType` :252 [read]
- `src/items.js` `getTopLightItemForType` :271 [read]
- `src/items.js` `COMPOSITE_ITEMS` :498 [write-or-literal]
- `src/items.js` (dosya düzeyi) :933 [write-or-literal]
- `src/catalog.js` `MODULE_CATALOG` :260 [define]
- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/catalog.js` `resolveItemKey` :500 [read]
- `src/catalog.js` `resolveItemKey` :503 [write]
- `src/catalog.js` `getModuleCatalogItem` :534 [read]
- `src/moduleContracts.js` (dosya düzeyi) :1 [read]
- `src/moduleContracts.js` `resolveModuleContract` :210 [read]
- `src/moduleContracts.js` `resolveModuleContract` :215 [write]
- `src/itemBom.js` `if` :39 [write-or-literal]
- `src/itemBom.js` `for` :66 [write]
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
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :37 [test]
- `test/baseTopsItemContract.test.js` `for` :73 [test]
- `test/baseWallCatalog.test.js` (dosya düzeyi) :3 [test]
- `test/baseWallCatalog.test.js` `for` :9 [test]
- `test/baseWallRecipes.test.js` (dosya düzeyi) :4 [test]
- `test/baseWallRecipes.test.js` `for` :34 [test]
- `test/catalogSingleSource.test.js` (dosya düzeyi) :7 [test]
- `test/chairEamesContract.test.js` (dosya düzeyi) :4 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :4 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :5 [test]
- `test/connectorBom.test.js` (dosya düzeyi) :14 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :64 [test]
- `test/cornerPanelsItemContract.test.js` `for` :111 [test]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :31 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :16 [test]
- `test/eamesTableChairSetContract.test.js` (dosya düzeyi) :4 [test]
- `test/floorItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/floorItemsContract.test.js` `for` :34 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :3 [test]
- … test/e2e ek 63 eşleşme (src listesi tam).

- indeks: 68 / 188
