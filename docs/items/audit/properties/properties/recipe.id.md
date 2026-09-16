# `recipe.id`

**Özellik ID:** `recipe.id`
**İnsan tarafından anlaşılır adı:** recipeId
**Kategori:** bom-recipe
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `door-100` · `base-100` · `base-150` · `base-200` · `counter-100` · `counter-150` · `counter-200` · `counter-l-100` · `counter-l-150` · `counter-l-200` · `wall-straight-50` · `wall-straight-100` (+23)

## Ne işe yarar

Parent composition recipe üstverisi.

## Canonical owner

- katman: BOM/recipe
- dosya: `src/itemBom.js + src/moduleRecipes.js`
- sembol: `resolveItemBom / getExpandedModuleRecipe`

## Tanımlandığı yerler

- consumer yok (bu id ile src/test/e2e satırı bulunamadı veya audit türevi).

## Okuyan yerler

- `src/itemBom.js` `if` :51 [read]
- `src/moduleRecipes.js` `for` :213 [read]
- `src/moduleRecipes.js` `if` :220 [read]
- `test/baseTopsItemContract.test.js` `for` :53 [test]
- `test/cornerPanelsItemContract.test.js` `for` :79 [test]
- `test/counterTopsItemContract.test.js` `for` :44 [test]
- `test/lCounter150Contract.test.js` (dosya düzeyi) :36 [test]
- `test/lCounter200Contract.test.js` (dosya düzeyi) :36 [test]
- `test/moduleRecipes.test.js` `if` :138 [test]
- `test/panel197ItemContract.test.js` `for` :37 [test]
- `test/panelCorner192ItemContract.test.js` `for` :38 [test]
- `test/profile190ItemContract.test.js` `for` :40 [test]
- `test/profilesItemContract.test.js` `for` :87 [test]
- `test/rawBomSelectionParser.test.js` `for` :28 [test]
- `test/separatorPanelsItemContract.test.js` `for` :52 [test]
- `test/shelfItemsItemContract.test.js` `for` :42 [test]
- `test/shelfLegItemContract.test.js` `for` :25 [test]
- `test/straightPanelsItemContract.test.js` `for` :77 [test]

## Yazan / değiştiren yerler

- `src/moduleRecipes.js` (dosya düzeyi) :4 [write-or-literal]
- `src/moduleRecipes.js` `applyVariantItemReplacements` :206 [write]

## Default değeri

Audit/çözümleyici sütunu. Runtime default değeri yok; canlı fonksiyondan türetilir veya tarama sonucudur.

## Override zinciri

Bu özellik için ayrı runtime ezme katmanı yok; değer owner katmanındaki tablodan/kayıttan gelir.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **37** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `door`, `base`, `counter`, `flat-panel`, `base-wall`, `separator`, `shelf`, `showcase-2`, `showcase-3`
- itemKey: `door_100`, `BASE_100`, `BASE_150`, `BASE_200`, `desk_banko_100`, `desk_banko_150`, `desk_banko_200`, `desk_banko_100_L`, `desk_banko_150_L`, `desk_banko_200_L`, `wall_50`, `wall_100`, `wall_150`, `wall_200`, `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`, `wall_base_100`, `wall_base_150`, `wall_base_200`, `wall_separator_50`, `wall_separator_100`, `wall_separator_50_sarmasik`, `wall_separator_100_sarmasik`, `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`, `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **37**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Kod recipe tablosu. Persist yok.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

Etkiler: `resolveItemBom` / recipe items / inner-corner variant. Miktar uydurulmaz; recipe satırı kanoniktir.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `recipe`

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

DERIVED

## CRUD gerekçesi

Bu sütun runtime Item alanı değil; audit/çözümleyici görünümüdür veya başka alandan türetilir. Kullanıcı bu id ile form alanı görmez.

## Kanıt

- src dosya sayısı (unique): **2**
- src dosyaları: `src/itemBom.js`, `src/moduleRecipes.js`

- `src/itemBom.js` `if` :51 [read]
- `src/moduleRecipes.js` (dosya düzeyi) :4 [write-or-literal]
- `src/moduleRecipes.js` `applyVariantItemReplacements` :206 [write]
- `src/moduleRecipes.js` `for` :213 [read]
- `src/moduleRecipes.js` `if` :220 [read]
- `test/baseTopsItemContract.test.js` `for` :53 [test]
- `test/cornerPanelsItemContract.test.js` `for` :79 [test]
- `test/counterTopsItemContract.test.js` `for` :44 [test]
- `test/lCounter150Contract.test.js` (dosya düzeyi) :36 [test]
- `test/lCounter200Contract.test.js` (dosya düzeyi) :36 [test]
- `test/moduleRecipes.test.js` `if` :138 [test]
- `test/panel197ItemContract.test.js` `for` :37 [test]
- `test/panelCorner192ItemContract.test.js` `for` :38 [test]
- `test/profile190ItemContract.test.js` `for` :40 [test]
- `test/profilesItemContract.test.js` `for` :87 [test]
- `test/rawBomSelectionParser.test.js` `for` :28 [test]
- `test/separatorPanelsItemContract.test.js` `for` :52 [test]
- `test/shelfItemsItemContract.test.js` `for` :42 [test]
- `test/shelfLegItemContract.test.js` `for` :25 [test]
- `test/straightPanelsItemContract.test.js` `for` :77 [test]

- **Hardcoded / sapma:** `connector_double` varsayılan recipe parent sayısı 0 (önceki audit / recipe tablosu).

- indeks: 152 / 188
