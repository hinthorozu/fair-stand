# `capabilities.image`

**Özellik ID:** `capabilities.image`
**İnsan tarafından anlaşılır adı:** Item yüzey görsel capability bayrağı
**Kategori:** yetenek
**Veri tipi:** boolean
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `false` · `true`

## Ne işe yarar

`getItemSurfaceCapabilities` bayrağı.

## Canonical owner

- katman: item yüzey capability
- dosya: `src/itemCapabilities.js`
- sembol: `getItemSurfaceCapabilities`

## Tanımlandığı yerler

- `src/designState.js` (dosya düzeyi) :15 [read]
- `src/designState.js` `createEditableItemSurfaceState` :55 [write]
- `src/itemCapabilities.js` (dosya düzeyi) :3 [define]
- `src/itemCapabilities.js` `getItemSurfaceCapabilities` :21 [read]

## Okuyan yerler

- `src/designState.js` (dosya düzeyi) :15 [read]
- `src/scene3d.js` (dosya düzeyi) :7 [read]
- `src/scene3d.js` `loadSingleImageOnSurface` :3806 [read]
- `src/scene3d.js` `loadGroupedImageOnSurface` :3844 [read]
- `src/scene3d.js` `loadImageOnSurface` :3896 [read]
- `src/scene3d.js` `applyStoredImage` :3910 [read]
- `src/scene3d.js` `applyImageAsset` :3931 [read]
- `src/scene3d.js` `applyHorizontalImageAsset` :3946 [read]
- `src/scene3d.js` `if` :4019 [read]
- `src/scene3d.js` `clearImage` :4090 [read]
- `src/scene3d.js` `addFace` :6853 [read]
- `src/itemCapabilities.js` `getItemSurfaceCapabilities` :21 [read]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/showcaseBodyBoardsItemContract.test.js` (dosya düzeyi) :6 [test]
- `test/showcaseBodyBoardsItemContract.test.js` `for` :55 [test]
- `test/showcaseBodyColorRegression.test.js` `for` :57 [test]

## Yazan / değiştiren yerler

- `src/designState.js` `createEditableItemSurfaceState` :55 [write]
- `src/scene3d.js` `createIlluminatedFoamModule` :4734 [write]
- `src/scene3d.js` `blackMaterial` :4874 [write]
- `src/scene3d.js` `createMiniFridgeModule` :5025 [write-or-literal]
- `src/scene3d.js` `if` :5109 [write-or-literal]
- `src/scene3d.js` `createCoatRackModule` :5254 [write-or-literal]
- `src/scene3d.js` `createUprightModule` :5331 [write-or-literal]
- `src/scene3d.js` `createProfileModule` :5381 [write-or-literal]
- `src/scene3d.js` `createKettleModule` :5419 [write-or-literal]
- `src/scene3d.js` `for` :5652 [write-or-literal]
- `src/scene3d.js` `createBarStoolModule` :5699 [write-or-literal]
- `src/scene3d.js` `createEamesChairModule` :5779 [write-or-literal]
- `src/scene3d.js` `createGlassTableModule` :5892 [write-or-literal]
- `src/scene3d.js` `createBeigeSofaFurnitureProxy` :6248 [write-or-literal]
- `src/scene3d.js` `addPanelFace` :6572 [write-or-literal]
- `src/scene3d.js` `addFace` :6745 [write-or-literal]
- `src/scene3d.js` `if` :7177 [write]
- `src/itemCapabilities.js` (dosya düzeyi) :3 [define]

## Default değeri

Type default: `ITEM_SURFACE_CAPABILITIES_BY_TYPE` yalnız `door-leaf` (color/image true, glass/lightbox/mesh false). Diğer type: `NO_SURFACE_CAPABILITIES` (hepsi false). Item-level override yok.

## Override zinciri

Bu özellik için ayrı runtime ezme katmanı yok; değer owner katmanındaki tablodan/kayıttan gelir.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **104** / 104
- seçim kuralı: `listRegisteredItems()` içindeki her kayıt (104). TSV hücresi boş değil.
- type'lar: `upright`, `profile`, `panel`, `separator-panel`, `connector`, `door-leaf`, `shelf`, `shelf-accessory`, `showcase-board`, `showcase-accessory`, `counter-top`, `base-top`, `coat-rack`, `kettle`, `mini-fridge`, `plastic-trash-bin`, `sofa-set-classic`, `sofa-single-classic`, `sofa-double-classic`, `coffee-table-classic`, `table-chair-set-eames`, `chair`, `table-glass`, `bar-stool`, `indoor-plant-1`, `tv`, `led-floodlight`, `illuminated-foam`, `floor`, `door`, `base`, `counter`, `flat-panel`, `base-wall`, `separator`, `showcase-2`, `showcase-3`
- itemKey: `upright_346_5`, `upright_99`, `upright_49_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `connector_start`, `connector_single`, `connector_double`, `connector_corner`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `shelf_leg`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`, `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`, `furniture_sofa_set_classic`, `furniture_sofa_single_classic`, `furniture_sofa_double_classic`, `furniture_coffee_table_classic`, `furniture_table_chair_set_eames`, `chair_eames`, `glass_table`, `furniture_bar_stool_classic`, `EXTRA_INDOOR_PLANT_1`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`, `TV_42`, `TV_55`, `TV_65`, `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`, `led_floodlight`, `illuminated-foam`, `karolaj`, `hali`, `parke-acik`, `parke-sari`, `parke-beton`, `door_100`, `BASE_100`, `BASE_150`, `BASE_200`, `desk_banko_100`, `desk_banko_150`, `desk_banko_200`, `desk_banko_100_L`, `desk_banko_150_L`, `desk_banko_200_L`, `wall_50`, `wall_100`, `wall_150`, `wall_200`, `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`, `wall_base_100`, `wall_base_150`, `wall_base_200`, `wall_separator_50`, `wall_separator_100`, `wall_separator_50_sarmasik`, `wall_separator_100_sarmasik`, `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`, `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **70**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **34**
- tanımlı ama sahneye çıkmayan: `upright_99`, `upright_49_5`, `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `connector_start`, `connector_single`, `connector_double`, `connector_corner`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `shelf_leg`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`
- Runtime true yalnız `type === 'door-leaf'` (`door_leaf_100`). Panel cam/görsel bu bayraktan gitmez.

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

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `capabilities`

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

SYSTEM_INTERNAL

## CRUD gerekçesi

`itemCapabilities.js` type tablosu. Bugün yalnız `door-leaf` color/image true. Cam/kumaş bu tabloda değil (`selectionMode==='panel'`).

## Kanıt

- src dosya sayısı (unique): **3**
- src dosyaları: `src/designState.js`, `src/scene3d.js`, `src/itemCapabilities.js`

- `src/designState.js` (dosya düzeyi) :15 [read]
- `src/designState.js` `createEditableItemSurfaceState` :55 [write]
- `src/scene3d.js` (dosya düzeyi) :7 [read]
- `src/scene3d.js` `loadSingleImageOnSurface` :3806 [read]
- `src/scene3d.js` `loadGroupedImageOnSurface` :3844 [read]
- `src/scene3d.js` `loadImageOnSurface` :3896 [read]
- `src/scene3d.js` `applyStoredImage` :3910 [read]
- `src/scene3d.js` `applyImageAsset` :3931 [read]
- `src/scene3d.js` `applyHorizontalImageAsset` :3946 [read]
- `src/scene3d.js` `if` :4019 [read]
- `src/scene3d.js` `clearImage` :4090 [read]
- `src/scene3d.js` `createIlluminatedFoamModule` :4734 [write]
- `src/scene3d.js` `blackMaterial` :4874 [write]
- `src/scene3d.js` `createMiniFridgeModule` :5025 [write-or-literal]
- `src/scene3d.js` `if` :5109 [write-or-literal]
- `src/scene3d.js` `createCoatRackModule` :5254 [write-or-literal]
- `src/scene3d.js` `createUprightModule` :5331 [write-or-literal]
- `src/scene3d.js` `createProfileModule` :5381 [write-or-literal]
- `src/scene3d.js` `createKettleModule` :5419 [write-or-literal]
- `src/scene3d.js` `for` :5652 [write-or-literal]
- `src/scene3d.js` `createBarStoolModule` :5699 [write-or-literal]
- `src/scene3d.js` `createEamesChairModule` :5779 [write-or-literal]
- `src/scene3d.js` `createGlassTableModule` :5892 [write-or-literal]
- `src/scene3d.js` `createBeigeSofaFurnitureProxy` :6248 [write-or-literal]
- `src/scene3d.js` `addPanelFace` :6572 [write-or-literal]
- `src/scene3d.js` `addFace` :6745 [write-or-literal]
- `src/scene3d.js` `addFace` :6853 [read]
- `src/scene3d.js` `if` :7177 [write]
- `src/itemCapabilities.js` (dosya düzeyi) :3 [define]
- `src/itemCapabilities.js` `getItemSurfaceCapabilities` :21 [read]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/showcaseBodyBoardsItemContract.test.js` (dosya düzeyi) :6 [test]
- `test/showcaseBodyBoardsItemContract.test.js` `for` :55 [test]
- `test/showcaseBodyColorRegression.test.js` `for` :57 [test]

- indeks: 109 / 188
