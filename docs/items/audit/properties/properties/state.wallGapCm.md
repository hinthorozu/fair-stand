# `state.wallGapCm`

**Özellik ID:** `state.wallGapCm`
**İnsan tarafından anlaşılır adı:** Runtime module state: wallGapCm
**Kategori:** runtime-state
**Veri tipi:** number
**Birim:** cm
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `1.5`

## Ne işe yarar

create*ModuleState çıktısı. Persist: modules[] blob.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/items.js` `NON_CATALOG_ITEMS` :281 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :585 [write-or-literal]

## Okuyan yerler

- `test/illuminatedFoamModule.test.js` (dosya düzeyi) :17 [test]
- `test/lightingItemsContract.test.js` (dosya düzeyi) :81 [test]
- `e2e/f028-reset-features.spec.mjs` `seedIlluminatedFoam` :46 [test]

## Yazan / değiştiren yerler

- `src/items.js` `NON_CATALOG_ITEMS` :281 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :585 [write-or-literal]
- `src/scene3d.js` `createIlluminatedFoamModule` :4708 [write]

## Default değeri

Factory default: ilgili `create*ModuleState` Item/catalog ölçü veya media türevini kopyalar. Global state default yok.

## Override zinciri

Item/catalog ölçü → factory kopya → (nadiren) kullanıcı foam resize width/height → persist. normalizeModuleItemState tv/base/counter/flat-panel itemKey ve bazı ölçüleri yeniden yazar.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **1** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `illuminated-foam`
- itemKey: `illuminated-foam`

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

- src dosya sayısı (unique): **3**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/scene3d.js`

- `src/items.js` `NON_CATALOG_ITEMS` :281 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :585 [write-or-literal]
- `src/scene3d.js` `createIlluminatedFoamModule` :4708 [write]
- `test/illuminatedFoamModule.test.js` (dosya düzeyi) :17 [test]
- `test/lightingItemsContract.test.js` (dosya düzeyi) :81 [test]
- `e2e/f028-reset-features.spec.mjs` `seedIlluminatedFoam` :46 [test]

- indeks: 146 / 188
