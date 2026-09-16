# `state.panelScreenWidthCm`

**Özellik ID:** `state.panelScreenWidthCm`
**İnsan tarafından anlaşılır adı:** Runtime module state: panelScreenWidthCm
**Kategori:** runtime-state
**Veri tipi:** number
**Birim:** cm
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `93` · `121.8` · `143.9` · `108.5`

## Ne işe yarar

create*ModuleState çıktısı. Persist: modules[] blob.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/items.js` `WALL_MEDIA_ITEMS` :444 [define]
- `src/items.js` `if` :463 [write]
- `src/items.js` `if` :474 [read]
- `src/items.js` `if` :488 [write-or-literal]
- `src/designState.js` `createTvModuleState` :614 [write-or-literal]
- `src/catalog.js` `if` :189 [write-or-literal]

## Okuyan yerler

- `src/items.js` `if` :474 [read]
- `test/wallMediaItemsContract.test.js` (dosya düzeyi) :27 [test]
- `test/wallMediaItemsContract.test.js` `for` :76 [test]

## Yazan / değiştiren yerler

- `src/items.js` `WALL_MEDIA_ITEMS` :444 [define]
- `src/items.js` `if` :463 [write]
- `src/items.js` `if` :488 [write-or-literal]
- `src/designState.js` `createTvModuleState` :614 [write-or-literal]
- `src/catalog.js` `if` :189 [write-or-literal]
- `src/scene3d.js` `createTvModule` :4831 [write]

## Default değeri

Factory default: ilgili `create*ModuleState` Item/catalog ölçü veya media türevini kopyalar. Global state default yok.

## Override zinciri

Item/catalog ölçü → factory kopya → (nadiren) kullanıcı foam resize width/height → persist. normalizeModuleItemState tv/base/counter/flat-panel itemKey ve bazı ölçüleri yeniden yazar.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **5** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `tv`
- itemKey: `TV_42`, `TV_55`, `TV_65`, `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`

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

- src dosya sayısı (unique): **4**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/scene3d.js`

- `src/items.js` `WALL_MEDIA_ITEMS` :444 [define]
- `src/items.js` `if` :463 [write]
- `src/items.js` `if` :474 [read]
- `src/items.js` `if` :488 [write-or-literal]
- `src/designState.js` `createTvModuleState` :614 [write-or-literal]
- `src/catalog.js` `if` :189 [write-or-literal]
- `src/scene3d.js` `createTvModule` :4831 [write]
- `test/wallMediaItemsContract.test.js` (dosya düzeyi) :27 [test]
- `test/wallMediaItemsContract.test.js` `for` :76 [test]

- indeks: 129 / 188
