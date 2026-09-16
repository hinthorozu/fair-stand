# `name`

**Özellik ID:** `name`
**İnsan tarafından anlaşılır adı:** Görünen ad
**Kategori:** kimlik
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `Dikme 346,5 cm` · `Dikme 99 cm` · `Dikme 49,5 cm` · `Profil 41,5 cm` · `Profil 91 cm` · `Profil 140,5 cm` · `Profil 190 cm` · `Panel 48,5 × 47 cm` · `Panel 98 × 47 cm` · `Panel 147,5 × 47 cm` · `Panel 197 × 47 cm` · `İç Köşe Paneli 42,5 × 47 cm` (+92)

## Ne işe yarar

UI etiketi (`MODULE_CATALOG.label` kaynağı, seçim metni, zemin select). İş kuralı kimliği değildir.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `getFloorSelectLabel` :337 [read]
- `src/items.js` `resolveWallMediaMetrics` :460 [write-or-literal]
- `src/catalog.js` `createBaseCatalogItem` :41 [write-or-literal]
- `src/catalog.js` `createCounterCatalogItem` :51 [write-or-literal]
- `src/catalog.js` `createFlatPanelCatalogItem` :63 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :80 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :94 [write-or-literal]
- `src/catalog.js` `createBaseWallCatalogItem` :106 [write-or-literal]
- `src/catalog.js` `createSeparatorCatalogItem` :116 [write-or-literal]
- `src/catalog.js` `createShelfCatalogItem` :129 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :223 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :240 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :256 [write-or-literal]
- `src/catalog.js` `getModuleCatalogLabel` :537 [read]

## Okuyan yerler

- `src/items.js` `getFloorSelectLabel` :337 [read]
- `src/catalog.js` `getModuleCatalogLabel` :537 [read]
- `src/scene3d.js` (dosya düzeyi) :5 [read]
- `src/main.js` (dosya düzeyi) :54 [read]
- `src/moduleContextMenu.js` (dosya düzeyi) :1 [read]
- `src/moduleContextMenu.js` `describeModule` :109 [read]
- `src/selectionFeedback.js` `if` :78 [read]
- `test/baseItemsContract.test.js` (dosya düzeyi) :58 [test]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :35 [test]
- `test/catalogSingleSource.test.js` (dosya düzeyi) :6 [test]
- `test/chairEamesContract.test.js` (dosya düzeyi) :13 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :15 [test]
- `test/connectorBom.test.js` (dosya düzeyi) :25 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :62 [test]
- `test/deskBankoItemsContract.test.js` `if` :95 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :36 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :14 [test]
- `test/floorItemsContract.test.js` (dosya düzeyi) :7 [test]
- `test/floorItemsContract.test.js` `for` :33 [test]
- `test/furnitureItemsContract.test.js` `if` :167 [test]
- `test/glassShelfItemContract.test.js` (dosya düzeyi) :19 [test]
- `test/glassTableContract.test.js` (dosya düzeyi) :13 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :88 [test]
- `test/lightingItemsContract.test.js` (dosya düzeyi) :77 [test]
- `test/panel197ItemContract.test.js` (dosya düzeyi) :22 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :24 [test]
- `test/profile190ItemContract.test.js` (dosya düzeyi) :28 [test]
- `test/profilesItemContract.test.js` (dosya düzeyi) :71 [test]
- `test/separatorPanelsItemContract.test.js` (dosya düzeyi) :35 [test]
- `test/shelfItemsItemContract.test.js` (dosya düzeyi) :21 [test]
- `test/sofaClassicPiecesContract.test.js` (dosya düzeyi) :18 [test]
- `test/straightPanelsItemContract.test.js` (dosya düzeyi) :60 [test]
- … test/e2e ek 6 eşleşme (src listesi tam).

## Yazan / değiştiren yerler

- `src/items.js` `resolveWallMediaMetrics` :460 [write-or-literal]
- `src/catalog.js` `createBaseCatalogItem` :41 [write-or-literal]
- `src/catalog.js` `createCounterCatalogItem` :51 [write-or-literal]
- `src/catalog.js` `createFlatPanelCatalogItem` :63 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :80 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :94 [write-or-literal]
- `src/catalog.js` `createBaseWallCatalogItem` :106 [write-or-literal]
- `src/catalog.js` `createSeparatorCatalogItem` :116 [write-or-literal]
- `src/catalog.js` `createShelfCatalogItem` :129 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :223 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :240 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :256 [write-or-literal]
- `src/scene3d.js` `if` :2084 [write]
- `src/main.js` `syncFloorTypeSelect` :93 [write]

## Default değeri

Item default: `src/items.js` `name` alanı. Catalog `label` aynı kaynaktan kopyalanır (`create*CatalogItem`). Fallback yok.

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

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

Kod kaydı. Persist edilmez. Label runtime getItem/catalog'dan okunur.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `name`

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

ITEM_READONLY

## CRUD gerekçesi

Kanonik `src/items.js` kaydı. Runtime kullanıcı bu alanları item tanımı olarak değiştirmez; kopyalar factory/catalog/BOM tarafında okunur.

## Kanıt

- src dosya sayısı (unique): **6**
- src dosyaları: `src/items.js`, `src/catalog.js`, `src/scene3d.js`, `src/main.js`, `src/moduleContextMenu.js`, `src/selectionFeedback.js`

- `src/items.js` `getFloorSelectLabel` :337 [read]
- `src/items.js` `resolveWallMediaMetrics` :460 [write-or-literal]
- `src/catalog.js` `createBaseCatalogItem` :41 [write-or-literal]
- `src/catalog.js` `createCounterCatalogItem` :51 [write-or-literal]
- `src/catalog.js` `createFlatPanelCatalogItem` :63 [write-or-literal]
- `src/catalog.js` `createUprightCatalogItem` :80 [write-or-literal]
- `src/catalog.js` `createProfileCatalogItem` :94 [write-or-literal]
- `src/catalog.js` `createBaseWallCatalogItem` :106 [write-or-literal]
- `src/catalog.js` `createSeparatorCatalogItem` :116 [write-or-literal]
- `src/catalog.js` `createShelfCatalogItem` :129 [write-or-literal]
- `src/catalog.js` `createTopLightCatalogItem` :223 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :240 [write-or-literal]
- `src/catalog.js` `createFurnitureCatalogItem` :256 [write-or-literal]
- `src/catalog.js` `getModuleCatalogLabel` :537 [read]
- `src/scene3d.js` (dosya düzeyi) :5 [read]
- `src/scene3d.js` `if` :2084 [write]
- `src/main.js` (dosya düzeyi) :54 [read]
- `src/main.js` `syncFloorTypeSelect` :93 [write]
- `src/moduleContextMenu.js` (dosya düzeyi) :1 [read]
- `src/moduleContextMenu.js` `describeModule` :109 [read]
- `src/selectionFeedback.js` `if` :78 [read]
- `test/baseItemsContract.test.js` (dosya düzeyi) :58 [test]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :35 [test]
- `test/catalogSingleSource.test.js` (dosya düzeyi) :6 [test]
- `test/chairEamesContract.test.js` (dosya düzeyi) :13 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :15 [test]
- `test/connectorBom.test.js` (dosya düzeyi) :25 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :62 [test]
- `test/deskBankoItemsContract.test.js` `if` :95 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :36 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :14 [test]
- `test/floorItemsContract.test.js` (dosya düzeyi) :7 [test]
- `test/floorItemsContract.test.js` `for` :33 [test]
- `test/furnitureItemsContract.test.js` `if` :167 [test]
- `test/glassShelfItemContract.test.js` (dosya düzeyi) :19 [test]
- `test/glassTableContract.test.js` (dosya düzeyi) :13 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :88 [test]
- `test/lightingItemsContract.test.js` (dosya düzeyi) :77 [test]
- `test/panel197ItemContract.test.js` (dosya düzeyi) :22 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :24 [test]
- `test/profile190ItemContract.test.js` (dosya düzeyi) :28 [test]
- `test/profilesItemContract.test.js` (dosya düzeyi) :71 [test]
- `test/separatorPanelsItemContract.test.js` (dosya düzeyi) :35 [test]
- `test/shelfItemsItemContract.test.js` (dosya düzeyi) :21 [test]
- `test/sofaClassicPiecesContract.test.js` (dosya düzeyi) :18 [test]
- `test/straightPanelsItemContract.test.js` (dosya düzeyi) :60 [test]
- … test/e2e ek 6 eşleşme (src listesi tam).

- indeks: 2 / 188
