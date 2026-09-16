# `recipe.moduleType`

**Özellik ID:** `recipe.moduleType`
**İnsan tarafından anlaşılır adı:** Recipe moduleType
**Kategori:** bom-recipe
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `door` · `base` · `counter` · `wall` · `wall-short-up-2` · `wall-short-up-1` · `base-wall` · `separator` · `shelf` · `showcase-2` · `showcase-3`

## Ne işe yarar

Parent composition recipe üstverisi.

## Canonical owner

- katman: BOM/recipe
- dosya: `src/itemBom.js + src/moduleRecipes.js`
- sembol: `resolveItemBom / getExpandedModuleRecipe`

## Tanımlandığı yerler

- consumer yok (bu id ile src/test/e2e satırı bulunamadı veya audit türevi).

## Okuyan yerler

- `src/itemBom.js` `resolveRecipe` :22 [read]
- `src/moduleRecipes.js` `getExpandedModuleRecipe` :278 [read]
- `test/baseItemsContract.test.js` (dosya düzeyi) :14 [test]
- `test/baseItemsContract.test.js` `for` :117 [test]
- `test/baseRecipes.test.js` (dosya düzeyi) :5 [test]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :7 [test]
- `test/baseTopsItemContract.test.js` `for` :50 [test]
- `test/baseWallRecipes.test.js` (dosya düzeyi) :3 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :7 [test]
- `test/cornerPanelsItemContract.test.js` `for` :77 [test]
- `test/counterRecipes.test.js` (dosya düzeyi) :5 [test]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :11 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :7 [test]
- `test/glassShelfItemContract.test.js` (dosya düzeyi) :6 [test]
- `test/glassShelfItemContract.test.js` `for` :34 [test]
- `test/lCounter150Contract.test.js` (dosya düzeyi) :6 [test]
- `test/lCounter200Contract.test.js` (dosya düzeyi) :6 [test]
- `test/moduleRecipes.test.js` (dosya düzeyi) :8 [test]
- `test/panel197ItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/panel197ItemContract.test.js` `for` :34 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :7 [test]
- `test/panelCorner192ItemContract.test.js` `for` :36 [test]
- `test/profile190ItemContract.test.js` (dosya düzeyi) :8 [test]
- `test/profilesItemContract.test.js` (dosya düzeyi) :7 [test]
- `test/profilesItemContract.test.js` `for` :84 [test]
- `test/separatorPanelsItemContract.test.js` (dosya düzeyi) :5 [test]
- … test/e2e ek 21 eşleşme (src listesi tam).

## Yazan / değiştiren yerler

- `src/moduleRecipes.js` `getModuleRecipe` :194 [write]

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

- `src/itemBom.js` `resolveRecipe` :22 [read]
- `src/moduleRecipes.js` `getModuleRecipe` :194 [write]
- `src/moduleRecipes.js` `getExpandedModuleRecipe` :278 [read]
- `test/baseItemsContract.test.js` (dosya düzeyi) :14 [test]
- `test/baseItemsContract.test.js` `for` :117 [test]
- `test/baseRecipes.test.js` (dosya düzeyi) :5 [test]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :7 [test]
- `test/baseTopsItemContract.test.js` `for` :50 [test]
- `test/baseWallRecipes.test.js` (dosya düzeyi) :3 [test]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :7 [test]
- `test/cornerPanelsItemContract.test.js` `for` :77 [test]
- `test/counterRecipes.test.js` (dosya düzeyi) :5 [test]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :11 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :7 [test]
- `test/glassShelfItemContract.test.js` (dosya düzeyi) :6 [test]
- `test/glassShelfItemContract.test.js` `for` :34 [test]
- `test/lCounter150Contract.test.js` (dosya düzeyi) :6 [test]
- `test/lCounter200Contract.test.js` (dosya düzeyi) :6 [test]
- `test/moduleRecipes.test.js` (dosya düzeyi) :8 [test]
- `test/panel197ItemContract.test.js` (dosya düzeyi) :5 [test]
- `test/panel197ItemContract.test.js` `for` :34 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :7 [test]
- `test/panelCorner192ItemContract.test.js` `for` :36 [test]
- `test/profile190ItemContract.test.js` (dosya düzeyi) :8 [test]
- `test/profilesItemContract.test.js` (dosya düzeyi) :7 [test]
- `test/profilesItemContract.test.js` `for` :84 [test]
- `test/separatorPanelsItemContract.test.js` (dosya düzeyi) :5 [test]
- … test/e2e ek 21 eşleşme (src listesi tam).

- indeks: 153 / 188
