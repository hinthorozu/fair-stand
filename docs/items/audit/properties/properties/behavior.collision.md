# `behavior.collision`

**Özellik ID:** `behavior.collision`
**İnsan tarafından anlaşılır adı:** Modül davranışı: collision
**Kategori:** davranis
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** `segment` | `footprint` | `none`

## Ne işe yarar

segment / footprint / none.

## Canonical owner

- katman: type davranış tablosu
- dosya: `src/moduleBehavior.js`
- sembol: `TYPE_BEHAVIORS / getModuleBehavior`

## Tanımlandığı yerler

- `src/moduleBehavior.js` (dosya düzeyi) :19 [write-or-literal]
- `src/moduleBehavior.js` `freeBehavior` :42 [write-or-literal]
- `src/moduleBehavior.js` `overlayBehavior` :65 [write-or-literal]
- `src/moduleBehavior.js` `getModuleCollisionStrategy` :265 [read]

## Okuyan yerler

- `src/moduleBehavior.js` `getModuleCollisionStrategy` :265 [read]
- `src/modulePlacement.js` (dosya düzeyi) :8 [read]
- `src/modulePlacement.js` `placementsOverlap` :536 [read]
- `test/freePropsCollisionNone.test.js` (dosya düzeyi) :6 [test]
- `test/freePropsCollisionNone.test.js` `for` :27 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :49 [test]
- `test/moduleBehaviorContract.test.js` (dosya düzeyi) :32 [test]
- `test/moduleBehaviorPolicy.test.js` (dosya düzeyi) :11 [test]
- `test/moduleBehaviorPolicy.test.js` `for` :76 [test]

## Yazan / değiştiren yerler

- `src/moduleBehavior.js` (dosya düzeyi) :19 [write-or-literal]
- `src/moduleBehavior.js` `freeBehavior` :42 [write-or-literal]
- `src/moduleBehavior.js` `overlayBehavior` :65 [write-or-literal]

## Default değeri

Global: `DEFAULT_BEHAVIOR` = `WALL_BEHAVIOR` (`src/moduleBehavior.js`). Type: `TYPE_BEHAVIORS[type]`. Type kaydı yoksa WALL_BEHAVIOR. Ghost yoksa `DEFAULT_GHOST_BEHAVIOR` (opacity 0.38, renderer module-silhouette). collisionHeight yoksa `full`.

## Override zinciri

DEFAULT_BEHAVIOR (WALL_BEHAVIOR) → TYPE_BEHAVIORS[type] → getModuleBehavior item override (counter L defaultRotation 270; düz banko 100/150/200 rotationStep 45). Persist yok; her çağrıda hesaplanır.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **104** / 104
- seçim kuralı: `listRegisteredItems()` içindeki her kayıt (104). TSV hücresi boş değil.
- type'lar: `upright`, `profile`, `panel`, `separator-panel`, `connector`, `door-leaf`, `shelf`, `shelf-accessory`, `showcase-board`, `showcase-accessory`, `counter-top`, `base-top`, `coat-rack`, `kettle`, `mini-fridge`, `plastic-trash-bin`, `sofa-set-classic`, `sofa-single-classic`, `sofa-double-classic`, `coffee-table-classic`, `table-chair-set-eames`, `chair`, `table-glass`, `bar-stool`, `indoor-plant-1`, `tv`, `led-floodlight`, `illuminated-foam`, `floor`, `door`, `base`, `counter`, `flat-panel`, `base-wall`, `separator`, `showcase-2`, `showcase-3`
- itemKey: `upright_346_5`, `upright_99`, `upright_49_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `connector_start`, `connector_single`, `connector_double`, `connector_corner`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `shelf_leg`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`, `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`, `furniture_sofa_set_classic`, `furniture_sofa_single_classic`, `furniture_sofa_double_classic`, `furniture_coffee_table_classic`, `furniture_table_chair_set_eames`, `chair_eames`, `glass_table`, `furniture_bar_stool_classic`, `EXTRA_INDOOR_PLANT_1`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`, `TV_42`, `TV_55`, `TV_65`, `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`, `led_floodlight`, `illuminated-foam`, `karolaj`, `hali`, `parke-acik`, `parke-sari`, `parke-beton`, `door_100`, `BASE_100`, `BASE_150`, `BASE_200`, `desk_banko_100`, `desk_banko_150`, `desk_banko_200`, `desk_banko_100_L`, `desk_banko_150_L`, `desk_banko_200_L`, `wall_50`, `wall_100`, `wall_150`, `wall_200`, `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`, `wall_base_100`, `wall_base_150`, `wall_base_200`, `wall_separator_50`, `wall_separator_100`, `wall_separator_50_sarmasik`, `wall_separator_100_sarmasik`, `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`, `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **70**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **34**
- tanımlı ama sahneye çıkmayan: `upright_99`, `upright_49_5`, `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `connector_start`, `connector_single`, `connector_double`, `connector_corner`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `shelf_leg`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`
- Leaf type'larda `getModuleBehavior` DEFAULT_BEHAVIOR dönebilir ama `createRenderableModule` dalı yoksa placement çalışmaz.

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Kod tablosu. Persist yok (her load'da type/itemKey ile yeniden çözülür).

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

Etkiler: snap, collision, side insert, short-up joint, L rotasyon, overlay mount. Ayrıntı `src/modulePlacement.js` + `getModuleBehavior`.

## BOM / composition etkisi

yok.

## Validation

Yanlış type → DEFAULT_BEHAVIOR. Enum runtime'da sıkı doğrulanmaz.

## Bağımlılıklar

- kök katman: `behavior`
- `type` (+ counter `shape`/`widthCm`).

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

SYSTEM_INTERNAL

## CRUD gerekçesi

`TYPE_BEHAVIORS` + `getModuleBehavior` kod tablosu. Kullanıcı tabloyu değiştirmez; placement/rotation bu değerlere göre çalışır.

## Kanıt

- src dosya sayısı (unique): **2**
- src dosyaları: `src/moduleBehavior.js`, `src/modulePlacement.js`

- `src/moduleBehavior.js` (dosya düzeyi) :19 [write-or-literal]
- `src/moduleBehavior.js` `freeBehavior` :42 [write-or-literal]
- `src/moduleBehavior.js` `overlayBehavior` :65 [write-or-literal]
- `src/moduleBehavior.js` `getModuleCollisionStrategy` :265 [read]
- `src/modulePlacement.js` (dosya düzeyi) :8 [read]
- `src/modulePlacement.js` `placementsOverlap` :536 [read]
- `test/freePropsCollisionNone.test.js` (dosya düzeyi) :6 [test]
- `test/freePropsCollisionNone.test.js` `for` :27 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :49 [test]
- `test/moduleBehaviorContract.test.js` (dosya düzeyi) :32 [test]
- `test/moduleBehaviorPolicy.test.js` (dosya düzeyi) :11 [test]
- `test/moduleBehaviorPolicy.test.js` `for` :76 [test]

- indeks: 88 / 188
