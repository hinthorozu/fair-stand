# `static.shape`

**Özellik ID:** `static.shape`
**İnsan tarafından anlaşılır adı:** Banko L şekli (item kaydı)
**Kategori:** kanonik-kayit
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** Item kaydında yalnız `L`. Factory düz bankoda `straight` ekler.

## Ne işe yarar

Item kaydında yalnız L banko. Factory `shape: 'straight'|'L'`. `getModuleBehavior` L için defaultRotation 270.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` (dosya düzeyi) :581 [write-or-literal]
- `src/items.js` (dosya düzeyi) :587 [define]
- `src/designState.js` `resolveCounterItemKey` :278 [read]
- `src/designState.js` `resolveCounterItemKey` :279 [write-or-literal]
- `src/designState.js` `createCounterModuleState` :292 [read]
- `src/designState.js` `if` :302 [read]
- `src/catalog.js` `createCounterCatalogItem` :53 [read]
- `src/moduleBehavior.js` `if` :230 [read]

## Okuyan yerler

- `src/designState.js` `resolveCounterItemKey` :278 [read]
- `src/designState.js` `createCounterModuleState` :292 [read]
- `src/designState.js` `if` :302 [read]
- `src/catalog.js` `createCounterCatalogItem` :53 [read]
- `src/moduleBehavior.js` `if` :230 [read]
- `src/moduleRecipes.js` `getModuleRecipe` :197 [read]
- `src/scene3d.js` `createCounterModule` :6602 [read]
- `src/modulePlacement.js` `isLCounterModule` :241 [read]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :17 [test]
- `test/counterTopsItemContract.test.js` `for` :56 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :47 [test]
- `test/deskBankoItemsContract.test.js` `if` :111 [test]
- `test/lCounter100Contract.test.js` (dosya düzeyi) :11 [test]
- `test/lCounter150Contract.test.js` (dosya düzeyi) :12 [test]
- `test/lCounter200Contract.test.js` (dosya düzeyi) :12 [test]
- `test/lCounterDefaultOrientation.test.js` (dosya düzeyi) :8 [test]
- `test/lCounterPlacement.test.js` (dosya düzeyi) :10 [test]
- `test/moduleRecipes.test.js` (dosya düzeyi) :87 [test]
- `test/moduleRotationPolicy.test.js` (dosya düzeyi) :12 [test]
- `test/panel197ItemContract.test.js` (dosya düzeyi) :11 [test]
- `test/profile190ItemContract.test.js` (dosya düzeyi) :17 [test]
- `test/profile190ItemContract.test.js` `for` :55 [test]
- `test/profilesItemContract.test.js` (dosya düzeyi) :18 [test]
- `test/rawBomSelectionParser.test.js` `for` :34 [test]
- `test/straightPanelsItemContract.test.js` (dosya düzeyi) :12 [test]
- `test/upright3465ItemContract.test.js` `listAllVerifiedRecipes` :27 [test]
- `test/upright99And495ItemContract.test.js` (dosya düzeyi) :16 [test]

## Yazan / değiştiren yerler

- `src/items.js` (dosya düzeyi) :581 [write-or-literal]
- `src/items.js` (dosya düzeyi) :587 [define]
- `src/designState.js` `resolveCounterItemKey` :279 [write-or-literal]
- `src/moduleRecipes.js` (dosya düzeyi) :142 [write-or-literal]
- `src/rawBomDebug.js` `parseLCounterSelection` :22 [write-or-literal]

## Default değeri

Item default: yalnız `src/items.js` dondurulmuş kayıt. Type default yok. Factory bu alanı kopyalamaz (eşdeğer `state.*` ayrı sütun).

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **3** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `counter`
- itemKey: `desk_banko_100_L`, `desk_banko_150_L`, `desk_banko_200_L`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **3**
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

- src dosya sayısı (unique): **8**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/moduleBehavior.js`, `src/moduleRecipes.js`, `src/scene3d.js`, `src/modulePlacement.js`, `src/rawBomDebug.js`

- `src/items.js` (dosya düzeyi) :581 [write-or-literal]
- `src/items.js` (dosya düzeyi) :587 [define]
- `src/designState.js` `resolveCounterItemKey` :278 [read]
- `src/designState.js` `resolveCounterItemKey` :279 [write-or-literal]
- `src/designState.js` `createCounterModuleState` :292 [read]
- `src/designState.js` `if` :302 [read]
- `src/catalog.js` `createCounterCatalogItem` :53 [read]
- `src/moduleBehavior.js` `if` :230 [read]
- `src/moduleRecipes.js` (dosya düzeyi) :142 [write-or-literal]
- `src/moduleRecipes.js` `getModuleRecipe` :197 [read]
- `src/scene3d.js` `createCounterModule` :6602 [read]
- `src/modulePlacement.js` `isLCounterModule` :241 [read]
- `src/rawBomDebug.js` `parseLCounterSelection` :22 [write-or-literal]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :17 [test]
- `test/counterTopsItemContract.test.js` `for` :56 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :47 [test]
- `test/deskBankoItemsContract.test.js` `if` :111 [test]
- `test/lCounter100Contract.test.js` (dosya düzeyi) :11 [test]
- `test/lCounter150Contract.test.js` (dosya düzeyi) :12 [test]
- `test/lCounter200Contract.test.js` (dosya düzeyi) :12 [test]
- `test/lCounterDefaultOrientation.test.js` (dosya düzeyi) :8 [test]
- `test/lCounterPlacement.test.js` (dosya düzeyi) :10 [test]
- `test/moduleRecipes.test.js` (dosya düzeyi) :87 [test]
- `test/moduleRotationPolicy.test.js` (dosya düzeyi) :12 [test]
- `test/panel197ItemContract.test.js` (dosya düzeyi) :11 [test]
- `test/profile190ItemContract.test.js` (dosya düzeyi) :17 [test]
- `test/profile190ItemContract.test.js` `for` :55 [test]
- `test/profilesItemContract.test.js` (dosya düzeyi) :18 [test]
- `test/rawBomSelectionParser.test.js` `for` :34 [test]
- `test/straightPanelsItemContract.test.js` (dosya düzeyi) :12 [test]
- `test/upright3465ItemContract.test.js` `listAllVerifiedRecipes` :27 [test]
- `test/upright99And495ItemContract.test.js` (dosya düzeyi) :16 [test]

- indeks: 35 / 188
