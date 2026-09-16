# `state.modelFile`

**Özellik ID:** `state.modelFile`
**İnsan tarafından anlaşılır adı:** Runtime module state: modelFile
**Kategori:** runtime-state
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `plastic_trash_bin.glb` · `indoor_plants.glb` · `saksi_bitkili_100x30x30.glb` · `saksi_bitkili_150x30x30.glb` · `saksi_bitkili_200x30x30.glb` · `null` · `wall_separator_50_sarmasik.glb` · `wall_separator_100_sarmasik.glb`

## Ne işe yarar

create*ModuleState çıktısı. Persist: modules[] blob.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/items.js` `COMMERCIAL_ITEMS` :123 [write-or-literal]
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
- `src/catalog.js` `normalizeCatalogDescriptor` :491 [write-or-literal]
- `src/catalog.js` `if` :519 [read]

## Okuyan yerler

- `src/items.js` `getFurnitureClusterQuantity` :377 [read]
- `src/items.js` `INDOOR_PLANT_ITEMS` :385 [read]
- `src/designState.js` `if` :135 [read]
- `src/designState.js` `resolveIndoorPlantItemKey` :519 [read]
- `src/designState.js` `modelFile` :521 [read]
- `src/designState.js` `createIndoorPlantModuleState` :541 [read]
- `src/catalog.js` `if` :519 [read]
- `src/scene3d.js` `loadMiniFridgeModel` :124 [read]
- `src/scene3d.js` `loadCoatRackModel` :128 [read]
- `src/scene3d.js` `loadKettleModel` :132 [read]
- `src/scene3d.js` `loadIndoorPlantModel` :135 [read]
- `src/scene3d.js` `if` :5219 [read]
- `src/moduleDragSidebar.js` `if` :224 [read]
- `test/catalogSingleSource.test.js` (dosya düzeyi) :29 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :12 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :16 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :156 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :26 [test]
- `test/moduleStateConstructionRegistry.test.js` `for` :60 [test]
- `test/plasticTrashBinModule.test.js` `overlaps` :50 [test]
- `test/plasticTrashBinModule.test.js` (dosya düzeyi) :138 [test]
- `test/wallSeparatorItemsContract.test.js` (dosya düzeyi) :25 [test]
- `test/wallSeparatorItemsContract.test.js` `if` :101 [test]
- `test/wallSeparatorItemsContract.test.js` `for` :141 [test]
- `e2e/indoor-plant-items-contract.spec.mjs` `saveAndReadProject` :41 [test]
- `e2e/plastic-trash-bin-module.spec.mjs` `if` :119 [test]
- `e2e/wall-separator-items-contract.spec.mjs` `for` :51 [test]

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
- `src/catalog.js` `normalizeCatalogDescriptor` :491 [write-or-literal]
- `src/scene3d.js` `createIndoorPlantModule` :5065 [write]
- `src/scene3d.js` `if` :5125 [write]
- `src/scene3d.js` `if` :5216 [write-or-literal]
- `src/autoDepot.js` `if` :121 [write-or-literal]

## Default değeri

Factory default: ilgili `create*ModuleState` Item/catalog ölçü veya media türevini kopyalar. Global state default yok.

## Override zinciri

Item/catalog ölçü → factory kopya → (nadiren) kullanıcı foam resize width/height → persist. normalizeModuleItemState tv/base/counter/flat-panel itemKey ve bazı ölçüleri yeniden yazar.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **9** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `plastic-trash-bin`, `indoor-plant-1`, `separator`
- itemKey: `PLASTIC_TRASH_BIN`, `EXTRA_INDOOR_PLANT_1`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`, `wall_separator_50`, `wall_separator_100`, `wall_separator_50_sarmasik`, `wall_separator_100_sarmasik`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **9**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Evet — `modules[]` nesnesinin parçası. `saveProject` şemasız put. Load `cloneProjectState`.

## Renderer etkisi

GLB yükleme yolu.

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

- src dosya sayısı (unique): **6**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/scene3d.js`, `src/autoDepot.js`, `src/moduleDragSidebar.js`

- `src/items.js` `COMMERCIAL_ITEMS` :123 [write-or-literal]
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
- `src/catalog.js` `normalizeCatalogDescriptor` :491 [write-or-literal]
- `src/catalog.js` `if` :519 [read]
- `src/scene3d.js` `loadMiniFridgeModel` :124 [read]
- `src/scene3d.js` `loadCoatRackModel` :128 [read]
- `src/scene3d.js` `loadKettleModel` :132 [read]
- `src/scene3d.js` `loadIndoorPlantModel` :135 [read]
- `src/scene3d.js` `createIndoorPlantModule` :5065 [write]
- `src/scene3d.js` `if` :5125 [write]
- `src/scene3d.js` `if` :5216 [write-or-literal]
- `src/scene3d.js` `if` :5219 [read]
- `src/autoDepot.js` `if` :121 [write-or-literal]
- `src/moduleDragSidebar.js` `if` :224 [read]
- `test/catalogSingleSource.test.js` (dosya düzeyi) :29 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :12 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :16 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :156 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :26 [test]
- `test/moduleStateConstructionRegistry.test.js` `for` :60 [test]
- `test/plasticTrashBinModule.test.js` `overlaps` :50 [test]
- `test/plasticTrashBinModule.test.js` (dosya düzeyi) :138 [test]
- `test/wallSeparatorItemsContract.test.js` (dosya düzeyi) :25 [test]
- `test/wallSeparatorItemsContract.test.js` `if` :101 [test]
- `test/wallSeparatorItemsContract.test.js` `for` :141 [test]
- `e2e/indoor-plant-items-contract.spec.mjs` `saveAndReadProject` :41 [test]
- `e2e/plastic-trash-bin-module.spec.mjs` `if` :119 [test]
- `e2e/wall-separator-items-contract.spec.mjs` `for` :51 [test]

- indeks: 126 / 188
