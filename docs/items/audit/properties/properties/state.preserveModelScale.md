# `state.preserveModelScale`

**Özellik ID:** `state.preserveModelScale`
**İnsan tarafından anlaşılır adı:** Runtime module state: preserveModelScale
**Kategori:** runtime-state
**Veri tipi:** boolean
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `false` · `true`

## Ne işe yarar

create*ModuleState çıktısı. Persist: modules[] blob.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/items.js` `COMMERCIAL_ITEMS` :138 [write-or-literal]
- `src/items.js` `INDOOR_PLANT_ITEMS` :388 [write-or-literal]
- `src/designState.js` `createCommercialModuleState` :457 [read]
- `src/designState.js` `createCommercialModuleState` :461 [write]
- `src/designState.js` `createIndoorPlantModuleState` :563 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :242 [write-or-literal]

## Okuyan yerler

- `src/designState.js` `createCommercialModuleState` :457 [read]
- `src/scene3d.js` `if` :5197 [read]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :66 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :29 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :17 [test]
- `test/plasticTrashBinModule.test.js` `overlaps` :51 [test]

## Yazan / değiştiren yerler

- `src/items.js` `COMMERCIAL_ITEMS` :138 [write-or-literal]
- `src/items.js` `INDOOR_PLANT_ITEMS` :388 [write-or-literal]
- `src/designState.js` `createCommercialModuleState` :461 [write]
- `src/designState.js` `createIndoorPlantModuleState` :563 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :242 [write-or-literal]
- `src/autoDepot.js` `if` :122 [write-or-literal]

## Default değeri

Factory default: ilgili `create*ModuleState` Item/catalog ölçü veya media türevini kopyalar. Global state default yok.

## Override zinciri

Item/catalog ölçü → factory kopya → (nadiren) kullanıcı foam resize width/height → persist. normalizeModuleItemState tv/base/counter/flat-panel itemKey ve bazı ölçüleri yeniden yazar.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **5** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `plastic-trash-bin`, `indoor-plant-1`
- itemKey: `PLASTIC_TRASH_BIN`, `EXTRA_INDOOR_PLANT_1`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **5**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Evet — `modules[]` nesnesinin parçası. `saveProject` şemasız put. Load `cloneProjectState`.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

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

- src dosya sayısı (unique): **5**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/scene3d.js`, `src/autoDepot.js`

- `src/items.js` `COMMERCIAL_ITEMS` :138 [write-or-literal]
- `src/items.js` `INDOOR_PLANT_ITEMS` :388 [write-or-literal]
- `src/designState.js` `createCommercialModuleState` :457 [read]
- `src/designState.js` `createCommercialModuleState` :461 [write]
- `src/designState.js` `createIndoorPlantModuleState` :563 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :242 [write-or-literal]
- `src/scene3d.js` `if` :5197 [read]
- `src/autoDepot.js` `if` :122 [write-or-literal]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :66 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :29 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :17 [test]
- `test/plasticTrashBinModule.test.js` `overlaps` :51 [test]

- indeks: 130 / 188
