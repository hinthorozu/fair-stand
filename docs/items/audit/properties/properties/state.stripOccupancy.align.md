# `state.stripOccupancy.align`

**Özellik ID:** `state.stripOccupancy.align`
**İnsan tarafından anlaşılır adı:** Runtime module state: stripOccupancy.align
**Kategori:** runtime-state
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `top`

## Ne işe yarar

create*ModuleState çıktısı. Persist: modules[] blob.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/items.js` (dosya düzeyi) :667 [define]

## Okuyan yerler

- `src/scene3d.js` `if` :1898 [read]
- `src/moduleDragSidebar.js` `ensureStyles` :16 [read]
- `src/moduleDragSidebar.js` `if` :355 [read]
- `src/stripOccupancy.js` `normalizeStripOccupancy` :17 [read]
- `src/stripOccupancy.js` `getOccupiedStripLayout` :39 [read]
- `src/stripOccupancy.js` `if` :57 [read]
- `test/kettle.test.js` (dosya düzeyi) :9 [test]
- `test/miniFridge.test.js` (dosya düzeyi) :8 [test]
- `test/stripOccupancy.test.js` (dosya düzeyi) :14 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :153 [test]

## Yazan / değiştiren yerler

- `src/items.js` (dosya düzeyi) :667 [define]
- `src/scene3d.js` `if` :2076 [write]
- `src/scene3d.js` `resolveOccupiedStripLayout` :6973 [write-or-literal]
- `src/moduleContextMenu.js` `createModuleContextMenu` :76 [write]
- `src/moduleContextMenu.js` `createPickerCard` :284 [write]
- `index.html` (dosya düzeyi) :64 [write]

## Default değeri

Factory default: ilgili `create*ModuleState` Item/catalog ölçü veya media türevini kopyalar. Global state default yok.

## Override zinciri

Item/catalog ölçü → factory kopya → (nadiren) kullanıcı foam resize width/height → persist. normalizeModuleItemState tv/base/counter/flat-panel itemKey ve bazı ölçüleri yeniden yazar.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **8** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `flat-panel`
- itemKey: `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **8**
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
- src dosyaları: `src/items.js`, `src/scene3d.js`, `src/moduleContextMenu.js`, `src/moduleDragSidebar.js`, `src/stripOccupancy.js`, `index.html`

- `src/items.js` (dosya düzeyi) :667 [define]
- `src/scene3d.js` `if` :1898 [read]
- `src/scene3d.js` `if` :2076 [write]
- `src/scene3d.js` `resolveOccupiedStripLayout` :6973 [write-or-literal]
- `src/moduleContextMenu.js` `createModuleContextMenu` :76 [write]
- `src/moduleContextMenu.js` `createPickerCard` :284 [write]
- `src/moduleDragSidebar.js` `ensureStyles` :16 [read]
- `src/moduleDragSidebar.js` `if` :355 [read]
- `src/stripOccupancy.js` `normalizeStripOccupancy` :17 [read]
- `src/stripOccupancy.js` `getOccupiedStripLayout` :39 [read]
- `src/stripOccupancy.js` `if` :57 [read]
- `index.html` (dosya düzeyi) :64 [write]
- `test/kettle.test.js` (dosya düzeyi) :9 [test]
- `test/miniFridge.test.js` (dosya düzeyi) :8 [test]
- `test/stripOccupancy.test.js` (dosya düzeyi) :14 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :153 [test]

- indeks: 138 / 188
