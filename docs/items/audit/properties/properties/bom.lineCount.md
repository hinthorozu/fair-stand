# `bom.lineCount`

**Özellik ID:** `bom.lineCount`
**İnsan tarafından anlaşılır adı:** BOM satır adedi
**Kategori:** bom
**Veri tipi:** number
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `1` · `6` · `8` · `9` · `10` · `5` · `7`

## Ne işe yarar

`resolveItemBom` sonuç/hata sütunu (audit).

## Canonical owner

- katman: BOM/recipe
- dosya: `src/itemBom.js + src/moduleRecipes.js`
- sembol: `resolveItemBom / getExpandedModuleRecipe`

## Tanımlandığı yerler

- consumer yok (bu id ile src/test/e2e satırı bulunamadı veya audit türevi).

## Okuyan yerler

- `src/rawBomDebug.js` (dosya düzeyi) :1 [read]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :4 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :7 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :6 [test]
- `test/profileFieldPlacement.test.js` `for` :33 [test]
- `test/showcaseBodyBoardsItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/showcaseBodyBoardsItemContract.test.js` `for` :43 [test]
- `test/uprightFieldPlacement.test.js` (dosya düzeyi) :6 [test]
- `test/uprightFieldPlacement.test.js` `for` :45 [test]
- `test/wallShowcaseItemContract.test.js` (dosya düzeyi) :7 [test]
- `test/wallShowcaseItemContract.test.js` `for` :44 [test]

## Yazan / değiştiren yerler

- `src/itemBom.js` `resolveItemBom` :61 [write]
- `src/rawBomDebug.js` `renderItemBom` :83 [write]

## Default değeri

Audit/çözümleyici sütunu. Runtime default değeri yok; canlı fonksiyondan türetilir veya tarama sonucudur.

## Override zinciri

Override yok (analiz/audit sütunu).

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **80** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `upright`, `profile`, `panel`, `separator-panel`, `connector`, `door-leaf`, `shelf`, `shelf-accessory`, `showcase-board`, `showcase-accessory`, `counter-top`, `base-top`, `coat-rack`, `kettle`, `mini-fridge`, `plastic-trash-bin`, `door`, `base`, `counter`, `flat-panel`, `base-wall`, `separator`, `showcase-2`, `showcase-3`
- itemKey: `upright_346_5`, `upright_99`, `upright_49_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`, `separator_panel_48_5`, `separator_panel_98`, `connector_start`, `connector_single`, `connector_double`, `connector_corner`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `shelf_leg`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`, `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`, `door_100`, `BASE_100`, `BASE_150`, `BASE_200`, `desk_banko_100`, `desk_banko_150`, `desk_banko_200`, `desk_banko_100_L`, `desk_banko_150_L`, `desk_banko_200_L`, `wall_50`, `wall_100`, `wall_150`, `wall_200`, `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`, `wall_base_100`, `wall_base_150`, `wall_base_200`, `wall_separator_50`, `wall_separator_100`, `wall_separator_50_sarmasik`, `wall_separator_100_sarmasik`, `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`, `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **46**
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

Etkiler: `resolveItemBom` / recipe items / inner-corner variant. Miktar uydurulmaz; recipe satırı kanoniktir.

## Validation

validation yok (tablo/audit).

## Bağımlılıklar

- kök katman: `bom`

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

DERIVED

## CRUD gerekçesi

Bu sütun runtime Item alanı değil; audit/çözümleyici görünümüdür veya başka alandan türetilir. Kullanıcı bu id ile form alanı görmez.

## Kanıt

- src dosya sayısı (unique): **2**
- src dosyaları: `src/itemBom.js`, `src/rawBomDebug.js`

- `src/itemBom.js` `resolveItemBom` :61 [write]
- `src/rawBomDebug.js` (dosya düzeyi) :1 [read]
- `src/rawBomDebug.js` `renderItemBom` :83 [write]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :4 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :7 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :6 [test]
- `test/profileFieldPlacement.test.js` `for` :33 [test]
- `test/showcaseBodyBoardsItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/showcaseBodyBoardsItemContract.test.js` `for` :43 [test]
- `test/uprightFieldPlacement.test.js` (dosya düzeyi) :6 [test]
- `test/uprightFieldPlacement.test.js` `for` :45 [test]
- `test/wallShowcaseItemContract.test.js` (dosya düzeyi) :7 [test]
- `test/wallShowcaseItemContract.test.js` `for` :44 [test]

- indeks: 150 / 188
