# `static.nominalModuleWidthCm`

**Özellik ID:** `static.nominalModuleWidthCm`
**İnsan tarafından anlaşılır adı:** static.nominalModuleWidthCm
**Kategori:** kanonik-kayit
**Veri tipi:** number
**Birim:** cm
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `50` · `100` · `150` · `200`

## Ne işe yarar

Audit özelliği. Aşağıdaki kanıt satırlarına bak.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `LEAF_ITEMS` :12 [define]
- `src/items.js` `getShelfLeafItem` :54 [read]
- `src/items.js` `getShelfLeafItem` :55 [write]
- `src/items.js` `getDoorLeafItem` :66 [read]
- `src/items.js` `getDoorLeafItem` :67 [write]

## Okuyan yerler

- `src/items.js` `getShelfLeafItem` :54 [read]
- `src/items.js` `getDoorLeafItem` :66 [read]
- `src/moduleRecipes.js` `if` :250 [read]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :15 [test]
- `test/baseTopsItemContract.test.js` `for` :50 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :17 [test]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :8 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :20 [test]
- `test/panel197ItemContract.test.js` (dosya düzeyi) :27 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :29 [test]
- `test/separatorPanelsItemContract.test.js` (dosya düzeyi) :14 [test]
- `test/shelfItemsItemContract.test.js` (dosya düzeyi) :27 [test]
- `test/straightPanelsItemContract.test.js` (dosya düzeyi) :9 [test]

## Yazan / değiştiren yerler

- `src/items.js` `LEAF_ITEMS` :12 [define]
- `src/items.js` `getShelfLeafItem` :55 [write]
- `src/items.js` `getDoorLeafItem` :67 [write]

## Default değeri

Item default: yalnız `src/items.js` dondurulmuş kayıt. Type default yok. Factory bu alanı kopyalamaz (eşdeğer `state.*` ayrı sütun).

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **23** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `panel`, `separator-panel`, `door-leaf`, `shelf`, `counter-top`, `base-top`
- itemKey: `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **0**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **23**
- tanımlı ama sahneye çıkmayan: `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`

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

- src dosya sayısı (unique): **2**
- src dosyaları: `src/items.js`, `src/moduleRecipes.js`

- `src/items.js` `LEAF_ITEMS` :12 [define]
- `src/items.js` `getShelfLeafItem` :54 [read]
- `src/items.js` `getShelfLeafItem` :55 [write]
- `src/items.js` `getDoorLeafItem` :66 [read]
- `src/items.js` `getDoorLeafItem` :67 [write]
- `src/moduleRecipes.js` `if` :250 [read]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :15 [test]
- `test/baseTopsItemContract.test.js` `for` :50 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :17 [test]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :8 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :20 [test]
- `test/panel197ItemContract.test.js` (dosya düzeyi) :27 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :29 [test]
- `test/separatorPanelsItemContract.test.js` (dosya düzeyi) :14 [test]
- `test/shelfItemsItemContract.test.js` (dosya düzeyi) :27 [test]
- `test/straightPanelsItemContract.test.js` (dosya düzeyi) :9 [test]

- indeks: 31 / 188
