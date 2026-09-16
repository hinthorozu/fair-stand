# `registry`

**Özellik ID:** `registry`
**İnsan tarafından anlaşılır adı:** items.js kayıt haritası (audit sütunu)
**Kategori:** kimlik
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `LEAF_ITEMS` · `COMMERCIAL_ITEMS` · `FURNITURE_ITEMS` · `INDOOR_PLANT_ITEMS` · `WALL_MEDIA_ITEMS` · `TOP_LIGHT_ITEMS` · `NON_CATALOG_ITEMS` · `FLOOR_ITEMS` · `COMPOSITE_ITEMS`

## Ne işe yarar

Audit sütunu: item hangi `src/items.js` map'inde. Runtime bu string'i taşımaz; `getItem` 9 map'i sırayla arar.

## Canonical owner

- katman: audit (map adı)
- dosya: `src/items.js`
- sembol: `listRegisteredItems map birleşimi`

## Tanımlandığı yerler

- `src/items.js` `LEAF_ITEMS` :2 [define]
- `src/items.js` `getShelfLeafItem` :56 [write]
- `src/items.js` `COMMERCIAL_ITEMS` :119 [define]
- `src/items.js` `getCommercialItemForType` :144 [read]
- `src/items.js` `FURNITURE_ITEMS` :149 [define]
- `src/items.js` `getFurnitureItemForType` :249 [read]
- `src/items.js` `getItem` :1004 [read]
- `src/items.js` `listLeafItems` :1026 [read]
- `src/items.js` `listRegisteredItems` :1029 [read]

## Okuyan yerler

- `src/items.js` `getCommercialItemForType` :144 [read]
- `src/items.js` `getFurnitureItemForType` :249 [read]
- `src/items.js` `getItem` :1004 [read]
- `src/items.js` `listLeafItems` :1026 [read]
- `src/items.js` `listRegisteredItems` :1029 [read]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :8 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :8 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :17 [test]
- `test/moduleRecipes.test.js` (dosya düzeyi) :4 [test]
- `test/moduleRecipes.test.js` `if` :181 [test]

## Yazan / değiştiren yerler

- `src/items.js` `LEAF_ITEMS` :2 [define]
- `src/items.js` `getShelfLeafItem` :56 [write]
- `src/items.js` `COMMERCIAL_ITEMS` :119 [define]
- `src/items.js` `FURNITURE_ITEMS` :149 [define]

## Default değeri

Audit türevi: `listRegisteredItems` hangi freeze map'e koyduğunu yazar. Runtime alanı değil.

## Override zinciri

Override yok (analiz/audit sütunu).

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **104** / 104
- seçim kuralı: `listRegisteredItems()` içindeki her kayıt (104). TSV hücresi boş değil.
- type'lar: `upright`, `profile`, `panel`, `separator-panel`, `connector`, `door-leaf`, `shelf`, `shelf-accessory`, `showcase-board`, `showcase-accessory`, `counter-top`, `base-top`, `coat-rack`, `kettle`, `mini-fridge`, `plastic-trash-bin`, `sofa-set-classic`, `sofa-single-classic`, `sofa-double-classic`, `coffee-table-classic`, `table-chair-set-eames`, `chair`, `table-glass`, `bar-stool`, `indoor-plant-1`, `tv`, `led-floodlight`, `illuminated-foam`, `floor`, `door`, `base`, `counter`, `flat-panel`, `base-wall`, `separator`, `showcase-2`, `showcase-3`
- itemKey: `upright_346_5`, `upright_99`, `upright_49_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `connector_start`, `connector_single`, `connector_double`, `connector_corner`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `shelf_leg`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`, `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`, `furniture_sofa_set_classic`, `furniture_sofa_single_classic`, `furniture_sofa_double_classic`, `furniture_coffee_table_classic`, `furniture_table_chair_set_eames`, `chair_eames`, `glass_table`, `furniture_bar_stool_classic`, `EXTRA_INDOOR_PLANT_1`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`, `TV_42`, `TV_55`, `TV_65`, `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`, `led_floodlight`, `illuminated-foam`, `karolaj`, `hali`, `parke-acik`, `parke-sari`, `parke-beton`, `door_100`, `BASE_100`, `BASE_150`, `BASE_200`, `desk_banko_100`, `desk_banko_150`, `desk_banko_200`, `desk_banko_100_L`, `desk_banko_150_L`, `desk_banko_200_L`, `wall_50`, `wall_100`, `wall_150`, `wall_200`, `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`, `wall_base_100`, `wall_base_150`, `wall_base_200`, `wall_separator_50`, `wall_separator_100`, `wall_separator_50_sarmasik`, `wall_separator_100_sarmasik`, `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`, `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **70**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **34**
- tanımlı ama sahneye çıkmayan: `upright_99`, `upright_49_5`, `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `connector_start`, `connector_single`, `connector_double`, `connector_corner`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `shelf_leg`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Runtime-only / derived audit. Ayrı persist alanı yok.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `registry`

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

DERIVED

## CRUD gerekçesi

Bu sütun runtime Item alanı değil; audit/çözümleyici görünümüdür veya başka alandan türetilir. Kullanıcı bu id ile form alanı görmez.

## Kanıt

- src dosya sayısı (unique): **1**
- src dosyaları: `src/items.js`

- `src/items.js` `LEAF_ITEMS` :2 [define]
- `src/items.js` `getShelfLeafItem` :56 [write]
- `src/items.js` `COMMERCIAL_ITEMS` :119 [define]
- `src/items.js` `getCommercialItemForType` :144 [read]
- `src/items.js` `FURNITURE_ITEMS` :149 [define]
- `src/items.js` `getFurnitureItemForType` :249 [read]
- `src/items.js` `getItem` :1004 [read]
- `src/items.js` `listLeafItems` :1026 [read]
- `src/items.js` `listRegisteredItems` :1029 [read]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :8 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :8 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :17 [test]
- `test/moduleRecipes.test.js` (dosya düzeyi) :4 [test]
- `test/moduleRecipes.test.js` `if` :181 [test]

- indeks: 4 / 188
