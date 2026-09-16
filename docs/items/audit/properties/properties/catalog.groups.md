# `catalog.groups`

**Özellik ID:** `catalog.groups`
**İnsan tarafından anlaşılır adı:** Sidebar katalog grubu
**Kategori:** katalog
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `Panel Ek Modül` · `Extra` · `Elektronik & Aydınlatma` · `Panel & Duvar` · `Banko & Baza` · `Raf & Vitrin`

## Ne işe yarar

Katalog descriptor alanı. Kaynak Item + `create*CatalogItem` eşlemesi (profilde width remap). Sidebar/drag bu nesneyi taşır.

## Canonical owner

- katman: katalog descriptor (Item türevi)
- dosya: `src/catalog.js`
- sembol: `MODULE_CATALOG / create*CatalogItem`

## Tanımlandığı yerler

- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]

## Okuyan yerler

- `src/moduleContextMenu.js` (dosya düzeyi) :1 [read]
- `src/moduleDragSidebar.js` (dosya düzeyi) :1 [read]
- `test/catalogSingleSource.test.js` (dosya düzeyi) :8 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :4 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :4 [test]
- `test/plasticTrashBinModule.test.js` (dosya düzeyi) :6 [test]
- `test/plasticTrashBinModule.test.js` `overlaps` :54 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :4 [test]
- `test/uprightFieldPlacement.test.js` (dosya düzeyi) :4 [test]

## Yazan / değiştiren yerler

- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/moduleContextMenu.js` `renderPickerCatalog` :318 [write]
- `src/moduleDragSidebar.js` `createModuleDragSidebar` :394 [write]

## Default değeri

Catalog default: `create*CatalogItem` Item alanından kopya. Profil `widthCm` `getStraightWallNominalWidthForProfileItem` ile remap. Kullanıcı ezemaz.

## Override zinciri

Item kaydı → create*CatalogItem eşlemesi → MODULE_CATALOG. Kullanıcı katalog alanını ezemaz.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **64** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `upright`, `profile`, `coat-rack`, `kettle`, `mini-fridge`, `plastic-trash-bin`, `sofa-set-classic`, `sofa-single-classic`, `sofa-double-classic`, `coffee-table-classic`, `table-chair-set-eames`, `chair`, `table-glass`, `bar-stool`, `indoor-plant-1`, `tv`, `led-floodlight`, `door`, `base`, `counter`, `flat-panel`, `base-wall`, `separator`, `shelf`, `showcase-2`, `showcase-3`
- itemKey: `upright_346_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`, `furniture_sofa_set_classic`, `furniture_sofa_single_classic`, `furniture_sofa_double_classic`, `furniture_coffee_table_classic`, `furniture_table_chair_set_eames`, `chair_eames`, `glass_table`, `furniture_bar_stool_classic`, `EXTRA_INDOOR_PLANT_1`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`, `TV_42`, `TV_55`, `TV_65`, `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`, `led_floodlight`, `door_100`, `BASE_100`, `BASE_150`, `BASE_200`, `desk_banko_100`, `desk_banko_150`, `desk_banko_200`, `desk_banko_100_L`, `desk_banko_150_L`, `desk_banko_200_L`, `wall_50`, `wall_100`, `wall_150`, `wall_200`, `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`, `wall_base_100`, `wall_base_150`, `wall_base_200`, `wall_separator_50`, `wall_separator_100`, `wall_separator_50_sarmasik`, `wall_separator_100_sarmasik`, `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`, `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **64**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

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

- src dosya sayısı (unique): **3**
- src dosyaları: `src/catalog.js`, `src/moduleContextMenu.js`, `src/moduleDragSidebar.js`

- `src/catalog.js` `MODULE_CATALOG_GROUPS` :423 [define]
- `src/moduleContextMenu.js` (dosya düzeyi) :1 [read]
- `src/moduleContextMenu.js` `renderPickerCatalog` :318 [write]
- `src/moduleDragSidebar.js` (dosya düzeyi) :1 [read]
- `src/moduleDragSidebar.js` `createModuleDragSidebar` :394 [write]
- `test/catalogSingleSource.test.js` (dosya düzeyi) :8 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :4 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :4 [test]
- `test/plasticTrashBinModule.test.js` (dosya düzeyi) :6 [test]
- `test/plasticTrashBinModule.test.js` `overlaps` :54 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :4 [test]
- `test/uprightFieldPlacement.test.js` (dosya düzeyi) :4 [test]

- indeks: 49 / 188
