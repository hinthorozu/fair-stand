# `catalog.inKeysList`

**Özellik ID:** `catalog.inKeysList`
**İnsan tarafından anlaşılır adı:** MODULE_CATALOG_KEYS sırası
**Kategori:** katalog
**Veri tipi:** boolean
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `true` · `false`

## Ne işe yarar

Katalog descriptor alanı. Kaynak Item + `create*CatalogItem` eşlemesi (profilde width remap). Sidebar/drag bu nesneyi taşır.

## Canonical owner

- katman: katalog descriptor (Item türevi)
- dosya: `src/catalog.js`
- sembol: `MODULE_CATALOG / create*CatalogItem`

## Tanımlandığı yerler

- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `resolveItemKey` :503 [write]

## Okuyan yerler

- `src/moduleDragSidebar.js` (dosya düzeyi) :1 [read]
- `test/barStool2.test.js` (dosya düzeyi) :3 [test]
- `test/baseWallCatalog.test.js` (dosya düzeyi) :3 [test]
- `test/baseWallCatalog.test.js` `for` :10 [test]
- `test/catalogSingleSource.test.js` (dosya düzeyi) :9 [test]
- `test/chairEamesContract.test.js` (dosya düzeyi) :4 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/eamesTableChairSetContract.test.js` (dosya düzeyi) :4 [test]
- `test/floorItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/floorItemsContract.test.js` `for` :36 [test]
- `test/glassTableContract.test.js` (dosya düzeyi) :4 [test]
- `test/lCounter100Contract.test.js` (dosya düzeyi) :4 [test]
- `test/lCounter150Contract.test.js` (dosya düzeyi) :4 [test]
- `test/lCounter200Contract.test.js` (dosya düzeyi) :4 [test]
- `test/lightingItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/moduleBehaviorContract.test.js` (dosya düzeyi) :4 [test]
- `test/moduleBehaviorContract.test.js` `for` :72 [test]
- `test/moduleStateConstructionRegistry.test.js` (dosya düzeyi) :5 [test]
- `test/moduleStateConstructionRegistry.test.js` `for` :11 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :4 [test]
- `test/profileFieldPlacement.test.js` `for` :20 [test]
- `test/sofaClassicPiecesContract.test.js` (dosya düzeyi) :4 [test]
- `test/systemDevelopmentContract.test.js` (dosya düzeyi) :4 [test]
- `test/systemDevelopmentContract.test.js` `for` :37 [test]
- `test/systemModuleCatalogDoc.test.js` (dosya düzeyi) :5 [test]
- `test/systemModuleCatalogDoc.test.js` `readCatalogKeySnapshot` :25 [test]
- … test/e2e ek 4 eşleşme (src listesi tam).

## Yazan / değiştiren yerler

- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `resolveItemKey` :503 [write]
- `src/moduleDragSidebar.js` `resetDragState` :431 [write]

## Default değeri

Catalog default: `create*CatalogItem` Item alanından kopya. Profil `widthCm` `getStraightWallNominalWidthForProfileItem` ile remap. Kullanıcı ezemaz.

## Override zinciri

Item kaydı → create*CatalogItem eşlemesi → MODULE_CATALOG. Kullanıcı katalog alanını ezemaz.

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

Kod tablosu. Persist yok (her load'da type/itemKey ile yeniden çözülür).

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

validation yok (tablo/audit).

## Bağımlılıklar

- kök katman: `catalog`
- kaynak: eşdeğer `static.*` / Item dimensions (profil width remap).

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

DERIVED

## CRUD gerekçesi

Bu sütun runtime Item alanı değil; audit/çözümleyici görünümüdür veya başka alandan türetilir. Kullanıcı bu id ile form alanı görmez.

## Kanıt

- src dosya sayısı (unique): **2**
- src dosyaları: `src/catalog.js`, `src/moduleDragSidebar.js`

- `src/catalog.js` `MODULE_CATALOG_KEYS` :346 [define]
- `src/catalog.js` `resolveItemKey` :503 [write]
- `src/moduleDragSidebar.js` (dosya düzeyi) :1 [read]
- `src/moduleDragSidebar.js` `resetDragState` :431 [write]
- `test/barStool2.test.js` (dosya düzeyi) :3 [test]
- `test/baseWallCatalog.test.js` (dosya düzeyi) :3 [test]
- `test/baseWallCatalog.test.js` `for` :10 [test]
- `test/catalogSingleSource.test.js` (dosya düzeyi) :9 [test]
- `test/chairEamesContract.test.js` (dosya düzeyi) :4 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/eamesTableChairSetContract.test.js` (dosya düzeyi) :4 [test]
- `test/floorItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/floorItemsContract.test.js` `for` :36 [test]
- `test/glassTableContract.test.js` (dosya düzeyi) :4 [test]
- `test/lCounter100Contract.test.js` (dosya düzeyi) :4 [test]
- `test/lCounter150Contract.test.js` (dosya düzeyi) :4 [test]
- `test/lCounter200Contract.test.js` (dosya düzeyi) :4 [test]
- `test/lightingItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/moduleBehaviorContract.test.js` (dosya düzeyi) :4 [test]
- `test/moduleBehaviorContract.test.js` `for` :72 [test]
- `test/moduleStateConstructionRegistry.test.js` (dosya düzeyi) :5 [test]
- `test/moduleStateConstructionRegistry.test.js` `for` :11 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :4 [test]
- `test/profileFieldPlacement.test.js` `for` :20 [test]
- `test/sofaClassicPiecesContract.test.js` (dosya düzeyi) :4 [test]
- `test/systemDevelopmentContract.test.js` (dosya düzeyi) :4 [test]
- `test/systemDevelopmentContract.test.js` `for` :37 [test]
- `test/systemModuleCatalogDoc.test.js` (dosya düzeyi) :5 [test]
- `test/systemModuleCatalogDoc.test.js` `readCatalogKeySnapshot` :25 [test]
- … test/e2e ek 4 eşleşme (src listesi tam).

- indeks: 48 / 188
