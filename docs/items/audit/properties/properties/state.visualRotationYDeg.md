# `state.visualRotationYDeg`

**Özellik ID:** `state.visualRotationYDeg`
**İnsan tarafından anlaşılır adı:** Runtime module state: visualRotationYDeg
**Kategori:** runtime-state
**Veri tipi:** number (derece)
**Birim:** derece
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `-90` · `-135` · `-45`

## Ne işe yarar

create*ModuleState çıktısı. Persist: modules[] blob.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/items.js` `COMMERCIAL_ITEMS` :139 [write-or-literal]
- `src/items.js` `FURNITURE_ITEMS` :176 [write-or-literal]
- `src/designState.js` `if` :411 [read]
- `src/designState.js` `if` :412 [write]
- `src/designState.js` `createCommercialModuleState` :460 [write]

## Okuyan yerler

- `src/designState.js` `if` :411 [read]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :65 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :53 [test]
- `test/furnitureItemsContract.test.js` `if` :181 [test]
- `test/plasticTrashBinTopLabel.test.js` (dosya düzeyi) :17 [test]
- `test/sofaClassicPiecesContract.test.js` (dosya düzeyi) :30 [test]

## Yazan / değiştiren yerler

- `src/items.js` `COMMERCIAL_ITEMS` :139 [write-or-literal]
- `src/items.js` `FURNITURE_ITEMS` :176 [write-or-literal]
- `src/designState.js` `if` :412 [write]
- `src/designState.js` `createCommercialModuleState` :460 [write]
- `src/scene3d.js` `if` :5080 [write]
- `src/scene3d.js` `createSofaPieceClassicModule` :6379 [write-or-literal]

## Default değeri

Factory default: ilgili `create*ModuleState` Item/catalog ölçü veya media türevini kopyalar. Global state default yok.

## Override zinciri

Item/catalog ölçü → factory kopya → (nadiren) kullanıcı foam resize width/height → persist. normalizeModuleItemState tv/base/counter/flat-panel itemKey ve bazı ölçüleri yeniden yazar.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **3** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `plastic-trash-bin`, `sofa-single-classic`, `sofa-double-classic`
- itemKey: `PLASTIC_TRASH_BIN`, `furniture_sofa_single_classic`, `furniture_sofa_double_classic`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **3**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Evet — `modules[]` nesnesinin parçası. `saveProject` şemasız put. Load `cloneProjectState`.

## Renderer etkisi

Model Y rotasyonu (çöp kutusu, koltuk).

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

- src dosya sayısı (unique): **3**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/scene3d.js`

- `src/items.js` `COMMERCIAL_ITEMS` :139 [write-or-literal]
- `src/items.js` `FURNITURE_ITEMS` :176 [write-or-literal]
- `src/designState.js` `if` :411 [read]
- `src/designState.js` `if` :412 [write]
- `src/designState.js` `createCommercialModuleState` :460 [write]
- `src/scene3d.js` `if` :5080 [write]
- `src/scene3d.js` `createSofaPieceClassicModule` :6379 [write-or-literal]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :65 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :53 [test]
- `test/furnitureItemsContract.test.js` `if` :181 [test]
- `test/plasticTrashBinTopLabel.test.js` (dosya düzeyi) :17 [test]
- `test/sofaClassicPiecesContract.test.js` (dosya düzeyi) :30 [test]

- indeks: 145 / 188
