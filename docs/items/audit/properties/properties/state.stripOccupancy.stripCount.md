# `state.stripOccupancy.stripCount`

**Özellik ID:** `state.stripOccupancy.stripCount`
**İnsan tarafından anlaşılır adı:** Runtime module state: stripOccupancy.stripCount
**Kategori:** runtime-state
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `2` · `1`

## Ne işe yarar

create*ModuleState çıktısı. Persist: modules[] blob.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/items.js` (dosya düzeyi) :667 [define]
- `src/designState.js` `createFlatPanelModuleState` :100 [write]
- `src/designState.js` `createFlatPanelModuleState` :109 [write-or-literal]
- `src/catalog.js` `STAND_DIMENSIONS` :7 [write-or-literal]

## Okuyan yerler

- `src/scene3d.js` `if` :1899 [read]
- `src/scene3d.js` `resolveOccupiedStripLayout` :6966 [read]
- `src/scene3d.js` `createFlatPanelModule` :6984 [read]
- `src/scene3d.js` `createShowcaseModule` :7440 [read]
- `src/scene3d.js` `for` :7485 [read]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :28 [read]
- `src/standStandardsCopy.js` `getHelpStandardsTableHtml` :73 [read]
- `src/stripOccupancy.js` `normalizeStripOccupancy` :18 [read]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :60 [test]
- `test/horizontalPanelRails.test.js` (dosya düzeyi) :8 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :157 [test]
- `test/stripOccupancy.test.js` (dosya düzeyi) :14 [test]
- `test/visibleUiContract.test.js` (dosya düzeyi) :14 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :153 [test]

## Yazan / değiştiren yerler

- `src/items.js` (dosya düzeyi) :667 [define]
- `src/designState.js` `createFlatPanelModuleState` :100 [write]
- `src/designState.js` `createFlatPanelModuleState` :109 [write-or-literal]
- `src/catalog.js` `STAND_DIMENSIONS` :7 [write-or-literal]
- `src/scene3d.js` `resolveOccupiedStripLayout` :6968 [write]
- `src/scene3d.js` `resolveOccupiedStripLayout` :6973 [write-or-literal]
- `src/scene3d.js` `createFlatPanelModule` :6990 [write]
- `src/scene3d.js` `for` :7495 [write]
- `src/moduleDragSidebar.js` `if` :360 [write]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :17 [write]
- `src/standStandardsCopy.js` `getStandStandardsListItems` :45 [write-or-literal]
- `src/stripOccupancy.js` `getStandStripMetrics` :6 [write-or-literal]
- `src/stripOccupancy.js` `normalizeStripOccupancy` :15 [write]
- `src/stripOccupancy.js` `getOccupiedStripLayout` :29 [write]
- `src/stripOccupancy.js` `getOccupiedStripLayout` :41 [write-or-literal]
- `src/stripOccupancy.js` `if` :56 [write]

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

- src dosya sayısı (unique): **7**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/scene3d.js`, `src/moduleDragSidebar.js`, `src/standStandardsCopy.js`, `src/stripOccupancy.js`

- `src/items.js` (dosya düzeyi) :667 [define]
- `src/designState.js` `createFlatPanelModuleState` :100 [write]
- `src/designState.js` `createFlatPanelModuleState` :109 [write-or-literal]
- `src/catalog.js` `STAND_DIMENSIONS` :7 [write-or-literal]
- `src/scene3d.js` `if` :1899 [read]
- `src/scene3d.js` `resolveOccupiedStripLayout` :6966 [read]
- `src/scene3d.js` `resolveOccupiedStripLayout` :6968 [write]
- `src/scene3d.js` `resolveOccupiedStripLayout` :6973 [write-or-literal]
- `src/scene3d.js` `createFlatPanelModule` :6984 [read]
- `src/scene3d.js` `createFlatPanelModule` :6990 [write]
- `src/scene3d.js` `createShowcaseModule` :7440 [read]
- `src/scene3d.js` `for` :7485 [read]
- `src/scene3d.js` `for` :7495 [write]
- `src/moduleDragSidebar.js` `if` :360 [write]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :17 [write]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :28 [read]
- `src/standStandardsCopy.js` `getStandStandardsListItems` :45 [write-or-literal]
- `src/standStandardsCopy.js` `getHelpStandardsTableHtml` :73 [read]
- `src/stripOccupancy.js` `getStandStripMetrics` :6 [write-or-literal]
- `src/stripOccupancy.js` `normalizeStripOccupancy` :15 [write]
- `src/stripOccupancy.js` `normalizeStripOccupancy` :18 [read]
- `src/stripOccupancy.js` `getOccupiedStripLayout` :29 [write]
- `src/stripOccupancy.js` `getOccupiedStripLayout` :41 [write-or-literal]
- `src/stripOccupancy.js` `if` :56 [write]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :60 [test]
- `test/horizontalPanelRails.test.js` (dosya düzeyi) :8 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :157 [test]
- `test/stripOccupancy.test.js` (dosya düzeyi) :14 [test]
- `test/visibleUiContract.test.js` (dosya düzeyi) :14 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :153 [test]

- indeks: 139 / 188
