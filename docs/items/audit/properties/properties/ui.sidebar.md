# `ui.sidebar`

**Özellik ID:** `ui.sidebar`
**İnsan tarafından anlaşılır adı:** Sidebar katalog kartı
**Kategori:** ui-audit
**Veri tipi:** boolean
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `true` · `false`

## Ne işe yarar

Önceki audit'in UI yetenek sütunu. Runtime alanı değil; ilgili action/behavior kanıtlanır.

## Canonical owner

- katman: UI
- dosya: `src/moduleDragSidebar.js`
- sembol: `MODULE_CATALOG_GROUPS`

## Tanımlandığı yerler

- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]

## Okuyan yerler

- `src/scene3d.js` (dosya düzeyi) :56 [read]
- `src/main.js` (dosya düzeyi) :26 [read]
- `src/main.js` `setStandEditingEnabled` :232 [read]
- `src/moduleContextMenu.js` (dosya düzeyi) :1 [read]
- `src/moduleContextMenu.js` `createPickerCard` :304 [read]
- `src/moduleDragSidebar.js` (dosya düzeyi) :1 [read]
- `src/moduleDragSidebar.js` `createModuleCatalogPreview` :122 [read]
- `src/moduleDragSidebar.js` `resetDragState` :445 [read]
- `src/systemChangeContract.js` `SOURCE_FILE_REQUIRED_DOMAINS` :115 [read]
- `test/catalogDragKeyboardIntegration.test.js` (dosya düzeyi) :5 [test]
- `test/catalogSingleSource.test.js` (dosya düzeyi) :8 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :4 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :4 [test]
- `test/moduleRotationSingleSourceIntegration.test.js` (dosya düzeyi) :6 [test]
- `test/plasticTrashBinModule.test.js` (dosya düzeyi) :6 [test]
- `test/plasticTrashBinModule.test.js` `overlaps` :54 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :4 [test]
- `test/removedIndoorPlant2.test.js` (dosya düzeyi) :10 [test]
- `test/stripOccupancy.test.js` (dosya düzeyi) :54 [test]
- `test/tv42Module.test.js` (dosya düzeyi) :214 [test]
- `test/uprightFieldPlacement.test.js` (dosya düzeyi) :4 [test]

## Yazan / değiştiren yerler

- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/scene3d.js` `if` :2094 [write]
- `src/main.js` (dosya düzeyi) :183 [write]
- `src/main.js` `resizeContextIlluminatedFoam` :897 [write]
- `src/moduleContextMenu.js` `renderPickerCatalog` :318 [write]
- `src/moduleDragSidebar.js` `createModuleDragSidebar` :394 [write]

## Default değeri

Audit/çözümleyici sütunu. Runtime default değeri yok; canlı fonksiyondan türetilir veya tarama sonucudur.

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

yerleştirme

## Kullanıcı nereden değiştirir

Sol katalog `moduleDragSidebar` / context picker.

## Persistence

Runtime-only / derived audit. Ayrı persist alanı yok.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

validation yok (tablo/audit).

## Bağımlılıklar

- kök katman: `ui`

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

DERIVED

## CRUD gerekçesi

Bu sütun runtime Item alanı değil; audit/çözümleyici görünümüdür veya başka alandan türetilir. Kullanıcı bu id ile form alanı görmez.

## Kanıt

- src dosya sayısı (unique): **6**
- src dosyaları: `src/catalog.js`, `src/scene3d.js`, `src/main.js`, `src/moduleContextMenu.js`, `src/moduleDragSidebar.js`, `src/systemChangeContract.js`

- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/scene3d.js` (dosya düzeyi) :56 [read]
- `src/scene3d.js` `if` :2094 [write]
- `src/main.js` (dosya düzeyi) :26 [read]
- `src/main.js` (dosya düzeyi) :183 [write]
- `src/main.js` `setStandEditingEnabled` :232 [read]
- `src/main.js` `resizeContextIlluminatedFoam` :897 [write]
- `src/moduleContextMenu.js` (dosya düzeyi) :1 [read]
- `src/moduleContextMenu.js` `createPickerCard` :304 [read]
- `src/moduleContextMenu.js` `renderPickerCatalog` :318 [write]
- `src/moduleDragSidebar.js` (dosya düzeyi) :1 [read]
- `src/moduleDragSidebar.js` `createModuleCatalogPreview` :122 [read]
- `src/moduleDragSidebar.js` `createModuleDragSidebar` :394 [write]
- `src/moduleDragSidebar.js` `resetDragState` :445 [read]
- `src/systemChangeContract.js` `SOURCE_FILE_REQUIRED_DOMAINS` :115 [read]
- `test/catalogDragKeyboardIntegration.test.js` (dosya düzeyi) :5 [test]
- `test/catalogSingleSource.test.js` (dosya düzeyi) :8 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :4 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :4 [test]
- `test/moduleRotationSingleSourceIntegration.test.js` (dosya düzeyi) :6 [test]
- `test/plasticTrashBinModule.test.js` (dosya düzeyi) :6 [test]
- `test/plasticTrashBinModule.test.js` `overlaps` :54 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :4 [test]
- `test/removedIndoorPlant2.test.js` (dosya düzeyi) :10 [test]
- `test/stripOccupancy.test.js` (dosya düzeyi) :54 [test]
- `test/tv42Module.test.js` (dosya düzeyi) :214 [test]
- `test/uprightFieldPlacement.test.js` (dosya düzeyi) :4 [test]

- indeks: 168 / 188
