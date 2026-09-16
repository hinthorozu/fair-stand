# `static.stripOccupancy.stripCount`

**Özellik ID:** `static.stripOccupancy.stripCount`
**İnsan tarafından anlaşılır adı:** Kanonik stripOccupancy.stripCount
**Kategori:** kanonik-kayit
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `2` · `1`

## Ne işe yarar

Audit özelliği. Aşağıdaki kanıt satırlarına bak.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` (dosya düzeyi) :667 [define]
- `src/designState.js` (dosya düzeyi) :2 [read]
- `src/designState.js` `createFlatPanelModuleState` :99 [write]
- `src/designState.js` `createFlatPanelModuleState` :107 [write-or-literal]
- `src/designState.js` `if` :738 [write]
- `src/catalog.js` `STAND_DIMENSIONS` :7 [write-or-literal]
- `src/catalog.js` `createFlatPanelCatalogItem` :66 [write]
- `src/moduleBehavior.js` (dosya düzeyi) :3 [read]

## Okuyan yerler

- `src/designState.js` (dosya düzeyi) :2 [read]
- `src/moduleBehavior.js` (dosya düzeyi) :3 [read]
- `src/scene3d.js` (dosya düzeyi) :19 [read]
- `src/scene3d.js` `if` :1899 [read]
- `src/scene3d.js` `resolveOccupiedStripLayout` :6966 [read]
- `src/scene3d.js` `createFlatPanelModule` :6984 [read]
- `src/scene3d.js` `createShowcaseModule` :7440 [read]
- `src/scene3d.js` `for` :7485 [read]
- `src/moduleDragSidebar.js` (dosya düzeyi) :2 [read]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :28 [read]
- `src/standStandardsCopy.js` `getHelpStandardsTableHtml` :73 [read]
- `src/stripOccupancy.js` `normalizeStripOccupancy` :18 [read]
- `src/stripOccupancy.js` `resolveModuleStripOccupancy` :25 [read]
- `src/systemChangeContract.js` `SOURCE_FILE_REQUIRED_DOMAINS` :137 [read]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :60 [test]
- `test/horizontalPanelRails.test.js` (dosya düzeyi) :8 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :157 [test]
- `test/stripOccupancy.test.js` (dosya düzeyi) :11 [test]
- `test/visibleUiContract.test.js` (dosya düzeyi) :14 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :153 [test]

## Yazan / değiştiren yerler

- `src/items.js` (dosya düzeyi) :667 [define]
- `src/designState.js` `createFlatPanelModuleState` :99 [write]
- `src/designState.js` `createFlatPanelModuleState` :107 [write-or-literal]
- `src/designState.js` `if` :738 [write]
- `src/catalog.js` `STAND_DIMENSIONS` :7 [write-or-literal]
- `src/catalog.js` `createFlatPanelCatalogItem` :66 [write]
- `src/scene3d.js` `resolveOccupiedStripLayout` :6968 [write]
- `src/scene3d.js` `resolveOccupiedStripLayout` :6973 [write-or-literal]
- `src/scene3d.js` `createFlatPanelModule` :6990 [write]
- `src/scene3d.js` `for` :7495 [write]
- `src/moduleDragSidebar.js` `if` :354 [write]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :17 [write]
- `src/standStandardsCopy.js` `getStandStandardsListItems` :45 [write-or-literal]
- `src/stripOccupancy.js` `getStandStripMetrics` :6 [write-or-literal]
- `src/stripOccupancy.js` `normalizeStripOccupancy` :15 [write]
- `src/stripOccupancy.js` `resolveModuleStripOccupancy` :23 [write]
- `src/stripOccupancy.js` `getOccupiedStripLayout` :29 [write]
- `src/stripOccupancy.js` `getOccupiedStripLayout` :41 [write-or-literal]
- `src/stripOccupancy.js` `if` :56 [write]

## Default değeri

Item default: yalnız `src/items.js` dondurulmuş kayıt. Type default yok. Factory bu alanı kopyalamaz (eşdeğer `state.*` ayrı sütun).

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

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

Kod kaydı. Project DB'ye yazılmaz.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `static`

## Değiştirmenin yan etkileri

Kanonik kayıt değişirse catalog, factory, BOM, davranış çözümü ve test kilitleri birlikte etkilenir. Bu turda değiştirilmedi.

## CRUD sınıflandırması

ITEM_READONLY

## CRUD gerekçesi

Kanonik `src/items.js` kaydı. Runtime kullanıcı bu alanları item tanımı olarak değiştirmez; kopyalar factory/catalog/BOM tarafında okunur.

## Kanıt

- src dosya sayısı (unique): **9**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/moduleBehavior.js`, `src/scene3d.js`, `src/moduleDragSidebar.js`, `src/standStandardsCopy.js`, `src/stripOccupancy.js`, `src/systemChangeContract.js`

- `src/items.js` (dosya düzeyi) :667 [define]
- `src/designState.js` (dosya düzeyi) :2 [read]
- `src/designState.js` `createFlatPanelModuleState` :99 [write]
- `src/designState.js` `createFlatPanelModuleState` :107 [write-or-literal]
- `src/designState.js` `if` :738 [write]
- `src/catalog.js` `STAND_DIMENSIONS` :7 [write-or-literal]
- `src/catalog.js` `createFlatPanelCatalogItem` :66 [write]
- `src/moduleBehavior.js` (dosya düzeyi) :3 [read]
- `src/scene3d.js` (dosya düzeyi) :19 [read]
- `src/scene3d.js` `if` :1899 [read]
- `src/scene3d.js` `resolveOccupiedStripLayout` :6966 [read]
- `src/scene3d.js` `resolveOccupiedStripLayout` :6968 [write]
- `src/scene3d.js` `resolveOccupiedStripLayout` :6973 [write-or-literal]
- `src/scene3d.js` `createFlatPanelModule` :6984 [read]
- `src/scene3d.js` `createFlatPanelModule` :6990 [write]
- `src/scene3d.js` `createShowcaseModule` :7440 [read]
- `src/scene3d.js` `for` :7485 [read]
- `src/scene3d.js` `for` :7495 [write]
- `src/moduleDragSidebar.js` (dosya düzeyi) :2 [read]
- `src/moduleDragSidebar.js` `if` :354 [write]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :17 [write]
- `src/standStandardsCopy.js` `getStandStandardsFacts` :28 [read]
- `src/standStandardsCopy.js` `getStandStandardsListItems` :45 [write-or-literal]
- `src/standStandardsCopy.js` `getHelpStandardsTableHtml` :73 [read]
- `src/stripOccupancy.js` `getStandStripMetrics` :6 [write-or-literal]
- `src/stripOccupancy.js` `normalizeStripOccupancy` :15 [write]
- `src/stripOccupancy.js` `normalizeStripOccupancy` :18 [read]
- `src/stripOccupancy.js` `resolveModuleStripOccupancy` :23 [write]
- `src/stripOccupancy.js` `resolveModuleStripOccupancy` :25 [read]
- `src/stripOccupancy.js` `getOccupiedStripLayout` :29 [write]
- `src/stripOccupancy.js` `getOccupiedStripLayout` :41 [write-or-literal]
- `src/stripOccupancy.js` `if` :56 [write]
- `src/systemChangeContract.js` `SOURCE_FILE_REQUIRED_DOMAINS` :137 [read]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :60 [test]
- `test/horizontalPanelRails.test.js` (dosya düzeyi) :8 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :157 [test]
- `test/stripOccupancy.test.js` (dosya düzeyi) :11 [test]
- `test/visibleUiContract.test.js` (dosya düzeyi) :14 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :153 [test]

- indeks: 39 / 188
