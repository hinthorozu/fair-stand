# `static.unit`

**Özellik ID:** `static.unit`
**İnsan tarafından anlaşılır adı:** BOM birimi
**Kategori:** kanonik-kayit
**Veri tipi:** string
**Birim:** BOM unit etiketi (kodda `adet`)
**İzin verilen değerler / enum / aralık:** `adet` (tanımlı leaf/composite unit)

## Ne işe yarar

Leaf BOM satır birimi. Yoksa `resolveItemBom` TypeError.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `LEAF_ITEMS` :3 [define]
- `src/items.js` `if` :114 [define]
- `src/items.js` `COMMERCIAL_ITEMS` :121 [write-or-literal]
- `src/items.js` `COMPOSITE_ITEMS` :498 [write-or-literal]
- `src/items.js` (dosya düzeyi) :933 [write-or-literal]

## Okuyan yerler

- `test/baseTopsItemContract.test.js` (dosya düzeyi) :37 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :14 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :32 [test]
- `test/connectorBom.test.js` (dosya düzeyi) :22 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :64 [test]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :31 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :38 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :16 [test]
- `test/glassShelfItemContract.test.js` (dosya düzeyi) :21 [test]
- `test/moduleRecipes.test.js` (dosya düzeyi) :30 [test]
- `test/panel197ItemContract.test.js` (dosya düzeyi) :24 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :26 [test]
- `test/profile190ItemContract.test.js` (dosya düzeyi) :30 [test]
- `test/profilesItemContract.test.js` (dosya düzeyi) :73 [test]
- `test/separatorPanelsItemContract.test.js` (dosya düzeyi) :37 [test]
- `test/shelfItemsItemContract.test.js` (dosya düzeyi) :23 [test]
- `test/shelfLegItemContract.test.js` (dosya düzeyi) :17 [test]
- `test/showcaseBodyBoardsItemContract.test.js` `for` :28 [test]
- `test/straightPanelsItemContract.test.js` (dosya düzeyi) :62 [test]
- `test/upright3465ItemContract.test.js` `listAllVerifiedRecipes` :49 [test]
- `test/upright3465ItemContract.test.js` `for` :74 [test]
- `test/upright99And495ItemContract.test.js` (dosya düzeyi) :43 [test]
- `test/wallShowcaseItemContract.test.js` `for` :22 [test]

## Yazan / değiştiren yerler

- `src/items.js` `LEAF_ITEMS` :3 [define]
- `src/items.js` `if` :114 [define]
- `src/items.js` `COMMERCIAL_ITEMS` :121 [write-or-literal]
- `src/items.js` `COMPOSITE_ITEMS` :498 [write-or-literal]
- `src/items.js` (dosya düzeyi) :933 [write-or-literal]
- `src/itemBom.js` `if` :39 [write-or-literal]

## Default değeri

Item default: tanımlı kayıtlarda `adet`. Yoksa `resolveItemBom` TypeError. Furniture/floor/foam unit yok.

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **46** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `upright`, `profile`, `panel`, `separator-panel`, `connector`, `door-leaf`, `shelf`, `shelf-accessory`, `showcase-board`, `showcase-accessory`, `counter-top`, `base-top`, `coat-rack`, `kettle`, `mini-fridge`, `plastic-trash-bin`, `door`, `showcase-2`, `showcase-3`
- itemKey: `upright_346_5`, `upright_99`, `upright_49_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `connector_start`, `connector_single`, `connector_double`, `connector_corner`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `shelf_leg`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`, `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`, `door_100`, `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **12**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **34**
- tanımlı ama sahneye çıkmayan: `upright_99`, `upright_49_5`, `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `connector_start`, `connector_single`, `connector_double`, `connector_corner`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `shelf_leg`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`

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

Etkiler: `resolveItemBom` / recipe items / inner-corner variant. Miktar uydurulmaz; recipe satırı kanoniktir.

## Validation

`resolveItemBom` unit yoksa TypeError (`Missing canonical unit`).

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
- src dosyaları: `src/items.js`, `src/itemBom.js`

- `src/items.js` `LEAF_ITEMS` :3 [define]
- `src/items.js` `if` :114 [define]
- `src/items.js` `COMMERCIAL_ITEMS` :121 [write-or-literal]
- `src/items.js` `COMPOSITE_ITEMS` :498 [write-or-literal]
- `src/items.js` (dosya düzeyi) :933 [write-or-literal]
- `src/itemBom.js` `if` :39 [write-or-literal]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :37 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :14 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :32 [test]
- `test/connectorBom.test.js` (dosya düzeyi) :22 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :64 [test]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :31 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :38 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :16 [test]
- `test/glassShelfItemContract.test.js` (dosya düzeyi) :21 [test]
- `test/moduleRecipes.test.js` (dosya düzeyi) :30 [test]
- `test/panel197ItemContract.test.js` (dosya düzeyi) :24 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :26 [test]
- `test/profile190ItemContract.test.js` (dosya düzeyi) :30 [test]
- `test/profilesItemContract.test.js` (dosya düzeyi) :73 [test]
- `test/separatorPanelsItemContract.test.js` (dosya düzeyi) :37 [test]
- `test/shelfItemsItemContract.test.js` (dosya düzeyi) :23 [test]
- `test/shelfLegItemContract.test.js` (dosya düzeyi) :17 [test]
- `test/showcaseBodyBoardsItemContract.test.js` `for` :28 [test]
- `test/straightPanelsItemContract.test.js` (dosya düzeyi) :62 [test]
- `test/upright3465ItemContract.test.js` `listAllVerifiedRecipes` :49 [test]
- `test/upright3465ItemContract.test.js` `for` :74 [test]
- `test/upright99And495ItemContract.test.js` (dosya düzeyi) :43 [test]
- `test/wallShowcaseItemContract.test.js` `for` :22 [test]

- indeks: 40 / 188
