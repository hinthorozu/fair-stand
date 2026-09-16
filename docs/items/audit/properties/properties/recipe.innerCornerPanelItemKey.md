# `recipe.innerCornerPanelItemKey`

**Özellik ID:** `recipe.innerCornerPanelItemKey`
**İnsan tarafından anlaşılır adı:** İç köşe panel replacement anahtarı
**Kategori:** bom-recipe
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `panel_corner_92` · `panel_corner_42_5` · `panel_corner_142_5` · `panel_corner_192`

## Ne işe yarar

Parent composition recipe üstverisi.

## Canonical owner

- katman: BOM/recipe
- dosya: `src/itemBom.js + src/moduleRecipes.js`
- sembol: `resolveItemBom / getExpandedModuleRecipe`

## Tanımlandığı yerler

- consumer yok (bu id ile src/test/e2e satırı bulunamadı veya audit türevi).

## Okuyan yerler

- `src/moduleRecipes.js` `getRecipeInnerCornerPanelKey` :203 [read]
- `test/cornerPanelsItemContract.test.js` `for` :79 [test]
- `test/panel197ItemContract.test.js` `for` :64 [test]
- `test/panelCorner192ItemContract.test.js` `for` :38 [test]
- `test/showcaseRecipes.test.js` (dosya düzeyi) :26 [test]
- `test/straightPanelsItemContract.test.js` `for` :111 [test]
- `test/wallBaseItemsContract.test.js` (dosya düzeyi) :119 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :97 [test]
- `test/wallShelfItemsContract.test.js` (dosya düzeyi) :123 [test]

## Yazan / değiştiren yerler

- `src/moduleRecipes.js` (dosya düzeyi) :6 [write-or-literal]
- `src/moduleRecipes.js` `resolveRecipeItemsForPanelVariant` :238 [write]

## Default değeri

Audit/çözümleyici sütunu. Runtime default değeri yok; canlı fonksiyondan türetilir veya tarama sonucudur.

## Override zinciri

Bu özellik için ayrı runtime ezme katmanı yok; değer owner katmanındaki tablodan/kayıttan gelir.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **24** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `door`, `flat-panel`, `base-wall`, `shelf`, `showcase-2`, `showcase-3`
- itemKey: `door_100`, `wall_50`, `wall_100`, `wall_150`, `wall_200`, `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`, `wall_base_100`, `wall_base_150`, `wall_base_200`, `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`, `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **24**
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

- src dosya sayısı (unique): **1**
- src dosyaları: `src/moduleRecipes.js`

- `src/moduleRecipes.js` (dosya düzeyi) :6 [write-or-literal]
- `src/moduleRecipes.js` `getRecipeInnerCornerPanelKey` :203 [read]
- `src/moduleRecipes.js` `resolveRecipeItemsForPanelVariant` :238 [write]
- `test/cornerPanelsItemContract.test.js` `for` :79 [test]
- `test/panel197ItemContract.test.js` `for` :64 [test]
- `test/panelCorner192ItemContract.test.js` `for` :38 [test]
- `test/showcaseRecipes.test.js` (dosya düzeyi) :26 [test]
- `test/straightPanelsItemContract.test.js` `for` :111 [test]
- `test/wallBaseItemsContract.test.js` (dosya düzeyi) :119 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :97 [test]
- `test/wallShelfItemsContract.test.js` (dosya düzeyi) :123 [test]

- indeks: 155 / 188
