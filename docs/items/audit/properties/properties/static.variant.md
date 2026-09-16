# `static.variant`

**Özellik ID:** `static.variant`
**İnsan tarafından anlaşılır adı:** Short-up varyant kimliği
**Kategori:** kanonik-kayit
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** `short-up-1` | `short-up-2`

## Ne işe yarar

`isShortUpFamilyDescriptor`; short-up joint snap hedefi.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` (dosya düzeyi) :666 [write-or-literal]
- `src/items.js` `isShortUpFamilyDescriptor` :1016 [read]
- `src/items.js` `isShortUpFamilyDescriptor` :1017 [write]
- `src/catalog.js` `createFlatPanelCatalogItem` :65 [write]
- `src/catalog.js` `normalizeCatalogDescriptor` :494 [write-or-literal]
- `src/catalog.js` `if` :523 [read]
- `src/moduleBehavior.js` (dosya düzeyi) :2 [read]
- `src/moduleBehavior.js` `isUprightJointSnapTarget` :299 [read]

## Okuyan yerler

- `src/items.js` `isShortUpFamilyDescriptor` :1016 [read]
- `src/catalog.js` `if` :523 [read]
- `src/moduleBehavior.js` (dosya düzeyi) :2 [read]
- `src/moduleBehavior.js` `isUprightJointSnapTarget` :299 [read]
- `src/moduleRecipes.js` `getRecipeInnerCornerPanelKey` :203 [read]
- `src/moduleRecipes.js` `for` :213 [read]
- `src/moduleRecipes.js` `if` :220 [read]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :71 [test]
- `test/cornerPanelsItemContract.test.js` `for` :79 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :90 [test]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :52 [test]
- `test/panel197ItemContract.test.js` `for` :64 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :32 [test]
- `test/panelCorner192ItemContract.test.js` `for` :38 [test]
- `test/shelfModule.test.js` (dosya düzeyi) :8 [test]
- `test/showcaseRecipes.test.js` (dosya düzeyi) :26 [test]
- `test/straightPanelsItemContract.test.js` `for` :105 [test]
- `test/uprightFieldPlacement.test.js` (dosya düzeyi) :7 [test]
- `test/uprightFieldPlacement.test.js` `for` :64 [test]
- `test/wallBaseItemsContract.test.js` (dosya düzeyi) :119 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :97 [test]
- `test/wallShelfItemsContract.test.js` (dosya düzeyi) :123 [test]

## Yazan / değiştiren yerler

- `src/items.js` (dosya düzeyi) :666 [write-or-literal]
- `src/items.js` `isShortUpFamilyDescriptor` :1017 [write]
- `src/catalog.js` `createFlatPanelCatalogItem` :65 [write]
- `src/catalog.js` `normalizeCatalogDescriptor` :494 [write-or-literal]
- `src/moduleRecipes.js` (dosya düzeyi) :6 [write-or-literal]
- `src/moduleRecipes.js` `resolveRecipeItemsForPanelVariant` :238 [write]

## Default değeri

Item default: yalnız `src/items.js` dondurulmuş kayıt. Type default yok. Factory bu alanı kopyalamaz (eşdeğer `state.*` ayrı sütun).

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **8** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `flat-panel`
- itemKey: `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **8**
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

Etkiler: snap, collision, side insert, short-up joint, L rotasyon, overlay mount. Ayrıntı `src/modulePlacement.js` + `getModuleBehavior`.

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

- src dosya sayısı (unique): **4**
- src dosyaları: `src/items.js`, `src/catalog.js`, `src/moduleBehavior.js`, `src/moduleRecipes.js`

- `src/items.js` (dosya düzeyi) :666 [write-or-literal]
- `src/items.js` `isShortUpFamilyDescriptor` :1016 [read]
- `src/items.js` `isShortUpFamilyDescriptor` :1017 [write]
- `src/catalog.js` `createFlatPanelCatalogItem` :65 [write]
- `src/catalog.js` `normalizeCatalogDescriptor` :494 [write-or-literal]
- `src/catalog.js` `if` :523 [read]
- `src/moduleBehavior.js` (dosya düzeyi) :2 [read]
- `src/moduleBehavior.js` `isUprightJointSnapTarget` :299 [read]
- `src/moduleRecipes.js` (dosya düzeyi) :6 [write-or-literal]
- `src/moduleRecipes.js` `getRecipeInnerCornerPanelKey` :203 [read]
- `src/moduleRecipes.js` `for` :213 [read]
- `src/moduleRecipes.js` `if` :220 [read]
- `src/moduleRecipes.js` `resolveRecipeItemsForPanelVariant` :238 [write]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :71 [test]
- `test/cornerPanelsItemContract.test.js` `for` :79 [test]
- `test/doorCompositeItemContract.test.js` (dosya düzeyi) :90 [test]
- `test/globalSilhouetteGhost.test.js` (dosya düzeyi) :52 [test]
- `test/panel197ItemContract.test.js` `for` :64 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :32 [test]
- `test/panelCorner192ItemContract.test.js` `for` :38 [test]
- `test/shelfModule.test.js` (dosya düzeyi) :8 [test]
- `test/showcaseRecipes.test.js` (dosya düzeyi) :26 [test]
- `test/straightPanelsItemContract.test.js` `for` :105 [test]
- `test/uprightFieldPlacement.test.js` (dosya düzeyi) :7 [test]
- `test/uprightFieldPlacement.test.js` `for` :64 [test]
- `test/wallBaseItemsContract.test.js` (dosya düzeyi) :119 [test]
- `test/wallFlatPanelItemsContract.test.js` (dosya düzeyi) :97 [test]
- `test/wallShelfItemsContract.test.js` (dosya düzeyi) :123 [test]

- indeks: 41 / 188
