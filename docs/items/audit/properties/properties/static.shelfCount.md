# `static.shelfCount`

> **STALE.** `static.shelfCount` bir JS Item alanı değildir. `src/items.js` kayıtlarında `shelfCount` yok. Raf adedi `itemKey` (`wall_shelf_2_*` / `wall_shelf_3_*`) ve factory `state.shelfCount` üzerinden gider. Aşağıdaki grep satırları audit türevidir; `item.shelfCount` production okuması değildir.

**Özellik ID:** `static.shelfCount`
**İnsan tarafından anlaşılır adı:** Raf adedi (item kaydı)
**Kategori:** kanonik-kayit
**Veri tipi:** number
**Birim:** adet
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `2` · `3`

## Ne işe yarar

Audit özelliği. Aşağıdaki kanıt satırlarına bak.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` (dosya düzeyi) :850 [read]
- `src/items.js` (dosya düzeyi) :855 [write-or-literal]
- `src/items.js` (dosya düzeyi) :861 [define]
- `src/designState.js` `resolveShelfItemKey` :198 [write]
- `src/designState.js` `resolveShelfItemKey` :205 [write-or-literal]
- `src/designState.js` `createShelfModuleState` :221 [write]
- `src/designState.js` `createShelfModuleState` :233 [write-or-literal]
- `src/catalog.js` `createShelfCatalogItem` :128 [write-or-literal]
- `src/catalog.js` `normalizeCatalogDescriptor` :490 [write-or-literal]
- `src/catalog.js` `if` :518 [read]

## Okuyan yerler

- `src/items.js` (dosya düzeyi) :850 [read]
- `src/catalog.js` `if` :518 [read]
- `src/moduleRecipes.js` `getModuleRecipe` :196 [read]
- `src/scene3d.js` `if` :1894 [read]
- `src/scene3d.js` `createShelfModule` :6866 [read]
- `src/moduleDragSidebar.js` `if` :132 [read]
- `src/rawBomDebug.js` `if` :117 [read]
- `src/selectionFeedback.js` `if` :69 [read]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :34 [test]
- `test/moduleRecipes.test.js` (dosya düzeyi) :77 [test]
- `test/panel197ItemContract.test.js` (dosya düzeyi) :9 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :14 [test]
- `test/profile190ItemContract.test.js` (dosya düzeyi) :15 [test]
- `test/profilesItemContract.test.js` (dosya düzeyi) :38 [test]
- `test/shelfItemsItemContract.test.js` `for` :39 [test]
- `test/shelfLegItemContract.test.js` (dosya düzeyi) :7 [test]
- `test/shelfLegItemContract.test.js` `for` :22 [test]
- `test/shelfModule.test.js` (dosya düzeyi) :14 [test]
- `test/straightPanelsItemContract.test.js` (dosya düzeyi) :31 [test]
- `test/straightPanelsItemContract.test.js` `for` :91 [test]
- `test/systemDevelopmentContract.test.js` `for` :70 [test]
- `test/upright3465ItemContract.test.js` `listAllVerifiedRecipes` :17 [test]
- `test/wallShelfItemsContract.test.js` (dosya düzeyi) :27 [test]
- `e2e/shelf-board-appearance.spec.mjs` `saveAndReadProject` :77 [test]
- `e2e/wall-shelf-items-contract.spec.mjs` `for` :51 [test]

## Yazan / değiştiren yerler

- `src/items.js` (dosya düzeyi) :855 [write-or-literal]
- `src/items.js` (dosya düzeyi) :861 [define]
- `src/designState.js` `resolveShelfItemKey` :198 [write]
- `src/designState.js` `resolveShelfItemKey` :205 [write-or-literal]
- `src/designState.js` `createShelfModuleState` :221 [write]
- `src/designState.js` `createShelfModuleState` :233 [write-or-literal]
- `src/catalog.js` `createShelfCatalogItem` :128 [write-or-literal]
- `src/catalog.js` `normalizeCatalogDescriptor` :490 [write-or-literal]
- `src/moduleRecipes.js` (dosya düzeyi) :34 [write-or-literal]
- `src/scene3d.js` `pickModuleContext` :1811 [write-or-literal]
- `src/scene3d.js` `if` :2090 [write]
- `src/rawBomDebug.js` `if` :116 [write]
- `src/selectionFeedback.js` `if` :68 [write]

## Default değeri

Item default: yalnız `src/items.js` dondurulmuş kayıt. Type default yok. Factory bu alanı kopyalamaz (eşdeğer `state.*` ayrı sütun).

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **6** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `shelf`
- itemKey: `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **6**
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

- src dosya sayısı (unique): **8**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/moduleRecipes.js`, `src/scene3d.js`, `src/moduleDragSidebar.js`, `src/rawBomDebug.js`, `src/selectionFeedback.js`

- `src/items.js` (dosya düzeyi) :850 [read]
- `src/items.js` (dosya düzeyi) :855 [write-or-literal]
- `src/items.js` (dosya düzeyi) :861 [define]
- `src/designState.js` `resolveShelfItemKey` :198 [write]
- `src/designState.js` `resolveShelfItemKey` :205 [write-or-literal]
- `src/designState.js` `createShelfModuleState` :221 [write]
- `src/designState.js` `createShelfModuleState` :233 [write-or-literal]
- `src/catalog.js` `createShelfCatalogItem` :128 [write-or-literal]
- `src/catalog.js` `normalizeCatalogDescriptor` :490 [write-or-literal]
- `src/catalog.js` `if` :518 [read]
- `src/moduleRecipes.js` (dosya düzeyi) :34 [write-or-literal]
- `src/moduleRecipes.js` `getModuleRecipe` :196 [read]
- `src/scene3d.js` `pickModuleContext` :1811 [write-or-literal]
- `src/scene3d.js` `if` :1894 [read]
- `src/scene3d.js` `if` :2090 [write]
- `src/scene3d.js` `createShelfModule` :6866 [read]
- `src/moduleDragSidebar.js` `if` :132 [read]
- `src/rawBomDebug.js` `if` :116 [write]
- `src/rawBomDebug.js` `if` :117 [read]
- `src/selectionFeedback.js` `if` :68 [write]
- `src/selectionFeedback.js` `if` :69 [read]
- `test/cornerPanelsItemContract.test.js` (dosya düzeyi) :34 [test]
- `test/moduleRecipes.test.js` (dosya düzeyi) :77 [test]
- `test/panel197ItemContract.test.js` (dosya düzeyi) :9 [test]
- `test/panelCorner192ItemContract.test.js` (dosya düzeyi) :14 [test]
- `test/profile190ItemContract.test.js` (dosya düzeyi) :15 [test]
- `test/profilesItemContract.test.js` (dosya düzeyi) :38 [test]
- `test/shelfItemsItemContract.test.js` `for` :39 [test]
- `test/shelfLegItemContract.test.js` (dosya düzeyi) :7 [test]
- `test/shelfLegItemContract.test.js` `for` :22 [test]
- `test/shelfModule.test.js` (dosya düzeyi) :14 [test]
- `test/straightPanelsItemContract.test.js` (dosya düzeyi) :31 [test]
- `test/straightPanelsItemContract.test.js` `for` :91 [test]
- `test/systemDevelopmentContract.test.js` `for` :70 [test]
- `test/upright3465ItemContract.test.js` `listAllVerifiedRecipes` :17 [test]
- `test/wallShelfItemsContract.test.js` (dosya düzeyi) :27 [test]
- `e2e/shelf-board-appearance.spec.mjs` `saveAndReadProject` :77 [test]
- `e2e/wall-shelf-items-contract.spec.mjs` `for` :51 [test]

- indeks: 36 / 188
