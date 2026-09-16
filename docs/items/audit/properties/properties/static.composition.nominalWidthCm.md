# `static.composition.nominalWidthCm`

**Özellik ID:** `static.composition.nominalWidthCm`
**İnsan tarafından anlaşılır adı:** Kanonik composition: nominalWidthCm
**Kategori:** kanonik-kayit
**Veri tipi:** number
**Birim:** cm
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `100` · `150` · `200` · `50`

## Ne işe yarar

Recipe genişlik anahtarı (50/100/150/200).

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `COMPOSITE_ITEMS` :503 [write-or-literal]
- `src/items.js` (dosya düzeyi) :574 [write-or-literal]

## Okuyan yerler

- `src/itemBom.js` `resolveRecipe` :23 [read]
- `src/moduleRecipes.js` `getStraightWallRecipe` :183 [read]
- `src/moduleRecipes.js` `getStraightWallNominalWidthForProfileItem` :188 [read]
- `src/moduleRecipes.js` `getModuleRecipe` :195 [read]
- `src/moduleRecipes.js` `getExpandedStraightWallRecipe` :275 [read]
- `src/moduleRecipes.js` `getExpandedModuleRecipe` :278 [read]
- `test/baseItemsContract.test.js` (dosya düzeyi) :49 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :80 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :43 [test]
- `test/wallBaseItemsContract.test.js` (dosya düzeyi) :75 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :64 [test]
- `test/wallSeparatorItemsContract.test.js` (dosya düzeyi) :81 [test]
- `test/wallSeparatorItemsContract.test.js` `for` :139 [test]
- `test/wallShelfItemsContract.test.js` (dosya düzeyi) :86 [test]
- `test/wallShowcaseItemContract.test.js` `for` :26 [test]

## Yazan / değiştiren yerler

- `src/items.js` `COMPOSITE_ITEMS` :503 [write-or-literal]
- `src/items.js` (dosya düzeyi) :574 [write-or-literal]
- `src/moduleRecipes.js` (dosya düzeyi) :4 [write-or-literal]
- `src/moduleRecipes.js` `getModuleRecipe` :194 [write]
- `src/moduleRecipes.js` `getExpandedStraightWallRecipe` :274 [write]
- `src/moduleRecipes.js` `getExpandedModuleRecipe` :277 [write]

## Default değeri

Item default: yalnız COMPOSITE_ITEMS (recipe) veya FURNITURE cluster `items`. Global composition default yok.

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

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

Kod kaydı. Project DB'ye yazılmaz.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

Etkiler: `resolveItemBom` / recipe items / inner-corner variant. Miktar uydurulmaz; recipe satırı kanoniktir.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `static`

## Değiştirmenin yan etkileri

Kanonik kayıt değişirse catalog, factory, BOM, davranış çözümü ve test kilitleri birlikte etkilenir. Bu turda değiştirilmedi.

## CRUD sınıflandırması

ITEM_READONLY

## CRUD gerekçesi

Kanonik `src/items.js` kaydı. Runtime kullanıcı bu alanları item tanımı olarak değiştirmez; kopyalar factory/catalog/BOM tarafında okunur.

## Kanıt

- src dosya sayısı (unique): **3**
- src dosyaları: `src/items.js`, `src/itemBom.js`, `src/moduleRecipes.js`

- `src/items.js` `COMPOSITE_ITEMS` :503 [write-or-literal]
- `src/items.js` (dosya düzeyi) :574 [write-or-literal]
- `src/itemBom.js` `resolveRecipe` :23 [read]
- `src/moduleRecipes.js` (dosya düzeyi) :4 [write-or-literal]
- `src/moduleRecipes.js` `getStraightWallRecipe` :183 [read]
- `src/moduleRecipes.js` `getStraightWallNominalWidthForProfileItem` :188 [read]
- `src/moduleRecipes.js` `getModuleRecipe` :194 [write]
- `src/moduleRecipes.js` `getModuleRecipe` :195 [read]
- `src/moduleRecipes.js` `getExpandedStraightWallRecipe` :274 [write]
- `src/moduleRecipes.js` `getExpandedStraightWallRecipe` :275 [read]
- `src/moduleRecipes.js` `getExpandedModuleRecipe` :277 [write]
- `src/moduleRecipes.js` `getExpandedModuleRecipe` :278 [read]
- `test/baseItemsContract.test.js` (dosya düzeyi) :49 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :80 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :43 [test]
- `test/wallBaseItemsContract.test.js` (dosya düzeyi) :75 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :64 [test]
- `test/wallSeparatorItemsContract.test.js` (dosya düzeyi) :81 [test]
- `test/wallSeparatorItemsContract.test.js` `for` :139 [test]
- `test/wallShelfItemsContract.test.js` (dosya düzeyi) :86 [test]
- `test/wallShowcaseItemContract.test.js` `for` :26 [test]

- indeks: 11 / 188
