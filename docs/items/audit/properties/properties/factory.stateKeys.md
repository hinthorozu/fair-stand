# `factory.stateKeys`

**Özellik ID:** `factory.stateKeys`
**İnsan tarafından anlaşılır adı:** Factory çıktı alan listesi
**Kategori:** audit-factory
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `itemKey, type, widthCm, depthCm, heightCm` · `itemKey, type, widthCm, depthCm, heightCm, modelFile, modelRotationYDeg, visualRotationYDeg, preserveModelScale` · `itemKey, type, widthCm, depthCm, heightCm, surface` · `itemKey, type, widthCm, depthCm, heightCm, surface, visualRotationYDeg` · `itemKey, type, widthCm, depthCm, heightCm, surface, chairCount` · `itemKey, type, widthCm, depthCm, heightCm, modelFile, modelRotationYDeg, preserveModelScale` · `itemKey, type, widthCm, depthCm, heightCm, modelFile, modelRotationYDeg, preserveModelScale, surface` · `itemKey, type, widthCm, depthCm, heightCm, sizeInch, screenWidthCm, screenHeightCm, videoWallRows, videoWallCols, panelScreenWidthCm, panelScreenHeightCm` · `itemKey, type, imageAssetId, widthCm, heightCm, depthCm, wallGapCm, haloColor` · `itemKey, type, widthCm, strips, surface` · `itemKey, type, widthCm, depthCm, heightCm, faces` · `itemKey, type, shape, widthCm, depthCm, heightCm, faces` (+6)

## Ne işe yarar

Factory audit sütunu.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/designState.js` `createFlatPanelModuleState` :94 [read]
- `src/designState.js` `createLedFloodlightModuleState` :636 [write]
- `src/designState.js` `createModuleStateFromDescriptor` :670 [read]
- `src/designState.js` `if` :935 [read]

## Okuyan yerler

- `src/designState.js` `createFlatPanelModuleState` :94 [read]
- `src/designState.js` `createModuleStateFromDescriptor` :670 [read]
- `src/designState.js` `if` :935 [read]
- `src/main.js` (dosya düzeyi) :15 [read]
- `src/main.js` `createCatalogModuleState` :529 [read]
- `test/baseItemsContract.test.js` (dosya düzeyi) :7 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :5 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :6 [test]
- `test/designState.test.js` (dosya düzeyi) :6 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :6 [test]
- `test/deskBankoItemsContract.test.js` `if` :102 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :6 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :13 [test]
- `test/furnitureItemsContract.test.js` `if` :173 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :6 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :5 [test]
- `test/lightingItemsContract.test.js` (dosya düzeyi) :7 [test]
- `test/moduleStateConstructionRegistry.test.js` (dosya düzeyi) :6 [test]
- `test/moduleStateConstructionRegistry.test.js` `for` :13 [test]
- `test/plasticTrashBinModule.test.js` (dosya düzeyi) :9 [test]
- `test/plasticTrashBinModule.test.js` `overlaps` :71 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :5 [test]
- `test/profileFieldPlacement.test.js` `for` :47 [test]
- `test/systemImpactAnalysis.test.js` (dosya düzeyi) :79 [test]
- `test/uprightFieldPlacement.test.js` (dosya düzeyi) :5 [test]
- `test/uprightFieldPlacement.test.js` `for` :55 [test]
- `test/wallBaseItemsContract.test.js` (dosya düzeyi) :6 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :5 [test]
- `test/wallMediaItemsContract.test.js` (dosya düzeyi) :5 [test]
- `test/wallMediaItemsContract.test.js` `for` :80 [test]
- … test/e2e ek 2 eşleşme (src listesi tam).

## Yazan / değiştiren yerler

- `src/designState.js` `createLedFloodlightModuleState` :636 [write]
- `src/main.js` `createAutomaticDepotStates` :1006 [write]
- `src/main.js` `if` :1080 [write]

## Default değeri

Audit/çözümleyici sütunu. Runtime default değeri yok; canlı fonksiyondan türetilir veya tarama sonucudur.

## Override zinciri

Override yok (analiz/audit sütunu).

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **65** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `upright`, `profile`, `coat-rack`, `kettle`, `mini-fridge`, `plastic-trash-bin`, `sofa-set-classic`, `sofa-single-classic`, `sofa-double-classic`, `coffee-table-classic`, `table-chair-set-eames`, `chair`, `table-glass`, `bar-stool`, `indoor-plant-1`, `tv`, `led-floodlight`, `illuminated-foam`, `door`, `base`, `counter`, `flat-panel`, `base-wall`, `separator`, `shelf`, `showcase-2`, `showcase-3`
- itemKey: `upright_346_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`, `furniture_sofa_set_classic`, `furniture_sofa_single_classic`, `furniture_sofa_double_classic`, `furniture_coffee_table_classic`, `furniture_table_chair_set_eames`, `chair_eames`, `glass_table`, `furniture_bar_stool_classic`, `EXTRA_INDOOR_PLANT_1`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`, `TV_42`, `TV_55`, `TV_65`, `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`, `led_floodlight`, `illuminated-foam`, `door_100`, `BASE_100`, `BASE_150`, `BASE_200`, `desk_banko_100`, `desk_banko_150`, `desk_banko_200`, `desk_banko_100_L`, `desk_banko_150_L`, `desk_banko_200_L`, `wall_50`, `wall_100`, `wall_150`, `wall_200`, `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`, `wall_base_100`, `wall_base_150`, `wall_base_200`, `wall_separator_50`, `wall_separator_100`, `wall_separator_50_sarmasik`, `wall_separator_100_sarmasik`, `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`, `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **65**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

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

validation yok (tablo/audit).

## Bağımlılıklar

- kök katman: `factory`

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

DERIVED

## CRUD gerekçesi

Bu sütun runtime Item alanı değil; audit/çözümleyici görünümüdür veya başka alandan türetilir. Kullanıcı bu id ile form alanı görmez.

## Kanıt

- src dosya sayısı (unique): **2**
- src dosyaları: `src/designState.js`, `src/main.js`

- `src/designState.js` `createFlatPanelModuleState` :94 [read]
- `src/designState.js` `createLedFloodlightModuleState` :636 [write]
- `src/designState.js` `createModuleStateFromDescriptor` :670 [read]
- `src/designState.js` `if` :935 [read]
- `src/main.js` (dosya düzeyi) :15 [read]
- `src/main.js` `createCatalogModuleState` :529 [read]
- `src/main.js` `createAutomaticDepotStates` :1006 [write]
- `src/main.js` `if` :1080 [write]
- `test/baseItemsContract.test.js` (dosya düzeyi) :7 [test]
- `test/coatRackModule.test.js` (dosya düzeyi) :5 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :6 [test]
- `test/designState.test.js` (dosya düzeyi) :6 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :6 [test]
- `test/deskBankoItemsContract.test.js` `if` :102 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :6 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :13 [test]
- `test/furnitureItemsContract.test.js` `if` :173 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :6 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :5 [test]
- `test/lightingItemsContract.test.js` (dosya düzeyi) :7 [test]
- `test/moduleStateConstructionRegistry.test.js` (dosya düzeyi) :6 [test]
- `test/moduleStateConstructionRegistry.test.js` `for` :13 [test]
- `test/plasticTrashBinModule.test.js` (dosya düzeyi) :9 [test]
- `test/plasticTrashBinModule.test.js` `overlaps` :71 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :5 [test]
- `test/profileFieldPlacement.test.js` `for` :47 [test]
- `test/systemImpactAnalysis.test.js` (dosya düzeyi) :79 [test]
- `test/uprightFieldPlacement.test.js` (dosya düzeyi) :5 [test]
- `test/uprightFieldPlacement.test.js` `for` :55 [test]
- `test/wallBaseItemsContract.test.js` (dosya düzeyi) :6 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :5 [test]
- `test/wallMediaItemsContract.test.js` (dosya düzeyi) :5 [test]
- `test/wallMediaItemsContract.test.js` `for` :80 [test]
- … test/e2e ek 2 eşleşme (src listesi tam).

- indeks: 116 / 188
