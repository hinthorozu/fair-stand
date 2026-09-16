# `static.stripOccupancy.align`

**Özellik ID:** `static.stripOccupancy.align`
**İnsan tarafından anlaşılır adı:** Kanonik stripOccupancy.align
**Kategori:** kanonik-kayit
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `top`

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
- `src/scene3d.js` `resolveOccupiedStripLayout` :6973 [write-or-literal]
- `src/moduleDragSidebar.js` `if` :354 [write]
- `src/stripOccupancy.js` `resolveModuleStripOccupancy` :23 [write]

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

Etkiler: snap, collision, side insert, short-up joint, L rotasyon, overlay mount. Ayrıntı `src/modulePlacement.js` + `getModuleBehavior`.

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
- `src/scene3d.js` `resolveOccupiedStripLayout` :6973 [write-or-literal]
- `src/moduleDragSidebar.js` (dosya düzeyi) :2 [read]
- `src/moduleDragSidebar.js` `if` :354 [write]
- `src/stripOccupancy.js` `resolveModuleStripOccupancy` :23 [write]
- `src/stripOccupancy.js` `resolveModuleStripOccupancy` :25 [read]
- `src/systemChangeContract.js` `SOURCE_FILE_REQUIRED_DOMAINS` :137 [read]
- `test/stripOccupancy.test.js` (dosya düzeyi) :11 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :153 [test]

- indeks: 38 / 188
