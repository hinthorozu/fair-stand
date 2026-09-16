# `state.chairCount`

**Özellik ID:** `state.chairCount`
**İnsan tarafından anlaşılır adı:** Eames takımı sandalye adedi (state kopyası)
**Kategori:** runtime-state
**Veri tipi:** number
**Birim:** adet
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `4`

## Ne işe yarar

create*ModuleState çıktısı. Persist: modules[] blob.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/designState.js` `if` :414 [write]
- `src/catalog.js` `furniture_table_chair_set_eames_DIMENSIONS` :152 [write-or-literal]

## Okuyan yerler

- `test/chairEamesContract.test.js` (dosya düzeyi) :28 [test]
- `test/eamesTableChairSetContract.test.js` (dosya düzeyi) :19 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :27 [test]
- `test/furnitureItemsContract.test.js` `if` :180 [test]
- `e2e/furniture-items-contract.spec.mjs` `saveAndReadProject` :70 [test]
- `e2e/furniture-items-contract.spec.mjs` `if` :119 [test]

## Yazan / değiştiren yerler

- `src/designState.js` `if` :414 [write]
- `src/catalog.js` `furniture_table_chair_set_eames_DIMENSIONS` :152 [write-or-literal]

## Default değeri

Factory default: ilgili `create*ModuleState` Item/catalog ölçü veya media türevini kopyalar. Global state default yok.

## Override zinciri

Item/catalog ölçü → factory kopya → (nadiren) kullanıcı foam resize width/height → persist. normalizeModuleItemState tv/base/counter/flat-panel itemKey ve bazı ölçüleri yeniden yazar.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **1** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `table-chair-set-eames`
- itemKey: `furniture_table_chair_set_eames`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **1**
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

- src dosya sayısı (unique): **2**
- src dosyaları: `src/designState.js`, `src/catalog.js`

- `src/designState.js` `if` :414 [write]
- `src/catalog.js` `furniture_table_chair_set_eames_DIMENSIONS` :152 [write-or-literal]
- `test/chairEamesContract.test.js` (dosya düzeyi) :28 [test]
- `test/eamesTableChairSetContract.test.js` (dosya düzeyi) :19 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :27 [test]
- `test/furnitureItemsContract.test.js` `if` :180 [test]
- `e2e/furniture-items-contract.spec.mjs` `saveAndReadProject` :70 [test]
- `e2e/furniture-items-contract.spec.mjs` `if` :119 [test]

- indeks: 118 / 188
