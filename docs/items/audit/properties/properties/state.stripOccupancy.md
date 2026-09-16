# `state.stripOccupancy`

**Özellik ID:** `state.stripOccupancy`
**İnsan tarafından anlaşılır adı:** Runtime module state: stripOccupancy
**Kategori:** runtime-state
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `"{""align"":""top"",""stripCount"":2}"` · `"{""align"":""top"",""stripCount"":1}"`

## Ne işe yarar

create*ModuleState çıktısı. Persist: modules[] blob.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/items.js` (dosya düzeyi) :667 [define]
- `src/designState.js` (dosya düzeyi) :2 [read]
- `src/designState.js` `createFlatPanelModuleState` :99 [write]
- `src/designState.js` `createFlatPanelModuleState` :107 [write-or-literal]
- `src/designState.js` `if` :738 [write]
- `src/catalog.js` `createFlatPanelCatalogItem` :66 [write]
- `src/moduleBehavior.js` (dosya düzeyi) :3 [read]

## Okuyan yerler

- `src/designState.js` (dosya düzeyi) :2 [read]
- `src/moduleBehavior.js` (dosya düzeyi) :3 [read]
- `src/scene3d.js` (dosya düzeyi) :19 [read]
- `src/moduleDragSidebar.js` (dosya düzeyi) :2 [read]
- `src/stripOccupancy.js` `resolveModuleStripOccupancy` :25 [read]
- `src/systemChangeContract.js` `SOURCE_FILE_REQUIRED_DOMAINS` :137 [read]
- `test/stripOccupancy.test.js` (dosya düzeyi) :11 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :153 [test]

## Yazan / değiştiren yerler

- `src/items.js` (dosya düzeyi) :667 [define]
- `src/designState.js` `createFlatPanelModuleState` :99 [write]
- `src/designState.js` `createFlatPanelModuleState` :107 [write-or-literal]
- `src/designState.js` `if` :738 [write]
- `src/catalog.js` `createFlatPanelCatalogItem` :66 [write]
- `src/moduleDragSidebar.js` `if` :354 [write]
- `src/stripOccupancy.js` `resolveModuleStripOccupancy` :23 [write]

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

- src dosya sayısı (unique): **8**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/moduleBehavior.js`, `src/scene3d.js`, `src/moduleDragSidebar.js`, `src/stripOccupancy.js`, `src/systemChangeContract.js`

- `src/items.js` (dosya düzeyi) :667 [define]
- `src/designState.js` (dosya düzeyi) :2 [read]
- `src/designState.js` `createFlatPanelModuleState` :99 [write]
- `src/designState.js` `createFlatPanelModuleState` :107 [write-or-literal]
- `src/designState.js` `if` :738 [write]
- `src/catalog.js` `createFlatPanelCatalogItem` :66 [write]
- `src/moduleBehavior.js` (dosya düzeyi) :3 [read]
- `src/scene3d.js` (dosya düzeyi) :19 [read]
- `src/moduleDragSidebar.js` (dosya düzeyi) :2 [read]
- `src/moduleDragSidebar.js` `if` :354 [write]
- `src/stripOccupancy.js` `resolveModuleStripOccupancy` :23 [write]
- `src/stripOccupancy.js` `resolveModuleStripOccupancy` :25 [read]
- `src/systemChangeContract.js` `SOURCE_FILE_REQUIRED_DOMAINS` :137 [read]
- `test/stripOccupancy.test.js` (dosya düzeyi) :11 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :153 [test]

- indeks: 137 / 188
