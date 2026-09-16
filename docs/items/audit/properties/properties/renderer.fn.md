# `renderer.fn`

**Özellik ID:** `renderer.fn`
**İnsan tarafından anlaşılır adı:** scene3d createRenderableModule dalı
**Kategori:** renderer
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `createUprightModule` · `createProfileModule` · `createShelfModule` · `createCoatRackModule` · `createKettleModule` · `createMiniFridgeModule` · `createIndoorPlantModule (type dalı plastic-trash-bin)` · `createBeigeSofaSetModule` · `createSofaSingleClassicModule` · `createSofaDoubleClassicModule` · `createCoffeeTableClassicModule` · `createEamesTableChairSetModule` (+14)

## Ne işe yarar

Audit: `createRenderableModule` type dalı. plastic-trash-bin → createIndoorPlantModule.

## Canonical owner

- katman: renderer
- dosya: `src/scene3d.js`
- sembol: `createRenderableModule`

## Tanımlandığı yerler

- consumer yok (bu id ile src/test/e2e satırı bulunamadı veya audit türevi).

## Okuyan yerler

- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :17 [test]

## Yazan / değiştiren yerler

- `src/scene3d.js` `createRenderableModule` :1452 [write]
- `src/scene3d.js` `buildWall` :1546 [write]
- `src/scene3d.js` `if` :1999 [write]

## Default değeri

Audit/çözümleyici sütunu. Runtime default değeri yok; canlı fonksiyondan türetilir veya tarama sonucudur.

## Override zinciri

Bu özellik için ayrı runtime ezme katmanı yok; değer owner katmanındaki tablodan/kayıttan gelir.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **70** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `upright`, `profile`, `shelf`, `coat-rack`, `kettle`, `mini-fridge`, `plastic-trash-bin`, `sofa-set-classic`, `sofa-single-classic`, `sofa-double-classic`, `coffee-table-classic`, `table-chair-set-eames`, `chair`, `table-glass`, `bar-stool`, `indoor-plant-1`, `tv`, `led-floodlight`, `illuminated-foam`, `door`, `base`, `counter`, `flat-panel`, `base-wall`, `separator`, `showcase-2`, `showcase-3`
- itemKey: `upright_346_5`, `upright_99`, `upright_49_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `shelf_100`, `shelf_150`, `shelf_200`, `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`, `furniture_sofa_set_classic`, `furniture_sofa_single_classic`, `furniture_sofa_double_classic`, `furniture_coffee_table_classic`, `furniture_table_chair_set_eames`, `chair_eames`, `glass_table`, `furniture_bar_stool_classic`, `EXTRA_INDOOR_PLANT_1`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`, `TV_42`, `TV_55`, `TV_65`, `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`, `led_floodlight`, `illuminated-foam`, `door_100`, `BASE_100`, `BASE_150`, `BASE_200`, `desk_banko_100`, `desk_banko_150`, `desk_banko_200`, `desk_banko_100_L`, `desk_banko_150_L`, `desk_banko_200_L`, `wall_50`, `wall_100`, `wall_150`, `wall_200`, `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`, `wall_base_100`, `wall_base_150`, `wall_base_200`, `wall_separator_50`, `wall_separator_100`, `wall_separator_50_sarmasik`, `wall_separator_100_sarmasik`, `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`, `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **65**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **5**
- tanımlı ama sahneye çıkmayan: `upright_99`, `upright_49_5`, `shelf_100`, `shelf_150`, `shelf_200`

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

- kök katman: `renderer`

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

DERIVED

## CRUD gerekçesi

Bu sütun runtime Item alanı değil; audit/çözümleyici görünümüdür veya başka alandan türetilir. Kullanıcı bu id ile form alanı görmez.

## Kanıt

- src dosya sayısı (unique): **1**
- src dosyaları: `src/scene3d.js`

- `src/scene3d.js` `createRenderableModule` :1452 [write]
- `src/scene3d.js` `buildWall` :1546 [write]
- `src/scene3d.js` `if` :1999 [write]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :17 [test]

- **Hardcoded / sapma:** Hardcoded: `createRenderableModule` `plastic-trash-bin` dalını `createIndoorPlantModule` ile paylaşır (`src/scene3d.js`).

- indeks: 167 / 188
