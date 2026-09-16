# `state.shape`

**Özellik ID:** `state.shape`
**İnsan tarafından anlaşılır adı:** Runtime module state: shape
**Kategori:** runtime-state
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** `straight` | `L` (`createCounterModuleState`)

## Ne işe yarar

create*ModuleState çıktısı. Persist: modules[] blob.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/items.js` (dosya düzeyi) :581 [write-or-literal]
- `src/items.js` (dosya düzeyi) :587 [define]
- `src/designState.js` `resolveCounterItemKey` :278 [read]
- `src/designState.js` `resolveCounterItemKey` :279 [write-or-literal]
- `src/designState.js` `createCounterModuleState` :292 [read]
- `src/designState.js` `if` :302 [read]
- `src/catalog.js` `createCounterCatalogItem` :53 [read]
- `src/catalog.js` `optionalNumber` :470 [read]
- `src/catalog.js` `shapesMatch` :471 [read]
- `src/catalog.js` `normalizeCatalogDescriptor` :489 [write-or-literal]
- `src/catalog.js` `if` :516 [read]
- `src/moduleBehavior.js` `if` :230 [read]

## Okuyan yerler

- `src/designState.js` `resolveCounterItemKey` :278 [read]
- `src/designState.js` `createCounterModuleState` :292 [read]
- `src/designState.js` `if` :302 [read]
- `src/catalog.js` `createCounterCatalogItem` :53 [read]
- `src/catalog.js` `optionalNumber` :470 [read]
- `src/catalog.js` `shapesMatch` :471 [read]
- `src/catalog.js` `if` :516 [read]
- `src/moduleBehavior.js` `if` :230 [read]
- `src/moduleRecipes.js` `getModuleRecipe` :197 [read]
- `src/scene3d.js` `if` :1893 [read]
- `src/scene3d.js` `roundedRectShape` :5505 [read]
- `src/scene3d.js` `createCounterModule` :6602 [read]
- `src/modulePlacement.js` `isLCounterModule` :241 [read]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :590 [read]
- `src/modulePlacement.js` `addCandidate` :898 [read]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :17 [test]
- `test/counterTopsItemContract.test.js` `for` :56 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :26 [test]
- `test/deskBankoItemsContract.test.js` `if` :88 [test]
- `test/lCounter100Contract.test.js` (dosya düzeyi) :8 [test]
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
- `test/rectImageLayout.test.js` `for` :64 [test]
- `test/straightPanelsItemContract.test.js` (dosya düzeyi) :12 [test]
- `test/systemDevelopmentContract.test.js` `for` :71 [test]
- `test/systemImpactAnalysis.test.js` (dosya düzeyi) :157 [test]
- `test/upright3465ItemContract.test.js` `listAllVerifiedRecipes` :27 [test]
- `test/upright99And495ItemContract.test.js` (dosya düzeyi) :16 [test]
- `e2e/desk-banko-items-contract.spec.mjs` `saveAndReadProject` :77 [test]

## Yazan / değiştiren yerler

- `src/items.js` (dosya düzeyi) :581 [write-or-literal]
- `src/items.js` (dosya düzeyi) :587 [define]
- `src/designState.js` `resolveCounterItemKey` :279 [write-or-literal]
- `src/catalog.js` `normalizeCatalogDescriptor` :489 [write-or-literal]
- `src/moduleRecipes.js` (dosya düzeyi) :142 [write-or-literal]
- `src/scene3d.js` `pickModuleContext` :1810 [write-or-literal]
- `src/scene3d.js` `rotateSelectedModule` :2267 [write-or-literal]
- `src/scene3d.js` `getFreeTvPlacement` :2300 [write-or-literal]
- `src/scene3d.js` `if` :2459 [write-or-literal]
- `src/scene3d.js` `if` :4752 [write]
- `src/scene3d.js` `roundedRectShape` :5501 [write]
- `src/scene3d.js` `for` :7529 [write-or-literal]
- `src/main.js` `for` :681 [write-or-literal]
- `src/moduleMove.js` `if` :186 [write-or-literal]
- `src/modulePlacement.js` `createLocalSegment` :295 [write]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :565 [write]
- `src/modulePlacement.js` `snapPlacementToModules` :810 [write]
- `src/modulePlacement.js` `if` :1582 [write-or-literal]
- `src/rawBomDebug.js` `parseLCounterSelection` :22 [write-or-literal]

## Default değeri

Factory default: ilgili `create*ModuleState` Item/catalog ölçü veya media türevini kopyalar. Global state default yok.

## Override zinciri

Item/catalog ölçü → factory kopya → (nadiren) kullanıcı foam resize width/height → persist. normalizeModuleItemState tv/base/counter/flat-panel itemKey ve bazı ölçüleri yeniden yazar.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **6** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `counter`
- itemKey: `desk_banko_100`, `desk_banko_150`, `desk_banko_200`, `desk_banko_100_L`, `desk_banko_150_L`, `desk_banko_200_L`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **6**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Evet — `modules[]` nesnesinin parçası. `saveProject` şemasız put. Load `cloneProjectState`.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

Etkiler: snap, collision, side insert, short-up joint, L rotasyon, overlay mount. Ayrıntı `src/modulePlacement.js` + `getModuleBehavior`.

## BOM / composition etkisi

yok.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `state`
- kaynak: Item + factory; TV için `resolveWallMediaMetrics`.

## Değiştirmenin yan etkileri

Yüzey/ışık/foam state değişince renderer ve persist blob güncellenir; BOM değişmez.

## CRUD sınıflandırması

SYSTEM_INTERNAL

## CRUD gerekçesi

Factory `modules[]` state kopyası. Kullanıcı bu id'yi ayrı formda değiştirmez (ölçü/itemKey type kimliği). Placement ayrı `placement` alanındadır ve bu 188 sütunda yoktur.

## Kanıt

- src dosya sayısı (unique): **10**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/moduleBehavior.js`, `src/moduleRecipes.js`, `src/scene3d.js`, `src/main.js`, `src/moduleMove.js`, `src/modulePlacement.js`, `src/rawBomDebug.js`

- `src/items.js` (dosya düzeyi) :581 [write-or-literal]
- `src/items.js` (dosya düzeyi) :587 [define]
- `src/designState.js` `resolveCounterItemKey` :278 [read]
- `src/designState.js` `resolveCounterItemKey` :279 [write-or-literal]
- `src/designState.js` `createCounterModuleState` :292 [read]
- `src/designState.js` `if` :302 [read]
- `src/catalog.js` `createCounterCatalogItem` :53 [read]
- `src/catalog.js` `optionalNumber` :470 [read]
- `src/catalog.js` `shapesMatch` :471 [read]
- `src/catalog.js` `normalizeCatalogDescriptor` :489 [write-or-literal]
- `src/catalog.js` `if` :516 [read]
- `src/moduleBehavior.js` `if` :230 [read]
- `src/moduleRecipes.js` (dosya düzeyi) :142 [write-or-literal]
- `src/moduleRecipes.js` `getModuleRecipe` :197 [read]
- `src/scene3d.js` `pickModuleContext` :1810 [write-or-literal]
- `src/scene3d.js` `if` :1893 [read]
- `src/scene3d.js` `rotateSelectedModule` :2267 [write-or-literal]
- `src/scene3d.js` `getFreeTvPlacement` :2300 [write-or-literal]
- `src/scene3d.js` `if` :2459 [write-or-literal]
- `src/scene3d.js` `if` :4752 [write]
- `src/scene3d.js` `roundedRectShape` :5501 [write]
- `src/scene3d.js` `roundedRectShape` :5505 [read]
- `src/scene3d.js` `createCounterModule` :6602 [read]
- `src/scene3d.js` `for` :7529 [write-or-literal]
- `src/main.js` `for` :681 [write-or-literal]
- `src/moduleMove.js` `if` :186 [write-or-literal]
- `src/modulePlacement.js` `isLCounterModule` :241 [read]
- `src/modulePlacement.js` `createLocalSegment` :295 [write]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :565 [write]
- `src/modulePlacement.js` `validatePlacementAgainstModules` :590 [read]
- `src/modulePlacement.js` `snapPlacementToModules` :810 [write]
- `src/modulePlacement.js` `addCandidate` :898 [read]
- `src/modulePlacement.js` `if` :1582 [write-or-literal]
- `src/rawBomDebug.js` `parseLCounterSelection` :22 [write-or-literal]
- `test/counterTopsItemContract.test.js` (dosya düzeyi) :17 [test]
- `test/counterTopsItemContract.test.js` `for` :56 [test]
- `test/deskBankoItemsContract.test.js` (dosya düzeyi) :26 [test]
- `test/deskBankoItemsContract.test.js` `if` :88 [test]
- `test/lCounter100Contract.test.js` (dosya düzeyi) :8 [test]
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
- `test/rectImageLayout.test.js` `for` :64 [test]
- `test/straightPanelsItemContract.test.js` (dosya düzeyi) :12 [test]
- `test/systemDevelopmentContract.test.js` `for` :71 [test]
- `test/systemImpactAnalysis.test.js` (dosya düzeyi) :157 [test]
- `test/upright3465ItemContract.test.js` `listAllVerifiedRecipes` :27 [test]
- `test/upright99And495ItemContract.test.js` (dosya düzeyi) :16 [test]
- `e2e/desk-banko-items-contract.spec.mjs` `saveAndReadProject` :77 [test]

- indeks: 133 / 188
