# `static.composition.moduleType`

> **DEPRECATED (SCHEMA_ONLY).** Alan Item kaydında durur; production `src/` bu path’i okumaz. Runtime BOM `composition.mode` + `composition.items` + `expandRecipe`. Testler hâlâ değeri assert eder. Fiziksel silme yok (DECISION-06). Production kimlik `item.type`.

**Özellik ID:** `static.composition.moduleType`
**İnsan tarafından anlaşılır adı:** Kanonik composition: moduleType
**Kategori:** kanonik-kayit
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `door` · `base` · `counter` · `wall` · `wall-short-up-2` · `wall-short-up-1` · `base-wall` · `separator` · `shelf` · `showcase-2` · `showcase-3`

## Ne işe yarar

`getModuleRecipe` / `getExpandedModuleRecipe` ilk argümanı.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `COMPOSITE_ITEMS` :502 [write-or-literal]
- `src/items.js` (dosya düzeyi) :585 [write-or-literal]

## Okuyan yerler

- `src/itemBom.js` `resolveRecipe` :22 [read]
- `src/scene3d.js` `addFace` :6853 [read]
- `test/baseModule.test.js` `for` :76 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :40 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :42 [test]
- `test/freePropsCollisionNone.test.js` `for` :56 [test]
- `test/lCounterPlacement.test.js` (dosya düzeyi) :46 [test]
- `test/moduleContextAllowSideInsert.test.js` (dosya düzeyi) :7 [test]
- `test/modulePlacement.test.js` (dosya düzeyi) :394 [test]
- `test/modulePlacement.test.js` `for` :931 [test]
- `test/profileFieldPlacement.test.js` `for` :77 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :116 [test]
- `test/rawBomSelectionParser.test.js` `lCounterSelectionMessage` :12 [test]
- `test/rawBomSelectionParser.test.js` `for` :31 [test]
- `test/selectionFeedback.test.js` `surface` :27 [test]
- `test/showcaseBodyColorRegression.test.js` `for` :37 [test]
- `test/uprightFieldPlacement.test.js` `for` :80 [test]
- `test/uprightFieldPlacement.test.js` (dosya düzeyi) :116 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :154 [test]
- `test/wallSeparatorItemsContract.test.js` `for` :140 [test]
- `test/wallShelfItemsContract.test.js` (dosya düzeyi) :144 [test]
- `test/wallShowcaseItemContract.test.js` `for` :26 [test]

## Yazan / değiştiren yerler

- `src/items.js` `COMPOSITE_ITEMS` :502 [write-or-literal]
- `src/items.js` (dosya düzeyi) :585 [write-or-literal]
- `src/moduleRecipes.js` (dosya düzeyi) :4 [write-or-literal]
- `src/scene3d.js` `rotateSelectedModule` :2264 [write-or-literal]
- `src/scene3d.js` `getFreeTvPlacement` :2299 [write-or-literal]
- `src/scene3d.js` `if` :2458 [write-or-literal]
- `src/scene3d.js` `createMiniFridgeModule` :5006 [write-or-literal]
- `src/scene3d.js` `createCoatRackModule` :5235 [write-or-literal]
- `src/scene3d.js` `createUprightModule` :5306 [write-or-literal]
- `src/scene3d.js` `createProfileModule` :5356 [write-or-literal]
- `src/scene3d.js` `createKettleModule` :5400 [write-or-literal]
- `src/scene3d.js` `for` :5650 [write-or-literal]
- `src/scene3d.js` `createBarStoolModule` :5697 [write-or-literal]
- `src/scene3d.js` `createEamesChairModule` :5777 [write-or-literal]
- `src/scene3d.js` `createGlassTableModule` :5890 [write-or-literal]
- `src/scene3d.js` `createBeigeSofaFurnitureProxy` :6246 [write-or-literal]
- `src/scene3d.js` `addPanelFace` :6570 [write-or-literal]
- `src/scene3d.js` `addFace` :6743 [write-or-literal]
- `src/main.js` `for` :678 [write-or-literal]
- `src/moduleMove.js` `if` :183 [write-or-literal]
- `src/modulePlacement.js` `snapUprightToShortUpJoints` :768 [write-or-literal]
- `src/modulePlacement.js` `if` :1579 [write-or-literal]
- `src/rawBomDebug.js` `parseLCounterSelection` :19 [write-or-literal]

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

- src dosya sayısı (unique): **8**
- src dosyaları: `src/items.js`, `src/itemBom.js`, `src/moduleRecipes.js`, `src/scene3d.js`, `src/main.js`, `src/moduleMove.js`, `src/modulePlacement.js`, `src/rawBomDebug.js`

- `src/items.js` `COMPOSITE_ITEMS` :502 [write-or-literal]
- `src/items.js` (dosya düzeyi) :585 [write-or-literal]
- `src/itemBom.js` `resolveRecipe` :22 [read]
- `src/moduleRecipes.js` (dosya düzeyi) :4 [write-or-literal]
- `src/scene3d.js` `rotateSelectedModule` :2264 [write-or-literal]
- `src/scene3d.js` `getFreeTvPlacement` :2299 [write-or-literal]
- `src/scene3d.js` `if` :2458 [write-or-literal]
- `src/scene3d.js` `createMiniFridgeModule` :5006 [write-or-literal]
- `src/scene3d.js` `createCoatRackModule` :5235 [write-or-literal]
- `src/scene3d.js` `createUprightModule` :5306 [write-or-literal]
- `src/scene3d.js` `createProfileModule` :5356 [write-or-literal]
- `src/scene3d.js` `createKettleModule` :5400 [write-or-literal]
- `src/scene3d.js` `for` :5650 [write-or-literal]
- `src/scene3d.js` `createBarStoolModule` :5697 [write-or-literal]
- `src/scene3d.js` `createEamesChairModule` :5777 [write-or-literal]
- `src/scene3d.js` `createGlassTableModule` :5890 [write-or-literal]
- `src/scene3d.js` `createBeigeSofaFurnitureProxy` :6246 [write-or-literal]
- `src/scene3d.js` `addPanelFace` :6570 [write-or-literal]
- `src/scene3d.js` `addFace` :6743 [write-or-literal]
- `src/scene3d.js` `addFace` :6853 [read]
- `src/main.js` `for` :678 [write-or-literal]
- `src/moduleMove.js` `if` :183 [write-or-literal]
- `src/modulePlacement.js` `snapUprightToShortUpJoints` :768 [write-or-literal]
- `src/modulePlacement.js` `if` :1579 [write-or-literal]
- `src/rawBomDebug.js` `parseLCounterSelection` :19 [write-or-literal]
- `test/baseModule.test.js` `for` :76 [test]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :40 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :42 [test]
- `test/freePropsCollisionNone.test.js` `for` :56 [test]
- `test/lCounterPlacement.test.js` (dosya düzeyi) :46 [test]
- `test/moduleContextAllowSideInsert.test.js` (dosya düzeyi) :7 [test]
- `test/modulePlacement.test.js` (dosya düzeyi) :394 [test]
- `test/modulePlacement.test.js` `for` :931 [test]
- `test/profileFieldPlacement.test.js` `for` :77 [test]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :116 [test]
- `test/rawBomSelectionParser.test.js` `lCounterSelectionMessage` :12 [test]
- `test/rawBomSelectionParser.test.js` `for` :31 [test]
- `test/selectionFeedback.test.js` `surface` :27 [test]
- `test/showcaseBodyColorRegression.test.js` `for` :37 [test]
- `test/uprightFieldPlacement.test.js` `for` :80 [test]
- `test/uprightFieldPlacement.test.js` (dosya düzeyi) :116 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :154 [test]
- `test/wallSeparatorItemsContract.test.js` `for` :140 [test]
- `test/wallShelfItemsContract.test.js` (dosya düzeyi) :144 [test]
- `test/wallShowcaseItemContract.test.js` `for` :26 [test]

- indeks: 10 / 188
