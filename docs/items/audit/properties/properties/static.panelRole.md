# `static.panelRole`

**Özellik ID:** `static.panelRole`
**İnsan tarafından anlaşılır adı:** Panel düz / iç köşe rolü
**Kategori:** kanonik-kayit
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** `straight` | `inner-corner` (`src/items.js` panel kayıtları)

## Ne işe yarar

Düz vs iç köşe paneli. Recipe variant `innerCornerPanelItemKey` bu role'e bağlanır.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `LEAF_ITEMS` :12 [define]

## Okuyan yerler

- `src/moduleRecipes.js` `resolveRecipeItemsForPanelVariant` :235 [read]
- `src/moduleRecipes.js` `if` :242 [read]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :57 [test]
- `test/cornerPanelsItemContract.test.js` `for` :91 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :70 [test]
- `test/panel197ItemContract.test.js` (dosya düzeyi) :26 [test]
- `test/panel197ItemContract.test.js` `for` :56 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :28 [test]
- `test/panelCorner192ItemContract.test.js` `for` :47 [test]
- `test/showcaseRecipes.test.js` (dosya düzeyi) :44 [test]
- `test/straightPanelsItemContract.test.js` (dosya düzeyi) :64 [test]
- `test/straightPanelsItemContract.test.js` `for` :101 [test]
- `test/wallShowcaseItemContract.test.js` `for` :58 [test]

## Yazan / değiştiren yerler

- `src/items.js` `LEAF_ITEMS` :12 [define]
- `src/moduleRecipes.js` `if` :243 [write-or-literal]

## Default değeri

Item default: yalnız `src/items.js` dondurulmuş kayıt. Type default yok. Factory bu alanı kopyalamaz (eşdeğer `state.*` ayrı sütun).

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **8** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `panel`
- itemKey: `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **0**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **8**
- tanımlı ama sahneye çıkmayan: `panel_48_5`, `panel_98`, `panel_147_5`, `panel_197`, `panel_corner_42_5`, `panel_corner_92`, `panel_corner_142_5`, `panel_corner_192`

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

yok.

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

- src dosya sayısı (unique): **2**
- src dosyaları: `src/items.js`, `src/moduleRecipes.js`

- `src/items.js` `LEAF_ITEMS` :12 [define]
- `src/moduleRecipes.js` `resolveRecipeItemsForPanelVariant` :235 [read]
- `src/moduleRecipes.js` `if` :242 [read]
- `src/moduleRecipes.js` `if` :243 [write-or-literal]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :57 [test]
- `test/cornerPanelsItemContract.test.js` `for` :91 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :70 [test]
- `test/panel197ItemContract.test.js` (dosya düzeyi) :26 [test]
- `test/panel197ItemContract.test.js` `for` :56 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :28 [test]
- `test/panelCorner192ItemContract.test.js` `for` :47 [test]
- `test/showcaseRecipes.test.js` (dosya düzeyi) :44 [test]
- `test/straightPanelsItemContract.test.js` (dosya düzeyi) :64 [test]
- `test/straightPanelsItemContract.test.js` `for` :101 [test]
- `test/wallShowcaseItemContract.test.js` `for` :58 [test]

- indeks: 33 / 188
