# `state.eyeCount`

**Özellik ID:** `state.eyeCount`
**İnsan tarafından anlaşılır adı:** Runtime module state: eyeCount
**Kategori:** runtime-state
**Veri tipi:** number
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `2` · `3`

## Ne işe yarar

create*ModuleState çıktısı. Persist: modules[] blob.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/items.js` (dosya düzeyi) :935 [write-or-literal]
- `src/designState.js` `createShowcaseModuleState` :180 [write-or-literal]
- `src/designState.js` `if` :846 [write]
- `src/catalog.js` `MODULE_CATALOG` :283 [write-or-literal]

## Okuyan yerler

- `src/scene3d.js` `if` :7453 [read]
- `src/rawBomDebug.js` `if` :125 [read]
- `src/selectionFeedback.js` `if` :60 [read]
- `test/showcaseBodyColorRegression.test.js` (dosya düzeyi) :13 [test]
- `test/showcaseBodyColorRegression.test.js` `for` :22 [test]
- `test/wallShowcaseItemContract.test.js` (dosya düzeyi) :11 [test]
- `test/wallShowcaseItemContract.test.js` `for` :24 [test]
- `e2e/wall-showcase-item-contract.spec.mjs` `for` :80 [test]

## Yazan / değiştiren yerler

- `src/items.js` (dosya düzeyi) :935 [write-or-literal]
- `src/designState.js` `createShowcaseModuleState` :180 [write-or-literal]
- `src/designState.js` `if` :846 [write]
- `src/catalog.js` `MODULE_CATALOG` :283 [write-or-literal]
- `src/scene3d.js` `if` :7452 [write]
- `src/scene3d.js` `for` :7599 [write]
- `src/rawBomDebug.js` `if` :123 [write]

## Default değeri

Factory default: ilgili `create*ModuleState` Item/catalog ölçü veya media türevini kopyalar. Global state default yok.

## Override zinciri

Item/catalog ölçü → factory kopya → (nadiren) kullanıcı foam resize width/height → persist. normalizeModuleItemState tv/base/counter/flat-panel itemKey ve bazı ölçüleri yeniden yazar.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **2** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `showcase-2`, `showcase-3`
- itemKey: `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **2**
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

- src dosya sayısı (unique): **6**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/scene3d.js`, `src/rawBomDebug.js`, `src/selectionFeedback.js`

- `src/items.js` (dosya düzeyi) :935 [write-or-literal]
- `src/designState.js` `createShowcaseModuleState` :180 [write-or-literal]
- `src/designState.js` `if` :846 [write]
- `src/catalog.js` `MODULE_CATALOG` :283 [write-or-literal]
- `src/scene3d.js` `if` :7452 [write]
- `src/scene3d.js` `if` :7453 [read]
- `src/scene3d.js` `for` :7599 [write]
- `src/rawBomDebug.js` `if` :123 [write]
- `src/rawBomDebug.js` `if` :125 [read]
- `src/selectionFeedback.js` `if` :60 [read]
- `test/showcaseBodyColorRegression.test.js` (dosya düzeyi) :13 [test]
- `test/showcaseBodyColorRegression.test.js` `for` :22 [test]
- `test/wallShowcaseItemContract.test.js` (dosya düzeyi) :11 [test]
- `test/wallShowcaseItemContract.test.js` `for` :24 [test]
- `e2e/wall-showcase-item-contract.spec.mjs` `for` :80 [test]

- indeks: 120 / 188
