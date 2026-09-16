# `catalog.shape`

**Özellik ID:** `catalog.shape`
**İnsan tarafından anlaşılır adı:** Katalog descriptor: shape
**Kategori:** katalog
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** `L` (düz banko catalog satırında shape yok)

## Ne işe yarar

Katalog descriptor alanı. Kaynak Item + `create*CatalogItem` eşlemesi (profilde width remap). Sidebar/drag bu nesneyi taşır.

## Canonical owner

- katman: katalog descriptor (Item türevi)
- dosya: `src/catalog.js`
- sembol: `MODULE_CATALOG / create*CatalogItem`

## Tanımlandığı yerler

- `src/items.js` `getTopLightItemForType` :271 [read]
- `src/items.js` (dosya düzeyi) :581 [write-or-literal]
- `src/items.js` (dosya düzeyi) :587 [define]
- `src/designState.js` `resolveCounterItemKey` :278 [read]
- `src/designState.js` `resolveCounterItemKey` :279 [write-or-literal]
- `src/designState.js` `createCounterModuleState` :292 [read]
- `src/designState.js` `if` :302 [read]
- `src/catalog.js` `createCounterCatalogItem` :53 [read]
- `src/catalog.js` `MODULE_CATALOG` :260 [define]
- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/catalog.js` `optionalNumber` :470 [read]
- `src/catalog.js` `shapesMatch` :471 [read]
- `src/catalog.js` `normalizeCatalogDescriptor` :489 [write-or-literal]
- `src/catalog.js` `resolveItemKey` :500 [read]
- `src/catalog.js` `resolveItemKey` :503 [write]
- `src/catalog.js` `if` :516 [read]
- `src/catalog.js` `getModuleCatalogItem` :534 [read]
- `src/moduleBehavior.js` `if` :230 [read]
- `src/moduleContracts.js` (dosya düzeyi) :1 [read]
- `src/moduleContracts.js` `resolveModuleContract` :210 [read]
- `src/moduleContracts.js` `resolveModuleContract` :215 [write]

## Okuyan yerler

- `src/items.js` `getTopLightItemForType` :271 [read]
- `src/designState.js` `resolveCounterItemKey` :278 [read]
- `src/designState.js` `createCounterModuleState` :292 [read]
- `src/designState.js` `if` :302 [read]
- `src/catalog.js` `createCounterCatalogItem` :53 [read]
- `src/catalog.js` `optionalNumber` :470 [read]
- `src/catalog.js` `shapesMatch` :471 [read]
- `src/catalog.js` `resolveItemKey` :500 [read]
- `src/catalog.js` `if` :516 [read]
- `src/catalog.js` `getModuleCatalogItem` :534 [read]
- `src/moduleBehavior.js` `if` :230 [read]
- `src/moduleContracts.js` (dosya düzeyi) :1 [read]
- `src/moduleContracts.js` `resolveModuleContract` :210 [read]
- `src/moduleRecipes.js` `getModuleRecipe` :197 [read]
- `src/scene3d.js` `if` :1893 [read]
- `src/scene3d.js` `roundedRectShape` :5505 [read]
- `src/scene3d.js` `createCounterModule` :6602 [read]
- `src/autoDepot.js` (dosya düzeyi) :1 [read]
- `src/moduleContextMenu.js` (dosya düzeyi) :1 [read]
- `src/moduleContextMenu.js` `addModuleToSelection` :240 [read]
- `src/moduleDragSidebar.js` (dosya düzeyi) :1 [read]
- `src/modulePlacement.js` `isLCounterModule` :241 [read]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :590 [read]
- `src/modulePlacement.js` `addCandidate` :898 [read]
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
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :17 [test]
- `test/counterTopsItemContract.test.js` `for` :56 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/deskBankoItemsContract.test.js` `if` :88 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/eamesTableChairSetContract.test.js` (dosya düzeyi) :4 [test]
- `test/floorItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/floorItemsContract.test.js` `for` :35 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/glassTableContract.test.js` (dosya düzeyi) :4 [test]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :4 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :4 [test]
- … test/e2e ek 48 eşleşme (src listesi tam).

## Yazan / değiştiren yerler

- `src/items.js` (dosya düzeyi) :581 [write-or-literal]
- `src/items.js` (dosya düzeyi) :587 [define]
- `src/designState.js` `resolveCounterItemKey` :279 [write-or-literal]
- `src/catalog.js` `MODULE_CATALOG` :260 [define]
- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/catalog.js` `normalizeCatalogDescriptor` :489 [write-or-literal]
- `src/catalog.js` `resolveItemKey` :503 [write]
- `src/moduleContracts.js` `resolveModuleContract` :215 [write]
- `src/moduleRecipes.js` (dosya düzeyi) :142 [write-or-literal]
- `src/scene3d.js` `pickModuleContext` :1810 [write-or-literal]
- `src/scene3d.js` `rotateSelectedModule` :2267 [write-or-literal]
- `src/scene3d.js` `getFreeTvPlacement` :2300 [write-or-literal]
- `src/scene3d.js` `if` :2459 [write-or-literal]
- `src/scene3d.js` `if` :4752 [write]
- `src/scene3d.js` `roundedRectShape` :5501 [write]
- `src/scene3d.js` `for` :7529 [write-or-literal]
- `src/main.js` `for` :681 [write-or-literal]
- `src/autoDepot.js` `AUTO_DEPOT_SIZES` :12 [write]
- `src/autoDepot.js` `if` :76 [write]
- `src/moduleContextMenu.js` `renderSelectionQueue` :144 [write]
- `src/moduleContextMenu.js` `submitPickerSelection` :249 [write]
- `src/moduleContextMenu.js` `renderPickerCatalog` :318 [write]
- `src/moduleDragSidebar.js` `createModuleDragSidebar` :394 [write]
- `src/moduleDragSidebar.js` `resetDragState` :431 [write]
- `src/moduleMove.js` `if` :186 [write-or-literal]
- `src/modulePlacement.js` `createLocalSegment` :295 [write]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :565 [write]
- `src/modulePlacement.js` `snapPlacementToModules` :810 [write]
- `src/modulePlacement.js` `if` :1582 [write-or-literal]
- `src/rawBomDebug.js` `parseLCounterSelection` :22 [write-or-literal]

## Default değeri

Catalog default: `create*CatalogItem` Item alanından kopya. Profil `widthCm` `getStraightWallNominalWidthForProfileItem` ile remap. Kullanıcı ezemaz.

## Override zinciri

Item kaydı → create*CatalogItem eşlemesi → MODULE_CATALOG. Kullanıcı katalog alanını ezemaz.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **3** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `counter`
- itemKey: `desk_banko_100_L`, `desk_banko_150_L`, `desk_banko_200_L`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **3**
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

- src dosya sayısı (unique): **14**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/moduleBehavior.js`, `src/moduleContracts.js`, `src/moduleRecipes.js`, `src/scene3d.js`, `src/main.js`, `src/autoDepot.js`, `src/moduleContextMenu.js`, `src/moduleDragSidebar.js`, `src/moduleMove.js`, `src/modulePlacement.js`, `src/rawBomDebug.js`

- `src/items.js` `getTopLightItemForType` :271 [read]
- `src/items.js` (dosya düzeyi) :581 [write-or-literal]
- `src/items.js` (dosya düzeyi) :587 [define]
- `src/designState.js` `resolveCounterItemKey` :278 [read]
- `src/designState.js` `resolveCounterItemKey` :279 [write-or-literal]
- `src/designState.js` `createCounterModuleState` :292 [read]
- `src/designState.js` `if` :302 [read]
- `src/catalog.js` `createCounterCatalogItem` :53 [read]
- `src/catalog.js` `MODULE_CATALOG` :260 [define]
- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/catalog.js` `optionalNumber` :470 [read]
- `src/catalog.js` `shapesMatch` :471 [read]
- `src/catalog.js` `normalizeCatalogDescriptor` :489 [write-or-literal]
- `src/catalog.js` `resolveItemKey` :500 [read]
- `src/catalog.js` `resolveItemKey` :503 [write]
- `src/catalog.js` `if` :516 [read]
- `src/catalog.js` `getModuleCatalogItem` :534 [read]
- `src/moduleBehavior.js` `if` :230 [read]
- `src/moduleContracts.js` (dosya düzeyi) :1 [read]
- `src/moduleContracts.js` `resolveModuleContract` :210 [read]
- `src/moduleContracts.js` `resolveModuleContract` :215 [write]
- `src/moduleRecipes.js` (dosya düzeyi) :142 [write-or-literal]
- `src/moduleRecipes.js` `getModuleRecipe` :197 [read]
- `src/scene3d.js` `pickModuleContext` :1810 [write-or-literal]
- `src/scene3d.js` `if` :1893 [read]
- `src/scene3d.js` `rotateSelectedModule` :2267 [write-or-literal]
- `src/scene3d.js` `getFreeTvPlacement` :2300 [write-or-literal]
- `src/scene3d.js` `if` :2459 [write-or-literal]
- `src/scene3d.js` `if` :4752 [write]
- `src/scene3d.js` `roundedRectShape` :5501 [write]
- `src/scene3d.js` `roundedRectShape` :5505 [read]
- `src/scene3d.js` `createCounterModule` :6602 [read]
- `src/scene3d.js` `for` :7529 [write-or-literal]
- `src/main.js` `for` :681 [write-or-literal]
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
- `src/moduleMove.js` `if` :186 [write-or-literal]
- `src/modulePlacement.js` `isLCounterModule` :241 [read]
- `src/modulePlacement.js` `createLocalSegment` :295 [write]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :565 [write]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :590 [read]
- `src/modulePlacement.js` `snapPlacementToModules` :810 [write]
- `src/modulePlacement.js` `addCandidate` :898 [read]
- `src/modulePlacement.js` `if` :1582 [write-or-literal]
- `src/rawBomDebug.js` `parseLCounterSelection` :22 [write-or-literal]
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
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :17 [test]
- `test/counterTopsItemContract.test.js` `for` :56 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/deskBankoItemsContract.test.js` `if` :88 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/eamesTableChairSetContract.test.js` (dosya düzeyi) :4 [test]
- `test/floorItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/floorItemsContract.test.js` `for` :35 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/glassTableContract.test.js` (dosya düzeyi) :4 [test]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :4 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :4 [test]
- … test/e2e ek 48 eşleşme (src listesi tam).

- indeks: 62 / 188
