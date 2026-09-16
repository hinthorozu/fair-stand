# `bom.error`

**Özellik ID:** `bom.error`
**İnsan tarafından anlaşılır adı:** resolveItemBom hata metni
**Kategori:** bom
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `Missing canonical unit for leaf Item: furniture_sofa_set_classic.` · `Missing canonical unit for leaf Item: furniture_sofa_single_classic.` · `Missing canonical unit for leaf Item: furniture_sofa_double_classic.` · `Missing canonical unit for leaf Item: furniture_coffee_table_classic.` · `Missing canonical unit for leaf Item: furniture_table_chair_set_eames.` · `Missing canonical unit for leaf Item: chair_eames.` · `Missing canonical unit for leaf Item: glass_table.` · `Missing canonical unit for leaf Item: furniture_bar_stool_classic.` · `Missing canonical unit for leaf Item: EXTRA_INDOOR_PLANT_1.` · `Missing canonical unit for leaf Item: EXTRA_LONG_PLANTER_100.` · `Missing canonical unit for leaf Item: EXTRA_LONG_PLANTER_150.` · `Missing canonical unit for leaf Item: EXTRA_LONG_PLANTER_200.` (+12)

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

- `src/itemBom.js` `if` :39 [write-or-literal]
- `src/itemBom.js` `resolveItemBom` :61 [write]
- `src/rawBomDebug.js` `renderItemBom` :83 [write]

## Default değeri

Audit/çözümleyici sütunu. Runtime default değeri yok; canlı fonksiyondan türetilir veya tarama sonucudur.

## Override zinciri

Override yok (analiz/audit sütunu).

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **24** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `sofa-set-classic`, `sofa-single-classic`, `sofa-double-classic`, `coffee-table-classic`, `table-chair-set-eames`, `chair`, `table-glass`, `bar-stool`, `indoor-plant-1`, `tv`, `led-floodlight`, `illuminated-foam`, `floor`
- itemKey: `furniture_sofa_set_classic`, `furniture_sofa_single_classic`, `furniture_sofa_double_classic`, `furniture_coffee_table_classic`, `furniture_table_chair_set_eames`, `chair_eames`, `glass_table`, `furniture_bar_stool_classic`, `EXTRA_INDOOR_PLANT_1`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`, `TV_42`, `TV_55`, `TV_65`, `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`, `led_floodlight`, `illuminated-foam`, `karolaj`, `hali`, `parke-acik`, `parke-sari`, `parke-beton`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **24**
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

- `src/itemBom.js` `if` :39 [write-or-literal]
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

- indeks: 149 / 188
