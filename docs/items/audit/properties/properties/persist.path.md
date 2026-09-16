# `persist.path`

**Özellik ID:** `persist.path`
**İnsan tarafından anlaşılır adı:** Bu item için persist yolu
**Kategori:** persistence
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `project.modules[] factory state + placement` · `doğrudan persist yok (parent BOM/recipe içinde)` · `stand.itemKey (eski floorType silinir)`

## Ne işe yarar

Katalog/foam: `modules[]`. Zemin: `stand.itemKey` (+ `floorColor`). Leaf: doğrudan yok.

## Canonical owner

- katman: persistence
- dosya: `src/projectStore.js`
- sembol: `saveProject`

## Tanımlandığı yerler

- consumer yok (bu id ile src/test/e2e satırı bulunamadı veya audit türevi).

## Okuyan yerler

- `src/main.js` `assignStandFloorItem` :521 [read]
- `src/main.js` `buildProjectSnapshot` :1316 [read]
- `test/counterModule.test.js` `for` :56 [test]
- `test/depotFreeDragSnap.test.js` `for` :14 [test]
- `test/freePropsCollisionNone.test.js` `for` :57 [test]
- `test/imageAssetDeletion.test.js` (dosya düzeyi) :8 [test]
- `test/lCounterPlacement.test.js` (dosya düzeyi) :51 [test]
- `test/modulePlacement.test.js` (dosya düzeyi) :169 [test]
- `test/modulePlacement.test.js` `if` :758 [test]
- `test/profileFieldPlacement.test.js` `for` :85 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :124 [test]
- `test/projectImportValidation.test.js` (dosya düzeyi) :38 [test]
- `test/rightWallOrientation.test.js` (dosya düzeyi) :23 [test]
- `test/uprightFieldPlacement.test.js` `for` :88 [test]
- `test/uprightFieldPlacement.test.js` (dosya düzeyi) :124 [test]
- `test/wallReflow.test.js` `module` :82 [test]
- `test/wallReflow.test.js` (dosya düzeyi) :137 [test]
- `e2e/f023-atomic-project-delete.spec.mjs` `seedProjectsAndAssets` :24 [test]
- `e2e/project-import-validation.spec.mjs` (dosya düzeyi) :12 [test]

## Yazan / değiştiren yerler

- `src/scene3d.js` `rotateSelectedModule` :2268 [write-or-literal]
- `src/scene3d.js` `if` :2585 [write-or-literal]
- `src/main.js` `if` :418 [write-or-literal]
- `src/main.js` `for` :682 [write-or-literal]
- `src/main.js` `if` :1055 [write]
- `src/main.js` `buildProjectSnapshot` :1323 [write-or-literal]
- `src/main.js` `getProjectStateSignature` :1328 [write]
- `src/main.js` `getProjectStateSignature` :1332 [write-or-literal]
- `src/main.js` `persistActiveProject` :1372 [write]
- `src/automaticWall.js` `if` :71 [write-or-literal]
- `src/moduleMove.js` `if` :297 [write-or-literal]
- `src/modulePlacement.js` `if` :1583 [write-or-literal]

## Default değeri

Owner katmanındaki tanım; ayrı default sabiti bu id için yok.

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

## Kullanıcı değiştirebilir mi

dolaylı (proje kaydet)

## Kullanıcı nereden değiştirir

Proje kaydet / autosave. Alan seçimi yok.

## Persistence

Persistence mekanizmasının kendisi. IndexedDB `PROJECT_STORE_NAME`.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `persist`

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

SYSTEM_INTERNAL

## CRUD gerekçesi

`saveProject` / snapshot altyapısı. Kullanıcı alan seçmez; proje nesnesi put edilir.

## Kanıt

- src dosya sayısı (unique): **5**
- src dosyaları: `src/scene3d.js`, `src/main.js`, `src/automaticWall.js`, `src/moduleMove.js`, `src/modulePlacement.js`

- `src/scene3d.js` `rotateSelectedModule` :2268 [write-or-literal]
- `src/scene3d.js` `if` :2585 [write-or-literal]
- `src/main.js` `if` :418 [write-or-literal]
- `src/main.js` `assignStandFloorItem` :521 [read]
- `src/main.js` `for` :682 [write-or-literal]
- `src/main.js` `if` :1055 [write]
- `src/main.js` `buildProjectSnapshot` :1316 [read]
- `src/main.js` `buildProjectSnapshot` :1323 [write-or-literal]
- `src/main.js` `getProjectStateSignature` :1328 [write]
- `src/main.js` `getProjectStateSignature` :1332 [write-or-literal]
- `src/main.js` `persistActiveProject` :1372 [write]
- `src/automaticWall.js` `if` :71 [write-or-literal]
- `src/moduleMove.js` `if` :297 [write-or-literal]
- `src/modulePlacement.js` `if` :1583 [write-or-literal]
- `test/counterModule.test.js` `for` :56 [test]
- `test/depotFreeDragSnap.test.js` `for` :14 [test]
- `test/freePropsCollisionNone.test.js` `for` :57 [test]
- `test/imageAssetDeletion.test.js` (dosya düzeyi) :8 [test]
- `test/lCounterPlacement.test.js` (dosya düzeyi) :51 [test]
- `test/modulePlacement.test.js` (dosya düzeyi) :169 [test]
- `test/modulePlacement.test.js` `if` :758 [test]
- `test/profileFieldPlacement.test.js` `for` :85 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :124 [test]
- `test/projectImportValidation.test.js` (dosya düzeyi) :38 [test]
- `test/rightWallOrientation.test.js` (dosya düzeyi) :23 [test]
- `test/uprightFieldPlacement.test.js` `for` :88 [test]
- `test/uprightFieldPlacement.test.js` (dosya düzeyi) :124 [test]
- `test/wallReflow.test.js` `module` :82 [test]
- `test/wallReflow.test.js` (dosya düzeyi) :137 [test]
- `e2e/f023-atomic-project-delete.spec.mjs` `seedProjectsAndAssets` :24 [test]
- `e2e/project-import-validation.spec.mjs` (dosya düzeyi) :12 [test]

- **Hardcoded / sapma:** Alan whitelist yok. Import yalnız `validateImportedModuleState` type+id ve `validateImportedStandState` zemin itemKey kontrol eder (`src/projectImportValidation.js`).

- indeks: 182 / 188

### İkinci tur ek kanıt

- `src/items.js` satır 286 yorum: zemin persist alanı `stand.itemKey` (eski `floorType`). Runtime yazma bu dosyada yok; `assignStandFloorItem` / `buildProjectSnapshot` (`src/main.js`).
