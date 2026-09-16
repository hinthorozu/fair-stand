# `parents.innerCorner`

**Özellik ID:** `parents.innerCorner`
**İnsan tarafından anlaşılır adı:** innerCornerPanelItemKey olarak kullanım
**Kategori:** ters-indeks
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `wall_50 (wall-straight-50); wall_50_short_up_2 (wall-short-up-2-50); wall_50_short_up_1 (wall-short-up-1-50)` · `door_100 (door-100); wall_100 (wall-straight-100); wall_100_short_up_2 (wall-short-up-2-100); wall_100_short_up_1 (wall-short-up-1-100); wall_base_100 (base-wall-100); wall_shelf_2_100 (shelf-wall-100-2); wall_shelf_3_100 (shelf-wall-100-3); wall_showcase_100_2 (showcase-2-100); wall_showcase_100_3 (showcase-3-100)` · `wall_150 (wall-straight-150); wall_150_short_up_2 (wall-short-up-2-150); wall_150_short_up_1 (wall-short-up-1-150); wall_base_150 (base-wall-150); wall_shelf_2_150 (shelf-wall-150-2); wall_shelf_3_150 (shelf-wall-150-3)` · `wall_200 (wall-straight-200); wall_200_short_up_2 (wall-short-up-2-200); wall_200_short_up_1 (wall-short-up-1-200); wall_base_200 (base-wall-200); wall_shelf_2_200 (shelf-wall-200-2); wall_shelf_3_200 (shelf-wall-200-3)`

## Ne işe yarar

Ters indeks: bu itemKey hangi parent recipe/küme/body içinde child.

## Canonical owner

- katman: recipe variant
- dosya: `src/moduleRecipes.js`
- sembol: `variants`

## Tanımlandığı yerler

- consumer yok (bu id ile src/test/e2e satırı bulunamadı veya audit türevi).

## Okuyan yerler

- `src/moduleRecipes.js` `getRecipeInnerCornerPanelKey` :202 [read]
- `test/baseWallRecipes.test.js` (dosya düzeyi) :3 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :8 [test]
- `test/cornerPanelsItemContract.test.js` `for` :79 [test]
- `test/moduleRecipes.test.js` (dosya düzeyi) :9 [test]
- `test/panel197ItemContract.test.js` `for` :64 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :8 [test]
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

- dolu TSV satırı: **4** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `panel`
- itemKey: `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **0**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **4**
- tanımlı ama sahneye çıkmayan: `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`

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

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `parents`

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
- `src/moduleRecipes.js` `getRecipeInnerCornerPanelKey` :202 [read]
- `src/moduleRecipes.js` `resolveRecipeItemsForPanelVariant` :238 [write]
- `test/baseWallRecipes.test.js` (dosya düzeyi) :3 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :8 [test]
- `test/cornerPanelsItemContract.test.js` `for` :79 [test]
- `test/moduleRecipes.test.js` (dosya düzeyi) :9 [test]
- `test/panel197ItemContract.test.js` `for` :64 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :8 [test]
- `test/panelCorner192ItemContract.test.js` `for` :38 [test]
- `test/showcaseRecipes.test.js` (dosya düzeyi) :26 [test]
- `test/straightPanelsItemContract.test.js` `for` :111 [test]
- `test/wallBaseItemsContract.test.js` (dosya düzeyi) :119 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :97 [test]
- `test/wallShelfItemsContract.test.js` (dosya düzeyi) :123 [test]

- indeks: 157 / 188
